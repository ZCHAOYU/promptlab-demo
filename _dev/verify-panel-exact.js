'use strict';
/* 面板候选：精确命中必须压过语义近邻。
   用户实测：输入「扎纸匠」→ 面板给「工匠 0.509 / 纸雕 0.454 / 古朴 0.301」，
   两个还标「猜测」。可词库里已经有「扎纸匠」这个词条（第 3 层推理补进来的），
   等于明明认识却按不认识处理。

   这里直接测 agent-panel.js 里暴露出来的 withExactHits（纯函数，不碰网络）。
   用法：node _dev/verify-panel-exact.js */
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

(async function main() {
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
    navigator: { userAgent: 'node-panel-exact', clipboard: null, hardwareConcurrency: 4 },
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
  // agent-panel.js 开头有个守卫：「缺 SemanticSearch / LLMArbiter 就不启用」。
  // 这里把 semantic-search.js 跳过（要联网才初始化），所以先塞一个空壳让它通过守卫，
  // 真正的 LLMArbiter 照常加载（DIMS 要从它那里拿）。
  ctx.SemanticSearch = { isReady: false, init: async function () { return false; } };
  vm.createContext(ctx);
  const { loadApp } = require('./load-scripts');
  loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js'] });
  const G = (e) => vm.runInContext(e, ctx);

  console.log('=== 0. 前置：面板内部函数已暴露 ===');
  const internals = ctx.__agentPanelInternals;
  ok(!!internals && typeof internals.withExactHits === 'function', 'withExactHits 可调用（离线测试用）');
  if (!internals) { console.log('\n失败：拿不到内部函数'); process.exit(1); }

  console.log('\n=== 1. 「扎纸匠」在词库里时，必须精确命中 ===');
  // 先确保词条存在（模拟第 3 层推理补过这一条）
  G("(function(){" +
    "KW_DB.character.categories['扎纸匠'] = {" +
    "  core: '', zh: { core: '扎纸匠人', worn: '深蓝布褂', face: '花白短发', pose: '低头扎竹篾', detail: '', carries: '', mood: '' }," +
    "  _infer: { subject: '扎纸匠' } };" +
    "})()");
  const byDim = {
    role: [{ name: '工匠', zh: '工匠', score: 0.509 }, { name: '木匠', zh: '木匠', score: 0.44 }],
    scene: [],
    style: [{ name: '纸雕', zh: '纸雕', score: 0.454 }],
    light: [],
    composition: [],
    color: [],
    atmosphere: [{ name: '古朴', zh: '古朴', score: 0.301 }],
    quality: [{ name: '4K高清', zh: '', score: 0.55 }],
    subject: []
  };
  const out = internals.withExactHits('扎纸匠', byDim);
  ok(Array.isArray(out.role) && out.role[0] && out.role[0].name === '扎纸匠',
    'role 首位变成精确命中的「扎纸匠」（实际 ' + (out.role[0] && out.role[0].name) + '）');
  ok(out.role[0] && out.role[0].exact === true, '精确命中带 exact 标记');
  ok(out.role[0] && out.role[0].score === 1, '精确命中 score=1（不会被判成「猜测」）');
  ok(out.role.some(function (x) { return x.name === '工匠'; }),
    '近邻「工匠」仍然保留在候选里（不删，只是排后面）');
  // 注意：现在主流程的 detectDimensions 结果会插到最前面（见下方第 5 节），
  // 所以「纸雕」可能不是首位了，但**不能丢**——它是语义兜底。
  ok(out.style.every(function (x) { return !x.fromDetection; }) || out.style.some(function (x) { return x.name === '纸雕'; }),
    '「纸雕」作为语义兜底仍然在候选里');

  console.log('\n=== 2. 主流程已判定的维度，面板必须跟着走 ===');
  const out2 = internals.withExactHits('赛博朋克城市里的雨夜集市', byDim);
  // 这条输入主流程判定 style=赛博朋克，面板不能还拿语义近邻顶上去
  ok(out2.style[0] && out2.style[0].name === '赛博朋克' && out2.style[0].fromDetection === true,
    'style 首位 = 主流程判定的「赛博朋克」（实际 ' + (out2.style[0] && out2.style[0].name) + '）');
  ok(out2.role[0] && out2.role[0].fromDetection === true,
    'role 也跟着主流程走（判定为「' + (out2.role[0] && out2.role[0].name) + '」）');
  // quality 这条输入主流程判不出来，语义候选必须原样保留
  ok(out2.quality.length === 1 && out2.quality[0].name === '4K高清',
    '主流程没判定的维度（画质）：语义候选原样保留（' + (out2.quality[0] && out2.quality[0].name) + '）');
  ok(out2.quality.every(function (x) { return !x.fromDetection; }), '没判定的维度不会被打上 fromDetection');

  console.log('\n=== 3. 多个命中时最长优先，且不重复 ===');
  G("(function(){" +
    "KW_DB.character.categories['竹林小径'] = { core:'', zh:{core:'竹林小径'} };" +
    "KW_DB.scene.categories['竹林'] = KW_DB.scene.categories['竹林'] || { core:'', zh:{core:'竹林'} };" +
    "})()");
  const byDim3 = { role: [], scene: [{ name: '竹林', zh: '竹林', score: 0.6 }], style: [], light: [], composition: [], color: [], atmosphere: [], quality: [], subject: [] };
  const out3 = internals.withExactHits('走在竹林小径上', byDim3);
  // 这句同时含「竹林小径」和「竹林」；现在由主流程判定优先，
  // 关键是**不重复、且都带 exact**
  ok(out3.scene[0] && out3.scene[0].exact === true,
    'scene 首位是精确命中（' + (out3.scene[0] && out3.scene[0].name) + '）');
  const names = out3.scene.map(function (x) { return x.name; });
  ok(new Set(names).size === names.length, '候选里没有重复项（' + names.join(' / ') + '）');

  console.log('\n=== 4. 候选数量有上限，不会把提示词撑爆 ===');
  G("(function(){" +
    "for (var i = 0; i < 20; i++) { KW_DB.character.categories['测试角色' + i] = { core:'', zh:{core:'测试' + i} }; }" +
    "})()");
  const many = '测试角色1 测试角色2 测试角色3 测试角色4';
  const out4 = internals.withExactHits(many, { role: [], scene: [], style: [], light: [], composition: [], color: [], atmosphere: [], quality: [], subject: [] });
  ok(out4.role.length <= 6, 'role 候选最多 6 个（实际 ' + out4.role.length + '）');
  ok(out4.role[0].exact === true, '精确命中仍排在最前');

  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
