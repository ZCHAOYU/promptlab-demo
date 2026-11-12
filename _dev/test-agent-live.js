/* 真机联调：真 DeepSeek + 真向量库 + 本地 /api/embed
 * 验证 ⓪ 路由 → ① 检索（只查路由给的维度）→ ②③ 决策 + 反思 的完整链路
 * 用法：node test-agent-live.js
 */
'use strict';

global.window = global;

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.join(__dirname, '..');
const BASE = 'http://127.0.0.1:8777';
const QUERY_PREFIX = '为这个句子生成表示以用于检索相关文章：';
const DIMS = ['role', 'scene', 'style', 'light', 'composition', 'color', 'atmosphere', 'quality'];
const DIM_CN = { role: '角色', scene: '场景', style: '风格', light: '光线', composition: '构图', color: '色彩', atmosphere: '氛围', quality: '画质' };

/* ---------- 1. 配置 ---------- */
const cfgSrc = fs.readFileSync(path.join(ROOT, 'config.local.js'), 'utf8');
new Function('window', cfgSrc)(global);
const CFG = global.LLM_CONFIG;
if (!CFG || !CFG.key) { console.error('config.local.js 读取失败'); process.exit(1); }

// 你每天都清 key，所以优先用环境变量，免得每次改文件：
//   $env:DEEPSEEK_API_KEY = 'sk-...'; node promptlab/test-agent-live.js
const ENV_KEY = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY;
const keySrc = ENV_KEY ? '环境变量' : 'config.local.js';
if (ENV_KEY) CFG.key = ENV_KEY;

console.log('LLM: ' + CFG.model + ' @ ' + CFG.endpoint +
            '  key 已加载(' + CFG.key.length + '位, 来自' + keySrc + ')');

/* ---------- 2. 向量库 ---------- */
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'vectors.meta.json'), 'utf8'));
const rawBuf = fs.readFileSync(path.join(ROOT, 'vectors.bin'));
const ab = rawBuf.buffer.slice(rawBuf.byteOffset, rawBuf.byteOffset + rawBuf.byteLength);
const matrix = new Float32Array(ab);
const DIM_V = meta.dim || 512;
const COUNT = Math.floor(matrix.length / DIM_V);
console.log('向量库: ' + COUNT + ' 条 × ' + DIM_V + ' 维　entries: ' + entries.length + ' 条');
if (COUNT !== entries.length) console.log('  ⚠ 条数不一致，按较小值使用');

/* ---------- 3. 编码 + 排序 ---------- */
async function embed(text) {
  const r = await fetch(BASE + '/api/embed', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts: [QUERY_PREFIX + text] })
  });
  if (!r.ok) throw new Error('/api/embed HTTP ' + r.status);
  const j = await r.json();
  if (!j.ok) throw new Error('/api/embed: ' + j.error);
  const v = Float32Array.from(j.vectors[0]);
  let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  const n = Math.sqrt(s) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= n;
  return v;
}

function rankInto(qVec, kind, perDim) {
  const out = [];
  for (let i = 0; i < COUNT; i++) {
    const e = entries[i];
    if (e.kind !== kind) continue;
    let dot = 0;
    const off = i * DIM_V;
    for (let d = 0; d < DIM_V; d++) dot += matrix[off + d] * qVec[d];
    out.push({ i, s: dot });
  }
  out.sort((a, b) => b.s - a.s);
  return out.slice(0, perDim).map(c => {
    const e = entries[c.i];
    return { id: e.id, kind: e.kind, name: e.name, zh: e.zh, score: Math.round(c.s * 1000) / 1000 };
  });
}

/* ---------- 4. 载入 arbiter ---------- */
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

/* ---------- 5. 只跑检索（不依赖 LLM） ---------- */
async function retrievalOnly(q, dims) {
  const tEnc = Date.now();
  const qVec = await embed(q);
  const encMs = Date.now() - tEnc;
  console.log('\n① 检索（降级模式，不需要 LLM）　编码 ' + encMs + ' ms　维度 ' + dims.length + '/8\n');
  const tops = [];
  dims.forEach(k => {
    const list = rankInto(qVec, k, 5);
    console.log('   ' + DIM_CN[k] + ' (' + k + ')　候选 ' + list.length + ' 条');
    list.forEach((h, idx) => {
      console.log('      ' + (idx + 1) + '. ' + String(h.score).padEnd(6) + ' ' + h.name +
                  (h.zh && h.zh !== h.name ? '　— ' + String(h.zh).slice(0, 40) : ''));
    });
    if (!list.length) console.log('      （该维度无候选）');
    tops.push((list[0] || {}).score || 0);
  });
  const avg = tops.reduce((a, b) => a + b, 0) / (tops.length || 1);
  console.log('\n   top1 分数：' + tops.map((s, i) => DIM_CN[dims[i]] + '=' + s).join('  '));
  console.log('   平均 top1 = ' + Math.round(avg * 1000) / 1000 +
              '　最低 = ' + Math.min.apply(null, tops) +
              '\n   （阈值参考：<0.45 基本是噪声，可考虑触发二次检索）');
}

/* ---------- 6. 跑一个用例 ---------- */
async function runCase(label, q) {
  console.log('\n' + '='.repeat(72));
  console.log('用例：' + label);
  console.log('输入：' + q);
  console.log('='.repeat(72));

  const t0 = Date.now();

  // ⓪ 路由
  const route = await A.route(q);
  if (!route.ok) {
    const authFail = /HTTP 401|Authentication Fails/.test(route.error);
    console.log('\n⓪ 路由失败：' + route.error.slice(0, 160));
    if (authFail) console.log('   → API key 无效，LLM 环节整体不可用。改 config.local.js 里的 key 后重跑。');
    // 降级：仍然把检索数据跑出来（这部分不依赖 LLM）
    await retrievalOnly(q, (route.dims && route.dims.length) ? route.dims : DIMS);
    return;
  }
  console.log('\n⓪ 路由　' + route.ms + ' ms　意图=' + route.intent +
              '　needRetrieval=' + route.needRetrieval);
  console.log('   维度：' + (route.dims.length ? route.dims.map(k => DIM_CN[k] + '(' + k + ')').join(' / ') : '（不检索）'));
  if (route.dimsDropped) console.log('   过滤掉非法维度 ' + route.dimsDropped + ' 个');
  if (route.reason) console.log('   理由：' + route.reason);

  if (!route.needRetrieval) {
    console.log('\n→ 不检索、不决策，直接结束。总耗时 ' + (Date.now() - t0) + ' ms');
    return;
  }

  // ① 检索（只查路由给的维度）
  const tEnc = Date.now();
  const qVec = await embed(q);
  const encMs = Date.now() - tEnc;
  const byDim = {};
  route.dims.forEach(k => { byDim[k] = rankInto(qVec, k, 5); });
  console.log('\n① 检索　编码 ' + encMs + ' ms　维度数 ' + route.dims.length + '/8');

  route.dims.forEach(k => {
    const list = byDim[k] || [];
    const top = list[0];
    console.log('   ' + DIM_CN[k].padEnd(3) + ' top1=' + (top ? top.score : '空') +
                (top ? '  ' + top.name : ''));
  });

  // ②③ 决策 + 反思
  const tDec = Date.now();
  const res = await A.decideWithReflection(q, byDim, { maxRetries: 1 });
  const decMs = Date.now() - tDec;

  if (!res.ok) {
    console.log('\n②③ 失败：' + res.error + '　' + decMs + ' ms');
    return;
  }

  console.log('\n②③ 决策 + 反思　' + decMs + ' ms　尝试 ' + res.attempts.length + ' 次' +
              (res.degraded ? '　【降级返回】' : ''));
  res.attempts.forEach(a => {
    console.log('   第 ' + a.attempt + ' 次：' + a.ms + ' ms' +
                (a.error ? '　错误=' + a.error : '') +
                (a.problems && a.problems.length ? '　校验问题=' + a.problems.join('；') : '') +
                (a.conflicts && a.conflicts.length ? '　矛盾=' + a.conflicts.map(c => c.rule).join(',') : '') +
                (a.willRetry ? '　→ 重试' : ''));
  });

  console.log('\n选中：');
  DIMS.forEach(k => {
    const v = res.decision[k];
    const queried = !!(byDim[k] && byDim[k].length);
    let mark;
    if (v) mark = '✓ ' + v;
    else if (!queried) mark = '— （本次未检索）';
    else mark = '· （用户未提及）';
    console.log('   ' + DIM_CN[k].padEnd(3) + ' ' + mark);
  });
  if (res.decision.reason) console.log('\n理由：' + res.decision.reason);
  if (res.decision.conflicts && res.decision.conflicts.length) {
    console.log('模型主动排除：' + res.decision.conflicts.join('；'));
  }
  if (res.usage) {
    console.log('\ntoken：in ' + res.usage.prompt_tokens + ' / out ' + res.usage.completion_tokens +
                '　合计 ' + (res.usage.prompt_tokens + res.usage.completion_tokens));
  }
  console.log('总耗时 ' + (Date.now() - t0) + ' ms');
}

/* ---------- 6. 主流程 ---------- */
(async () => {
  // 健康检查
  try {
    const h = await (await fetch(BASE + '/api/health')).json();
    if (!h.ok) throw new Error('health 返回 ok=false');
    console.log('服务端就绪：' + h.model + '　threads=' + h.threads + '　vectors=' + h.vectors + '\n');
  } catch (e) {
    console.error('本地服务不可达（' + BASE + '）：' + e.message);
    console.error('先开一个终端跑：python serve.py 8777');
    process.exit(1);
  }

  await runCase('多维度创作（路由该只选 3 维）', '阴森的老房子，晚上，有雾');
  await runCase('闲聊（应跳过检索与决策）', '今天好累，随便聊聊');
  await runCase('矛盾压力测试（晚上 + 晨雾光）', '深夜的老房子，要晨雾光那种清透感');
  console.log('\n全部用例跑完。');
})().catch(e => { console.error('崩溃：', e); process.exit(2); });
