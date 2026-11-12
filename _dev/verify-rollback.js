'use strict';
/* 回滚点功能验证（只读）：用备份替换 app.js 跑一遍冒烟
   用法：node _dev/verify-rollback.js <备份文件名>
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BK = process.argv[2];
if (!BK) { console.log('用法: node _dev/verify-rollback.js app.before-XXX.js'); process.exit(1); }
const bkPath = path.join(ROOT, '_archive', BK);
if (!fs.existsSync(bkPath)) { console.log('备份不存在:', BK); process.exit(1); }

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

// 数据层固定用当前版本，只替换 app.js
// 清单来自 index.html（since: 'app.js' 表示加载到 app.js 之前为止）
const { loadApp } = require('./load-scripts');
try {
  loadApp(ctx, {
    since: 'app.js',
    skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']
  });
  const code = fs.readFileSync(bkPath, 'utf8');
  vm.runInContext(code, ctx, { filename: BK });
} catch (e) {
  console.log('  ✗ 加载失败:', e.message.split('\n')[0]);
  process.exit(1);
}

const CASES = ['一位剑客', '一片竹林', '一把生锈的长剑', '一位老人', '现代都市霸总，西装革履'];
let ok = 0, fail = 0;
const outs = [];
for (const t of CASES) {
  try {
    const r = vm.runInContext(
      '(function(){' +
      'var m=(typeof inferSubjectType==="function")?inferSubjectType(' + JSON.stringify(t) + ',detectDimensions(' + JSON.stringify(t) + ',"character")):"character";' +
      'var d=detectDimensions(' + JSON.stringify(t) + ',' + JSON.stringify('character') + ');' +
      'var f=smartFill(d,' + JSON.stringify(t) + ');' +
      'var o=buildOptimizedPrompt(' + JSON.stringify(t) + ',f,"standard",d);' +
      'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
      'return String(s);})()', ctx);
    if (r && r.length > 5) { ok++; outs.push(r); }
    else { fail++; console.log('  ✗ 空输出:', t); }
  } catch (e) {
    fail++;
    console.log('  ✗ 异常「' + t + '」:', e.message.split('\n')[0]);
  }
}
console.log('  ' + BK + ' → 通过 ' + ok + '/' + CASES.length + (fail === 0 ? '  ✓ 可用' : '  ✗ 有问题'));
if (outs.length) console.log('  样例: ' + outs[0].slice(0, 70));
