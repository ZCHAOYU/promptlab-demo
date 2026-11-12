/* 第二轮：真实输入评估（当前生产路径：无路由，全 8 维检索 + 决策 + 反思）
 * 用法：node run-real.js
 * 产出 real-report.md / real-results.json
 */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./eval-lib.js');

const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

const ALL = L.ALL_DIMS;
const CN = L.DIM_CN;

/* 用户原话，一字未改 */
const REAL = [
  { id: 'r1', query: '我想要一个有山有水的地方' },
  { id: 'r2', query: '一个人在画画' },
  { id: 'r3', query: '我想要个水墨风格的那个东西' },
  { id: 'r4', query: '一个很漂亮的场景' },
  { id: 'r5', query: '一把形状非常奇怪的剑' },
  { id: 'r6', query: '一个男人在充满枫树的街道旁边的超市里面当收营员' },
  { id: 'r7', query: '野径无人，风自过林，' },
  { id: 'r8', query: '冷风秋瑟瑟' },
  { id: 'r9', query: '你在爪子' },
  { id: 'r10', query: '你好' }
];

async function one(query) {
  const t0 = Date.now();
  const qVec = await L.embed(query);
  const byDim = {};
  const top1 = {};
  ALL.forEach(k => {
    const list = L.rankInto(qVec, k, 5);
    byDim[k] = list;
    top1[k] = list[0] ? { name: list[0].name, score: list[0].score } : null;
  });
  const encMs = Date.now() - t0;

  const tD = Date.now();
  const res = await A.decideWithReflection(query, byDim, { maxRetries: 1 });
  const decMs = Date.now() - tD;

  const out = {
    id: '', query, encMs, decMs, totalMs: Date.now() - t0,
    ok: !!res.ok, attempts: res.attempts ? res.attempts.length : 0,
    retries: res.retries || 0, degraded: !!res.degraded,
    error: res.ok ? null : res.error,
    decision: {}, reason: '', conflicts: [], top1
  };
  if (res.ok) {
    ALL.forEach(k => { out.decision[k] = res.decision[k]; });
    out.intent = res.decision.intent || 'compose';
    out.askClarify = A.needsClarification(res.decision);
    out.reason = res.decision.reason || '';
    out.conflicts = res.decision.conflicts || [];
    out.progConflicts = A.checkConflicts(res.decision);
    out.tokens = res.usage ? { in: res.usage.prompt_tokens, out: res.usage.completion_tokens } : { in: 0, out: 0 };
    // 把每次尝试的明细留下来，否则重试率永远是黑箱
    out.attemptDetail = (res.attempts || []).map(function (a) {
      return {
        attempt: a.attempt, ms: a.ms, ok: a.ok, error: a.error || null,
        problems: a.problems || [],
        conflicts: (a.conflicts || []).map(function (c) { return c.rule + ':' + c.detail; }),
        picked: a.picked || [],
        hadHint: !!a.hint, willRetry: !!a.willRetry
      };
    });
  }
  return out;
}

(async () => {
  await L.healthCheck();
  console.log('真实输入评估：' + REAL.length + ' 条（生产路径，无路由）\n');

  const results = [];
  for (const r of REAL) {
    process.stdout.write('  ' + r.id + ' … ');
    let rec;
    try { rec = await one(r.query); }
    catch (e) { rec = { id: r.id, query: r.query, ok: false, error: e.message, decision: {} }; }
    rec.id = r.id;
    results.push(rec);
    const filled = ALL.filter(k => rec.decision[k]).length;
    console.log(rec.totalMs + 'ms / 填 ' + filled + ' 维' + (rec.error ? '　错误=' + rec.error : ''));
  }

  /* ---- 报告 ---- */
  const M = [];
  const p = s => M.push(s);
  p('# 第二轮评估：真实输入（' + REAL.length + ' 条）');
  p('');
  p('- 评估时间：' + new Date().toISOString());
  p('- 路径：**无路由**，全 8 维检索 → 决策 → 反思（当前生产默认）');
  p('- 模型：' + CFG.model + '　向量：bge-small-zh-v1.5 / 512 维 / 1953 条');
  p('- 输入来源：用户原话，一字未改');
  p('');

  p('## 一、总览');
  p('');
  const okR = results.filter(r => r.ok);
  const avg = (arr, f) => (arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0);
  p('| 指标 | 值 |');
  p('|---|---|');
  p('| 平均端到端耗时 | ' + Math.round(avg(okR, r => r.totalMs)) + ' ms |');
  p('| 平均 token | ' + Math.round(avg(okR, r => r.tokens.in + r.tokens.out)) + ' |');
  p('| 平均填充维度 | ' + avg(okR, r => ALL.filter(k => r.decision[k]).length).toFixed(1) + ' / 8 |');
  p('| 触发重试 | ' + results.reduce((s, r) => s + (r.retries || 0), 0) + ' |');
  p('| 失败 | ' + results.filter(r => !r.ok).length + ' |');
  p('');

  p('## 二、逐条结果');
  p('');
  results.forEach(r => {
    p('### ' + r.id + '　「' + r.query + '」');
    p('');
    if (!r.ok) {
      p('- **失败**：' + r.error);
      p('');
      return;
    }
    p('`' + r.totalMs + ' ms`　`' + (r.tokens.in + r.tokens.out) + ' token`' +
      '　`intent=' + r.intent + '`' +
      (r.askClarify ? '　**需要反问**' : '') +
      (r.retries ? '　`重试 ' + r.retries + ' 次`' : ''));
    p('');
    p('| 维度 | 选中 | 检索 top1（分数） |');
    p('|---|---|---|');
    ALL.forEach(k => {
      const v = r.decision[k];
      const t = r.top1[k];
      p('| ' + CN[k] + ' | ' + (v ? '**' + v + '**' : '· 空') + ' | ' +
        (t ? t.name + '（' + t.score + '）' : '—') + ' |');
    });
    p('');
    if (r.reason) p('> 理由：' + r.reason);
    if (r.conflicts.length) p('> 主动排除：' + r.conflicts.join('；'));
    if (r.progConflicts && r.progConflicts.length) p('> ⚠ 程序化检出的矛盾：' +
      r.progConflicts.map(c => '[' + c.rule + '] ' + c.detail).join('；'));
    p('');
  });

  fs.writeFileSync(path.join(__dirname, 'real-report.md'), M.join('\n'), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'real-results.json'), JSON.stringify({
    createdAt: new Date().toISOString(), model: CFG.model, results
  }, null, 2), 'utf8');

  console.log('\n已写入 real-report.md / real-results.json');
})().catch(e => { console.error('失败：', e); process.exit(1); });
