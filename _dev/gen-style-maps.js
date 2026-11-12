'use strict';
/* 为缺失的风格生成「光线 / 色彩 / 氛围」映射。
   ------------------------------------------------------------
   输入：_dev/style-map-todo.json（待补风格 + 三个合法池子）
   输出：_dev/style-maps.json（增量写，失败不丢已有结果）

   关键设计：
     · 只允许从给定池子里选，不许自己造名字 —— 造了就是脏数据
     · 每批 20 个风格，失败只重试这一批（带错误清单）
     · 校验不通过的条目单独列出来，人工或二次重试
   用法：
     node _dev/gen-style-maps.js --limit 20
     node _dev/gen-style-maps.js            # 跑完全部
*/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';
const BATCH = parseInt((function () {
  const i = process.argv.indexOf('--batch');
  return i >= 0 ? process.argv[i + 1] : '20';
})(), 10);
const LIMIT = parseInt((function () {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? process.argv[i + 1] : '9999';
})(), 10);

const TODO_PATH = path.join(__dirname, 'style-map-todo.json');
const OUT_PATH = path.join(__dirname, 'style-maps.json');

const data = JSON.parse(fs.readFileSync(TODO_PATH, 'utf8'));
const POOLS = {
  lighting: data.lighting,
  color: data.color,
  atmosphere: data.atmosphere
};

let done = {};
if (fs.existsSync(OUT_PATH)) {
  try { done = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')) || {}; } catch (e) { done = {}; }
}

const pending = data.todo.map(x => x.style).filter(s => !done[s]);
console.log(`待补 ${data.todo.length} 个风格，已完成 ${Object.keys(done).length}，本次处理 ${Math.min(pending.length, LIMIT)}`);

function buildPrompt(styles) {
  return '你在为一个中文视觉提示词工具补「风格 → 光影/色彩/氛围」的默认值表。\n\n' +
    '工具的输出是中文描述句。用户如果只写了风格、没写光线色彩氛围，' +
    '程序就用这张表补一个**风格上协调**的默认值。\n\n' +
    '要求：\n' +
    '1. 每个风格给三个值：lighting（光线）、color（色彩）、atmosphere（氛围）。\n' +
    '2. **每个值必须严格从下面三个池子里原样复制**，一个字都不能改，也不许自己造新名字。\n' +
    '3. 判断标准是「这个风格的照片/画作通常是什么光、什么色、什么情绪」，不是字面联想。\n' +
    '4. 注意领域一致性：\n' +
    '   · 传统绘画 / 手工艺 / 古典类，不要配赛博、霓虹、未来感的东西\n' +
    '   · 数字 / 赛博 / 生成艺术类，不要配油画笔触、宣纸、水墨\n' +
    '   · 宗教 / 壁画 / 圣像类，偏暖金、烛光、肃穆\n' +
    '   · 极简 / 抽象类，偏冷、干净、克制\n' +
    '5. 只输出 JSON，不要 markdown 代码块，不要解释。\n\n' +
    '输出格式（styles 里每个名字都要有一条）：\n' +
    '{"风格名":{"lighting":"池子里的值","color":"池子里的值","atmosphere":"池子里的值"}}\n\n' +
    '=== lighting 池子（' + POOLS.lighting.length + ' 条）===\n' + POOLS.lighting.join('、') + '\n\n' +
    '=== color 池子（' + POOLS.color.length + ' 条）===\n' + POOLS.color.join('、') + '\n\n' +
    '=== atmosphere 池子（' + POOLS.atmosphere.length + ' 条）===\n' + POOLS.atmosphere.join('、') + '\n\n' +
    '=== 要补的风格（' + styles.length + ' 个）===\n' + styles.join('、');
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
      temperature: 0.3,
      max_tokens: maxTokens
    })
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const j = await resp.json();
  const ch = (j.choices || [])[0] || {};
  return { text: (ch.message || {}).content || '', finish: ch.finish_reason };
}

async function genBatch(styles) {
  const BUDGETS = [3000, 6000, 10000];
  let lastErr = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const budget of BUDGETS) {
      let r;
      try { r = await callLLM(buildPrompt(styles), budget); } catch (e) { lastErr = e.message; break; }
      if (!r.text.trim()) { lastErr = `空返回（finish=${r.finish}）`; continue; }
      const obj = pickJson(r.text);
      if (!obj) { lastErr = '不是合法 JSON'; continue; }
      return obj;
    }
    if (attempt === 0) console.log('    重试一次（' + lastErr + '）');
  }
  throw new Error('两轮都失败：' + lastErr);
}

function validate(obj, styles) {
  const L = new Set(POOLS.lighting), C = new Set(POOLS.color), A = new Set(POOLS.atmosphere);
  const good = {}, bad = [];
  styles.forEach(function (s) {
    const v = obj[s];
    if (!v) { bad.push(`${s}: 没返回`); return; }
    const li = String(v.lighting || '').trim();
    const co = String(v.color || '').trim();
    const at = String(v.atmosphere || '').trim();
    const errs = [];
    if (!L.has(li)) errs.push('lighting 不在池子：' + li);
    if (!C.has(co)) errs.push('color 不在池子：' + co);
    if (!A.has(at)) errs.push('atmosphere 不在池子：' + at);
    if (errs.length) bad.push(`${s}: ${errs.join('；')}`);
    else good[s] = { lighting: li, color: co, atmosphere: at };
  });
  return { good, bad };
}

(async function main() {
  if (!KEY) { console.log('缺少 DEEPSEEK_API_KEY'); process.exit(1); }
  const list = pending.slice(0, LIMIT);
  if (!list.length) { console.log('没有待补项'); return; }

  let ok = 0, failed = 0;
  for (let i = 0; i < list.length; i += BATCH) {
    const styles = list.slice(i, i + BATCH);
    process.stdout.write(`\n[${i + 1}-${i + styles.length}] ${styles[0]} 等 ${styles.length} 个… `);
    let obj;
    try { obj = await genBatch(styles); } catch (e) {
      console.log('失败：' + e.message);
      failed += styles.length;
      continue;
    }
    const { good, bad } = validate(obj, styles);
    Object.keys(good).forEach(function (k) { done[k] = good[k]; });
    ok += Object.keys(good).length;
    failed += bad.length;
    fs.writeFileSync(OUT_PATH, JSON.stringify(done, null, 1), 'utf8');
    console.log(`通过 ${Object.keys(good).length}，不合格 ${bad.length}（累计 ${Object.keys(done).length}）`);
    bad.slice(0, 6).forEach(b => console.log('    ✗ ' + b));
    if (bad.length > 6) console.log(`    ……还有 ${bad.length - 6} 条不合格`);
  }
  console.log(`\n本次通过 ${ok}，失败/不合格 ${failed}`);
  console.log(`已写出 ${OUT_PATH}（共 ${Object.keys(done).length} 条）`);
})();
