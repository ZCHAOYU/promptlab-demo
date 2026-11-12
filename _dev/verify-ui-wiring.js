'use strict';
/* 新增 UI 的接线校验（不需要浏览器）：
   1. app.js 里 getElementById / querySelector 用到的 id、class 必须真的存在于 index.html；
   2. 版本栈逻辑（pushVersion / versionPrev）单独跑一遍。
   为什么要有：这一段是新加的纯前端交互，_dev 里其它脚本都在 node 里跑、拿不到真实 DOM，
   所以最容易出的错就是「id 拼错」——页面照常打开，只是功能静默不工作。
   用法：node _dev/verify-ui-wiring.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

console.log('=== 1. HTML 里存在的 id 集合 ===');
const htmlIds = new Set();
let m;
const ID_RE = /\bid="([^"]+)"/g;
while ((m = ID_RE.exec(html)) !== null) htmlIds.add(m[1]);
console.log('  共 ' + htmlIds.size + ' 个 id');

console.log('\n=== 2. app.js 引用的 id 是否都存在 ===');
// 有些元素是运行时 createElement 出来的（比如「没认出主体」遮罩），
// 它的 id 只在 JS 里赋值，所以要把 `x.id = '...'` 也算进「已存在」。
const dynamicIds = new Set();
const DYN_RE = /\.id\s*=\s*'([^']+)'/g;
while ((m = DYN_RE.exec(app)) !== null) dynamicIds.add(m[1]);
const refIds = new Set();
const REF_RE = /getElementById\(\s*'([^']+)'\s*\)/g;
while ((m = REF_RE.exec(app)) !== null) refIds.add(m[1]);
const missing = [...refIds].filter(function (id) {
  return !htmlIds.has(id) && !dynamicIds.has(id);
});
ok(missing.length === 0,
  'app.js 引用的 ' + refIds.size + ' 个 id 全部能找到（静态 ' + htmlIds.size +
  ' 个 / 动态 ' + dynamicIds.size + ' 个）' +
  (missing.length ? '（缺失：' + missing.join(', ') + '）' : ''));

console.log('\n=== 3. 新功能依赖的 class 是否有 CSS 规则 ===');
[
  '.svc-badge', '.onboard', '.onboard-eg', '.feedback-row', '.feedback-btn',
  '.feedback-note', '.version-bar', '.vb-btn', '.version-tag'
].forEach(function (cls) {
  const inHtml = html.indexOf('class="' + cls.slice(1)) >= 0
    || html.indexOf(' ' + cls.slice(1) + '"') >= 0
    || html.indexOf(' ' + cls.slice(1) + ' ') >= 0;
  const inCss = css.indexOf(cls + ' ') >= 0 || css.indexOf(cls + ',') >= 0 || css.indexOf(cls + '{') >= 0
    || css.indexOf(cls + ' {') >= 0 || css.indexOf(cls + '[') >= 0;
  ok(inHtml && inCss, cls + ' 在 HTML' + (inHtml ? '✓' : '✗') + ' / CSS' + (inCss ? '✓' : '✗'));
});

console.log('\n=== 4. 版本栈逻辑 ===');
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '', hidden: true,
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
  localStorage: {
    _d: {}, getItem(k) { return this._d[k] === undefined ? null : this._d[k]; },
    setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; }
  },
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
const G = (e) => vm.runInContext(e, ctx);

G('bumpVariantRound()');
G('pushVersion("甲", "第一版文本")');
G('bumpVariantRound()');
G('pushVersion("甲", "第二版文本")');
G('bumpVariantRound()');
G('pushVersion("甲", "第三版文本")');
ok(G('window.__verStack.length') === 3, '同一条输入连点三次 → 栈里有 3 版');

const dedupe = G('(function(){var n=window.__verStack.length;pushVersion("甲","第三版文本");return window.__verStack.length-n})()');
ok(dedupe === 0, '同一版重复 push 不会加长（去重 ' + dedupe + '）');

G('versionPrev()');
ok(G('window.__verStack.length') === 2, '回到上一版 → 栈剩 2 版');
ok(G('lastResult') === '第二版文本', '回到上一版 → 显示的是第二版（实际 ' + G('lastResult') + '）');

G('versionPrev()');
G('versionPrev()');
ok(G('window.__verStack.length') === 1, '退到底只剩第一版时不再退（剩 ' + G('window.__verStack.length') + '）');

G('pushVersion("乙", "另一句的版本")');
ok(G('window.__verStack.length') === 1, '换一句输入 → 版本栈重置为 1（实际 ' + G('window.__verStack.length') + '）');

console.log('\n=== 5. 访问码读取 ===');
const code = G('(function(){try{localStorage.setItem("pl_code","abc123");}catch(e){} return plCode()})()');
ok(code === 'abc123', 'plCode() 从 localStorage 读到 abc123（实际 ' + code + '）');
const hdr = G('JSON.stringify(plHeaders({"Content-Type":"application/json"}))');
ok(hdr.indexOf('X-PL-Code') >= 0 && hdr.indexOf('abc123') >= 0, 'plHeaders() 带上 X-PL-Code：' + hdr);

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
