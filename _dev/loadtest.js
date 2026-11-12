'use strict';
/* 并发压测（2026-11-11）
   ------------------------------------------------------------------
   为什么要有：用户问「能不能给 50 人测试」。这种问题不能凭感觉答，
   得知道瓶颈在哪一段。

   实测结论（本机，16 线程）：
     /api/embed  100 并发 → 0 失败，p95 113ms        ← 基础设施够
     /api/infer    6 并发 → 6/6 成功，但最慢 19.1s    ← 瓶颈在这里（等 LLM）

   用法：
     node _dev/loadtest.js embed 50      # 压向量接口（免费，可以随便压）
     node _dev/loadtest.js infer 6       # 压推理接口（会花真钱，约 ¥0.003/次）
*/
const BASE = process.env.PL_BASE || 'http://127.0.0.1:8777';

const TEXTS = [
  '银发红瞳的病弱少年，站在雨夜的祠堂前', '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '机械姬，银色义体，站在霓虹街头', '两个剑客在月下决斗',
  '赛博朋克城市里的雨夜集市', '废弃的教堂，藤蔓爬满石墙',
  '红衣女帝，金冠高髻', '一位欧洲皇后',
  '皮影艺人，枯瘦的手挑着竹签', '一个形状古怪的剑'
];

/* 每次压测都用新词，避免命中缓存把耗时测成 0 */
let seq = 0;
function freshWord() {
  seq++;
  const heads = ['深山', '古镇', '荒原', '雪线', '旧港', '雨巷'];
  const tails = ['守闸人', '制伞匠', '灯官', '船工', '马夫', '货郎'];
  return heads[seq % heads.length] + tails[seq % tails.length] + seq;
}

async function oneEmbed(i) {
  const t = performance.now();
  try {
    const r = await fetch(BASE + '/api/embed', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [TEXTS[i % TEXTS.length]] })
    });
    await r.text();
    return { ms: performance.now() - t, ok: r.ok };
  } catch (e) { return { ms: performance.now() - t, ok: false, err: (e.cause && e.cause.code) || e.message }; }
}

async function oneInfer() {
  const w = freshWord();
  const t = performance.now();
  try {
    const r = await fetch(BASE + '/api/infer', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: w, mode: 'character' })
    });
    const j = await r.json();
    return { ms: performance.now() - t, ok: !!j.ok, name: j.data && j.data.short, err: j.error };
  } catch (e) { return { ms: performance.now() - t, ok: false, err: e.message }; }
}

(async function main() {
  const kind = process.argv[2] || 'embed';
  const n = Math.max(1, parseInt(process.argv[3] || '50', 10));

  // 探活
  try {
    const h = await (await fetch(BASE + '/api/health')).json();
    console.log('服务：ok=' + h.ok + ' infer=' + h.infer + ' 缓存 ' + h.inferCached + ' 条');
  } catch (e) {
    console.log('连不上 ' + BASE + '：' + e.message);
    process.exit(1);
  }

  const fn = kind === 'infer' ? oneInfer : oneEmbed;
  const t0 = performance.now();
  const res = await Promise.all(Array.from({ length: n }, function (_, i) { return kind === 'infer' ? fn() : fn(i); }));
  const wall = performance.now() - t0;

  const ms = res.map(r => r.ms).sort((a, b) => a - b);
  const bad = res.filter(r => !r.ok);
  const p = (q) => ms[Math.min(ms.length - 1, Math.floor(ms.length * q))];

  console.log('\n' + kind + ' × ' + n + ' 并发');
  console.log('  墙钟 ' + (wall / 1000).toFixed(2) + 's');
  console.log('  p50  ' + p(0.5).toFixed(0) + 'ms');
  console.log('  p95  ' + p(0.95).toFixed(0) + 'ms');
  console.log('  最大 ' + ms[ms.length - 1].toFixed(0) + 'ms');
  console.log('  失败 ' + bad.length + (bad.length ? '（' + (bad[0].err || '') + '）' : ''));
  if (kind === 'infer') {
    console.log('  本次花费约 ¥' + (n * 0.003).toFixed(3));
    res.filter(r => r.ok).forEach(function (r) { console.log('    ' + (r.name || '') + ' ' + (r.ms / 1000).toFixed(1) + 's'); });
  }
  process.exit(bad.length ? 1 : 0);
})();
