'use strict';
/* extractUserPose 专项测试：从用户输入里摘动作片段时，
   1. 不许两段来自同一处文字（会拼出「抱着玩偶坐在空荡的房，坐在空荡的房间里」）
   2. 不许把词截断（「空荡的房」少了「里」）
   3. 不许同一段在结果里出现两次
   用法：node _dev/verify-pose-extract.js */
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

const CASES = [
  '暗黑系病娇女，黑长直，抱着玩偶坐在空荡的房间里',
  '一位少女在东京现代街头手里拿着咖啡和一位朋友并行逛着街',
  '一位老人坐在长椅上',
  '少年抱着剑站在雪山之巅',
  '女子蹲在屋檐上望着远处',
  '少女躺在草地上晒太阳',
  '手里拿着剑，缓缓走向门口',
  '红衣女帝，金冠高髻，坐于大殿龙椅之上',
  '一位剑客',
  '牵着马走在雨后的土路上',
  '端着茶杯倚在窗边',
  '背着重剑踏过雪原'
];

const PUNC = /[，。；、,!?]/;

function extract(t) {
  return vm.runInContext('extractUserPose(' + JSON.stringify(t) + ')', ctx);
}

let bad = 0;
for (const t of CASES) {
  const got = extract(t);
  const problems = [];
  if (got) {
    const parts = String(got).split('，').filter(Boolean);
    // 2. 同一段出现两次
    if (new Set(parts).size !== parts.length) problems.push('结果里有重复片段');
    // 1. 两段在原文里重叠
    const spans = [];
    parts.forEach(function (p) {
      let from = 0, idx = -1;
      while ((idx = t.indexOf(p, from)) >= 0) {
        if (!spans.some(s => Math.min(idx + p.length, s.e) > Math.max(idx, s.s))) {
          spans.push({ s: idx, e: idx + p.length, p: p });
          return;
        }
        from = idx + 1;
      }
      // 找不到不重叠的位置 → 说明和别的片段抢了同一段文字
      problems.push(`「${p}」和别的片段叠在同一处`);
    });
    // 3. 截断：片段结束处既不是标点也不是句子结尾
    parts.forEach(function (p) {
      let idx = t.indexOf(p);
      if (idx < 0) return;
      const end = idx + p.length;
      if (end < t.length && !PUNC.test(t[end])) {
        problems.push(`「${p}」被截断（后面还有「${t.slice(end, end + 2)}」）`);
      }
    });
  }
  const ok = problems.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} 「${t}」`);
  console.log(`    → ${got === null ? '（无片段）' : '「' + got + '」'}`);
  problems.forEach(p => console.log(`    ⚠ ${p}`));
}
console.log(`\n== 通过 ${CASES.length - bad} / ${CASES.length} ==`);
process.exit(bad ? 1 : 0);
