'use strict';
/* 英文侧输出质量（2026-11-11）
   ------------------------------------------------------------
   修之前实测这句英文输入：
     「a androgynous... strong facial structure with distincti, one foot forward,
       ...wearing fabric draping), bold silhouette with distinctive recognizab, ...
       atmosphere，standing，snowy。」
   四个毛病：
     1 单词被 .substring(0, 80) 切成两半（distincti / recognizab）
     2 数据里的半截括号（fabric draping)）
     3 中文标点漏进英文（，。)
     4 中文原话残片被追到英文句尾（standing，snowy）

   用法：node _dev/verify-en-output.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}
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
  navigator: { userAgent: 'node-en', clipboard: null, hardwareConcurrency: 4 },
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
require('./load-scripts').loadApp(ctx, {
  skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']
});
const G = (e) => vm.runInContext(e, ctx);

function gen(text) {
  return G('(function(){var t=' + JSON.stringify(text) + ';' +
    'var d=detectDimensions(t,"character");currentMode=inferSubjectType(t,d);' +
    'var f=smartFill(d,t);var r=buildOptimizedPrompt(t,f,"standard",d);' +
    'return (typeof r==="string"?r:(r&&r.optimized)||"")})()');
}

const EN = 'a warrior standing on a snowy mountain at night';

console.log('=== 1. 英文输出不能有中文标点 ===');
const en = gen(EN);
ok(en.length > 40, '有输出（' + en.length + ' 字符）');
ok(!/[，。；、（）]/.test(en), '没有中文标点（检查 ，。；、（））');
ok(!/[\u4e00-\u9fff]/.test(en), '没有混进汉字');

console.log('\n=== 2. 括号必须配平（数据里有半截的 fragment）===');
const open = (en.match(/\(/g) || []).length;
const close = (en.match(/\)/g) || []).length;
ok(open === close, '左右括号数量一致（' + open + ' / ' + close + '）');

console.log('\n=== 3. 不能把单词切一半 ===');
// 被 substring 切坏的典型痕迹：逗号段里出现已知前缀，后面没跟完整词
['distincti', 'recognizab', 'material callout'].forEach(function (bad) {
  const hit = new RegExp('\\b' + bad + '\\b').test(en);
  ok(!hit, '没有半截词「' + bad + '」');
});
// 每个逗号段最后一个词至少 2 个字母，且不以逗号/空格结尾
const segs = en.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
ok(segs.every(function (s) { return /[a-z]{2,}$/i.test(s.replace(/[.)]+$/, '')); }), '每段都以完整单词结尾');

console.log('\n=== 4. 冠词 a/an 对齐 ===');
ok(!/\ba [aeio][a-z]/i.test(en), '没有「a + 元音开头」的错误冠词');
ok(/\ban androgynous/i.test(en) || !/androgynous/i.test(en), '「androgynous」前是 an 或未出现');
ok(!/\ba epic\b/i.test(en), '没有「a epic」');

console.log('\n=== 5. 中文输入不受影响 ===');
const zh = gen('一位少年站在雪山上');
ok(/[\u4e00-\u9fff]/.test(zh), '中文输入仍然输出中文');
ok(!/\bthe\b|\bwith\b|\bset in\b/i.test(zh), '中文输出里没有英文连接词');
ok(zh.indexOf('，') >= 0, '中文标点正常保留');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
if (fail) console.log('\n实际英文输出：\n' + en);
process.exit(fail ? 1 : 0);
