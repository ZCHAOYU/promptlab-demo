/* 验证 intent 三分支 + 反问触发条件 */
'use strict';
const L = require('./eval-lib.js');
const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

const CASES = [
  { q: '一个很漂亮的场景', want: 'unclear → 该反问' },
  { q: '随便画点什么吧', want: 'unclear → 该反问' },
  { q: '你好', want: 'chat → 不该反问' },
  { q: '帮我写一首关于秋天的诗', want: 'chat → 不该反问' },
  { q: '你在爪子', want: 'chat → 不该反问' },
  { q: '一把形状非常奇怪的剑', want: 'compose → 不反问' },
  { q: '野径无人，风自过林', want: 'compose → 不反问' },
  { q: '我想要个水墨风格的那个东西', want: 'compose → 不反问' }
];

(async () => {
  await L.healthCheck();
  let sure = 0;
  for (const c of CASES) {
    const qVec = await L.embed(c.q);
    const byDim = {};
    L.ALL_DIMS.forEach(k => { byDim[k] = L.rankInto(qVec, k, 5); });
    const res = await A.decideWithReflection(c.q, byDim, { maxRetries: 1 });
    if (!res.ok) { console.log('「' + c.q + '」 失败：' + res.error); continue; }
    const d = res.decision;
    const filled = L.ALL_DIMS.filter(k => d[k]).length;
    const intent = d.intent;
    const ask = A.needsClarification(d);
    const wantAsk = c.want.indexOf('该反问') >= 0 && c.want.indexOf('不该反问') < 0;
    const ok = ask === wantAsk;
    if (ok) sure++;
    console.log((ok ? 'PASS  ' : 'FAIL  ') + '「' + c.q + '」');
    console.log('        intent=' + intent + '  填充 ' + filled + ' 维  反问=' + (ask ? '是' : '否') + '　（期望：' + c.want + '）');
    if (ask) {
      console.log('        反问内容：');
      A.buildClarifyQuestion(d).split('\n').forEach(l => console.log('          ' + l));
    }
    console.log('');
  }
  console.log('通过 ' + sure + ' / ' + CASES.length);
  process.exit(sure === CASES.length ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
