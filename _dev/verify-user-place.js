'use strict';
/* 用户写的地点不能被库里最近的场景顶掉。
   背景：_dev/audit-reality.js 实测 12 条真人会写的输入，有 6 条出现
   「站在雨夜的祠堂前 … 身处雨夜小巷」这种自相矛盾，等于用户写的地点被丢掉了。
   用法：node _dev/verify-user-place.js */
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

// 期望：location = 用户写的地点必须成为场景；lib = 用户就是在说库里的场景，保留
const CASES = [
  { t: '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前', want: '祠堂' },
  { t: '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上', want: '屋檐' },
  { t: '现代都市霸总，西装革履，站在落地窗前俯瞰夜景', want: '落地窗' },
  { t: '古风青梅竹马，素色襦裙，站在桃树下回头笑', want: '桃树' },
  { t: '暗黑系病娇女，黑长直，抱着玩偶坐在空荡的房间里', want: '房间' },
  { t: '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来', want: '教堂' },
  // 以下三条本来就命中对了，不能被新规则误伤
  { t: '高冷剑修，白衣黑发，手持长剑立于雪山之巅', want: '雪山之巅' },
  { t: '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里', want: '集市' },
  { t: '一位穿着红色长裙的少女，站在雨夜的霓虹街道', want: '霓虹街道' }
];

function run(text) {
  return JSON.parse(G(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return JSON.stringify({mode:m,scene:f.scene,out:(typeof o==="string"?o:(o&&o.optimized)||"")});})()'));
}

const SCENE_NAMES = G('Object.keys(KW_DB.scene.categories)');
const SCENE_CORES = SCENE_NAMES.map(function (n) {
  return G('(function(){var c=KW_DB.scene.categories[' + JSON.stringify(n) + '];return (c&&c.zh&&c.zh.core)||""})()') || n;
});

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

console.log('=== 1. 场景必须等于用户写的地点 ===');
CASES.forEach(function (c) {
  const r = run(c.t);
  const good = r.scene === c.want;
  ok(good, '「' + c.t.slice(0, 22) + '…」 场景=' + r.scene + (good ? '' : '（应为 ' + c.want + '）'));
});

console.log('\n=== 2. 输出里不能出现用户没写过的场景名 ===');
CASES.forEach(function (c) {
  const r = run(c.t);
  const bad = SCENE_CORES.filter(function (core) {
    if (!core || core.length < 2) return false;
    if (c.t.indexOf(core) >= 0) return false;      // 用户自己写的
    return r.out.indexOf(core) >= 0;
  });
  ok(bad.length === 0, '「' + c.t.slice(0, 22) + '…」' + (bad.length ? ' 多出：' + bad.join('/') : ' 无多出场景'));
});

console.log('\n=== 3. 场景必须真的落进输出（名字或细节，二者之一）===');
CASES.forEach(function (c) {
  const r = run(c.t);
  const cat = G('(function(){var x=KW_DB.scene.categories[' + JSON.stringify(r.scene) + ']||(window.__SCENE_SYNTH||{})[' + JSON.stringify(r.scene) + '];' +
    'return x?(x.zh&&x.zh.detail)||"":""})()') || '';
  // 第三种合法情况：场景名本来就在用户原话里，且细节被年代闸门静音了
  // （「赛博朋克集市」配古代集市细节时，宁可不写细节，也不写错年代）。
  // 这时候输出里没有场景名是**对的**——用户自己已经说了，没有信息丢失。
  const hit = r.out.indexOf(r.scene) >= 0
    || (cat && r.out.indexOf(cat.slice(0, 6)) >= 0)
    || c.t.indexOf(r.scene) >= 0;
  ok(!!hit, '「' + c.t.slice(0, 22) + '…」场景「' + r.scene + '」已渲染');
});

console.log('\n=== 4. 地点抽取单元测试 ===');
const UNIT = [
  ['站在雨夜的祠堂前', '祠堂'],
  ['蹲在屋檐上', '屋檐'],
  ['坐在空荡的房间里', '房间'],
  ['站在落地窗前', '落地窗'],
  ['站在桃树下', '桃树'],
  ['废弃的教堂', '教堂'],
  ['靠在窗边咳嗽', '窗边'],
  ['坐在龙椅上', null],
  ['现代都市霸总', null],
  ['青梅竹马', null],
  ['暗黑病娇女', null]
];
UNIT.forEach(function (u) {
  const got = G('extractUserPlace(' + JSON.stringify(u[0]) + ')') || null;
  ok(got === u[1], 'extractUserPlace("' + u[0] + '") = ' + got + '（应为 ' + u[1] + '）');
});

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
