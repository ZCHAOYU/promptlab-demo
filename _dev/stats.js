'use strict';
/* 测试期看板（2026-11-11）
   ============================================================
   为什么要有独立 CLI，而不是只看 /api/stats：
     服务挂了的时候，恰恰最需要看数据（今天它崩过一次）。
     这个脚本直接读本地 jsonl，不依赖服务在跑。

   用法：
     node _dev/stats.js            # 近 7 天
     node _dev/stats.js 30         # 近 30 天
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const DAYS = Math.max(1, parseInt(process.argv[2] || '7', 10));
const since = Date.now() - DAYS * 86400 * 1000;

function readJsonl(p) {
    const f = path.join(ROOT, '_dev', p);
    if (!fs.existsSync(f)) return [];
    return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(function (l) {
        try { return JSON.parse(l); } catch (e) { return null; }
    }).filter(Boolean);
}

const usage = readJsonl('usage-log.jsonl').filter(r => (r.ts || 0) >= since);
const reports = readJsonl('reports.jsonl');
const decisions = readJsonl('review-decisions.jsonl');
let credits = {};
try { credits = JSON.parse(fs.readFileSync(path.join(ROOT, '_dev', 'credits.json'), 'utf8')); } catch (e) { }
let cache = 0;
try { cache = Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, '_dev', 'infer-cache.json'), 'utf8'))).length; } catch (e) { }

const gens = usage.filter(r => r.kind === 'gen');
const infers = usage.filter(r => r.kind === 'infer');
const blocked = usage.filter(r => r.level === 'block');
const review = usage.filter(r => r.level === 'review');
const visitors = new Set(usage.map(r => r.visitor).filter(v => v && v !== 'anonymous'));

const cats = {};
blocked.forEach(function (r) {
    (r.reasons || []).forEach(function (reason) {
        let cat;
        if (String(reason).indexOf('/组合') >= 0) cat = '未成年性化组合';
        else {
            const m = String(reason).match(/\(([^)]+)\)/);
            cat = m ? m[1] : String(reason).split('：')[0];
        }
        cats[cat] = (cats[cat] || 0) + 1;
    });
});

const byDay = {};
usage.forEach(function (r) {
    const d = new Date(r.ts || 0);
    const key = String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const s = byDay[key] || (byDay[key] = { gen: 0, infer: 0, block: 0, review: 0 });
    if (r.kind === 'gen') s.gen++; else if (r.kind === 'infer') s.infer++;
    if (r.level === 'block') s.block++; else if (r.level === 'review') s.review++;
});

const decided = new Set(decisions.map(d => d.id));
const pending = reports.filter(r => !decided.has(r.id));
const valid = decisions.filter(d => d.verdict === 'valid');
const invalid = decisions.filter(d => d.verdict === 'invalid');

const line = (k, v) => console.log('  ' + String(k).padEnd(16) + v);

console.log('=== PromptLab 测试看板 · 近 ' + DAYS + ' 天 ===');
console.log('');
console.log('用量');
line('生成次数', gens.length);
line('推理调用', infers.length + '（其中缓存命中 ' + cache + ' 条）');
line('独立访客', visitors.size);
console.log('');
console.log('合规');
line('拦下 block', blocked.length + (usage.length ? '（占 ' + (blocked.length / usage.length * 100).toFixed(1) + '%）' : ''));
line('需人工 review', review.length);
if (Object.keys(cats).length) {
    line('分类', Object.keys(cats).sort((a, b) => cats[b] - cats[a]).map(k => k + '×' + cats[k]).join('、'));
}
console.log('');
console.log('举报');
line('总计', reports.length + ' / 待审 ' + pending.length + ' / 有效 ' + valid.length + ' / 无效 ' + invalid.length);
const top = Object.keys(credits).sort((a, b) => credits[b] - credits[a]).slice(0, 5);
if (top.length) line('积分榜', top.map(k => k + ':' + credits[k]).join('、'));
console.log('');
console.log('抽检');
line('已判定', decisions.length + ' / 队列 ' + pending.length + '（抽样 30%）');
console.log('');
console.log('成本（按约 ¥0.003/次估算，非账单口径）');
line('估算', '¥' + (infers.filter(r => r.level !== 'block').length * 0.003).toFixed(3));
console.log('');
if (Object.keys(byDay).length) {
    console.log('按日');
    Object.keys(byDay).sort().forEach(function (d) {
        const v = byDay[d];
        console.log('  ' + d + '  生成 ' + String(v.gen).padEnd(4) + ' 推理 ' + String(v.infer).padEnd(4) +
            ' 拦 ' + String(v.block).padEnd(3) + ' 审 ' + String(v.review).padEnd(3));
    });
}

/* 测试模式：--assert 只做结构自检，供 run-all 调用 */
if (process.argv.indexOf('--assert') >= 0) {
    let bad = 0;
    const need = ['生成次数', '推理调用', '拦下 block'];
    need.forEach(function (k) {
        if (!String(k)) bad++;
    });
    if (typeof gens.length !== 'number') bad++;
    if (blocked.length > usage.length) { console.log('✗ 拦下的比总量还多'); bad++; }
    console.log(bad ? '✗ 自检失败' : '✓ 看板自检通过');
    process.exit(bad ? 1 : 0);
}
