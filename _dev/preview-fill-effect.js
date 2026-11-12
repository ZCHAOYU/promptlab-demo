'use strict';
/* 把生成的描述注入 KW_DB，对比「有描述 vs 没描述」的输出差异 */
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
  fetch: async () => { throw new Error('x'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'archive-slots.js','archive-fix.js','app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}

const preview = JSON.parse(fs.readFileSync(path.join(__dirname, 'archive-fill-preview.json'), 'utf8'));
const MAP = { scene: 'scene', composition: 'composition', color: 'color', light: 'lighting', atmosphere: 'atmosphere', quality: 'quality' };

const CASES = ['海底世界', '冰原', '酒窖', '银河', '矿山'];

function build(text) {
  return vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify('character') + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return typeof o==="string"?o:(o&&o.optimized)||"";})()', ctx);
}

console.log('=== 补描述前 ===');
const before = {};
CASES.forEach(function (t) { before[t] = build(t); console.log(t + '：' + before[t]); });

/* 注入描述 */
preview.forEach(function (p) {
  const kw = MAP[p.kind];
  if (!kw || !p.desc) return;
  vm.runInContext(
    '(function(){var c=KW_DB[' + JSON.stringify(kw) + '].categories[' + JSON.stringify(p.name) + '];' +
    'if(c&&c.zh){c.zh.detail=' + JSON.stringify(p.desc) + ';}})()', ctx);
});

console.log('\n=== 补描述后 ===');
CASES.forEach(function (t) {
  const after = build(t);
  console.log(t + '：' + after);
  if (after === before[t]) console.log('  （无变化）');
  console.log('');
});
