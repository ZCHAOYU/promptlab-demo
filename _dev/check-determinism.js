'use strict';
/* 确定性核查：同一输入连跑 5 次，看 fills 和最终输出到底变不变。
   之前我在审计里写过「同一输入 5 次 → 1 种输出」，但换个输入可能不是。
   用法：node _dev/check-determinism.js */
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

function run(text, mode, depth) {
  return JSON.parse(vm.runInContext(
    '(function(){currentMode=' + JSON.stringify(mode) + ';' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,' + JSON.stringify(depth) + ',d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'return JSON.stringify({fills:[f.lighting,f.color,f.atmosphere,f.composition,f.style,f.quality],s:s});})()', ctx));
}

const CASES = ['一位剑修，白衣黑发', '一座废弃的教堂，藤蔓爬满石墙', '一盏铜制的老式台灯，暖黄灯光'];
for (const t of CASES) {
  const outs = {}, fillSets = {};
  for (let i = 0; i < 5; i++) {
    const r = run(t, 'character', 'standard');
    outs[r.s] = 1;
    fillSets[r.fills.join('|')] = 1;
  }
  console.log(`「${t}」`);
  console.log(`  输出 ${Object.keys(outs).length} 种 / fills ${Object.keys(fillSets).length} 种`);
  Object.keys(fillSets).forEach(function (k) { console.log(`    ${k}`); });
  console.log('');
}
