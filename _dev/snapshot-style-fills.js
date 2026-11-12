'use strict';
/* 给 320 个风格各生成一次 fills，存成快照，用来验证重构「没改坏已有映射」。
   用法：
     node _dev/snapshot-style-fills.js _dev/fills-before.json
     node _dev/snapshot-style-fills.js _dev/fills-after.json --diff _dev/fills-before.json
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, click() {}, remove() {}
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() {}, execCommand() { return true; }
};
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });

// 用「一位剑客，<风格名>」喂进去，让风格走真实检测路径
const styles = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(KW_DB.style.categories))', ctx));
const snap = {};
const notDetected = [];
styles.forEach(function (s) {
  const text = '一位剑客，' + s;
  const r = JSON.parse(vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'return JSON.stringify({det:(d.style&&d.style.detected)||null,' +
    'lighting:f.lighting||null,color:f.color||null,atmosphere:f.atmosphere||null,scene:f.scene||null});})()', ctx));
  if (r.det !== s) notDetected.push(`${s} → 实际检测成 ${r.det}`);
  snap[s] = { lighting: r.lighting, color: r.color, atmosphere: r.atmosphere, scene: r.scene };
});

const outFile = process.argv[2] || '_dev/fills-snapshot.json';
fs.writeFileSync(path.join(ROOT, outFile), JSON.stringify(snap, null, 1), 'utf8');
console.log(`已写出 ${outFile}（${Object.keys(snap).length} 个风格）`);
if (notDetected.length) {
  console.log(`\n⚠ 有 ${notDetected.length} 个风格名没能被检测成自身（快照对它们无意义）：`);
  notDetected.slice(0, 10).forEach(x => console.log('   ' + x));
}

// ---- 对比模式 ----
const di = process.argv.indexOf('--diff');
if (di >= 0) {
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, process.argv[di + 1]), 'utf8'));
  const changed = [];
  Object.keys(snap).forEach(function (s) {
    const a = base[s] || {};
    const b = snap[s] || {};
    if (JSON.stringify(a) !== JSON.stringify(b)) changed.push({ style: s, before: a, after: b });
  });
  const added = Object.keys(snap).filter(s => !base[s]);
  console.log(`\n=== 与 ${process.argv[di + 1]} 对比 ===`);
  console.log(`  有变化 ${changed.length} 个风格，新增 ${added.length} 个`);
  const FIELDS = ['lighting', 'color', 'atmosphere', 'scene'];
  const onlyNewMapping = changed.filter(function (c) {
    // 允许的变化：原来是兜底值、现在变成具体值
    return FIELDS.some(function (f) {
      return c.before[f] !== c.after[f];
    });
  });
  console.log(`  其中 fills 有差异的 ${onlyNewMapping.length} 个（前 15 条）：`);
  onlyNewMapping.slice(0, 15).forEach(function (c) {
    const diff = FIELDS.filter(f => c.before[f] !== c.after[f])
      .map(f => `${f}: ${c.before[f]} → ${c.after[f]}`).join('  ');
    console.log(`    ${c.style}: ${diff}`);
  });
}
