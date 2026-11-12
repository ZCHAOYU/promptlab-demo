'use strict';
/* 端到端演示：同一个角色，三种输入 → 三张不同的脸（看最终输出句子，不是看中间变量） */
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

const SET = [
  ['一位刺客',                  '平静日常'],
  ['一位刺客在屋脊上迎敌厮杀',    '行动中'],
  ['一位刺客独坐窗边出神',        '静谧独处'],
  ['一位女帝',                  '平静日常'],
  ['一位女帝迎敌厮杀',            '行动中'],
  ['一位女帝独坐窗边出神',        '静谧独处']
];

for (const [text, label] of SET) {
  const j = JSON.parse(vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'return JSON.stringify({sit:pickSituation(d,' + JSON.stringify(text) + '),s:s});})()', ctx));
  // 只截到第一个句号，方便看脸
  const head = j.s.split('。')[0];
  console.log(`【${label}】情境=${j.sit}  ${text}`);
  console.log('   ' + head + '。');
  console.log('');
}
