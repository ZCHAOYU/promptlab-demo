'use strict';
/* 列出所有「固定连接词」拼接点，改之前先看清楚一共有几处、分别长什么样。
   用法：node _dev/find-connectives.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const SRC = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8').split(/\r?\n/);

const PATTERNS = [
  ['lighting', /映照|洒落|照明/],
  ['color', /色调/],
  ['atmosphere', /氛围/],
  ['composition', /构图|视角|取景/],
  ['style', /风格/],
  ['quality', /画质/],
  ['scene', /身处|置身于/]
];

const hits = [];
SRC.forEach(function (line, i) {
  if (/^\s*(\/\/|\*)/.test(line)) return;              // 跳过注释
  PATTERNS.forEach(function (p) {
    if (p[1].test(line) && /push\(|=\s*'|=\s*"|\.join\(/.test(line)) {
      hits.push({ n: i + 1, dim: p[0], line: line.trim() });
    }
  });
});

const byDim = {};
hits.forEach(function (h) { (byDim[h.dim] = byDim[h.dim] || []).push(h); });

Object.keys(byDim).forEach(function (d) {
  console.log(`\n=== ${d}（${byDim[d].length} 处）===`);
  byDim[d].forEach(function (h) { console.log(`  L${h.n}: ${h.line}`); });
});
console.log(`\n合计 ${hits.length} 处`);
