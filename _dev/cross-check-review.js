'use strict';
/* 对照审阅结果：哪些用例在真实 UI 里会被强制弹窗拦下（基线绕过弹窗了） */
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

const cases = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline-cases.json'), 'utf8'));
const rv = JSON.parse(fs.readFileSync('D:/review-result.json', 'utf8'));
const ratings = rv.ratings || {};

console.log('序号 评分  真实UI是否弹窗  输入');
console.log('-'.repeat(78));
let modalCount = 0;
cases.forEach(function (c, i) {
  const r = (ratings['case-' + i] || {});
  const willModal = JSON.parse(vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(c.input) + ',detectDimensions(' + JSON.stringify(c.input) + ',"character"));' +
    'var d=detectDimensions(' + JSON.stringify(c.input) + ',m);' +
    'var noChar=!(d.character&&d.character.detected);' +
    'var noScene=!(d.scene&&d.scene.detected);' +
    'return JSON.stringify(m!=="prop" && noChar && noScene);})()', ctx));
  if (willModal) modalCount++;
  const flag = willModal ? '会弹窗' : '  —  ';
  console.log(
    String(i).padEnd(4) +
    (r.r || '-').padEnd(6) +
    flag.padEnd(15) +
    c.input);
  if (r.note && willModal) console.log('        └ 你的备注：' + r.note);
});
console.log('\n30 条里 ' + modalCount + ' 条在真实界面会被弹窗拦下（不会生成）');
