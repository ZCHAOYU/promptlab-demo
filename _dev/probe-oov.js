'use strict';
/* 找「真正的」未识别输入：逐个喂给 detectDimensions，
   看哪些会触发「没认出主体」弹窗。
   用法：node _dev/probe-oov.js
        node _dev/probe-oov.js --semantic   同时开语义层（需要 serve.py 在跑） */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const USE_SEMANTIC = process.argv.indexOf('--semantic') >= 0;

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
  fetch: USE_SEMANTIC ? globalThis.fetch : async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://127.0.0.1:8777/index.html', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
// 清单来自 index.html。--semantic 时要带上 semantic-search.js，否则语义层不存在。
loadApp(ctx, {
  skip: USE_SEMANTIC
    ? ['config.local.js', 'llm-arbiter.js', 'agent-panel.js']
    : ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']
});

const CASES = [
  '团宠', '赘婿', '赛博菩萨', '龙傲天', '玛丽苏', '灰姑娘', '社畜', '打工人',
  '外卖骑手', '快递员', '街头艺人', '算命先生', '守夜人', '灯塔看守人',
  '冰川科考员', '潜水员', '空姐', '列车长', '牧羊人', '炼钢工人',
  '滑板少年', '说唱少年', '夜店DJ', '纹身师', '赛车手', '滑板少女',
  '太空游客', '机械姬', '克苏鲁少女', '修仙者', '剑仙', '符修',
  '摆渡人', '琴师', '说书先生', '扎纸匠', '皮影艺人', '非遗绣娘',
  '废土拾荒者', '深海潜航员', '极地向导', '沙漠商队首领',
  '一位穿汉服的少女', '雨夜撑伞的女子', '地铁里打瞌睡的人'
];

(async function main() {
  await vm.runInContext('(async function(){ if (typeof SemanticSearch!=="undefined" && SemanticSearch.init) { try { await SemanticSearch.init(); } catch(e){} } })()', ctx);
  const ready = vm.runInContext('!!(typeof SemanticSearch!=="undefined" && SemanticSearch.isReady)', ctx);
  if (USE_SEMANTIC) console.log('语义层就绪:', ready);

  console.log('\n输入\t\t\t| character\tscene\tgate?');
  console.log('-'.repeat(78));
  let gated = 0;
  for (const t of CASES) {
    if (USE_SEMANTIC) {
      await vm.runInContext('trySemanticFill(' + JSON.stringify(t) + ')', ctx);
    }
    const d = vm.runInContext('detectDimensions(' + JSON.stringify(t) + ', "character")', ctx);
    const c = (d.character && d.character.detected) || '';
    const s = (d.scene && d.scene.detected) || '';
    const gate = !c && !s;
    if (gate) gated++;
    console.log(`${t}\t| ${c || '—'}\t${s || '—'}\t${gate ? '⛔ 弹窗' : 'ok'}`);
  }
  console.log('-'.repeat(78));
  console.log(`共 ${CASES.length} 条，被弹窗拦下 ${gated} 条`);
})();
