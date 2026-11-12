'use strict';
/* 覆盖率对照：词库里每个角色，是否都有姿势变体 / 面容变体。
   用法：node _dev/audit-coverage.js */
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

const roles = vm.runInContext('Object.keys(KW_DB.character.categories)', ctx);
const V = ctx.window.__ROLE_VARIANTS || {};
const F = ctx.window.__ROLE_FACES || {};
const D = vm.runInContext('(function(){var o={};var c=KW_DB.character.categories;' +
  'for(var k in c){o[k]=((c[k].zh||{}).detail||"").length>0;}return o;})()', ctx);

function bad(map) {
  return roles.filter(function (r) {
    const v = map[r];
    if (!v) return true;
    return !(v.daily && v.action && v.quiet);
  });
}

const noV = bad(V), noF = bad(F);
const noD = roles.filter(r => !D[r]);

console.log(`词库角色 ${roles.length}`);
console.log(`姿势变体缺 ${noV.length}：${noV.join('、') || '无'}`);
console.log(`面容变体缺 ${noF.length}：${noF.join('、') || '无'}`);
console.log(`档案描述缺 ${noD.length}：${noD.join('、') || '无'}`);
