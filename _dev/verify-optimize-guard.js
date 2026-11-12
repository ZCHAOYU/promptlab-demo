'use strict';
/* 防重入验证（2026-11-11）
   ------------------------------------------------------------------
   用户报告：面板还在算的时候连点一键优化，结果直接蹦出来（有时还是旧的那版）。
   根因：optimize() 没有防重入，两次并发写入互相覆盖。

   这个测试**真的并发调用两次 optimize()**，数一数语义检索和生成各跑了几次。
   静态看一眼代码里有没有 __optimizing 不算验证。

   用法：node _dev/verify-optimize-guard.js
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
    style: {}, dataset: {}, children: [], value: '', textContent: '一键优化', innerHTML: '',
    disabled: false,
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

/* 输入框要有内容，否则 optimizeBody 直接 return */
const inputEl = doc.getElementById('promptInput');
inputEl.value = '一个浑身是血的男人跪在教堂面前';

/* 打桩：数调用次数 + 人为放慢，制造并发窗口 */
const calls = { semantic: 0, infer: 0, body: 0 };
ctx.trySemanticFill = async function () { calls.semantic++; await new Promise(r => setTimeout(r, 60)); };
ctx.tryLLMInfer = async function () { calls.infer++; await new Promise(r => setTimeout(r, 60)); };
ctx.resolveAutoMode = function () { };
ctx.bumpVariantRound = function () { };
ctx.inferHint = function () { };
ctx.showFeedbackRow = function () { };
ctx.optimizeBody = function () { calls.body++; return '结果'; };

const G = (e) => vm.runInContext(e, ctx);

(async function () {
  console.log('=== 1. 双击（并发两次）只应该跑一遍 ===');
  await Promise.all([G('optimize()'), G('optimize()')]);
  ok(calls.semantic === 1, '语义检索跑了 ' + calls.semantic + ' 次（期望 1）');
  ok(calls.infer === 1, '第 3 层推理跑了 ' + calls.infer + ' 次（期望 1）');
  ok(calls.body === 1, '生成跑了 ' + calls.body + ' 次（期望 1）');

  console.log('\n=== 2. 跑完之后能再次生成（守卫不能锁死）===');
  calls.semantic = calls.infer = calls.body = 0;
  await G('optimize()');
  ok(calls.body === 1, '第二次单独点击仍然生成 1 次（' + calls.body + '）');
  ok(calls.semantic === 1, '第二次单独点击仍然检索 1 次（' + calls.semantic + '）');

  console.log('\n=== 3. 按钮三态：生成期间被禁用，结束后恢复 ===');
  const btn = doc.getElementById('btnOptimize');
  calls.semantic = calls.infer = calls.body = 0;
  const running = G('optimize()');
  await new Promise(r => setTimeout(r, 20));
  ok(btn.disabled === true, '生成中按钮被禁用');
  ok(String(btn.textContent).indexOf('…') >= 0, '生成中按钮显示进度文案（' + btn.textContent + '）');
  await running;
  ok(btn.disabled === false, '结束后按钮恢复可用');
  ok(btn.textContent === '一键优化', '结束后文案恢复（' + btn.textContent + '）');

  console.log('\n=== 4. 生成期间再点，不会叠加（第三次并发）===');
  calls.semantic = calls.infer = calls.body = 0;
  const a = G('optimize()');
  const b = G('optimize()');
  const c = G('optimize()');
  await Promise.all([a, b, c]);
  ok(calls.body === 1, '三连点只生成 1 次（' + calls.body + '）');

  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
