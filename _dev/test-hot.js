'use strict';
/* 验证：同一角色在不同输入下，输出是否真的不同 */
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
const { loadApp } = require('./load-scripts');
// 加载清单统一来自 index.html，不再各自写死（否则新增脚本测试看不见）
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
console.log('变体覆盖角色数:', vm.runInContext('window.__roleVariantCount', ctx));

const GROUPS = [
  ['一个穿着铠甲的赛博朋克风格的机甲'],
  ['传说中的凤凰'],
  ['一只机械巨龙'],
  ['赛博朋克城市中的雨夜集市']
];

function build(text) {
  return vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'return JSON.stringify({sit:(typeof pickSituation==="function")?pickSituation(d,' + JSON.stringify(text) + '):"?",s:s});})()', ctx);
}

GROUPS.forEach(function (g) {
  console.log('\n=== ' + g[0] + ' ===');
  const outs = [];
  g.forEach(function (t) {
    const r = JSON.parse(build(t));
    outs.push(r.s);
    console.log('  「' + t + '」 情境=' + r.sit);
    console.log('    ' + r.s.slice(0, 110));
  });
  const uniq = new Set(outs);
  console.log('  → 输出: ' + outs[0].slice(0, 150));
});
