'use strict';
/* 跨文件可变全局的「残留状态」验证（2026-11-11）
   ------------------------------------------------------------------
   隐患：__sceneDetailMuted / __subjectCount 原来声明在 app.js、赋值在 app-fill.js、
   读取在 app-assemble.js。正确性靠「记得先 smartFill 再 buildOptimizedPrompt」。

   这个测试专打那一条：**先跑一次生成把状态改脏，再绕过 smartFill 直接拼装**，
   看会不会把上一次的「人数 / 静音」带过来。

   改之前：必错（会输出「两位」「细节被静音」）
   改之后：buildOptimizedPrompt 验章失败 → 退回安全默认值

   用法：node _dev/verify-genstate.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}
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
const warnings = [];
const ctx = {
  console: { log() {}, warn(m) { warnings.push(String(m)); }, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node-genstate', clipboard: null, hardwareConcurrency: 4 },
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
require('./load-scripts').loadApp(ctx, {
  skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']
});
const G = (e) => vm.runInContext(e, ctx);

/* 走完整链路：detect → smartFill → build */
function full(text) {
  return G('(function(){var t=' + JSON.stringify(text) + ';' +
    'var d=detectDimensions(t,"character");currentMode=inferSubjectType(t,d);' +
    'var f=smartFill(d,t);window.__f=' + 'f;' +
    'var r=buildOptimizedPrompt(t,f,"standard",d);' +
    'return (typeof r==="string"?r:(r&&r.optimized)||"")})()');
}
/* 绕过 smartFill：直接把上次的 fills 丢进去 */
function buildOnly(text, fillsExpr) {
  return G('(function(){var t=' + JSON.stringify(text) + ';' +
    'var d=detectDimensions(t,"character");currentMode="character";' +
    'var r=buildOptimizedPrompt(t,' + fillsExpr + ',"standard",d);' +
    'return (typeof r==="string"?r:(r&&r.optimized)||"")})()');
}

console.log('=== 0. genState 是唯一真相，旧别名仍可读写 ===');
ok(G('typeof genState === "object"'), 'genState 存在');
ok(G('typeof resetGenState === "function"'), 'resetGenState 存在');
G('genState.count = 3; genState.muted = true;');
ok(G('window.__subjectCount') === 3, 'window.__subjectCount 读到 genState.count（别名生效）');
ok(G('window.__sceneDetailMuted') === true, 'window.__sceneDetailMuted 读到 genState.muted');
G('resetGenState()');
ok(G('genState.count') === 1 && G('genState.muted') === false, 'resetGenState() 复位正常');

console.log('\n=== 1. 人数残留：上一次「两个剑客」，这次直接拼「一位少女」 ===');
const outTwo = full('两个剑客在月下决斗');
ok(outTwo.indexOf('两位') >= 0, '第一次（两个剑客）正常输出「两位」');
ok(G('genState.count') === 2, '第一次跑完 genState.count = 2（状态已变脏）');
const outOne = buildOnly('一位少女站在桥上', 'window.__f');
ok(outOne.indexOf('两位') < 0, '第二次绕过 smartFill，**没有**残留「两位」');
ok(outOne.indexOf('一位') >= 0 || outOne.indexOf('少女') >= 0, '第二次回到单人表述（' + outOne.slice(0, 18) + '…）');

console.log('\n=== 2. 静音残留：上一次赛博集市（细节静音），这次直接拼废弃教堂 ===');
const outMuted = full('赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里');
ok(G('genState.muted') === true, '赛博集市跑完，muted = true（本次细节该被静音）');
// 这里故意把上一次的 fills 直接丢进去（scene 还是「集市」），然后绕过 smartFill。
// 正确行为：验章失败 → 把 muted 复位成 false。
// 也就是说「集市」的竹筐陶罐细节**会重新出现** —— 那正是复位生效的证据。
// 如果没复位，这次输出的集市细节会被错误地继续静音。
const outChurch = buildOnly('废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来', 'window.__f');
ok(G('genState.muted') === false, '绕过 smartFill 时 muted 被复位成 false');
ok(outChurch.indexOf('竹筐') >= 0 || outChurch.indexOf('陶罐') >= 0 || outChurch.indexOf('木棚') >= 0,
  '集市细节重新出现 = 静音没有残留到这一次');

console.log('\n=== 3. 验章只生效一次，并留下告警 ===');
// warnOnce 是「整个会话只提示一次」，前面几处绕过已经消耗掉了，
// 所以这里只验「没有刷屏」：整轮跑完告警数不超过 1 条，且标记已置位。
buildOnly('一个旅人', 'window.__f');
buildOnly('一个旅人', 'window.__f');
const inferWarn = warnings.filter(function (w) { return w.indexOf('未经 smartFill') >= 0; });
ok(inferWarn.length <= 1, '绕过 smartFill 的告警最多 1 条（实际 ' + inferWarn.length + ' 条，不刷屏）');
ok(G('genState.warnOnce') === true, 'warnOnce 已置位，后续不再重复告警');
ok(G('genState.stamped') === false, '验完后章已清除');

console.log('\n=== 4. 正常链路不受影响 ===');
G('resetGenState()');
const okPath = full('一位少女站在桥上');
ok(okPath.indexOf('少女') >= 0 || okPath.length > 30, 'smartFill → build 正常工作');
ok(G('genState.stamped') === false, '拼装完成后章已消费');
ok(G('genState.count') === 1, '单人输入的 count 正确为 1');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
