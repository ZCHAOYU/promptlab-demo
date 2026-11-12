'use strict';
/* 用热门漫剧的角色套路反向构造输入，检验真实输出 */
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

/* 按当前漫剧真实套路构造的输入 */
const INPUTS = [
  '银发红瞳的病娇少年，穿着黑色高领长袍，站在雨夜的祠堂前',
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上',
  '白发病弱少年，裹着厚披风靠在窗边咳嗽',
  '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上',
  '现代都市霸总，西装革履，站在落地窗前俯瞰夜景',
  '古风青梅竹马，素色襦裙，站在桃树下回头笑',
  '暗黑系病娇女，黑长直，抱着玩偶坐在空荡的房间里'
];

INPUTS.forEach(function (t, i) {
  const r = vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(t) + ',detectDimensions(' + JSON.stringify(t) + ',"character"));' +
    'var d=detectDimensions(' + JSON.stringify(t) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(t) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(t) + ',f,"standard",d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'var det=[];["character","scene","style","lighting","color","atmosphere"].forEach(function(k){' +
    'if(d[k]&&d[k].detected)det.push(k+"="+d[k].detected);});' +
    'return JSON.stringify({mode:m,det:det,s:s});})()', ctx);
  const j = JSON.parse(r);
  console.log('#' + (i + 1) + ' ' + t);
  console.log('  模式=' + j.mode + '  检测: ' + j.det.join('  '));
  console.log('  输出: ' + j.s);
  console.log('');
});
