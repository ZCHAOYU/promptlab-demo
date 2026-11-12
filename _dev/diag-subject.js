'use strict';
/* 认错主体溯源：打印角色维度的命中关键词，看是哪个词触发的。
   用法：node _dev/diag-subject.js */
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
  '龙傲天', '机械姬', '皮影艺人',
  '龙傲天，黑衣金纹长袍，站在大殿之上',
  '机械姬，银色义体，站在霓虹街头',
  '皮影艺人，枯瘦的手挑着竹签',
  '龙族骑士，黑龙鳞甲',
  '机械工程师，油污工装',
  '皮影戏艺人，灯火下操纵皮影',
  '龙', '机械师', '忍者'
];

console.log('输入 | 模式 | 角色 | 命中词 | 性别 | 完整 detected');
console.log('-'.repeat(90));
CASES.forEach(function (text) {
  const r = JSON.parse(G(
    '(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',d);' +
    'var det={};Object.keys(d).forEach(function(k){if(d[k]&&d[k].detected)det[k]=d[k].detected+"["+(d[k].keywords||[]).join("+")+"]";});' +
    'return JSON.stringify({ch:d.character.detected,kw:d.character.keywords,m:m,g:d.gender&&d.gender.detected,det:det});})()'));
  console.log([text, r.m, r.ch || '(无)', (r.kw || []).join('+'), r.g || '-', JSON.stringify(r.det)].join(' | '));
});
