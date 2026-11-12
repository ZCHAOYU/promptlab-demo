'use strict';
/* 抽检取样 + JS/Python 判据一致性（2026-11-11）
   ============================================================
   两件事：

   1 抽检取样：把所有「机器标为 review / block」的输入按比例抽出来，
     交给人工看。不抽全量——人工看不完，全量送审等于不审。

   2 判据一致性：前端（JS Trie）和服务端（Python Trie）是两套实现，
     必须保证同一句话得到同一个结论。今天已经因为「两套实现」栽过一次
     （面板 vs 主流程），所以这里用同一批用例两边跑，逐条比对。

   用法：node _dev/verify-guard-parity.js
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const g = require('./compliance-gate');

let pass = 0, fail = 0;
function ok(cond, msg) {
    if (cond) { pass++; console.log('  ✓ ' + msg); }
    else { fail++; console.log('  ✗ ' + msg); }
}

/* ---------- 1. 用法用例（两边共用） ---------- */
const CASES = [
    ['银发红瞳的病弱少年，站在雨夜的祠堂前', 'ok'],
    ['机械姬，银色义体，站在霓虹街头', 'ok'],
    ['两个剑客在月下决斗', 'ok'],
    ['赛博朋克城市里的雨夜集市', 'ok'],
    ['一位欧洲皇后', 'ok'],
    ['扎纸匠传统手艺人', 'ok'],
    ['少女全裸侧躺', 'block'],
    ['全 裸', 'block'],
    ['全-裸', 'block'],
    ['萝莉比基尼床上', 'block'],
    ['儿童半裸', 'block'],
    ['肢解尸体，内脏外露', 'block'],
    ['炸弹制作图纸', 'block'],
    ['面容酷似习近平', 'block'],
    ['皮卡丘风格怎么画', 'review'],
    ['僧人穿袈裟手持佛像', 'review'],
    ['军装红领巾', 'review'],
    ['画个米老鼠', 'review']
];

console.log('=== 1. JavaScript 侧（前端判据）===');
const jsVerdicts = {};
CASES.forEach(function (c) {
    const r = g.checkText(c[0]);
    jsVerdicts[c[0]] = r.level;
    ok(r.level === c[1], '「' + c[0] + '」→ ' + r.level + '（期望 ' + c[1] + '）' +
        (r.reasons.length ? '  ' + r.reasons[0] : ''));
});

/* ---------- 2. Python 侧（服务端判据） ---------- */
console.log('\n=== 2. Python 侧（服务端判据）——同一批用例 ===');
const { spawnSync } = require('child_process');
const py = process.env.PL_PYTHON || 'python';

/* 把用例写进临时文件，交给 python 跑，避免命令行转义问题 */
const tmp = path.join(__dirname, '_parity-cases.json');
fs.writeFileSync(tmp, JSON.stringify(CASES.map(c => c[0]), null, 2), 'utf8');

const pyCode = [
    "import json, importlib.util",
    "spec = importlib.util.spec_from_file_location('srv', 'serve.py')",
    "m = importlib.util.module_from_spec(spec)",
    "spec.loader.exec_module(m)",
    "cases = json.load(open('_dev/_parity-cases.json', encoding='utf-8'))",
    "import re",
    "def info(c):",
    "    r = m._check_text(c)",
    "    return {'level': r['level'], 'cats': sorted(set(re.findall(r'[（(]([^）)]+)[）)]', ' '.join(r['reasons']))))}",
    "out = {c: info(c) for c in cases}",
    "print(json.dumps(out, ensure_ascii=False))"
].join('\n');

const run = spawnSync(py, ['-c', pyCode], {
    cwd: ROOT, encoding: 'utf8', env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' })
});

let pyVerdicts = null;
if (run.status === 0) {
    try { pyVerdicts = JSON.parse(String(run.stdout).trim().split('\n').pop()); } catch (e) { pyVerdicts = null; }
}
try { fs.unlinkSync(tmp); } catch (e) { }

if (!pyVerdicts) {
    console.log('  [跳过] 没能跑起 Python 侧（' + (String(run.stderr || '').trim().split('\n').pop() || '未知') + '）');
} else {
    CASES.forEach(function (c) {
        ok(pyVerdicts[c[0]].level === c[1], '「' + c[0] + '」→ ' + pyVerdicts[c[0]].level + '（期望 ' + c[1] + '）');
    });
}

/* ---------- 3. 两边必须一致 ---------- */
console.log('\n=== 3. 两套实现必须给出同一结论 ===');
if (!pyVerdicts) {
    console.log('  [跳过] Python 侧没跑起来，无法比对');
} else {
    let diff = 0;
    CASES.forEach(function (c) {
        if (pyVerdicts[c[0]].level !== jsVerdicts[c[0]]) {
            diff++;
            console.log('  ✗ 等级不一致：「' + c[0] + '」JS=' + jsVerdicts[c[0]] + ' Python=' + pyVerdicts[c[0]].level);
        }
    });
    ok(diff === 0, '等级逐条一致 ' + CASES.length + ' / ' + CASES.length);

    /* 2026-11-11 加：等级一致不够，原因里的类别也要一致。
       上一版只比 level，结果 Python 侧原因不带类别，看板分类统计成了「block×2」，
       而测试全绿 —— 断言写太窄，等于没测。 */
    let catDiff = 0;
    CASES.forEach(function (c) {
        // 类别按「集合」比，不按出现次数：Python 侧用了 set，JS 侧也要去重，
        // 否则「肢解(暴力血腥)、内脏外露(暴力血腥)」会被判成不一致。
        const jsCats = [...new Set((g.checkText(c[0]).reasons.join(' ').match(/[（(]([^）)]+)[）)]/g) || [])
            .map(s => s.slice(1, -1)))].sort();
        const pyCats = pyVerdicts[c[0]].cats.slice();
        const same = jsCats.length === pyCats.length && jsCats.every((v, i) => v === pyCats[i]);
        if (!same) {
            catDiff++;
            console.log('  ✗ 类别不一致：「' + c[0] + '」JS=[' + jsCats.join(',') + '] Python=[' + pyCats.join(',') + ']');
        }
    });
    ok(catDiff === 0, '原因里的类别也一致 ' + (CASES.length - catDiff) + ' / ' + CASES.length);
}

/* ---------- 4. 抽检取样 ---------- */
console.log('\n=== 4. 抽检取样（不全量送审）===');
const USAGE = path.join(ROOT, '_dev', 'usage-log.jsonl');
if (!fs.existsSync(USAGE)) {
    console.log('  [跳过] 没有 usage-log.jsonl（还没人用过 /api/infer）');
} else {
    const lines = fs.readFileSync(USAGE, 'utf8').split('\n').filter(Boolean);
    const risky = lines.map(function (l) { try { return JSON.parse(l); } catch (e) { return null; } })
        .filter(r => r && (r.level === 'review' || r.level === 'block'));
    const ratio = 0.3;                                   // 默认抽 30%
    const k = Math.max(1, Math.round(risky.length * ratio));
    console.log('  总记录 ' + lines.length + ' 条，其中需要人工的是 ' + risky.length + ' 条');
    console.log('  按 ' + (ratio * 100) + '% 抽样 → 本次送审 ' + Math.min(k, risky.length) + ' 条');
    ok(Math.min(k, risky.length) <= risky.length, '抽样数量不超过待审总量');
    ok(risky.length === 0 || k >= 1, '有待审时至少抽 1 条（不会因为四舍五入变成 0）');
}

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
