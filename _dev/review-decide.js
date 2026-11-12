'use strict';
/* 人工抽检：判定一条待审记录 + 更新举报积分（2026-11-11）
   ============================================================
   设计（按用户的要求）：
     · 机器先自动审（输入侧过滤 + 自动分级），结果写进 usage-log / reports
     · 高风险（review / block）进待审队列
     · 人工按需抽检，判定 valid / invalid
     · **提交举报不加分，人工判有效才加分** ——
       提交就加分等于鼓励刷举报；只奖不罚，刷子靠量也能赚，所以无效要扣分

   用法：
     node _dev/review-decide.js <id> valid              # 举报有效：举报人 +10
     node _dev/review-decide.js <id> invalid            # 无效：举报人 -2
     node _dev/review-decide.js <id> skip               # 跳过（不改积分）
     node _dev/review-decide.js --list                  # 只看待审
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const REPORT = path.join(ROOT, '_dev', 'reports.jsonl');
const DECISION = path.join(ROOT, '_dev', 'review-decisions.jsonl');
const CREDIT = path.join(ROOT, '_dev', 'credits.json');

const REWARD = { valid: 10, invalid: -2, skip: 0 };

function readJsonl(p) {
    if (!fs.existsSync(p)) return [];
    return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map(function (l) {
        try { return JSON.parse(l); } catch (e) { return null; }
    }).filter(Boolean);
}
function loadCredits() {
    try { return JSON.parse(fs.readFileSync(CREDIT, 'utf8')); } catch (e) { return {}; }
}
function saveCredits(d) {
    fs.writeFileSync(CREDIT, JSON.stringify(d, null, 2) + '\n', 'utf8');
}

const argv = process.argv.slice(2);

if (argv[0] === '--list' || argv.length === 0) {
    const reports = readJsonl(REPORT);
    const decided = new Set(readJsonl(DECISION).map(function (d) { return d.id; }));
    const pending = reports.filter(function (r) { return !decided.has(r.id); });
    console.log('=== 待审举报 ' + pending.length + ' 条（共 ' + reports.length + ' 条）===\n');
    pending.forEach(function (r) {
        console.log('  id       ' + r.id);
        console.log('  文本     ' + String(r.text).slice(0, 60));
        console.log('  理由     ' + (r.reason || '（未填）'));
        console.log('  自动判级 ' + (r.auto && r.auto.level) + (r.auto && r.auto.reasons.length ? '：' + r.auto.reasons[0] : ''));
        console.log('  举报人   ' + r.visitor);
        console.log('');
    });
    if (pending.length) console.log('判定：node _dev/review-decide.js <id> valid|invalid|skip');
    process.exit(0);
}

const id = argv[0];
const verdict = argv[1];
if (!REWARD.hasOwnProperty(verdict)) {
    console.log('用法：node _dev/review-decide.js <id> valid|invalid|skip');
    process.exit(1);
}

const reports = readJsonl(REPORT);
const rec = reports.find(function (r) { return r.id === id; });
if (!rec) { console.log('找不到举报 id：' + id); process.exit(1); }

const credits = loadCredits();
const who = rec.visitor || 'anonymous';
const before = credits[who] || 0;
const delta = REWARD[verdict];
credits[who] = Math.max(0, before + delta);   // 积分不扣成负数，避免「举报到欠分」
saveCredits(credits);

fs.appendFileSync(DECISION, JSON.stringify({
    id: id, ts: Date.now(), verdict: verdict, delta: delta,
    visitor: who, before: before, after: credits[who]
}) + '\n', 'utf8');

console.log('已记录：' + id + ' → ' + verdict);
console.log('  举报人 ' + who + '：' + before + ' → ' + credits[who] + '（' + (delta >= 0 ? '+' : '') + delta + '）');
if (verdict === 'valid') console.log('  ⚠ 有效举报需要人工确认内容确有违规，这一步不能自动化');
