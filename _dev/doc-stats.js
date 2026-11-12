'use strict';
/* 文档同步前先把真实数字量一遍，避免 README 里写的是过期数字。
   用法：node _dev/doc-stats.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

const FILES = ['index.html', 'styles.css', 'app.js', 'smart-engine.js', 'data-kwdb.js',
  'translations.js', 'archive-detail.js', 'archive-slots.js', 'archive-fix.js',
  'archive-variants.js', 'archive-faces.js', 'semantic-search.js', 'llm-arbiter.js',
  'agent-panel.js', 'config.local.js', 'serve.py', 'entries.json', 'vectors.bin',
  'vectors.meta.json', 'README.md'];

console.log('=== 文件 ===');
FILES.forEach(function (f) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log(`  ${f.padEnd(22)} 缺失`); return; }
  const kb = fs.statSync(p).size / 1024;
  console.log(`  ${f.padEnd(22)} ${kb > 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(1) + ' KB'}`);
});

const { scriptsFromHtml } = require('./load-scripts');
console.log('\n=== index.html 实际加载顺序 ===');
scriptsFromHtml().forEach(function (f, i) { console.log(`  ${i + 1}. ${f}`); });

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
  fetch: async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });

console.log('\n=== 数据规模 ===');
const dims = ['character', 'scene', 'style', 'lighting', 'composition', 'color', 'atmosphere', 'quality', 'material', 'texture'];
let total = 0;
dims.forEach(function (d) {
  const n = vm.runInContext(`Object.keys((KW_DB.${d}||{}).categories||{}).length`, ctx);
  total += n;
  console.log(`  ${d.padEnd(14)} ${String(n).padStart(4)}`);
});
console.log(`  ${'（以上合计）'.padEnd(12)} ${String(total).padStart(4)}`);
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));
console.log(`  entries.json   ${entries.length} 条`);
const faces = vm.runInContext('Object.keys(window.__ROLE_FACES||{}).length', ctx);
const vars = vm.runInContext('Object.keys(window.__ROLE_VARIANTS||{}).length', ctx);
const roles = vm.runInContext('Object.keys(KW_DB.character.categories).length', ctx);
console.log(`  角色 ${roles} / 姿势变体 ${vars} / 面容变体 ${faces}`);
const detail = vm.runInContext('window.__archiveDetailCount || 0', ctx);
console.log(`  档案描述补丁 ${detail} 条`);

const inferCache = path.join(ROOT, '_dev', 'infer-cache.json');
if (fs.existsSync(inferCache)) {
  console.log(`  LLM 推理缓存 ${Object.keys(JSON.parse(fs.readFileSync(inferCache, 'utf8'))).length} 条`);
}

console.log('\n=== _dev 工具数 ===');
const devFiles = fs.readdirSync(path.join(ROOT, '_dev')).filter(f => f.endsWith('.js') || f.endsWith('.py'));
console.log(`  ${devFiles.length} 个脚本`);
