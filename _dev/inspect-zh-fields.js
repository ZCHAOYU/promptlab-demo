'use strict';
/* 查清每个维度 zh 对象的真实字段名 */
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

const DIMS = ['style', 'lighting', 'composition', 'color', 'atmosphere', 'quality', 'scene'];
DIMS.forEach(function (dim) {
  const out = vm.runInContext(
    '(function(){' +
    'var cats=KW_DB[' + JSON.stringify(dim) + '] && KW_DB[' + JSON.stringify(dim) + '].categories;' +
    'if(!cats) return "[]";' +
    'var res=[];var n=0;' +
    'for(var k in cats){' +
    '  var zh=cats[k].zh;if(!zh)continue;' +
    '  var keys=Object.keys(zh).filter(function(x){return zh[x];});' +
    '  res.push({name:k,fields:keys,text:(zh.core||"")+" | "+(zh.detail||zh.effect||zh.mode||zh.desc||"")});' +
    '  if(++n>=2)break;' +
    '}' +
    'return JSON.stringify(res);})()', ctx);
  const arr = JSON.parse(out);
  const allFields = {};
  arr.forEach(a => a.fields.forEach(f => { allFields[f] = (allFields[f] || 0) + 1; }));
  console.log(dim.padEnd(12) + ' 字段: ' + Object.keys(allFields).join(', '));
  arr.slice(0, 2).forEach(a => console.log('    ' + a.name + ' → ' + a.text.slice(0, 70)));
});
