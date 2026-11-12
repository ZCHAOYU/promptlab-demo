'use strict';
/* 推理词条不能拼成名词沙拉（2026-11-11 用户录屏）
   ------------------------------------------------------------------
   用户录屏里的输出：
     一位 扎纸匠人，在 后院灯影、脸上有皱纹、手上沾着纸浆、胳膊沾着水、低头专注，
     对手竹篾扎制成人形骨架，…纸雕，裱糊手茧，手指灵巧，腰/臂节扎、手握竹篾身姿、
     竹篾绞出骨架、竹篾在指间翻飞，…松动而林间，墨青上方留着空白。

   根因：模型把 worn/outward/pose 写成 5~6 段名词，模板把它们当句子拼。
   两道防线：
     a) 服务端校验：每个字段最多 3 段（新推理结果进不来）
     b) 客户端注入时整理：顿号→逗号、去空格、超 3 段截断（已经存进 localStorage 的坏词条也能救）

   用法：node _dev/verify-infer-tidy.js */
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

console.log('=== 1. tidyZh 单元测试 ===');
const T = [
  ['裱糊手茧、手指灵巧、腰臂节扎、手握竹篾身姿、竹篾绞出骨架', 3],
  ['深蓝布褂，旧围裙', 3],
  ['一位 扎纸匠人', 1],
  ['在 后院灯影、', 3]
];
T.forEach(function (c) {
  const got = G('tidyZh(' + JSON.stringify(c[0]) + ',' + c[1] + ')');
  const items = got ? got.split('，').length : 0;
  ok(items <= c[1], '「' + c[0].slice(0, 16) + '…」→ ' + items + ' 段（上限 ' + c[1] + '）：' + got);
  ok(got.indexOf('、') < 0, '  没有顿号残留');
  ok(!/[\u4e00-\u9fff] [\u4e00-\u9fff]/.test(got), '  中文之间没有空格');
});

console.log('\n=== 2. 脏词条注入后，输出不能再是沙拉 ===');
// 完全照录屏里那条的形状造一个坏词条
G('injectInferred(' + JSON.stringify({
  subject: '扎纸匠',
  type: 'character',
  short: '扎纸匠人',
  gender: '男',
  worn: '深蓝布褂、旧围裙、布袖套、粗布长裤、腰/臂节扎、素白盖体',
  outward: '花白短发、瘦削面颊、手指粗糙沾有浆糊、胳膊沾着水、裱糊手茧',
  pose: '低头扎竹篾、手持彩纸、神情专注、竹篾绞出骨架、竹篾在指间翻飞、青瓦青灰砖墙缝隙爬出藤蔓',
  en_core: 'a paper effigy craftsman',
  en_worn: ['apron'],
  en_tags: ['crafting', 'focused'],
  confidence: 0.85,
  why: '测试'
}) + ')');

const zh = G('JSON.stringify(KW_DB.character.categories["扎纸匠"].zh)');
const o = JSON.parse(zh);
ok(o.worn.split('，').length <= 3, 'worn 最多 3 段（实际 ' + o.worn.split('，').length + '）：' + o.worn);
ok(o.face.split('，').length <= 3, 'outward 最多 3 段（实际 ' + o.face.split('，').length + '）：' + o.face);
ok(o.pose.split('，').length <= 3, 'pose 最多 3 段（实际 ' + o.pose.split('，').length + '）：' + o.pose);
ok(zh.indexOf('、') < 0, '词条里没有顿号残留');
ok(zh.indexOf('\\u002f') < 0 && o.worn.indexOf('/') < 0, '没有斜杠残留');

const out = G('(function(){var t="扎纸匠";var d=detectDimensions(t,"character");currentMode=inferSubjectType(t,d);' +
  'var f=smartFill(d,t);var r=buildOptimizedPrompt(t,f,"standard",d);' +
  'return (typeof r==="string"?r:(r&&r.optimized)||"")})()');
ok(out.indexOf('、') < 0, '最终输出里没有顿号');
ok(!/[\u4e00-\u9fff] [\u4e00-\u9fff]/.test(out), '最终输出里中文之间没有空格');
ok(out.length < 400, '输出长度合理（' + out.length + ' 字，不再堆成一大坨）');
// 每段平均长度：沙拉的特征是短碎片密集出现
const segs = out.split(/[，。]/).filter(function (s) { return s.trim(); });
const short = segs.filter(function (s) { return s.trim().length <= 4; });
ok(short.length / segs.length < 0.45,
  '短碎片（≤4 字）占比 ' + Math.round(short.length / segs.length * 100) + '%，低于 45%');

console.log('\n=== 3. 干净的词条不能被改坏 ===');
G('injectInferred(' + JSON.stringify({
  subject: '皮影艺人', type: 'character', short: '皮影艺人', gender: '中性',
  worn: '深蓝布褂，旧围裙，布袖套', outward: '花白短发，瘦削面颊',
  pose: '低头挑竹签，神情专注',
  en_core: 'a shadow puppet artist', en_worn: ['apron'], en_tags: ['crafting'], confidence: 0.9, why: 't'
}) + ')');
const zh2 = JSON.parse(G('JSON.stringify(KW_DB.character.categories["皮影艺人"].zh)'));
ok(zh2.worn === '深蓝布褂，旧围裙，布袖套', 'worn 原样保留：' + zh2.worn);
ok(zh2.pose === '低头挑竹签，神情专注', 'pose 原样保留：' + zh2.pose);

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
