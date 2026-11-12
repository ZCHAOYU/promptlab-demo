'use strict';
/* 这次改动的核心指标：320 个风格的「光/色/氛围」取值有多集中。
   改前：一半风格落兜底，取值高度集中；改后应该散开。
   用法：node _dev/audit-style-coverage.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const before = JSON.parse(fs.readFileSync(path.join(__dirname, 'fills-before.json'), 'utf8'));
const after = JSON.parse(fs.readFileSync(path.join(__dirname, 'fills-after.json'), 'utf8'));

const LABEL = { lighting: '光线', color: '色彩', atmosphere: '氛围' };

function stats(snap, field) {
  const c = {};
  Object.keys(snap).forEach(function (s) {
    const v = snap[s][field];
    const k = v === null || v === undefined ? '（空）' : v;
    c[k] = (c[k] || 0) + 1;
  });
  const keys = Object.keys(c).sort((a, b) => c[b] - c[a]);
  return { kinds: keys.length, top: keys[0], topN: c[keys[0]], total: Object.keys(snap).length, dist: c, keys: keys };
}

console.log(`风格 ${Object.keys(after).length} 个\n`);
['lighting', 'color', 'atmosphere'].forEach(function (f) {
  const b = stats(before, f);
  const a = stats(after, f);
  console.log(`=== ${LABEL[f]} ===`);
  console.log(`  改前: ${b.kinds} 种取值，最高「${b.top}」${b.topN} 个 (${(b.topN / b.total * 100).toFixed(0)}%)`);
  console.log(`  改后: ${a.kinds} 种取值，最高「${a.top}」${a.topN} 个 (${(a.topN / a.total * 100).toFixed(0)}%)`);
  console.log(`  改后前 6: ${a.keys.slice(0, 6).map(k => `${k}×${a.dist[k]}`).join('  ')}`);
  console.log('');
});

// 三个维度加起来，有多少种不同的「组合」
function combo(snap) {
  const c = {};
  Object.keys(snap).forEach(function (s) {
    const v = snap[s];
    const k = [v.lighting, v.color, v.atmosphere].join('|');
    c[k] = (c[k] || 0) + 1;
  });
  const keys = Object.keys(c).sort((a, b) => c[b] - c[a]);
  return { kinds: keys.length, topN: c[keys[0]] };
}
const cb = combo(before), ca = combo(after);
console.log('=== 三维组合（光+色+氛围）===');
console.log(`  改前: ${cb.kinds} 种不同组合，最常见重复 ${cb.topN} 次`);
console.log(`  改后: ${ca.kinds} 种不同组合，最常见重复 ${ca.topN} 次`);
console.log(`\n结论：320 个风格里，改后 ${ca.kinds} 个组合互不相同（${(ca.kinds / 320 * 100).toFixed(0)}%）`);
