'use strict';
/* 验证：词库外的词，语义检索能不能找到最近的库内条目 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'http://127.0.0.1:8777';

function loadVectors() {
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'vectors.meta.json'), 'utf8'));
  const buf = fs.readFileSync(path.join(ROOT, 'vectors.bin'));
  const dim = meta.dim || 512;
  const n = Math.floor(buf.length / 4 / dim);
  const f32 = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
  const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));
  return { meta, dim, n, f32, entries };
}

function cos(a, b, off, dim) {
  let s = 0;
  for (let i = 0; i < dim; i++) s += a[i] * b[off + i];
  return s;
}

async function embed(text) {
  const r = await fetch(BASE + '/api/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts: [text] })
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  const v = (j.vectors || j.data || [])[0];
  return Array.isArray(v) ? v : (v && v.embedding) || null;
}

(async () => {
  const { dim, n, f32, entries } = loadVectors();
  console.log('向量库: ' + n + ' 条 x ' + dim + ' 维；条目 ' + entries.length + ' 条');
  console.log('（两者数量可能不同，取较小者对齐）\n');

  // 词库外 / 容易误判的词
  const WORDS = ['霸总', '病娇', '青梅竹马', '剑修', '兽耳', '女帝', '发疯文学', '阴湿', '占有欲', '机械巨龙'];

  for (const w of WORDS) {
    let v;
    try { v = await embed('为这个句子生成表示以用于检索相关文章：' + w); } catch (e) {
      console.log(w + ' → 嵌入失败: ' + e.message);
      continue;
    }
    if (!v) { console.log(w + ' → 无向量'); continue; }

    const limit = Math.min(n, entries.length);
    const scored = [];
    for (let i = 0; i < limit; i++) {
      const off = i * dim;
      if (off + dim > f32.length) break;
      scored.push({ i, s: cos(v, f32, off, dim) });
    }
    scored.sort((a, b) => b.s - a.s);
    const top = scored.slice(0, 4).map(x => {
      const e = entries[x.i];
      return (e ? (e.name + '[' + e.kind + ']') : '?') + ' ' + x.s.toFixed(3);
    });
    console.log('「' + w + '」 → ' + top.join('   |   '));
  }
})();
