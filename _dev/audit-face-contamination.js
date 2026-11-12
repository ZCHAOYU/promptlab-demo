'use strict';
/* 领域串味检测（第 2 版）
   ------------------------------------------------------------
   第 1 版用 2-gram 找「该角色档案里没有的词」，结果 816/816 全报 ——
   「梢微」「线略」「与不」全被当成可疑词，等于没检。

   第 2 版换个判据：**领域专属词**。
     每个簇 = 一组词 + 一条 justify 正则。
     判据不是「枚举哪些角色可以用」，而是「看这个角色自己的档案有没有相关依据」。
     例：「御前」属于皇权簇，justify=/帝|皇|宫|朝|冕/。
         女帝档案有「帝」→ 放行；少女档案是「十六七岁的少女，清纯安静」→ 报。
   这样不用维护 272 条白名单，也不会有 2-gram 的噪音。
   用法：node _dev/audit-face-contamination.js */
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

const FACES = vm.runInContext('window.__ROLE_FACES || {}', ctx);
// 每个角色的「自有依据」= 档案里所有中英文字段拼起来
const OWN = vm.runInContext('(function(){var o={};var c=KW_DB.character.categories;' +
  'for(var k in c){var e=c[k];var z=e.zh||{};' +
  'var parts=[k];' +
  'Object.keys(z).forEach(function(x){parts.push(String(z[x]||""));});' +
  'parts.push(String(e.core||""),String(e.detail||""),String(e.face||""),' +
  'String(e.pose||""),String(e.mood||""),String(e.ref||""),String(e.negative||""));' +
  'o[k]=parts.join(" ");}return o;})()', ctx);

/* 领域簇：words 里的词出现在脸上，但角色档案里找不到 justify 的依据 → 报 */
const CLUSTERS = [
  {
    name: '皇权宫廷',
    words: ['御前', '朝议', '诏令', '龙椅', '王座', '帝威', '帝袍', '群臣', '御座', '朝服', '垂帘', '金銮'],
    justify: /帝|皇|王|宫|朝|冕|臣|贵族|凤/
  },
  {
    name: '机械义体',
    words: ['面甲', '散热', '指示灯', '义眼', '义械', '接缝', '接口', '待机', '电路', '铆钉',
      '伺服', '合成虹膜', '机械瞳', '机芯', '义肢', '液压'],
    justify: /机械|机器人|机甲|赛博|钢铁|义体|人造|傀儡|蒸汽|齿轮|改造|合金|铁|未来|futur|cybern|exo|implant|armor|prosthe/
  },
  {
    name: '神职宗教',
    words: ['圣辉', '圣光', '祝祷', '慈悲', '香火', '圣痕', '神谕', '洗礼', '经文', '十字'],
    justify: /神|圣|牧|教|修女|天使|佛|道|庙|祈|祷|驱魔|阴阳/
  },
  {
    name: '亡灵尸骸',
    words: ['尸斑', '腐肉', '骸骨', '幽魂', '冥界', '亡魂', '骨节', '棺'],
    justify: /尸|亡|幽|冥|骷|墓|死|鬼|魂|僵尸|木乃伊/
  },
  {
    name: '鳞鳃水族',
    words: ['鳞', '鳃', '腮缝', '鳍', '鳔', '鳃裂'],
    justify: /鳞|鱼|龙|蛇|蜥|蛙|海|水|鳃|妖/
  },
  {
    name: '枪械火药',
    words: ['准星', '枪托', '弹壳', '膛线', '后坐', '弹匣', '火药', '硝烟', '扳机'],
    justify: /枪|狙|射|军|战士|警|兵|特工|炮|火药|械/
  },
  {
    name: '星象卜算',
    words: ['星轨', '命线', '卦象', '星辉', '星图', '天象', '卜算'],
    justify: /星|占|卜|预|天象|命运|祭司|神/
  },
  {
    name: '剑道',
    words: ['剑意', '剑诀', '剑气', '剑痕', '御剑', '剑光'],
    justify: /剑|刀|侠|武|修/
  }
];

const hits = [];
Object.keys(FACES).forEach(function (role) {
  const own = OWN[role] || '';
  ['daily', 'action', 'quiet'].forEach(function (sit) {
    const txt = String(FACES[role][sit] || '');
    const bad = [];
    CLUSTERS.forEach(function (c) {
      if (c.justify.test(own)) return;                 // 档案里有依据，放行
      const found = c.words.filter(function (w) { return txt.indexOf(w) >= 0; });
      if (found.length) bad.push({ cluster: c.name, words: found });
    });
    if (bad.length) hits.push({ role, sit, bad, txt });
  });
});

const LIMIT = (function () {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : 60;
})();

console.log(`角色 ${Object.keys(FACES).length}，命中 ${hits.length} 处`);
console.log('');
const byRole = {};
hits.forEach(function (h) { (byRole[h.role] = byRole[h.role] || []).push(h); });
Object.keys(byRole).forEach(function (r, i) {
  if (i >= LIMIT) return;
  console.log(`【${r}】`);
  byRole[r].forEach(function (h) {
    h.bad.forEach(function (b) {
      console.log(`  ${h.sit.padEnd(7)} [${b.cluster}] ${b.words.join('、')}`);
    });
    console.log(`          ${h.txt}`);
  });
  console.log('');
});
const roles = Object.keys(byRole);
if (roles.length > LIMIT) console.log(`…… 还有 ${roles.length - LIMIT} 个角色（--limit 调大）`);
console.log(`== 涉事角色 ${roles.length} 个 / 272，命中 ${hits.length} 处 ==`);
