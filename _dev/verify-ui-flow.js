'use strict';
/* 新增交互的功能性验证（不是只查 id 存不存在）。
   为什么要单独写：引导 / 反馈 / 版本条 / 状态徽标都是纯前端交互，
   _dev 里其它脚本拿不到真实 DOM，最容易出的错是「点了没反应」——
   页面能打开、不报错，但功能静默不工作。
   这里用一个会记住事件的假 DOM，把 init* 和点击流程真跑一遍。
   用法：node _dev/verify-ui-flow.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

/* ---------- 会记住事件的假 DOM ---------- */
function makeEl(id) {
  const el = {
    id: id, hidden: false, textContent: '', innerHTML: '', value: '', title: '',
    disabled: false, style: {}, dataset: {}, children: [], _h: {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      toggle(c) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); },
      contains(c) { return this._s.has(c); }
    },
    addEventListener(t, fn) { (el._h[t] = el._h[t] || []).push(fn); },
    fire(t, ev) {
      const evt = ev || { key: '', preventDefault() {}, target: el };
      (el._h[t] || []).forEach(function (fn) { fn(evt); });
    },
    appendChild(c) { el.children.push(c); return c; },
    setAttribute(k, v) { el[k] = v; },
    getAttribute(k) { return el[k] === undefined ? null : el[k]; },
    querySelector() { return makeEl('sub'); },
    querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, click() {}, remove() { el._removed = true; },
    scrollIntoView() {}, dispatchEvent() { return true; }
  };
  return el;
}

const store = {};
const EXAMPLES = [
  '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前',
  '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上',
  '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来'
];
const egButtons = EXAMPLES.map(function (t) {
  const b = makeEl('eg');
  b['data-text'] = t;
  return b;
});

const cache = {};
const doc = {
  readyState: 'complete',
  body: makeEl('body'), head: makeEl('head'), documentElement: makeEl('html'),
  getElementById(id) { return cache[id] || (cache[id] = makeEl(id)); },
  querySelector() { return makeEl('q'); },
  querySelectorAll(sel) { return sel === '.onboard-eg' ? egButtons : []; },
  createElement() { return makeEl('dyn'); },
  createTextNode() { return makeEl('text'); },
  addEventListener() {}, execCommand() { return true; }
};

const lsStore = {};
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node-ui-flow', clipboard: null, hardwareConcurrency: 4 },
  localStorage: {
    getItem(k) { return lsStore[k] === undefined ? null : lsStore[k]; },
    setItem(k, v) { lsStore[k] = String(v); },
    removeItem(k) { delete lsStore[k]; }
  },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async function () { throw new Error('offline'); },
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
const tick = () => new Promise(r => setTimeout(r, 20));

(async function main() {
  await tick();

  console.log('=== 1. 服务状态徽标 ===');
  const badge = doc.getElementById('svcBadge');
  ok(G('window.__svcStatus') === 'bad',
    'fetch 失败时 __svcStatus = bad（实际 ' + G('window.__svcStatus') + '）');
  ok(badge.textContent.indexOf('服务未启动') >= 0, '徽标文案：' + badge.textContent);
  ok(badge.title.indexOf('serve.py') >= 0, '徽标提示里说明了怎么启动');
  // 注意：initServiceStatus 用的是 el.className = ...（不是 classList.add），
  // 真实浏览器里两者同步，这个假 DOM 不同步，所以这里查 className。
  ok(String(badge.className || '').indexOf('bad') >= 0,
    '徽标带 bad 样式（className=' + badge.className + '）');

  console.log('\n=== 2. 首次使用引导 ===');
  const onboard = doc.getElementById('onboard');
  ok(onboard.hidden === false, '第一次打开时引导是展开的');
  ok(egButtons.length === 3, '有 3 条示例可点');

  const inputEl = doc.getElementById('promptInput');
  const before = onboard.hidden;
  egButtons[0].fire('click');
  await tick();
  ok(inputEl.value === EXAMPLES[0], '点第一条示例 → 输入框被填上（' + String(inputEl.value).slice(0, 14) + '…）');
  ok(onboard.hidden === true, '点完示例后引导自动收起');
  ok(lsStore['pl_onboarded'] === '1', '收起状态写进 localStorage');

  console.log('\n=== 3. 引导不该再出现（第二次打开）===');
  G('try{initOnboarding()}catch(e){}');
  ok(onboard.hidden === true, '已标记看过的用户不会再看到引导');

  console.log('\n=== 4. 反馈通道 ===');
  const fbRow = doc.getElementById('feedbackRow');
  const fbMsg = doc.getElementById('feedbackMsg');
  ok(fbRow.hidden === true, '没有结果时反馈行是隐藏的');
  G('try{showFeedbackRow()}catch(e){}');
  ok(fbRow.hidden === false, '生成结果后反馈行出现');

  const fbUp = doc.getElementById('fbUp');
  const fbDown = doc.getElementById('fbDown');
  fbUp.fire('click');
  await tick();
  const queue = JSON.parse(lsStore['pl_feedback_queue'] || '[]');
  ok(queue.length === 1, '服务没起时 👎/👍 先入本地队列（' + queue.length + ' 条）');
  ok(queue[0] && queue[0].rating === 'up', '队列里记的是 rating=up');
  ok(queue[0] && queue[0].text === EXAMPLES[0], '队列里带上了当时的输入文本');
  ok(queue[0] && typeof queue[0].prompt === 'string', '队列里带上了当时的输出');
  ok(fbMsg.textContent.indexOf('本地') >= 0, '提示文案：' + fbMsg.textContent);
  ok(fbUp.disabled === true && fbDown.disabled === true, '提交后两个按钮都禁用，防止重复打点');

  console.log('\n=== 5. 👎 展开备注输入 ===');
  G('try{showFeedbackRow()}catch(e){}');   // 重置成新一版
  const note = doc.getElementById('feedbackNote');
  ok(note.hidden === true, '新一版开始时备注框是收起的');
  fbDown.fire('click');
  ok(note.hidden === false, '点 👎 展开备注框');
  const noteInput = doc.getElementById('feedbackNoteInput');
  noteInput.value = '场景不对';
  doc.getElementById('fbSend').fire('click');
  await tick();
  const q2 = JSON.parse(lsStore['pl_feedback_queue'] || '[]');
  ok(q2.length === 2 && q2[1].rating === 'down', '提交差评进队列（共 ' + q2.length + ' 条）');
  ok(q2[1] && q2[1].note === '场景不对', '备注一起存下来：' + (q2[1] && q2[1].note));

  console.log('\n=== 6. 版本条 ===');
  const vbar = doc.getElementById('versionBar');
  const vnum = doc.getElementById('versionNum');
  G('bumpVariantRound(); pushVersion("句子甲","第一版")');
  G('try{versionRender()}catch(e){}');
  ok(vbar.hidden === false, '有结果时版本条出现');
  const n1 = vnum.textContent;
  G('bumpVariantRound(); pushVersion("句子甲","第二版")');
  G('try{versionRender()}catch(e){}');
  ok(vnum.textContent !== n1, '换一版后版本号变化：' + n1 + ' → ' + vnum.textContent);

  const nx = doc.getElementById('btnNextVersion');
  const pv = doc.getElementById('btnPrevVersion');
  ok(typeof nx._h.click === 'object' || (nx._h.click && nx._h.click.length > 0), '「换一版」按钮已绑定点击');
  ok(typeof pv._h.click === 'object' || (pv._h.click && pv._h.click.length > 0), '「回到上一版」按钮已绑定点击');

  const depthBefore = G('window.__verStack.length');
  pv.fire('click');
  await tick();
  ok(G('window.__verStack.length') === depthBefore - 1,
    '点「回到上一版」退了一层（' + depthBefore + ' → ' + G('window.__verStack.length') + '）');

  console.log('\n=== 7. 重置时该收起来的都收起来 ===');
  G('try{resetAllResults()}catch(e){}');
  ok(doc.getElementById('versionBar').hidden === true, '重置后版本条隐藏');
  ok(doc.getElementById('feedbackRow').hidden === true, '重置后反馈行隐藏');

  console.log('\n=== 8. 版本号显示 ===');
  const verEl = doc.getElementById('appVersion');
  const want = G('APP_VERSION');
  ok(/^V\d+\.\d+$/.test(want), 'APP_VERSION 格式合法：' + want);
  ok(verEl.textContent === want, '标题下方显示的就是 APP_VERSION（' + verEl.textContent + '）');
  ok(String(verEl.title || '').indexOf('版本记录') >= 0, '悬停提示指向 版本记录.md');
  ok(G('window.__APP_VERSION') === want, 'window.__APP_VERSION 与 APP_VERSION 一致');

  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
