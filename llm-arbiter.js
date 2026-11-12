/* ============================================================
 * PromptLab V5.1 — LLM 决策层（Arbiter）+ 路由 + 反思
 * ------------------------------------------------------------
 * 三个能力，共用一层 HTTP 调用（callLLM）：
 *
 *   1. route(input)                    第一跳：这是查询？闲聊？确认？
 *                                      需不需要查词库？只查哪几个维度？
 *   2. decide(input, candidates)       第二跳：在候选内选词（原 V5 行为，未改）
 *   3. decideWithReflection(...)       第二跳 + 校验回环：校验失败 → 告诉模型错在哪 → 重生成
 *
 * 依赖：config.local.js（window.LLM_CONFIG）
 * 用法：
 *   LLMArbiter.configure(window.LLM_CONFIG);
 *   const r  = await LLMArbiter.route('阴森的老房子，晚上有雾');
 *   const by = await SemanticSearch.searchMulti(q, 5, r.dims);
 *   const d  = await LLMArbiter.decideWithReflection(q, by, {maxRetries:1});
 *
 * 失败一律返回 {ok:false, error}，调用方回退到 A2 的原始 top1。
 * ============================================================ */
(function (global) {
  'use strict';

  var DIM_CN = {
    subject: '主体物',
    role: '角色', scene: '场景', style: '风格', light: '光线',
    composition: '构图', color: '色彩', atmosphere: '氛围', quality: '画质'
  };
  var DIM_ORDER = ['subject', 'role', 'scene', 'style', 'light', 'composition', 'color', 'atmosphere', 'quality'];

  var CFG = {
    endpoint: '',
    key: '',
    model: 'deepseek-flash',
    temperature: 0.2,
    maxTokens: 1500,
    timeoutMs: 24000,
    routeTimeoutMs: 12000,
    // 选中项分数低于这个值 → 标为「近似」。
    // 实测依据：10 条真实输入里低分群 0.384–0.448、高分群 0.533–0.603，中间是空的。
    weakThreshold: 0.48
  };

  var lastRaw = null, lastUsage = null, lastError = null, lastRoute = null;

  function configure(c) {
    if (!c) return;
    for (var k in c) { if (Object.prototype.hasOwnProperty.call(c, k)) CFG[k] = c[k]; }
    log('配置：endpoint=' + CFG.endpoint + ' model=' + CFG.model + ' key=' + (CFG.key ? '已设置(' + CFG.key.length + '位)' : '缺失'));
  }

  function log() {
    var a = Array.prototype.slice.call(arguments);
    a.unshift('[arbiter]');
    console.log.apply(console, a);
  }
  function now() { return (typeof performance !== 'undefined' ? performance.now() : Date.now()); }

  /* ============================================================
   * 底层：一次 JSON 模式的 LLM 调用（decide / route / 反思共用）
   * ============================================================ */

  function parseJsonLoose(content) {
    if (!content) return null;
    try { return JSON.parse(content); } catch (e) {}
    // 容错：模型偶尔会包 ```json 或前后带解释
    var m = String(content).match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch (e2) {} }
    return null;
  }

  /* 服务端代理（2026-11-11）
     ------------------------------------------------------------
     原来 key 是随页面下发的（<script src="config.local.js">），
     谁能打开页面谁就能拿走，为了封这个洞，那个文件现在返回 404。
     结果就是「语义检索 + 约束决策」面板每一跳都报
     「未配置 endpoint 或 key（检查 config.local.js）」——
     可那个文件本身是好的，是故意不让浏览器读。这句提示指向了一个永远查不出问题的地方。

     现在：有 key（本地联调）就直接调；没有 key 就走 /api/chat，
     key 留在服务端，浏览器只发 messages。两边都是 OpenAI 兼容格式，下面的解析不用改。 */
  function proxyUrl() {
    try {
      if (typeof location !== 'undefined' && /^https?:/i.test(location.protocol || '')) {
        return '/api/chat';
      }
    } catch (e) {}
    return null;
  }

  async function callLLM(messages, opts) {
    opts = opts || {};

    var timeoutMs = opts.timeoutMs || CFG.timeoutMs;
    var body = {
      model: opts.model || CFG.model,
      messages: messages,
      temperature: typeof opts.temperature === 'number' ? opts.temperature : CFG.temperature,
      max_tokens: opts.maxTokens || CFG.maxTokens,
      response_format: { type: 'json_object' },
      stream: false
    };

    var url, headers;
    if (CFG.endpoint && CFG.key && !opts.viaServer) {
      // 本地联调：浏览器直连（key 在场时才有这条路）
      url = CFG.endpoint.replace(/\/+$/, '') + '/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CFG.key };
    } else {
      var p = proxyUrl();
      if (!p) {
        return { ok: false, error: '没有 API key，也没有本地服务。/api/chat 需要先启动 serve.py。' };
      }
      url = p;
      // 服务端只要 OpenAI 兼容字段；model 由服务端决定，传了也会被忽略
      body = {
        messages: messages,
        temperature: body.temperature,
        max_tokens: body.max_tokens,
        json: true
      };
      headers = (typeof plHeaders === 'function')
        ? plHeaders({ 'Content-Type': 'application/json' })
        : { 'Content-Type': 'application/json' };
    }

    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs) : null;
    var t0 = now();

    try {
      var resp = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        signal: ctrl ? ctrl.signal : undefined
      });

      if (!resp.ok) {
        var txt = await resp.text();
        // 服务端代理会把原因放在 error 字段里，比裸文本好读
        var hint = txt;
        try {
          var ej = JSON.parse(txt);
          if (ej && ej.error) hint = ej.error;
        } catch (e0) {}
        var msg = 'HTTP ' + resp.status + '：' + String(hint).slice(0, 300);
        log('请求失败', msg);
        return { ok: false, error: msg, ms: Math.round(now() - t0) };
      }

      // 注意：时间必须算到 json() 之后。只算到响应头会漏掉 4–6 秒的真实生成时间。
      var data = await resp.json();
      var ms = Math.round(now() - t0);

      var content = (data.choices && data.choices[0] && data.choices[0].message)
        ? data.choices[0].message.content : '';
      var parsed = parseJsonLoose(content);
      if (!parsed) {
        return { ok: false, error: '模型返回的不是合法 JSON', raw: content, ms: ms };
      }
      return { ok: true, data: parsed, raw: content, usage: data.usage || null, ms: ms };

    } catch (e) {
      var ms2 = Math.round(now() - t0);
      if (e && e.name === 'AbortError') {
        log('超时', timeoutMs + 'ms');
        return { ok: false, error: '请求超时（' + timeoutMs + 'ms）', ms: ms2 };
      }
      log('异常', e && e.message);
      return { ok: false, error: (e && e.message) || '未知错误', ms: ms2 };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /* ============================================================
   * 第一跳：路由（router）
   * 输出：{intent, needRetrieval, dims[], reason}
   * 作用：闲聊不检索、确认类窄检索、创作类只查用户真正提到的维度
   * ============================================================ */

  var INTENTS = ['compose', 'chat', 'confirm'];

  function buildRouteMessages(userInput) {
    var sys = [
      '你是意图路由器。你不创作、不改写，只做分类和检索范围判断。',
      '输出必须是严格 JSON，不要任何解释文字、不要 markdown 代码块。'
    ].join('\n');

    var user = [
      '用户输入：',
      '"""' + userInput + '"""',
      '',
      '判断三件事：',
      '',
      '1) intent：',
      '   - compose：想生成或优化图像/视频的提示词（在描述画面、主体、风格、光线、氛围等）',
      '   - chat   ：闲聊、提问、与出图无关的对话',
      '   - confirm：确认、追问、微调上一条结果（如"就这样""换个颜色""再冷一点"）',
      '',
      '2) needRetrieval：是否需要查词库。chat 一律 false；confirm 视情况。',
      '',
      '3) dims：需要查哪些维度。只能从下面 9 个里选，并且**只选用户真正提到的**：',
      '   subject(主体物，如剑/灯笼/机械臂这类具体东西) role(角色) scene(场景) style(风格) light(光线)',
      '   composition(构图) color(色彩) atmosphere(氛围) quality(画质)',
      '   例：「阴森的老房子，晚上有雾」→ ["scene","light","atmosphere"]（没说风格就不选 style）',
      '   宁可少选，不要为了填满而多选。用户没提到的一律不选。',
      '',
      '输出 JSON（严格按这个结构，不要多字段）：',
      '{',
      '  "intent": "compose",',
      '  "needRetrieval": true,',
      '  "dims": ["scene", "atmosphere"],',
      '  "reason": ""',
      '}'
    ].join('\n');

    return [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ];
  }

  async function route(userInput, opts) {
    opts = opts || {};
    lastRoute = null;

    var input = userInput == null ? '' : String(userInput).trim();
    if (!input) return { ok: false, error: '输入为空' };

    var r = await callLLM(buildRouteMessages(input), {
      maxTokens: opts.maxTokens || 400,
      temperature: typeof opts.temperature === 'number' ? opts.temperature : 0,
      timeoutMs: opts.timeoutMs || CFG.routeTimeoutMs
    });
    if (!r.ok) return { ok: false, error: r.error, ms: r.ms };

    var d = r.data || {};

    var intent = String(d.intent == null ? '' : d.intent).toLowerCase().trim();
    if (INTENTS.indexOf(intent) < 0) intent = 'compose';   // 保守：认不出来就按创作走

    var need = (d.needRetrieval === true);
    if (intent === 'chat') need = false;                   // 闲聊绝不检索

    // dims 白名单过滤 → 去重 → 按固定顺序
    var raw = Array.isArray(d.dims) ? d.dims : [];
    var picked = {};
    var invalid = 0;
    raw.forEach(function (x) {
      var k = String(x == null ? '' : x).toLowerCase().trim();
      if (DIM_ORDER.indexOf(k) >= 0) picked[k] = true;
      else invalid++;
    });
    var dims = DIM_ORDER.filter(function (k) { return picked[k]; });

    // 该检索但一个维度都没给 → 兜底全查（宁可多查，不漏）
    if (need && !dims.length) dims = DIM_ORDER.slice();

    lastRoute = {
      ok: true,
      intent: intent, needRetrieval: need, dims: dims,
      reason: String(d.reason || ''), raw: r.raw, usage: r.usage, ms: r.ms,
      dimsDropped: invalid
    };
    log('route：intent=' + intent + ' needRetrieval=' + need +
        ' dims=[' + dims.join(',') + '] ' + r.ms + 'ms');
    return lastRoute;
  }

  /* ============================================================
   * 第二跳：决策（原 V5 行为，逻辑未改动）
   * ============================================================ */

  function buildCandidatesText(candidates) {
    var lines = [];
    DIM_ORDER.forEach(function (kind) {
      var list = candidates[kind];
      if (!list || !list.length) return;
      var names = list.map(function (h) {
        var d = (h.zh || h.name || '').replace(/\s+/g, ' ').trim();
        if (d.length > 34) d = d.slice(0, 34) + '…';
        return d ? (h.name + '（' + d + '）') : h.name;
      });
      lines.push('- ' + DIM_CN[kind] + ' [' + kind + ']：' + names.join(' | '));
    });
    return lines.join('\n');
  }

  function buildMessages(userInput, candidates, retryHint) {
    var sys = [
      '你是提示词装配器。你只能从给定候选里选词，绝不能发明候选之外的词。',
      '你的任务不是"尽量填满"，而是"只填用户真正提到的"，宁可留空也不要硬凑。',
      '输出必须是严格 JSON，不要任何解释文字、不要 markdown 代码块。'
    ].join('\n');

    var parts = [
      '用户需求：',
      '"""' + userInput + '"""',
      '',
      '候选词库（每类只能选 1 个，且必须是候选原文之一）：',
      buildCandidatesText(candidates),
      '',
      '★ 第 0 步（必须先做）：判断用户这句话是不是在描述一个想要的画面 / 图像 / 视频。',
      '  - 如果不是（闲聊、「帮我写首诗」这类创作指令、问你是谁、与出图无关）',
      '    → 9 个维度**全部 null**，reason 写「非出图需求」，conflicts 留空。',
      '    **不要因为词库里有相近词就硬填。**',
      '  - **特别注意**：用户用**诗句 / 古文 / 四字短语 / 意象堆叠**来描述画面时',
      '    （例：「野径无人，风自过林」「冷风秋瑟瑟」「大漠孤烟直」），**这是出图需求**，',
      '    要正常检索，不要判成「写诗」。「帮我写一首诗」才是指令，「野径无人」是画面描述。',
      '  - 如果是 → 继续按下面规则走。',
      '',
      '规则：',
      '1. 每个类别的值必须是该类候选里的**原文**，或 null。',
      '2. 用户需求里**没有体现**的类别 → 输出 null。例：只说房子没有人，角色就是 null。',
      '   但必须区分两种情况，别混：',
      '   - 用户**完全没提**这一类 → null',
      '   - 用户**提了**这一类、但候选只有近似项（例：说"老房子"，候选是"老式卧室"）',
      '     → 选语义最接近的那个，并在 reason 里用「近似」二字标注。**不要因为有偏差就留空。**',
      '3. 必须做一致性检查并排除矛盾项，例如：',
      '   - 时间矛盾："晚上/夜晚/深夜" 不能配 "晨雾光/清晨/拂晓/正午"',
      '   - 情绪矛盾："决斗/战斗/肃穆/悲壮" 不能配 "欣喜/欢快/轻松"',
      '   - 天气矛盾："下雨/暴雨" 不能配 "晴空/烈日"',
      '   - 风格与题材矛盾：写实摄影 不能配 魔法/精灵 类主体',
      '4. 若某类候选全部与需求矛盾，该类输出 null，并写进 conflicts。',
      '5. **重要例外**：如果用户在需求里**主动同时提出了**两个互斥的东西',
      '   （例："深夜的老房子，要晨雾光那种清透感"），那是用户要的反差效果，不是错误。',
      '   → 全部保留，不要置 null，并在 reason 里注明"用户指定的反差"。',
      '   只有"候选与用户整体意图冲突"时才排除；用户明确点名的词，一律保留。',
      '6. conflicts 最多 4 条、每条不超过 40 字，只写最重要的，不要逐条罗列。',
      '7. reason 只写一句话，不超过 40 字。不要复述规则，不要逐维度解释。',
      '8. 只有评价词、没有画面线索时（如"很漂亮""高级感""好看的""有质感"），',
      '   对应维度**留空**，不要从候选里硬挑一个。评价词不是画面特征，无法检索。',
      '   例："一个很漂亮的场景" → scene 也留空，因为没有线索能判断是哪个场景。',
      '9. 必须输出 intent，三选一（这是给下游判断要不要反问用户用的）：',
      '   - "compose"：是出图需求，且至少能确定一个维度',
      '   - "chat"   ：不是出图需求（闲聊、命令、提问、让我写文章/写诗）',
      '   - "unclear"：**是**出图需求，但一个维度都确定不了（例："一个很漂亮的场景"）',
      '   compose 与 unclear 的区别只有一个：有没有确定任何一个维度。',
      '',
      '输出 JSON（严格按这个结构，不要多字段）：',
      '{',
      '  "intent": "compose",',
      '  "subject": null,',
      '  "role": null,',
      '  "scene": null,',
      '  "style": null,',
      '  "light": null,',
      '  "composition": null,',
      '  "color": null,',
      '  "atmosphere": null,',
      '  "quality": null,',
      '  "conflicts": [],',
      '  "reason": ""',
      '}'
    ];

    if (retryHint) {
      parts.push('');
      parts.push('【上一次回答被校验拒绝，请修正】');
      parts.push(retryHint);
      parts.push('重新输出完整 JSON。不要解释，不要道歉，只输出 JSON。');
    }

    return [
      { role: 'system', content: sys },
      { role: 'user', content: parts.join('\n') }
    ];
  }

  /* ---------- 校验模型输出 ---------- */

  function metaOf(list, h, match) {
    if (!h) return null;
    return {
      score: (typeof h.score === 'number') ? h.score : null,
      rank: list.indexOf(h) + 1,
      match: match
    };
  }

  function validate(decision, candidates) {
    var problems = [];
    var clean = {};
    var meta = {};
    DIM_ORDER.forEach(function (kind) {
      var v = decision ? decision[kind] : null;
      if (v === null || v === undefined || v === '' || v === 'null') { clean[kind] = null; return; }
      var list = candidates[kind] || [];
      var hit = list.filter(function (h) { return h.name === v || (h.zh && h.zh === v); })[0];
      if (hit) { clean[kind] = hit.name; meta[kind] = metaOf(list, hit, 'exact'); }
      else {
        // 宽容一档：模型可能返回了带描述的文本，尝试包含匹配
        var loose = list.filter(function (h) { return String(v).indexOf(h.name) >= 0 || h.name.indexOf(String(v)) >= 0; })[0];
        if (loose) {
          clean[kind] = loose.name;
          meta[kind] = metaOf(list, loose, 'fuzzy');
          problems.push(kind + ' 由模糊匹配修正为「' + loose.name + '」');
        } else {
          clean[kind] = null;
          problems.push(kind + ' 返回了候选外的值「' + v + '」，已丢弃');
        }
      }
    });
    var rawIntent = String((decision && decision.intent) || '').toLowerCase().trim();
    // 默认 compose：认不出来时不反问，避免打扰用户
    clean.intent = (rawIntent === 'chat' || rawIntent === 'unclear') ? rawIntent : 'compose';
    clean.conflicts = Array.isArray(decision && decision.conflicts) ? decision.conflicts : [];
    clean.reason = (decision && decision.reason) || '';
    clean._meta = meta;
    clean._problems = problems;
    return clean;
  }

  /* ---------- 程序化矛盾检测（反思的硬依据） ---------- */
  /* 模型自己会报 conflicts，但它也会漏。这里是第二次独立检查：
     选中项之间如果跨了矛盾的语义组，就算冲突。 */

  var CONFLICT_RULES = [
    {
      name: '时间',
      groups: [
        { tag: '夜晚', words: ['夜晚', '深夜', '午夜', '夜景', '月夜', '黑夜', '晚上', '夜市'] },
        { tag: '白昼', words: ['清晨', '拂晓', '黎明', '早晨', '正午', '白昼', '午间', '晨雾', '日出', '清晨光'] }
      ]
    },
    {
      name: '天气',
      groups: [
        { tag: '雨', words: ['暴雨', '小雨', '雨夜', '雨中', '雷雨', '下雨'] },
        { tag: '晴', words: ['晴空', '晴朗', '阳光明媚', '烈日', '晴天'] }
      ]
    },
    {
      name: '情绪',
      groups: [
        { tag: '紧绷', words: ['决斗', '战斗', '肃穆', '悲壮', '对峙', '压抑', '阴森'] },
        { tag: '轻松', words: ['欣喜', '欢快', '轻松', '愉悦', '甜蜜', '温馨', '浪漫'] }
      ]
    }
  ];

  function checkConflicts(clean) {
    var hits = [];
    CONFLICT_RULES.forEach(function (rule) {
      var found = {};
      DIM_ORDER.forEach(function (kind) {
        var v = clean[kind];
        if (!v) return;
        var s = String(v);
        for (var gi = 0; gi < rule.groups.length; gi++) {
          var g = rule.groups[gi];
          for (var wi = 0; wi < g.words.length; wi++) {
            if (s.indexOf(g.words[wi]) >= 0) {
              (found[g.tag] = found[g.tag] || []).push(kind + ':' + v);
              break;
            }
          }
        }
      });
      var tags = Object.keys(found);
      if (tags.length >= 2) {
        hits.push({
          rule: rule.name,
          detail: tags.map(function (t) { return t + '→' + found[t].join('、'); }).join('  ×  ')
        });
      }
    });
    return hits;
  }

  /* ---------- 问题分级：哪些值得重试，哪些不值得 ---------- */

  function classifyProblems(problems) {
    var hard = [], soft = [];
    (problems || []).forEach(function (p) {
      // 「候选外的值」= 模型发明了词，违反硬约束 → 必须重试
      if (String(p).indexOf('候选外的值') >= 0) hard.push(p);
      else soft.push(p);   // 模糊匹配被修正 = 已经救回来了，不必重试
    });
    return { hard: hard, soft: soft };
  }

  /* ---------- C：近似项标记 ---------- */
  /* 分数低于阈值的选中项，本质是"没有真正的候选但它还是选了一个"，
     必须标出来，否则用户会把猜的当答案。 */

  function isWeak(decision, kind) {
    if (!decision || !decision[kind]) return false;
    var m = decision._meta && decision._meta[kind];
    if (!m || m.score == null) return false;   // 没分数信息（如桩数据）→ 不标记
    return m.score < CFG.weakThreshold;
  }

  function weakDims(decision) {
    var out = [];
    DIM_ORDER.forEach(function (k) {
      if (decision && decision[k] && isWeak(decision, k)) out.push(k);
    });
    return out;
  }

  /* ---------- B：反问时给候选 ---------- */
  /* 反问只有两种情况值得打断用户：
     1) intent = unclear（一个维度都定不了）
     2) 有内容但「主体物 / 角色 / 场景」全空 —— 画面是什么都不知道
     选项直接来自已检索到的 top 候选，用户点一下就等于补齐，无需重新检索。 */

  var KEY_DIMS = ['subject', 'role', 'scene'];

  function buildClarify(decision, byDim) {
    var d = decision || {};
    var intent = d.intent || 'compose';
    if (intent === 'chat') return null;                 // 非出图需求，不追问

    var unclear = (intent === 'unclear');
    var keyEmpty = KEY_DIMS.every(function (k) { return !d[k]; });
    if (!unclear && !keyEmpty) return null;             // 已知画什么，只标近似，不追问

    var options = [];
    KEY_DIMS.forEach(function (k) {
      var list = (byDim && byDim[k]) || [];
      list.slice(0, 2).forEach(function (h) {
        options.push({ dim: k, dimCN: DIM_CN[k], name: h.name, score: h.score });
      });
    });
    if (!options.length) return null;

    return {
      reason: unclear ? 'unclear' : 'missing-key',
      question: unclear
        ? '这句话我还判断不出画什么。你要画的是下面哪一个？'
        : '画面里主要是什么？选一个，或者说一句你自己的。',
      options: options,
      freeText: true
    };
  }

  /* ---------- B+：unclear 时让 LLM 生成针对性追问 ---------- */
  /* 为什么需要：unclear 的检索结果本身就没有相关性，
     把"分数靠前的词"当选项给用户，是最差的一种打断。
     这里改为让模型写一句追问 + 3–5 个语义互斥的选项。 */

  function buildSuggestMessages(userInput) {
    var sys = [
      '你在帮用户细化一个出图需求。用户这句话信息不足，判断不出具体画面。',
      '你的任务是写一句最有效的追问，并给出可直接点选的选项。',
      '输出必须是严格 JSON，不要任何解释文字、不要 markdown 代码块。'
    ].join('\n');

    var user = [
      '用户原话：',
      '"""' + userInput + '"""',
      '',
      '写一句追问 + 3–5 个选项。要求：',
      '1. 追问要短（不超过 25 字），直接问他缺的那部分',
      '2. 选项必须是**具体、可直接用于出图的中文短语**（4–12 字）',
      '3. 选项之间必须互斥、覆盖主要方向，不要同义重复',
      '4. 选项不要加序号、不要加解释',
      '例：用户说"一个很漂亮的场景" →',
      '   question: "漂亮的场景有很多种，你更接近哪种？"',
      '   options: ["自然山水风景","城市街道夜景","室内空间","幻想世界","复古怀旧"]',
      '',
      '输出 JSON（严格按这个结构）：',
      '{',
      '  "question": "",',
      '  "options": []',
      '}'
    ].join('\n');

    return [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ];
  }

  async function suggestClarify(userInput, opts) {
    opts = opts || {};
    var input = userInput == null ? '' : String(userInput).trim();
    if (!input) return null;

    var r = await callLLM(buildSuggestMessages(input), {
      maxTokens: opts.maxTokens || 900,
      temperature: 0.5,
      timeoutMs: opts.timeoutMs || 12000
    });
    if (!r.ok) { log('suggestClarify 失败：' + r.error); return null; }

    var d = r.data || {};
    var q = String(d.question || '').trim();
    var opts2 = Array.isArray(d.options) ? d.options : [];
    opts2 = opts2.map(function (x) {
      return String(x == null ? '' : x).trim();
    }).filter(function (x) { return x.length > 0 && x.length <= 20; });
    // 去重
    var seen = {}, uniq = [];
    opts2.forEach(function (x) { if (!seen[x]) { seen[x] = 1; uniq.push(x); } });
    if (!q || uniq.length < 2) return null;

    return {
      reason: 'unclear-llm',
      question: q,
      options: uniq.slice(0, 5).map(function (x) {
        return { dim: 'free', dimCN: '', name: x, score: null };
      }),
      freeText: true,
      ms: r.ms,
      usage: r.usage || null
    };
  }

  /* ---------- 主调用（单次，无反思） ---------- */

  async function decide(userInput, candidates, opts) {
    opts = opts || {};
    lastError = null; lastRaw = null; lastUsage = null;

    var input = userInput == null ? '' : String(userInput).trim();
    if (!input) {
      lastError = new Error('输入为空');
      return { ok: false, error: lastError.message };
    }

    var r = await callLLM(buildMessages(input, candidates || {}, null), opts);
    if (!r.ok) { lastError = new Error(r.error); return { ok: false, error: r.error, raw: r.raw, ms: r.ms }; }

    lastRaw = r.raw; lastUsage = r.usage;
    var decision = validate(r.data, candidates || {});
    return { ok: true, decision: decision, raw: r.raw, usage: r.usage, ms: r.ms };
  }

  /* ---------- 主调用（带反思回环） ---------- */

  async function decideWithReflection(userInput, candidates, opts) {
    opts = opts || {};
    lastError = null; lastRaw = null; lastUsage = null;

    var input = userInput == null ? '' : String(userInput).trim();
    if (!input) return { ok: false, error: '输入为空', attempts: [] };

    var maxRetries = (typeof opts.maxRetries === 'number') ? opts.maxRetries : 1;
    var attempts = [];
    var hint = null;
    var lastGood = null;

    for (var i = 0; i <= maxRetries; i++) {
      var t0 = now();
      var r = await callLLM(buildMessages(input, candidates || {}, hint), opts);
      var ms = r.ms != null ? r.ms : Math.round(now() - t0);

      var att = {
        attempt: i + 1, ms: ms, ok: false,
        error: null, problems: [], conflicts: [], hint: hint
      };
      attempts.push(att);

      /* --- 调用层失败 --- */
      if (!r.ok) {
        att.error = r.error;
        lastError = new Error(r.error);
        var retryable = String(r.error).indexOf('不是合法 JSON') >= 0;
        if (retryable && i < maxRetries) {
          hint = '你上一次的输出不是合法 JSON，无法解析。只输出一个 JSON 对象，不要任何说明文字，不要 ``` 代码块包裹。';
          att.willRetry = true;
          continue;
        }
        // 超时 / 网络 / HTTP 错误：再试一次大概率也超时，直接失败
        return { ok: false, error: r.error, attempts: attempts, ms: ms };
      }

      /* --- 调用成功，进入校验 --- */
      lastRaw = r.raw; lastUsage = r.usage;
      var decision = validate(r.data, candidates || {});
      var cls = classifyProblems(decision._problems);
      var conflicts = checkConflicts(decision);

      att.ok = true;
      att.problems = decision._problems || [];
      att.conflicts = conflicts;
      att.picked = DIM_ORDER.filter(function (k) { return !!decision[k]; })
        .map(function (k) { return k + '=' + decision[k]; });

      lastGood = { decision: decision, raw: r.raw, usage: r.usage, ms: ms };

      /* --- 通过 --- */
      if (!cls.hard.length && !conflicts.length) {
        decision._reflection = { retries: i, attempts: attempts.length, degraded: false };
        return {
          ok: true, decision: decision, attempts: attempts, retries: i,
          raw: r.raw, usage: r.usage, ms: ms
        };
      }

      /* --- 还有重试次数 → 组织纠错提示 --- */
      if (i < maxRetries) {
        var lines = [];
        if (cls.hard.length) {
          lines.push('你上一次输出了候选之外的词：' + cls.hard.join('；') +
                     '。每个维度只能返回候选原文，或者 null。');
        }
        if (conflicts.length) {
          lines.push('你上一次的选择互相矛盾：' + conflicts.map(function (c) { return '[' + c.rule + '] ' + c.detail; }).join('；') +
                     '。请把与用户需求不符的那一项改为 null（若用户确实同时要求两者，就在 reason 里说明保留哪一项）。');
        }
        hint = lines.join('\n');
        att.willRetry = true;
        continue;
      }

      /* --- 次数用尽 → 降级返回（去掉非法值，保留能用的部分） --- */
      decision._reflection = { retries: i, attempts: attempts.length, degraded: true };
      return {
        ok: true, decision: decision, attempts: attempts, retries: i,
        degraded: true, raw: r.raw, usage: r.usage, ms: ms
      };
    }

    // 理论上到不了这里
    if (lastGood) {
      lastGood.decision._reflection = { retries: maxRetries, attempts: attempts.length, degraded: true };
      return { ok: true, decision: lastGood.decision, attempts: attempts, retries: maxRetries, degraded: true };
    }
    return { ok: false, error: (lastError && lastError.message) || '未知错误', attempts: attempts };
  }

  global.LLMArbiter = {
    configure: configure,

    // 第一跳
    route: route,

    // 第二跳
    decide: decide,
    decideWithReflection: decideWithReflection,

    // 工具
    buildCandidatesText: buildCandidatesText,
    checkConflicts: checkConflicts,
    /* 下游用这个决定要不要反问用户：只有 unclear 才问 */
    // C：近似标记
    isWeak: isWeak,
    weakDims: weakDims,
    // B：带候选的反问
    buildClarify: buildClarify,
    // B+：unclear 时让模型生成针对性追问（异步，需额外一次调用）
    suggestClarify: suggestClarify,
    needsClarification: function (decision) {
      return !!(decision && decision.intent === 'unclear');
    },
    buildClarifyQuestion: function (decision) {
      if (!decision || decision.intent !== 'unclear') return null;
      return '这句话我还判断不出具体画面。你想画的是哪一类？\n' +
             '· 一个东西（剑 / 灯笼 / 机械臂…）\n' +
             '· 一个人（职业、动作、气质）\n' +
             '· 一个地方（室内 / 室外 / 自然 / 城市）\n' +
             '· 一种感觉（氛围 / 情绪）';
    },

    get config() { return CFG; },
    get lastRaw() { return lastRaw; },
    get lastUsage() { return lastUsage; },
    get error() { return lastError; },
    get lastRoute() { return lastRoute; },
    dimensionOrder: DIM_ORDER,
    dimensionCN: DIM_CN,
    conflictRules: CONFLICT_RULES
  };
})(typeof window !== 'undefined' ? window : this);
