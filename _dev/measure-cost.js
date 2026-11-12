'use strict';
/* 成本测量：调用前后查余额，算出每次生成的费用与 37 元能跑多少次 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com';

const src = fs.readFileSync(path.join(ROOT, 'config.local.js'), 'utf8');
new Function('window', 'global', 'module', src).call({}, global, global, {});
const CFG = global.LLM_CONFIG || window.LLM_CONFIG;
const KEY = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY || (CFG && CFG.key);
if (!KEY) { console.log('没有可用 key'); process.exit(1); }

async function balance() {
  const r = await fetch(BASE + '/user/balance', {
    headers: { Authorization: 'Bearer ' + KEY }
  });
  if (!r.ok) {
    const t = await r.text();
    return { ok: false, status: r.status, msg: t.slice(0, 160) };
  }
  return { ok: true, data: await r.json() };
}

(async () => {
  const b0 = await balance();
  if (!b0.ok) {
    console.log('余额查询失败 HTTP ' + b0.status + '：' + b0.msg);
    console.log('（如果 401，说明今天的 key 已失效，需要换一个新的）');
    process.exit(2);
  }
  console.log('调用前余额:', JSON.stringify(b0.data));

  /* 跑几次代表性调用：模拟方案 C 的一次完整生成 */
  await import('../llm-arbiter.js').catch(() => require('../llm-arbiter.js'));
  const A = global.LLMArbiter;
  A.configure(Object.assign({}, CFG, { key: KEY }));

  const CANDS = {};
  ['scene', 'character', 'style', 'lighting', 'composition', 'color', 'atmosphere', 'quality', 'subject']
    .forEach(k => { CANDS[k] = [{ name: '示例' + k, zh: '示例描述', score: 0.5 }]; });

  const INPUTS = ['一位穿宇航服的骑士', '一只六足机械兽', '一位量子程序员'];
  let tin = 0, tout = 0;
  for (const q of INPUTS) {
    const r = await A.decideWithReflection(q, CANDS, { maxRetries: 0 });
    if (r.usage) { tin += r.usage.prompt_tokens; tout += r.usage.completion_tokens; }
    console.log('  「' + q + '」 ok=' + r.ok + ' tokens in/out = ' +
      (r.usage ? r.usage.prompt_tokens + '/' + r.usage.completion_tokens : '—'));
  }

  const b1 = await balance();
  console.log('\n调用后余额:', JSON.stringify(b1.data));
  console.log('本轮 token 合计: in ' + tin + ' / out ' + tout + '（共 ' + INPUTS.length + ' 次）');

  const get = (b) => {
    const arr = (b && b.balance_infos) || [];
    const c = arr.find(x => x.currency === 'CNY') || arr[0];
    return c ? { total: parseFloat(c.total_balance), currency: c.currency } : null;
  };
  const a = get(b0.data), z = get(b1.data);
  if (a && z) {
    const spent = a.total - z.total;
    console.log('\n实际扣费: ' + spent.toFixed(4) + ' ' + a.currency + ' / ' + INPUTS.length + ' 次');
    if (spent > 0) {
      const per = spent / INPUTS.length;
      console.log('单次生成约: ' + (per * 100).toFixed(2) + ' 分');
      console.log('37 元可跑约: ' + Math.floor(37 / per) + ' 次');
    } else {
      console.log('（余额变化太小，未体现出扣费；说明单次成本低于显示精度）');
    }
  } else {
    console.log('\n余额字段解析失败，原始结构：', JSON.stringify(b1.data));
  }
})().catch(e => { console.log('出错:', e.message); process.exit(3); });
