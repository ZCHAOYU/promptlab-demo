/* 查出「选中项的真实分数」和「它在候选里的名次」——判断填得勉强还是扎实 */
'use strict';
const L = require('./eval-lib.js');
const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

const saved = JSON.parse(require('fs').readFileSync(__dirname + '/real-results.json', 'utf8'));

(async () => {
  await L.healthCheck();
  const rows = [];
  for (const r of saved.results) {
    if (!r.ok) continue;
    const qVec = await L.embed(r.query);
    for (const k of L.ALL_DIMS) {
      const v = r.decision[k];
      if (!v) continue;
      const list = L.rankInto(qVec, k, 5);
      const idx = list.findIndex(h => h.name === v);
      rows.push({
        id: r.id, dim: k, name: v,
        score: idx >= 0 ? list[idx].score : null,
        rank: idx >= 0 ? idx + 1 : null,
        top1: list[0] ? list[0].name : null,
        top1Score: list[0] ? list[0].score : null
      });
    }
  }
  console.log('选中项共 ' + rows.length + ' 个\n');
  console.log('id    维度      选中            分数   名次   top1(分数)');
  for (const x of rows) {
    console.log(
      (x.id + '    ').slice(0, 6) +
      (L.DIM_CN[x.dim] + '      ').slice(0, 8) +
      (x.name + '                ').slice(0, 15) +
      String(x.score === null ? '超出top5' : x.score).padEnd(7) +
      String(x.rank === null ? '>' : x.rank).padEnd(6) +
      (x.top1 || '-') + '(' + (x.top1Score == null ? '-' : x.top1Score) + ')'
    );
  }
  const scored = rows.filter(x => x.score != null);
  const low = scored.filter(x => x.score < 0.45);
  const offTop = scored.filter(x => x.rank > 1);
  console.log('\n有分数记录的 ' + scored.length + ' 个：');
  console.log('  低于 0.45（勉强）: ' + low.length + ' 个  ' + (low.length / scored.length * 100).toFixed(0) + '%');
  console.log('  不是 top1（模型自己换的）: ' + offTop.length + ' 个');
  console.log('  平均分: ' + (scored.reduce((s, x) => s + x.score, 0) / scored.length).toFixed(3));
})().catch(e => { console.error(e); process.exit(1); });
