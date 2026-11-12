'use strict';
/* 看生成出来的风格映射长什么样，人工过目有没有明显不搭的。
   用法：node _dev/peek-style-maps.js [条数] */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const p = path.join(__dirname, 'style-maps.json');
if (!fs.existsSync(p)) { console.log('还没有 style-maps.json'); process.exit(0); }
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
const keys = Object.keys(d);
const n = parseInt(process.argv[2] || String(keys.length), 10);
console.log(`共 ${keys.length} 条，显示前 ${Math.min(n, keys.length)} 条\n`);
keys.slice(0, n).forEach(function (k) {
  const v = d[k];
  console.log(`${k.padEnd(12)} 光 ${v.lighting.padEnd(10)} 色 ${v.color.padEnd(10)} 氛 ${v.atmosphere}`);
});
