'use strict';
/* 核对：entries.json 里有描述的维度，运行时 zh 是不是把描述丢了 */
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

const es = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));

const MAP = {
  color: 'color', light: 'lighting', composition: 'composition',
  atmosphere: 'atmosphere', scene: 'scene', quality: 'quality'
};

Object.keys(MAP).forEach(function (kind) {
  const kw = MAP[kind];
  const withContent = es.filter(function (e) {
    return e.kind === kind && String(e.zh || '').split('；').filter(function (x) { return x.trim(); }).length > 1;
  });
  console.log('[' + kind + '] 有描述的条目: ' + withContent.length);

  if (!withContent.length) return;
  withContent.slice(0, 3).forEach(function (e) {
    const entZh = String(e.zh).slice(0, 60);
    const rt = vm.runInContext(
      '(function(){var c=KW_DB[' + JSON.stringify(kw) + '].categories[' + JSON.stringify(e.name) + '];' +
      'if(!c||!c.zh)return "无";' +
      'return JSON.stringify(c.zh);})()', ctx);
    let parsed;
    try { parsed = JSON.parse(rt); } catch (e2) { parsed = {}; }
    const runtimeCore = (parsed && parsed.core) || '';
    const hasDetail = !!(parsed && (parsed.detail || parsed.effect || parsed.mode));
    console.log('  ' + e.name);
    console.log('    entries.json: ' + entZh);
    console.log('    运行时 zh:   ' + (typeof parsed === 'string' ? parsed : runtimeCore) +
      (hasDetail ? '  【带描述】' : '  ❌ 描述丢了'));
  });
  console.log('');
});
