'use strict';
/* 随机抽 15 个角色，把三张脸打印出来人工过目。
   用法：node _dev/sample-faces.js [条数] [--seed 7] */
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

const FACES = vm.runInContext('window.__ROLE_FACES || {}', ctx);
const ZH = vm.runInContext('(function(){var o={};var c=KW_DB.character.categories;' +
  'for(var k in c){var z=c[k].zh||{};o[k]=z.core||"";}return o;})()', ctx);

const N = parseInt(process.argv[2] || '15', 10);
const si = process.argv.indexOf('--seed');
const seed = si >= 0 ? parseInt(process.argv[si + 1], 10) : 7;
let s = seed;
function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }

const roles = Object.keys(FACES);
for (let i = roles.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [roles[i], roles[j]] = [roles[j], roles[i]];
}

roles.slice(0, N).forEach(function (r) {
  console.log(`【${r}】档案：${ZH[r] || '（无 zh.core）'}`);
  ['daily', 'action', 'quiet'].forEach(function (k) {
    console.log(`  ${k.padEnd(7)} ${FACES[r][k]}`);
  });
  console.log('');
});
