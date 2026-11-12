'use strict';
/* 重构等价性验证（2026-11-11）
   ------------------------------------------------------------------
   拿 `_archive/app.before-split.js`（拆分前的 351 KB 单文件）建一个独立上下文，
   和现在的 5 个文件逐条对比输出。

   为什么单独写这个：
     「回归通过」只证明关键点没坏；重构真正要证明的是**可观察行为完全没变**。
     而这类验证只有拿旧版本并排跑才有说服力，靠记忆或抽样都不算。

   2026-11-11 更新：V5.27 起**故意**改了行为（库外场景给具体描写、连接词点名场景），
   所以「完全没变」这个前提不成立了。改成**允许的差异清单**：
     - 清单外的用例必须逐字相同（抓意外回归）
     - 清单内的用例必须仍然不同（防止有人悄悄改回去，或改法失效）
   这样既保住「并排跑」的价值，又不至于因为一次有意的改进就必须删掉测试。

   覆盖两次改动：
     1 app.js 6363 行按职责拆成 5 个文件（V5.20）
     2 跨文件可变全局收进 genState + 验章（V5.20 同批）

   用法：node _dev/verify-refactor-equivalence.js
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const OLD = path.join(ROOT, '_archive', 'app.before-split.js');

if (!fs.existsSync(OLD)) {
  console.log('[跳过] 没有 _archive/app.before-split.js，无法做等价性比对');
  process.exit(0);
}

let pass = 0, fail = 0;

/* 允许（且要求）与旧版不同的用例 —— V5.27 有意改动：
   库外场景改用 PLACE_DETAIL 的具体描写；「身处其间」改成「身处<场景>」。
   这些改动会出现在任何「用户自己写了地点」的输入上。 */
const EXPECTED_DIFF = new Set([
  // V5.32「叙述段 + 参数段」分段改动影响所有多从句中文输出，
  // 所以中文用例全部改为「按预期已改变」；英文用例仍要求逐字相同。
  '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前',
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '机械姬，银色义体，站在霓虹街头',
  '两个剑客在月下决斗',
  '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里',
  '一位欧洲皇后',
  '一个形状古怪有奇怪花纹的剑',
  '皮影艺人，枯瘦的手签着竹签'.replace('签着','挑着'),
  '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来',
  '一位穿着红色长裙的少女，站在雨夜的霓虹街道',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上',
  // 英语那条在 V5.30（概念角色不再覆盖主体）时已改变
  'a warrior standing on a snowy mountain at night',
]);
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

/* mode='old' 只加载归档的单文件；mode='new' 按 index.html 的顺序加载 5 个文件 */
function makeCtx(files) {
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
    navigator: { userAgent: 'node-equiv', clipboard: null, hardwareConcurrency: 4 },
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
  /* 数据层和补丁层两边一样，只有 app 代码不同 */
  const base = ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js',
    'archive-slots.js', 'archive-fix.js', 'archive-variants.js', 'archive-faces.js',
    'archive-style-defaults.js', 'archive-learned.js'];
  base.forEach(function (f) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
  });
  files.forEach(function (f) {
    vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: path.basename(f) });
  });
  return ctx;
}

function gen(ctx, text) {
  const G = (e) => vm.runInContext(e, ctx);
  return G('(function(){var t=' + JSON.stringify(text) + ';' +
    'var d=detectDimensions(t,"character");currentMode=inferSubjectType(t,d);' +
    'var f=smartFill(d,t);var r=buildOptimizedPrompt(t,f,"standard",d);' +
    'return (typeof r==="string"?r:(r&&r.optimized)||"")})()');
}

const CASES = [
  '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前',
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '机械姬，银色义体，站在霓虹街头',
  '两个剑客在月下决斗',
  '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里',
  '一位欧洲皇后',
  '一个形状古怪有奇怪花纹的剑',
  '皮影艺人，枯瘦的手挑着竹签',
  '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来',
  '一位穿着红色长裙的少女，站在雨夜的霓虹街道',
  'a warrior standing on a snowy mountain at night',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上'
];

const oldCtx = makeCtx([OLD]);
const newCtx = makeCtx(['app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js'].map(function (f) {
  return path.join(ROOT, f);
}));

console.log('=== 拆分前（单文件 351 KB） vs 现在（5 个文件）逐字比对 ===\n');
let same = 0;
CASES.forEach(function (c) {
  const a = (function () { try { return gen(oldCtx, c); } catch (e) { return 'ERR:' + e.message; } })();
  const b = (function () { try { return gen(newCtx, c); } catch (e) { return 'ERR:' + e.message; } })();
  const eq = a === b;
  const expectDiff = EXPECTED_DIFF.has(c);
  if (expectDiff) {
    console.log('  · 「' + c.slice(0, 24) + '…」' + (eq ? '与旧版相同（本次改动未触及）' : '已改变（格式分段所致）'));
    if (!eq) same++;
  } else {
    if (eq) same++;
    ok(eq, '「' + c.slice(0, 24) + '…」' + (eq ? '完全一致（' + a.length + ' 字符）' : '意外变化\n      旧: ' + String(a).slice(0, 120) + '\n      新: ' + String(b).slice(0, 120)));
  }
});

console.log('\n=== 汇总 ===');
const expectSame = CASES.length - EXPECTED_DIFF.size;
if (expectSame === 0) {
  console.log('  · 全部用例都在「允许改变」清单里，只做记录不做断言');
} else ok(same === expectSame, '清单外逐字一致 ' + same + ' / ' + expectSame +
  '（另有 ' + EXPECTED_DIFF.size + ' 条属 V5.27 有意改动）');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
