'use strict';
/* 端到端：新角色是否能真正生成中文提示词 */
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

const G = (e) => vm.runInContext(e, ctx);

console.log('=== 新角色是否带中文 ===');
['老人', '老者', '少年', '少女', '孩童', '旅人', '工匠', '乞丐', '掌柜', '僧人'].forEach(n => {
  const has = G('(function(){var c=KW_DB.character.categories[' + JSON.stringify(n) + '];return c&&c.zh&&c.zh.core?c.zh.core:""})()');
  console.log('  ' + (n + '　　').slice(0, 5) + (has ? '✓ ' + has.slice(0, 26) : '✗ 缺 zh'));
});

console.log('\n=== 端到端生成（deep 模式）===');
['一位老人', '身披斗篷的旅人', '一个孩童', '一位少女'].forEach(text => {
  try {
    const out = G('(function(){' +
      'var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
      'var f=smartFill(d,' + JSON.stringify(text) + ');' +
      'var r=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"deep",d);' +
      'return typeof r==="string"?r:(r&&r.optimized)||"";})()');
    console.log('「' + text + '」');
    console.log('  ' + String(out).slice(0, 160));
    console.log('');
  } catch (e) {
    console.log('「' + text + '」生成失败: ' + e.message.split('\n')[0]);
  }
});
