/* 随机压力测试：在桩 DOM 里加载真实的 translations / smart-engine / data-kwdb / app.js，
   然后跑 N 次随机生成，用规则检查矛盾，输出统计。

   用法：node random-stress.js [次数]
*/
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const N = parseInt(process.argv[2] || '20', 10);

/* ---------------- 桩 DOM ---------------- */
function mkEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    style: {}, dataset: {}, children: [], _h: {},
    value: '', textContent: '', innerHTML: '', checked: false, disabled: false,
    id: '', className: '', placeholder: '',
    classList: {
      add() {}, remove() {}, toggle() {}, contains() { return false; }
    },
    addEventListener(e, f) { this._h[e] = f; },
    removeEventListener() {},
    appendChild(c) { this.children.push(c); return c; },
    removeChild() {}, insertBefore(c) { return c; },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] == null ? null : this[k]; },
    removeAttribute() {},
    querySelector() { return mkEl('div'); },
    querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, blur() {}, click() {}, scrollIntoView() {}
  };
  return el;
}

const doc = {
  readyState: 'complete',
  body: mkEl('body'),
  head: mkEl('head'),
  documentElement: mkEl('html'),
  getElementById() { return mkEl('div'); },
  querySelector() { return mkEl('div'); },
  querySelectorAll() { return []; },
  createElement(t) { return mkEl(t); },
  createTextNode() { return mkEl('span'); },
  addEventListener() {},
  removeEventListener() {},
  execCommand() { return true; }
};

const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
  document: doc,
  navigator: { userAgent: 'node', clipboard: { writeText: async () => {} }, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('no network in test'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://localhost/', search: '', hash: '' },
  CustomEvent: function () {},
  Event: function () {},
  requestAnimationFrame(cb) { return setTimeout(cb, 0); },
  cancelAnimationFrame() {},
  URL: global.URL, URLSearchParams: global.URLSearchParams
};
ctx.window = ctx;
ctx.globalThis = ctx;
ctx.self = ctx;
vm.createContext(ctx);

/* ---------------- 载入真实代码 ---------------- */
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'archive-slots.js','archive-fix.js','app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  try {
    vm.runInContext(src, ctx, { filename: f });
    console.log('载入 OK   ' + f);
  } catch (e) {
    console.log('载入 FAIL ' + f + '：' + e.message.split('\n')[0]);
    process.exit(1);
  }
}

const g = (name) => vm.runInContext('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined', ctx);

const fnRandomMix = g('randomMix');
const fnBuild = g('buildOptimizedPrompt');
const fnSmartFill = g('smartFill');
const fnDetect = g('detectDimensions');
const KW_DB = g('KW_DB');
const STYLE_SCENE = g('STYLE_SCENE_COMPAT');

console.log('\n函数可用性:');
console.log('  randomMix            ' + (typeof fnRandomMix === 'function'));
console.log('  detectDimensions     ' + (typeof fnDetect === 'function'));
console.log('  smartFill            ' + (typeof fnSmartFill === 'function'));
console.log('  buildOptimizedPrompt ' + (typeof fnBuild === 'function'));
console.log('  KW_DB                ' + (!!KW_DB));
console.log('  STYLE_SCENE_COMPAT   ' + (!!STYLE_SCENE));

if (typeof fnDetect !== 'function' || typeof fnSmartFill !== 'function' || typeof fnBuild !== 'function') {
  console.log('\n无法直接调用内部函数（可能被包裹在 IIFE 里），改用另一种策略。');
  process.exit(2);
}

/* ---------------- 矛盾检查 ---------------- */
const FEM_WORDS = ['娇美', '柔美', '红润', '长发', '裙摆', '舞裙', '裙装', '妩媚', '婀娜', '清丽', '闺秀', '公主'];
const MALE_WORDS = ['强壮', '硬汉', '魁梧', '刚毅', '胡茬', '络腮'];

function checkCase(fills, text) {
  const issues = [];

  // 1) 性别 × 外貌
  if (fills.gender === '男性' && FEM_WORDS.some(w => text.includes(w))) issues.push('男性+女性化描写');
  if (fills.gender === '女性' && MALE_WORDS.some(w => text.includes(w))) issues.push('女性+男性化描写');

  // 2) 风格 × 场景（用表里的兼容关系）
  if (STYLE_SCENE && fills.style && fills.scene) {
    const ok = STYLE_SCENE[fills.style];
    if (Array.isArray(ok) && ok.length && !ok.includes(fills.scene)) issues.push('风格×场景不兼容');
  }

  // 3) 动词重复
  const V = ['手持', '身着', '身穿', '展开'];
  for (const v of V) {
    const c = (text.match(new RegExp(v, 'g')) || []).length;
    if (c > 1) issues.push('动作重复:' + v + '×' + c);
  }

  // 4) 多个主体
  const subjects = (text.match(/一位/g) || []).length;
  if (subjects > 1) issues.push('多个"一位"主体×' + subjects);

  // 5) 维度过多（只数 13 个决策维度；platform 是平台参数，不算）
  const DIMS13 = ['character', 'gender', 'scene', 'style', 'lighting', 'color', 'atmosphere',
    'composition', 'quality', 'material', 'texture', 'display', 'background'];
  const dimCount = DIMS13.filter(k => fills[k] && typeof fills[k] === 'string').length;
  if (dimCount > 8) issues.push('维度过多:' + dimCount);

  return { issues, text, dimCount };
}

/* ---------------- 跑 N 次随机 ---------------- */
console.log('\n开始 ' + N + ' 次随机生成…\n');

const SAMPLES = [
  '一位手持法杖的魔法师', '一位目光深邃的老者', '一位漂浮在空中的仙子',
  '一位身披铠甲的武士', '一位戴着面具的刺客', '一位优雅的精灵女王',
  '一位眼神坚定的少女', '一位霸气侧漏的将军', '一个神秘的角色站在画面中央'
];

let bad = 0;
const allIssues = {};
const rows = [];

for (let i = 0; i < N; i++) {
  const text = SAMPLES[i % SAMPLES.length];
  let out = null;
  try {
    const detection = fnDetect(text, 'character');
    const fills = fnSmartFill(detection, text);
    const r = fnBuild(text, fills, 'deep', detection);
    out = typeof r === 'string' ? r : (r && r.optimized) || '';
    const res = checkCase(fills, out);
    if (res.issues.length) bad++;
    res.issues.forEach(x => { allIssues[x.split(':')[0].split('×')[0]] = (allIssues[x.split(':')[0].split('×')[0]] || 0) + 1; });
    rows.push({ i: i + 1, text, dimCount: res.dimCount, issues: res.issues, out });
    console.log('#' + String(i + 1).padStart(2) + ' ' + (res.issues.length ? '✗' : '✓') +
      '  维度' + res.dimCount + '  ' + (res.issues.join(' / ') || '无矛盾'));
    if (res.issues.length) console.log('     ' + out.slice(0, 150));
  } catch (e) {
    bad++;
    console.log('#' + String(i + 1).padStart(2) + ' ×  运行异常：' + e.message.split('\n')[0]);
  }
}

console.log('\n================ 结果 ================');
console.log('总次数 ' + N + '　有矛盾 ' + bad + '　矛盾率 ' + Math.round(bad / N * 100) + '%');
console.log('按类型：', Object.keys(allIssues).length ? JSON.stringify(allIssues) : '无');
fs.writeFileSync(path.join(__dirname, 'random-stress-result.json'),
  JSON.stringify({ n: N, bad, rate: bad / N, byType: allIssues, rows }, null, 2), 'utf8');
console.log('明细已写入 _dev/random-stress-result.json');
