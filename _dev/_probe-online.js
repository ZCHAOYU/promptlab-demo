'use strict';
/* 联网复测（2026-11-11）：带 /api/parse 结果跑完整拼装，看缺陷是否还成立。
   用法：先 serve.py 8777，再 node _dev/_probe-online.js */
const vm = require('vm');
const BASE = 'http://127.0.0.1:8777';
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

async function parse(text) {
  const res = await fetch(BASE + '/api/parse', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  });
  const j = await res.json();
  return j && j.ok ? j.data : null;
}

const CASES = [
  '一位厨师，后厨',
  '一位程序员，机房',
  '一位工人，工地',
  '一位科学家，医院',
  '废弃的教堂，藤蔓爬满石墙',
  '一个浑身是血的男人跪在教堂面前',
  '一位手上全是机油的修理工，蹲在化粪池旁边'
];

(async function () {
  for (const t of CASES) {
    const data = await parse(t);
    ctx.__p = data ? { text: t, at: Date.now(), data: data } : null;
    const r = JSON.parse(G(`(function(){
      var t=${JSON.stringify(t)};
      window.__parse=window.__p;
      var m=inferSubjectType(t,detectDimensions(t,'character'));currentMode=m;
      var d=detectDimensions(t,m);
      var f=smartFill(d,t);
      var o=buildOptimizedPrompt(t,f,'standard',d);
      var out=(typeof o==='string')?o:(o&&o.optimized)||'';
      return JSON.stringify({mode:m,scene:f.scene,out:out});})()`));
    const m = String(r.out).match(/随身带着([^。]*)/);
    const items = m ? m[1].split('，').filter(Boolean) : [];
    console.log('\n【' + t + '】  mode=' + r.mode + '  场景=' + r.scene);
    console.log('  parse: 场景=' + JSON.stringify(data && data['场景']) +
      ' 道具=' + JSON.stringify(data && data['场景道具']) +
      ' raw=' + JSON.stringify(data && data.raw));
    console.log('  有「身处」=' + /身处/.test(String(r.out)) + ' | 随身带着 ' + items.length + ' 项' +
      (items.length ? '：' + items.slice(0, 8).join('/') : ''));
    console.log('  正文：' + String(r.out).slice(0, 200));
  }
})();
