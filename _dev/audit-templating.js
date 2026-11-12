'use strict';
/* 「去模板化」到底做到什么程度 —— 用数字回答，不靠描述。
   三个指标：
     1. 开句形态分布：characterOpening 有 4 种模式，实际是不是均匀用上了？
     2. 结构同构率：不同角色的输出，用了同一套连接词组合的占多少？
     3. 连接词集中度：每个固定连接词（身着/身处/随身带着…）在多少条里出现。
   用法：node _dev/audit-templating.js */
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

// --app <文件>  用指定的 app.js 跑（用来对改动前后做同口径对比）
const ai = process.argv.indexOf('--app');
if (ai >= 0) {
  const target = process.argv[ai + 1];
  loadApp(ctx, { since: 'app.js', skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
  vm.runInContext(fs.readFileSync(path.isAbsolute(target) ? target : path.join(ROOT, target), 'utf8'),
    ctx, { filename: path.basename(target) });
  console.log(`（使用版本：${target}）\n`);
} else {
  loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
}

function gen(text, mode, depth) {
  return vm.runInContext(
    '(function(){' +
    'currentMode=' + JSON.stringify(mode) + ';' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,' + JSON.stringify(depth) + ',d);' +
    'return typeof o==="string"?o:(o&&o.optimized)||"";})()', ctx);
}

const ROLES = [
  '女帝', '霸总', '病娇', '剑修', '刺客', '机器人', '乞丐', '老人', '少女', '少年',
  '骑士', '魔法师', '商人', '农夫', '医生', '学者', '工程师', '船长', '侦探', '黑客',
  '厨师', '铁匠', '将军', '修女', '狐妖', '吸血鬼', '天使', '狙击手', '赛车手', '画家'
];
const SITS = [
  function (r) { return '一位' + r; },
  function (r) { return '一位' + r + '在战场上厮杀'; },
  function (r) { return '一位' + r + '独坐窗边出神'; }
];

const rows = [];
ROLES.forEach(function (r) {
  SITS.forEach(function (f) {
    const text = f(r);
    let out = '';
    try { out = gen(text, 'character', 'standard'); } catch (e) { out = ''; }
    if (out) rows.push({ role: r, text: text, out: out });
  });
});

console.log(`样本 ${rows.length} 条（${ROLES.length} 角色 × 3 情境）\n`);

// ---- 指标 1：开句形态 ----
function opening(out) {
  const first = out.split('，')[0];
  if (/^画面中央/.test(first)) return '画面中央，一位X';
  if (/^主体是/.test(first)) return '主体是，一位X';
  if (/^一位/.test(first)) return '一位X';
  return '无前缀（直接X）';
}
const openCount = {};
rows.forEach(function (r) {
  const k = opening(r.out);
  openCount[k] = (openCount[k] || 0) + 1;
});
console.log('=== 指标1：开句形态分布 ===');
Object.keys(openCount).sort(function (a, b) { return openCount[b] - openCount[a]; })
  .forEach(function (k) {
    const n = openCount[k];
    console.log(`  ${k.padEnd(18)} ${String(n).padStart(3)} 条  ${(n / rows.length * 100).toFixed(0)}%`);
  });
console.log(`  种类数：${Object.keys(openCount).length}\n`);

// ---- 指标 3：每个维度的「说法」用了多少种 ----
// 按最长优先匹配，取第一个命中的说法，统计分布。
const FORMS = {
  style: ['风格化处理', '主导画面', '为基调', '路线', '笔法', '画风', '风格'],
  lighting: ['铺满整个画面', '笼罩全场', '铺满画面', '洒落场景', '照明', '映照', '洒落', '铺开', '笼罩'],
  composition: ['构图', '视角', '取景'],
  color: ['色彩基调', '统领画面', '色调为主', '色系上', '色调', '色系'],
  atmosphere: ['贯穿整个画面', '贯穿始终', '包裹主体', '的氛围弥漫', '的气息散开', '氛围铺陈',
    '整体气息', '画面氛围', '氛围感', '氛围', '气息'],
  quality: ['画面质感', '成像质量', '画质呈现', '画面达到', '出片', '画质']
};

function formOf(dim, out) {
  const list = FORMS[dim] || [];
  for (let i = 0; i < list.length; i++) {
    if (out.indexOf(list[i]) >= 0) return list[i];
  }
  return null;
}

console.log('=== 指标3：每个维度的说法分布（种类数 / 最大占比）===');
Object.keys(FORMS).forEach(function (dim) {
  const cnt = {};
  rows.forEach(function (r) {
    const f = formOf(dim, r.out);
    if (f) cnt[f] = (cnt[f] || 0) + 1;
  });
  const keys = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; });
  if (!keys.length) {
    console.log(`  ${dim.padEnd(12)} （未出现）`);
    return;
  }
  const top = cnt[keys[0]];
  const topPct = (top / rows.length * 100).toFixed(0);
  const detail = keys.map(function (k) {
    return `${k}×${cnt[k]}`;
  }).join('  ');
  console.log(`  ${dim.padEnd(12)} ${keys.length} 种  最大 ${topPct}%   ${detail}`);
});
console.log('');

// ---- 指标 2：结构同构率（每个维度实际用的说法组合完全相同的占比）----
const sig = {};
rows.forEach(function (r) {
  const key = Object.keys(FORMS).map(function (d) { return formOf(d, r.out) || '-'; }).join('|');
  sig[key] = (sig[key] || 0) + 1;
});
const sigKeys = Object.keys(sig).sort(function (a, b) { return sig[b] - sig[a]; });
const topShare = sig[sigKeys[0]] / rows.length;
console.log('=== 指标2：结构同构率 ===');
console.log(`  不同说法组合：${sigKeys.length} 种`);
console.log(`  最常见组合占：${(topShare * 100).toFixed(0)}%（${sig[sigKeys[0]]} / ${rows.length}）`);
sigKeys.slice(0, 3).forEach(function (k) {
  console.log(`    ${k}  ${sig[k]} 条`);
});
console.log('');

// ---- 补充：全文逐字重复 ----
const exact = {};
rows.forEach(function (r) { exact[r.out] = (exact[r.out] || 0) + 1; });
const dupOut = Object.keys(exact).filter(k => exact[k] > 1).length;
console.log('=== 补充：全文逐字相同 ===');
console.log(`  ${dupOut} 组重复（共 ${rows.length} 条）`);

// ---- 补充：同一输入连生成 5 次，看有没有变化 ----
const probe = '一位剑修，白衣黑发';
const seen = {};
for (let i = 0; i < 5; i++) seen[gen(probe, 'character', 'standard')] = 1;
console.log(`  同一输入「${probe}」连生成 5 次 → ${Object.keys(seen).length} 种不同输出`);

// ---- 补充：开句模式在全部角色上的分布（样本只有 30 个不够）----
const modeDist = JSON.parse(vm.runInContext(
  '(function(){var c=KW_DB.character.categories;var t=["一位X","无前缀X","画面中央一位X","主体是一位X"];' +
  'var o={};for(var k in c){var h=0;for(var i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))%997;' +
  'var m=h%4;o[t[m]]=(o[t[m]]||0)+1;}return JSON.stringify(o);})()', ctx));
const total = Object.keys(vm.runInContext('KW_DB.character.categories', ctx)).length;
console.log('\n=== 补充：开句模式在全部角色上的分布 ===');
['一位X', '无前缀X', '画面中央一位X', '主体是一位X'].forEach(function (k) {
  const n = modeDist[k] || 0;
  console.log(`  ${k.padEnd(14)} ${String(n).padStart(3)} / ${total}  ${(n / total * 100).toFixed(0)}%`);
});

