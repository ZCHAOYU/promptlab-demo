'use strict';
/* 连接词变体上线后，人工过目：只看句尾那一段，检查有没有读不通的。
   用法：node _dev/sample-tail.js */
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

function gen(text, mode, depth) {
  return vm.runInContext(
    '(function(){currentMode=' + JSON.stringify(mode) + ';' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,' + JSON.stringify(depth) + ',d);' +
    'return typeof o==="string"?o:(o&&o.optimized)||"";})()', ctx);
}

const CASES = [
  ['一位剑修，白衣黑发', 'character'],
  ['一位女帝端坐金殿', 'character'],
  ['一座哥特城堡，雨夜，雷电', 'scene'],
  ['一片竹林，清晨', 'scene'],
  ['一把生锈的长剑，插在石头上', 'prop'],
  ['一盏铜制的老式台灯', 'prop'],
  ['一位赛博格黑客，义眼发光', 'character'],
  ['一间街角咖啡馆，午后斜阳', 'scene']
];

for (const [text, mode] of CASES) {
  for (const depth of ['standard', 'deep']) {
    let out = '';
    try { out = gen(text, mode, depth); } catch (e) { out = '失败: ' + e.message; }
    // 只显示最后两小段（连接词都在那里）
    const parts = out.split('，');
    const tail = parts.slice(-5).join('，');
    console.log(`[${mode}/${depth}] 「${text}」`);
    console.log(`   …${tail}`);
    console.log('');
  }
}
