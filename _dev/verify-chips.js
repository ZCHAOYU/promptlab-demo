'use strict';
/* 检查弹窗示例词是否都能被识别（不能再给“点了也没用”的示例） */
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
  ['一位老人', 'character'], ['一位剑客', 'character'], ['一位魔法师', 'character'],
  ['一只猫', 'character'], ['一位少女', 'character'], ['一位旅人', 'character'],
  ['一片竹林', 'scene'], ['一座哥特城堡', 'scene'], ['一条赛博街区', 'scene'],
  ['一间街角咖啡馆', 'scene'], ['一片樱花林', 'scene'],
  ['一把长剑', 'prop'], ['一盏灯笼', 'prop']
];

console.log('=== 弹窗示例候选检测 ===');
for (const [t, mode] of CASES) {
  const out = vm.runInContext(
    '(function(){var x=detectDimensions(' + JSON.stringify(t) + ',' + JSON.stringify(mode) + ');' +
    'var o=[];["character","scene","style","material"].forEach(function(d){' +
    'if(x[d]&&x[d].detected)o.push(d+"="+x[d].detected);});return o.join(" ");})()', ctx);
  const looksProp = out.indexOf('material=') >= 0;
  const ok = out && !(mode === 'character' && !/character=/.test(out));
  console.log((ok ? '  OK   ' : '  FAIL ') + '「' + t + '」(' + mode + ') → ' + (out || '未识别'));
}
