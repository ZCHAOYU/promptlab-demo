'use strict';
/* 补跑失败的拆分（解析失败 = 模型返回了空内容或非 JSON） */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';

/* 读原始 detail：不加载 archive-fix，避免又被过滤 */
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
  fetch: async () => { throw new Error('x'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const origMap = JSON.parse(vm.runInContext(
  '(function(){var o={};var c=KW_DB.character.categories;' +
  'for(var k in c){var d=c[k].zh&&c[k].zh.detail;if(d)o[k]=d;}return JSON.stringify(o);})()', ctx));

const P = path.join(__dirname, 'archive-split.json');
const data = JSON.parse(fs.readFileSync(P, 'utf8'));
const bad = data.filter(function (x) { return !(x.worn || x.carries); });
console.log('需补跑:', bad.length);

async function split(name, detail) {
  const prompt =
    '把下面这组「角色装备与服饰」拆成两类，只输出 JSON。\n' +
    '条目：' + name + '\n原文：' + detail + '\n\n' +
    'worn = 穿在身上、戴在头上、系在腰间、佩戴的衣物护甲饰品，以及身体本身的部位（羽翼、爪、鳞片）\n' +
    'carries = 拿在手里、背在背上、装在包里的器具物件\n' +
    '抽象属性（敏捷、智慧、光环）两类都不要\n\n' +
    '输出格式（不要代码块、不要解释）：{"worn":"...","carries":"..."}\n' +
    '保留原文用词。';

  for (let attempt = 0; attempt < 3; attempt++) {
    const resp = await fetch(BASE + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 900
      })
    });
    if (!resp.ok) continue;
    const j = await resp.json();
    const txt = ((j.choices || [])[0] || {}).message?.content || '';
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        const o = JSON.parse(m[0]);
        if (o.worn || o.carries) return { worn: String(o.worn || '').trim(), carries: String(o.carries || '').trim() };
      } catch (e) {}
    }
  }
  return null;
}

(async () => {
  if (!KEY) { console.log('缺少 key'); process.exit(1); }
  let ok = 0;
  for (const it of bad) {
    const detail = origMap[it.name] || it.orig || '';
    if (!detail) continue;
    const r = await split(it.name, detail);
    if (r) {
      it.worn = r.worn; it.carries = r.carries; delete it.error;
      ok++;
      console.log('✓ ' + it.name + ' | 穿:' + (r.worn || '-') + ' | 带:' + (r.carries || '-'));
    } else {
      console.log('✗ ' + it.name);
    }
  }
  fs.writeFileSync(P, JSON.stringify(data, null, 2), 'utf8');
  const still = data.filter(function (x) { return !(x.worn || x.carries); }).length;
  console.log('\n补成功 ' + ok + '，仍缺 ' + still + ' / ' + data.length);
})();
