/* 规则 8（评价词留空）与诗句规则的功能验证 */
'use strict';
const L = require('./eval-lib.js');
const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

const CASES = [
  { q: '高级感强的画面', want: '评价词 → 应几乎全空' },
  { q: '我想要一个有质感的东西', want: '评价词 → 应几乎全空' },
  { q: '大漠孤烟直', want: '诗句 → 应填出维度' },
  { q: '帮我写一首关于秋天的诗', want: '指令 → 应全空' }
];

(async () => {
  await L.healthCheck();
  for (const c of CASES) {
    const qVec = await L.embed(c.q);
    const byDim = {};
    L.ALL_DIMS.forEach(k => { byDim[k] = L.rankInto(qVec, k, 5); });
    const res = await A.decideWithReflection(c.q, byDim, { maxRetries: 1 });
    const filled = res.ok ? L.ALL_DIMS.filter(k => res.decision[k]).map(k => L.DIM_CN[k] + '=' + res.decision[k]) : [];
    console.log('「' + c.q + '」　（期望：' + c.want + '）');
    console.log('  填充 ' + filled.length + ' 维：' + (filled.join('；') || '(全空)'));
    console.log('  理由：' + (res.ok ? res.decision.reason : res.error));
    if (res.attempts && res.attempts.length > 1) {
      console.log('  尝试：' + res.attempts.map(a => a.attempt + (a.ok ? '✓' : '✗')).join(' → '));
    }
    console.log('');
  }
})().catch(e => { console.error(e); process.exit(1); });
