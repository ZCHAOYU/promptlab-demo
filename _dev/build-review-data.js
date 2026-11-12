'use strict';
/* 生成两套审阅数据：
   1) baseline-cases.json —— 30 条输入 + 当前输出（人工判好坏）
   2) archive-review.json —— 30 条随机档案（人工判描述是否成立）
*/
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
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'archive-slots.js','archive-fix.js','app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}

/* ---------- 1. 基线用例 ---------- */
const INPUTS = [
  '一位剑客',
  '一位白衣剑客',
  '一位老人',
  '一位少女',
  '一个孩童',
  '一位旅人',
  '一位手持法杖的魔法师',
  '一位老人坐在长椅上',
  '一位少女在东京现代街头手里拿着咖啡和一位朋友并行逛着街',
  '竹林深处的剑客',
  '雨夜中撑伞的女子',
  '一位穿宇航服的骑士',
  '一位量子程序员',
  '一只六足机械兽',
  '老人，一只猫',
  '一个从没见过的生物',
  '您好',
  '。',
  '一片竹林',
  '雨夜的霓虹街道',
  '一座哥特城堡',
  '街道尽头的旧书店',
  '一间洒满阳光的咖啡馆',
  '一把生锈的长剑',
  '一盏纸灯笼',
  '一杯热咖啡',
  '古旧的机械怀表',
  '一把刀的刀柄特写',
  'a knight standing in the rain',
  'cyberpunk city at night, neon lights'
];

const cases = [];
for (const text of INPUTS) {
  let out = '', dims = [], mode = '', err = '', gated = false;
  try {
    const expr = '(function(){' +
      'var pre=detectDimensions(' + JSON.stringify(text) + ',"character");' +
      'var m=inferSubjectType(' + JSON.stringify(text) + ',pre);' +
      // 与 optimize() 的守卫一致：主体认不出来时真实界面会弹窗，不会生成
      'var pre2=detectDimensions(' + JSON.stringify(text) + ',m);' +
      'if(m!=="prop" && !(pre2.character&&pre2.character.detected) && !(pre2.scene&&pre2.scene.detected)) return JSON.stringify({gated:true,mode:m});' +
      'currentMode=m;' +
      'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
      'var f=smartFill(d,' + JSON.stringify(text) + ');' +
      'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
      'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
      'var dd=[];for(var k in f){if(f[k])dd.push(k+"="+f[k]);}' +
      'return JSON.stringify({mode:m,s:s,dims:dd});})()';
    const r = JSON.parse(vm.runInContext(expr, ctx));
    if (r.gated) { gated = true; mode = r.mode; }
    else { out = r.s; dims = r.dims; mode = r.mode; }
  } catch (e) { err = e.message.split('\n')[0]; }
  cases.push({ input: text, mode: mode, output: out, dims: dims, error: err, gated: gated });
}

/* ---------- 2. 随机档案抽样 ---------- */
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));
const byKind = {};
entries.forEach(e => { (byKind[e.kind] = byKind[e.kind] || []).push(e); });

// 确定性伪随机，保证两次生成一致
let seed = 20261109;
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }

const PLAN = [
  ['role', 30], ['style', 15], ['scene', 20], ['color', 12],
  ['light', 10], ['atmosphere', 8], ['composition', 5]
];
const archives = [];
for (const [kind, n] of PLAN) {
  const pool = byKind[kind] || [];
  const picked = [];
  const used = {};
  let guard = 0;
  while (picked.length < n && guard < 500) {
    guard++;
    const i = Math.floor(rnd() * pool.length);
    if (used[i] || !pool[i]) continue;
    used[i] = 1;
    const e = pool[i];
    // entries.json 里 zh 是一个用「；」分隔的字符串，不是对象
    const zhStr = String(e.zh || '');
    const parts = zhStr.split('；').map(function (x) { return x.trim(); }).filter(Boolean);
    picked.push({
      kind: kind,
      name: e.name,
      core: parts[0] || '',
      face: parts[1] || '',
      pose: parts[2] || '',
      detail: parts[3] || '',
      mood: parts[4] || '',
      zhFull: zhStr
    });
  }
  archives.push.apply(archives, picked);
}

// 把 archive-detail.js 里新补的描述合进档案抽样，否则审阅页看不到这些新内容
try {
  const fillPath = path.join(__dirname, 'archive-fill-preview.json');
  if (fs.existsSync(fillPath)) {
    const filled = JSON.parse(fs.readFileSync(fillPath, 'utf8'));
    const byKey = {};
    filled.forEach(function (x) { if (x.desc) byKey[x.kind + '|' + x.name] = x.desc; });
    archives.forEach(function (a) {
      const d = byKey[a.kind + '|' + a.name];
      if (d) {
        a.detail = d;
        if (!a.zhFull || a.zhFull.split('；').filter(function (x) { return x.trim(); }).length <= 1) {
          a.zhFull = a.name + '；' + d;
        }
      }
    });
    console.log('已合并新描述:', archives.filter(function (a) { return a.detail; }).length, '条');
  }
} catch (e) { console.log('合并描述失败:', e.message); }

// 用运行时 KW_DB 覆盖档案内容（这样 archive-detail / archive-fix 的修正才会体现在审阅页）
const KIND2KW = { role: 'character', style: 'style', scene: 'scene', color: 'color',
  light: 'lighting', composition: 'composition', atmosphere: 'atmosphere', quality: 'quality' };
archives.forEach(function (a) {
  const kw = KIND2KW[a.kind];
  if (!kw) return;
  const rt = vm.runInContext(
    '(function(){var c=KW_DB[' + JSON.stringify(kw) + '] && KW_DB[' + JSON.stringify(kw) + '].categories[' +
    JSON.stringify(a.name) + '];if(!c||!c.zh)return null;' +
    'return JSON.stringify({core:c.zh.core,face:c.zh.face,pose:c.zh.pose,detail:c.zh.detail,mood:c.zh.mood});})()', ctx);
  if (!rt) return;
  let j;
  try { j = JSON.parse(rt); } catch (e) { return; }
  if (j.core) a.core = j.core;
  if (j.face) a.face = j.face;
  if (j.pose) a.pose = j.pose;
  if (j.detail) a.detail = j.detail;
  if (j.mood) a.mood = j.mood;
  const bits = [j.core, j.face, j.pose, j.detail, j.mood].filter(Boolean);
  if (bits.length) a.zhFull = bits.join('；');
});

fs.writeFileSync(path.join(__dirname, 'baseline-cases.json'), JSON.stringify(cases, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'archive-review.json'), JSON.stringify(archives, null, 2), 'utf8');

console.log('基线用例: ' + cases.length + ' 条（异常 ' + cases.filter(c => c.error).length + '）');
console.log('档案抽样: ' + archives.length + ' 条');
const byMode = {};
cases.forEach(c => { byMode[c.mode] = (byMode[c.mode] || 0) + 1; });
console.log('自动判定分布:', JSON.stringify(byMode));
