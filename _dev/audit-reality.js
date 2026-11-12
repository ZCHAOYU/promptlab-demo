'use strict';
/* 现状体检：拿真实漫剧输入跑一遍，机械统计「明显不对」的几类问题。
   不是替代人工判断，而是给出一个有依据的坏例计数。
   用法：node _dev/audit-reality.js */
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

const CASES = [
  '银发红瞳的病娇少年，穿着黑色高领长袍，站在雨夜的祠堂前',
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上',
  '白发病弱少年，裹着厚披风靠在窗边咳嗽',
  '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上',
  '现代都市霸总，西装革履，站在落地窗前俯瞰夜景',
  '古风青梅竹马，素色襦裙，站在桃树下回头笑',
  '暗黑系病娇女，黑长直，抱着玩偶坐在空荡的房间里',
  '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里',
  '一位穿着红色长裙的少女，站在雨夜的霓虹街道',
  '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来',
  '一把生锈的长剑，插在石头上，周围全是枯草'
];

const rows = [];
CASES.forEach(function (text) {
  const r = JSON.parse(vm.runInContext(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'var det={};Object.keys(d).forEach(function(k){if(d[k]&&d[k].detected)det[k]=d[k].detected;});' +
    'return JSON.stringify({mode:m,det:det,fills:{lighting:f.lighting,color:f.color,' +
    'atmosphere:f.atmosphere,scene:f.scene,style:f.style,character:f.character},' +
    'out:(typeof o==="string"?o:(o&&o.optimized)||"")});})()', ctx));

  const flags = [];
  // 1. 主体或场景被裁空
  if (r.mode === 'character' && !r.fills.lighting) flags.push('光照被裁空');
  if (r.mode === 'character' && !r.fills.color) flags.push('色彩被裁空');
  // 2. 用户写了地点，但场景检测成了别的
  const placeWords = text.match(/祠堂|大殿|雪山|屋檐|落地窗|桃树|房间|集市|街道|教堂|石头上/g) || [];
  if (r.fills.scene && placeWords.length) {
    const hit = placeWords.some(function (w) { return r.fills.scene.indexOf(w) >= 0; });
    if (!hit) flags.push(`场景「${r.fills.scene}」和用户说的${placeWords.join('/')}不符`);
  }
  // 3. 场景描述里出现"另一种主体"的迹象（粗略）
  if (/一位|一个/.test(text) && r.fills.scene && r.mode !== 'scene') {
    // 人物输入但场景带详细描写 -> 可能是场景抢了主体
  }
  rows.push({ text, mode: r.mode, det: r.det, fills: r.fills, flags });
});

let flagged = 0;
rows.forEach(function (r, i) {
  const ok = r.flags.length === 0;
  if (!ok) flagged++;
  console.log(`${ok ? '○' : '✗'} #${i + 1} ${r.text}`);
  console.log(`     模式=${r.mode}  检测: ${Object.keys(r.det).map(k => k + '=' + r.det[k]).join(' ')}`);
  console.log(`     fills: 光=${r.fills.lighting} 色=${r.fills.color} 氛=${r.fills.atmosphere} 景=${r.fills.scene}`);
  r.flags.forEach(f => console.log(`     ⚠ ${f}`));
});
console.log(`\n== ${rows.length} 条里，机械可检测的问题 ${flagged} 条 ==`);
console.log('（只查「裁空 / 场景不符」两类，认错主体、姿势矛盾、语言生硬都查不出来，所以这是下限）');
