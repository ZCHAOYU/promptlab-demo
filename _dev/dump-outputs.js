'use strict';
/* 导出当前输出，用于改动前后对照
   用法：node dump-outputs.js before|after */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const TAG = process.argv[2] || 'before';

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
  ['一位白衣剑客', 'character'],
  ['竹林深处的剑客', 'character'],
  ['一位老人坐在长椅上', 'character'],
  ['一把生锈的长剑', 'prop'],
  ['一盏纸灯笼', 'prop'],
  ['一片竹林', 'scene'],
  ['雨夜的霓虹街道', 'scene']
];

const out = [];
for (const [text, mode] of CASES) {
  const r = vm.runInContext(
    '(function(){' +
    'currentMode=' + JSON.stringify(mode) + ';' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'var dims=[];for(var k in f){if(f[k])dims.push(k+"="+f[k]);}' +
    'return JSON.stringify({text:' + JSON.stringify(text) + ',mode:' + JSON.stringify(mode) + ',s:s,dims:dims});})()', ctx);
  const j = JSON.parse(r);
  out.push(j);
  console.log('【' + j.mode + '】' + j.text);
  console.log('  维度: ' + j.dims.join(' '));
  console.log('  输出: ' + j.s);
  console.log('');
}
const p = path.join(__dirname, 'outputs-' + TAG + '.json');
fs.writeFileSync(p, JSON.stringify(out, null, 2), 'utf8');
console.log('已保存 → ' + p);
