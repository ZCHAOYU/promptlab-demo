/* 验证 C（近似标记）与 B（带候选的反问） */
'use strict';
const L = require('./eval-lib.js');
const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

const CASES = [
  '我想要一个有山有水的地方',
  '野径无人，风自过林，',
  '冷风秋瑟瑟',
  '一个很漂亮的场景',
  '随便画点什么吧',
  '你好',
  '一把形状非常奇怪的剑',
  '我想要个水墨风格的那个东西'
];

(async () => {
  await L.healthCheck();
  console.log('阈值 weakThreshold = ' + A.config.weakThreshold + '\n');

  for (const q of CASES) {
    const qVec = await L.embed(q);
    const byDim = {};
    L.ALL_DIMS.forEach(k => { byDim[k] = L.rankInto(qVec, k, 5); });
    const res = await A.decideWithReflection(q, byDim, { maxRetries: 1 });
    if (!res.ok) { console.log('「' + q + '」失败：' + res.error); continue; }
    const d = res.decision;

    const picked = L.ALL_DIMS.filter(k => d[k]).map(k => {
      const m = d._meta[k];
      const w = A.isWeak(d, k);
      return L.DIM_CN[k] + '=' + d[k] + '(' + (m.score == null ? '?' : m.score) +
             ',第' + m.rank + '名' + (w ? ',近似' : '') + ')';
    });

    console.log('「' + q + '」');
    console.log('  intent=' + d.intent + '　选中：' + (picked.join('　') || '(无)'));
    const weak = A.weakDims(d);
    if (weak.length) console.log('  ⚠ 近似维度：' + weak.map(k => L.DIM_CN[k]).join('、'));

    const cl = A.buildClarify(d, byDim);
    if (cl) {
      console.log('  → 反问（' + cl.reason + '）：' + cl.question);
      console.log('    选项：' + cl.options.map(o => o.name + '[' + o.dimCN + ']').join(' / '));
    } else {
      console.log('  → 不反问');
    }
    console.log('');
  }
})().catch(e => { console.error(e); process.exit(1); });
