'use strict';
/* 临时探针（2026-11-11）：只打印实际值，不做任何修改。
   目的：定位「科学家 + 实验室」器材被换掉的那一处。
   打印 fills.scene / charData.zh.carries / 装配阶段 s1（= 把收尾清洗函数停用后看到的正文）
   用法：node _dev/_probe-scene-lab.js
*/
const vm = require('vm');
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

const CASES = [
  ['一位科学家，实验室', { 场景: '实验室', 场景道具: ['试管架', '试剂瓶'], raw: [] }, '联网'],
  ['一位科学家，街角咖啡馆', { 场景: '咖啡馆', 场景道具: ['咖啡杯', '托盘', '菜单'], raw: [] }, '联网'],
  // 离线：没有抽取结果，手写表是唯一来源。查表这一段原来用精确匹配 → 整段跳过
  ['一位科学家，街角咖啡馆', null, '离线']
];

CASES.forEach(function (pair, i) {
  const text = pair[0], parseData = pair[1], label = pair[2] || '联网';
  console.log('\n===== 用例 ' + (i + 1) + '：' + text + '（' + label + '） =====');
  ctx.__t = text;
  ctx.__p = parseData ? { text: text, at: Date.now(), data: parseData } : null;
  const r = G(`(function(){
    var t = window.__t;
    window.__parse = window.__p;
    var d = detectDimensions(t, 'character'); currentMode = inferSubjectType(t, d);
    var f = smartFill(d, t);
    var kw = (KW_DB.character && KW_DB.character.categories[f.character]) || null;
    var cd = kw && kw.zh ? kw.zh : ((d.character && d.character.zh) ? d.character.zh : null);
    return {
      fillsScene: f.scene,
      fillsCharacter: f.character,
      sceneCore: (KW_DB.scene && KW_DB.scene.categories[f.scene] && KW_DB.scene.categories[f.scene].zh ? KW_DB.scene.categories[f.scene].zh.core : null),
      carries: cd ? cd.carries : null,
      workProp: /试管|显微镜|烧杯|量筒|数据平板|记录板|示波器|离心机|培养皿|试剂|焊枪|扳手|图纸|游标卡尺|万用表/.test(String(cd && cd.carries || '')),
      propFromParse: (window.__parse && window.__parse.data && window.__parse.data['场景道具']) || null,
      exactTableKey: !!(typeof SCENE_PROPS !== 'undefined' && SCENE_PROPS[String(f.scene)]),
      containHit: (function () {
        var k = String(f.scene), hit = [];
        if (typeof SCENE_PROPS !== 'undefined') Object.keys(SCENE_PROPS).forEach(function (x) { if (k.indexOf(x) >= 0) hit.push(x); });
        return hit;
      })()
    };
  })()`);
  console.log('  fills.scene        =', JSON.stringify(r.fillsScene));
  console.log('  fills.character    =', JSON.stringify(r.fillsCharacter));
  console.log('  sceneData.zh.core  =', JSON.stringify(r.sceneCore));
  console.log('  charData.zh.carries=', JSON.stringify(r.carries));
  console.log('  随人物器材是工作器材 =', r.workProp, ' / 抽取的场景道具 =', JSON.stringify(r.propFromParse));
  console.log('  手写表精确命中      =', r.exactTableKey, ' / 包含命中 =', JSON.stringify(r.containHit));

  // 装配阶段：临时停用收尾清洗，看装配出来的 s1（只在本探针内生效）
  const asm = G(`(function(){
    var t = window.__t; window.__parse = window.__p;
    var d = detectDimensions(t, 'character'); currentMode = inferSubjectType(t, d);
    var f = smartFill(d, t);
    var keep = dropSceneMismatchCarries;
    dropSceneMismatchCarries = function (x) { return x; };   // 停用收尾清洗
    var r = buildOptimizedPrompt(t, f, 'standard', d);
    dropSceneMismatchCarries = keep;
    return (typeof r === 'string') ? r : r.optimized;
  })()`);
  console.log('  [装配后 / 收尾清洗前] ' + String(asm).slice(0, 160));

  const full = G(`(function(){
    var t = window.__t; window.__parse = window.__p;
    var d = detectDimensions(t, 'character'); currentMode = inferSubjectType(t, d);
    var f = smartFill(d, t);
    var r = buildOptimizedPrompt(t, f, 'standard', d);
    return (typeof r === 'string') ? r : r.optimized;
  })()`);
  console.log('  [最终输出]          ' + String(full).slice(0, 160));
});
