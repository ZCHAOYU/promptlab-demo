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
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });

const texts = ['一位剑客，阿拉伯书法', '阿拉伯书法', '一位剑客，暗黑童话'];
texts.forEach(function (t) {
  const r = vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(t) + ');' +
    'var det={};Object.keys(d).forEach(function(k){if(d[k]&&d[k].detected)det[k]=d[k].detected;});' +
    'return JSON.stringify({det:det,fills:f});})()', ctx);
  const o = JSON.parse(r);
  console.log(`\n「${t}」`);
  console.log('  检测到的维度:', JSON.stringify(o.det));
  const filled = Object.keys(o.fills).filter(k => o.fills[k]);
  console.log(`  fills 非空 ${filled.length} 个:`, JSON.stringify(o.fills));
  // 手工复现 styleDefault 那一步
  const step = vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
    'var s=d.style&&d.style.detected?d.style.detected:null;' +
    'return JSON.stringify({style:s, defaultLighting:styleDefault("lighting",s,"电影级侧光"),' +
    'detLighting:(d.lighting&&d.lighting.detected)||null});})()', ctx);
  console.log('  styleDefault 那一步:', step);
});
