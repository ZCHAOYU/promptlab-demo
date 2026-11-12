'use strict';
/* 文档一致性检查：把三份文档里提到的文件名抠出来，逐个验证是否真的存在。
   为什么需要：文档最容易出的错不是写得不好，是**引用了一个不存在的文件**，
   或者文件改名了文档没跟。这种错人眼很难发现。
   用法：node _dev/audit-docs.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const DOCS = ['README.md', 'TODO-2026-11-09.md', '开发日志-2026-11-09.md', '版本记录.md'];
// 2026-11-12：README 只做简介与常见问题（首页要短），技术全文搬去了 技术说明.md，
// 而那份**不进仓库**（用户要求：首页之外不再发长文档），所以这里按内部文档处理。
const INTERNAL_DOCS = new Set([
  'TODO-2026-11-09.md', '开发日志-2026-11-09.md', '版本记录.md', '技术说明.md',
]);
const skippedDocs = [];
// 注意顺序：长的放前面。写成 (?:js|py|json) 会把 .json 切成 "x.js" + "on"，
// 结果满屏假阳性（第一版就是这么错的）。
// 2026-11-11 补 jsonl：`.jsonl` 被 `.json` 抢先匹配，feedback.jsonl 报成了 feedback.json。
const EXTS = 'jsonl|json|html|ps1|css|bin|md|py|js';
const EXT = new RegExp('\\.(' + EXTS + ')$');
const LOOSE = new RegExp('([\\w./\\-\\u4e00-\\u9fff]+\\.(?:' + EXTS + '))(\\()?', 'g');

// 这些是「本来就该不存在」的：
//   index.orig.html / app.orig.js   早期备份，已清理
//   _readme_external.html           PDF 的中间产物，用完可删
//   review-result.json              人工评分页导出的产物，用户点了才有
//   feedback.jsonl                  试用反馈，第一条 👎/👍 之后才有
const ALLOW_MISSING = new Set([
  'index.orig.html', 'app.orig.js', '_readme_external.html', 'review-result.json',
  'feedback.jsonl',
  // 2026-11-12 从仓库 clone 出来才发现的三个：
  'config.local.js',     // 放 key 的文件，.gitignore 挡着，本来就不该出现在仓库里
  'infer-cache.json',    // 运行期缓存（_dev/infer-cache.json），问过一次模型才有
]);

// 历史快照（2026-11-12 加）：开发日志里记「改之前长什么样」的那批手拷文件名，
// app.before-split.js / app.with-beta.js / entries.before-subject.json 这一类。
// 它们当时都放在 _archive/，而 _archive/ 不进 GitHub 仓库（git 本身就是快照），
// 于是从仓库 clone 出来，这 38 个名字全变成「找不到」——审计红一片，其实一个都不缺。
// 处理方式：先看文件在不在（在本机就照常算存在），不在才归到「历史快照」单独计数。
// 不静默：数字照打，说明写在旁边。
// 后缀三种写法都见过：app.before-split.js（有后半段）、archive-style-defaults.final.js（没有后半段）、
// entries.before-subject.json。所以分隔符后面那截要允许为空。
const HISTORICAL = /\.(?:before|with|final)(?:[-.][^\\/]*)?\.(?:js|py|md|json|bin)$/;

const refs = {};   // 文件名 → { docs:Set, count }

DOCS.forEach(function (doc) {
  const p = path.join(ROOT, doc);
  if (!fs.existsSync(p)) {
    if (INTERNAL_DOCS.has(doc)) { skippedDocs.push(doc); return; }
    console.log(`✗ 文档不存在：${doc}`);
    return;
  }
  const src = fs.readFileSync(p, 'utf8');
  // 反引号里的内容 + 纯文本里的 xxx.js / xxx.py
  const spans = [];
  const re = /`([^`\n]{1,80})`/g;
  let m;
  while ((m = re.exec(src))) spans.push(m[1]);
  const loose = [];
  let lm;
  while ((lm = LOOSE.exec(src))) {
    // 紧跟 "(" 的是方法调用（resp.json()），不是文件名
    if (lm[2] === '(') continue;
    loose.push(lm[1]);
  }
  spans.concat(loose).forEach(function (s) {
    // 带括号的是代码（`resp.json()`），不是文件名。要在 split 之前判断，
    // 因为 split 会把括号当分隔符切掉，切完就看不出来了。
    if (String(s).indexOf('(') >= 0) return;
    const cands = String(s).split(/[\s,，、()（）]+/);
    cands.forEach(function (c) {
      let t = c.replace(/^\.\//, '').replace(/[.,;:]+$/, '');
      if (!EXT.test(t)) return;
      if (t.indexOf('(') >= 0) return;   // resp.json() 这类是方法调用，不是文件
      if (t.indexOf('/') === 0 || /^[a-z]+:\/\//i.test(t)) return;
      // 通配 / 占位写法跳过（app.before-XXX.js、_dev/*.js 这类）
      if (/[*<>]/.test(t) || /XXX|xxx/.test(t)) return;
      // 只取最后一段当名字，路径前缀单独记
      const name = t.split('/').pop();
      if (!name || name.length < 3) return;
      // 以点开头的不是文件名，是在讲扩展名 / 通配（`*.local.js` → `.local.js`）
      if (name.charAt(0) === '.') return;
      // 光有扩展名的（`​.json` 这种在讲扩展名本身）不算引用文件
      const stem = name.replace(new RegExp('\\.(?:' + EXTS + ')$'), '');
      if (stem.length < 2) return;
      refs[name] = refs[name] || { docs: new Set(), shown: t };
      refs[name].docs.add(doc);
    });
  });
});


/* ---------- 文档结构检查（2026-11-11）----------
   逻辑抽到 _dev/doc-structure.js，这样测试能单独调用它、
   用「故意造坏样本」证明它真的会报错。
   只检查带编号体系的文档；README 没有编号，跳过。 */
const { checkDocStructure } = require('./doc-structure');
// 只检查真的在目录里的编号文档。内部文档不在仓库里时，这个列表是空的 ——
// 空列表不能传给 checkDocStructure（它故意会抛异常，防止空转），所以下面要判长度。
const NUMDOCS = ['开发日志-2026-11-09.md'].filter(function (d) {
  return fs.existsSync(path.join(ROOT, d));
});


const names = Object.keys(refs).sort();
const missing = [];
const ok = [];
const historical = [];
const notShipped = [];
names.forEach(function (n) {
  if (ALLOW_MISSING.has(n)) { return; }
  // 在 promptlab/ 或 _dev/ 或 _archive/ 下任一处存在即可
  const hit = ['', '_dev', '_archive'].some(function (d) {
    return fs.existsSync(path.join(ROOT, d, n));
  });
  if (hit) { ok.push(n); return; }
  // README 会写到这三份内部文档的名字。它们**本来就不进仓库**，
  // 在 clone 出来的树上必然「找不到」——单列一类，不算缺失。
  if (INTERNAL_DOCS.has(n)) { notShipped.push(n); return; }
  if (HISTORICAL.test(n)) { historical.push(n); return; }
  missing.push(n);
});

console.log(`文档里引用的文件名：${names.length} 个（去重）`);
console.log(`  存在 ${ok.length}  缺失 ${missing.length}  历史快照 ${historical.length}  不随仓库发布 ${notShipped.length}`);
if (skippedDocs.length) {
  console.log(`  跳过 ${skippedDocs.length} 份内部文档（不随仓库发布）：${skippedDocs.join('、')}`);
  console.log(`  README 里会提到这几个名字，但公开仓库里故意不放 —— 所以不算「缺失」`);
}
if (historical.length) {
  console.log(`  历史快照是 app.before-*.js 这类「改动前的存档」，曾放 _archive/，不进仓库（git 就是快照）——不是缺失`);
}
if (missing.length) {
  console.log('\n✗ 引用了但找不到：');
  missing.forEach(function (n) {
    console.log(`  ${n.padEnd(34)} 出现在：${Array.from(refs[n].docs).join('、')}`);
  });
}

// 反向：_dev 里的脚本有没有在文档里出现过（不要求全部，只统计）
const devFiles = fs.readdirSync(path.join(ROOT, '_dev'))
  .filter(f => /\.(js|py)$/.test(f) && !f.startsWith('_'));
const mentioned = devFiles.filter(f => names.indexOf(f) >= 0);
console.log(`\n_dev 下 ${devFiles.length} 个脚本，文档提到 ${mentioned.length} 个`);


/* ---------- 结构检查结果（2026-11-11）---------- */
console.log('\n=== 文档结构 ===');
let structErrs = 0;
if (!NUMDOCS.length) {
  console.log('  [跳过] 编号文档（开发日志）不在这个目录里 —— 内部文档不随仓库发布');
} else {
  const struct = checkDocStructure(NUMDOCS);   // 必须传文件列表，否则检查器空转
  structErrs = struct.errs.length;
  if (!struct.errs.length) {
    console.log('  ✓ 编号层级与目录同步都正常');
  } else {
    console.log('  ✗ 发现 ' + struct.errs.length + ' 处结构问题：');
    struct.errs.forEach(function (e) { console.log('    ' + e); });
  }
  if (struct.warns.length) {
    console.log('  ⚠ ' + struct.warns.length + ' 处提示（不算失败）：');
    struct.warns.forEach(function (w) { console.log('    ' + w); });
  }
}

process.exit((missing.length || structErrs) ? 1 : 0);
