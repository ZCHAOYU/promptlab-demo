/* 第一轮评估跑批：路由开 vs 路由关
 *   A 路由开：route → 只查路由给的维度 → decideWithReflection
 *   B 路由关：查全部 8 维 → decideWithReflection（即 V5.0 行为）
 *
 * 用法：
 *   node run-eval.js                 # 跑一遍并出报告
 *   node run-eval.js --report-only   # 只用 eval-results.json 重新生成报告
 */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./eval-lib.js');

const ALL = L.ALL_DIMS;
const CN = L.DIM_CN;
const PER_DIM = 5;
const REPORT_ONLY = process.argv.indexOf('--report-only') >= 0;

let CFG = null, A = null;
if (!REPORT_ONLY) {
  CFG = L.loadConfig();
  require('../llm-arbiter.js');
  A = global.LLMArbiter;
  A.configure(CFG);
}

const set = JSON.parse(fs.readFileSync(path.join(__dirname, 'eval-set.json'), 'utf8'));

/* ================= 跑单臂 ================= */
async function runArm(q, dims, withRoute) {
  const t0 = Date.now();
  const rec = { dims: dims.slice(), routeMs: null, encodeMs: null, decideMs: null, totalMs: null };

  let routeDims = dims;
  let rTok = { in: 0, out: 0 };

  if (withRoute) {
    const r = await A.route(q);
    rec.routeMs = r.ms;
    if (!r.ok) {
      rec.routeError = r.error;
      rec.ok = false;
      rec.dims = [];              // 路由失败 = 一个维度都没查
      rec.decision = {};
      rec.totalMs = Date.now() - t0;
      return rec;
    }
    rec.intent = r.intent;
    rec.needRetrieval = r.needRetrieval;
    rec.routeDims = r.dims.slice();
    if (r.usage) rTok = { in: r.usage.prompt_tokens, out: r.usage.completion_tokens };
    rec.routeTokens = { in: rTok.in, out: rTok.out };

    if (!r.needRetrieval) {
      rec.ok = true;
      rec.skippedRetrieval = true;
      rec.decision = {};
      rec.dims = [];
      rec.totalMs = Date.now() - t0;
      rec.tokens = { in: rTok.in, out: rTok.out };   // 路由自身消耗必须计入
      return rec;
    }
    routeDims = r.dims;
    rec.dims = r.dims.slice();
  }

  const tE = Date.now();
  const qVec = await L.embed(q);
  const byDim = {};
  routeDims.forEach(k => { byDim[k] = L.rankInto(qVec, k, PER_DIM); });
  rec.encodeMs = Date.now() - tE;

  const tD = Date.now();
  const res = await A.decideWithReflection(q, byDim, { maxRetries: 1 });
  rec.decideMs = Date.now() - tD;
  rec.attempts = res.attempts ? res.attempts.length : 0;
  rec.retries = res.retries || 0;
  rec.degraded = !!res.degraded;
  rec.ok = !!res.ok;
  if (!res.ok) {
    rec.error = res.error;
    rec.totalMs = Date.now() - t0;
    return rec;
  }
  rec.decision = {};
  ALL.forEach(k => { rec.decision[k] = res.decision[k]; });
  rec.modelConflicts = res.decision.conflicts || [];
  rec.reason = res.decision.reason || '';
  rec.problems = res.decision._problems || [];
  rec.progConflicts = A.checkConflicts(res.decision);
  rec.usage = res.usage || null;
  rec.tokens = {
    in: rTok.in + (res.usage ? res.usage.prompt_tokens : 0),
    out: rTok.out + (res.usage ? res.usage.completion_tokens : 0)
  };
  rec.totalMs = Date.now() - t0;
  rec.attemptDetail = (res.attempts || []).map(function (a) {
    return {
      attempt: a.attempt, ms: a.ms, ok: a.ok, error: a.error || null,
      problems: a.problems || [],
      conflicts: (a.conflicts || []).map(function (c) { return c.rule + ':' + c.detail; }),
      willRetry: !!a.willRetry
    };
  });
  return rec;
}

/* ================= 指标 ================= */
function coverage(rec, expectDims) {
  if (!expectDims.length) return null;
  const got = expectDims.filter(k => rec.decision && rec.decision[k]).length;
  return { got, total: expectDims.length, rate: got / expectDims.length };
}
function filled(rec) {
  if (!rec.decision) return 0;
  return ALL.filter(k => rec.decision[k]).length;
}
function dilution(rec, expectDims) {
  if (!rec.decision) return null;
  const others = ALL.filter(k => expectDims.indexOf(k) < 0);
  if (!others.length) return null;
  const got = others.filter(k => rec.decision[k]).length;
  return { got, total: others.length, rate: got / others.length };
}
function routeRecall(recA, expectDims) {
  if (!expectDims.length || !recA.routeDims) return null;
  const got = expectDims.filter(k => recA.routeDims.indexOf(k) >= 0).length;
  return { got, total: expectDims.length, rate: got / expectDims.length };
}
const avg = (arr, f) => (arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0);
const fmtPct = v => (v == null ? '—' : Math.round(v * 100) + '%');
const sgn = v => (v > 0 ? '+' : '') + Math.round(v);

function pickStr(rec) {
  if (!rec || !rec.ok || !rec.decision) return '';
  return ALL.filter(k => rec.decision[k]).map(k => CN[k] + '=' + rec.decision[k]).join('；');
}

/* ================= 汇总 + 报告 ================= */
function summarise(results) {
  const okA = results.filter(r => r.A.ok && !r.A.skippedRetrieval);
  const okB = results.filter(r => r.B.ok);
  const cre = results.filter(r => r.A.ok && !r.A.skippedRetrieval && r.B.ok);
  const chat = results.filter(r => r.type === 'chat');

  return {
    n: results.length,
    covA: okA.map(r => r.covA && r.covA.rate).filter(v => v != null),
    covB: okB.map(r => r.covB && r.covB.rate).filter(v => v != null),
    dilA: okA.map(r => r.dilA && r.dilA.rate).filter(v => v != null),
    dilB: okB.map(r => r.dilB && r.dilB.rate).filter(v => v != null),
    recall: results.map(r => r.recalled && r.recalled.rate).filter(v => v != null),
    msA: avg(okA, r => r.A.totalMs), msB: avg(okB, r => r.B.totalMs),
    routeMs: avg(results.filter(r => r.A.routeMs != null), r => r.A.routeMs),
    tokA: avg(okA, r => r.A.tokens.in + r.A.tokens.out),
    tokB: avg(okB, r => r.B.tokens.in + r.B.tokens.out),
    dimsA: avg(okA, r => r.A.dims.length),
    conflictA: okA.reduce((s, r) => s + (r.A.progConflicts || []).length, 0),
    conflictB: okB.reduce((s, r) => s + (r.B.progConflicts || []).length, 0),
    retriesA: okA.reduce((s, r) => s + (r.A.retries || 0), 0),
    retriesB: okB.reduce((s, r) => s + (r.B.retries || 0), 0),
    degradedA: okA.filter(r => r.A.degraded).length,
    degradedB: okB.filter(r => r.B.degraded).length,
    failuresA: results.filter(r => !r.A.ok).length,
    failuresB: results.filter(r => !r.B.ok).length,
    routeFails: results.filter(r => r.A.routeError).length,
    routeFailList: results.filter(r => r.A.routeError)
      .map(r => r.id + '「' + String(r.query).slice(0, 10) + '」：' + r.A.routeError),
    // 关键拆分：创作类里，路由省下的决策时间 vs 路由自己花的时间
    creN: cre.length,
    creDecideA: avg(cre, r => r.A.decideMs || 0),
    creDecideB: avg(cre, r => r.B.decideMs || 0),
    creRoute: avg(cre, r => r.A.routeMs || 0),
    creEndA: avg(cre, r => r.A.totalMs || 0),
    creEndB: avg(cre, r => r.B.totalMs || 0),
    creTokA: avg(cre, r => r.A.tokens.in + r.A.tokens.out),
    creTokB: avg(cre, r => r.B.tokens.in + r.B.tokens.out),
    chatN: chat.length,
    chatMsA: avg(chat, r => r.A.totalMs || 0),
    chatMsB: avg(chat, r => r.B.totalMs || 0),
    chatTokA: avg(chat, r => r.A.tokens.in + r.A.tokens.out),
    chatTokB: avg(chat, r => r.B.tokens.in + r.B.tokens.out)
  };
}

function buildReport(results, sum) {
  const M = [];
  const p = s => M.push(s);

  p('# 第一轮评估报告（路由开 vs 路由关）');
  p('');
  p('- 用例集生成：' + set.createdAt);
  p('- 评估时间：' + new Date().toISOString());
  p('- 模型：' + (CFG ? CFG.model : set.model) + '　向量：bge-small-zh-v1.5 / 512 维 / 1953 条');
  p('- 用例：' + results.length + ' 条（自动 ' + results.filter(r => r.type === 'auto').length +
    ' / 刁难 ' + results.filter(r => r.type === 'hard').length +
    ' / 闲聊 ' + results.filter(r => r.type === 'chat').length + '）');
  p('');

  /* ---- 结论前置 ---- */
  p('## 零、结论（先看这个）');
  p('');
  p('**创作类 ' + sum.creN + ' 条：**');
  p('');
  p('- 路由让**决策**变快：' + Math.round(sum.creDecideA) + ' ms vs ' + Math.round(sum.creDecideB) +
    ' ms（**' + sgn(sum.creDecideA - sum.creDecideB) + ' ms**）');
  p('- 但路由自己花：**' + Math.round(sum.creRoute) + ' ms**');
  p('- **净结果：端到端 ' + sgn(sum.creEndA - sum.creEndB) + ' ms**（' +
    Math.round(sum.creEndA) + ' vs ' + Math.round(sum.creEndB) + '），token ' +
    sgn(sum.creTokA - sum.creTokB));
  p('- 判据：路由耗时 < ' + Math.round(-(sum.creDecideA - sum.creDecideB)) + ' ms 才能回本');
  p('');
  p('**闲聊类 ' + sum.chatN + ' 条：**');
  p('');
  p('- A（路由判定不检索）：' + Math.round(sum.chatMsA) + ' ms / ' + Math.round(sum.chatTokA) + ' token');
  p('- B（照样全查一遍）：' + Math.round(sum.chatMsB) + ' ms / ' + Math.round(sum.chatTokB) + ' token');
  p('- **省 ' + Math.round(sum.chatMsB - sum.chatMsA) + ' ms / ' + Math.round(sum.chatTokB - sum.chatTokA) + ' token**');
  p('');

  /* ---- 汇总 ---- */
  p('## 一、汇总对比');
  p('');
  p('| 指标 | 路由开（A） | 路由关（B） | 差 |');
  p('|---|---|---|---|');
  p('| 期望维度覆盖率（越高越好） | ' + fmtPct(avg(sum.covA, v => v)) + ' | ' + fmtPct(avg(sum.covB, v => v)) + ' | ' +
    sgn((avg(sum.covA, v => v) - avg(sum.covB, v => v)) * 100) + ' pt |');
  p('| 非期望维度掺水率（越低越保守） | ' + fmtPct(avg(sum.dilA, v => v)) + ' | ' + fmtPct(avg(sum.dilB, v => v)) + ' | ' +
    sgn((avg(sum.dilA, v => v) - avg(sum.dilB, v => v)) * 100) + ' pt |');
  p('| 平均端到端耗时（全部用例） | ' + Math.round(sum.msA) + ' ms | ' + Math.round(sum.msB) + ' ms | ' +
    sgn(sum.msA - sum.msB) + ' ms |');
  p('| 平均 token 合计 | ' + Math.round(sum.tokA) + ' | ' + Math.round(sum.tokB) + ' | ' +
    sgn(sum.tokA - sum.tokB) + ' |');
  p('| 平均检索维度数 | ' + sum.dimsA.toFixed(1) + ' / 8 | 8 / 8 | ' + (sum.dimsA - 8).toFixed(1) + ' |');
  p('| 程序化矛盾残留 | ' + sum.conflictA + ' | ' + sum.conflictB + ' | — |');
  p('| 触发重试 | ' + sum.retriesA + ' | ' + sum.retriesB + ' | — |');
  p('| 降级返回 | ' + sum.degradedA + ' | ' + sum.degradedB + ' | — |');
  p('| 失败（ok=false） | ' + sum.failuresA + ' | ' + sum.failuresB + ' | — |');
  p('| 其中路由未产出维度 | ' + sum.routeFails + ' | — | — |');
  p('');
  p('路由失败明细：' + (sum.routeFailList.length ? sum.routeFailList.join('；') : '无'));
  p('');

  /* ---- 按类型 ---- */
  p('## 二、按类型拆分');
  p('');
  p('| 类型 | 条数 | A token | B token | A 耗时 | B 耗时 |');
  p('|---|---|---|---|---|---|');
  [['auto', '自动生成（创作）'], ['hard', '刁难'], ['chat', '闲聊']].forEach(([t, label]) => {
    const rs = results.filter(r => r.type === t);
    if (!rs.length) return;
    const aOk = rs.filter(r => r.A.ok && !r.A.skippedRetrieval);
    const bOk = rs.filter(r => r.B.ok);
    p('| ' + label + ' | ' + rs.length + ' | ' +
      Math.round(avg(aOk, r => r.A.tokens.in + r.A.tokens.out)) + ' | ' +
      Math.round(avg(bOk, r => r.B.tokens.in + r.B.tokens.out)) + ' | ' +
      Math.round(avg(rs, r => r.A.totalMs || 0)) + ' ms | ' +
      Math.round(avg(rs, r => r.B.totalMs || 0)) + ' ms |');
  });
  p('');

  /* ---- 路由专属 ---- */
  p('## 三、路由专属指标');
  p('');
  p('- 期望维度召回率：**' + fmtPct(avg(sum.recall, v => v)) + '**（路由漏掉期望维度的情况）');
  p('- 平均路由耗时：' + Math.round(sum.routeMs) + ' ms');
  p('- 平均检索维度：' + sum.dimsA.toFixed(1) + ' / 8（砍掉 ' + (8 - sum.dimsA).toFixed(1) + ' 个）');
  p('');
  p('> 每个维度是**独立排序**的，路由不改变任何维度的候选与分数，只改变「模型能看见哪些维度」。');
  p('> 所以 A/B 的差异全部来自噪声维度是否进入提示词。');
  p('');

  /* ---- 逐条 ---- */
  p('## 四、逐条明细');
  p('');
  p('| # | 类型 | 输入 | 覆盖 A/B | 掺水 A/B | 耗时 A/B | 维度 A | 结论 A → B |');
  p('|---|---|---|---|---|---|---|---|');
  results.forEach((r, i) => {
    const cv = (r.covA ? r.covA.got + '/' + r.covA.total : '—') + ' / ' + (r.covB ? r.covB.got + '/' + r.covB.total : '—');
    const dl = (r.dilA ? r.dilA.got + '/' + r.dilA.total : '—') + ' / ' + (r.dilB ? r.dilB.got + '/' + r.dilB.total : '—');
    const tm = (r.A.totalMs || 0) + ' / ' + (r.B.totalMs || 0);
    const q = String(r.query || '（空）').replace(/\|/g, '\\|').slice(0, 26);
    p('| ' + (i + 1) + ' | ' + r.type + ' | ' + q + ' | ' + cv + ' | ' + dl + ' | ' + tm + ' | ' +
      (r.A.dims ? r.A.dims.length : 0) + ' | ' + (pickStr(r.A) || '×') + ' → ' + (pickStr(r.B) || '×') + ' |');
  });
  p('');

  /* ---- 差异 ---- */
  p('## 五、A/B 结论不同的用例');
  p('');
  const diff = results.filter(r => pickStr(r.A) !== pickStr(r.B));
  if (!diff.length) p('（无）');
  else diff.forEach(r => {
    p('### ' + r.id + '　「' + r.query + '」');
    p('');
    p('- 期望维度：' + (r.expectDims.length ? r.expectDims.map(k => CN[k]).join('、') : '（无，应尽量留空）'));
    p('- **A（查 ' + (r.A.dims ? r.A.dims.length : 0) + ' 维）**：' + (pickStr(r.A) || '（全部留空）') +
      (r.A.reason ? '　— ' + r.A.reason : ''));
    p('- **B（查 8 维）**：' + (pickStr(r.B) || '（全部留空）') +
      (r.B.reason ? '　— ' + r.B.reason : ''));
    p('');
  });

  /* ---- 局限 ---- */
  p('## 六、局限（必须读）');
  p('');
  p('1. **期望维度来自自动生成时的记录**，不是人工标注。自动生成的 query 偏「干净完整」，');
  p('   真实用户表达更碎，覆盖率可能存在**乐观偏差**。');
  p('2. **掺水率低不等于对**。用户没明说但合理的维度（如「暖洋洋的光」隐含琥珀色）会被算作掺水，');
  p('   所以这个指标衡量的是「保守 / 主动」，不是「对 / 错」。');
  p('3. **本轮没有任何人工判断**。要回答「哪个结果更好用」，需要盲评。');
  p('4. 每条只跑一次，LLM 输出有采样波动（同一用例两次跑结果可差 2–3 秒），单条不可过度解读。');
  p('5. 路由失败率 = ' + sum.routeFails + ' / ' + results.length + '。失败时 A 组退化为「什么都没查」。');
  p('');

  return M.join('\n');
}

/* ================= 主流程 ================= */
(async () => {
  let results, sum;

  if (REPORT_ONLY) {
    const saved = JSON.parse(fs.readFileSync(path.join(__dirname, 'eval-results.json'), 'utf8'));
    results = saved.results;
    console.log('载入存档：' + results.length + ' 条结果（不重新跑）');
  } else {
    await L.healthCheck();
    console.log('开始评估：' + set.cases.length + ' 条 × 2 组\n');
    results = [];
    for (let i = 0; i < set.cases.length; i++) {
      const c = set.cases[i];
      process.stdout.write('  [' + String(i + 1).padStart(2) + '/' + set.cases.length + '] ' + c.id + ' … ');
      let recA, recB;
      try { recA = await runArm(c.query, ALL, true); }
      catch (e) { recA = { ok: false, error: e.message, decision: {}, dims: [] }; }
      try {
        if (c.query && String(c.query).trim()) recB = await runArm(c.query, ALL, false);
        else recB = { ok: false, error: '空输入（B 组不做）', decision: {}, dims: [] };
      } catch (e) { recB = { ok: false, error: e.message, decision: {}, dims: [] }; }

      results.push({
        id: c.id, type: c.type, query: c.query, note: c.note, expectDims: c.expectDims,
        A: recA, B: recB,
        covA: coverage(recA, c.expectDims), covB: coverage(recB, c.expectDims),
        dilA: dilution(recA, c.expectDims), dilB: dilution(recB, c.expectDims),
        recalled: routeRecall(recA, c.expectDims)
      });
      console.log('A ' + (recA.totalMs || 0) + 'ms/' + filled(recA) + '维　B ' +
                  (recB.totalMs || 0) + 'ms/' + filled(recB) + '维');
    }
  }

  sum = summarise(results);
  const md = buildReport(results, sum);

  fs.writeFileSync(path.join(__dirname, 'eval-report.md'), md, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'eval-results.json'), JSON.stringify({
    createdAt: new Date().toISOString(), model: CFG ? CFG.model : set.model, summary: sum, results
  }, null, 2), 'utf8');

  console.log('\n================ 汇总 ================');
  console.log('覆盖率　　　A ' + fmtPct(avg(sum.covA, v => v)) + '　B ' + fmtPct(avg(sum.covB, v => v)));
  console.log('掺水率　　　A ' + fmtPct(avg(sum.dilA, v => v)) + '　B ' + fmtPct(avg(sum.dilB, v => v)));
  console.log('创作类决策　A ' + Math.round(sum.creDecideA) + 'ms　B ' + Math.round(sum.creDecideB) +
              'ms　（路由省 ' + Math.round(sum.creDecideB - sum.creDecideA) + 'ms，路由自花 ' + Math.round(sum.creRoute) + 'ms）');
  console.log('创作类端到端 A ' + Math.round(sum.creEndA) + 'ms　B ' + Math.round(sum.creEndB) +
              'ms　净 ' + sgn(sum.creEndA - sum.creEndB) + 'ms');
  console.log('创作类token　A ' + Math.round(sum.creTokA) + '　B ' + Math.round(sum.creTokB) +
              '　净 ' + sgn(sum.creTokA - sum.creTokB));
  console.log('闲聊类　　　A ' + Math.round(sum.chatMsA) + 'ms/' + Math.round(sum.chatTokA) + 'tok　B ' +
              Math.round(sum.chatMsB) + 'ms/' + Math.round(sum.chatTokB) + 'tok');
  console.log('路由召回　　' + fmtPct(avg(sum.recall, v => v)) + '　失败 ' + sum.routeFails + ' 次');
  console.log('\n已写入 eval-report.md / eval-results.json');
})().catch(e => { console.error('评估失败：', e); process.exit(1); });
