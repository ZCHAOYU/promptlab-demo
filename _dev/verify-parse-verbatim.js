'use strict';
/* 「原话」优先：模型归纳不能覆盖用户写法（2026-11-11）
   ------------------------------------------------------------------
   用户指出：抽取会把「手上全是机油的老修理工」归纳成「修理工」。
   解决方式：抽取多返回一个「原话」字段（逐字来自输入，服务端用子串校验强制），
   客户端填人物时优先用它。

   这个测试用桩数据验证客户端这一半（服务端那半在 verify-parse-raw 的同类里）。

   用法：node _dev/verify-parse-verbatim.js
*/
const path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '', disabled: false,
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
    addEventListener() { }, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute() { return null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() { }, click() { }, remove() { }
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() { }, execCommand() { return true; }
};
const ctx = {
  console: { log() { }, warn() { }, error() { } }, document: doc,
  navigator: { userAgent: 'n' }, localStorage: { getItem() { return null; }, setItem() { } },
  sessionStorage: { getItem() { return null; }, setItem() { } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('off') }, alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() }, location: { href: 'http://x/', protocol: 'http:' }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
require('./load-scripts').loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

const T = '手上全是机油的老修理工蹲在拖拉机旁边，膝盖上摊着一本卷角的手册';
ctx.__t = T;

console.log('=== 1. 有「原话」时，人物字段用原话而不是归纳名 ===');
const r1 = G(`(function(){
  var t = window.__t;
  window.__parse = { text: t, at: Date.now(), data: {
    角色: '修理工', 原话: '手上全是机油的老修理工', 场景: '', 风格: '', 光线: '', 色彩: '', 氛围: '', 构图: '',
    raw: ['手上全是机油', '蹲在拖拉机旁边', '卷角的手册']
  } };
  var f = { character: '', scene: '', style: '', lighting: '', color: '', atmosphere: '', composition: '', platform: '通用' };
  var applied = applyParseFills(t, f);
  return JSON.stringify({ character: f.character, applied: applied });
})()`);
const o1 = JSON.parse(r1);
ok(o1.character === '手上全是机油的老修理工', '人物字段 = 原话（' + o1.character + '），不是「修理工」');

console.log('\n=== 2. 没有「原话」时退回「角色」 ===');
const r2 = G(`(function(){
  var t = window.__t;
  window.__parse = { text: t, at: Date.now(), data: {
    角色: '修理工', 原话: '', 场景: '', 风格: '', 光线: '', 色彩: '', 氛围: '', 构图: '', raw: [] } };
  var f = { character: '', scene: '', style: '', lighting: '', color: '', atmosphere: '', composition: '', platform: '通用' };
  applyParseFills(t, f);
  return JSON.stringify({ character: f.character });
})()`);
ok(JSON.parse(r2).character === '修理工', '没有原话 → 用角色名（修理工）');

console.log('\n=== 3. 端到端：正文里必须保留用户写法 ===');
const r3 = G(`(function(){
  var t = window.__t;
  window.__parse = { text: t, at: Date.now(), data: {
    角色: '修理工', 原话: '手上全是机油的老修理工', 场景: '', 风格: '', 光线: '', 色彩: '', 氛围: '', 构图: '',
    raw: ['手上全是机油', '蹲在拖拉机旁边', '卷角的手册']
  } };
  var d = detectDimensions(t, 'character');
  currentMode = inferSubjectType(t, d);
  var f = smartFill(d, t);
  var r = buildOptimizedPrompt(t, f, 'standard', d);
  return (typeof r === 'string') ? r : r.optimized;
})()`);
console.log('    输出：' + String(r3).slice(0, 108) + '…');
ok(String(r3).indexOf('老修理工') >= 0, '「老修理工」被保留（没被换成「修理工」）');
ok(String(r3).indexOf('机油') >= 0, '「机油」被保留');
ok(String(r3).indexOf('手册') >= 0, '「手册」被保留');

console.log('\n=== 4. 已有的角色不被覆盖 ===');
const r4 = G(`(function(){
  var t = window.__t;
  window.__parse = { text: t, at: Date.now(), data: {
    角色: '修理工', 原话: '手上全是机油的老修理工', raw: [] } };
  var f = { character: '剑客', scene: '', style: '', lighting: '', color: '', atmosphere: '', composition: '', platform: '通用' };
  applyParseFills(t, f);
  return f.character;
})()`);
ok(r4 === '剑客', '角色已有值时不被原话覆盖（' + r4 + '）');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
