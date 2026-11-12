'use strict';
/* 生成 archive-style-defaults.js —— 风格默认值的唯一数据源。
   ------------------------------------------------------------
   数据来源两处：
     1. app.js 里现有的两套表（163 键 + 83 键），合并去重
     2. _dev/style-maps.json（新补的 160 个风格）
   每一对都要过一遍校验：值必须在该维度的池子里。
   输出格式：
     window.__STYLE_DEFAULTS = { lighting:{...}, color:{...}, atmosphere:{...}, scene:{...} };
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

// ---- 1. 抠出 app.js 里现有的表 ----
function parseTables(src, name) {
  const re = new RegExp('const ' + name + ' = \\{([\\s\\S]*?)\\n( +)\\};', 'g');
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    const pairs = m[1].match(/'([^']+)'\s*:\s*'([^']+)'/g) || [];
    const obj = {};
    pairs.forEach(function (p) {
      const mm = p.match(/^'([^']+)'\s*:\s*'([^']+)'$/);
      if (mm) obj[mm[1]] = mm[2];
    });
    out.push({ line: src.slice(0, m.index).split('\n').length, obj: obj });
  }
  return out;
}

// ---- 2. 取池子做校验 ----
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

const styles = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(KW_DB.style.categories))', ctx));
const POOLS = {};
[['lighting', 'lighting'], ['color', 'color'], ['atmosphere', 'atmosphere'], ['scene', 'scene']].forEach(function ([d]) {
  POOLS[d] = new Set(JSON.parse(vm.runInContext(`JSON.stringify(Object.keys(KW_DB.${d}.categories))`, ctx)));
});

// ---- 3. 合并 ----
const merged = { lighting: {}, color: {}, atmosphere: {}, scene: {} };
const conflicts = [];

const TABLE_OF = {
  lighting: 'lightingByStyle',
  color: 'colorByStyle',
  atmosphere: 'atmoByStyle',
  scene: 'sceneByStyle'
};

/* 基线优先级（后面的覆盖前面的）：
     1. 已有的 archive-style-defaults.js —— 这是权威基线。
        app.js 里的表在重构后已经删空了，只读它会丢数据
        （第一次跑就踩了：scene 从 163 个键变成 0 个）。
     2. app.js 里的旧表 —— 兼容这种表还存在的老版本。
     3. style-maps.json / style-candidates.json —— 新生成的。 */
const OUT_FILE = path.join(ROOT, 'archive-style-defaults.js');
if (fs.existsSync(OUT_FILE)) {
  const vm = require('vm');
  const bctx = { console: { log() {}, warn() {} } };
  bctx.window = bctx; bctx.globalThis = bctx; bctx.self = bctx;
  vm.createContext(bctx);
  vm.runInContext(fs.readFileSync(OUT_FILE, 'utf8'), bctx, { filename: 'archive-style-defaults.js' });
  const base = bctx.window.__STYLE_DEFAULTS || {};
  let n = 0;
  Object.keys(merged).forEach(function (dim) {
    const m = base[dim] || {};
    Object.keys(m).forEach(function (k) { merged[dim][k] = m[k]; n++; });
  });
  console.log(`基线：已有 archive-style-defaults.js，读入 ${n} 条`);
}

Object.keys(TABLE_OF).forEach(function (dim) {
  const sets = parseTables(SRC, TABLE_OF[dim]);
  sets.forEach(function (t) {
    Object.keys(t.obj).forEach(function (k) {
      const v = t.obj[k];
      const cur = merged[dim][k];
      if (cur && cur !== v) {
        conflicts.push(`${dim}/${k}: '${JSON.stringify(cur)}' vs '${v}'（保留后者）`);
      }
      merged[dim][k] = v;
    });
  });
});

// ---- 4. 并入新数据 ----
const genPath = path.join(__dirname, 'style-maps.json');
const gen = fs.existsSync(genPath) ? JSON.parse(fs.readFileSync(genPath, 'utf8')) : {};
let added = 0;
Object.keys(gen).forEach(function (s) {
  ['lighting', 'color', 'atmosphere'].forEach(function (dim) {
    const v = gen[s][dim];
    if (!merged[dim][s]) { merged[dim][s] = v; added++; }
  });
});

// ---- 4.5 覆盖成候选集 ----
// 有候选的风格，把单值换成数组（app.js 的 styleDefault 会从数组里抽一个）。
// 没有候选的保持字符串 —— 向后兼容，抽不到数组就按单值用。
const candPath = path.join(__dirname, 'style-candidates.json');
const cand = fs.existsSync(candPath) ? JSON.parse(fs.readFileSync(candPath, 'utf8')) : {};
let candCount = 0;
Object.keys(cand).forEach(function (s) {
  ['lighting', 'color', 'atmosphere'].forEach(function (dim) {
    const arr = cand[s][dim];
    if (!Array.isArray(arr)) return;
    const clean = Array.from(new Set(arr.map(x => String(x || '').trim()).filter(Boolean)));
    if (clean.length < 2) return;
    merged[dim][s] = clean.slice(0, 3);
    candCount++;
  });
});

// ---- 5. 校验 ----
const bad = [];
Object.keys(merged).forEach(function (dim) {
  Object.keys(merged[dim]).forEach(function (k) {
    const v = merged[dim][k];
    const vals = Array.isArray(v) ? v : [v];
    if (!vals.length) bad.push(`${dim}/${k} → 空数组`);
    vals.forEach(function (x) {
      if (!POOLS[dim].has(x)) bad.push(`${dim}/${k} → '${x}' 不在池子里`);
    });
  });
});
console.log(`合并结果：`);
Object.keys(merged).forEach(function (dim) {
  const keys = Object.keys(merged[dim]);
  const inLib = keys.filter(k => styles.indexOf(k) >= 0).length;
  const arrKeys = keys.filter(k => Array.isArray(merged[dim][k]));
  const arrLen = arrKeys.length
    ? (arrKeys.reduce((n, k) => n + merged[dim][k].length, 0) / arrKeys.length).toFixed(1) : '0';
  console.log(`  ${dim.padEnd(12)} ${keys.length} 个键（${inLib} 个真实风格），` +
    `${arrKeys.length} 个是候选集，平均 ${arrLen} 个候选`);
});
console.log(`  单值新并入 ${added} 条，候选集覆盖 ${candCount} 条`);
if (conflicts.length) {
  console.log(`\n两套旧表不一致 ${conflicts.length} 处：`);
  conflicts.slice(0, 10).forEach(c => console.log('  ' + c));
}
if (bad.length) {
  console.log(`\n✗ 脏值 ${bad.length} 条，不生成：`);
  bad.slice(0, 20).forEach(b => console.log('  ' + b));
  process.exit(1);
}
console.log('✓ 所有值都在池子里');

// ---- 6. 写文件 ----
const body = JSON.stringify(merged);
const js = '/* 风格默认值 —— 由 _dev/gen-style-defaults.js 生成\n' +
  '   作用：用户只写了风格、没写光线/色彩/氛围/场景时，按风格补一个协调的默认值。\n' +
  '   为什么单独成文件：320+ 个风格 × 4 个维度，写在 app.js 里既难维护也会跟\n' +
  '   别处的同名表漂开（原来就有 163 键和 83 键两套，同一个风格两处结果不同）。\n' +
  '   撤销：删掉 index.html 里的这个 script 标签即可，app.js 会退回硬编码兜底。 */\n' +
  '(function () {\n' +
  '  if (typeof window === "undefined") return;\n' +
  '  window.__STYLE_DEFAULTS = ' + body + ';\n' +
  '})();\n';
const OUT = path.join(ROOT, 'archive-style-defaults.js');
fs.writeFileSync(OUT, js, 'utf8');
console.log(`\n✓ 已写出 ${OUT}（${(fs.statSync(OUT).size / 1024).toFixed(1)} KB）`);
