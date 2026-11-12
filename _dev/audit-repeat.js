'use strict';
/* 重复片段审计：在同一条输出里，找重复出现过的子串（≥5 字）。
   为什么要机器扫：肉眼只能看几条。这类问题的形态是
   「抱着玩偶坐在空荡的房，坐在空荡的房间里」——
   用户原句被拆成两段各插一次，人看着像重复，程序里是两个独立函数各取了一遍。
   用法：node _dev/audit-repeat.js [--n 5] */
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

const INPUTS = [
  // test-manju 那 8 条
  '银发红瞳的病娇少年，穿着黑色高领长袍，站在雨夜的祠堂前',
  '高冷剑修，白衣黑发，手持长剑立于雪山之巅',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上',
  '白发病弱少年，裹着厚披风靠在窗边咳嗽',
  '兽耳少女，猫耳猫尾，穿着和风短打，蹲在屋檐上',
  '现代都市霸总，西装革履，站在落地窗前俯瞰夜景',
  '古风青梅竹马，素色襦裙，站在桃树下回头笑',
  '暗黑系病娇女，黑长直，抱着玩偶坐在空荡的房间里',
  // 补的：专门打「用户自己写了姿势」的交界处
  '一位少女坐在长椅上望着远处的夕阳',
  '少年手持长剑立在城门口',
  '老人坐在自家门槛上抽着旱烟',
  '女子抱着孩子站在渡口等人',
  '剑客站在竹林里擦着剑',
  '猫咪趴在窗台上晒太阳',
  '魔法师握着法杖站在塔顶',
  '少女躺在草地上看书',
  // 再补一批：专门逼不同维度组合，看有没有「名字被点两次」
  '一位老人',
  '一个剑客',
  '一位穿着红色长裙的少女，站在雨夜的霓虹街道',
  '一位骑士，厚重的板甲，站在暴风雪的城墙上',
  '都市里的咖啡馆，午后，阳光斜照',
  '一座废弃的教堂，藤蔓爬满石墙',
  '一把生锈的长剑，插在石头上',
  '一盏铜制的老式台灯，暖黄灯光',
  '一位赛博格黑客，义眼发光，蹲在机房角落',
  '一位修女在教堂里祈祷，烛光摇曳',
  '一位拳击手在擂台上，汗水和灯光',
  '一只黑猫坐在屋顶，月光下',
  '一位少女在樱花树下回头，微风吹起裙摆'
];

/* 注意签名：buildOptimizedPrompt(text, fills, depth, detection)。
   模式不是参数，要直接赋给脚本作用域的 currentMode ——
   和 smoke-all-modes.js 完全一致，否则测的是一条不存在的路径。 */
function gen(text, mode, depth) {
  return vm.runInContext(
    '(function(){' +
    'currentMode=' + JSON.stringify(mode) + ';' +
    'var d=detectDimensions(' + JSON.stringify(text) + ',' + JSON.stringify(mode) + ');' +
    'var f=smartFill(d,' + JSON.stringify(text) + ');' +
    'var o=buildOptimizedPrompt(' + JSON.stringify(text) + ',f,' + JSON.stringify(depth) + ',d);' +
    'return typeof o==="string"?o:(o&&o.optimized)||"";})()', ctx);
}

const MIN = (function () {
  const i = process.argv.indexOf('--n');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : 5;
})();

/* 找最长的、出现 >=2 次的子串。
   横跨逗号的子串不算：「…风格主导画面，自然日光…」里的「画面，自然」
   是两句话首尾碰巧撞上，不是重复内容。真重复（「坐在空荡的房」）不含逗号。 */
function longestRepeat(s, minLen) {
  const n = s.length;
  let best = null;
  for (let len = Math.min(20, n); len >= minLen; len--) {
    const seen = {};
    for (let i = 0; i + len <= n; i++) {
      const g = s.slice(i, i + len);
      if (/^[，。；、！？\s]+$/.test(g)) continue;
      if (g.indexOf('，') >= 0) continue;        // 跨逗号，不算
      if (seen[g] !== undefined) {
        if (!best || len > best.len) best = { len: len, text: g, at: [seen[g], i] };
      } else {
        seen[g] = i;
      }
    }
    if (best) break;   // 降序找，第一层命中的就是最长的
  }
  return best;
}

let bad = 0, total = 0;
const rows = [];
const COMBOS = [
  ['character', 'standard'], ['character', 'deep'], ['character', 'basic'],
  ['scene', 'standard'], ['scene', 'deep'],
  ['prop', 'standard'], ['prop', 'deep']
];
for (const text of INPUTS) {
  for (const [mode, depth] of COMBOS) {
    total++;
    let out = '';
    try { out = gen(text, mode, depth); } catch (e) { out = '生成失败: ' + e.message; }
    const r = longestRepeat(out, MIN);
    if (r) {
      bad++;
      rows.push({ text, mode, depth, out, r });
    }
  }
}

console.log(`共 ${total} 次生成（${INPUTS.length} 条输入 × ${COMBOS.length} 种模式/深度），` +
  `检查到重复的 ${bad} 次（阈值 ${MIN} 字）\n`);
rows.slice(0, 30).forEach(function (row, i) {
  console.log(`#${i + 1} 「${row.text}」 [${row.mode}/${row.depth}]`);
  console.log(`   重复「${row.r.text}」(${row.r.len} 字，位置 ${row.r.at.join(' / ')})`);
  console.log(`   ${row.out}`);
  console.log('');
});
if (rows.length > 30) console.log(`…… 还有 ${rows.length - 30} 条\n`);
console.log(`== ${bad} / ${total} 次生成有重复 ==`);
