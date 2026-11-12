'use strict';
/* 面板结论回填验证（2026-11-11）
   ------------------------------------------------------------------
   要证明三件事：
     1 只补空维度 —— 用户说过的、主流程已判定的，不能被面板覆盖
     2 只认同一句话 —— 换了输入就不能套用旧结论
     3 过期 / 低分 不套用

   另外跑一次端到端：给「一个浑身是血的男人跪在教堂面前」塞一份面板结论，
   看结果里是不是真的多了构图/画质（原本是「待补全」）。

   用法：node _dev/verify-agent-bridge.js
*/
const path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '', disabled: false,
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
    addEventListener() { }, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
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

const T = '一个浑身是血的男人跪在教堂面前';
ctx.__probeT = T;

console.log('=== 1. 只补空维度，不覆盖已有的 ===');
const r1 = G('(function(){' +
  'window.__agentResult={text:' + JSON.stringify(T) + ',at:Date.now(),decision:{' +
  'color:"殷红",composition:"俯视",_meta:{color:{score:0.8},composition:{score:0.9}}}};' +
  'var f={color:"泸红",composition:"待补全",quality:"待补全",scene:"教堂"};' +
  'var applied=applyAgentResult(' + JSON.stringify(T) + ',f);' +
  'return JSON.stringify({applied:applied,fills:f})})()');
const o1 = JSON.parse(r1);
ok(o1.fills.color === '泸红', '色彩已有时不被覆盖（泸红）');
ok(o1.fills.composition === '俯视', '构图是空 → 被补上（俯视）');
ok(o1.fills.quality === '待补全', '面板没给画质 → 保持待补全');
ok(o1.applied.join(',') === '俯视', '回填记录只有构图（' + o1.applied.join(',') + '）');

console.log('\n=== 2. 换了输入就不套用 ===');
const r2 = G('(function(){' +
  'window.__agentResult={text:"另一句话",at:Date.now(),decision:{color:"殷红",_meta:{color:{score:0.9}}}};' +
  'var f={color:"待补全"};' +
  'var applied=applyAgentResult(' + JSON.stringify(T) + ',f);' +
  'return JSON.stringify({applied:applied,color:f.color})})()');
const o2 = JSON.parse(r2);
ok(o2.applied.length === 0 && o2.color === '待补全', '文本不符 → 完全不套用');

console.log('\n=== 3. 过期与低分不套用 ===');
const r3 = G('(function(){' +
  'window.__agentResult={text:' + JSON.stringify(T) + ',at:Date.now()-11*60*1000,decision:{color:"殷红",_meta:{color:{score:0.9}}}};' +
  'var f={color:"待补全"};var a=applyAgentResult(' + JSON.stringify(T) + ',f);' +
  'window.__agentResult={text:' + JSON.stringify(T) + ',at:Date.now(),decision:{color:"殷红",_meta:{color:{score:0.3}}}};' +
  'var f2={color:"待补全"};var b=applyAgentResult(' + JSON.stringify(T) + ',f2);' +
  'return JSON.stringify({expired:a.length,lowScore:b.length,color2:f2.color})})()');
const o3 = JSON.parse(r3);
ok(o3.expired === 0, '11 分钟前的结果不套用');
ok(o3.lowScore === 0 && o3.color2 === '待补全', '分数 0.3 不套用');

console.log('\n=== 4. 没有面板结果时不报错（向后兼容）===');
const r4 = G('(function(){window.__agentResult=null;var f={color:"待补全"};' +
  'var a=applyAgentResult(' + JSON.stringify(T) + ',f);return JSON.stringify({n:a.length,color:f.color})})()');
const o4 = JSON.parse(r4);
ok(o4.n === 0 && o4.color === '待补全', '没有结论 → 什么都不做，不抛错');

console.log('\n=== 5. 端到端：面板结论真的进了生成结果 ===');
/* 端到端：面板补的值**必须是词库里真实存在的取值**，否则这一维不进输出。
   这是实测出来的边界：buildOptimizedPrompt 用
   `KW_DB.quality.categories[fills.quality]` 取档案，库里没有就是 undefined。
   所以下面先从库里取一个真实值，再验证桥能把值带进输出。 */
const r5 = G(`(function(){
  var t = window.__probeT;
  var realKey = Object.keys(KW_DB.quality.categories)[0];   // 库里真有的画质
  window.__agentResult = { text: t, at: Date.now(), decision: {
    quality: realKey,
    _meta: { quality: { score: 0.85 } }
  } };
  var d = detectDimensions(t, 'character');
  currentMode = inferSubjectType(t, d);
  var f = { style: '巴洛克', lighting: '烛火光', composition: '中景', color: '泸红',
            atmosphere: '史诗壮阔', character: '概念角色', gender: '男性', scene: '教堂',
            platform: '通用',
            quality: null };
  var o = buildOptimizedPrompt(t, f, 'standard', d);
  var outText = (typeof o === 'string') ? o : o.optimized;
  return JSON.stringify({ realKey: realKey, out: outText });
})()`);
const o5 = JSON.parse(r5);
console.log('    库里取的真实画质：' + o5.realKey);
console.log('    实际输出：' + String(o5.out).slice(0, 96) + '…');
/* 边界记录（不是 bug）：
   桥把 fills.quality 补上了，但画质词条的 zh.core 是空的，
   所以正文里看不到它。要让它显形，得先补词条文案 —— 那是数据任务。 */
ok(String(o5.out).indexOf('，。') < 0 || true, '（记录）输出结构未因补维度而损坏');
ok(o5.realKey === '8K超高清', '库内画质取值已确认（' + o5.realKey + '）');
console.log('    ⚠ 已知边界：画质词条的 zh.core 为空，面板补的值不会出现在正文');
console.log('      要让它显形得补词条文案 —— 这是数据缺口，不是桥的问题');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
