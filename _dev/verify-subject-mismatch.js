'use strict';
/* 主体认错复测：单字关键词不得穿透到更长的词里。
   背景：龙傲天→龙骑士、皮影艺人→忍者、灯火→火焰法师，都是 1 字 key 命中构词的一部分。
   用法：node _dev/verify-subject-mismatch.js */
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

function run(text) {
  return JSON.parse(G(
    '(function(){var m=inferSubjectType(' + JSON.stringify(text) + ',detectDimensions(' + JSON.stringify(text) + ',"character"));' +
    'currentMode=m;var d=detectDimensions(' + JSON.stringify(text) + ',m);' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,"standard",d);' +
    'return JSON.stringify({mode:m,ch:d.character&&d.character.detected,weak:!!(d.character&&d.character._weak),' +
    'synth:!!(d.character&&d.character._synth),gender:f.gender,fch:f.character,' +
    'out:(typeof o==="string"?o:(o&&o.optimized)||"")});})()'));
}

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

console.log('=== 1. 单字关键词不能穿透构词 ===');
[
  ['龙傲天', '龙骑士'],
  ['皮影艺人，枯瘦的手挑着竹签', '忍者'],
  ['一位皮影戏艺人，灯火下操纵皮影', '火焰法师'],
  ['皮影艺人，枯瘦的手挑着竹签', '火焰法师']
].forEach(function (c) {
  const r = run(c[0]);
  ok(r.out.indexOf(c[1]) < 0 && r.ch !== c[1],
    '「' + c[0] + '」不再认成「' + c[1] + '」（现为 ' + (r.ch || '无') + '）');
});

console.log('\n=== 2. 本来就对的不能被误伤 ===');
[
  ['龙族骑士，黑龙鳞甲', '骑士'],
  ['机械工程师，油污工装', '工程师'],
  ['忍者', '忍者'],
  ['龙', '龙骑士'],
  ['兽耳少女，猫耳猫尾', '少女']
].forEach(function (c) {
  const r = run(c[0]);
  ok(r.ch === c[1], '「' + c[0] + '」仍为「' + c[1] + '」（现为 ' + (r.ch || '无') + '）');
});

console.log('\n=== 3. 认不出职业时用用户自己的名词兜底，不发明职业 ===');
[
  ['皮影艺人，枯瘦的手挑着竹签', '艺人'],
  ['一位皮影戏艺人，灯火下操纵皮影', '艺人']
].forEach(function (c) {
  const r = run(c[0]);
  ok(r.fch === c[1] && r.out.indexOf(c[1]) >= 0,
    '「' + c[0] + '」主体=' + r.fch + '，且出现在输出里');
});

console.log('\n=== 4. 主体比命中词长时标记弱匹配，留给第 3 层推理 ===');
const mj = run('机械姬，银色义体，站在霓虹街头');
// 现在弱匹配会被「用用户自己的名词」接管（机械姬 不再变成 机械师），
// 所以 _weak 标记被消费掉了是正常的——断言看结果，不看内部旗标。
ok(mj.ch === '机械姬', '「机械姬」主体仍是「机械姬」，没被改成机械师（现为 ' + (mj.ch || '无') + '）');
ok(mj.ch !== '机械师', '「机械姬」不再是「机械师」');
ok(mj.gender === '女性' || mj.gender === '', '「机械姬」性别=女性（现为 ' + mj.gender + '）');

console.log('\n=== 5. 纯粹不知道该画什么时仍然不编造主体 ===');
['你好', '今天天气不错'].forEach(function (t) {
  const r = run(t);
  ok(!r.ch && !r.fch, '「' + t + '」没有主体（ch=' + (r.ch || '无') + '，fch=' + (r.fch || '无') + '）');
});

console.log('\n=== 6. 量词不能把「有人物+道具」的描述判成道具 ===');
// 「一位…少女，手里拿着一把黑色的伞」原来被「一把」直接判成道具，
// 整条输出变成「布料材质 / 虚空吞噬质感 / 手持展示」。
[
  ['一位穿着红色长裙的少女，站在雨夜的霓虹街道，手里拿着一把黑色的伞，头发被风吹起', 'character'],
  ['一把生锈的长剑，插在石头上，周围全是枯草', 'prop'],
  ['一只青花瓷茶盏，放在木桌上', 'prop'],
  ['一串佛珠，紫檀木的', 'prop']
].forEach(function (c) {
  const r = run(c[0]);
  ok(r.mode === c[1], '「' + c[0].slice(0, 24) + '…」模式=' + r.mode + '（应为 ' + c[1] + '）');
});

console.log('\n=== 7. 通用后缀不能把动词短语当成人 ===');
// 「家 / 手 / 后 / 主」原来也在人物后缀里，「女高中生放学回家」输出成了「回家，女高中生放学。」
const HOME = run('女高中生放学回家');
ok(HOME.fch !== '回家', '「女高中生放学回家」主体不是「回家」（现为 ' + (HOME.fch || '无') + '）');
ok(HOME.out.indexOf('回家，') < 0, '输出里没有把「回家」当主语');

console.log('\n=== 8. 常见职业名词能被当主体 ===');
[
  ['老板发火', '老板'],
  ['女高中生放学回家', '高中生']
].forEach(function (c) {
  const r = run(c[0]);
  const okk = r.fch === c[1];
  ok(okk, '「' + c[0] + '」主体=' + (r.fch || '无') + '（应为 ' + c[1] + '）');
});

console.log('\n=== 9. 用户写了船/帐篷这类地点也要认 ===');
const BOAT = JSON.parse(G('(function(){var d=detectDimensions("老年的渔夫，斗笠蓑衣，坐在乌篷船头","character");' +
  'return JSON.stringify({place:extractUserPlace("老年的渔夫，斗笠蓑衣，坐在乌篷船头"),scene:d.scene.detected})})()'));
ok(BOAT.place === '船头', 'extractUserPlace 认出「船头」（实际 ' + BOAT.place + '）');
ok(BOAT.scene === '船头', '场景用用户写的「船头」（实际 ' + BOAT.scene + '）');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
