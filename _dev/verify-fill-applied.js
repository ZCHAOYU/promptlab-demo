'use strict';
/* 运行时核对：454 条生成的描述，实际有多少进了 KW_DB */
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

const MAP = { scene: 'scene', composition: 'composition', color: 'color', light: 'lighting', atmosphere: 'atmosphere', quality: 'quality' };
const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'archive-fill-preview.json'), 'utf8'));

let hit = 0, noDetail = [], noEntry = [];
for (const it of items) {
  const kw = MAP[it.kind];
  if (!kw || !it.desc) continue;
  const r = vm.runInContext(
    '(function(){' +
    'var c=KW_DB[' + JSON.stringify(kw) + '] && KW_DB[' + JSON.stringify(kw) + '].categories[' + JSON.stringify(it.name) + '];' +
    'if(!c) return "noentry";' +
    'var d=c.zh && (c.zh.detail||c.zh.effect||c.zh.mode);' +
    'return d ? "ok" : "nodetail";})()', ctx);
  if (r === 'ok') hit++;
  else if (r === 'noentry') noEntry.push(it.kind + ':' + it.name);
  else noDetail.push(it.kind + ':' + it.name);
}
console.log('已生效: ' + hit + ' / ' + items.length);
console.log('有条目但无描述: ' + noDetail.length);
console.log('完全没条目: ' + noEntry.length);
if (noDetail.length) console.log('  样例: ' + noDetail.slice(0, 6).join('  '));
if (noEntry.length) console.log('  样例: ' + noEntry.slice(0, 6).join('  '));
