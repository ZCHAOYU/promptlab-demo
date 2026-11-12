'use strict';
/* 单点调试：为什么「阿拉伯书法」「暗黑童话」的 fills 没变。
   用法：node _dev/debug-one-style.js 阿拉伯书法 */
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
  fetch: async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });

const styles = process.argv.slice(2);
if (!styles.length) styles.push('阿拉伯书法', '暗黑童话');

styles.forEach(function (s) {
  const text = '一位剑客，' + s;
  const r = JSON.parse(vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var pick={};["style","lighting","color","atmosphere","scene"].forEach(function(k){' +
    'pick[k]=(d[k]&&d[k].detected)||null;});' +
    'return JSON.stringify({det:pick,fills:{style:f.style,lighting:f.lighting,' +
    'color:f.color,atmosphere:f.atmosphere,scene:f.scene}});})()', ctx));
  console.log(`\n「${text}」`);
  console.log('  检测:', JSON.stringify(r.det));
  console.log('  fills:', JSON.stringify(r.fills));
  const D = vm.runInContext('(window.__STYLE_DEFAULTS||{}).lighting || {}', ctx);
  console.log(`  __STYLE_DEFAULTS.lighting['${s}'] =`, D[s] || '（没有这个键）');
});
