'use strict';
/* 检查 KW_DB 角色条目的真实字段（是否带 zh），决定新条目要写哪些字段 */
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

const c = vm.runInContext('KW_DB.character.categories["剑客"]', ctx);
console.log('剑客 字段:', Object.keys(c).join(', '));
console.log('带 zh 吗:', !!c.zh);
if (c.zh) console.log('  zh.core =', c.zh.core);

/* 中文翻译表的变量名是什么 */
const names = vm.runInContext(`
(function(){
  var out = [];
  for (var k in window) {
    if (/Translation|TRANSLATION/.test(k)) out.push(k + ':' + (typeof window[k]));
  }
  return JSON.stringify(out);
})()`, ctx);
console.log('\n全局里的翻译表:', names);

/* roleTranslations 里有没有「老人」 */
const has = vm.runInContext(
  'typeof roleTranslations !== "undefined" ? JSON.stringify({ has: !!roleTranslations["老人"], n: Object.keys(roleTranslations).length }) : "无 roleTranslations"', ctx);
console.log('roleTranslations:', has);
