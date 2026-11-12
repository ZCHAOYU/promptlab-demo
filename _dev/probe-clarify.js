/* 验证 B+：unclear 时模型生成的追问是否真的相关 */
'use strict';
const L = require('./eval-lib.js');
const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

const CASES = [
  '一个很漂亮的场景',
  '随便画点什么吧',
  '我想要个高级感',
  '来点不一样的'
];

(async () => {
  await L.healthCheck();
  for (const q of CASES) {
    const qVec = await L.embed(q);
    const byDim = {};
    L.ALL_DIMS.forEach(k => { byDim[k] = L.rankInto(qVec, k, 5); });
    const res = await A.decideWithReflection(q, byDim, { maxRetries: 1 });
    const intent = res.ok ? res.decision.intent : '?';
    console.log('「' + q + '」　intent=' + intent);

    if (intent !== 'unclear') { console.log('  → 不是 unclear，走常规反问/不反问\n'); continue; }

    const fake = A.buildClarify(res.decision, byDim);
    console.log('  旧方案（候选词）：' + (fake ? fake.options.map(o => o.name).join(' / ') : '无'));

    const cl = await A.suggestClarify(q);
    if (!cl) { console.log('  ✗ 生成失败\n'); continue; }
    console.log('  新方案（' + cl.ms + ' ms）问：' + cl.question);
    console.log('    选项：' + cl.options.map(o => '[' + o.name + ']').join(' '));
    console.log('');
  }
})().catch(e => { console.error(e); process.exit(1); });
