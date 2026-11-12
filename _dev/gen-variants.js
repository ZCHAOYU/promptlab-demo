'use strict';
/* 为每个角色生成 3 组情境化变体（去模板化的数据基础）
   用法：node _dev/gen-variants.js --limit 3
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';
const LIMIT = parseInt((process.argv.indexOf('--limit') >= 0 ? process.argv[process.argv.indexOf('--limit') + 1] : '3'), 10);

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
  'for(var k in c){var z=c[k].zh||{};if(z.core)o.push({' +
  'name:k,core:z.core,detail:z.detail||"",pose:z.pose||"",mood:z.mood||""});}' +
  'return JSON.stringify(o);})()', ctx));

const ONLY = (function () {
  // --only 女帝,霸总   只补指定的几个（配合 --merge 追加，不覆盖已生成的）
  const i = process.argv.indexOf('--only');
  if (i < 0) return null;
  return String(process.argv[i + 1] || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
})();
const MERGE = process.argv.indexOf('--merge') >= 0;
const list = ONLY
  ? roles.filter(r => ONLY.indexOf(r.name) >= 0)
  : roles.slice(0, LIMIT);
console.log('待生成变体:', list.length, '个角色', ONLY ? '（指定）' : '');

async function gen(role) {
  // 档案里已有的服饰/神态一并喂给模型。
  // 只给 core 会出事：女神 core 是「被仰望的存在，气质清冷」，
  // 而 detail 明写「长裙或风衣，细跟鞋」——只给 core 模型就按字面写成神仙，
  // 出了「立于云阶，广袖随微风轻拂」。
  // 但 detail 有的长达上千字（旗袍美人那一条就是），整段塞进去会把 prompt 撑爆，
  // 模型反而吐不出 JSON（蒸汽朋克角色/龙裔战士连续 6 次失败就是这个原因）。
  const cut = (s, n) => {
    const t = String(s || '').replace(/\s+/g, ' ').trim();
    return t.length > n ? t.slice(0, n) + '…' : t;
  };
  const ref = [role.detail && '已知服饰：' + cut(role.detail, 120),
               role.mood && '已知气质：' + cut(role.mood, 60)]
    .filter(Boolean).join('\n');
  const prompt =
    '为角色「' + role.name + '」（' + role.core + '）写 3 组不同的「姿态动作 + 服饰细节 + 气质」短句。\n' +
    (ref ? ref + '\n' : '') +
    '注意：上面「已知服饰」是硬信息，三组都必须和它一致（是现代风衣就别写广袖长袍）。\n\n' +
    '三组分别对应三种情境：\n' +
    '- daily  平静日常（不战斗、不做激烈动作，如站立、行走、交谈、等待、工作）\n' +
    '- action 行动中（移动、战斗、冲撞、奔跑、施法、对峙等有张力的动作）\n' +
    '- quiet  静谧独处（静止、沉思、休息、观望，情绪内敛）\n\n' +
    '硬性要求：\n' +
    '1) 每组只写 2 到 3 个短句，中文逗号分隔，总长 25 到 45 字；\n' +
    '2) 三组之间不能有重复的短语，动作必须明显不同；\n' +
    '3) 不要重复角色名，不要以「他/她/这个角色」开头；\n' +
    '4) **三组都必须符合这个角色的身份**：不要给皇帝写奔跑、不要给现代角色写长袍、\n' +
    '   不要给普通人写法术或机械义体。三组只是同一身份的三种状态，不是三个不同角色；\n' +
    '5) 不要输出解释、代码块或多余文字。\n\n' +
    '只输出 JSON：{"daily":"...","action":"...","quiet":"..."}';

  const DEBUG = process.argv.indexOf('--debug') >= 0;
  // 预算是递增的。deepseek-flash 是推理模型，有时会把全部预算花在思考上
  // （实测 reasoning_tokens=3000 / finish_reason=length / content 为空），
  // 固定 3000 就会连着失败 6 次。
  const BUDGETS = [3000, 6000, 10000];
  for (let attempt = 0; attempt < BUDGETS.length; attempt++) {
    const budget = BUDGETS[attempt];
    const resp = await fetch(BASE + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: budget
      })
    });
    if (!resp.ok) {
      if (DEBUG) console.log('    HTTP ' + resp.status + ' ' + (await resp.text()).slice(0, 300));
      continue;
    }
    const j = await resp.json();
    const ch = (j.choices || [])[0] || {};
    const txt = (ch.message || {}).content || '';
    if (DEBUG) {
      console.log('    finish_reason=' + ch.finish_reason +
        ' reasoning_tokens=' + ((j.usage || {}).completion_tokens_details || {}).reasoning_tokens +
        ' out_tokens=' + (j.usage || {}).completion_tokens);
      console.log('    content: ' + JSON.stringify(txt).slice(0, 500));
    }
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) continue;
    try {
      const o = JSON.parse(m[0]);
      if (o.daily || o.action || o.quiet) {
        return { daily: (o.daily || '').trim(), action: (o.action || '').trim(), quiet: (o.quiet || '').trim() };
      }
    } catch (e) {
      if (DEBUG) console.log('    JSON 解析失败: ' + e.message);
    }
  }
  return null;
}

(async () => {
  if (!KEY) { console.log('缺少 key'); process.exit(1); }
  const OUT = path.join(__dirname, 'role-variants.json');
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
      byName[r.name] = { name: r.name, variants: v };
      console.log('[' + r.name + ']');
      console.log('  日常: ' + v.daily);
      console.log('  行动: ' + v.action);
      console.log('  静谧: ' + v.quiet);
    } else {
      console.log('✗ ' + r.name + ' 生成失败');
    }
  }
  out = Object.keys(byName).map(k => byName[k]);
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
  console.log('\n已写入 _dev/role-variants.json（' + out.length + ' 条）');
})();
