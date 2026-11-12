'use strict';
/* 自查量化：地点识别率 + 「身处X」锚点是否被误删。只打印统计，不改代码。
   用法：node _dev/_probe-defects3.js */
const vm = require('vm');
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
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
  console: { log() { }, warn() { }, error() { }, info() { } },
  document: doc, navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() { }, removeItem() { } },
  sessionStorage: { getItem() { return null; }, setItem() { }, removeItem() { } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('offline'); },
  alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() { }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
require('./load-scripts').loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

function run(t) {
  return JSON.parse(G(`(function(){
    var t=${JSON.stringify(t)};
    window.__parse=window.__p;
    var m=inferSubjectType(t,detectDimensions(t,'character'));currentMode=m;
    var d=detectDimensions(t,m);
    var f=smartFill(d,t);
    var o=buildOptimizedPrompt(t,f,'standard',d);
    var out=(typeof o==='string')?o:(o&&o.optimized)||'';
    return JSON.stringify({mode:m,scene:f.scene,place:extractUserPlace(t)||null,out:out});})()`));
}

/* ---------- A 地点识别率 ---------- */
const ONLINE = process.argv.indexOf('--online') >= 0;
const BASE = 'http://127.0.0.1:8777';

async function parseOf(t) {
  try {
    const res = await fetch(BASE + '/api/parse', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: t })
    });
    const j = await res.json();
    return j && j.ok ? j.data : null;
  } catch (e) { return null; }
}

const PLACES = ['后厨', '机房', '工地', '教室', '宿舍', '超市', '地铁', '机场', '厨房', '阳台',
  '车库', '仓库', '网吧', '健身房', '图书馆', '操场', '会议室', '实验室', '前台', '车间',
  '医院', '咖啡馆', '教室走廊', '地下停车场'];

(async function () {
  console.log('=== A. 用户写的地点，被认出来了吗（' + (ONLINE ? '联网：带 /api/parse' : '离线：只有规则') + '）===');
  let miss = 0;
  for (const p of PLACES) {
    const t = '一位科学家，' + p;
    if (ONLINE) {
      const data = await parseOf(t);
      ctx.__p = data ? { text: t, at: Date.now(), data: data } : null;
    }
    const r = run(t);
    const core = G('String((KW_DB.scene.categories[' + JSON.stringify(r.scene) + ']||{}).zh?' +
      '(KW_DB.scene.categories[' + JSON.stringify(r.scene) + '].zh.core||""):"")');
    const okPlace = !!r.place;
    const sceneKept = String(core || '').indexOf(p) >= 0 || String(r.out).indexOf(p) >= 0;
    /* 库外场景名（后厨/机房…）没有 KW_DB 词条，core 是空串，所以先比场景名本身 */
    const sceneIsP = String(r.scene || '').indexOf(p) >= 0 || String(core || '').indexOf(p) >= 0;
    if (!sceneIsP) miss++;
    console.log('  ' + p.padEnd(7) + ' extractUserPlace=' + String(r.place).padEnd(8) +
      ' 场景=' + String(r.scene).padEnd(10) + ' 场景就是它=' + sceneIsP +
      (ONLINE ? ' | parse场景=' + JSON.stringify(ctx.__p && ctx.__p.data && ctx.__p.data['场景']) : ''));
  }
  console.log('  → ' + PLACES.length + ' 个地点里，最终场景不是用户写的：' + miss + ' 个');

  /* ---------- B 「身处X」锚点被删 ---------- */
  console.log('\n=== B. 用户自己说了场景名时，「身处X」锚点还在吗（只看人物模式）===');
  const NAMED = ['一位医生，医院', '一位老师，教室', '一位厨师，厨房',
    '一位科学家，实验室', '一位学生，图书馆'];
  let lost = 0, checked = 0;
  for (const t of NAMED) {
    if (ONLINE) {
      const data = await parseOf(t);
      ctx.__p = data ? { text: t, at: Date.now(), data: data } : null;
    }
    const r = run(t);
    if (r.mode !== 'character') continue;          // 场景模式本来就不写「身处X」
    checked++;
    const hasAnchor = /身处/.test(r.out);
    if (!hasAnchor) lost++;
    console.log('  ' + t.slice(0, 14).padEnd(16) + ' 场景=' + String(r.scene).padEnd(10) +
      ' 有「身处」=' + hasAnchor);
  }
  console.log('  → ' + checked + ' 条人物模式、用户自己说了场景名的输入里，' + lost + ' 条丢了「身处X」锚点');
})();



/* ---------- B 「身处X」锚点被删 ---------- */
console.log('\n=== B. 用户自己说了场景名时，「身处X」锚点还在吗 ===');
const NAMED = ['废弃的教堂', '一位医生，医院', '一位老师，教室', '一位厨师，厨房',
  '雨夜的霓虹街道', '夏夜的萤火虫森林', '一座哥特城堡'];
let lost = 0;
NAMED.forEach(function (t) {
  const r = run(t);
  const hasAnchor = /身处/.test(r.out);
  if (!hasAnchor) lost++;
  const glue = /随身带着[^。]*，[^。，]{6,}/.test(r.out) && !/身处/.test(r.out);
  console.log('  ' + t.slice(0, 14).padEnd(16) + ' 场景=' + String(r.scene).padEnd(10) +
    ' 有「身处」=' + hasAnchor + (glue ? '  ⚠ 场景细节直接接在随身物后' : ''));
});
console.log('  → ' + NAMED.length + ' 条用户自己说了场景名的输入里，' + lost + ' 条丢了「身处X」锚点');
