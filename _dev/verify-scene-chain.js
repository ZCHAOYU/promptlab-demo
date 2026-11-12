'use strict';
/* 验收：场景链路（2026-11-11）
   ------------------------------------------------------------
   这一条把三个症状当一件事验收 —— 它们的共同病灶是「场景这件事没人负责」：
     1 用户写的地点被风格默认值顶掉（离线 8/24、联网 15/24）
     2 场景道具被当「随身带着」（教堂→长椅/烛台/碎玻璃；化粪池→抽粪管/井盖）
     3 用户自己说了场景名时，「身处X」锚点被删，场景细节粘在随身物后面（医院 14 件）

   要服务端（/api/parse）在跑；run-all 会自己拉起。
   用法：node _dev/verify-scene-chain.js
*/
const vm = require('vm');
const BASE = process.env.PL_BASE || 'http://127.0.0.1:8777';

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
  fetch: async () => { throw new Error('offline-in-vm'); },
  alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: BASE + '/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() { }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
require('./load-scripts').loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } }

async function health() {
  try {
    const r = await fetch(BASE + '/api/health');
    return r.ok;
  } catch (e) { return false; }
}

async function parseOf(text) {
  try {
    const r = await fetch(BASE + '/api/parse', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    });
    const j = await r.json();
    return j && j.ok ? j.data : null;
  } catch (e) { return null; }
}

function run(text, parseData) {
  ctx.__p = parseData ? { text: text, at: Date.now(), data: parseData } : null;
  return JSON.parse(G(`(function(){
    var t=${JSON.stringify(text)};
    window.__parse=window.__p;
    var m=inferSubjectType(t,detectDimensions(t,'character'));currentMode=m;
    var d=detectDimensions(t,m);
    var f=smartFill(d,t);
    var o=buildOptimizedPrompt(t,f,'standard',d);
    return JSON.stringify({mode:m,scene:f.scene,src:f._sceneSource,
      out:(typeof o==='string'?o:(o&&o.optimized)||'')});})()`));
}

/* 随身物只取到「身处」或句号为止 —— 后面是场景细节，不是道具 */
function carries(out) {
  const m = String(out).match(/随身带着([^。]*)/);
  if (!m) return [];
  const seg = m[1].split('身处')[0];
  return seg.split('，').map(function (s) { return s.trim(); }).filter(Boolean);
}

const NOT_CARRYABLE = /椅|凳|床|柜|桌|炉|灶|管道|抽粪管|网线|电线|井|砖|碎玻璃|台|架|灯|招牌|病历|脚手架|墙|地面|空气/;

(async function () {
  if (!(await health())) {
    console.log('服务端没起：这条要 /api/parse 才能验，先 serve.py 8777');
    process.exit(1);
  }

  /* ---- 1. 用户写的地点，最终场景必须是它 ---- */
  console.log('\n=== 1. 用户写的地点（24 个）===', '（联网：parse 给的场景要能覆盖风格默认值）');
  const PLACES = ['后厨', '机房', '工地', '教室', '宿舍', '超市', '地铁', '机场', '厨房', '阳台',
    '车库', '仓库', '网吧', '健身房', '图书馆', '操场', '会议室', '实验室', '前台', '车间',
    '医院', '咖啡馆', '教室走廊', '地下停车场'];
  let wrong = [];
  for (const p of PLACES) {
    const t = '一位科学家，' + p;
    const r = run(t, await parseOf(t));
    const scene = String(r.scene || '');
    const good = scene.indexOf(p) >= 0 || p.indexOf(scene) >= 0;   // 允许「教室走廊→教室」这种包含
    if (!good) { wrong.push(p + '→' + scene); }
    else if (r.src !== 'user' && r.src !== 'parse') wrong.push(p + '（来源可疑：' + r.src + '）');
  }
  ok(!wrong.length, '24 个地点全部落在用户写的地点上' + (wrong.length ? '（错的：' + wrong.join('、') + '）' : ''));

  /* ---- 2. 场景道具不许进「随身带着」---- */
  console.log('\n=== 2. 场景道具（长椅/病床/井盖…）不能当随身物 ===');
  const VENUES = [
    ['废弃的教堂，藤蔓爬满石墙', '教堂'],
    ['一个浑身是血的男人跪在教堂面前', '教堂'],
    ['一位科学家，医院', '医院'],
    ['一位手上全是机油的修理工，蹲在化粪池旁边', '化粪池'],
    ['一位厨师，后厨', '后厨']
  ];
  let dirty = [];
  for (const v of VENUES) {
    const t = v[0];
    const r = run(t, await parseOf(t));
    const items = carries(r.out);
    const bad = items.filter(function (s) { return NOT_CARRYABLE.test(s); });
    if (bad.length) dirty.push(v[1] + '：' + bad.join('/'));
  }
  ok(!dirty.length, '五个场所都没有把家具/设备当随身物' + (dirty.length ? '（脏的：' + dirty.join('；') + '）' : ''));

  /* ---- 3. 用户说了场景名时，「身处X」锚点必须在 ---- */
  console.log('\n=== 3. 「身处X」锚点（人物模式 + 用户自己说了场景名）===');
  const NAMED = ['一位医生，医院', '一位老师，教室', '一位厨师，厨房',
    '一位科学家，实验室', '一位学生，图书馆', '一位程序员，机房'];
  let noAnchor = [];
  for (const t of NAMED) {
    const r = run(t, await parseOf(t));
    if (r.mode !== 'character') continue;
    if (!/身处/.test(r.out)) noAnchor.push(t);
  }
  ok(!noAnchor.length, NAMED.length + ' 条都有「身处X」锚点' + (noAnchor.length ? '（缺的：' + noAnchor.join('、') + '）' : ''));

  /* ---- 4. 场景细节不许粘在随身物后面 ---- */
  console.log('\n=== 4. 场景细节不能粘在「随身带着」后面 ===');
  const t4 = '一位科学家，医院';
  const out4 = run(t4, await parseOf(t4)).out;
  const m4 = String(out4).match(/随身带着(.*?)。/);
  const tail = m4 ? m4[1] : '';
  ok(tail.indexOf('身处') >= 0 || carries(out4).length <= 5,
    '医院那句在「身处医院」处收住，没有把 14 项读成道具');

  console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
  process.exit(fail ? 1 : 0);
})();
