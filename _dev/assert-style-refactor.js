'use strict';
/* 安全断言：这次重构只允许「原本没有映射的 160 个风格」发生变化。
   原本有映射的必须逐字不动 —— 否则就是改坏了。
   用法：node _dev/assert-style-refactor.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const before = JSON.parse(fs.readFileSync(path.join(__dirname, 'fills-before.json'), 'utf8'));
const after = JSON.parse(fs.readFileSync(path.join(__dirname, 'fills-after.json'), 'utf8'));
const todo = JSON.parse(fs.readFileSync(path.join(__dirname, 'style-map-todo.json'), 'utf8')).todo.map(x => x.style);
const wasMissing = new Set(todo);

const FIELDS = ['lighting', 'color', 'atmosphere', 'scene'];
const changed = [], unchanged = [];
Object.keys(before).forEach(function (s) {
  const a = before[s], b = after[s];
  const diff = FIELDS.filter(f => (a[f] || null) !== (b[f] || null));
  if (diff.length) changed.push({ style: s, before: a, after: b, diff: diff });
  else unchanged.push(s);
});

const changedButHadMapping = changed.filter(c => !wasMissing.has(c.style));
const changedAndWasMissing = changed.filter(c => wasMissing.has(c.style));

console.log(`风格总数 ${Object.keys(before).length}`);
console.log(`  原本缺映射（本次允许变）: ${wasMissing.size}`);
console.log(`  实际变了: ${changed.length}`);
console.log(`    其中「原本缺映射」: ${changedAndWasMissing.length}`);
console.log(`    其中「原本有映射」: ${changedButHadMapping.length}  ← 必须是 0`);
console.log(`  没变: ${unchanged.length}`);

if (changedButHadMapping.length) {
  console.log('\n✗ 以下风格本来有映射却被改了（不允许）：');
  changedButHadMapping.forEach(function (c) {
    const d = c.diff.map(f => `${f}: ${c.before[f]} → ${c.after[f]}`).join('  ');
    console.log(`  ${c.style}: ${d}`);
  });
  process.exit(1);
}

// 变了的方向也要检查：只能从「兜底值」变成「具体值」，不能反过来
const FALLBACK = { lighting: '电影级侧光', color: '莫兰迪色系', atmosphere: '史诗壮阔', scene: null };
const weird = [];
changedAndWasMissing.forEach(function (c) {
  c.diff.forEach(function (f) {
    const from = c.before[f], to = c.after[f];
    const fromIsFallback = (from === FALLBACK[f]) || (from === null);
    if (!fromIsFallback) weird.push(`${c.style}.${f}: ${from} → ${to}（起点不是兜底值）`);
    if (to === null) weird.push(`${c.style}.${f}: 变成了 null`);
  });
});
console.log(`\n变化方向异常 ${weird.length} 处`);
weird.slice(0, 20).forEach(w => console.log('  ✗ ' + w));

// 覆盖率抽查：查「有没有这个键」，不是查值。
// 原来写的是「值是否等于兜底」，结果把「显式映射成电影级侧光」的 7 个
// （3D渲染、概念艺术…）误报成缺口 —— 它们本来就这么配的。
const defaults = (function () {
  const vm = require('vm');
  const ctx = { console: { log() {}, warn() {} } };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'archive-style-defaults.js'), 'utf8'), ctx,
    { filename: 'archive-style-defaults.js' });
  return ctx.window.__STYLE_DEFAULTS || {};
})();
const noKey = Object.keys(after).filter(function (s) {
  return ['lighting', 'color', 'atmosphere'].some(function (d) {
    return !(defaults[d] && defaults[d][s]);
  });
});
console.log(`\n缺映射键的风格 ${noKey.length} 个：${noKey.join('、') || '无'}`);
const explicitFallback = Object.keys(after).filter(s => after[s].lighting === '电影级侧光');
console.log(`（其中显式映射成「电影级侧光」的 ${explicitFallback.length} 个，属于正常）`);

process.exit((weird.length || noKey.length) ? 1 : 0);
