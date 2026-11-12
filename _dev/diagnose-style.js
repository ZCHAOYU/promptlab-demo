'use strict';
/* 诊断：风格是怎么来的 —— 检测命中 还是 补全 */
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

const CASES = [
  '古旧的机械怀表',
  '一把生锈的长剑',
  '一台复古收音机',
  '一座未来主义的城市',
  '一把未来感的光剑',
  '一位古风剑客',
  '一盏纸灯笼',
  '一块老式怀表'
];
CASES.forEach(function (t) {
  const r = vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(t) + ',detectDimensions(' + JSON.stringify(t) + ',"character"));' +
    'var d=detectDimensions(' + JSON.stringify(t) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(t) + ');' +
    'return JSON.stringify({mode:m,' +
    'detStyle:(d.style&&d.style.detected)||"",' +
    'fillStyle:f.style||"",' +
    'styleSrc:(d.style&&d.style.keywords||[]).join("+")});})()', ctx);
  const j = JSON.parse(r);
  console.log(t);
  console.log('   模式=' + j.mode + '  检测风格=' + (j.detStyle || '（无）') +
    '  最终风格=' + (j.fillStyle || '（无）') + '  来源=' + (j.styleSrc || '补全'));
});
