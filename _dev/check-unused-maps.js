'use strict';
/* 找出「补了映射但快照里没变化」的风格。
   这种就是死数据：映射写进去了，但真实路径根本走不到。
   用法：node _dev/check-unused-maps.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const todo = JSON.parse(fs.readFileSync(path.join(__dirname, 'style-map-todo.json'), 'utf8')).todo.map(x => x.style);
const before = JSON.parse(fs.readFileSync(path.join(__dirname, 'fills-before.json'), 'utf8'));
const after = JSON.parse(fs.readFileSync(path.join(__dirname, 'fills-after.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(__dirname, 'style-maps.json'), 'utf8'));

const unchanged = todo.filter(function (s) {
  return JSON.stringify(before[s]) === JSON.stringify(after[s]);
});
console.log(`补了映射的风格 ${todo.length} 个，快照里没变化的 ${unchanged.length} 个：`);
unchanged.forEach(function (s) {
  console.log(`\n  ${s}`);
  console.log(`    映射: ${JSON.stringify(gen[s])}`);
  console.log(`    before: ${JSON.stringify(before[s])}`);
  console.log(`    after : ${JSON.stringify(after[s])}`);
});

// 反向：补了但一次都没被用上的键
const used = new Set();
Object.keys(after).forEach(function (s) {
  const v = after[s];
  ['lighting', 'color', 'atmosphere'].forEach(function (d) {
    if (gen[s] && gen[s][d] === v[d]) used.add(s);
  });
});
const neverUsed = Object.keys(gen).filter(s => !used.has(s));
console.log(`\n生成的 ${Object.keys(gen).length} 条里，有 ${neverUsed.length} 条的三个值都没进快照：`);
neverUsed.forEach(s => console.log('  ' + s));
