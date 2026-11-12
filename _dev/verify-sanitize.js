'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
function mk() {
  return {
    style: {}, dataset: {}, children: [], _h: {}, value: '', textContent: '', innerHTML: '',
    checked: false, disabled: false,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, click() {}
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
  fetch: async () => { throw new Error('no net'); },
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
const san = vm.runInContext('typeof sanitizeFills === "function" ? sanitizeFills : null', ctx);

/* 2026-11-11：原来只打印结果、从不判断 —— 这种脚本永远不会红，等于没有验收。
   断言只钉「函数承诺的行为」，不钉具体文案：维数被裁、道具维在人物模式被清。 */
let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } }

ok(typeof san === 'function', 'sanitizeFills 可用');

const base = {
  character: '摔跤手', gender: '男性', scene: '婚礼教堂', style: '暗黑童话',
  lighting: '光剑光', composition: '拼贴构图', quality: '超写实', color: '藕金',
  atmosphere: '暗黑压抑', material: '金属', texture: '深邃',
  display: '产品特写', background: '暗调背景'
};
const inDims = Object.keys(base).filter(k => base[k]).length;
const ch = san(JSON.parse(JSON.stringify(base)), 'character');
const chDims = Object.keys(ch).filter(k => ch[k]).length;
console.log('人物模式 ' + inDims + ' 维 → ' + chDims + ' 维：' + Object.keys(ch).filter(k => ch[k]).join(', '));
console.log('  display/background 已清: ' + (ch.display === null && ch.background === null));
ok(chDims < inDims, '人物模式有裁维（' + inDims + ' → ' + chDims + '）');
ok(ch.display === null && ch.background === null, '人物模式清掉了道具维 display/background');

const pr = san(JSON.parse(JSON.stringify(base)), 'prop');
const prDims = Object.keys(pr).filter(k => pr[k]).length;
console.log('道具模式 ' + inDims + ' 维 → ' + prDims + ' 维');
console.log('  道具模式保留 display/background: ' + (!!pr.display && !!pr.background));
ok(prDims < inDims, '道具模式也有裁维（' + inDims + ' → ' + prDims + '）');
ok(!!pr.display && !!pr.background, '道具模式保留 display/background');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
