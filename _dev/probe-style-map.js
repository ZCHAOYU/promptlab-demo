'use strict';
/* A 步前期：查清「风格 → 光/色/氛围」到底缺多少，以及为什么 app.js 里有两套同名表。
   用法：node _dev/probe-style-map.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

const NAME = /const (lightingByStyle|colorByStyle|atmoByStyle|sceneByStyle|charByStyle) = \{([\s\S]*?)\n( +)\};/g;
let m;
const tables = [];
while ((m = NAME.exec(SRC))) {
  const line = SRC.slice(0, m.index).split('\n').length;
  const keys = (m[2].match(/'[^']+'\s*:/g) || []).map(s => s.replace(/[':]/g, '').trim());
  tables.push({ name: m[1], line: line, count: keys.length, keys: keys });
}
console.log('=== app.js 里所有 xxxByStyle 表 ===');
tables.forEach(function (t) {
  console.log(`  ${t.name.padEnd(16)} L${String(t.line).padEnd(6)} ${t.count} 个键`);
});

// ---- 取真实风格名单和各维度池子 ----
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

const styles = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(KW_DB.style.categories))', ctx));
const lighting = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(KW_DB.lighting.categories))', ctx));
const color = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(KW_DB.color.categories))', ctx));
const atmo = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(KW_DB.atmosphere.categories))', ctx));

console.log(`\n风格 ${styles.length} 条，光线池 ${lighting.length}，色彩池 ${color.length}，氛围池 ${atmo.length}`);

// ---- 哪些风格在哪些表里没有 ----
const LIT = new Set(tables.filter(t => t.name === 'lightingByStyle').flatMap(t => t.keys));
const COL = new Set(tables.filter(t => t.name === 'colorByStyle').flatMap(t => t.keys));
const ATM = new Set(tables.filter(t => t.name === 'atmoByStyle').flatMap(t => t.keys));

const missLit = styles.filter(s => !LIT.has(s));
const missCol = styles.filter(s => !COL.has(s));
const missAtm = styles.filter(s => !ATM.has(s));
console.log(`\n=== 缺口 ===`);
console.log(`  光线缺 ${missLit.length}`);
console.log(`  色彩缺 ${missCol.length}`);
console.log(`  氛围缺 ${missAtm.length}`);

const anyMiss = styles.filter(s => !LIT.has(s) || !COL.has(s) || !ATM.has(s));
console.log(`  至少缺一项 ${anyMiss.length} / ${styles.length}`);

// ---- 表里有、但风格库里没有的键（可能是改名残留 / 拼错）----
const styleSet = new Set(styles);
const stale = [];
['lightingByStyle', 'colorByStyle', 'atmoByStyle', 'sceneByStyle', 'charByStyle'].forEach(function (n) {
  tables.filter(t => t.name === n).forEach(function (t) {
    t.keys.forEach(function (k) { if (!styleSet.has(k)) stale.push(`${n}: ${k}`); });
  });
});
console.log(`\n=== 表里有但风格库没有的键（${stale.length}）===`);
stale.slice(0, 40).forEach(s => console.log('  ' + s));

// ---- 表里的值有没有不存在的（脏值）----
const pools = { lighting: new Set(lighting), color: new Set(color), atmosphere: new Set(atmo) };
const badValues = [];
tables.forEach(function (t) {
  const dim = t.name.replace('ByStyle', '');
  const pool = pools[dim];
  if (!pool) return;
  const re = /'([^']+)'\s*:\s*'([^']+)'/g;
  let mm;
  while ((mm = re.exec(SRC.slice(0, SRC.length)))) { /* 占位，下面单独遍历正文 */ }
});
function checkTable(t) {
  const dim = t.name.replace('ByStyle', '');
  const pool = pools[dim];
  if (!pool) return;
  const block = SRC.split('\n').slice(t.line - 1);
  let bad = 0;
  t.keys.forEach(function () { });
}
tables.forEach(function (t) {
  const dim = t.name.replace('ByStyle', '');
  if (!pools[dim]) return;
  // 重新从原文抠出这个块
  const re = new RegExp('const ' + t.name + ' = \\{([\\s\\S]*?)\\n( +)\\};');
  const mm = SRC.match(re);
  if (!mm) return;
  const pairs = mm[1].match(/'([^']+)'\s*:\s*'([^']+)'/g) || [];
  pairs.forEach(function (p) {
    const v = p.replace(/^'[^']+'\s*:\s*'/, '').replace(/'$/, '');
    if (!pools[dim].has(v)) badValues.push(`${t.name} → '${v}'`);
  });
});
console.log(`\n=== 表里的值不在池子里（脏值，${badValues.length}）===`);
badValues.slice(0, 30).forEach(s => console.log('  ' + s));

// ---- 导出待补清单 ----
const todo = anyMiss.map(function (s) {
  return {
    style: s,
    need: {
      lighting: LIT.has(s) ? null : true,
      color: COL.has(s) ? null : true,
      atmosphere: ATM.has(s) ? null : true
    }
  };
});
fs.writeFileSync(path.join(__dirname, 'style-map-todo.json'),
  JSON.stringify({ styles: styles, lighting: lighting, color: color, atmosphere: atmo, todo: todo }, null, 1), 'utf8');
console.log(`\n已写出 _dev/style-map-todo.json（${todo.length} 个待补风格 + 三个池子）`);
