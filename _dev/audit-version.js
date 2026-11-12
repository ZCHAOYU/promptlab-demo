'use strict';
/* 版本记录纪律检查（2026-11-11）
   ------------------------------------------------------------
   规则见 版本记录.md：
     新增内容/功能 → 每个功能单独一个版本
     同一批（24h 内、中间没发过版）的 BUG 修复 → 合并成一个修订版
   这个脚本把那几条规则变成可执行断言，免得「说好了这么做」但实际没做到：
     1. app.js 里的 APP_VERSION 是唯一权威值，格式 Vx.y
     2. 版本记录.md 的第一条 = APP_VERSION
     3. 版本一览表的第一行 = APP_VERSION
     4. 每条记录都要有日期和类型，类型只能是「新增 / 修复 / 新增+修复」
     5. 同一天里出现两个「修复」版 → 违反「同一批合并」
     6. 页面真的把版本号显示出来了
   用法：node _dev/audit-version.js
*/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

// app.js 2026-11-11 拆成 5 个文件（app.js + 4 个补丁层），
// 找函数要扫全部，但 APP_VERSION 只认 app.js 那一处（唯一权威值）。
const APP_FILES = ['app.js', 'app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js']
  .filter(function (f) { return fs.existsSync(path.join(ROOT, f)); });
const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const appAll = APP_FILES.map(function (f) { return fs.readFileSync(path.join(ROOT, f), 'utf8'); }).join('\n');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const ledgerPath = path.join(ROOT, '版本记录.md');
// 版本记录.md 是**内部文档**（.gitignore 排除，不进公开仓库）。
// 在 clone 出来的仓库里它不存在：那时 2~4 项没法跑，明说跳过；
// 1、5、6 项只读代码，照跑。
const hasLedger = fs.existsSync(ledgerPath);
const ledger = hasLedger ? fs.readFileSync(ledgerPath, 'utf8') : '';

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

console.log('=== 1. APP_VERSION 是唯一权威值 ===');
const m = app.match(/const\s+APP_VERSION\s*=\s*'([^']+)'/);
ok(!!m, 'app.js 里定义了 const APP_VERSION');
const V = m ? m[1] : '';
ok(/^V\d+\.\d+$/.test(V), 'APP_VERSION 格式合法：' + (V || '(空)'));
ok(new RegExp('window\\.__APP_VERSION\\s*=\\s*APP_VERSION').test(app),
  'window.__APP_VERSION 由 APP_VERSION 赋值（没有第二个手写值）');

if (!hasLedger) {
  console.log('\n=== 2~4. 版本记录 与 APP_VERSION 对齐 ===');
  console.log('  [跳过] 版本记录.md 不在这个目录里（内部文档，不随仓库发布）');
  console.log('         这三项只在开发机上跑；代码侧的对齐由第 1、5、6 项覆盖');
} else {
  console.log('\n=== 2. 版本记录 与 APP_VERSION 对齐 ===');
  const entries = [];
  const ENTRY_RE = /^## (V\d+\.\d+)\s*[—\-–]\s*(\S+?)[：:]\s*(.+)$/gm;
  let mm;
  while ((mm = ENTRY_RE.exec(ledger)) !== null) {
    entries.push({ ver: mm[1], kind: mm[2], title: mm[3].trim(), at: mm.index });
  }
  ok(entries.length > 0, '版本记录.md 里有 ' + entries.length + ' 条版本记录');
  ok(entries.length > 0 && entries[0].ver === V,
    '第一条记录 = APP_VERSION（记录 ' + (entries[0] && entries[0].ver) + ' / 代码 ' + V + '）');

  const tableRow = ledger.match(/^\|\s*(V\d+\.\d+)\s*\|/m);
  ok(!!tableRow, '版本一览表存在');
  ok(tableRow && tableRow[1] === V,
    '版本一览第一行 = APP_VERSION（表格 ' + (tableRow && tableRow[1]) + '）');

  console.log('\n=== 3. 每条记录都要有日期和类型 ===');
  entries.forEach(function (e) {
    const seg = ledger.slice(e.at, e.at + 600);
    const hasDate = /\*\*日期\*\*\s*[:：]\s*\d{4}-\d{2}-\d{2}/.test(seg);
    const typeM = seg.match(/\*\*类型\*\*\s*[:：]\s*(\S+)/);
    // 「修复（8 条合并）」这种带括号补充说明的也算修复——括号里不是类型
    const typeClean = typeM ? typeM[1].replace(/[（(].*$/, '') : '';
    // 2026-11-11 加「重构」：结构改动但不改变可观察行为的一类。
    // 它和「修复」不能混批——修复靠「问题重现」验收，重构靠「输出逐字不变」验收。
    const typeOk = /^(新增|修复|重构|新增\+修复|修复\+新增|新增\+重构|重构\+修复)$/.test(typeClean);
    ok(hasDate, e.ver + ' 有日期');
    ok(!!typeOk, e.ver + ' 类型合法（' + (typeM ? typeM[1] : '缺失') + '）');
  });

  console.log('\n=== 4. 同一批的修复必须合并 ===');
  // 规则：同一个「批次」里只能有一个修复版。
  // 判定要和规则一致——不是「同一天只能一个修复版」，而是：
  //   两个修复版**紧挨着**（中间没发过别的版本）且同一天 → 属于同一批，应该合并。
  //   中间发过新功能版（比如 V5.14 之后才发现的问题），那是新一批，允许重新开修复版。
  const parsed = entries.map(function (e) {
    const seg = ledger.slice(e.at, e.at + 600);
    const d = (seg.match(/\*\*日期\*\*\s*[:：]\s*(\d{4}-\d{2}-\d{2})/) || [])[1] || '';
    const t = ((seg.match(/\*\*类型\*\*\s*[:：]\s*(\S+)/) || [])[1] || '').replace(/[（(].*$/, '');
    return { ver: e.ver, date: d, type: t };
  });
  let violation = null;
  for (let i = 0; i + 1 < parsed.length; i++) {
    const a = parsed[i], b = parsed[i + 1];
    if (a.type === '修复' && b.type === '修复' && a.date === b.date) {
      violation = a.ver + ' 与 ' + b.ver + '（' + a.date + '，中间没发过别的版本）';
      break;
    }
  }
  ok(!violation,
    '没有「同一天、相邻、都是修复」的两个版本' +
    (violation ? '（违反：' + violation + '，应合并）' : ''));
  const fixVers = parsed.filter(function (x) { return x.type === '修复'; }).map(function (x) { return x.ver; });
  console.log('     修复版共 ' + fixVers.length + ' 个：' + fixVers.join('、'));
}

console.log('\n=== 5. 页面真的显示了版本号 ===');
ok(html.indexOf('id="appVersion"') >= 0, 'index.html 有 id="appVersion" 的容器');
ok(/function\s+initVersionLabel/.test(appAll), '有 initVersionLabel()（扫全部 5 个文件）');
ok(/initVersionLabel\(\)/.test(appAll), 'initVersionLabel() 被调用');

console.log('\n=== 6. 缓存戳不等于版本号（两套东西别混）===');
const qs = [...html.matchAll(/(?:src|href)="([\w\-.]+\.(?:js|css))\?v=([^"]+)"/g)];
ok(qs.length > 0, 'index.html 里有 ' + qs.length + ' 个带 ?v= 的资源');
const looksLikeVersion = qs.filter(function (q) { return /^V\d+\.\d+$/.test(q[2]); });
ok(looksLikeVersion.length === 0,
  '没有任何 ?v= 写成版本号' + (looksLikeVersion.length ? '（' + looksLikeVersion.map(function (q) { return q[1]; }).join(', ') + '）' : ''));
const appTag = qs.filter(function (q) { return q[1] === 'app.js'; })[0];
ok(!!appTag, 'app.js 带缓存戳（' + (appTag && appTag[2]) + '）');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
console.log('当前版本：' + V);
process.exit(fail ? 1 : 0);
