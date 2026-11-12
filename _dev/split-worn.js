'use strict';
/* 把角色「服饰」字段拆成 worn（穿戴）/ carries（随身物）
   用法：$env:DEEPSEEK_API_KEY=... ; node _dev/split-worn.js --limit 256
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';
const LIMIT = parseInt((process.argv.indexOf('--limit') >= 0 ? process.argv[process.argv.indexOf('--limit') + 1] : '20'), 10);

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
// 注意：这里**不能**加载 archive-fix.js —— 它会先把随身物删掉，拆分就拿不到原始数据
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js', 'archive-detail.js', 'app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}

const roles = vm.runInContext(
  '(function(){var out=[];var cats=KW_DB.character.categories;' +
  'for(var k in cats){var d=cats[k].zh&&cats[k].zh.detail;if(d)out.push({name:k,detail:d});}' +
  'return JSON.stringify(out);})()', ctx);
const list = JSON.parse(roles).slice(0, LIMIT);
console.log('待拆分:', list.length, '条');

async function split(item) {
  const prompt =
    '把下面这组「角色装备与服饰」描述拆成两类。\n' +
    '条目：' + item.name + '\n' +
    '原文：' + item.detail + '\n\n' +
    '分类标准：\n' +
    '- worn：穿在身上、戴在头上、系在腰间、佩戴在身上的东西（衣服、鞋帽、护甲、面具、披风、腰带、饰品等）\n' +
    '- carries：拿在手里、背在背上、装在包里的器具物件（工具、相机、图纸、武器、书籍、仪器、容器等）\n' +
    '- 身体本身的部位（羽翼、爪、鳞片）归 worn\n' +
    '- 抽象属性（敏捷、智慧）丢弃，两类都不放\n\n' +
    '只输出 JSON，格式：{"worn":"用中文逗号分隔","carries":"用中文逗号分隔"}\n' +
    '不要输出解释、代码块符号或多余文字。保留原文用词，不要改写。';

  const resp = await fetch(BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 600
    })
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const j = await resp.json();
  const txt = ((j.choices || [])[0] || {}).message?.content || '';
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) return { worn: '', carries: '', raw: txt.slice(0, 60) };
  const o = JSON.parse(m[0]);
  return { worn: String(o.worn || '').trim(), carries: String(o.carries || '').trim() };
}

(async () => {
  if (!KEY) { console.log('缺少 DEEPSEEK_API_KEY'); process.exit(1); }
  const out = [];
  let tin = 0, tout = 0;
  for (const it of list) {
    try {
      const r = await split(it);
      out.push({ name: it.name, orig: it.detail, worn: r.worn, carries: r.carries });
      console.log('✓ ' + it.name + ' | 穿:' + (r.worn || '（空）') + ' | 带:' + (r.carries || '（空）'));
      if (!r.worn && !r.carries) console.log('   ⚠ 解析失败: ' + (r.raw || ''));
    } catch (e) {
      out.push({ name: it.name, orig: it.detail, worn: '', carries: '', error: e.message });
      console.log('✗ ' + it.name + ' → ' + e.message);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'archive-split.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('\n完成', out.length, '条 → _dev/archive-split.json');
})();
