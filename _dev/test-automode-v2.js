'use strict';
/* 如果取消模式选择、改为自动判断，会有多准？
   规则草案：detectDimensions(text,'character') 全量检测后
     character 命中 → 人物
     else scene 命中 → 场景
     else material 命中 → 道具
     else → 人物（并触发缺主体） */
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

/* [输入, 用户心里的类型] */
const CASES = [
  ['一位白衣剑客', 'character'],
  ['一位老人坐在长椅上', 'character'],
  ['一片竹林', 'scene'],
  ['雨夜的霓虹街道', 'scene'],
  ['一座哥特城堡', 'scene'],
  ['一把生锈的长剑', 'prop'],
  ['一盏纸灯笼', 'prop'],
  ['一杯热咖啡', 'prop'],
  ['古旧的机械怀表', 'prop'],
  ['竹林深处的剑客', 'character'],
  ['火焰长枪', 'prop'],
  ['一把刀的刀柄特写', 'prop']
];

console.log('输入'.padEnd(22) + '角色'.padEnd(14) + '场景'.padEnd(14) + '材质'.padEnd(10) + '自动判定');
console.log('-'.repeat(84));
const stat = { correct: 0, total: 0 };
for (const [text, expect] of CASES) {
  const r = JSON.parse(vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'return JSON.stringify({' +
    'c:(d.character&&d.character.detected)||"",' +
    's:(d.scene&&d.scene.detected)||"",' +
    'm:(d.material&&d.material.detected)||""});})()', ctx));
  // 规则 v2：先用中文量词判类型（最可靠信号），再用检测结果兜底
  let auto;
  if (/[一这那]\s*(把|盏|杯|只|部|件|台|枚|柄|张|条(?!街|路|河))/.test(text)) auto = 'prop';
  else if (/[一这那]\s*(位|名|个(?!人))/.test(text) && r.c) auto = 'character';
  else if (/[一这那]\s*(片|座|间|处|条|栋)/.test(text)) auto = 'scene';
  else if (r.c && !r.m) auto = 'character';
  else if (r.m && !r.c) auto = 'prop';
  else if (r.s && !r.c) auto = 'scene';
  else if (r.c) auto = 'character';
  else if (r.s) auto = 'scene';
  else auto = 'character';
  const ok = auto === expect;
  stat.total++; if (ok) stat.correct++;
  console.log(text.padEnd(22) + (r.c || '—').padEnd(14) + (r.s || '—').padEnd(14) +
    (r.m || '—').padEnd(10) + (ok ? '✓ ' : '✗ ') + auto + (ok ? '' : '（期望 ' + expect + '）'));
}
console.log('\n规则v2 准确率: ' + stat.correct + '/' + stat.total +
  ' = ' + Math.round(stat.correct / stat.total * 100) + '%');
