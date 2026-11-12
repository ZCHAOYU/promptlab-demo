'use strict';
/* 场景检测溯源：对每条输入，打印场景命中的层级与关键词。
   用法：node _dev/diag-scene.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild(c) { return c; }, setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; }, querySelector() { return mk(); },
    querySelectorAll() { return []; },
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

const CASES = [
  '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前',
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上',
  '白发病弱少年，裹着厚披风靠在窗边咳嗽',
  '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上',
  '现代都市霸总，西装革履，站在落地窗前俯瞰',
  '古风青梅竹马，素色襦裙，站在桃树下回头笑',
  '暗黑病娇女，黑长直，抱着玩偶坐在空荡的房间里',
  '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里',
  '一位穿着红色长裙的少女，站在雨夜的霓虹街道',
  '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来',
  '一把生锈的长剑，插在石头上，周围全是枯草'
];

console.log('输入 | 模式 | 场景 | 命中层 | 关键词 | 概念命中');
console.log('-'.repeat(100));
CASES.forEach(function (text) {
  const r = JSON.parse(vm.runInContext(
    '(function(){' +
    'var ch=detectConceptSemantics(' + JSON.stringify(text) + ');' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'return JSON.stringify({m:m,sc:d.scene.detected,kw:d.scene.keywords,ch:ch});})()', ctx));
  const layer = !r.sc ? '(无)' : (r.kw[0] === '概念' ? '概念层' : r.kw[0] === '物品' ? '物品层' : (r.ch && r.ch.scene === r.sc ? '概念层' : '关键词/词名'));
  console.log([text, r.m, r.sc || '(无)', layer, (r.kw || []).join(','), JSON.stringify(r.ch && r.ch.scene || '')].join(' | '));
});
