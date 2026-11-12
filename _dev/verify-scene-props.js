'use strict';
/* 场景道具：任何场景都生效（2026-11-11，用户要求「照顾全局」）
   验证三件事：
     1 休闲场景（咖啡馆）人物器材被换成场所道具
     2 工作场景（实验室）人物器材保留，不被乱换
     3 手写表没有的场景，靠抽取的「场景道具」也能补
*/
const path = require('path'), vm = require('vm');
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '', disabled: false,
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
    addEventListener() { }, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute() { return null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() { }, click() { }, remove() { }
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() { }, execCommand() { return true; }
};
const ctx = {
  console: { log() { }, warn() { }, error() { } }, document: doc,
  navigator: { userAgent: 'n' }, localStorage: { getItem() { return null; }, setItem() { } },
  sessionStorage: { getItem() { return null; }, setItem() { } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('off') }, alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() }, location: { href: 'http://x/', protocol: 'http:' }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
require('./load-scripts').loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } }

function gen(text, parseData) {
  ctx.__t = text;
  ctx.__p = parseData ? { text: text, at: Date.now(), data: parseData } : null;
  return G(`(function(){
    var t = window.__t;
    window.__parse = window.__p;
    var d = detectDimensions(t, 'character'); currentMode = inferSubjectType(t, d);
    var f = smartFill(d, t);
    var r = buildOptimizedPrompt(t, f, 'standard', d);
    return (typeof r === 'string') ? r : r.optimized;
  })()`);
}

console.log('=== 1. 休闲场景：器材换成场所道具（走抽取）===');
const a = gen('一位科学家，街角咖啡馆', { 场景: '咖啡馆', 场景道具: ['咖啡杯', '托盘', '菜单'], raw: [] });
console.log('    ' + String(a).slice(0, 100) + '…');
ok(String(a).indexOf('咖啡杯') >= 0, '出现「咖啡杯」');
ok(String(a).indexOf('显微镜') < 0 && String(a).indexOf('烧杯') < 0, '不再出现显微镜/烧杯');

console.log('\n=== 2. 工作场景：器材应当保留 ===');
const b = gen('一位科学家，实验室', { 场景: '实验室', 场景道具: ['试管架', '试剂瓶'], raw: [] });
console.log('    ' + String(b).slice(0, 100) + '…');
ok(String(b).indexOf('显微镜') >= 0 || String(b).indexOf('试管') >= 0 || String(b).indexOf('烧杯') >= 0 || String(b).indexOf('试剂') >= 0,
  '实验室里器材保留（没有被误换）');

console.log('\n=== 3. 手写表里没有的场景：靠抽取也能补 ===');
const c = gen('一位机械师，菜市场', { 场景: '菜市场', 场景道具: ['塑料袋', '秤', '菜筐'], raw: [] });
console.log('    ' + String(c).slice(0, 100) + '…');
ok(String(c).indexOf('塑料袋') >= 0 || String(c).indexOf('秤') >= 0 || String(c).indexOf('菜筐') >= 0,
  '菜市场道具生效（这个场景没写进手写表）');

console.log('\n=== 4. 没有抽取结果时不崩（断网兜底）===');
const d = gen('一位科学家，街角咖啡馆', null);
ok(typeof d === 'string' && d.length > 20, '没有抽取结果也能正常生成（' + d.length + ' 字）');
ok(String(d).indexOf('咖啡杯') >= 0, '走内置兜底表也补上了咖啡杯');

console.log('\n=== 4b. 离线时也要走完清洗：实验台 → 桌边（2026-11-11）===');
/* 这一条守的是「查表逻辑分叉」：
   手写表在收尾阶段原来是**精确匹配**，而场景名常是「街角咖啡馆」（表里只有「咖啡馆」），
   于是 hasSceneProps 判成 false、整段清洗被跳过。
   联网时看不出来（抽取结果兜着），离线时「手持记录板缓步穿过实验台」就一直留在正文里。 */
const d2 = gen('一位科学家，街角咖啡馆', null);
console.log('    ' + String(d2).slice(0, 100) + '…');
ok(String(d2).indexOf('实验台') < 0, '离线也不该出现「实验台」');
ok(String(d2).indexOf('桌边') >= 0, '换成中性的「桌边」');


console.log('\n=== 5. 不可携带的场景道具不能进「随身带着」 ===');
const e5 = gen('一位男学姐，圣托里尼', { 场景: '圣托里尼', 场景道具: ['蓝顶教堂', '白墙', '陶罐'], raw: [] });
console.log('    ' + String(e5).slice(0, 96) + '…');
ok(String(e5).indexOf('随身带着蓝顶教堂') < 0, '没有「随身带着蓝顶教堂」这种荒谬说法');
ok(String(e5).indexOf('随身带着白墙') < 0, '没有「随身带着白墙」');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
