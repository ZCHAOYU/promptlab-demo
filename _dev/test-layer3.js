'use strict';
/* 第 3 层联调：把「本地认不出、会弹窗」的词喂给 tryLLMInfer，
   看它能不能补出一条词条，并让整条流水线正常出结果。
   用法：node _dev/test-layer3.js [词...]   （需要 serve.py 在 8777 上跑） */
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
  console: { log() {}, warn() {}, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: {
    getItem(k) { return k in store ? store[k] : null; },
    setItem(k, v) { store[k] = String(v); }, removeItem(k) { delete store[k]; }
  },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: (u, o) => globalThis.fetch(/^https?:/.test(u) ? u : BASE + u, o),
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: BASE + '/index.html', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
// 加载清单统一来自 index.html，不再各自写死（否则新增脚本测试看不见）
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
ctx.restoreInferredLex();

const CASES = process.argv.slice(2).length ? process.argv.slice(2)
  : ['团宠', '赘婿', '社畜', '算命先生', '扎纸匠', '外卖骑手', '空姐', '列车长',
     '牧羊人', '炼钢工人', '夜店DJ', '纹身师', '剑仙', '符修', '摆渡人',
     '玛丽苏', '灰姑娘', '快递员', '守夜人', '皮影艺人', '非遗绣娘', '你好'];

function run(t, mode) {
  return JSON.parse(vm.runInContext(
    '(function(){' +
    'var d=detectDimensions(' + JSON.stringify(t) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(t) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(t) + ',f,"standard",d);' +
    'var s=typeof o==="string"?o:(o&&o.optimized)||"";' +
    'var det=[];["character","scene","style","lighting","color","atmosphere"].forEach(function(k){' +
    'if(d[k]&&d[k].detected)det.push(k+"="+d[k].detected);});' +
    'return JSON.stringify({det:det,s:s});})()', ctx));
}

(async function main() {
  let ok = 0, gated = 0;
  for (const t of CASES) {
    const before = run(t, 'character');
    const gatedBefore = !before.det.some(x => x.startsWith('character=') || x.startsWith('scene='));
    process.stdout.write(`\n【${t}】 推理前：${gatedBefore ? '⛔ 会弹窗' : 'ok'}  ${before.det.join(' ')}\n`);

    const t0 = Date.now();
    const hit = await vm.runInContext('tryLLMInfer(' + JSON.stringify(t) + ')', ctx);
    const ms = Date.now() - t0;
    const rec = ctx.__llmInfer;

    if (!hit) {
      const err = ctx.__inferLastError;
      process.stdout.write(`  ${gatedBefore ? '✗ 没补上' : '— 本来就不需要'} ${err ? '(' + err + ')' : ''} ${ms}ms\n`);
      if (gatedBefore) gated++;
      continue;
    }
    ok++;
    process.stdout.write(`  ✓ 补上：${rec.type} / ${rec.short}  置信 ${rec.confidence}  ${ms}ms\n`);
    process.stdout.write(`    worn=${rec.worn}\n    outward=${rec.outward}\n    pose=${rec.pose}\n`);
    const after = run(t, rec.type === 'scene' ? 'scene' : 'character');
    process.stdout.write(`  推理后检测：${after.det.join('  ') || '（空）'}\n`);
    process.stdout.write(`  输出：${after.s}\n`);
  }
  process.stdout.write(`\n== 补上 ${ok} 条，仍弹窗 ${gated} 条 ==\n`);
})();
