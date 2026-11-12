'use strict';
/* 定位错配的真正原因：是"长度"、还是"同一个 key 被多个 mapping 抢"？ */
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

/* 1) 同一个 key 被多少个 mapping 认领？ */
const DUP = vm.runInContext(`
(function(){
  var out = {};
  Object.keys(CONTEXT_MAP).forEach(function(dim){
    (CONTEXT_MAP[dim] || []).forEach(function(m){
      (m.keys || []).forEach(function(k){
        var id = dim + '|' + k;
        var target = m[dim] || m.character || m.scene || '';
        if (!out[id]) out[id] = [];
        if (out[id].indexOf(target) < 0) out[id].push(target);
      });
    });
  });
  var dup = [];
  Object.keys(out).forEach(function(id){
    if (out[id].length > 1) dup.push({ id: id, targets: out[id] });
  });
  return JSON.stringify(dup);
})()`, ctx);
const dups = JSON.parse(DUP);
console.log('=== 同一个 key 被多个 mapping 认领：' + dups.length + ' 处 ===');
dups.slice(0, 25).forEach(d => console.log('  ' + d.id + '  →  ' + d.targets.join(' / ')));

/* 2) 实际命中时，命中的是哪个 key？ */
console.log('\n=== 实际命中追踪 ===');
const CASES = ['暗黑骑士', '居中对称', '铁灰', '樱花林', '无主剑客', '金橙', '对称式构图'];
for (const t of CASES) {
  const r = vm.runInContext(
    '(function(){var x=detectDimensions(' + JSON.stringify(t) + ",'character');" +
    'var o={};for(var d in x){if(x[d].detected)o[d]=x[d].detected+" ← "+(x[d].keywords||[]).join(",");}return JSON.stringify(o)})()', ctx);
  console.log('  「' + t + '」→ ' + r);
}
