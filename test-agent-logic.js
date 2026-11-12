/* 桩测试：不联网，验证 route / checkConflicts / decideWithReflection 的逻辑 */
'use strict';

global.window = global;

var sent = [];          // 每次请求的 messages
var queue = [];         // 预设响应队列

function ok(content) {
  return {
    ok: true,
    json: async function () {
      return { choices: [{ message: { content: content } }], usage: { prompt_tokens: 10, completion_tokens: 5 } };
    }
  };
}
function httpFail(code, text) {
  return { ok: false, status: code, text: async function () { return text || 'err'; } };
}

global.fetch = async function (url, opts) {
  var body = JSON.parse(opts.body);
  sent.push(body.messages);
  if (!queue.length) throw new Error('队列空了：第 ' + sent.length + ' 次请求没有预设响应');
  return queue.shift();
};

require('./llm-arbiter.js');
var A = global.LLMArbiter;
A.configure({ endpoint: 'https://api.example.com/v1', key: 'test-key', model: 'test-model', timeoutMs: 5000, routeTimeoutMs: 5000 });

var CANDS = {
  scene: [{ name: '深夜街道', zh: '夜晚的城市街道' }, { name: '清晨湖边', zh: '清晨的湖' }],
  light: [{ name: '晨雾柔光', zh: '清晨的雾' }, { name: '霓虹光', zh: '霓虹' }],
  role: [{ name: '剑客', zh: '持剑的人' }],
  atmosphere: [{ name: '肃穆', zh: '庄重' }, { name: '温馨', zh: '温暖' }]
};

var pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra ? '   → ' + JSON.stringify(extra) : '')); }
}
function reset() { sent = []; queue = []; }

const EMPTY_DECISION = JSON.stringify({
  role: null, scene: null, style: null, light: null, composition: null,
  color: null, atmosphere: null, quality: null, conflicts: [], reason: ''
});

(async function () {

  /* ============ 1. route：白名单过滤 ============ */
  console.log('\n[1] route — dims 白名单过滤');
  reset();
  queue.push(ok(JSON.stringify({ intent: 'compose', needRetrieval: true, dims: ['scene', 'Scene', 'light', 'bogus'], reason: 'x' })));
  var r1 = await A.route('阴森的老房子，晚上有雾');
  check('ok', r1.ok === true, r1);
  check('只保留 scene/light', JSON.stringify(r1.dims) === JSON.stringify(['scene', 'light']), r1.dims);
  check('非法维度计数 = 1', r1.dimsDropped === 1, r1.dimsDropped);
  check('intent 归一', r1.intent === 'compose', r1.intent);

  /* ============ 2. route：chat 强制不检索 ============ */
  console.log('\n[2] route — chat 即使模型说检索也强制关掉');
  reset();
  queue.push(ok(JSON.stringify({ intent: 'chat', needRetrieval: true, dims: ['scene'], reason: '' })));
  var r2 = await A.route('今天天气怎么样');
  check('needRetrieval 被压成 false', r2.needRetrieval === false, r2.needRetrieval);
  check('intent = chat', r2.intent === 'chat', r2.intent);

  /* ============ 3. route：要检索但没给维度 → 兜底全查 ============ */
  console.log('\n[3] route — needRetrieval 但 dims 为空 → 兜底 8 维');
  reset();
  queue.push(ok(JSON.stringify({ intent: 'compose', needRetrieval: true, dims: [], reason: '' })));
  var r3 = await A.route('画个东西');
  check('兜底到 9 维', r3.dims.length === 9, r3.dims);

  /* ============ 4. route：非法 JSON ============ */
  console.log('\n[4] route — 非法 JSON 返回 ok:false');
  reset();
  queue.push(ok('这不是 JSON'));
  var r4 = await A.route('随便');
  check('ok === false', r4.ok === false, r4);
  check('错误信息正确', /不是合法 JSON/.test(r4.error), r4.error);

  /* ============ 5. route：HTTP 失败 ============ */
  console.log('\n[5] route — HTTP 500');
  reset();
  queue.push(httpFail(500, 'boom'));
  var r5 = await A.route('随便');
  check('ok === false', r5.ok === false, r5);
  check('带状态码', /HTTP 500/.test(r5.error), r5.error);

  /* ============ 6. checkConflicts ============ */
  console.log('\n[6] checkConflicts — 程序化矛盾检测');
  var c1 = A.checkConflicts({ scene: '深夜街道', light: '晨雾柔光' });
  check('深夜 × 晨雾 → 时间冲突', c1.length === 1 && c1[0].rule === '时间', c1);
  var c2 = A.checkConflicts({ scene: '深夜街道', light: '霓虹光' });
  check('深夜 × 霓虹 → 无冲突', c2.length === 0, c2);
  var c3 = A.checkConflicts({ atmosphere: '肃穆', scene: '深夜街道' });
  check('肃穆 × 深夜 → 无冲突', c3.length === 0, c3);
  var c4 = A.checkConflicts({ atmosphere: '肃穆' });
  check('只选了一项 → 无冲突', c4.length === 0, c4);

  /* ============ 7. 反思：候选外的值 → 重试 → 成功 ============ */
  console.log('\n[7] decideWithReflection — 候选外的值触发重试并成功');
  reset();
  queue.push(ok(JSON.stringify({ role: null, scene: '不存在的词', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' })));
  queue.push(ok(JSON.stringify({ role: null, scene: '深夜街道', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' })));
  var d7 = await A.decideWithReflection('深夜的街道', CANDS, { maxRetries: 1 });
  check('ok', d7.ok === true, d7);
  check('重试 1 次', d7.retries === 1, d7.retries);
  check('共 2 次请求', d7.attempts.length === 2, d7.attempts.length);
  check('最终选中 深夜街道', d7.decision.scene === '深夜街道', d7.decision.scene);
  check('第 1 次标记 willRetry', d7.attempts[0].willRetry === true, d7.attempts[0]);
  var hintMsg = sent[1][1].content;
  check('第 2 次请求带纠错提示', /上一次回答被校验拒绝/.test(hintMsg) && /候选之外/.test(hintMsg), hintMsg.slice(-160));

  /* ============ 8. 反思：矛盾触发重试 ============ */
  console.log('\n[8] decideWithReflection — 矛盾触发重试');
  reset();
  queue.push(ok(JSON.stringify({ role: null, scene: '深夜街道', style: null, light: '晨雾柔光', composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' })));
  queue.push(ok(JSON.stringify({ role: null, scene: '深夜街道', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' })));
  var d8 = await A.decideWithReflection('深夜的街道', CANDS, { maxRetries: 1 });
  check('重试 1 次', d8.retries === 1, d8.retries);
  check('第 1 次检出时间冲突', d8.attempts[0].conflicts.length === 1 && d8.attempts[0].conflicts[0].rule === '时间', d8.attempts[0].conflicts);
  check('最终 light 为 null', d8.decision.light === null, d8.decision.light);
  check('第二次提示带矛盾说明', /互相矛盾/.test(sent[1][1].content), true);

  /* ============ 9. 反思：次数用尽 → 降级 ============ */
  console.log('\n[9] decideWithReflection — 重试用尽 → 降级返回');
  reset();
  var bad = JSON.stringify({ role: null, scene: '瞎编的词', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' });
  queue.push(ok(bad)); queue.push(ok(bad));
  var d9 = await A.decideWithReflection('深夜的街道', CANDS, { maxRetries: 1 });
  check('ok 仍为 true（返回可用部分）', d9.ok === true, d9.ok);
  check('degraded = true', d9.degraded === true, d9.degraded);
  check('scene 被丢弃为 null', d9.decision.scene === null, d9.decision.scene);
  check('共 2 次尝试', d9.attempts.length === 2, d9.attempts.length);

  /* ============ 10. 反思：软问题不重试 ============ */
  console.log('\n[10] decideWithReflection — 模糊匹配（软问题）不重试');
  reset();
  queue.push(ok(JSON.stringify({ role: null, scene: '深夜街道（夜晚的城市街道）', style: null, light: null, composition: null, color: null, atmosphere: null, quality: null, conflicts: [], reason: '' })));
  var d10 = await A.decideWithReflection('深夜的街道', CANDS, { maxRetries: 1 });
  check('只请求 1 次', d10.attempts.length === 1, d10.attempts.length);
  check('retries = 0', d10.retries === 0, d10.retries);
  check('救回 深夜街道', d10.decision.scene === '深夜街道', d10.decision.scene);
  check('problems 里记了模糊修正', /模糊匹配/.test(d10.decision._problems.join('')), d10.decision._problems);

  /* ============ 11. 反思：非法 JSON 重试 ============ */
  console.log('\n[11] decideWithReflection — 非法 JSON 重试');
  reset();
  queue.push(ok('```json not really'));
  queue.push(ok(EMPTY_DECISION));
  var d11 = await A.decideWithReflection('随便', CANDS, { maxRetries: 1 });
  check('ok', d11.ok === true, d11);
  check('重试 1 次', d11.retries === 1, d11.retries);
  check('第 1 次 error 记录', /不是合法 JSON/.test(d11.attempts[0].error), d11.attempts[0].error);

  /* ============ 12. 反思：HTTP 失败不重试（避免二次超时） ============ */
  console.log('\n[12] decideWithReflection — HTTP 失败不重试');
  reset();
  queue.push(httpFail(429, 'rate limit'));
  var d12 = await A.decideWithReflection('随便', CANDS, { maxRetries: 1 });
  check('ok === false', d12.ok === false, d12);
  check('只请求 1 次', d12.attempts.length === 1, d12.attempts.length);

  /* ============ 13. decide() 原行为未变 ============ */
  console.log('\n[13] decide() — 原 V5 行为保持不变');
  reset();
  queue.push(ok(EMPTY_DECISION));
  var d13 = await A.decide('没有任何描述的输入', CANDS);
  check('ok', d13.ok === true, d13);
  check('decision 存在', !!d13.decision, d13);
  check('usage 透传', d13.usage && d13.usage.prompt_tokens === 10, d13.usage);
  check('带 _problems 字段', Array.isArray(d13.decision._problems), d13.decision);
  check('没有 attempts 字段（decide 不带反思）', d13.attempts === undefined, Object.keys(d13));

  /* ============ 14. maxRetries = 0 ============ */
  console.log('\n[14] decideWithReflection — maxRetries:0 等于不重试');
  reset();
  queue.push(ok(bad));
  var d14 = await A.decideWithReflection('深夜的街道', CANDS, { maxRetries: 0 });
  check('只请求 1 次', d14.attempts.length === 1, d14.attempts.length);
  check('degraded = true', d14.degraded === true, d14.degraded);

  console.log('\n================ 结果 ================');
  console.log('通过 ' + pass + '　失败 ' + fail);
  process.exit(fail ? 1 : 0);
})().catch(function (e) {
  console.error('测试崩溃：', e);
  process.exit(2);
});
