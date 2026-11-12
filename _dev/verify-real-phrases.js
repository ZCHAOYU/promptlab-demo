'use strict';
/* 收尾验证：剩余 4 条错配 + 真实句子回归 */
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

const res = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit-result.json'), 'utf8'));
console.log('=== 剩余错配 ' + res.rows.length + ' 条 ===');
res.rows.forEach(r => console.log('  [' + r.dim + '] 「' + r.name + '」→ ' + r.got));

console.log('\n=== 真实句子回归（昨天出问题的那几条）===');
const CASES = [
  ['一位白山剑客', 'character'],
  ['老人', 'character'],
  ['一个老人', 'character'],
  ['一位少女', 'character'],
  ['身披斗篷的旅人', 'character'],
  ['暗黑骑士', 'character'],
  ['一片樱花林', 'scene'],
  ['铁灰色的天空', 'character'],
  ['霓虹闪烁的赛博街区', 'scene'],
  ['一位手持法杖的魔法师', 'character']
];
for (const [t, mode] of CASES) {
  const out = vm.runInContext(
    '(function(){var x=detectDimensions(' + JSON.stringify(t) + ',' + JSON.stringify(mode) + ');' +
    'var o=[];["character","scene","style","lighting","color","atmosphere"].forEach(function(d){' +
    'if(x[d]&&x[d].detected)o.push(d+"="+x[d].detected);});return o.join("  ");})()', ctx);
  console.log('  「' + t + '」→ ' + (out || '（未识别）'));
}
