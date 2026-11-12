'use strict';
/* 全模式端到端冒烟：人物/场景/道具 × 中英文 × 深浅度
   检查：是否抛错、输出是否为空、是否出现 undefined/null/NaN/[object */
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

const INPUTS = [
  ['一位老人', 'character'],
  ['一位手持法杖的魔法师', 'character'],
  ['a knight standing in the rain', 'character'],
  ['一片竹林', 'scene'],
  ['一座赛博朋克风格的城市，下雨，霓虹', 'scene'],
  ['一把长剑', 'prop'],
  ['一盏纸灯笼在夜色中摇曳', 'prop'],
  ['', 'character'],
  ['。', 'character'],
  ['一个', 'character']
];
const DEPTHS = ['basic', 'standard', 'deep'];

let fail = 0, ok = 0;
for (const [text, mode] of INPUTS) {
  for (const depth of DEPTHS) {
    let out = '', err = '';
    try {
      const expr = '(function(){' +
        'currentMode=' + JSON.stringify(mode) + ';' +
        'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
        'var f=smartFill(d,' + JSON.stringify(text) + ');' +
        'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,' + JSON.stringify(depth) + ',d);' +
        'return typeof o==="string"?o:(o&&o.optimized)||"";})()';
      out = String(vm.runInContext(expr, ctx));
    } catch (e) { err = e.message.split('\n')[0]; }

    const bad = /undefined|NaN|\[object |null，|，null/.test(out);
    const empty = !out.trim();
    const isBad = !!err || bad || empty;
    if (isBad) { fail++; } else { ok++; }

    if (isBad) {
      console.log('✗ [' + mode + '/' + depth + '] 「' + text + '」');
      if (err) console.log('    异常: ' + err);
      if (empty) console.log('    输出为空');
      if (bad) console.log('    疑似脏值: ' + out.slice(0, 120));
    }
  }
}
console.log('\n小计: 通过 ' + ok + ' / 异常 ' + fail + '（共 ' + (ok + fail) + ' 组）');
