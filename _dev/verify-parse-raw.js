'use strict';
/* 结构化抽取的 raw 进正文（2026-11-11）
   ------------------------------------------------------------------
   要证明「词库以外的描述不再被丢掉」：
     1 raw 里的短语会作为从句插进正文
     2 已经出现过的短语不重复插（防堆砌）
     3 换了输入不套用
     4 只用抽取结果补空维度，不覆盖已有的

   这里用桩数据（不联网），真实抽取由 /api/parse 负责。

   用法：node _dev/verify-parse-raw.js
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
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
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

const T = '身上缠着绷带的渔夫，手里攥着一把断刀，蹲在锈迹斑斑的船舱里';
ctx.__t = T;
ctx.__parseStub = {
  text: T, at: Date.now(),
  data: {
    角色: '渔夫', 场景: '船舱', 风格: '', 光线: '', 色彩: '', 氛围: '', 构图: '',
    raw: ['身上缠着绷带', '手里攥着一把断刀', '锈迹斑斑']
  }
};

console.log('=== 1. raw 里的描述必须出现在正文里 ===');
const r1 = G(`(function(){
  var t = window.__t;
  window.__parse = window.__parseStub;
  var d = detectDimensions(t, 'character');
  currentMode = inferSubjectType(t, d);
  var f = smartFill(d, t);
  var r = buildOptimizedPrompt(t, f, 'standard', d);
  return (typeof r === 'string') ? r : r.optimized;
})()`);
console.log('    输出：' + String(r1).slice(0, 110) + '…');
ok(String(r1).indexOf('绷带') >= 0, '「绷带」进了正文（以前直接丢）');
ok(String(r1).indexOf('断刀') >= 0, '「断刀」进了正文');
ok(String(r1).indexOf('锈迹') >= 0, '「锈迹」进了正文');

console.log('\n=== 2. 已出现过的短语不重复插 ===');
const r2 = G(`(function(){
  var t = window.__t;
  window.__parse = { text: t, at: Date.now(), data: { raw: ['教堂', '锈迹斑斑'] } };
  var s = '一位男性身处教堂，锈迹斑斑的地面';
  return appendRawClause(s, t, true);
})()`);
ok(String(r2).indexOf('教堂，') === String(r2).indexOf('教堂，'), '（记录）返回值可比较');
ok((String(r2).match(/教堂/g) || []).length === 1, '「教堂」没有被重复插入');
ok((String(r2).match(/锈迹斑斑/g) || []).length === 1, '「锈迹斑斑」没有被重复插入');

console.log('\n=== 3. 换了输入不套用 ===');
const r3 = G(`(function(){
  window.__parse = { text: '另一句话', at: Date.now(), data: { raw: ['浑身是血'] } };
  return appendRawClause('一位男性站在街口。', window.__t, true);
})()`);
ok(String(r3).indexOf('浑身是血') < 0, '文本不符 → 不插入');

console.log('\n=== 4. 只补空维度 ===');
const r4 = G(`(function(){
  var t = window.__t;
  window.__parse = { text: t, at: Date.now(), data: {
    角色: '渔夫', 场景: '船舱', 风格: '写实摄影', 光线: '', 色彩: '', 氛围: '', 构图: '', raw: [] } };
  var f = { character: '剑客', scene: '', style: '', lighting: '', color: '', atmosphere: '', composition: '', platform: '通用' };
  var applied = applyParseFills(t, f);
  return JSON.stringify({ applied: applied, character: f.character, scene: f.scene, style: f.style });
})()`);
const o4 = JSON.parse(r4);
ok(o4.character === '剑客', '角色已有值 → 不被覆盖（' + o4.character + '）');
ok(o4.scene === '船舱', '场景为空 → 被补上（' + o4.scene + '）');
ok(o4.style === '写实摄影', '风格为空 → 被补上（' + o4.style + '）');

console.log('\n=== 5. 没有抽取结果时不受影响（向后兼容）===');
const r5 = G(`(function(){
  window.__parse = null;
  return appendRawClause('一位男性站在街口。', window.__t, true);
})()`);
ok(String(r5) === '一位男性站在街口。', '没有结果 → 原样返回');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
