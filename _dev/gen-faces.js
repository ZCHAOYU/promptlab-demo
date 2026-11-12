'use strict';
/* 为每个角色生成 3 组「面容/表情」变体，对应日常/行动/静谧三种情境
   解决「同一角色的脸永远一样」的问题。
   用法：node _dev/gen-faces.js --limit 256
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';
const LIMIT = parseInt((process.argv.indexOf('--limit') >= 0 ? process.argv[process.argv.indexOf('--limit') + 1] : '5'), 10);

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

const roles = JSON.parse(vm.runInContext(
  '(function(){var o=[];var c=KW_DB.character.categories;' +
  'for(var k in c){var z=c[k].zh||{};if(z.core)o.push({name:k,core:z.core,face:z.face||""});}' +
  'return JSON.stringify(o);})()', ctx));

const ONLY = (function () {
  // --only 女帝,旗袍美人   只补指定的几个（配合 --merge 追加，不覆盖已生成的）
  const i = process.argv.indexOf('--only');
  if (i < 0) return null;
  return String(process.argv[i + 1] || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
})();
const MERGE = process.argv.indexOf('--merge') >= 0;
const list = ONLY
  ? roles.filter(r => ONLY.indexOf(r.name) >= 0)
  : roles.slice(0, LIMIT);
console.log('待生成面容变体:', list.length, '个角色', ONLY ? '（指定）' : '');

async function gen(role) {
  const prompt =
    '为角色「' + role.name + '」（' + role.core + '）写 3 组不同的「面容与表情」描写。\n\n' +
    '三组分别对应三种情境：\n' +
    '- daily  平静日常：神情放松、可以带笑意，不紧张\n' +
    '- action 行动中：专注、绷紧、眼神锐利，有张力\n' +
    '- quiet  静谧独处：情绪内敛、低垂、放空、疲倦\n\n' +
    '硬性要求：\n' +
    '1) 每组只写 2 到 3 个短句，中文逗号分隔，总长 20 到 40 字；\n' +
    '2) 只写面部与表情（眉眼、目光、神态、唇、气色、汗、泪光、疤痕、皱纹等），不要写服饰；\n' +
    '3) **必须体现这个角色独有的身份与经历**：\n' +
    '   · 女帝要写出威仪收敛后的疲态或审视，刺客要写出警觉与压住的杀意，\n' +
    '     乞丐要写出落魄与清醒，机器人要写出非人的机械感与微光；\n' +
    '4) **严禁使用这些套话**：眉眼舒展、唇角浅笑、目光温和、神情松弛、气色温润、\n' +
    '   目光柔和、面带笑意、神情放松、神态从容（用了就算不合格）；\n' +
    '5) 三组之间必须是三种不同的情绪状态，不能只是换形容词；\n' +
    '6) 不要重复角色名，不要以「他/她/这个角色」开头；\n' +
    '7) **只用一个领域**：如果这个角色本身没有明确领域（少女、少年、旅人、老人…），\n' +
    '   就只写普通人的面部状态，不许出现宫廷（御前/朝议/诏令）、机械（面甲/散热/指示灯/义眼）、\n' +
    '   法术、战场、宗教等任何专属领域的词；\n' +
    '8) 不要输出解释、代码块或多余文字。\n\n' +
    '只输出 JSON：{"daily":"...","action":"...","quiet":"..."}';

  for (let attempt = 0; attempt < 3; attempt++) {
    const resp = await fetch(BASE + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 3000
      })
    });
    if (!resp.ok) continue;
    const j = await resp.json();
    const txt = ((j.choices || [])[0] || {}).message?.content || '';
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) continue;
    try {
      const o = JSON.parse(m[0]);
      if (o.daily || o.action || o.quiet) {
        return { daily: (o.daily || '').trim(), action: (o.action || '').trim(), quiet: (o.quiet || '').trim() };
      }
    } catch (e) {}
  }
  return null;
}

(async () => {
  if (!KEY) { console.log('缺少 key'); process.exit(1); }
  const OUT = path.join(__dirname, 'role-faces.json');
  let out = [];
  if (MERGE && fs.existsSync(OUT)) {
    try { out = JSON.parse(fs.readFileSync(OUT, 'utf8')) || []; } catch (e) { out = []; }
    console.log('合并模式：已有', out.length, '条');
  }
  const byName = {};
  out.forEach(x => { byName[x.name] = x; });
  for (const r of list) {
    const v = await gen(r);
    if (v) {
      byName[r.name] = { name: r.name, faces: v };
      console.log('✓ ' + r.name + ' | 日常:' + v.daily.slice(0, 26));
    } else {
      console.log('✗ ' + r.name);
    }
  }
  out = Object.keys(byName).map(k => byName[k]);
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
  console.log('\n已写入 _dev/role-faces.json（' + out.length + ' 条）');
})();
