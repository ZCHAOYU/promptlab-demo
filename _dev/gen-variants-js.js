'use strict';
/* 把 _dev/role-variants.json 转成 archive-variants.js，并做三件事：
   1. 质检：三情境齐全、互不重复、长度、套话
   2. **安全闸门**：和现有 archive-variants.js 逐条比对。
      只要老角色的内容有一处不同就停下 —— 说明 JSON 和线上文件已经对不上，
      这时候直接覆盖会悄悄改掉 256 个角色的动作。宁可停下让人看一眼。
   3. 只有 --write 才落盘

   为什么用 node 而不是 python：要跟现有 archive-variants.js 比对，
   得先把那段 JS 求值出来，用 node 的 vm 是唯一稳的做法。

   用法：node _dev/gen-variants-js.js            # 只体检
        node _dev/gen-variants-js.js --write    # 通过才写 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'role-variants.json');
const OUT = path.join(ROOT, 'archive-variants.js');
const SITS = ['daily', 'action', 'quiet'];
const BANNED = ['眉眼舒展', '唇角浅笑', '目光温和', '神情松弛', '气色温润',
  '目光柔和', '面带笑意', '神情放松', '神态从容', '无人能及', '倾倒众生'];

// ---- 读现有 archive-variants.js ----
function loadExisting() {
  if (!fs.existsSync(OUT)) return {};
  const ctx = { console: { log() {}, warn() {} }, setTimeout, clearTimeout };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(OUT, 'utf8'), ctx, { filename: 'archive-variants.js' });
  return ctx.window.__ROLE_VARIANTS || {};
}

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const data = {};
raw.forEach(function (x) {
  if (x && x.name) data[x.name] = x.variants || x;
});

const existing = loadExisting();
const oldNames = Object.keys(existing);
console.log(`JSON ${Object.keys(data).length} 条，现有 archive-variants.js ${oldNames.length} 条`);

// ---- 安全闸门：老角色必须一字不差 ----
const changed = [];
oldNames.forEach(function (n) {
  const a = existing[n] || {};
  const b = data[n] || {};
  SITS.forEach(function (s) {
    const x = String(a[s] || '').trim();
    const y = String(b[s] || '').trim();
    if (x !== y) changed.push({ name: n, sit: s, old: x, now: y });
  });
});
if (changed.length) {
  const names = Array.from(new Set(changed.map(c => c.name)));
  console.log(`\n⚠ 有 ${names.length} 个角色的内容会变（${changed.length} 处）：`);
  console.log('   ' + names.join('、'));
  changed.slice(0, 4).forEach(function (c) {
    console.log(`   ${c.name} / ${c.sit}`);
    console.log(`     现有: ${c.old}`);
    console.log(`     JSON: ${c.now}`);
  });
  if (changed.length > 4) console.log(`   （只列前 4 处，共 ${changed.length} 处）`);
  console.log('\n确认这些正是本轮要改的，再加 --force。');
  if (process.argv.indexOf('--force') < 0) process.exit(1);
} else {
  console.log('✓ 老角色内容与现有文件完全一致（可以安全合并新角色）');
}

// ---- 质检 ----
const problems = [];
const seen = {};
const missing = [];
Object.keys(data).forEach(function (n) {
  const v = data[n] || {};
  const texts = [];
  SITS.forEach(function (s) {
    const t = String(v[s] || '').trim();
    if (!t) { problems.push(`${n} / ${s} 为空`); return; }
    texts.push(t);
    if (t.length < 12) problems.push(`${n} / ${s} 太短(${t.length})：${t}`);
    if (t.length > 70) problems.push(`${n} / ${s} 太长(${t.length})`);
    BANNED.forEach(function (b) {
      if (t.indexOf(b) >= 0) problems.push(`${n} / ${s} 套话「${b}」`);
    });
    if (seen[t]) problems.push(`${n} / ${s} 与「${seen[t]}」逐字相同`);
    else seen[t] = n + '/' + s;
  });
  if (texts.length === 3 && new Set(texts).size < 3) {
    problems.push(`${n}：三情境有重复`);
  }
});
console.log(`\n质检问题 ${problems.length} 处`);
problems.slice(0, 40).forEach(p => console.log('  ' + p));
if (problems.length > 40) console.log(`  …… 还有 ${problems.length - 40} 处`);

if (process.argv.indexOf('--write') < 0) {
  console.log('\n（体检模式，未写文件。加 --write 生成）');
  process.exit(problems.length ? 1 : 0);
}
if (problems.length) {
  console.log('\n⚠ 有质检问题，不写。确认能接受再加 --force');
  if (process.argv.indexOf('--force') < 0) process.exit(1);
}

// ---- 写文件（只保留词库里真实存在的角色，按词库顺序） ----
const ORDER = (function () {
  const ctx = { console: { log() {}, warn() {} }, setTimeout, clearTimeout };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data-kwdb.js'), 'utf8'), ctx, { filename: 'data-kwdb.js' });
  // KW_DB 是 data-kwdb.js 里的 const，不会挂到 ctx 上，必须回到 vm 里取
  return vm.runInContext('Object.keys(KW_DB.character.categories)', ctx);
})();

const payload = {};
ORDER.forEach(function (n) {
  if (!data[n]) { missing.push(n); return; }
  const v = data[n];
  payload[n] = {};
  SITS.forEach(function (s) {
    payload[n][s] = String(v[s] || '').trim().replace(/[。．.；;，,]+$/, '');
  });
});
if (missing.length) {
  console.log(`\n⚠ 词库里有 ${missing.length} 个角色没有变体：${missing.join('、')}`);
  if (process.argv.indexOf('--force') < 0) process.exit(1);
}

const js = '/* 角色情境变体 —— 由 _dev/gen-variants-js.js 生成\n' +
  '   每个角色 3 组描述（平静日常 / 行动中 / 静谧独处），\n' +
  '   输出时按检测到的氛围与关键词选一组，避免"同一角色永远是同一套动作"。\n' +
  '   撤销：删掉 index.html 里的这个 script 标签即可。 */\n' +
  '(function () {\n' +
  '  var V = ' + JSON.stringify(payload, null, 0) + ';\n' +
  '  window.__ROLE_VARIANTS = V;\n' +
  '  window.__roleVariantCount = Object.keys(V).length;\n' +
  '})();\n';
fs.writeFileSync(OUT, js, 'utf8');
console.log(`\n✓ 已写入 archive-variants.js（${Object.keys(payload).length} 角色，${(fs.statSync(OUT).size / 1024).toFixed(1)} KB）`);
