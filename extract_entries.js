/* ============================================================
 * PromptLab V5 — 词条抽取器
 * ------------------------------------------------------------
 * 把 translations.js（中文）与 data-kwdb.js（英文 + 负向）合并成 entries.json。
 *
 * 用法：
 *   node extract_entries.js [项目目录]
 *
 * 输出：entries.json  [{id, kind, name, zh, en, neg, text}, ...]
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const D = process.argv[2] || __dirname;
const read = f => fs.readFileSync(path.join(D, f), 'utf8');

/* --- 浏览器环境打桩，让两个数据文件能直接跑 --- */
const stubEl = {
  style: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  addEventListener() {}, appendChild() {}, setAttribute() {}, getAttribute() { return null; },
  textContent: '', value: '', innerHTML: ''
};
const doc = {
  getElementById: () => stubEl, querySelector: () => stubEl, querySelectorAll: () => [],
  createElement: () => stubEl, addEventListener() {}, body: stubEl, head: stubEl
};
const ctx = {
  console, window: {}, document: doc, navigator: { userAgent: 'node' },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout
};
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);

const EXPORT = `globalThis.__EXPORT = {
  roleTranslations, styleTranslations, sceneTranslations, lightTranslations,
  compositionTranslations, colorTranslations, atmosphereTranslations, qualityTranslations,
  genderTranslations, materialTranslations, textureTranslations, backgroundTranslations,
  KW_DB
};`;

vm.runInContext([read('translations.js'), read('data-kwdb.js'), EXPORT].join('\n'), ctx, { timeout: 60000 });
const E = ctx.__EXPORT;

/* --- KW_DB 分类名 -> 统一 kind（注意：之前漏了 scene，导致 323 条场景词条没有英文）--- */
const MAP = {
  character: 'role', scene: 'scene', style: 'style', lighting: 'light',
  composition: 'composition', color: 'color', atmosphere: 'atmosphere',
  quality: 'quality', gender: 'gender', material: 'material',
  texture: 'texture', background: 'background'
};

const merged = new Map();
function get(kind, name) {
  const k = kind + '|' + name;
  if (!merged.has(k)) merged.set(k, { kind, name, zh: '', en: '', neg: '', kw: '' });
  return merged.get(k);
}

/* 1) translations.js 的中文 */
for (const [file, dict] of Object.entries(E)) {
  if (file === 'KW_DB' || !dict || typeof dict !== 'object') continue;
  const kind = file.replace('Translations', '');
  for (const [key, val] of Object.entries(dict)) {
    const zh = val && val.zh;
    if (!zh) continue;
    const parts = ['core', 'core_zh', 'face', 'pose', 'detail', 'detail_zh', 'mood', 'effect_zh']
      .map(k => zh[k]).filter(Boolean);
    if (!parts.length) continue;
    get(kind, key).zh = parts.join('；');
  }
}

/* 2) KW_DB 的英文 + 负向 */
let skipped = [];
for (const [cat, cv] of Object.entries(E.KW_DB || {})) {
  const kind = MAP[cat];
  if (!kind) { skipped.push(cat); continue; }
  if (!cv || !cv.categories) continue;
  for (const [key, val] of Object.entries(cv.categories)) {
    const parts = ['core', 'detail', 'mood', 'color', 'tech', 'ref']
      .map(k => val && val[k]).filter(Boolean);
    const e = get(kind, key);
    if (parts.length) e.en = parts.join('; ');
    if (val && val.negative) e.neg = String(val.negative);
    // material / texture / background / display 这几类没有 core/detail，只有 keywords。
    // 那些近义词是最好的检索信号，拼进 text 里（去重，保留顺序）。
    if (val && Array.isArray(val.keywords) && val.keywords.length) {
      const seen = new Set();
      const uniq = [];
      for (const w of val.keywords) {
        const s = String(w).trim();
        if (s && !seen.has(s)) { seen.add(s); uniq.push(s); }
      }
      e.kw = uniq.join(' ');
    }
  }
}

/* 3) 第 9 维「主体物」：词库里没有对应词典，来自生成的 subject-vocab.json */
const subjectFile = path.join(D, 'subject-vocab.json');
if (fs.existsSync(subjectFile)) {
  const subjects = JSON.parse(fs.readFileSync(subjectFile, 'utf8'));
  for (const s of subjects) {
    const e = get('subject', s.name);
    if (s.zh) e.zh = s.zh;
    if (s.en) e.en = s.en;
    if (s.kw) e.kw = s.kw;
  }
  console.log('已合并主体物词条:', subjects.length);
} else {
  console.log('⚠ 未找到 subject-vocab.json，第 9 维为空');
}

const out = [];
const stat = {};
for (const e of merged.values()) {
  // zh 是词条名/描述；kw 是近义词（material/texture/background 这类只有关键词）；en 是英文
  const text = [e.zh, e.kw, e.en].filter(Boolean).join(' ');
  if (!text) continue;
  out.push({ id: out.length, kind: e.kind, name: e.name, zh: e.zh, en: e.en, neg: e.neg, kw: e.kw, text });
  stat[e.kind] = (stat[e.kind] || 0) + 1;
}

fs.writeFileSync(path.join(D, 'entries.json'), JSON.stringify(out), 'utf8');

console.log('条目总数:', out.length);
console.log('分类:', JSON.stringify(stat));
if (skipped.length) console.log('⚠ 未映射的 KW_DB 分类:', skipped.join(', '));
const noEn = out.filter(x => !x.en).length;
const withKw = out.filter(x => x.kw).length;
console.log('缺英文的条目:', noEn, '(material/texture/background/display 本来就没有英文)');
console.log('带近义词的条目:', withKw);
