'use strict';
/* 自查第一轮（2026-11-11，交接前）：换角度找缺陷。
   已有 audit-reality-wide.js 覆盖：主体空 / 场景替换 / 多出场景 / 光色裁空 / 过短 / 重复 / 模式可疑。
   这一轮专门查它没查的七类：
     P 标点与格式卫生（半角逗号、连续逗号、标点序、句子收尾、中英混排）
     N 英文侧（a/an 冠词、半角词、中文残片、中文标点在英文里）
     S 三段式结构（画面 / 画法 / 调性 是否都在）
     X 性别与数量矛盾（一位男性…少女；三人却写一位）
     C 随身道具（条数过多 / 不可携带 / 重复）
     E 年代与风格冲突（民国/古风 配 霓虹/赛博）
     T 极端输入（空、纯标点、纯 emoji、超长、多段、数字）
   用法：node _dev/_selftest-round1.js [--dump]
     --dump 打印被标记条目的全文，便于人工判断
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
    addEventListener() { }, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute() { return this[k] || null; },
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
  document: doc,
  navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
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

const CASES = [
  // ---- 标点与格式（中文侧）----
  ['P', '高冷剑修，白衣黑发，手持长剑立于雪山之巅'],
  ['P', '一位少女，穿着红色长裙。站在雨夜的霓虹街道'],
  ['P', '赛博朋克机械师,义体手臂,蹲在雨夜的巷子里修车'],          // 半角逗号输入
  ['P', '老年的渔夫，斗笠蓑衣，坐在乌篷船头，'],
  // ---- 性别 / 数量 ----
  ['X', '一位男性少女，穿着裙子站在樱花树下'],
  ['X', '三个剑客在月下决斗'],
  ['X', '两个少女手牵手走在放学的路上'],
  ['X', '一位女性公子，折扇轻摇'],
  // ---- 随身道具 ----
  ['C', '一位科学家，医院'],
  ['C', '一位厨师，后厨'],
  ['C', '一位程序员，机房'],
  ['C', '一位工人，工地'],
  ['C', '一位老师，教室'],
  ['C', '一位猎人，雪山'],
  ['C', '一位旅行者，沙漠'],
  ['C', '一位学生，图书馆'],
  ['C', '一位医生，手术室'],
  // ---- 年代 / 风格冲突 ----
  ['E', '民国女学生，蓝衣黑裙，撑着油纸伞走在青石板上'],
  ['E', '古风侠客，青衫长剑，立于山巅'],
  ['E', '唐朝仕女，襦裙，站在御花园里'],
  // ---- 英文侧 ----
  ['N', 'a cyberpunk samurai standing in neon rain'],
  ['N', 'an old fisherman sitting on a boat in the mist'],
  ['N', 'epic ancient temple in the mountains'],
  ['N', '一朵红色的花'],
  // ---- 中英混排 ----
  ['N', 'cyberpunk 风格的剑客，neon 灯牌'],
  // ---- 极端输入 ----
  ['T', ''],
  ['T', '   '],
  ['T', '！！！'],
  ['T', '🐱'],
  ['T', '2024'],
  ['T', '红色'],
  ['T', '孤独'],
  ['T', '猫'],
  ['T', '一座寺庙，\n\n雨下得很大，\n屋檐在滴水。'],
  ['T', '一位少年站在海边。海风很大。他望着远方，眼神里有说不出的东西，'
    + '身后的城市在暮色里亮起灯来，一艘船正缓缓离港，'
    + '远处的灯塔开始闪烁，海鸥贴着浪尖飞过，沙滩上留下两行脚印，'
    + '风把他的围巾吹得很高，他伸手按住，慢慢转身往回走。'],
  // ---- 三段式结构（三种深度）----
  ['S', '银发红瞳的病弱少年，穿着黑色高领长衫，站在雨夜的祠堂前'],
  ['S', '废弃的教堂，藤蔓爬满石墙，午后的光从彩窗透进来'],
  ['S', '一把生锈的长剑，插在石头上，周围全是枯草']
];

const DEPTHS = ['basic', 'standard', 'deep'];

function analyze(text, depth) {
  const r = JSON.parse(G(
    '(function(){' +
    'var t=' + JSON.stringify(text) + ';' +
    'var m=inferSubjectType(t,detectDimensions(t,"character"));' +
    'currentMode=m;' +
    'var d=detectDimensions(t,m);' +
    'var f=smartFill(d,t);' +
    'var o=buildOptimizedPrompt(t,f,' + JSON.stringify(depth) + ',d);' +
    'var out=(typeof o==="string"?o:(o&&o.optimized)||"");' +
    'var det={};Object.keys(d).forEach(function(k){if(d[k]&&d[k].detected)det[k]=d[k].detected;});' +
    'return JSON.stringify({mode:m,det:det,char:!!(d.character&&d.character.detected),' +
    'scene:f.scene,lighting:f.lighting,color:f.color,out:out});})()'));
  return r;
}

const ABSURD_CARRY = /城|校|院|宫|店|站|街|桥|楼|塔|海|山|河|湖|天|云|阳|月|星|树|林|花|草|石|墙|门|窗|路|场|园|台|桌|床|椅/;

function checks(kind, text, depth, r) {
  const out = String(r.out || '');
  const flags = [];

  // ---------- P 标点与格式 ----------
  if (/，{2,}|，，/.test(out)) flags.push('P 连续逗号');
  if (/。，|，。|。，/.test(out)) flags.push('P 标点顺序错');
  if (/[。．.]{2,}/.test(out)) flags.push('P 连续句号');
  if (/[一-龥],\s*[一-龥]/.test(out)) flags.push('P 半角逗号夹在中文里');
  if (/^\s*[，。、；：]/.test(out)) flags.push('P 以标点开头');
  if (out && !/[。！？.!?]$/.test(out.trim())) flags.push('P 结尾没有句号');
  if (/[一-龥]\s{2,}[一-龥]/.test(out)) flags.push('P 中文里多余空格');
  const open = (out.match(/（/g) || []).length, close = (out.match(/）/g) || []).length;
  if (open !== close) flags.push('P 括号不配对（' + open + '/' + close + '）');

  // ---------- N 英文侧 ----------
  const hasChinese = /[一-龥]/.test(out);
  const isEnglishOut = !hasChinese && /[a-zA-Z]{3,}/.test(out);
  if (isEnglishOut) {
    if (/\ba [aeiouAEIOU]/.test(out)) flags.push('N a + 元音（该用 an）');
    if (/\ban [^aeiouAEIOU\s]/.test(out)) flags.push('N an + 辅音');
    if (/[，。、；：（）【】]/.test(out)) flags.push('N 英文里出现中文标点');
    if (/[,;]\s*\S/.test(out) === false && /,/.test(out) === false) flags.push('N 英文没有逗号分隔');
    if (/\b\w{2,}\s*$/.test(out) && /[a-z]$/.test(out)) flags.push('N 英文结尾没有句号');
  }

  // ---------- S 三段式结构 ----------
  if (hasChinese) {
    const dots = (out.match(/。/g) || []).length;
    if (dots < 2) flags.push('S 只有 ' + dots + ' 个句号（画面/画法/调性没分开）');
    const tail = out.slice(out.lastIndexOf('。', out.length - 2) + 1);
    if (!/(色调|色彩基调|氛围|画质|高清|8K|4K)/.test(tail)) flags.push('S 最后一段缺调性（色调/氛围/画质）');
    if (!/(画风|风格|照明|光|构图|机位|景别|中景|特写|远景)/.test(out)) flags.push('S 缺画法（风格/光线/机位）');
  }

  // ---------- X 性别与数量 ----------
  if (/一位(男性|雄性)[^。，]{0,10}(少女|女孩|女子|学姐|女帝|女神)/.test(out)) flags.push('X 男性 + 女性称谓');
  if (/一位(女性|雌性)[^。，]{0,10}(少年|男子|公子|学长|剑客|男)/.test(out)) flags.push('X 女性 + 男性称谓');
  if (/(三个|三位|三人|两个|两位|两人|俩)/.test(text) && /^画面中央，?一位|^一位/.test(out) && !/(两|三|二|群|众)/.test(out.slice(0, 20))) {
    flags.push('X 多人输入却写成「一位」');
  }

  // ---------- C 随身道具 ----------
  const m = out.match(/随身带着([^。]*)/);
  if (m) {
    const items = m[1].split('，').map(function (s) { return s.trim(); }).filter(Boolean);
    if (items.length >= 5) flags.push('C 随身道具太多（' + items.length + ' 件：' + items.slice(0, 6).join('/') + '）');
    const bad = items.filter(function (s) { return ABSURD_CARRY.test(s); });
    if (bad.length) flags.push('C 不像能带在身上的：' + bad.join('/'));
    const dup = items.filter(function (s, i) { return items.indexOf(s) !== i; });
    if (dup.length) flags.push('C 道具重复：' + Array.from(new Set(dup)).join('/'));
  }
  // 同一个名词连着出现两次（「笔记本，笔记本」）
  if (/([^，。]{2,6})，\1/.test(out)) flags.push('C 相邻重复词');

  // ---------- E 年代 / 风格冲突 ----------
  if (/(民国|古风|唐|宋|明|清|汉服|襦裙|道袍|仙侠|侠客)/.test(text)
      && !/赛博|霓虹|机械/.test(text)
      && /(霓虹|赛博|全息|义体|机械臂|激光|LED)/.test(out)) {
    flags.push('E 年代冲突：古风输入出现霓虹/赛博词');
  }
  if (/(赛博|霓虹|机械)/.test(text) && /(古风|仙侠|祠堂|御花园)/.test(out)) flags.push('E 年代冲突：赛博输入出现古风词');

  // ---------- T 极端输入 ----------
  if (text.trim() && out.replace(/\s/g, '').length < 30) flags.push('T 输出过短（' + out.length + ' 字）');
  if (!text.trim() && out.length > 0) flags.push('T 空输入却有输出（' + out.length + ' 字）');
  if (/^\d{4}$/.test(text.trim()) && out.indexOf(text.trim()) < 0 && !/年代|旧|复古/.test(out)) flags.push('T 年份没被使用');
  if (/[\u{1F300}-\u{1FAFF}]/u.test(text) && out.length < 30) flags.push('T emoji 输入输出极短');
  if (text.length > 200 && out.length > 0 && !/少年|围巾|海边|灯塔|船/.test(out)) flags.push('T 超长输入的主体/细节丢了');

  return flags;
}

const wantDump = process.argv.indexOf('--dump') >= 0;
const rows = [];
const stat = {};

CASES.forEach(function (c) {
  const kind = c[0], text = c[1];
  DEPTHS.forEach(function (depth) {
    let r;
    try { r = analyze(text, depth); }
    catch (e) {
      rows.push({ kind: kind, text: text, depth: depth, flags: ['异常：' + e.message.split('\n')[0]], out: '' });
      return;
    }
    const flags = checks(kind, text, depth, r);
    flags.forEach(function (f) {
      const k = f.slice(0, 1) + f.slice(0, 2);
      stat[f.slice(0, 2)] = (stat[f.slice(0, 2)] || 0) + 1;
    });
    rows.push({ kind: kind, text: text, depth: depth, mode: r.mode, flags: flags, out: r.out, len: r.out.length });
  });
});

console.log('类 深度       模式        长度  输入');
console.log('-'.repeat(104));
rows.forEach(function (r) {
  console.log((r.flags.length ? '✗' : '○') + ' ' + r.kind + '  ' + (r.depth + '        ').slice(0, 9) +
    ' ' + (String(r.mode || '?') + '        ').slice(0, 9) +
    ' ' + String(r.len || 0).padStart(4) + '  ' + (r.text || '(空)').slice(0, 40).replace(/\n/g, '⏎'));
  r.flags.forEach(function (f) { console.log('      ⚠ ' + f); });
});

const bad = rows.filter(function (r) { return r.flags.length; });
console.log('\n== ' + rows.length + ' 次生成（' + CASES.length + ' 条 × ' + DEPTHS.length + ' 深度）中，有问题的 ' + bad.length + ' 次 ==');
Object.keys(stat).sort().forEach(function (k) { console.log('   ' + k + '  ' + stat[k]); });

if (wantDump) {
  console.log('\n\n===== 被标记条目的全文 =====');
  rows.filter(function (r) { return r.flags.length && r.depth === 'standard'; }).slice(0, 14).forEach(function (r) {
    console.log('\n【' + r.kind + '】' + (r.text || '(空)').slice(0, 60));
    console.log('  ' + (r.out || '(无输出)'));
    console.log('  ⚠ ' + r.flags.join(' / '));
  });
}
