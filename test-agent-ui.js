/* 页面级集成测试：桩掉 DOM 与网络，直接触发「跑全流程」，验证 UI 渲染链路无运行时错误 */
'use strict';

global.window = global;

/* ---------------- DOM 桩 ---------------- */
function El(id) {
  return {
    id: id, disabled: false, checked: false, value: '',
    textContent: '', className: '', innerHTML: '', dataset: {}, style: {},
    _h: {},
    addEventListener: function (ev, fn) { this._h[ev] = fn; },
    click: function () { return this._h.click ? this._h.click() : undefined; }
  };
}
var els = {};
['bar', 'prog', 'stat', 'out', 'btnInit', 'btnRun', 'btnClear', 'btnAbort', 'q', 'optRoute', 'optReflect']
  .forEach(function (id) { els[id] = El(id); });
els.optRoute.checked = true;
els.optReflect.checked = true;
els.q.value = '阴森的老房子，晚上有雾';

global.document = {
  getElementById: function (id) { return els[id] || null; },
  querySelectorAll: function () { return []; },
  baseURI: 'http://localhost/'
};

/* ---------------- 网络桩 ---------------- */
var sent = [], queue = [];

global.fetch = async function (url, opts) {
  var body = JSON.parse(opts.body);
  sent.push(body.messages);
  if (!queue.length) throw new Error('第 ' + sent.length + ' 次请求没有预设响应');
  return queue.shift();
};

function ok(content) {
  return {
    ok: true,
    json: async function () {
      return { choices: [{ message: { content: content } }], usage: { prompt_tokens: 120, completion_tokens: 60 } };
    }
  };
}

/* ---------------- 检索层桩 ---------------- */
var CANDS = {
  scene: [{ name: '深夜街道', zh: '夜晚的城市街道', score: 0.71 }, { name: '清晨湖边', zh: '清晨的湖', score: 0.55 }],
  light: [{ name: '晨雾柔光', zh: '清晨的雾', score: 0.64 }, { name: '霓虹光', zh: '霓虹', score: 0.58 }],
  atmosphere: [{ name: '阴森', zh: '阴森', score: 0.69 }],
  role: [{ name: '剑客', zh: '持剑的人', score: 0.5 }]
};
var searchArgs = [];
global.SemanticSearch = {
  init: async function () { return true; },
  stats: { entries: 1953, dim: 512, diag: { mode: 'server' } },
  searchMulti: async function (q, perDim, dims) {
    searchArgs.push({ q: q, dims: (dims || []).slice() });
    var out = {};
    (dims || []).forEach(function (k) { out[k] = CANDS[k] || []; });
    out._ms = 13;
    return out;
  },
  searchByDimension: async function () { return {}; },
  clearCache: function () {},
  isReady: true,
  error: null
};

/* ---------------- 载入被测代码 ---------------- */
global.LLM_CONFIG = { endpoint: 'https://api.example.com/v1', key: 'test-key', model: 'test-model', temperature: 0.2, maxTokens: 1500, timeoutMs: 5000 };
require('./llm-arbiter.js');

var fs = require('fs');
var vm = require('vm');
var html = fs.readFileSync(__dirname + '/test-arbiter.html', 'utf8');
var blocks = html.match(/<script>([\s\S]*?)<\/script>/g);
var inline = blocks[blocks.length - 1].replace(/^<script>/, '').replace(/<\/script>$/, '');
vm.runInThisContext(inline, { filename: 'test-arbiter.inline.js' });

/* ---------------- 断言工具 ---------------- */
var pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra !== undefined ? '   → ' + JSON.stringify(extra).slice(0, 400) : '')); }
}
function reset(q) {
  sent = []; queue = [];
  searchArgs = [];
  els.out.innerHTML = '';
  els.q.value = q;
}

var ROUTE_COMPOSE = JSON.stringify({ intent: 'compose', needRetrieval: true, dims: ['scene', 'light'], reason: '在描述画面' });
var ROUTE_CHAT = JSON.stringify({ intent: 'chat', needRetrieval: false, dims: [], reason: '闲聊' });
var DECIDE_OK = JSON.stringify({ role: null, scene: '深夜街道', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '只填提到的' });
var DECIDE_BAD = JSON.stringify({ role: null, scene: '瞎编的词', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' });

(async function () {

  /* ===== A. 正常创作流程：路由 → 检索 → 决策（一次通过） ===== */
  console.log('\n[A] 创作流程 — 路由 / 检索 / 决策 一次通过');
  reset('阴森的老房子，晚上有雾');
  queue.push(ok(ROUTE_COMPOSE));
  queue.push(ok(DECIDE_OK));
  await els.btnRun.click();

  var h = els.out.innerHTML;
  check('发出 2 次 LLM 请求（路由 + 决策）', sent.length === 2, sent.length);
  check('检索只用路由给的 2 个维度', searchArgs.length === 1 && searchArgs[0].dims.join(',') === 'scene,light', searchArgs);
  check('渲染了路由卡片', h.indexOf('⓪ 路由') >= 0);
  check('渲染了 needRetrieval', h.indexOf('needRetrieval = true') >= 0);
  check('渲染了反思轨迹（1 次）', h.indexOf('反思轨迹（共 1 次）') >= 0);
  check('渲染了最终决策', h.indexOf('最终决策') >= 0);
  check('选中项高亮出现', h.indexOf('深夜街道') >= 0);
  check('未检索维度标注正确', h.indexOf('本次未检索') >= 0);
  check('进度条无报错', /完成，总耗时/.test(els.prog.textContent), els.prog.textContent);

  /* ===== B. 闲聊分支：不检索、不决策 ===== */
  console.log('\n[B] 闲聊分支 — 只发 1 次路由请求');
  reset('今天好累啊');
  queue.push(ok(ROUTE_CHAT));
  await els.btnRun.click();

  var h2 = els.out.innerHTML;
  check('只发出 1 次请求', sent.length === 1, sent.length);
  check('完全没有调用检索', searchArgs.length === 0, searchArgs.length);
  check('提示跳过词库与决策', h2.indexOf('已跳过词库与决策') >= 0);
  check('渲染了路由卡片', h2.indexOf('⓪ 路由') >= 0);
  check('意图显示为闲聊', h2.indexOf('闲聊') >= 0);

  /* ===== C. 反思触发：第 1 次候选外 → 第 2 次通过 ===== */
  console.log('\n[C] 反思触发 — 校验失败后重试');
  reset('深夜的街道');
  queue.push(ok(ROUTE_COMPOSE));
  queue.push(ok(DECIDE_BAD));
  queue.push(ok(DECIDE_OK));
  await els.btnRun.click();

  var h3 = els.out.innerHTML;
  check('发出 3 次请求（路由 + 两次决策）', sent.length === 3, sent.length);
  check('轨迹显示共 2 次', h3.indexOf('反思轨迹（共 2 次）') >= 0);
  check('出现了「第 2 次」', h3.indexOf('第 2 次') >= 0);
  check('显示了纠错提示已发送', h3.indexOf('纠错提示已随本次请求发送') >= 0);
  check('显示了校验问题', h3.indexOf('校验：') >= 0);
  check('第二次请求确实带上了纠错块', /上一次回答被校验拒绝/.test(sent[2][1].content), sent[2][1].content.slice(-120));
  check('进度提示带重试次数', /重试 1 次/.test(els.prog.textContent), els.prog.textContent);

  /* ===== D. 回退渲染：候选卡片与选中标记 ===== */
  console.log('\n[D] 渲染细节 — 候选卡片 / 选中标记 / token 统计');
  var h4 = els.out.innerHTML;
  check('候选网格存在', h4.indexOf('每维度候选') >= 0);
  check('选中打勾', h4.indexOf('✓') >= 0);
  check('token 统计出现', /tokens：in 120 \/ out 60/.test(h4), h4.slice(0, 200));

  console.log('\n================ 结果 ================');
  console.log('通过 ' + pass + '　失败 ' + fail);
  process.exit(fail ? 1 : 0);

})().catch(function (e) {
  console.error('测试崩溃：', e);
  process.exit(2);
});
