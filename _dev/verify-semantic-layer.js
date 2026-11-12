'use strict';
/* 验证语义兜底层是否真的生效（模拟浏览器：注入 fetch 指向本地服务） */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = 'http://127.0.0.1:8777';

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

const store = {};
const ctx = {
  console,
  document: doc,
  navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: {
    getItem(k) { return store[k] === undefined ? null : store[k]; },
    setItem(k, v) { store[k] = String(v); },
    removeItem(k) { delete store[k]; }
  },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: (u, o) => fetch(u.startsWith('http') ? u : BASE + '/' + u.replace(/^\//, ''), o),
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: BASE + '/', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {},
  TextDecoder, TextEncoder, Blob, Response, Headers, Request, AbortController,
  // 浏览器里 new URL('./x') 会自动带 base，node 需要显式提供
  URL: class URLWithBase extends URL {
    constructor(u, b) { super(u, b || (BASE + '/')); }
  }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
// 加载清单统一来自 index.html，不再各自写死（否则新增脚本测试看不见）
loadApp(ctx, { skip: ['config.local.js', 'llm-arbiter.js', 'agent-panel.js'] });

const CASES = ['高冷剑修，白衣黑发，手持长剑立于雪山之巅', '现代都市霸总，西装革履，站在落地窗前俯瞰夜景',
  '古风青梅竹马，素色襦裙，站在桃树下回头笑', '红衣女帝，金冠高髻，坐于大殿龙椅之上'];

/* 2026-11-11：原来只有「isReady 否就 exit 1」，其余全是打印 —— 语义候选有没有真的
   喂给检测层，没人判断。现在补断言，其中两条是**确定性**的接线断言（不依赖服务端）。
   注意：这个脚本要服务端在跑（/api/embed），所以它在 run-all 的「服务端组」里。 */
let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } }

console.log('=== 0. 接线：语义候选只填空缺维，不覆盖已识别维 ===');
(function wiring() {
  // 手工注入候选，不依赖模型：证明 app-detect 真的会读 window.__semanticFill
  const r = JSON.parse(vm.runInContext(`(function(){
    var keep = window.__semanticFill;
    window.__semanticFill = { character: '女帝', composition: '荷兰角' };
    var d = detectDimensions('一位剑客', 'character');
    window.__semanticFill = keep;
    return JSON.stringify({
      char: d.character && d.character.detected,
      comp: d.composition && d.composition.detected,
      compKw: (d.composition && d.composition.keywords) || []
    });
  })()`, ctx));
  console.log('  注入 {character:女帝, composition:荷兰角} → character=' + JSON.stringify(r.char) +
    ' / composition=' + JSON.stringify(r.comp));
  ok(r.char === '剑客', '不覆盖已识别的维度（character 仍是「' + r.char + '」）');
  ok(r.comp === '荷兰角' && r.compKw.indexOf('语义') >= 0,
    '填进空缺维并打上「语义」标记（composition=「' + r.comp + '」）');
})();

(async () => {
  console.log('\n=== 1. 服务端语义检索 ===');
  console.log('初始化语义检索…');
  await vm.runInContext('trySemanticFill("预热")', ctx).catch(() => {});
  const ready = vm.runInContext('SemanticSearch.isReady', ctx);
  const err = String(vm.runInContext('String(SemanticSearch.error || "")', ctx) || '');
  console.log('isReady:', ready, '| error:', err);
  ok(ready, '语义检索初始化成功（isReady）');
  if (!ready) {
    console.log('\n  ⚠ 服务端没起或模型没加载：这组要 /api/embed。' +
      (err.indexOf('ECONNREFUSED') >= 0 ? '（连接被拒，去跑 serve.py 8777）' : ''));
    console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
    process.exit(fail ? 1 : 0);
  }

  let hitAny = false;
  for (const t of CASES) {
    await vm.runInContext('trySemanticFill(' + JSON.stringify(t) + ')', ctx);
    const fill = vm.runInContext('JSON.stringify(window.__semanticFill||null)', ctx);
    const det = vm.runInContext(
      '(function(){var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
      'var o={};["character","scene","style","lighting","composition","color","atmosphere"].forEach(function(k){' +
      'if(d[k]&&d[k].detected)o[k]=d[k].detected+(((d[k].keywords||[]).indexOf("语义")>=0)?"[语义]":"");});' +
      'return JSON.stringify(o);})()', ctx);
    console.log('\n「' + t.slice(0, 22) + '…」');
    console.log('  语义候选: ' + fill);
    console.log('  最终检测: ' + det);
    if (fill && fill !== 'null') hitAny = true;
  }

  ok(hitAny, '至少一条输入拿到了语义候选（不是全空）');
  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
