'use strict';
/* 大样本真机体检：48 条覆盖人物 / 场景 / 道具 / 口语 / 长句 / 抽象边界。
   只做机械可判定的检查，不替代人工判断，所以结果是「下限」。
   检查项：
     A 主体为空（人物和场景都没识别出来）
     B 场景被替换（库里场景名不在输入里，却成了 fills.scene）
     C 输出里出现用户没写过的库场景名
     D 人物模式下色彩或光照被裁成 null
     E 输出过短（< 40 字）
     F 5 字重复片段
     G 模式判定可疑（「一把/一只/物品词」被判成人物，或反之）
   用法：node _dev/audit-reality-wide.js
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

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
  fetch: async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const { loadApp } = require('./load-scripts');
loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

const CASES = [
  // ---- 人物 ----
  ['人物', '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前'],
  ['人物', '高冷剑修，白衣黑发，手持长剑立于雪山之巅'],
  ['人物', '红衣女帝，金冠高髻，坐于大殿龙椅之上'],
  ['人物', '白发病弱少年，裹着厚披风靠在窗边咳嗽'],
  ['人物', '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上'],
  ['人物', '现代都市霸总，西装革履，站在落地窗前俯瞰夜景'],
  ['人物', '古风青梅竹马，素色襦裙，站在桃树下回头笑'],
  ['人物', '暗黑系病娇女，黑长直，抱着玩偶坐在空荡的房间里'],
  ['人物', '赛博朋克机械师，义体手臂，蹲在雨夜的巷子里修车'],
  ['人物', '老年的渔夫，斗笠蓑衣，坐在乌篷船头'],
  ['人物', '朋克摇滚乐手，皮夹克铆钉，站在舞台上嘶吼'],
  ['人物', '边防战士，厚重军大衣，在暴风雪里站岗'],
  ['人物', '田园少女，碎花连衣裙，提着篮子走在麦田里'],
  ['人物', '中世纪骑士，全身板甲，跪在教堂彩窗前祈祷'],
  ['人物', '民国女学生，蓝衣黑裙，撑着油纸伞走在青石板上'],
  ['人物', '街头涂鸦少年，卫衣帽子扣头上，蹲在墙角喷漆'],
  ['人物', '赛博朋克道士，道袍镶满霓虹灯管'],
  ['人物', '皮影艺人，枯瘦的手挑着竹签'],
  ['人物', '机械姬，银色义体，站在霓虹街头'],
  ['人物', '龙傲天，黑衣金纹长袍，站在大殿之上'],
  // ---- 场景 ----
  ['场景', '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来'],
  ['场景', '雨夜的霓虹街道，地面积水反射着灯牌'],
  ['场景', '清晨的江南水乡，白墙黑瓦，河上漂着小船'],
  ['场景', '一座哥特城堡'],
  ['场景', '一片竹林'],
  ['场景', '赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里'],
  ['场景', '末日废土的加油站，锈迹斑斑'],
  ['场景', '夏夜的萤火虫森林'],
  ['场景', '高铁站台，人来人往，暖黄色的灯'],
  ['场景', '深夜的便利店，只有店员一个人在收银'],
  // ---- 道具 ----
  ['道具', '一把生锈的长剑，插在石头上，周围全是枯草'],
  ['道具', '一只青花瓷茶盏，放在木桌上'],
  ['道具', '老式机械怀表，表面有划痕'],
  ['道具', '一串佛珠，紫檀木的'],
  // ---- 口语 ----
  ['口语', '一个在雨里哭的女孩子'],
  ['口语', '我想画一个侠客'],
  ['口语', '帮我画只猫'],
  ['口语', '老板发火'],
  ['口语', '女高中生放学回家'],
  ['口语', '猫耳朵的女仆'],
  // ---- 长句 ----
  ['长句', '一位穿着红色长裙的少女，站在雨夜的霓虹街道，手里拿着一把黑色的伞，头发被风吹起，眼神很冷漠'],
  ['长句', '两个剑客在月下决斗'],
  ['长句', '森林里的小木屋，屋顶积着雪，窗口透出暖光'],
  ['长句', '一个戴眼镜的程序员，熬夜写代码，桌上全是咖啡杯'],
  // ---- 边界 ----
  ['边界', '孤独'],
  ['边界', '你好'],
  ['边界', '2024年夏天'],
  ['边界', '红色']
];

const SCENE_CORES = (function () {
  const names = G('Object.keys(KW_DB.scene.categories)');
  const out = {};
  names.forEach(function (n) {
    out[n] = G('(function(){var c=KW_DB.scene.categories[' + JSON.stringify(n) + '];return (c&&c.zh&&c.zh.core)||""})()') || n;
  });
  return out;
})();
const SYNTH = 'window.__SCENE_SYNTH||{}';

function run(text) {
  return JSON.parse(G(
    '(function(){' +
    'var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'var out=(typeof o==="string"?o:(o&&o.optimized)||"");' +
    'var det={};Object.keys(d).forEach(function(k){if(d[k]&&d[k].detected)det[k]=d[k].detected;});' +
    'return JSON.stringify({mode:m,det:det,scene:f.scene,lighting:f.lighting,color:f.color,' +
    'sceneDetail:(function(){var x=KW_DB.scene.categories[f.scene]||(window.__SCENE_SYNTH||{})[f.scene];' +
    'return x&&x.zh?(x.zh.detail||""):""})(),' +
    'fromUserPlace:!!(d.scene&&d.scene._fromUserPlace),out:out});})()'));
}

/* 5 字重复片段 */
function repeatFragments(s) {
  const t = String(s || '').replace(/[。．.，,；;、]/g, '|');
  const seen = {};
  const dup = {};
  t.split('|').forEach(function (seg) {
    for (let i = 0; i + 5 <= seg.length; i++) {
      const w = seg.slice(i, i + 5);
      if (seen[w]) dup[w] = 1; else seen[w] = 1;
    }
  });
  return Object.keys(dup);
}

const rows = [];
const stat = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };

CASES.forEach(function (c) {
  const kind = c[0], text = c[1];
  let r;
  try { r = run(text); }
  catch (e) { rows.push({ kind: kind, text: text, flags: ['运行时异常：' + e.message] }); return; }

  const flags = [];
  const place = G('extractUserPlace(' + JSON.stringify(text) + ')') || null;
  const chosenCore = r.scene ? (SCENE_CORES[r.scene] || r.scene) : '';
  const isBoundary = kind === '边界';

  // A 主体为空 —— 只对人物/场景类有意义。
  // 道具模式本来就没有「人」；边界类（「你好」「孤独」）是故意弹窗让用户补充的，不算问题。
  if (!isBoundary && r.mode !== 'prop' && kind !== '道具'
      && !r.det.character && !r.det.scene) {
    flags.push('A 主体为空');
  }

  // B 场景被替换 —— 只有「用户真的写了地点」才算。
  // 用户没写地点时由风格默认值补一个场景是设计如此，不是替换。
  if (place && chosenCore && chosenCore.indexOf(place) < 0 && text.indexOf(chosenCore) < 0) {
    flags.push('B 用户写的「' + place + '」被换成「' + r.scene + '」');
  }

  // C 输出里出现第二个地点 —— 排除：用户写的、选中的场景本身、它自己的子串，
  // 以及选中场景的「档案细节」正文（「加油站」的描述里本来就该出现便利店，
  // 那是同一个场景的一部分，不是第二个地点）。
  const detail = String(r.sceneDetail || '');
  const body = detail ? r.out.split(detail).join('') : r.out;
  const extra = [];
  Object.keys(SCENE_CORES).forEach(function (name) {
    const core = SCENE_CORES[name];
    if (!core || core.length < 2) return;
    if (text.indexOf(core) >= 0) return;          // 用户自己写的
    if (chosenCore.indexOf(core) >= 0) return;    // 是选中场景名的一部分（冰原 ⊂ 冰原极光）
    if (core.indexOf(chosenCore) >= 0 && chosenCore) return;
    if (body.indexOf(core) >= 0) extra.push(core);
  });
  if (extra.length) flags.push('C 多出第二个地点：' + extra.slice(0, 3).join('/'));

  // D 人物模式下色彩/光照被裁空
  if (r.mode === 'character' && r.det.character) {
    if (!r.lighting) flags.push('D 光照为 null');
    else if (!r.color) flags.push('D 色彩为 null');
  }

  // E 输出过短（边界类单独看，本来就没有内容）
  if (!isBoundary && r.out.replace(/\s/g, '').length < 40) flags.push('E 输出过短(' + r.out.length + ')');

  // F 5 字重复
  const dup = repeatFragments(r.out);
  if (dup.length) flags.push('F 重复片段：' + dup.slice(0, 3).join('/'));

  // G 模式可疑 —— 只看「确实描述了人」却判成道具/场景。
  // 原来还看「结尾是灯/瓶」这种，把「高铁站台…暖黄色的灯」误判成道具，去掉。
  const looksPerson = /(少年|少女|女子|男子|女孩|男孩|老人|武者|剑修|剑客|骑士|道士|机械师|艺人|女帝|霸总|战士|学生|女仆|乐手|程序|老板|猫耳|渔夫|医生|护士|教师)/.test(text);
  if (looksPerson && r.mode === 'prop') flags.push('G 人物被判成道具');
  if (looksPerson && r.mode === 'scene' && !place) flags.push('G 人物被判成场景');

  flags.forEach(function (f) { const k = f.charAt(0); if (stat[k] !== undefined) stat[k]++; });
  rows.push({ kind: kind, text: text, mode: r.mode, scene: r.scene, flags: flags, len: r.out.length });
});

console.log('类  模式       场景            长度  输入');
console.log('-'.repeat(110));
rows.forEach(function (r) {
  const mark = r.flags.length ? '✗' : '○';
  console.log(
    mark + ' ' + (r.kind + '    ').slice(0, 4) + ' ' + (String(r.mode || '?') + '        ').slice(0, 9) +
    ' ' + (String(r.scene || '(无)') + '            ').slice(0, 14) +
    ' ' + String(r.len || 0).padStart(4) + '  ' + r.text.slice(0, 42)
  );
  r.flags.forEach(function (f) { console.log('      ⚠ ' + f); });
});

const bad = rows.filter(function (r) { return r.flags.length; });
console.log('\n== ' + rows.length + ' 条里，有机械可检出问题的 ' + bad.length + ' 条 ==');
console.log('   A 主体为空       ' + stat.A);
console.log('   B 场景被替换     ' + stat.B);
console.log('   C 多出场景       ' + stat.C);
console.log('   D 光/色被裁空    ' + stat.D);
console.log('   E 输出过短       ' + stat.E);
console.log('   F 重复片段       ' + stat.F);
console.log('   G 模式可疑       ' + stat.G);
console.log('\n（只查机械可判定的项，认错主体、语句生硬、审美不对都查不出来，所以这是下限）');
// 当作回归门用：有问题就退出码非 0
process.exit(bad.length ? 1 : 0);
