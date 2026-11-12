/* ============================================================
 * PromptLab — 语义 9 维面板（A2 检索 + B 决策 的接入层）
 * ------------------------------------------------------------
 * 设计原则：**不改 app.js 一行**。
 *   - 独立创建一个浮动面板，挂到 body 尾部
 *   - 读取 #promptInput 的值，跑 A2（向量检索）+ B（LLM 约束决策）
 *   - 结果与现有本地引擎并列展示，互不干扰
 *   - 依赖缺失 / 服务不可用时自动隐藏，绝不影响主工具
 *
 * 依赖：config.local.js、semantic-search.js、llm-arbiter.js
 * ============================================================ */
(function () {
  'use strict';

  if (typeof SemanticSearch === 'undefined' || typeof LLMArbiter === 'undefined') {
    console.warn('[agent-panel] 缺少 semantic-search.js / llm-arbiter.js，面板未启用');
    return;
  }

  // 2026-11-11：key 不再随页面下发（config.local.js 里有明文 key，已被 serve.py 的
  // 静态白名单挡掉）。没有 LLM_CONFIG 不是错误——llm-arbiter 会自动改走服务端
  // /api/chat，key 留在服务端。只有「连服务端也没有」时，才会在面板里报错。
  if (window.LLM_CONFIG) {
    LLMArbiter.configure(window.LLM_CONFIG);
  } else {
    console.info('[agent-panel] 没有 window.LLM_CONFIG，LLM 决策将走服务端代理 /api/chat（正常情况）。');
    window.__agentPanelViaServer = true;
  }

  var DIMS = LLMArbiter.dimensionOrder;      // 9 维
  var CN = LLMArbiter.dimensionCN;

  var root = null, panel = null, bodyEl = null, statusEl = null, resultEl = null;
  var open = false, busy = false, ready = false;

  /* ---------------- 精确命中优先（2026-11-11） ----------------
     问题：面板的候选只来自 SemanticSearch 的语义近邻。
     输入「扎纸匠」时，词库里**已经有**「扎纸匠」这个词条（第 3 层推理补进来的），
     面板却给了「工匠 0.509 / 纸雕 0.454 / 古朴 0.301」三个近似映射，
     还把两个标成「猜测」——明明认识，却按不认识处理。

     规则和主流程一样（app.js 的 matchByEntryName）：
     用户原话里出现的库名，比语义近邻可靠得多，应该直接占满候选位。
     所以把精确命中塞到列表最前面，分数给 1.0，并标 exact。 */
  var DIM2KW = {
    role: 'character', scene: 'scene', style: 'style', light: 'lighting',
    composition: 'composition', color: 'color', atmosphere: 'atmosphere', quality: 'quality'
  };

  function withExactHits(q, byDim) {
    // 主流程的判定结果也要并进来（2026-11-11，用户录屏第三次暴露这个问题）
    // ------------------------------------------------------------
    // 面板原来只有「语义近邻 + 精确库名」，而主流程那条链上有
    // 概念映射 / 地点规则 / 地域规则 / 年代闸门 —— 全是今天加的，面板一概没跟。
    // 结果：一个少年站在雨夜祠堂前，主流程给「东方奇幻」，面板给「霓虹夜景」。
    // 两边各算一遍必然分叉，所以这里直接吃主流程的 detectDimensions 结果，
    // 当成 score=1 的候选塞进最前面。
    var det = null;
    try {
      if (typeof detectDimensions === 'function') {
        det = detectDimensions(q, (typeof currentMode !== 'undefined' ? currentMode : 'character'));
      }
    } catch (e) { det = null; }

    var out = {};
    DIMS.forEach(function (dim) {
      var list = (byDim && byDim[dim]) ? byDim[dim].slice() : [];
      var kwDim = DIM2KW[dim];
      var seen = {};

      // ① 主流程已经判定的，最优先
      var detected = det && kwDim && det[kwDim] && det[kwDim].detected;
      if (detected) {
        list = [{
          name: detected,
          zh: '',
          score: 1,
          exact: true,
          fromDetection: true
        }].concat(list.filter(function (x) {
          return x && x.name !== detected;
        }));
        seen[detected] = true;
      }

      // ② 用户原话里出现的库名（最长优先）
      var cats = (kwDim && typeof KW_DB !== 'undefined' && KW_DB[kwDim] && KW_DB[kwDim].categories) || null;
      if (cats) {
        var hits = [];
        for (var name in cats) {
          if (Object.prototype.hasOwnProperty.call(cats, name) && String(q).indexOf(name) >= 0) {
            hits.push(name);
          }
        }
        hits.sort(function (a, b) { return b.length - a.length; });
        var exact = [];
        hits.forEach(function (n) {
          if (seen[n]) return;
          seen[n] = true;
          if (exact.length >= 2) return;
          var c = cats[n];
          exact.push({ name: n, zh: (c && c.zh && c.zh.core) || '', score: 1, exact: true });
        });
        if (exact.length) {
          list = list.filter(function (x) { return x && !seen[x.name]; });
          list = exact.concat(list.filter(function (x) {
            return exact.every(function (e2) { return e2.name !== x.name; });
          }));
        }
      }

      out[dim] = list.slice(0, 6);
    });
    return out;
  }
  // 给离线测试用（_dev/verify-panel-exact.js）
  window.__agentPanelInternals = { withExactHits: withExactHits, DIM2KW: DIM2KW };


  function el(tag, style, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }

  var S = {
    fab: 'position:fixed;right:22px;bottom:22px;z-index:9998;padding:12px 18px;border-radius:999px;' +
         'background:#1b2a3a;color:#7fd7ff;border:1px solid #2c4660;cursor:pointer;' +
         'font-size:13px;font-weight:600;box-shadow:0 6px 22px rgba(0,0,0,.45);font-family:inherit',
    panel: 'position:fixed;right:22px;bottom:78px;width:420px;max-height:72vh;overflow:auto;z-index:9999;' +
           'background:#0e0e1a;color:#e8e8f0;border:1px solid #242438;border-radius:14px;' +
           'box-shadow:0 18px 50px rgba(0,0,0,.6);font-size:13px;line-height:1.6;display:none',
    head: 'display:flex;justify-content:space-between;align-items:center;padding:12px 14px;' +
          'border-bottom:1px solid #242438',
    body: 'padding:12px 14px',
    dim: 'display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px dashed #1d1d2e',
    muted: 'color:#6a6a80',
    opt: 'margin:6px 6px 0 0;padding:6px 11px;border-radius:8px;background:#141422;color:#00d4ff;' +
         'border:1px solid #242438;cursor:pointer;font-size:12.5px;font-family:inherit'
  };

  function build() {
    if (root) return;

    var fab = el('button', S.fab, '语义 9 维');
    fab.setAttribute('type', 'button');
    fab.addEventListener('click', function () {
      open = !open;
      panel.style.display = open ? 'block' : 'none';
      /* 2026-11-11：原来这里是 `if (open && !ready) run();`
         ready 首次成功后恒为 true，于是面板只在第一次打开时分析，
         换输入也不会重跑。现在打开就重跑，ready 只用来决定要不要加载向量库。 */
      if (open) run();
    });

    panel = el('div', S.panel);

    var head = el('div', S.head);
    var title = el('div', null, '语义检索 + 约束决策');
    title.setAttribute('style', 'font-weight:700;font-size:13.5px');
    var close = el('button', 'background:none;border:none;color:#6a6a80;cursor:pointer;font-size:17px', '×');
    close.setAttribute('type', 'button');
    close.addEventListener('click', function () {
      open = false; panel.style.display = 'none';
    });
    head.appendChild(title);
    head.appendChild(close);

    statusEl = el('div', 'padding:9px 14px;color:#6a6a80;font-size:12.5px;border-bottom:1px solid #1d1d2e', '未运行');
    bodyEl = el('div', S.body);
    resultEl = el('div', S.body);

    panel.appendChild(head);
    panel.appendChild(statusEl);
    panel.appendChild(bodyEl);
    panel.appendChild(resultEl);

    root = document.createElement('div');
    root.appendChild(fab);
    root.appendChild(panel);
    document.body.appendChild(root);
  }

  /* ---------------- 工具 ---------------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c];
    });
  }

  function setStatus(t, color) {
    statusEl.textContent = t;
    statusEl.style.color = color || '#6a6a80';
  }

  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () {
        setStatus('已复制到剪贴板', '#38d39f');
      }, function () {
        setStatus('复制失败，请手动选中', '#ff5470');
      });
    } else {
      setStatus('当前环境不支持剪贴板', '#ff5470');
    }
  }

  /* ---------------- 主流程 ---------------- */


  /* 输入变了就重新分析（2026-11-11）
     没有这个之前：面板要手动关掉再打开才会重跑，用户会以为它坏了。 */
  function watchInput() {
    var inp = document.getElementById('promptInput');
    if (!inp || inp.__agentWatched) return;
    inp.__agentWatched = true;
    var timer = null;
    inp.addEventListener('input', function () {
      if (!open) return;                 // 面板没开就不用悄悄花钱
      clearTimeout(timer);
      timer = setTimeout(function () { run(); }, 900);
    });
    inp.addEventListener('change', function () {
      if (!open) return;
      clearTimeout(timer);
      timer = setTimeout(function () { run(); }, 400);
    });
  }

  async function run() {
    if (busy) return;
    var input = document.getElementById('promptInput');
    var q = input ? String(input.value || '').trim() : '';
    if (!q) {
      setStatus('输入框是空的 —— 先在主界面写一句描述', '#ff6b35');
      return;
    }

    busy = true;
    resultEl.innerHTML = '';

    try {
      if (!ready) {
        setStatus('加载向量库…');
        var ok = await SemanticSearch.init({});
        if (!ok) {
          setStatus('向量库不可用：' + ((SemanticSearch.error && SemanticSearch.error.message) || '未知') +
                    '（需要本地 serve.py）', '#ff5470');
          return;
        }
        ready = true;
        var st = SemanticSearch.stats;
        setStatus('就绪：' + st.entries + ' 条 / ' + st.dim + ' 维');
      }

      setStatus('检索 9 维…');
      var byDim = await SemanticSearch.searchMulti(q, 5, DIMS);
      // 精确命中压过语义近邻（「扎纸匠」不该被当成「工匠」）
      byDim = withExactHits(q, byDim);

      setStatus('模型决策…');
      var res = await LLMArbiter.decideWithReflection(q, byDim, { maxRetries: 1 });
      if (!res.ok) {
        setStatus('决策失败：' + res.error, '#ff5470');
        return;
      }

      var d = res.decision;
      setStatus('完成　' + res.attempts.length + ' 次调用' +
                (res.retries ? '（重试 ' + res.retries + '）' : '') +
                (res.usage ? '　token ' + res.usage.prompt_tokens + '/' + res.usage.completion_tokens : ''),
                '#38d39f');

      renderDecision(q, d, byDim);

      /* 把结论交给主流程（2026-11-11）
         主流程 smartFill 之后会调用 applyAgentResult()，只补空维度。
         这里存的是完整裁决对象，主流程自己决定用不用、用哪些。 */
      try {
        window.__agentResult = { text: q, at: Date.now(), decision: d, byDim: byDim };
      } catch (e) {}

      /* intent = unclear 时补一句针对性追问 */
      if (d.intent === 'unclear' && LLMArbiter.suggestClarify) {
        setStatus('生成针对性追问…');
        var cl = null;
        try { cl = await LLMArbiter.suggestClarify(q); } catch (e) { cl = null; }
        if (cl) renderClarify(cl);
        setStatus('完成　（含追问 ' + (cl ? cl.ms + ' ms' : '失败') + '）', '#38d39f');
      } else {
        var cl2 = LLMArbiter.buildClarify ? LLMArbiter.buildClarify(d, byDim) : null;
        if (cl2) renderClarify(cl2);
      }

    } catch (e) {
      setStatus('出错：' + ((e && e.message) || e), '#ff5470');
      console.error('[agent-panel]', e);
    } finally {
      busy = false;
    }
  }

  function renderDecision(q, d, byDim) {
    var weak = LLMArbiter.weakDims ? LLMArbiter.weakDims(d) : [];
    var parts = [];

    parts.push('<div style="margin-bottom:8px">');
    parts.push('<span style="' + S.muted + '">intent</span> <b style="color:#00d4ff">' + esc(d.intent) + '</b>');
    if (weak.length) {
      parts.push('　<span style="color:#ff6b35">其中 ' + weak.length + ' 个是近似</span>');
    }
    parts.push('</div>');

    DIMS.forEach(function (k) {
      var v = d[k];
      var m = d._meta && d._meta[k];
      var isWeak = LLMArbiter.isWeak ? LLMArbiter.isWeak(d, k) : false;
      var right;
      if (v) {
        right = '<b style="color:' + (isWeak ? '#ff6b35' : '#38d39f') + '">' + esc(v) + '</b>';
        if (m && m.score != null) {
          right += '<span style="' + S.muted + ';margin-left:6px;font-size:11.5px">' +
                   m.score + (m.rank ? ' · 第' + m.rank + '名' : '') + '</span>';
        }
        if (isWeak) right += '<span style="color:#ff6b35;font-size:11.5px;margin-left:6px">猜测</span>';
      } else {
        right = '<span style="' + S.muted + '">—</span>';
      }
      parts.push('<div style="' + S.dim + '"><span style="' + S.muted + '">' + CN[k] + '</span>' +
                 '<span>' + right + '</span></div>');
    });

    if (d.reason) {
      parts.push('<div style="' + S.muted + ';margin-top:9px">' + esc(d.reason) + '</div>');
    }

    /* 拼成 prompt 的可用文本 */
    var words = DIMS.filter(function (k) { return d[k]; }).map(function (k) { return d[k]; });
    if (words.length) {
      var line = words.join('，');
      parts.push('<div style="margin-top:11px;padding:9px 11px;background:#0a0a14;border:1px solid #242438;' +
                 'border-radius:8px;word-break:break-all">' + esc(line) + '</div>');
      parts.push('<button type="button" data-copy="' + esc(line) + '" style="' + S.opt + '">复制这 ' +
                 words.length + ' 个词</button>');
    }

    resultEl.innerHTML = parts.join('');

    Array.prototype.forEach.call(resultEl.querySelectorAll('[data-copy]'), function (b) {
      b.addEventListener('click', function () { copyText(b.getAttribute('data-copy')); });
    });
  }

  function renderClarify(cl) {
    var html = '<div style="margin-top:12px;padding:11px;border:1px solid #4a3520;background:#1a1208;border-radius:10px">';
    html += '<div style="color:#ff6b35;font-weight:700;margin-bottom:6px">需要补充</div>';
    html += '<div style="margin-bottom:4px">' + esc(cl.question) + '</div>';
    cl.options.forEach(function (o) {
      html += '<button type="button" data-append="' + esc(o.name) + '" style="' + S.opt + '">' + esc(o.name) + '</button>';
    });
    html += '</div>';

    var box = el('div');
    box.innerHTML = html;
    resultEl.appendChild(box);

    Array.prototype.forEach.call(box.querySelectorAll('[data-append]'), function (b) {
      b.addEventListener('click', function () {
        var input = document.getElementById('promptInput');
        if (!input) return;
        var base = String(input.value || '').trim().replace(/[，,。]\s*$/, '');
        var add = b.getAttribute('data-append');
        input.value = base ? (base + '，' + add) : add;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        run();   // 拼进去之后重跑
      });
    });
  }

  /* ---------------- 启动 ---------------- */

  function boot() {
    try { watchInput(); } catch (e) {}
    try {
      build();
      console.log('[agent-panel] 已启用：右下角「语义 9 维」');
    } catch (e) {
      console.warn('[agent-panel] 初始化失败', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
