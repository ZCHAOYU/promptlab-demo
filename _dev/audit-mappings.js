'use strict';
/* 映射表审计：把词库里每一条名字，当作"用户输入"喂给 detectDimensions，
   看它能不能识别回自己。识别不回来，就是映射缺失或关键词被抢。

   用法：node audit-mappings.js
   产出：audit-report.md + 控制台摘要
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, click() {}, remove() {}
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() {}, execCommand() { return true; }
};
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('x'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'archive-slots.js','archive-fix.js','app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}

const KW_DB = vm.runInContext('typeof KW_DB !== "undefined" ? KW_DB : null', ctx);
if (!KW_DB) { console.log('KW_DB 不可用'); process.exit(1); }

/* 维度 → (KW_DB 分类名, detection 里的字段, mode) */
const DIMS = [
  ['角色', 'character', 'character', 'character'],
  ['场景', 'scene', 'scene', 'scene'],
  ['风格', 'style', 'style', 'character'],
  ['光线', 'lighting', 'lighting', 'character'],
  ['构图', 'composition', 'composition', 'character'],
  ['色彩', 'color', 'color', 'character'],
  ['氛围', 'atmosphere', 'atmosphere', 'character'],
  ['画质', 'quality', 'quality', 'character']
];

const CN = { role: '角色', scene: '场景', style: '风格', light: '光线', composition: '构图', color: '色彩', atmosphere: '氛围', quality: '画质' };

function detect(text, mode) {
  const src = 'detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ')';
  return vm.runInContext(src, ctx);
}

const rows = [];
let total = 0, missing = 0, wrong = 0;

for (const [label, dbKey, field, mode] of DIMS) {
  const cat = KW_DB[dbKey] && KW_DB[dbKey].categories;
  if (!cat) { console.log('跳过（无表）:', label); continue; }
  const names = Object.keys(cat);
  let m = 0, w = 0;
  for (const name of names) {
    total++;
    let got = null;
    try {
      const d = detect(name, mode);
      got = d && d[field] && d[field].detected ? d[field].detected : null;
    } catch (e) { got = '__ERR__'; }
    if (!got) {
      missing++; m++;
      rows.push({ dim: label, name, got: '未识别' });
    } else if (got !== name) {
      wrong++; w++;
      rows.push({ dim: label, name, got });
    }
  }
  console.log(label.padEnd(4) + ' 共 ' + String(names.length).padStart(4) +
    ' 条　未识别 ' + String(m).padStart(3) + '　错配 ' + String(w).padStart(3));
}

console.log('\n================ 汇总 ================');
console.log('总条目 ' + total + '　未识别 ' + missing + '　错配 ' + wrong +
  '　问题率 ' + (Math.round((missing + wrong) / total * 1000) / 10) + '%');

/* 错配分组：同一个"被抢到的目标"聚在一起，最容易看出规律 */
const byGot = {};
rows.forEach(r => { (byGot[r.got] = byGot[r.got] || []).push(r); });
console.log('\n--- 被抢走的（按抢到的目标分组，只列 ≥2 条的）---');
Object.entries(byGot)
  .filter(([, v]) => v.length >= 2)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 15)
  .forEach(([got, v]) => {
    console.log('  →「' + got + '」抢走了 ' + v.length + ' 条：' +
      v.slice(0, 8).map(x => x.name).join('、') + (v.length > 8 ? '…' : ''));
  });

/* 写报告 */
const M = ['# 映射表审计报告', '',
  '- 总条目 ' + total + '　未识别 **' + missing + '**　错配 **' + wrong + '**',
  '- 问题率 ' + (Math.round((missing + wrong) / total * 1000) / 10) + '%', '',
  '> 方法：把词库里每一条名字当作"用户输入"喂给 detectDimensions，',
  '> 看它能否识别回自己。识别不回来 = 映射缺失或关键词被别的条目抢走。', ''];
const dims = [...new Set(rows.map(r => r.dim))];
dims.forEach(d => {
  const rs = rows.filter(r => r.dim === d);
  M.push('## ' + d + '（' + rs.length + ' 条问题）', '');
  M.push('| 词库名字 | 实际识别成 |');
  M.push('|---|---|');
  rs.slice(0, 200).forEach(r => M.push('| ' + r.name + ' | ' + r.got + ' |'));
  M.push('');
});
M.push('## 被抢走的（按目标分组）', '');
Object.entries(byGot).sort((a, b) => b[1].length - a[1].length).slice(0, 30).forEach(([got, v]) => {
  M.push('### → 「' + got + '」（' + v.length + ' 条）');
  M.push(v.map(x => x.name).join('、'));
  M.push('');
});

fs.writeFileSync(path.join(__dirname, 'audit-report.md'), M.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'audit-result.json'), JSON.stringify({ total, missing, wrong, rows }, null, 2), 'utf8');
console.log('\n已写入 _dev/audit-report.md 与 audit-result.json');
