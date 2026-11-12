'use strict';
/* 看看构图/光线/画质这几维的类别名到底长什么样，用来挑得体的连接词。
   用法：node _dev/list-cores.js */
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

['composition', 'lighting', 'color', 'atmosphere', 'quality', 'style'].forEach(function (dim) {
  const list = vm.runInContext(
    '(function(){var o=[];var c=(KW_DB.' + dim + '||{}).categories||{};' +
    'for(var k in c){o.push(k);}return JSON.stringify(o);})()', ctx);
  const names = JSON.parse(list);
  const ends = {};
  names.forEach(function (n) {
    const t = n.slice(-1);
    ends[t] = (ends[t] || 0) + 1;
  });
  const topEnds = Object.keys(ends).sort(function (a, b) { return ends[b] - ends[a]; })
    .slice(0, 6).map(function (k) { return k + '×' + ends[k]; }).join(' ');
  console.log(`${dim}（${names.length} 条）末字分布：${topEnds}`);
  console.log('   ' + names.slice(0, 14).join('、'));
  console.log('');
});
