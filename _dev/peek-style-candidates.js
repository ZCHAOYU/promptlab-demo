'use strict';
/* 看候选集长什么样：三个候选是不是「都协调、只是取舍不同」。
   只看样例的话人眼能判断；量大的部分靠 audit-style-candidates.js。
   用法：node _dev/peek-style-candidates.js [条数] */
const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'style-candidates.json');
if (!fs.existsSync(p)) { console.log('还没有 style-candidates.json'); process.exit(0); }
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
const keys = Object.keys(d);
const n = parseInt(process.argv[2] || String(keys.length), 10);
console.log(`共 ${keys.length} 条，显示前 ${Math.min(n, keys.length)} 条\n`);
keys.slice(0, n).forEach(function (k) {
  const v = d[k];
  console.log(`【${k}】`);
  console.log(`  光 ${v.lighting.join(' / ')}`);
  console.log(`  色 ${v.color.join(' / ')}`);
  console.log(`  氛 ${v.atmosphere.join(' / ')}`);
});
