'use strict';
/* 统一的「按 index.html 里真实顺序加载脚本」工具。
   ------------------------------------------------------------
   为什么要有这个文件：
     以前每个测试脚本自己写死一份加载清单。结果 archive-faces.js 加进
     index.html 之后，测试脚本的清单里没有它 ——
     测试照常全绿，浏览器里却是另一套代码。
     清单只有一个来源：index.html。

   用法：
     const { loadApp } = require('./load-scripts');
     loadApp(ctx, { skip: ['config.local.js'] });
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/** 从 index.html 里按出现顺序抽出本地脚本文件名 */
function scriptsFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath || path.join(ROOT, 'index.html'), 'utf8');
  const out = [];
  const re = /<script[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    let src = m[1].trim();
    if (/^(https?:)?\/\//i.test(src)) continue;      // 外链跳过
    src = src.split('?')[0].split('#')[0];           // 去掉 ?v=
    out.push(src);
  }
  return out;
}

/** 按 index.html 顺序把脚本跑进 vm 上下文，返回实际加载的清单 */
function loadApp(ctx, opts) {
  const o = opts || {};
  const skip = o.skip || [];
  const files = scriptsFromHtml(o.html).filter(function (f) {
    if (skip.indexOf(f) >= 0) return false;
    if (o.since && f === o.since) return false;
    return fs.existsSync(path.join(ROOT, f));
  });
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const wrapped = o.beforeEach ? o.beforeEach(f) || src : src;
    require('vm').runInContext(wrapped, ctx, { filename: f });
  }
  return files;
}

module.exports = { scriptsFromHtml, loadApp, ROOT };

if (require.main === module) {
  const list = scriptsFromHtml();
  console.log('index.html 里的本地脚本（按顺序）：');
  list.forEach(function (f, i) {
    const p = path.join(ROOT, f);
    const size = fs.existsSync(p) ? (fs.statSync(p).size / 1024).toFixed(1) + ' KB' : '缺失';
    console.log(`  ${i + 1}. ${f}  ${size}`);
  });
}
