'use strict';
/* 验证「语义检索 + 约束决策」面板在浏览器里真的能跑：
   key 不能进浏览器，所以 arbiter 必须改走 /api/chat。
   这个脚本用真实 HTTP 打真实服务，跑一遍真实的 LLM 跳，不是 mock。

   两条路径都要验：
     A. 没有 LLM_CONFIG（正常情况）→ 必须 POST /api/chat，且能拿到合法 JSON
     B. 有 LLM_CONFIG（本地联调）  → 仍然直连 api.deepseek.com（不经过服务端）

   需要 serve.py 已在 8777 跑着。用法：node _dev/verify-chat-proxy.js
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = 'http://127.0.0.1:8777';

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

/* 造一个独立的运行环境；fetchImpl 决定网络怎么走 */
function makeCtx(fetchImpl, withKey) {
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
    navigator: { userAgent: 'node-chat-proxy', clipboard: null, hardwareConcurrency: 4 },
    localStorage: {
      getItem(k) { return ls[k] === undefined ? null : ls[k]; },
      setItem(k, v) { ls[k] = String(v); }, removeItem(k) { delete ls[k]; }
    },
    sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    AbortController,
    fetch: fetchImpl,
    alert() {}, prompt() { return null; }, confirm() { return true; },
    performance: { now: () => Date.now() },
    location: { href: BASE + '/', protocol: 'http:', search: '', hash: '' },
    requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  if (withKey) {
    ctx.LLM_CONFIG = {
      endpoint: 'https://api.deepseek.com/v1',
      key: 'sk-fake-for-routing-test',
      model: 'deepseek-flash', temperature: 0.2, maxTokens: 300, timeoutMs: 20000
    };
  }
  vm.createContext(ctx);
  // app.js 提供 plHeaders()（访问码头），llm-arbiter 依赖它
  // app.js 2026-11-11 拆成 5 个文件，缺了补丁层会在 INIT 处报 renderTemplates is not defined
  for (const f of ['app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'llm-arbiter.js'), 'utf8'), ctx, { filename: 'llm-arbiter.js' });
  // 真实页面里是 agent-panel.js 第 20 行做这件事，这里没有加载面板，所以手动补上，
  // 否则「有 key 时直连」那条路测不到。
  if (withKey && ctx.LLMArbiter && ctx.LLM_CONFIG) {
    ctx.LLMArbiter.configure(ctx.LLM_CONFIG);
  }
  return ctx;
}

(async function main() {
  console.log('=== 0. 服务是否在跑 ===');
  let healthy = false;
  try {
    const r = await fetch(BASE + '/api/health');
    const j = await r.json();
    healthy = !!j.ok && !!j.infer;
    console.log('  ' + (healthy ? '✓' : '✗') + ' /api/health ok=' + j.ok + ' infer=' + j.infer);
  } catch (e) {
    console.log('  ✗ 连不上 ' + BASE + '：' + e.message);
  }
  if (!healthy) {
    // 这是「联调类」检查：要有真实服务才能跑。服务没起就跳过，不算失败，
    // 否则离线跑全量回归时会被它拖红。
    console.log('\n[跳过] serve.py 没在 8777 上跑，这条是联调检查，需要真实服务。');
    console.log('       启动方式：在 promptlab 目录运行 python serve.py 8777');
    process.exit(0);
  }

  // ---------- A：没有 key → 必须走 /api/chat ----------
  console.log('\n=== A. 没有 LLM_CONFIG（和用户现在的情况一样）===');
  const calls = [];
  const ctxA = makeCtx(async function (url, opts) {
    const abs = String(url).startsWith('http') ? String(url) : BASE + String(url);
    calls.push({ url: abs, body: opts && opts.body ? JSON.parse(opts.body) : null,
                 headers: (opts && opts.headers) || {} });
    // 真的打到本地服务，不是 mock 返回
    return await fetch(abs, Object.assign({}, opts, { signal: undefined }));
  }, false);
  // app.js 加载时会自己打一次 /api/health（状态徽标），等它落地再清空计数，
  // 否则会把那次健康检查误当成面板的请求。
  await new Promise(r => setTimeout(r, 120));
  calls.length = 0;

  ok(!ctxA.LLM_CONFIG, '环境里确实没有 LLM_CONFIG（模拟 config.local.js 被 404）');
  const arbiterA = ctxA.LLMArbiter;
  ok(!!arbiterA, 'LLMArbiter 已加载');

  let resA = null;
  try {
    resA = await arbiterA.route('一位老人在雨里撑伞');
  } catch (e) {
    console.log('  ✗ route() 抛异常：' + e.message);
  }
  const toChat = calls.filter(function (c) { return c.url === BASE + '/api/chat'; });
  ok(!!resA && resA.ok === true, 'route() 成功（ok=' + (resA && resA.ok) + '）');
  ok(toChat.length === 1 && calls.length === 1,
    '这条请求发到了 /api/chat（本次共 ' + calls.length + ' 次请求：' + calls.map(function (c) { return c.url; }).join(', ') + '）');
  ok(!JSON.stringify(calls).includes('deepseek.com'), '没有直接请求 api.deepseek.com');
  ok(!JSON.stringify(calls).includes('sk-'), '请求里不含任何 key');
  ok(!!resA && typeof resA.intent === 'string' && resA.intent.length > 0,
    'route 解析出 intent=' + (resA && resA.intent) + '（说明模型返回的 JSON 被正确解析）');
  ok(!String((resA && resA.error) || '').includes('config.local.js'),
    '不再出现「检查 config.local.js」这种误导提示');

  // ---------- B：有 key（本地联调）→ 仍然直连 ----------
  console.log('\n=== B. 有 LLM_CONFIG（本地联调那条路）===');
  const callsB = [];
  const ctxB = makeCtx(async function (url, opts) {
    callsB.push({ url: String(url), auth: (opts && opts.headers && opts.headers.Authorization) || '' });
    // 不真的联网，返回一个合法的 OpenAI 形状
    return {
      ok: true, status: 200,
      json: async () => ({ choices: [{ message: { content: '{"intent":"compose","needRetrieval":true,"dims":["character"],"reason":"测试"}' } }], usage: {} }),
      text: async () => ''
    };
  }, true);
  await new Promise(r => setTimeout(r, 120));
  callsB.length = 0;

  const resB = await ctxB.LLMArbiter.route('一位老人在雨里撑伞');
  ok(resB && resB.ok === true, 'route() 成功（ok=' + (resB && resB.ok) + '）');
  const directB = callsB.filter(function (c) { return c.url.includes('api.deepseek.com'); });
  ok(directB.length === 1 && callsB.length === 1,
    '有 key 时直连 api.deepseek.com（本次请求：' + callsB.map(function (c) { return c.url; }).join(', ') + '）');
  ok(directB[0] && directB[0].auth === 'Bearer sk-fake-for-routing-test',
    '直连时自己带 Authorization 头');

  // ---------- C：访问码 ----------
  console.log('\n=== C. 服务端设了访问码时，代理请求要带上 X-PL-Code ===');
  const ctxC = makeCtx(async function (url, opts) {
    return { ok: false, status: 401, json: async () => ({ ok: false, error: '需要访问码（X-PL-Code）' }), text: async () => '{"ok":false,"error":"需要访问码（X-PL-Code）"}' };
  }, false);
  vm.runInContext('localStorage.setItem("pl_code","abc123")', ctxC);
  let sawHeader = '';
  ctxC.fetch = async function (url, opts) {
    sawHeader = (opts && opts.headers && opts.headers['X-PL-Code']) || '';
    return { ok: false, status: 401, text: async () => '{"error":"需要访问码（X-PL-Code）"}', json: async () => ({}) };
  };
  const resC = await ctxC.LLMArbiter.route('测试访问码');
  ok(sawHeader === 'abc123', '代理请求带上了 X-PL-Code（实际 ' + sawHeader + '）');
  ok(resC && resC.ok === false && String(resC.error).includes('访问码'),
    '服务端 401 的原因能透到界面上（' + (resC && resC.error) + '）');

  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
