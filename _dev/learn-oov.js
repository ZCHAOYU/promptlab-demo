'use strict';
/* 自动学习流水线（原型）：OOV 词 → LLM 生成 → 六道闸门 → 影子池
   （2026-11-11 补齐第 6 道「合规」：这个注释从写下那天起就写着「六道」，
     但代码一直只有五道。注释先于实现是好习惯，但长期对不上就是谎报。）
   本脚本不碰主程序，只验证设计是否成立。
   用法：node _dev/learn-oov.js 病娇 霸总 青梅竹马
*/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';

const KINDS = ['role', 'scene', 'style', 'light', 'composition', 'color', 'atmosphere'];
const KIND_CN = { role: '角色', scene: '场景', style: '风格', light: '光线', composition: '构图', color: '色彩', atmosphere: '氛围' };

/* 向量资源：用于第 3 关的类型判定 */
const BASE_LOCAL = 'http://127.0.0.1:8777';
let VEC = null;
function loadVec() {
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'vectors.meta.json'), 'utf8'));
  const buf = fs.readFileSync(path.join(ROOT, 'vectors.bin'));
  const dim = meta.dim || 512;
  const f32 = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
  return { dim: dim, f32: f32 };
}

async function embed(text) {
  const r = await fetch(BASE_LOCAL + '/api/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts: [text] })
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  const v = (j.vectors || j.data || [])[0];
  return Array.isArray(v) ? v : (v && v.embedding) || null;
}


async function callLLM(prompt, maxTokens) {
  const resp = await fetch(BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: maxTokens || 2000
    })
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const j = await resp.json();
  const txt = ((j.choices || [])[0] || {}).message?.content || '';
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch (e) { return null; }
}

/* ---------- 生成者 ---------- */
async function generate(word) {
  const prompt =
    '你是中文视觉描述词典的编写者。请为词条「' + word + '」生成一条结构化的视觉描述。\n\n' +
    '输出 JSON，字段如下：\n' +
    '{\n' +
    '  "kind": "role | scene | style | light | composition | color | atmosphere 之一",\n' +
    '  "name": "规范化的词条名",\n' +
    '  "core": "主体描述，10-25字",\n' +
    '  "worn": "穿在身上/佩戴的东西，没有就空字符串",\n' +
    '  "body": "身体特征如羽翼利爪，没有就空字符串",\n' +
    '  "carries": "拿在手里/背包里的器具，没有就空字符串",\n' +
    '  "mood": "气质或氛围词，逗号分隔",\n' +
    '  "keywords": ["其他能触发这个词的近义说法，2-4 个"]\n' +
    '}\n\n' +
    '要求：\n' +
    '- 若是角色，worn/body/carries/mood 必须填；若穿戴类东西不确定就留空，不要编造\n' +
    '- core 不要以「他/她/这个」开头，不要重复 name\n' +
    '- 只输出 JSON，不要解释和代码块';
  return callLLM(prompt, 2000);
}

/* ---------- 闸门 1：Schema ---------- */
function gateSchema(e) {
  const errs = [];
  if (!e || typeof e !== 'object') return ['不是对象'];
  if (KINDS.indexOf(e.kind) < 0) errs.push('kind 非法: ' + e.kind);
  if (!e.name || String(e.name).length < 1 || String(e.name).length > 12) errs.push('name 长度不合法');
  if (!e.core || String(e.core).length < 6 || String(e.core).length > 60) errs.push('core 长度不合法');
  if (!Array.isArray(e.keywords) || e.keywords.length < 1) errs.push('keywords 缺失');
  if (e.kind === 'role' && !e.mood) errs.push('角色缺 mood');
  ['worn', 'body', 'carries', 'mood'].forEach(function (k) {
    if (e[k] === undefined) e[k] = '';
  });
  return errs;
}

/* ---------- 闸门 2：重复 ---------- */
function gateDup(e, entries) {
  const name = String(e.name);
  const same = entries.filter(function (x) { return x.name === name; });
  if (same.length) return ['已存在同名条目（' + same[0].kind + '）'];
  const near = entries.filter(function (x) {
    return x.name !== name && (x.name.indexOf(name) >= 0 || name.indexOf(x.name) >= 0);
  });
  if (near.length) return ['与已有条目高度重叠：' + near.slice(0, 3).map(function (x) { return x.name; }).join('/')];
  return [];
}

/* ---------- 闸门 3：类型自洽（同义邻域） ---------- */
async function gateType(e, entries) {
  // 基于向量：这个词离哪个类型的条目最近，就应该属于哪个类型
  if (!VEC) VEC = loadVec();
  let v;
  try { v = await embed('为这个句子生成表示以用于检索相关文章：' + e.name); }
  catch (err) { return ['类型校验失败：' + (err && err.message ? err.message : String(err))]; }
  if (!v) return ['类型校验跳过（无向量）'];

  const dim = VEC.dim, f32 = VEC.f32;
  const best = {};
  const limit = Math.min(entries.length, Math.floor(f32.length / dim));
  for (let i = 0; i < limit; i++) {
    const off = i * dim;
    let s2 = 0;
    for (let k = 0; k < dim; k++) s2 += v[k] * f32[off + k];
    const kind = entries[i].kind;
    if (!best[kind] || s2 > best[kind].score) best[kind] = { score: s2, name: entries[i].name };
  }
  const ranked = Object.keys(best).sort(function (a, b) { return best[b].score - best[a].score; });
  const top = ranked[0];
  const mine = best[e.kind];
  if (!mine) return ['该类型在库中无条目可比较'];
  if (top !== e.kind) {
    return ['类型不符：最近的是 ' + top + '（' + best[top].name + ' ' + best[top].score.toFixed(3) +
      '），而不是 ' + e.kind];
  }
  return [];
}

/* ---------- 闸门 4：冲突（关键词已被别的条目占用） ---------- */
function gateConflict(e, entries) {
  const own = new Set(entries.map(function (x) { return x.name; }));
  const clash = (e.keywords || []).filter(function (k) { return own.has(k); });
  if (clash.length) return ['关键词与已有条目同名：' + clash.join('/')];
  return [];
}

/* ---------- 闸门 6：合规（2026-11-11 补） ---------- */
function gateCompliance6(e) {
    try {
        return require('./compliance-gate').gateCompliance(e);
    } catch (err) {
        return ['合规检查异常：' + err.message];
    }
}

/* ---------- 闸门 5：独立复核（换一次调用，扮演审核员） ---------- */
async function gateReview(word, e) {
  const prompt =
    '你是词条审核员。请判断下面这条词条是否合格。\n\n' +
    '用户输入的词：「' + word + '」\n' +
    '生成的词条：\n' + JSON.stringify(e, null, 2) + '\n\n' +
    '审核标准：\n' +
    '1) kind 是否真的符合这个词的含义（角色 / 场景 / 风格 / 光线 / 构图 / 色彩 / 氛围）\n' +
    '2) 描述是否准确，有没有编造不存在的特征\n' +
    '3) worn / carries 的分类是否正确（穿戴 vs 随身）\n' +
    '4) 是否存在宗教、民族、性别等不当表述\n\n' +
    '只输出 JSON：{"ok": true 或 false, "reason": "一句话理由"}';
  const r = await callLLM(prompt, 1500);
  if (!r) return { ok: false, reason: '复核调用失败' };
  return { ok: r.ok === true, reason: String(r.reason || '') };
}

(async () => {
  if (!KEY) { console.log('缺少 DEEPSEEK_API_KEY'); process.exit(1); }
  const words = process.argv.slice(2);
  if (!words.length) { console.log('用法: node _dev/learn-oov.js 病娇 霸总'); process.exit(1); }

  const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));

  const shadowPath = path.join(__dirname, 'shadow-entries.json');
  const shadow = fs.existsSync(shadowPath) ? JSON.parse(fs.readFileSync(shadowPath, 'utf8')) : [];

  for (const w of words) {
    console.log('\n===== 「' + w + '」 =====');
    const e = await generate(w);
    if (!e) { console.log('  ✗ 生成失败'); continue; }
    console.log('  生成: ' + e.kind + ' / ' + e.name);
    console.log('    core: ' + e.core);

    const results = [];
    const g1 = gateSchema(e); results.push(['1 Schema', g1]);
    const g2 = gateDup(e, entries.concat(shadow)); results.push(['2 重复', g2]);
    const g3 = await gateType(e, entries); results.push(['3 类型', g3]);
    const g4 = gateConflict(e, entries); results.push(['4 冲突', g4]);
    const g5 = await gateReview(w, e); results.push(['5 复核', g5.ok ? [] : [g5.reason]]);
  const g6 = gateCompliance6(e); results.push(['6 合规', g6]);

    let pass = true;
    results.forEach(function (r) {
      const ok = r[1].length === 0;
      if (!ok) pass = false;
      console.log('  ' + (ok ? '✓' : '✗') + ' ' + r[0] + (ok ? '' : ' : ' + r[1].join('; ')));
    });

    if (pass) {
      shadow.push(Object.assign({}, e, {
        learnedFrom: w,
        learnedAt: new Date().toISOString(),
        model: MODEL,
        review: g5.reason,
        status: 'shadow'
      }));
      console.log('  → 进入影子池 ✓');
    } else {
      console.log('  → 拒绝入库');
    }
  }

  fs.writeFileSync(shadowPath, JSON.stringify(shadow, null, 2), 'utf8');
  console.log('\n影子池现有 ' + shadow.length + ' 条 → _dev/shadow-entries.json');
})();
