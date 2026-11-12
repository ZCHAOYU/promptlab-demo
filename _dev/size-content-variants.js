'use strict';
/* 量「内容层变体」的真实工作量：
   1. smartFill 里每个维度现在靠哪张表决定，表有多长
   2. 320 个风格里有多少能命中，多少落到兜底
   3. 要覆盖的话，一共需要多少组「兼容候选」
   用法：node _dev/size-content-variants.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

const src = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

// ---- 1. 找出 smartFill 里那些 xxxByStyle 表，数它们有多少键 ----
console.log('=== smartFill 里的映射表 ===');
const tableRe = /const (\w+ByStyle) = \{([\s\S]*?)\n    \};/g;
let m;
const tables = {};
while ((m = tableRe.exec(src))) {
  const name = m[1];
  const body = m[2];
  const keys = (body.match(/'\s*[^']+'\s*:/g) || []).length;
  tables[name] = keys;
  console.log(`  ${name.padEnd(20)} ${keys} 个键`);
}

// ---- 2. 兜底值是什么 ----
console.log('\n=== 兜底（表里没这个风格时用的值）===');
const fbRe = /fills\.(\w+) = \w+ByStyle\[fills\.style\] \|\| '([^']+)'/g;
const fallbacks = {};
while ((m = fbRe.exec(src))) {
  fallbacks[m[1]] = m[2];
  console.log(`  ${m[1].padEnd(12)} → '${m[2]}'`);
}
const fbRe2 = /fills\.(\w+) = '([^']+)';/g;
while ((m = fbRe2.exec(src))) {
  if (!fallbacks[m[1]]) {
    fallbacks[m[1]] = m[2];
    console.log(`  ${m[1].padEnd(12)} → '${m[2]}'（固定）`);
  }
}

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

// ---- 3. 逐风格看每个维度是「命中」还是「兜底」 ----
const styles = JSON.parse(vm.runInContext(
  "JSON.stringify(Object.keys(KW_DB.style.categories))", ctx));
const pools = {};
['lighting', 'composition', 'color', 'atmosphere', 'quality'].forEach(function (d) {
  pools[d] = JSON.parse(vm.runInContext(
    `JSON.stringify(Object.keys(KW_DB.${d}.categories))`, ctx));
});

// 直接读 app.js 里的表对象（在 vm 作用域里取不到 const，改成解析文本重建）
function keysOf(name) {
  const re = new RegExp('const ' + name + ' = \\{([\\s\\S]*?)\\n    \\};');
  const mm = src.match(re);
  if (!mm) return new Set();
  const ks = (mm[1].match(/'([^']+)'\s*:/g) || []).map(function (s) {
    return s.replace(/[':]/g, '').trim();
  });
  return new Set(ks);
}
const LIT = keysOf('lightingByStyle');
const ATMO = keysOf('atmoByStyle');
const CHAR = keysOf('charByStyle');

console.log('\n=== 320 个风格里，各维度能不能命中表 ===');
const rows = [
  ['光线 lightingByStyle', LIT, 'lighting'],
  ['氛围 atmoByStyle', ATMO, 'atmosphere'],
  ['角色 charByStyle', CHAR, null]
];
rows.forEach(function ([label, set, pool]) {
  const hit = styles.filter(s => set.has(s)).length;
  console.log(`  ${label.padEnd(22)} 命中 ${hit} / ${styles.length}，兜底 ${styles.length - hit}`);
});

console.log('\n=== 需要产出多少组兼容候选 ===');
console.log(`  风格 320 × 4 个维度（光/色/氛围/构图）= ${320 * 4} 组`);
console.log('  每组 2~3 个候选，且候选必须在该维度现有池子里：');
['lighting', 'color', 'atmosphere', 'composition'].forEach(function (d) {
  console.log(`    ${d.padEnd(12)} 池子 ${pools[d].length} 条可选`);
});
