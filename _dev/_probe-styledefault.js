'use strict';
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
const loaded = loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
console.log('加载的文件:', loaded.join(' '));
console.log('__STYLE_DEFAULTS 是否存在:', vm.runInContext('typeof window.__STYLE_DEFAULTS', ctx));
console.log('styleDefault 是否存在:', vm.runInContext('typeof styleDefault', ctx));
console.log('直接调用:', vm.runInContext('styleDefault("lighting","阿拉伯书法","FALLBACK")', ctx));
console.log('D 里有这个键:', vm.runInContext('!!(window.__STYLE_DEFAULTS && window.__STYLE_DEFAULTS.lighting["阿拉伯书法"])', ctx));
console.log('smartFill 里的 fills.style 是否是阿拉伯书法:');
const r = vm.runInContext(
  '(function(){var t="一位剑客，阿拉伯书法";' +
  'var d=detectDimensions(t,"character");' +
  'var f=smartFill(d,t);' +
  'return JSON.stringify({style:f.style, lighting:f.lighting, looksLikeScene:(f.lighting===null)});})()', ctx);
console.log('  ', r);
