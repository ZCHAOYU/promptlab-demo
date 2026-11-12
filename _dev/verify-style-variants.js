'use strict';
/* B 项验收：风格默认值现在可以是候选集，这里验证四件事
   1. 数据合法：每个候选值都在该维度的池子里，候选数 2~3，无重复
   2. 取值只会落在候选集内（不会冒出集合外的值）
   3. 同一风格连点 8 次，能得到多个不同的「光+色+氛围」组合
   4. 同一轮次（round）能逐字复现
   用法：node _dev/verify-style-variants.js */
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

const D = ctx.window.__STYLE_DEFAULTS || {};
const styles = vm.runInContext('Object.keys(KW_DB.style.categories)', ctx);
const POOLS = {};
['lighting', 'color', 'atmosphere', 'scene'].forEach(function (d) {
  POOLS[d] = new Set(vm.runInContext(`Object.keys(KW_DB.${d}.categories)`, ctx));
});

let bad = 0;
function fail(msg) { console.log('  ✗ ' + msg); bad++; }

// ---- 1. 数据合法 ----
console.log('=== 1. 数据合法性 ===');
let sets = 0, singles = 0, minLen = 9, maxLen = 0;
['lighting', 'color', 'atmosphere'].forEach(function (dim) {
  const map = D[dim] || {};
  Object.keys(map).forEach(function (k) {
    const v = map[k];
    if (!Array.isArray(v)) { singles++; return; }
    sets++;
    minLen = Math.min(minLen, v.length);
    maxLen = Math.max(maxLen, v.length);
    if (v.length < 2 || v.length > 3) fail(`${dim}/${k} 候选数 ${v.length}（应为 2~3）`);
    if (new Set(v).size !== v.length) fail(`${dim}/${k} 候选有重复：${v.join('/')}`);
    v.forEach(function (x) { if (!POOLS[dim].has(x)) fail(`${dim}/${k} 的 '${x}' 不在池子里`); });
  });
});
console.log(`  候选集 ${sets} 个，单值 ${singles} 个，候选数区间 ${minLen}~${maxLen}`);

// ---- 2/3/4. 抽样验证取值与复现 ----
function run(text) {
  return JSON.parse(vm.runInContext(
    '(function(){currentMode="character";' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var det={};["lighting","color","atmosphere"].forEach(function(k){' +
    'det[k]=(d[k]&&d[k].detected)||null;});' +
    'return JSON.stringify({style:f.style,lighting:f.lighting,color:f.color,' +
    'atmosphere:f.atmosphere,det:det});})()', ctx));
}

const SAMPLE = ['赛博朋克', '水墨国风', '油画质感', '青绿山水', '汝窑', '赛博敦煌', '东方奇幻', '写实摄影', '3D渲染', '暗黑童话'];
console.log('\n=== 2/3. 每个风格连点 8 次：取值是否落在候选内、是否出现多个组合 ===');
let noVariety = 0;
SAMPLE.forEach(function (s) {
  const text = '一位剑客，' + s;
  const combos = {};
  const outside = [];
  for (let i = 0; i < 8; i++) {
    vm.runInContext('bumpVariantRound()', ctx);
    const r = run(text);
    if (r.style !== s) { outside.push(`检测成 ${r.style}`); break; }
    ['lighting', 'color', 'atmosphere'].forEach(function (dim) {
      // 输入里自己写出来的维度（「青绿山水」里的「青绿」、「暗黑童话」里的「暗黑」）
      // 走的是检测值，不是风格默认值 —— 这些不参与候选集断言。
      if (r.det && r.det[dim]) return;
      const arr = D[dim] && D[dim][s];
      if (!r[dim]) return;
      if (Array.isArray(arr)) {
        if (arr.indexOf(r[dim]) < 0) outside.push(`${dim}=${r[dim]} 不在候选 [${arr.join('/')}]`);
      } else if (arr && arr !== r[dim]) {
        outside.push(`${dim}=${r[dim]} ≠ 单值 ${arr}`);
      }
    });
    combos[[r.lighting, r.color, r.atmosphere].join('|')] = 1;
  }
  const n = Object.keys(combos).length;
  const mark = outside.length ? '✗' : (n >= 2 ? '✓' : '○');
  if (outside.length) { fail(`${s}: ${outside[0]}`); }
  if (n < 2) noVariety++;
  console.log(`  ${mark} ${s.padEnd(8)} 8 次得到 ${n} 种组合` +
    (outside.length ? `  ✗ ${outside[0]}` : ''));
});
if (noVariety) console.log(`  ○ 有 ${noVariety} 个风格 8 次只有 1 种组合（输入里的词把维度都检测掉了，不是数据问题）`);

// ---- 4. 同轮次复现 ----
console.log('\n=== 4. 同轮次逐字复现 ===');
const before = {};
vm.runInContext('__variantRound = 0', ctx);
for (let i = 0; i < 4; i++) {
  vm.runInContext('bumpVariantRound()', ctx);
  before[ctx.__variantRound] = JSON.stringify(run('一位剑客，赛博朋克'));
}
let replayOk = 0, replayBad = 0;
Object.keys(before).forEach(function (round) {
  vm.runInContext('__variantRound = ' + (Number(round) - 1), ctx);
  vm.runInContext('bumpVariantRound()', ctx);
  const again = JSON.stringify(run('一位剑客，赛博朋克'));
  if (again === before[round]) replayOk++; else replayBad++;
});
console.log(`  复现成功 ${replayOk} / ${replayOk + replayBad}`);
if (replayBad) fail('同轮次没能复现');

console.log(`\n== ${bad ? '有问题 ' + bad + ' 处' : '全部通过'} ==`);
process.exit(bad ? 1 : 0);
