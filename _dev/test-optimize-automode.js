'use strict';
/* 直接跑真实 optimize() 路径（点「一键优化」走的就是它） */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    checked: false, disabled: false,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, blur() {}, click() {}, remove() {}, scrollIntoView() {},
    closest() { return null; }
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() {}, removeEventListener() {}, execCommand() { return true; }
};
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node', clipboard: { writeText: async () => {} }, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('x'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {},
  Event: function () {}, CustomEvent: function () {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'archive-slots.js','archive-fix.js','app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}

/* 按 id 取真实元素，让 optimize 能读写 input */
const inputEl = cache['promptInput'] || (cache['promptInput'] = mk());

const CASES = [
  ['一位白衣剑客', '?', 'standard'],
  ['一把生锈的长剑', '?', 'standard'],
  ['一片竹林', '?', 'standard'],
  ['一盏纸灯笼', '?', 'standard'],
  ['雨夜的霓虹街道', '?', 'standard'],
  ['竹林深处的剑客', '?', 'standard']
];

let ok = 0, fail = 0;
for (const [text, mode, depth] of CASES) {
  let err = '';
  try {
    const expr = '(function(){' +
      'currentDepth=' + JSON.stringify(depth) + ';' +
      'window.__subjectConfirmFor=' + JSON.stringify(text) + ';' +
      'window.__autoModeResolved=null;' +
      'input.value=' + JSON.stringify(text) + ';' +
      'currentMode="character";' +
      'optimize();' +
      'return JSON.stringify({mode:currentMode});})()';
    const rr = JSON.parse(vm.runInContext(expr, ctx));
    console.log("   自动判定 → " + rr.mode);
  } catch (e) {
    err = e.message.split('\n')[0];
  }
  if (err) { fail++; console.log('✗ [' + mode + '/' + depth + '] 「' + text + '」 → ' + err); }
  else { ok++; console.log('✓ [' + mode + '/' + depth + '] 「' + text + '」'); }
}
console.log('\noptimize() 小计: 通过 ' + ok + ' / 异常 ' + fail);
