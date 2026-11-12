'use strict';
/* 验证「每点一次换一版」：
   1. 连点 8 次，输出必须各不相同
   2. 回到某一版（同一个 round），输出必须逐字复现
   3. 说清楚哪些东西变了、哪些没变
   用法：node _dev/verify-variation.js */
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

function gen(text, mode, depth) {
  return JSON.parse(vm.runInContext(
    '(function(){currentMode=' + JSON.stringify(mode) + ';' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,' + JSON.stringify(depth) + ',d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'return JSON.stringify({s:s,fills:[f.style,f.lighting,f.composition,f.color,f.atmosphere,f.quality]});})()', ctx));
}

const TEXT = '一位剑修，白衣黑发';
let bad = 0;

// ---- 1. 连点 8 次 ----
const seen = {};
const rounds = [];
for (let i = 0; i < 8; i++) {
  vm.runInContext('bumpVariantRound()', ctx);
  const r = gen(TEXT, 'character', 'standard');
  const round = ctx.__variantRound;
  seen[r.s] = (seen[r.s] || 0) + 1;
  rounds.push({ round: round, out: r.s, fills: r.fills.join('|') });
}
const distinct = Object.keys(seen).length;
console.log(`=== 1. 同一输入连点 8 次 ===`);
console.log(`  不同输出：${distinct} 种`);
console.log(`  不同维度取值：${new Set(rounds.map(r => r.fills)).size} 种`);
if (distinct < 8) { console.log('  ✗ 有重复版本'); bad++; } else { console.log('  ✓ 8 版各不相同'); }
console.log('');

// ---- 2. 复现某一版 ----
const target = rounds[2];
vm.runInContext('__variantRound = ' + (target.round - 1), ctx);   // 再 bump 一次回到同一轮
vm.runInContext('bumpVariantRound()', ctx);
const replay = gen(TEXT, 'character', 'standard');
const ok = replay.s === target.out;
console.log(`=== 2. 回到第 ${target.round} 版 ===`);
console.log(`  ${ok ? '✓ 逐字复现' : '✗ 复现失败'}`);
if (!ok) {
  bad++;
  console.log(`    原来: ${target.out.slice(0, 60)}`);
  console.log(`    重放: ${replay.s.slice(0, 60)}`);
}
console.log('');

// ---- 3. 变了什么、没变什么 ----
vm.runInContext('__variantRound = 0', ctx);
const a = gen(TEXT, 'character', 'standard');
vm.runInContext('bumpVariantRound()', ctx);
const b = gen(TEXT, 'character', 'standard');

const clausesA = a.s.split('，');
const clausesB = b.s.split('，');
const shared = clausesA.filter(c => clausesB.indexOf(c) >= 0).length;
console.log('=== 3. 两次的差别 ===');
console.log(`  维度取值是否相同：${a.fills.join('|') === b.fills.join('|') ? '相同（内容不变）' : '不同'}`);
console.log(`  分句总数 ${clausesA.length} / ${clausesB.length}，完全相同的分句 ${shared} 个`);
console.log('  原文 A：' + a.s);
console.log('  原文 B：' + b.s);
console.log('');
console.log(bad ? `== 有问题 ${bad} 项 ==` : '== 全部通过 ==');
process.exit(bad ? 1 : 0);
