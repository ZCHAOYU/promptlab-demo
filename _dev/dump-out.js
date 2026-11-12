'use strict';
/* 临时：打印几条输入的中文输出全文 */
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
const G = (e) => vm.runInContext(e, ctx);

const CASES = process.argv.slice(2).length ? process.argv.slice(2) : [
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里',
  '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前',
  '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上',
  '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来',
  '现代都市霸总，西装革履，站在落地窗前俯瞰夜景'
];
CASES.forEach(function (text) {
  const r = JSON.parse(G(
    '(function(){var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var fj={};Object.keys(f).forEach(function(k){if(f[k])fj[k]=f[k];});' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return JSON.stringify({scene:f.scene,fills:fj,out:(typeof o==="string"?o:(o&&o.optimized)||"")});})()'));
  console.log('【' + text + '】  scene=' + r.scene);
  console.log('  fills=' + JSON.stringify(r.fills));
  console.log(r.out);
  console.log('');
});
