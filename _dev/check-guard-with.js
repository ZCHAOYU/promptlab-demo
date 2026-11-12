'use strict';
/* 用指定版本跑「弹窗守卫」9 条用例，用来判断某个 FAIL 是今天改坏的还是本来就坏。
   用法：node _dev/check-guard-with.js _archive/app.before-faces.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const APP = process.argv[2] || 'app.js';

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
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const files = ['translations.js', 'smart-engine.js', 'data-kwdb.js',
  'archive-detail.js', 'archive-slots.js', 'archive-fix.js'];
for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const appPath = path.isAbsolute(APP) ? APP : path.join(ROOT, APP);
vm.runInContext(fs.readFileSync(appPath, 'utf8'), ctx, { filename: path.basename(appPath) });

console.log('用版本：' + APP);
const CASES = ['你好', '老人', '一个老人', '一位老人', '一位少女',
  '一片竹林', '一位剑客', '一位手持法杖的魔法师', '街角咖啡馆'];
let gated = 0;
for (const t of CASES) {
  const j = JSON.parse(vm.runInContext(
    '(function(){var x=detectDimensions(' + JSON.stringify(t) + ',"character");' +
    'return JSON.stringify({c:x.character&&x.character.detected||null,s:x.scene&&x.scene.detected||null});})()', ctx));
  const willModal = !j.c && !j.s;
  if (willModal) gated++;
  console.log(`${willModal ? '弹窗' : '生成'}  「${t}」  角色=${j.c || '—'}  场景=${j.s || '—'}`);
}
console.log(`\n共 ${CASES.length} 条，弹窗 ${gated} 条`);
