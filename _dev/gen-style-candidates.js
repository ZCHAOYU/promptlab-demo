'use strict';
/* 为 320 个风格生成「光/色/氛围」各 3 个候选。
   ------------------------------------------------------------
   和上一次（补缺映射）的区别：这次不是为了「不同风格互不相同」，
   而是为了「同一个风格也能有多个版本」—— 点「换一版」时内容真会变。

   关键约束（写进提示词）：
     · 三个候选都必须和这个风格协调，只是取舍不同（更冷/更暖、更亮/更暗、更静/更烈）
     · 不是「一个对的 + 两个错的」，也不是「三个风格」
     · 每个值必须原样从池子里复制

   用法：
     node _dev/gen-style-candidates.js --limit 20
     node _dev/gen-style-candidates.js
*/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';

function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : dflt;
}
const BATCH = parseInt(arg('batch', '20'), 10);
const LIMIT = parseInt(arg('limit', '9999'), 10);

const TODO_PATH = path.join(__dirname, 'style-map-todo.json');
const OUT_PATH = path.join(__dirname, 'style-candidates.json');

const meta = JSON.parse(fs.readFileSync(TODO_PATH, 'utf8'));
const POOLS = { lighting: meta.lighting, color: meta.color, atmosphere: meta.atmosphere };

let done = {};
if (fs.existsSync(OUT_PATH)) {
  try { done = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')) || {}; } catch (e) { done = {}; }
}

// 已有的单值映射，作为「第 1 个候选应该接近它」的参照
const single = fs.existsSync(path.join(__dirname, 'style-maps.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'style-maps.json'), 'utf8')) : {};
const defaultsFile = path.join(ROOT, 'archive-style-defaults.js');
let current = {};
if (fs.existsSync(defaultsFile)) {
  const vm = require('vm');
  const ctx = { console: { log() {}, warn() {} } };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(defaultsFile, 'utf8'), ctx, { filename: 'archive-style-defaults.js' });
  current = ctx.window.__STYLE_DEFAULTS || {};
}

const styles = meta.styles.filter(s => !done[s]);
console.log(`风格 ${meta.styles.length} 个，已完成 ${Object.keys(done).length}，本次处理 ${Math.min(styles.length, LIMIT)}`);

function buildPrompt(batch) {
  const hint = batch.map(function (s) {
    const c = current.lighting && current.lighting[s];
    return c && !Array.isArray(c) ? `${s}（现用：光=${current.lighting[s]} 色=${current.color[s]} 氛=${current.atmosphere[s]}）` : s;
  }).join('、');

  return '你在为一个中文视觉提示词工具写「风格 → 光影/色彩/氛围」的**候选值表**。\n\n' +
    '当用户只写了风格、没写光线色彩氛围时，程序会从候选里**随机挑一个**，' +
    '让用户点「换一版」能看到不同的版本。\n\n' +
    '所以每个维度要给 **3 个候选**，规则是：\n' +
    '1. 三个候选都必须和这个风格**协调**。**不是**「一个对的 + 两个凑数的」，\n' +
    '   也**不是**给三个不同风格。它们的差别应该只是取舍：更冷一点 / 更暖一点；\n' +
    '   更亮一点 / 更暗一点；更静一点 / 更烈一点。\n' +
    '2. 第 1 个候选给「最稳妥、最典型」的那个。\n' +
    '3. **每个值必须严格从下面三个池子里原样复制**，一个字都不能改，不许造新名字。\n' +
    '4. 三个候选之间不能重复。\n' +
    '5. 领域一致：传统绘画 / 手工艺 / 古典类不配赛博霓虹；数字 / 生成艺术类不配水墨宣纸。\n' +
    '6. 只输出 JSON，不要代码块，不要解释。\n\n' +
    '输出格式：\n' +
    '{"风格名":{"lighting":["值1","值2","值3"],"color":["值1","值2","值3"],"atmosphere":["值1","值2","值3"]}}\n\n' +
    '=== lighting 池子（' + POOLS.lighting.length + ' 条）===\n' + POOLS.lighting.join('、') + '\n\n' +
    '=== color 池子（' + POOLS.color.length + ' 条）===\n' + POOLS.color.join('、') + '\n\n' +
    '=== atmosphere 池子（' + POOLS.atmosphere.length + ' 条）===\n' + POOLS.atmosphere.join('、') + '\n\n' +
    '=== 要写的风格（' + batch.length + ' 个）===\n' + hint;
}

function pickJson(txt) {
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch (e) { return null; }
}

async function callLLM(prompt, maxTokens) {
  const resp = await fetch(BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: maxTokens
    })
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const j = await resp.json();
  const ch = (j.choices || [])[0] || {};
  return { text: (ch.message || {}).content || '', finish: ch.finish_reason };
}

async function genBatch(batch) {
  const BUDGETS = [4000, 8000, 12000];
  let lastErr = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const budget of BUDGETS) {
      let r;
      try { r = await callLLM(buildPrompt(batch), budget); } catch (e) { lastErr = e.message; break; }
      if (!r.text.trim()) { lastErr = `空返回（finish=${r.finish}）`; continue; }
      const obj = pickJson(r.text);
      if (!obj) { lastErr = '不是合法 JSON'; continue; }
      return obj;
    }
    if (attempt === 0) console.log('    重试一次（' + lastErr + '）');
  }
  throw new Error('两轮都失败：' + lastErr);
}

const SETS = { lighting: new Set(POOLS.lighting), color: new Set(POOLS.color), atmosphere: new Set(POOLS.atmosphere) };

function validate(obj, batch) {
  const good = {}, bad = [];
  batch.forEach(function (s) {
    const v = obj[s];
    if (!v) { bad.push(`${s}: 没返回`); return; }
    const rec = {}; const errs = [];
    ['lighting', 'color', 'atmosphere'].forEach(function (d) {
      let arr = v[d];
      if (typeof arr === 'string') arr = [arr];
      if (!Array.isArray(arr) || arr.length < 2) { errs.push(`${d} 不是数组或不足 2 个`); return; }
      const clean = arr.map(x => String(x || '').trim()).filter(Boolean);
      const outside = clean.filter(x => !SETS[d].has(x));
      if (outside.length) errs.push(`${d} 有池外值：${outside.join('/')}`);
      const uniq = Array.from(new Set(clean));
      if (uniq.length < 2) errs.push(`${d} 候选去重后不足 2 个`);
      rec[d] = uniq.slice(0, 3);
    });
    if (errs.length) bad.push(`${s}: ${errs.join('；')}`);
    else good[s] = rec;
  });
  return { good, bad };
}

(async function main() {
  if (!KEY) { console.log('缺少 DEEPSEEK_API_KEY'); process.exit(1); }
  const list = styles.slice(0, LIMIT);
  if (!list.length) { console.log('没有待处理项'); return; }

  let ok = 0, failed = 0;
  for (let i = 0; i < list.length; i += BATCH) {
    const batch = list.slice(i, i + BATCH);
    process.stdout.write(`\n[${i + 1}-${i + batch.length}] ${batch[0]} 等 ${batch.length} 个… `);
    let obj;
    try { obj = await genBatch(batch); } catch (e) {
      console.log('失败：' + e.message); failed += batch.length; continue;
    }
    const { good, bad } = validate(obj, batch);
    Object.keys(good).forEach(k => { done[k] = good[k]; });
    ok += Object.keys(good).length;
    failed += bad.length;
    fs.writeFileSync(OUT_PATH, JSON.stringify(done, null, 1), 'utf8');
    console.log(`通过 ${Object.keys(good).length}，不合格 ${bad.length}（累计 ${Object.keys(done).length}）`);
    bad.slice(0, 6).forEach(b => console.log('    ✗ ' + b));
    if (bad.length > 6) console.log(`    ……还有 ${bad.length - 6} 条`);
  }
  console.log(`\n本次通过 ${ok}，失败/不合格 ${failed}`);
  console.log(`已写出 ${OUT_PATH}（共 ${Object.keys(done).length} 条）`);
})();
