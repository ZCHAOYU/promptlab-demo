'use strict';
/* 细化审计：CONTEXT_MAP / CONCEPT_MAP / SIMPLE_ITEM_MAP 三类问题
     ① 脏数据 —— mapping 的目标值根本不在该维度的词库里
     ② key 冲突 —— 同一个 key 被多个目标认领
     ③ 不可达 —— 词库里有，但没有任何 mapping 指向它
   产出 _dev/map-audit.md + map-audit.json
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

const G = (expr) => JSON.parse(vm.runInContext('JSON.stringify(' + expr + ')', ctx));

const KW_DB = G('KW_DB');
const CONTEXT_MAP = G('CONTEXT_MAP');
const CONCEPT_MAP = G('CONCEPT_MAP');
const SIMPLE_ITEM_MAP = G('SIMPLE_ITEM_MAP');

const DIMS = ['style', 'lighting', 'composition', 'color', 'atmosphere', 'character', 'gender', 'scene'];
const PROPDIMS = ['material', 'texture', 'display', 'background'];

/* 收集所有 mapping 的 (dim, target, keys) */
const mappings = [];      // { src, dim, target, keys }
for (const dim of [...DIMS, ...PROPDIMS]) {
  for (const m of (CONTEXT_MAP[dim] || [])) {
    const target = m[dim];
    if (!target) continue;
    mappings.push({ src: 'CONTEXT', dim, target, keys: m.keys || [] });
  }
}
for (const [word, mp] of Object.entries(CONCEPT_MAP)) {
  for (const [dim, target] of Object.entries(mp)) {
    mappings.push({ src: 'CONCEPT', dim, target, keys: [word] });
  }
}
for (const [word, mp] of Object.entries(SIMPLE_ITEM_MAP)) {
  for (const [dim, target] of Object.entries(mp)) {
    mappings.push({ src: 'ITEM', dim, target, keys: [word] });
  }
}

/* ① 脏数据：目标不在库 */
const dirty = [];
for (const m of mappings) {
  const cats = (KW_DB[m.dim] && KW_DB[m.dim].categories) || {};
  if (!Object.prototype.hasOwnProperty.call(cats, m.target)) {
    dirty.push(m);
  }
}

/* ② key 冲突 */
const keyOwner = {};
for (const m of mappings) {
  for (const k of m.keys) {
    const id = m.dim + '|' + k;
    (keyOwner[id] = keyOwner[id] || new Set()).add(m.target);
  }
}
const conflicts = Object.entries(keyOwner)
  .filter(([, v]) => v.size > 1)
  .map(([id, v]) => ({ id, targets: [...v] }))
  .sort((a, b) => b.targets.length - a.targets.length);

/* ③ 不可达：库里有，没人指向 */
const reachable = {};
for (const m of mappings) (reachable[m.dim] = reachable[m.dim] || new Set()).add(m.target);
const unreachable = [];
for (const dim of [...DIMS, ...PROPDIMS]) {
  const cats = (KW_DB[dim] && KW_DB[dim].categories) || {};
  const hit = reachable[dim] || new Set();
  for (const name of Object.keys(cats)) {
    if (!hit.has(name)) unreachable.push({ dim, name });
  }
}

/* ---- 输出 ---- */
console.log('=== ① 脏数据（目标不在该维度词库里）===');
console.log('共 ' + dirty.length + ' 条');
const dirtyByDim = {};
dirty.forEach(d => (dirtyByDim[d.dim] = dirtyByDim[d.dim] || []).push(d));
Object.entries(dirtyByDim).forEach(([d, v]) => {
  console.log('  ' + d + '：' + v.length + ' 条 → ' +
    [...new Set(v.map(x => x.target))].slice(0, 12).join('、'));
});

console.log('\n=== ② key 冲突 ===');
console.log('共 ' + conflicts.length + ' 处');
conflicts.slice(0, 12).forEach(c => console.log('  ' + c.id + ' → ' + c.targets.join(' / ')));

console.log('\n=== ③ 不可达（库里有、无 mapping 指向）===');
console.log('共 ' + unreachable.length + ' 条');
const unByDim = {};
unreachable.forEach(d => (unByDim[d.dim] = unByDim[d.dim] || []).push(d.name));
Object.entries(unByDim).forEach(([d, v]) => {
  console.log('  ' + d + '：' + v.length + ' 条 → ' + v.slice(0, 10).join('、') + (v.length > 10 ? '…' : ''));
});

/* ---- 写报告 ---- */
const M = ['# 映射细化审计', '',
  '| 类别 | 数量 |', '|---|---|',
  '| ① 脏数据（目标不在库） | **' + dirty.length + '** |',
  '| ② key 冲突 | **' + conflicts.length + '** |',
  '| ③ 库内不可达 | **' + unreachable.length + '** |', ''];

M.push('## ① 脏数据', '', '> 这些 mapping 写出的目标值，在 `KW_DB[dim].categories` 里不存在，');
M.push('> 一旦命中，下游 `KW_DB[dim].categories[target]` 取不到东西，要么报错要么静默丢失。', '');
Object.entries(dirtyByDim).sort((a, b) => b[1].length - a[1].length).forEach(([d, v]) => {
  M.push('### ' + d + '（' + v.length + '）', '');
  M.push('| 目标值 | 触发词（前 6 个） | 来源 |');
  M.push('|---|---|---|');
  v.forEach(x => M.push('| `' + x.target + '` | ' + x.keys.slice(0, 6).join('、') + ' | ' + x.src + ' |'));
  M.push('');
});

M.push('## ② key 冲突', '', '> 同一个词被多个目标认领，按表顺序裁决（后者胜），结果不可预测。', '');
M.push('| 维度\\|关键词 | 被认领为 |', '|---|---|');
conflicts.forEach(c => M.push('| `' + c.id + '` | ' + c.targets.join(' / ') + ' |'));
M.push('');

M.push('## ③ 库内不可达', '', '> 这些词条目在词库里，但没有任何 mapping 会产出它 —— 永远不会被检测到。', '');
Object.entries(unByDim).sort((a, b) => b[1].length - a[1].length).forEach(([d, v]) => {
  M.push('### ' + d + '（' + v.length + '）', '');
  M.push(v.join('、'), '');
});

fs.writeFileSync(path.join(__dirname, 'map-audit.md'), M.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'map-audit.json'), JSON.stringify({ dirty, conflicts, unreachable }, null, 2), 'utf8');
console.log('\n已写入 _dev/map-audit.md 与 map-audit.json');
