'use strict';
/* 方案 A 验证：_audit 数值是否合理 + 提示是否该出现 */
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

const CASES = [
  ['一位老人坐在长椅上', '不该提示（动作已被采用）'],
  ['一位穿宇航服的骑士', '应提示：描述大部分未使用'],
  ['老人，一位老人，一位老人，一只猫', '应提示：多个主体'],
  ['一位六足机械兽', '应提示：多个主体 或 利用不足'],
  ['一位剑客', '不该有任何 A 提示'],
  ['一片樱花林', '不该有任何 A 提示'],
  ['暗黑骑士', '不该有任何 A 提示']
];

for (const [t, expect] of CASES) {
  const expr = '(function(){' +
    'var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
    'return JSON.stringify(d._audit || null);})()';
  const a = JSON.parse(vm.runInContext(expr, ctx));
  if (!a) { console.log('「' + t + '」→ 无 _audit'); continue; }
  const utilPct = Math.round(a.utilization * 100);
  const willMulti = Object.keys(a.multi || {}).length > 0;
  const willLow = a.inputLen >= 6 && a.matched.length > 0 && a.utilization < a.threshold;
  console.log('「' + t + '」');
  console.log('  利用率 ' + utilPct + '%（' + a.matchedLen + '/' + a.inputLen + ' 字）' +
    '  命中: ' + (a.matched.join('、') || '无') +
    '  多主体: ' + (willMulti ? JSON.stringify(a.multi) : '否') +
    '  低利用: ' + (willLow ? '是' : '否'));
  console.log('  期望: ' + expect);
  console.log('');
}
