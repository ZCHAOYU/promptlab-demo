'use strict';
/* 运行时诊断：为什么 273 条 detail 没进 KW_DB */
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

const t = vm.runInContext('window.translations ? Object.keys(window.translations) : null', ctx);
console.log('translations 键:', t ? t.join(',') : '未定义');
console.log('scenes 条数:', vm.runInContext('window.translations && window.translations.scenes ? Object.keys(window.translations.scenes).length : -1', ctx));

['废弃工厂', '俯冲视角', '火山熔岩', '海底世界'].forEach(function (n) {
  const out = vm.runInContext(
    '(function(){' +
    'var res={};' +
    'var c=KW_DB.scene && KW_DB.scene.categories[' + JSON.stringify(n) + '];' +
    'res.sceneEntry=!!c;' +
    'res.sceneZh=c && c.zh ? Object.keys(c.zh).join(",") : "(none)";' +
    'var cc=KW_DB.composition && KW_DB.composition.categories[' + JSON.stringify(n) + '];' +
    'res.compEntry=!!cc;' +
    'res.compZh=cc && cc.zh ? Object.keys(cc.zh).join(",") : "(none)";' +
    'var sc=window.translations.scenes && window.translations.scenes[' + JSON.stringify(n) + '];' +
    'res.transScene=sc ? Object.keys(sc.zh||{}).join(",") : "(none)";' +
    'var cp=window.translations.compositions && window.translations.compositions[' + JSON.stringify(n) + '];' +
    'res.transComp=cp ? Object.keys(cp.zh||{}).join(",") : "(none)";' +
    'return JSON.stringify(res);})()', ctx);
  console.log(n + ' → ' + out);
});
