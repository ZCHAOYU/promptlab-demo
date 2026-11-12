'use strict';
/* 验证「没认出主体」守卫：哪些输入会弹窗、哪些不会 */
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

const hasModal = vm.runInContext('typeof showSubjectConfirm === "function"', ctx);
console.log('showSubjectConfirm 已定义:', hasModal);
console.log('');

const CASES = [
  ['你好', 'chat'],
  // 『老人』『少女』在角色库里是真的词条（有档案、有变体），认得出就该直接生成。
  // 这四条原来标 no-char，是角色库还很薄时写的期望，已过期。
  // 用 _dev/check-guard-with.js 对比 _archive/app.before-faces.js 确认过：行为没变。
  ['老人', 'char'],
  ['一个老人', 'char'],
  ['一位老人', 'char'],
  ['一位少女', 'char'],
  ['一片竹林', 'scene'],
  ['一位剑客', 'char'],
  ['一位手持法杖的魔法师', 'char'],
  ['街角咖啡馆', 'scene']
];

let pass = 0, fail = 0;
for (const [text, kind] of CASES) {
  const d = vm.runInContext(
    'JSON.stringify({c: (function(){var x=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'return x.character && x.character.detected || null;})(),' +
    's: (function(){var x=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'return x.scene && x.scene.detected || null;})()})', ctx);
  const { c, s } = JSON.parse(d);
  const willModal = !c && !s;
  const expectModal = (kind === 'chat' || kind === 'no-char');
  const ok = willModal === expectModal;
  if (ok) pass++; else fail++;
  console.log((ok ? 'PASS  ' : 'FAIL  ') + '「' + text + '」  角色=' + (c || '—') +
    '  场景=' + (s || '—') + '  → 弹窗=' + (willModal ? '是' : '否') +
    '（期望 ' + (expectModal ? '是' : '否') + '）');
}
console.log('\n通过 ' + pass + ' / ' + CASES.length);
process.exit(fail ? 1 : 0);
