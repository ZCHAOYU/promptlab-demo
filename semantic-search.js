/* ============================================================
 * PromptLab V5 — 语义检索层（A2）
 * ------------------------------------------------------------
 * 主模式（server）：向量由 precompute.py 预先算好，前端只读 vectors.bin；
 *                   查询编码走本地 serve.py 的 /api/embed（原生 onnxruntime，16 线程）。
 *                   初始化 ≈ 0 秒，查询 ≈ 20–40ms。
 *
 * 备用模式（wasm）：浏览器内跑模型。慢且部分机器会卡线程初始化，仅在服务端不可用时启用。
 *
 * 用法：
 *   await SemanticSearch.init({onProgress});
 *   const hits = await SemanticSearch.search('阴森的老房子', 8, {kind:'scene'});
 *   const byDim = await SemanticSearch.searchMulti('阴森的老房子', 5);
 * ============================================================ */
(function (global) {
  'use strict';

  var DIMS = ['subject', 'role', 'scene', 'style', 'light', 'composition', 'color', 'atmosphere', 'quality'];

  var CFG = {
    mode: 'server',                 // 'server' | 'wasm' | 'auto'
    entriesUrl: './entries.json',
    vectorUrl: './vectors.bin',
    metaUrl: './vectors.meta.json',
    embedApi: './api/embed',

    // 备用 wasm 模式用
    localLib: './vendor/transformers/transformers.min.js',
    wasmDir: './vendor/transformers/',
    localModelPath: './models/',
    model: 'bge-small-zh-v1.5',
    queryPrefix: '为这个句子生成表示以用于检索相关文章：'
  };

  var entries = [];
  var matrix = null;     // Float32Array，count*dim
  var dim = 0;
  var ready = false;
  var initPromise = null;
  var lastError = null;
  var diag = { mode: null, count: 0, dim: 0, isolated: null, hardware: null, threads: null, simd: null, msPerItem: null };

  var extractor = null;  // 仅 wasm 模式使用

  function log() {
    var a = Array.prototype.slice.call(arguments);
    a.unshift('[semantic]');
    console.log.apply(console, a);
  }
  function now() { return (typeof performance !== 'undefined' ? performance.now() : Date.now()); }
  function report(cb, stage, cur, total, msg) {
    if (typeof cb !== 'function') return;
    try {
      cb({ stage: stage, current: cur || 0, total: total || 0,
           percent: total ? Math.round(cur / total * 100) : 0, message: msg || '' });
    } catch (e) {}
  }
  function resolveUrl(u) { return new URL(u, document.baseURI).href; }

  /* ---------------- 向量工具 ---------------- */

  function normalizeInPlace(a) {
    var s = 0, i;
    for (i = 0; i < a.length; i++) s += a[i] * a[i];
    var n = Math.sqrt(s) || 1;
    for (i = 0; i < a.length; i++) a[i] /= n;
    return a;
  }
  function dot(a, ao, b, bo, len) {
    var s = 0;
    for (var i = 0; i < len; i++) s += a[ao + i] * b[bo + i];
    return s;
  }

  /* ---------------- 服务端模式 ---------------- */

  async function loadPrecomputed(onProgress) {
    report(onProgress, 'meta', 0, 1, '读取向量元信息…');
    var mr = await fetch(resolveUrl(CFG.metaUrl), { cache: 'no-store' });
    if (!mr.ok) throw new Error('vectors.meta.json 读取失败：HTTP ' + mr.status);
    var meta = await mr.json();
    if (meta.dtype && meta.dtype !== 'float32') throw new Error('向量类型不支持：' + meta.dtype);

    report(onProgress, 'vectors', 0, 1, '加载预计算向量（' + (meta.count || '?') + ' 条）…');
    var vr = await fetch(resolveUrl(CFG.vectorUrl), { cache: 'no-store' });
    if (!vr.ok) throw new Error('vectors.bin 读取失败：HTTP ' + vr.status);
    var buf = await vr.arrayBuffer();

    dim = meta.dim || 512;
    var expect = (meta.count || 0) * dim * 4;
    if (buf.byteLength !== expect) {
      log('向量文件长度不符：得到 ' + buf.byteLength + '，期望 ' + expect + '（按实际长度推断）');
    }
    matrix = new Float32Array(buf);
    var count = Math.floor(matrix.length / dim);

    report(onProgress, 'entries', 0, 1, '读取词条…');
    var er = await fetch(resolveUrl(CFG.entriesUrl), { cache: 'no-store' });
    if (!er.ok) throw new Error('entries.json 读取失败：HTTP ' + er.status);
    entries = await er.json();

    if (entries.length !== count) {
      log('词条数(' + entries.length + ') 与向量数(' + count + ') 不一致，按较小值截断');
      var n = Math.min(entries.length, count);
      entries = entries.slice(0, n);
      matrix = matrix.subarray(0, n * dim);
    }

    diag.mode = 'server';
    diag.count = entries.length;
    diag.dim = dim;
    ready = true;
    report(onProgress, 'done', 1, 1, '就绪：' + entries.length + ' 条 / ' + dim + ' 维（服务端向量）');
    return true;
  }

  async function embedByServer(texts) {
    // 访问码：服务端设了 PL_ACCESS_CODE 时，/api/* 都要带 X-PL-Code。
    // plHeaders 定义在 app.js 里（本文件加载在它之后，调用时已存在）。
    var hdr = { 'Content-Type': 'application/json' };
    try {
      if (typeof plHeaders === 'function') hdr = plHeaders(hdr);
    } catch (e) {}
    var r = await fetch(resolveUrl(CFG.embedApi), {
      method: 'POST',
      headers: hdr,
      body: JSON.stringify({ texts: texts })
    });
    if (!r.ok) {
      var t = await r.text();
      throw new Error('/api/embed 失败 HTTP ' + r.status + '：' + t.slice(0, 200));
    }
    var j = await r.json();
    if (!j.ok) throw new Error('/api/embed 返回错误：' + j.error);
    return j.vectors.map(function (v) { return normalizeInPlace(Float32Array.from(v)); });
  }

  /* ---------------- 备用 wasm 模式 ---------------- */

  async function ensureExtractor(onProgress) {
    if (extractor) return extractor;
    var mod = await import(CFG.localLib);
    var env = mod.env;
    if (env) {
      env.allowRemoteModels = false;
      env.allowLocalModels = true;
      env.localModelPath = CFG.localModelPath;
      env.useBrowserCache = true;
      if (env.backends && env.backends.onnx && env.backends.onnx.wasm) {
        env.backends.onnx.wasm.wasmPaths = resolveUrl(CFG.wasmDir);
        var hw = (navigator && navigator.hardwareConcurrency) || 2;
        try { env.backends.onnx.wasm.numThreads = Math.max(1, Math.min(8, hw)); } catch (e) {}
        try { env.backends.onnx.wasm.simd = true; } catch (e) {}
        diag.isolated = (typeof crossOriginIsolated !== 'undefined') ? crossOriginIsolated : null;
        diag.hardware = hw;
        diag.threads = env.backends.onnx.wasm.numThreads;
      }
    }
    report(onProgress, 'model', 0, 1, '加载浏览器内模型（备用模式，较慢）…');
    extractor = await mod.pipeline('feature-extraction', CFG.model, { quantized: true });
    return extractor;
  }

  async function embedByWasm(texts, onProgress) {
    var ex = await ensureExtractor(onProgress);
    var out = [];
    for (var i = 0; i < texts.length; i += 8) {
      var batch = texts.slice(i, i + 8);
      var res = await ex(batch, { pooling: 'cls', normalize: true });
      var d = res.dims[res.dims.length - 1];
      dim = d;
      for (var b = 0; b < batch.length; b++) {
        out.push(normalizeInPlace(res.data.slice(b * d, (b + 1) * d)));
      }
      report(onProgress, 'encode', Math.min(i + 8, texts.length), texts.length, '编码中…');
    }
    return out;
  }

  async function initWasm(onProgress) {
    report(onProgress, 'entries', 0, 1, '读取词条…');
    var er = await fetch(resolveUrl(CFG.entriesUrl), { cache: 'no-store' });
    entries = await er.json();

    // 尝试读预计算向量（若存在，直接用，不编码）
    try {
      var vr = await fetch(resolveUrl(CFG.vectorUrl), { cache: 'no-store' });
      if (vr.ok) {
        var buf = await vr.arrayBuffer();
        var probe = await (await fetch(resolveUrl(CFG.metaUrl), { cache: 'no-store' })).json();
        dim = probe.dim || 512;
        matrix = new Float32Array(buf);
        var cnt = Math.floor(matrix.length / dim);
        if (cnt >= entries.length) {
          diag.mode = 'wasm+precomputed';
          diag.count = entries.length; diag.dim = dim;
          ready = true;
          report(onProgress, 'done', 1, 1, '就绪（预计算向量 + 浏览器编码查询）');
          return true;
        }
      }
    } catch (e) { log('预计算向量不可用，改为现场编码：' + e.message); }

    await ensureExtractor(onProgress);
    var texts = entries.map(function (e) { return e.text || (e.name + ' ' + (e.zh || '')); });
    report(onProgress, 'encode', 0, texts.length, '编码词条（首次较慢）…');
    var vecs = await embedByWasm(texts, onProgress);
    matrix = new Float32Array(vecs.length * dim);
    for (var i = 0; i < vecs.length; i++) matrix.set(vecs[i], i * dim);
    diag.mode = 'wasm';
    diag.count = entries.length; diag.dim = dim;
    ready = true;
    report(onProgress, 'done', 1, 1, '就绪：' + entries.length + ' 条 / ' + dim + ' 维（浏览器编码）');
    return true;
  }

  /* ---------------- 初始化 ---------------- */

  async function init(opts) {
    if (ready) return true;
    if (initPromise) return initPromise;
    opts = opts || {};
    var onProgress = opts.onProgress;
    if (opts.mode) CFG.mode = opts.mode;

    initPromise = (async function () {
      try {
        if (CFG.mode === 'wasm') return await initWasm(onProgress);

        // server（默认）：失败则自动回落到 wasm
        try {
          return await loadPrecomputed(onProgress);
        } catch (e) {
          if (CFG.mode === 'server') {
            log('服务端模式失败：' + e.message + ' → 回落 wasm');
            report(onProgress, 'fallback', 0, 1, '服务端不可用，回落到浏览器编码…');
            return await initWasm(onProgress);
          }
          throw e;
        }
      } catch (e) {
        lastError = e;
        log('初始化失败：', e && e.message);
        report(onProgress, 'error', 0, 1, (e && e.message) || '未知错误');
        return false;
      }
    })();
    return initPromise;
  }

  /* ---------------- 查询 ---------------- */

  async function embedQuery(query) {
    if (diag.mode === 'server') return (await embedByServer([CFG.queryPrefix + query]))[0];
    if (diag.mode === 'wasm+precomputed' || diag.mode === 'wasm') {
      return (await embedByWasm([CFG.queryPrefix + query], null))[0];
    }
    throw new Error('检索层未就绪');
  }

  function rankInto(qVec, onlyKind, perDim, minScore) {
    var n = entries.length;
    var out = [];
    for (var i = 0; i < n; i++) {
      if (onlyKind && entries[i].kind !== onlyKind) continue;
      var s = dot(matrix, i * dim, qVec, 0, dim);
      if (typeof minScore === 'number' && s < minScore) continue;
      out.push({ i: i, s: s });
    }
    out.sort(function (a, b) { return b.s - a.s; });
    return out.slice(0, perDim).map(function (c) {
      var e = entries[c.i];
      return { id: e.id, kind: e.kind, name: e.name, zh: e.zh, en: e.en, neg: e.neg,
               score: Math.round(c.s * 1000) / 1000 };
    });
  }

  async function search(query, topK, opts) {
    if (!ready || !matrix) return [];
    if (!query || !String(query).trim()) return [];
    opts = opts || {};
    var qVec = await embedQuery(String(query));
    return rankInto(qVec, opts.kind || null, topK || 8, opts.minScore);
  }

  async function searchMulti(query, perDim, kinds) {
    if (!ready || !matrix) return {};
    if (!query || !String(query).trim()) return {};
    kinds = kinds || DIMS;
    var t0 = now();
    var qVec = await embedQuery(String(query));
    var ms = Math.round(now() - t0);
    var out = {};
    kinds.forEach(function (k) { out[k] = rankInto(qVec, k, perDim || 5); });
    log('searchMulti：编码 ' + ms + 'ms，维度 ' + kinds.length + '，每维 ' + (perDim || 5) + ' 条');
    out._ms = ms;
    return out;
  }

  async function searchByDimension(query, perDim, kinds) { return searchMulti(query, perDim, kinds); }

  global.SemanticSearch = {
    init: init,
    search: search,
    searchMulti: searchMulti,
    searchByDimension: searchByDimension,
    clearCache: function () { try { localStorage.removeItem('promptlab_sem_v1'); } catch (e) {} },
    get isReady() { return ready; },
    get error() { return lastError; },
    get stats() { return { entries: entries.length, dim: dim, ready: ready, diag: diag }; },
    config: CFG
  };
})(typeof window !== 'undefined' ? window : this);
