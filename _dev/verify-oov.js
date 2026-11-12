'use strict';
/* 库外输入会怎样：检测 → 填充 → 最终提示词 */
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
  '一位量子程序员',
  '一只六足机械兽',
  '一位穿宇航服的骑士',
  '赛博朋克风格的量子计算机',
  '一位在星舰舰桥上喝咖啡的老船长',
  '一个从没见过的生物'
];

for (const t of CASES) {
  const expr = '(function(){' +
    'var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(t) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(t) + ',f,"deep",d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'var hit=[];["character","scene","style","lighting","color","atmosphere"].forEach(function(k){' +
    'if(d[k]&&d[k].detected)hit.push(k+"="+d[k].detected);});' +
    'return JSON.stringify({hit:hit,out:s});})()';
  const r = JSON.parse(vm.runInContext(expr, ctx));
  console.log('「' + t + '」');
  console.log('  检测: ' + (r.hit.length ? r.hit.join('  ') : '（无）'));
  console.log('  输出: ' + String(r.out).slice(0, 130));
  console.log('');
}
