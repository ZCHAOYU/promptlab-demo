'use strict';
/* 对比：同一批「原本没有风格映射」的输入，改动前后的输出差在哪。
   用法：
     node _dev/demo-style-defaults.js --app _archive/app.before-style-defaults.js
     node _dev/demo-style-defaults.js
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
  fetch: async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');

const ai = process.argv.indexOf('--app');
if (ai >= 0) {
  const target = process.argv[ai + 1];
  loadApp(ctx, { since: 'app.js', skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
  vm.runInContext(fs.readFileSync(path.join(ROOT, target), 'utf8'), ctx, { filename: path.basename(target) });
  console.log(`（版本：${target}）\n`);
} else {
  loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
  console.log('（版本：当前 app.js）\n');
}

const CASES = ['青绿山水', '汝窑', '赛博敦煌', '岭南画派', '泼墨山水', 'AI幻觉艺术'];

CASES.forEach(function (s) {
  const text = '一位剑客，' + s;
  const out = vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return typeof o==="string"?o:(o&&o.optimized)||"";})()', ctx);
  const parts = out.split('，');
  console.log(`「${s}」`);
  console.log('   句尾: ' + parts.slice(-6).join('，'));
  console.log('');
});
