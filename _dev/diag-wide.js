'use strict';
/* 临时：针对大样本体检里几条可疑输入做溯源 */
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

const CASES = [
  '一位穿着红色长裙的少女，站在雨夜的霓虹街道，手里拿着一把黑色的伞，头发被风吹起，眼神很冷漠',
  '女高中生放学回家',
  '老板发火',
  '帮我画只猫',
  '猫耳朵的女仆',
  '两个剑客在月下决斗',
  '末日废土的加油站，锈迹斑斑',
  '老年的渔夫，斗笠蓑衣，坐在乌篷船头'
];
CASES.forEach(function (text) {
  const r = JSON.parse(G(
    '(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',d);' +
    'var det={};Object.keys(d).forEach(function(k){if(d[k]&&d[k].detected)det[k]=d[k].detected+"["+(d[k].keywords||[]).join("+")+"]";});' +
    'var pn=extractUserPlace(' + JSON.stringify(text) + ');' +
    'var pn2=(String(' + JSON.stringify(text) + ').match(PERSON_NOUN_RE)||[])[0]||null;' +
    'currentMode=m;var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return JSON.stringify({m:m,det:det,place:pn,person:pn2,ch:f.character,scene:f.scene,' +
    'out:(typeof o==="string"?o:(o&&o.optimized)||"")});})()'));
  console.log('【' + text + '】');
  console.log('  模式=' + r.m + '  place=' + r.place + '  person否定=' + r.person + '  fills.character=' + r.ch + '  场景=' + r.scene);
  console.log('  det=' + JSON.stringify(r.det));
  console.log('  out=' + r.out.slice(0, 150));
  console.log('');
});
