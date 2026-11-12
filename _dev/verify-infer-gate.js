'use strict';
/* 第 3 层推理的触发条件（2026-11-17 用户报的问题）
   ------------------------------------------------------------------
   现象：输入「一个形状古怪有奇怪花纹的剑」→ 界面显示「正在推理…」→
         等 10.5 秒 → 提示消失，什么答案都没有。服务端日志：
           [infer] character | 一个形状古怪有奇怪花纹的剑
           [infer] 校验没过（第 1 次）：subject 长度异常
           [infer] 校验没过（第 2 次）：可画描述总量只有 17 字，太薄

   根因三条：
     1. 模式判定写在 optimizeBody 里，而 tryLLMInfer 在它之前跑，
        用的是**上一轮**的 currentMode —— 一把剑被按「人物」去问模型。
     2. 道具本来就没法用人物 schema（wors/outward/pose）描述，必然判「太薄」。
     3. 失败后 inferHint(null) 直接清提示，中间 10 秒的等待没有任何交代。

   用法：node _dev/verify-infer-gate.js */
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

function makeCtx(fetchImpl) {
  const cache = {};
  const doc = {
    readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
    getElementById(id) { return cache[id] || (cache[id] = mk()); },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    createElement() { return mk(); }, createTextNode() { return mk(); },
    addEventListener() {}, execCommand() { return true; }
  };
  const ls = {};
  const ctx = {
    console: { log() {}, warn() {}, error() {}, info() {} },
    document: doc,
    navigator: { userAgent: 'node-infer-gate', clipboard: null, hardwareConcurrency: 4 },
    localStorage: {
      getItem(k) { return ls[k] === undefined ? null : ls[k]; },
      setItem(k, v) { ls[k] = String(v); }, removeItem(k) { delete ls[k]; }
    },
    sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    fetch: fetchImpl,
    alert() {}, prompt() { return null; }, confirm() { return true; },
    performance: { now: () => Date.now() },
    location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
    requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  // 走真实加载顺序（从 index.html 读），否则 KW_DB 不存在，
  // detectDimensions 会抛异常，模式一律退回 character —— 测出来的就是假象。
  const { loadApp } = require('./load-scripts');
  loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
  return ctx;
}

/* 顶层 let / const 不会变成 globalThis 的属性，必须回 vm 里读 */
function G(ctx, expr) { return vm.runInContext(expr, ctx); }

const PROP_TEXT = '一个形状古怪有奇怪花纹的剑';
const CHAR_TEXT = '皮影艺人，枯瘦的手挑着竹签';

(async function main() {
  console.log('=== 1. 道具必须在推理之前就被判成道具 ===');
  {
    const ctx = makeCtx(async () => { throw new Error('不该发请求'); });
    const auto = ctx.resolveAutoMode(PROP_TEXT);
    ok(auto === 'prop', 'resolveAutoMode("' + PROP_TEXT + '") = ' + auto + '（应为 prop）');
    ok(G(ctx, 'currentMode') === 'prop', 'currentMode 同步成 prop（实际 ' + G(ctx, 'currentMode') + '）');
  }

  console.log('\n=== 2. 道具类不触发主体推理（不该白等 10 秒）===');
  {
    const calls = [];
    const ctx = makeCtx(async function (url, opts) {
      calls.push(String(url));
      throw new Error('不该发请求');
    });
    ctx.resolveAutoMode(PROP_TEXT);
    await new Promise(r => setTimeout(r, 60));
    calls.length = 0;                       // 排除 app.js 启动时的 /api/health
    const r = await ctx.tryLLMInfer(PROP_TEXT);
    ok(r === false, 'tryLLMInfer 返回 false');
    ok(calls.length === 0, '一次请求都没发（实际 ' + calls.length + ' 次：' + calls.join(',') + '）');
    ok(ctx.__inferSkipReason === '道具类不做主体推理', '跳过原因是道具类（' + ctx.__inferSkipReason + '）');
  }

  console.log('\n=== 3. 人物类仍然会触发推理，并真的把词条注入 ===');
  {
    const calls = [];
    const ctx = makeCtx(async function (url, opts) {
      calls.push({ url: String(url), body: opts && opts.body ? JSON.parse(opts.body) : null });
      return {
        ok: true, status: 200,
        json: async () => ({
          ok: true,
          data: {
            subject: '皮影艺人', type: 'character', short: '皮影艺人', gender: '中性',
            worn: '深蓝布褂，旧围裙，布袖套，粗布长裤',
            outward: '花白短发，瘦削面颊，手指粗糙沾有浆糊',
            pose: '低头挑竹签，神情专注',
            en_core: 'a chinese shadow puppet artist',
            en_worn: ['blue_smock', 'apron', 'cloth_sleeves'],
            en_tags: ['holding_sticks', 'focused', 'sitting'],
            confidence: 0.9, why: '皮影艺人的典型装束'
          }
        }),
        text: async () => ''
      };
    });
    ctx.resolveAutoMode(CHAR_TEXT);
    await new Promise(r => setTimeout(r, 60));
    calls.length = 0;
    const r = await ctx.tryLLMInfer(CHAR_TEXT);
    ok(r === true, 'tryLLMInfer 返回 true（推理成功）');
    ok(calls.length === 1 && calls[0].url === '/api/infer', '只发了 /api/infer（' + calls.map(c => c.url).join(',') + '）');
    ok(calls[0] && calls[0].body && calls[0].body.mode === 'character',
      '请求带的 mode = character（实际 ' + (calls[0] && calls[0].body && calls[0].body.mode) + '）');
    const injected = G(ctx, "KW_DB.character.categories['皮影艺人']");
    ok(!!injected, '推理结果已注入词库（KW_DB.character.categories["皮影艺人"]）');
    ok(!!injected && !!injected.zh && injected.zh.core.indexOf('皮影艺人') >= 0,
      '注入的词条能渲染出中文（zh.core=' + (injected && injected.zh && injected.zh.core) + '）');
  }

  console.log('\n=== 4. 推理失败必须说出来，而不是让提示凭空消失 ===');
  {
    const ctx = makeCtx(async function () {
      return {
        ok: true, status: 200,
        json: async () => ({ ok: false, error: '可画描述总量只有 17 字，太薄' }),
        text: async () => ''
      };
    });
    ctx.resolveAutoMode('某个说不出名字的行当');
    await new Promise(r => setTimeout(r, 60));
    ctx.__svcStatus = 'ok';                 // 服务是好的，只是这次推理不合格
    const r = await ctx.tryLLMInfer('某个说不出名字的行当');
    ok(r === false, 'tryLLMInfer 返回 false');
    const toast = ctx.document.getElementById('toast');
    ok(String(toast.textContent).indexOf('没认出') >= 0,
      'toast 明确说了「没认出」（实际："' + toast.textContent + '"）');
    ok(String(toast.textContent).indexOf('太薄') >= 0,
      'toast 带上了服务端给的原因（"太薄"）');
    ok(String(toast.textContent).indexOf('已按原样生成') >= 0,
      'toast 说明了后续怎么处理');
    ok(ctx.__inferLastError === '可画描述总量只有 17 字，太薄',
      '__inferLastError 记录了原始原因，方便排查');
  }

  console.log('\n=== 5. 模式缓存：同一句话不会重复计算，但换输入会重算 ===');
  {
    const ctx = makeCtx(async () => { throw new Error('x'); });
    const a1 = ctx.resolveAutoMode(PROP_TEXT);
    const a2 = ctx.resolveAutoMode(PROP_TEXT);
    ok(a1 === 'prop' && a2 === 'prop', '同一句连续两次都是 prop');
    const a3 = ctx.resolveAutoMode(CHAR_TEXT);
    ok(a3 === 'character', '换一句重新判定 = ' + a3 + '（应为 character）');
  }

  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
