'use strict';
/* B 项的直观演示：同一个输入连点 3 次，看「内容」有没有变（不只是说法）。
   用法：node _dev/demo-content-rounds.js */
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
const ai = process.argv.indexOf('--app');
if (ai >= 0) {
  const target = process.argv[ai + 1];
  loadApp(ctx, { since: 'app.js', skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
  vm.runInContext(fs.readFileSync(path.join(ROOT, target), 'utf8'), ctx, { filename: path.basename(target) });
  console.log(`（版本：${target}）\n`);
} else {
  loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
}

function gen(text) {
  return JSON.parse(vm.runInContext(
    '(function(){currentMode="character";' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return JSON.stringify({fills:[f.lighting,f.color,f.atmosphere],' +
    'out:(typeof o==="string"?o:(o&&o.optimized)||"")});})()', ctx));
}

['一位剑客，赛博朋克', '一位女子，水墨国风', '一座山，青绿山水'].forEach(function (text) {
  console.log(`\n「${text}」`);
  for (let r = 1; r <= 3; r++) {
    vm.runInContext('bumpVariantRound()', ctx);
    const g = gen(text);
    // 只显示风格/光/构图/色调/氛围那一段（输出的最后一句）
    const parts = g.out.split('。').map(s => s.trim()).filter(Boolean);
    const tail = parts.length ? parts[parts.length - 1] : g.out;
    console.log(`  第 ${r} 版  光/色/氛 = ${g.fills.join(' / ')}`);
    console.log(`         ${tail.trim()}`);
  }
});
