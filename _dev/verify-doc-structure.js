'use strict';
/* 证明「文档结构检查」真的会抓 bug（2026-11-11）
   ============================================================
   检查器最容易变成摆设：永远返回「通过」，谁也不知道它有没有在工作。
   所以这里**故意造三个坏样本**，先证明它会报错，再让它检查真文档。

   用法：node _dev/verify-doc-structure.js
*/
const path = require('path');
const fs = require('fs');
const { checkText, checkDocStructure } = require('./doc-structure');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

/* ---------- 好样本：应当 0 错误 ---------- */
const GOOD = `# 开发日志

## 目录

**2026-11-11**

- 第一节
- 第二节
- 傍晚 · 分组节

---

## 1. 第一节

### 1.1 小项
正文

## 2. 第二节

正文

## 傍晚 · 分组节

<!-- 允许分组 -->
### 20. 有意保留在同一节
### 21. 有意保留在同一节
`;

console.log('=== 1. 好样本必须通过（防止误报）===');
const g = checkText('good.md', GOOD);
ok(g.errs.length === 0, '构造1：编号递进 + 目录同步 → 0 错误' + (g.errs.length ? '（实际 ' + g.errs[0] + '）' : ''));
ok(g.warns.length === 0, '构造1：有「允许分组」标记的节不告警');

/* ---------- 坏样本一：编号倒挂（就是实际发生过两次的 bug）---------- */
const BAD_NEST = `# 开发日志

## 45. 英文侧

### 45.1 小项

### 46. 这一节本该是顶层
### 47. 这一节本该是顶层

## 48. 后面的节
`;
console.log('\n=== 2. 编号倒挂必须被抓出来 ===');
const b1 = checkText('bad-nest.md', BAD_NEST);
ok(b1.errs.length === 2, '抓到 2 处倒挂（### 46 / ### 47）—— 实际 ' + b1.errs.length + ' 处');
ok(b1.errs.every(e => e.indexOf('编号倒挂') >= 0), '报错类型是「编号倒挂」');
if (b1.errs[0]) console.log('    例：' + b1.errs[0]);

/* ---------- 坏样本二：目录不同步 ---------- */
const BAD_TOC = `# 开发日志

## 目录

- 只有一条

---

## 1. 第一节

## 2. 第二节

## 3. 第三节
`;
console.log('\n=== 3. 目录不同步必须被抓出来 ===');
const b2 = checkText('bad-toc.md', BAD_TOC);
// 2026-11-11 起目录检查改成逐条标题比对，报错文案变成「目录缺条目」；
// 断言放宽到「报的是目录问题」，不再绑死具体措辞。
ok(b2.errs.some(e => e.indexOf('目录缺条目') >= 0 || e.indexOf('目录多条目') >= 0),
  '抓到目录不同步（缺 2 条 / 多 1 条）：' + (b2.errs[0] || ''));

/* ---------- 坏样本三：无编号父节下挂一大堆编号子项 ---------- */
const BAD_GROUP = `# 开发日志

## 傍晚 · 推到 beta

### 20. 门槛
### 21. 门槛
### 22. 门槛
`;
console.log('\n=== 4. 无编号父节下的大量编号子项 → 提示（不失败）===');
const b3 = checkText('bad-group.md', BAD_GROUP);
ok(b3.errs.length === 0, '不算错误（可能是有意分组）');
ok(b3.warns.length === 1 && b3.warns[0].indexOf('疑似该提升') >= 0, '但给出「疑似该提升」提示');
if (b3.warns[0]) console.log('    ' + b3.warns[0]);

/* ---------- 坏样本四：加标记后不再提示 ---------- */
console.log('\n=== 5. 加了「允许分组」标记就不再提示 ===');
const MARKED = BAD_GROUP.replace('### 20.', '<!-- 允许分组 -->\n### 20.');
const b4 = checkText('marked.md', MARKED);
ok(b4.warns.length === 0 && b4.errs.length === 0, '标记生效，0 错误 0 提示');

/* ---------- 真文档 ---------- */
/* 开发日志是**内部文档**（.gitignore 排除，不进公开仓库）。
   在 clone 出来的仓库里它不存在 —— 那是正常的，明说一句跳过，
   别让它把整个仓库的验收拖红。 */
const LOG_DOC = '开发日志-2026-11-09.md';
if (require('fs').existsSync(require('path').join(__dirname, '..', LOG_DOC))) {
  console.log('\n=== 6. 真文档（开发日志）===');
  const real = checkDocStructure([LOG_DOC], path.join(__dirname, '..'));
  ok(real.errs.length === 0, '开发日志结构正常（0 错误）' + (real.errs.length ? '：' + real.errs[0] : ''));
  ok(real.warns.length <= 5, '提示数可控（' + real.warns.length + ' 条，都是小项编号）');
  real.warns.forEach(function (w) { console.log('    ' + w); });
} else {
  console.log('\n=== 6. 真文档（开发日志）===');
  console.log('  [跳过] ' + LOG_DOC + ' 不在这个目录里（内部文档不随仓库发布），前 5 项的坏样本已经证明了检查器会报错');
}

/* ---------- 7. 检查器不能空转 ---------- */
console.log('\n=== 7. 不传文件列表时必须抛异常（防止再次空转）===');
let threw = false;
try { checkDocStructure(); } catch (e) { threw = true; }
ok(threw, 'checkDocStructure() 无参调用会抛异常 —— 不会静默返回「通过」');
threw = false;
try { checkDocStructure([]); } catch (e) { threw = true; }
ok(threw, '传空数组也会抛异常');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
