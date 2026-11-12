/* 评估共用工具：配置 / 向量库 / 编码 / 排序 / 维度常量 */
'use strict';

global.window = global;

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.join(__dirname, '..');   // 数据与配置在上一层
const BASE = 'http://127.0.0.1:8777';
const QUERY_PREFIX = '为这个句子生成表示以用于检索相关文章：';

const ALL_DIMS = ['subject', 'role', 'scene', 'style', 'light', 'composition', 'color', 'atmosphere', 'quality'];
const DIM_CN = {
  subject: '主体物', role: '角色', scene: '场景', style: '风格', light: '光线',
  composition: '构图', color: '色彩', atmosphere: '氛围', quality: '画质'
};

function loadConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'config.local.js'), 'utf8');
  new Function('window', src)(global);
  const cfg = global.LLM_CONFIG;
  if (!cfg) throw new Error('config.local.js 未提供 window.LLM_CONFIG');
  const env = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY;
  if (env) { cfg.key = env; cfg.keySource = '环境变量'; }
  else { cfg.keySource = 'config.local.js'; }
  return cfg;
}

let _entries = null, _matrix = null, _dim = 0, _count = 0;

function loadVectors() {
  if (_entries) return { entries: _entries, matrix: _matrix, dim: _dim, count: _count };
  _entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'vectors.meta.json'), 'utf8'));
  const buf = fs.readFileSync(path.join(ROOT, 'vectors.bin'));
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  _matrix = new Float32Array(ab);
  _dim = meta.dim || 512;
  _count = Math.min(Math.floor(_matrix.length / _dim), _entries.length);
  return { entries: _entries, matrix: _matrix, dim: _dim, count: _count };
}

async function embed(text) {
  const r = await fetch(BASE + '/api/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts: [QUERY_PREFIX + text] })
  });
  if (!r.ok) throw new Error('/api/embed HTTP ' + r.status);
  const j = await r.json();
  if (!j.ok) throw new Error('/api/embed: ' + j.error);
  const v = Float32Array.from(j.vectors[0]);
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  const n = Math.sqrt(s) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= n;
  return v;
}

function rankInto(qVec, kind, perDim) {
  const { entries, matrix, dim, count } = loadVectors();
  const out = [];
  for (let i = 0; i < count; i++) {
    if (entries[i].kind !== kind) continue;
    let dot = 0;
    const off = i * dim;
    for (let d = 0; d < dim; d++) dot += matrix[off + d] * qVec[d];
    out.push({ i, s: dot });
  }
  out.sort((a, b) => b.s - a.s);
  return out.slice(0, perDim).map(c => {
    const e = entries[c.i];
    return { id: e.id, kind: e.kind, name: e.name, zh: e.zh, score: Math.round(c.s * 1000) / 1000 };
  });
}

async function healthCheck() {
  const h = await (await fetch(BASE + '/api/health')).json();
  if (!h.ok) throw new Error('health not ok');
  return h;
}

module.exports = {
  BASE, QUERY_PREFIX, ALL_DIMS, DIM_CN,
  loadConfig, loadVectors, embed, rankInto, healthCheck
};
