'use strict';
/* 「血」不再等于「吸血鬼」（2026-11-11）
   ------------------------------------------------------------------
   用户实测输入：「一个浑身是血的男人跪在教堂面前」
   修之前输出：「一位男性暗夜中的血族贵族，永生的诅咒…獠牙藏得极稳…古堡钥匙」
   —— 把「流血的男人」换成了「吸血的怪物」。方向性错误，不是细节偏差。

   根因：单字「血」是吸血鬼词条的关键词；oneCharStandalone 认为
   「浑身是血」里的「血」独立（前面是「是」这个语气词）。

   这个测试锁四件事：
     1 含「血」的复合词不再触发吸血鬼
     2 真正写「吸血鬼」仍然要认出来（别修过头）
     3 输出里不能残留吸血鬼的专属描写
     4 用户自己写的描述要留下（宁缺勿错：不知道就照抄）

   用法：node _dev/verify-blood-compound.js */
const path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
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
  navigator: { userAgent: 'n', clipboard: null }, localStorage: { getItem() { return null; }, setItem() { } },
  sessionStorage: { getItem() { return null; }, setItem() { } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('offline'); },
  alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() }, location: { href: 'http://x/', protocol: 'http:' }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
require('./load-scripts').loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

function gen(text) {
  return G('(function(){var t=' + JSON.stringify(text) + ';' +
    'var d=detectDimensions(t,"character");currentMode=inferSubjectType(t,d);' +
    'var f=smartFill(d,t);var r=buildOptimizedPrompt(t,f,"standard",d);' +
    'return (typeof r==="string"?r:(r&&r.optimized)||"")})()');
}
function charOf(text) {
  const raw = G('(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'return JSON.stringify((d.character&&(d.character.name||d.character.detected))||"")})()');
  try { return JSON.parse(raw); } catch (e) { return raw; }
}

console.log('=== 1. 含「血」的复合词不该触发吸血鬼 ===');
const NOT_VAMPIRE = [
  '一个浑身是血的男人跪在教堂面前',
  '满身是血的士兵靠在墙边',
  '地上有血迹的走廊',
  '一个流血受伤的猎人',
  '一场血战之后的战场',
  '穿着白衣的医生，袖口有血污'
];
NOT_VAMPIRE.forEach(function (t) {
  const c = charOf(t);
  ok(c !== '吸血鬼', '「' + t.slice(0, 18) + '…」→ 主体「' + (c || '未识别') + '」（不是吸血鬼）');
});

console.log('\n=== 2. 真正的吸血鬼仍然要认出来（别修过头）===');
['吸血鬼伯爵站在古堡阳台', '一个吸血鬼少女'].forEach(function (t) {
  const c = charOf(t);
  ok(c === '吸血鬼', '「' + t + '」→ 主体「' + c + '」');
});

console.log('\n=== 3. 输出里不能有吸血鬼的专属描写 ===');
const out = gen('一个浑身是血的男人跪在教堂面前');
console.log('    实际输出：' + out.slice(0, 78) + '…');
['血族', '獠牙', '永生的诅咒', '古堡钥匙', '吸血鬼'].forEach(function (w) {
  ok(out.indexOf(w) < 0, '没有「' + w + '」');
});

console.log('\n=== 4. 用户自己写的描述要留下（宁缺勿错：不知道就照抄）===');
ok(out.indexOf('血') >= 0, '「血」这个信息没有丢');
ok(out.indexOf('教堂') >= 0, '「教堂」没有丢');
ok(out.indexOf('男性') >= 0 || out.indexOf('男人') >= 0, '「男性」没有丢');

console.log('\n=== 5. 词库本身没有被破坏 ===');
const vamp = G('(function(){var c=KW_DB.character.categories["吸血鬼"];return c?c.core.slice(0,20):"missing"})()');
ok(typeof vamp === 'string' && vamp.indexOf('vampire') >= 0, '吸血鬼词条还在（core: ' + vamp + '…）');

console.log('\n=== 6. 已知限制（不是今天修的，记录在案）===');
// A/B 已确认：改动前后都认成「贵族」。这是「专指 vs 泛称」的打分问题：
// 「血族贵族」里「贵族」是更长的字面匹配，把「吸血鬼」压过去了。
// 留住这条断言，是为了让这个限制有据可查，而不是让它悄悄消失。
const c6 = charOf('苍白血族贵族，獠牙');
ok(c6 === '贵族', '「苍白血族贵族，獠牙」→ 「' + c6 + '」（已知：专指被泛称压过，未修）');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
