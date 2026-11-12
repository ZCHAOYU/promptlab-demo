'use strict';
/* 验收：打包产物能不能用（在**包目录**里跑，不碰源码目录）。
   用法：node _dev/verify-dist.js dist/PromptLab-V5.32
   检查：
     1 index.html 引用的每个本地文件都存在
     2 按 index.html 的顺序把脚本跑起来（vm），三种模式各生成一条，断言非空 + 关键内容在
     3 包里没有 config.local.js、没有真实 key
     4 包里没有 _dev 脚本（只允许 _dev/compliance-list.json）
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = path.resolve(process.argv[2] || 'dist/PromptLab-V5.32');
let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } }

if (!fs.existsSync(DIR)) { console.error('目录不存在：' + DIR); process.exit(1); }
console.log('验收目录：' + DIR);

/* ---- 1. 清单完整性 ---- */
console.log('\n=== 1. index.html 引用的文件都在 ===');
const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
  .map(function (m) { return m[1].split('?')[0].split('#')[0]; })
  .filter(function (u) { return !/^https?:|^data:/i.test(u); });
const missing = refs.filter(function (f) {
  /* config.local.js 故意不打包：里面有明文 key。
     页面引用它只是为了「本地联调有 key 时能读到」，没有时服务端会 404，
     前端自动走服务端代理，功能不退化（这也是默认状态）。 */
  if (f === 'config.local.js') return false;
  return !fs.existsSync(path.join(DIR, f));
});
ok(!missing.length, refs.length + ' 个引用文件都在（config.local.js 故意不带）' +
  (missing.length ? '（缺：' + missing.join(', ') + '）' : ''));

/* ---- 2. 在包目录里真的跑一遍 ---- */
console.log('\n=== 2. 脚本能加载、能生成 ===');
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
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
  console: { log() { }, warn() { }, error() { }, info() { } },
  document: doc, navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() { }, removeItem() { } },
  sessionStorage: { getItem() { return null; }, setItem() { }, removeItem() { } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('offline'); },
  alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://127.0.0.1:8777/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() { }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);

const loaded = [];
try {
  for (const f of refs) {
    if (!/\.js$/.test(f)) continue;
    if (f === 'config.local.js') continue;           // 包里故意没有这个文件
    const src = fs.readFileSync(path.join(DIR, f), 'utf8');
    vm.runInContext(src, ctx, { filename: f });
    loaded.push(f);
  }
  ok(loaded.length >= 10, loaded.length + ' 个脚本加载成功');
} catch (e) {
  ok(false, '脚本加载失败：' + String(e && e.message).split('\n')[0]);
}

function gen(text, mode, depth) {
  return vm.runInContext(`(function(){
    var t=${JSON.stringify(text)};
    var d=detectDimensions(t,${JSON.stringify(mode)});
    currentMode=inferSubjectType(t,d);
    var f=smartFill(d,t);
    var o=buildOptimizedPrompt(t,f,${JSON.stringify(depth)},d);
    return (typeof o==='string')?o:(o&&o.optimized)||'';
  })()`, ctx);
}

const CASES = [
  ['一位科学家，实验室', 'character', 'standard', '随身带着'],
  ['废弃的教堂，藤蔓爬满石墙', 'scene', 'standard', '教堂'],
  ['一把生锈的长剑，插在石头上', 'prop', 'standard', '长剑']
];
CASES.forEach(function (c) {
  let out = '';
  try { out = String(gen(c[0], c[1], c[2])); } catch (e) { out = ''; }
  ok(out.length > 30 && out.indexOf(c[3]) >= 0,
    '「' + c[0] + '」→ ' + out.length + ' 字' + (out.indexOf(c[3]) >= 0 ? '' : '（缺关键词「' + c[3] + '」）'));
  if (process.env.SHOW_OUT === '1') console.log('     ' + out.slice(0, 120) + '…');
});

/* ---- 3. 不能带 key ---- */
console.log('\n=== 3. 包里没有 secret ===');
ok(!fs.existsSync(path.join(DIR, 'config.local.js')), '没有 config.local.js');
const REAL_KEY = /sk-[A-Za-z0-9]{20,}/;
let leaked = [];
(function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { scan(f); continue; }
    if (!/\.(js|md|txt|bat|json|py)$/i.test(e.name)) continue;
    let t = '';
    try { t = fs.readFileSync(f, 'utf8'); } catch (err) { continue; }
    if (REAL_KEY.test(t)) leaked.push(path.relative(DIR, f));
  }
})(DIR);
ok(!leaked.length, '没有真实 key' + (leaked.length ? '（在：' + leaked.join(', ') + '）' : ''));

/* ---- 4. 不带开发脚本 ---- */
console.log('\n=== 4. 不带开发目录/脚本 ===');
const devDir = path.join(DIR, '_dev');
const devFiles = fs.existsSync(devDir) ? fs.readdirSync(devDir) : [];
ok(devFiles.every(function (f) { return f === 'compliance-list.json'; }),
  '包内 _dev 只有运行时数据' + (devFiles.length ? '（实际：' + devFiles.join(', ') + '）' : ''));
ok(!fs.existsSync(path.join(DIR, '_archive')), '没有 _archive');
ok(!fs.existsSync(path.join(DIR, '开发日志-2026-11-09.md')), '没有内部开发日志');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
