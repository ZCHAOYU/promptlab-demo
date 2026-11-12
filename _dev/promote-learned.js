'use strict';
/* 晋升机制：影子池 → 闸门 → 正式库（2026-11-11）
   ============================================================
   现状（做这个之前）：
     第 3 层推理出来的词条只活在 `_dev/infer-cache.json` 和浏览器 localStorage 里，
     **永远进不了正式词库**。反馈按钮攒了 👍/👎 也没人用它。

   这里补上最后一段路：
     推理结果（影子池） + 反馈信号（👍/👎） → 五道闸门 → archive-learned.js

   五道闸门（照 _dev/learn-oov.js 的原型收敛成可执行的）：
     1 Schema   字段齐、长度/段数在范围内（和服务端校验同一套规则）
     2 重复     名字不能和正式库已有条目重名
     3 冲突     名字不能是已有条目的子串或父串（「工匠」 vs 「扎纸匠」会互相抢匹配）
     4 信号     至少 N 个 👍 且没有 👎；只有 👎 的直接淘汰
     5 自洽     该词条能被检测识别出来（inject 后 detectDimensions 必须命中它自己）
                —— 这一关最实在：能注入不等于能被用上
     6 合规     政治敏感 / 色情 / 暴力 / 违禁品 / 仇恨 / 真实人物 / 受保护 IP
                + 组合规则（未成年 + 性化 = 红线）
                —— 判据在 _dev/compliance-list.json，逻辑在 _dev/compliance-gate.js

   用法：
     node _dev/promote-learned.js            # 只报告，不写文件
     node _dev/promote-learned.js --write    # 过闸门的写进 archive-learned.js
     node _dev/promote-learned.js --min-up 2 # 要求至少 2 个 👍
     node _dev/promote-learned.js --only 扎纸匠 --write  # 只晋升指定的词（演示用）
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

const ARGV = process.argv.slice(2);
const WRITE = ARGV.includes('--write');
const MIN_UP = (function () {
  const i = ARGV.indexOf('--min-up');
  if (i >= 0 && ARGV[i + 1]) return Math.max(0, parseInt(ARGV[i + 1], 10) || 0);
  return 2;                       // 默认：至少 2 个 👍
})();
const ONLY = (function () {
  const i = ARGV.indexOf('--only');
  return (i >= 0 && ARGV[i + 1]) ? ARGV[i + 1] : null;
})();
// 输出路径可覆盖：测试用临时文件，避免污染正式库
const OUT = (function () {
  const i = ARGV.indexOf('--out');
  return (i >= 0 && ARGV[i + 1]) ? path.resolve(ROOT, ARGV[i + 1]) : path.join(ROOT, 'archive-learned.js');
})();

/* ---------- 1. 载入正式库（只读） ---------- */
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
  navigator: { userAgent: 'node-promote', clipboard: null, hardwareConcurrency: 4 },
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
require('./load-scripts').loadApp(ctx, {
  skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']
});
const G = (e) => vm.runInContext(e, ctx);

/* ---------- 2. 载入影子池 + 反馈 ---------- */
const CACHE = path.join(ROOT, '_dev', 'infer-cache.json');
const FEED = path.join(ROOT, '_dev', 'feedback.jsonl');


const shadow = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const votes = {};   // text -> {up, down, notes[]}
if (fs.existsSync(FEED)) {
  fs.readFileSync(FEED, 'utf8').split('\n').forEach(function (line) {
    if (!line.trim()) return;
    let r;
    try { r = JSON.parse(line); } catch (e) { return; }
    if (!r || !r.text) return;
    const k = String(r.text);
    votes[k] = votes[k] || { up: 0, down: 0, notes: [] };
    if (r.rating === 'up') votes[k].up++;
    else if (r.rating === 'down') { votes[k].down++; if (r.note) votes[k].notes.push(r.note); }
  });
}

/* ---------- 3. 五道闸门 ---------- */
const compliance = require('./compliance-gate');

const MAX_ITEMS = 3;
function itemCount(s) {
  const t = String(s || '').replace(/[、；;／/]+/g, '，');
  return t.split('，').map(function (x) { return x.trim(); }).filter(Boolean).length;
}

function gateSchema(e) {
  const bad = [];
  if (!e.subject || !e.short) bad.push('缺 subject/short');
  if (e.short && (e.short.length < 2 || e.short.length > 14)) bad.push('short 长度 ' + e.short.length);
  if (e.short && /[，,。；;]/.test(e.short)) bad.push('short 带标点');
  ['worn', 'outward', 'pose'].forEach(function (f) {
    const v = e[f];
    if (!v) return;
    if (v.length > 40) bad.push(f + ' 长度 ' + v.length);
    if (itemCount(v) > MAX_ITEMS) bad.push(f + ' 分了 ' + itemCount(v) + ' 段');
  });
  const paint = [e.worn, e.outward, e.pose].filter(Boolean).join('');
  if (paint.length < 18) bad.push('可画描述只有 ' + paint.length + ' 字');
  return bad;
}

function gateDup(e) {
  const bad = [];
  ['character', 'scene', 'style', 'lighting', 'composition', 'color', 'atmosphere'].forEach(function (dim) {
    if (G('!!(KW_DB[' + JSON.stringify(dim) + '] && KW_DB[' + JSON.stringify(dim) + '].categories[' + JSON.stringify(e.subject) + '])')) {
      bad.push('「' + e.subject + '」已在正式库的 ' + dim);
    }
  });
  return bad;
}

function gateConflict(e) {
  const bad = [];
  const names = G('Object.keys(KW_DB.character.categories)');
  names.forEach(function (n) {
    if (n === e.subject) return;
    if (n.indexOf(e.subject) >= 0 || e.subject.indexOf(n) >= 0) {
      bad.push('和已有条目「' + n + '」互相包含');
    }
  });
  return bad.slice(0, 3);
}

function gateSignal(text) {
  const v = votes[text] || { up: 0, down: 0, notes: [] };
  const bad = [];
  if (v.down > 0) bad.push('有 ' + v.down + ' 个 👎（' + v.notes.slice(0, 2).join('；') + '）');
  if (v.up < MIN_UP) bad.push('👍 只有 ' + v.up + ' 个，要求 ≥ ' + MIN_UP);
  return { bad: bad, votes: v };
}

function gateSelfConsistent(e, text) {
  // 注入后必须能被自己的检测认出来，否则「进了库也用不上」
  const bad = [];
  try {
    G('injectInferred(' + JSON.stringify(e) + ')');
    const hit = G('(function(){var d=detectDimensions(' + JSON.stringify(text) + ',"character");' +
      'return (d.character && d.character.detected) || ""})()');
    if (hit !== e.subject) {
      bad.push('注入后输入「' + text + '」识别成「' + (hit || '无') + '」，不是「' + e.subject + '」');
    }
    // 清理：只验证用，不让它留在 KW_DB 里影响下一轮
    G('delete KW_DB.character.categories[' + JSON.stringify(e.subject) + ']');
  } catch (err) {
    bad.push('自洽检查抛异常：' + err.message);
  }
  return bad;
}

/* ---------- 4. 跑一遍 ---------- */
const rows = [];
Object.keys(shadow).forEach(function (key) {
  const rec = shadow[key];
  const data = rec && rec.data;
  if (!data) return;
  const text = key.indexOf('|') >= 0 ? key.slice(key.indexOf('|') + 1) : key;
  if (ONLY && data.subject !== ONLY && text !== ONLY) return;
  if (data.type !== 'character') return;   // 本版只晋升人物词条（场景/道具另说）

  const sig = gateSignal(text);
  const g = {
    '1 Schema': gateSchema(data),
    '2 重复': gateDup(data),
    '3 冲突': gateConflict(data),
    '4 信号': sig.bad,
    '6 合规': compliance.gateCompliance(data),
  };
  // 自洽关放到最后：只有前面都过了才值得花时间注入
  const earlierBad = Object.keys(g).some(function (k) { return g[k].length; });
  g['5 自洽'] = earlierBad ? ['（前四关没过，跳过）'] : gateSelfConsistent(data, text);

  const ok = !Object.keys(g).some(function (k) {
    return g[k].length && k !== '5 自洽';
  }) && !g['5 自洽'].length;

  rows.push({ key: key, text: text, subject: data.subject, data: data, gates: g, ok: ok, votes: sig.votes });
});

const pass = rows.filter(function (r) { return r.ok; });

console.log('=== 影子池里的词条：' + rows.length + ' 条（人物类） ===');
console.log('=== 闸门：Schema / 重复 / 冲突 / 信号(👍≥' + MIN_UP + ' 且 0 个 👎) / 自洽 / 合规 ===\n');
rows.forEach(function (r) {
  const mark = r.ok ? '✅' : '✗ ';
  console.log(mark + ' ' + r.subject + '  （原文：' + r.text + '  👍' + r.votes.up + ' 👎' + r.votes.down + '）');
  Object.keys(r.gates).forEach(function (k) {
    if (r.gates[k].length) console.log('     ✗ ' + k + '：' + r.gates[k].join(' / '));
  });
});

console.log('\n通过 ' + pass.length + ' 条');
if (pass.length) console.log('   ' + pass.map(function (r) { return r.subject; }).join('、'));

if (!WRITE) {
  console.log('\n（只是报告。要写进 archive-learned.js 加 --write）');
  process.exit(0);
}

/* ---------- 5. 写正式库 ---------- */
const out = {};
const now = new Date();
pass.forEach(function (r) {
  out[r.subject] = Object.assign({}, r.data, {
    _promoted: {
      at: now.toISOString().slice(0, 10),
      from: r.text,
      up: r.votes.up,
      down: r.votes.down,
      gates: 'schema/dup/conflict/signal/self-consistent'
    }
  });
});

const header = '/* ============================================================\n' +
' * archive-learned.js —— 晋升机制产物（**生成文件，不要手改**）\n' +
' * ------------------------------------------------------------\n' +
' * 来源：第 3 层推理词条（影子池 _dev/infer-cache.json）\n' +
' *      + 用户反馈（_dev/feedback.jsonl 里的 👍/👎）\n' +
' * 门槛：五道闸门（Schema / 重复 / 冲突 / 信号 / 自洽）全过\n' +
' * 生成：node _dev/promote-learned.js --write\n' +
' * 生成时间：' + now.toISOString() + '\n' +
' * 本次晋升：' + pass.length + ' 条\n' +
' *\n' +
' * 为什么单独一个文件而不是改 data-kwdb.js：\n' +
' *   推理词条是「用出来的」，来源和正式词库不同，混在一起就没法回溯\n' +
' *   （哪条是人工编的、哪条是模型补的、补的依据是什么）。\n' +
' *   单独一层，出问题可以整层删掉回到原状。\n' +
' * ============================================================ */\n' +
'window.__LEARNED = ' + JSON.stringify(out, null, 2) + ';\n' +
'window.__LEARNED_META = ' + JSON.stringify({
  generatedAt: now.toISOString(),
  count: pass.length,
  minUp: MIN_UP
}, null, 2) + ';\n';

fs.writeFileSync(OUT, header, 'utf8');
console.log('\n已写入 archive-learned.js（' + pass.length + ' 条，' + header.length + ' 字节）');
console.log('记得同步 index.html 里的 ?v= 缓存戳。');
