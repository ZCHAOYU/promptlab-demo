/* app-assemble.js —— 拼装层：把 fills 拼成句子（模板、连接词变体、场景/角色从句、英文截断、冠词）。
   核心是 buildOptimizedPrompt（574 行）。这一层只读 fills、不决定内容。
   从 app.js 拆出（2026-11-11），只搬函数、不动顶层 const/let。
   加载顺序见 index.html：detect → fill → assemble → ui → app.js。 */

function styleDefault(dim, style, fallback) {
  if (!style) return fallback;
  var D = (typeof window !== 'undefined' && window.__STYLE_DEFAULTS) || null;
  var v = D && D[dim] ? D[dim][style] : null;
  if (!v) return fallback;
  // 候选集：同一个风格有三个都协调的取值，点「换一版」会换一个。
  // 兼容老数据：值是字符串就直接用。
  if (Array.isArray(v)) {
    if (!v.length) return fallback;
    return v[rngPick(v.length)];
  }
  return v;
}

function withSuffix(core, suffix) {
  if (!core) return '';
  var c = String(core).trim();
  if (!suffix) return c;
  if (c.endsWith(suffix)) return c;
  // 「莫兰迪色」+「色调」会拼成「莫兰迪色色调」，去掉重复的那个字
  if (c.charAt(c.length - 1) === suffix.charAt(0)) return c + suffix.slice(1);
  return c + suffix;
}

/* 稳定哈希：只用来选说法，不参与任何判定 */
function connHash(s) {
  var h = 0, t = String(s || '');
  for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 100003;
  return h;
}

function makeRng(seed) {
  var s = (seed >>> 0) || 1;
  return function () {
    s ^= (s << 13); s >>>= 0;
    s ^= (s >> 17);
    s ^= (s << 5); s >>>= 0;
    return s / 4294967296;
  };
}

/* 无放回抽若干个：从池子里取走，不会取到重复项 */
function pickN(list, n, rng) {
  var pool = (list || []).slice();
  var out = [];
  var k = Math.min(n, pool.length);
  for (var i = 0; i < k; i++) {
    var j = Math.floor((rng ? rng() : 0.5) * pool.length);
    if (j >= pool.length) j = pool.length - 1;
    out.push(pool.splice(j, 1)[0]);
  }
  return out;
}

function bumpVariantRound() {
  __variantRound = (__variantRound + 1) % 100000;
  return __variantRound;
}

/* 抽一个 [0, n) 的整数。__rng 为空时退回哈希，保证任何时候都有结果。 */
function rngPick(n) {
  if (!n || n < 1) return 0;
  if (!__rng) return connHash('fallback|' + __connSalt) % n;
  var v = Math.floor(__rng() * n);
  return v >= n ? n - 1 : (v < 0 ? 0 : v);
}

function setConnSalt(s) {
  __connSalt = String(s || '');
  // seed = 输入 + 轮次。同输入同轮次 → 同结果；换一版 → 全变。
  __rng = makeRng(connHash(__connSalt) + __variantRound * 7919);
}

function connPick(family, dim, key) {
  var table = family === 'deep' ? CONN_DEEP_VARIANTS
    : (family === 'prop' ? CONN_PROP_VARIANTS : CONN_TAIL_VARIANTS);
  var list = table && table[dim];
  if (!list || !list.length) return null;
  return list[rngPick(list.length)];
}

/* 标准/基础路径：给类别名加一个后缀 */
function connTail(dim, core) {
  var c = String(core || '');
  if (!c) return '';
  var suf = connPick('tail', dim, c);
  return suf ? withSuffix(c, suf) : c;
}

/* 深度路径：整句说法 */
function connDeep(dim, core) {
  var c = String(core || '');
  if (!c) return '';
  var f = connPick('deep', dim, c);
  return f ? f(c) : c;
}

/* 道具路径：风格 / 氛围（氛围要接背景） */
function connProp(dim, core, bg) {
  var c = String(core || '');
  if (!c) return '';
  var f = connPick('prop', dim, c);
  return f ? f(c, String(bg || '')) : c;
}

function applyEraToFills(fills, text) {
  if (!fills) return fills;
  const t = String(text || '');
  const OLD = /古旧|老式|古董|复古|做旧|年代感|锈蚀|生锈|斑驳|怀旧|上世纪|旧式|老派|破败|废墟|残破|坍塌|荒废/;
  const NEW = /未来|赛博|霓虹|机甲|全息|太空|星际|量子|虚拟/;
  if (!OLD.test(t) || NEW.test(t)) return fills;
  const NEG_ATMO = ['浪漫温馨', '活力四射', '欢快喜庆', '喜悦欢腾', '兴奋激动',
    '青春朝气', '朝气蓬勃', '甜蜜幸福', '幸福美满', '生机盎然', '童趣天真',
    '天真烂漫', '乐观积极', '自由洒脱', '豪迈奔放', '狂热躁动', '温情脉脉'];
  const OLD_ATMO = ['孤独寂寥', '苍凉辽远', '悲壮苍凉', '静谧禅意', '颓废末世',
    '肃穆庄严', '史诗壮阔'];
  const HIGH_SAT = ['霓虹粉紫', '赛博霓虹', '炽热红', '彩虹色', '品红', '洋红',
    '宝蓝', '翠绿', '桃红', '粉红', '粉彩梦幻', '黑白高对比', '荧光绿'];
  const OLD_COLOR = ['褪色复古', '莫兰迪色系', '复古70年代', '暖灰', '米灰',
    '卡其', '亚麻色', '烟灰', '暖金琥珀'];
  const pickFrom = function (cats, list) {
    for (let i = 0; i < list.length; i++) if (cats[list[i]]) return list[i];
    return '';
  };
  if (fills.atmosphere && NEG_ATMO.indexOf(fills.atmosphere) >= 0) {
    const p = pickFrom((KW_DB.atmosphere && KW_DB.atmosphere.categories) || {}, OLD_ATMO);
    if (p) fills.atmosphere = p;
  }
  if (fills.color && HIGH_SAT.indexOf(fills.color) >= 0) {
    const p = pickFrom((KW_DB.color && KW_DB.color.categories) || {}, OLD_COLOR);
    if (p) fills.color = p;
  }
  return fills;
}

function extractQualifiers(text, detection) {
  const t = String(text || '');
  if (!t) return [];

  // 收集已命中的词（只用长度≥2 的，单字词不参与，避免「竹」切碎「青梅竹马」）
  const matched = [];
  if (detection && detection._audit && detection._audit.matched) {
    matched.push.apply(matched, detection._audit.matched);
  }
  if (detection) {
    Object.keys(detection).forEach(function (d) {
      if (d === '_audit') return;
      const kw = detection[d] && detection[d].keywords;
      if (kw && kw.length) matched.push.apply(matched, kw);
    });
  }

  // 按字符区间标记「已被覆盖」
  const cov = new Array(t.length);
  matched.forEach(function (w) {
    if (!w || w.length < 2) return;
    let i = 0;
    while ((i = t.indexOf(w, i)) >= 0) {
      for (let k = i; k < i + w.length && k < cov.length; k++) cov[k] = true;
      i += w.length;
    }
  });

  // 提取未被覆盖的**连续**片段（整段保留，不按停用词切碎）
  const runs = [];
  let cur = '';
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (!cov[i] && !/[，,。.；;、：:！!？?（）()【】\[\]\s]/.test(ch)) {
      cur += ch;
    } else {
      if (cur) { runs.push(cur); cur = ''; }
    }
  }
  if (cur) runs.push(cur);

  // 过滤：去掉量词开头、过短、过长
  const out = [];
  runs.forEach(function (r0) {
    // 量词前缀：「两个」「几位」「数名」这类不该当限定语塞进正文
    // （「两个剑客在月下决斗」曾经输出「随身带着腰间长剑，行囊，两个，决斗，」）
    let r = r0.replace(/^[一这那两几两三四五六七八九十半多几数]\s*(位|个|名|只|把|盏|杯|件|台|枚|柄|颗|根|片|座|间|处|栋|条|群|束|张)/, '').trim();
    r = r.replace(/^(的|了|着|与|和|在)/, '').trim();
    if (r.length < 2 || r.length > 16) return;
    if (QUALIFIER_STOP.test(r)) return;
    /* 地点/主体本身就是维度，不该再当限定语插一遍（2026-11-11）
       实测「一位厨师，后厨」：场景没被识别时，「后厨」作为多余片段被插到
       「随身带着…铜锅」后面，读成随身带着一个厨房。场景认出之后仍然如此。
       判据：这个片段就是场景名/角色名，或者是它的一部分 → 丢掉。 */
    const sc = detection && detection.scene && detection.scene.detected;
    if (sc && (String(sc) === r || String(sc).indexOf(r) >= 0 || r.indexOf(String(sc)) >= 0)) return;
    const ch = detection && detection.character && detection.character.detected;
    if (ch && (String(ch) === r || String(ch) === r + '们')) return;
    // 地域 / 国别 / 时代词：属于风格，不属于正文
    if (REGION_STOP.test(r)) return;
    // 裸方位词：没有任何画面信息，只是病句（2026-11-11）
    if (typeof POSITION_STOP !== 'undefined' && POSITION_STOP.test(r)) return;
    // 纯动词/残句丢弃：「穿着」「裹着厚披风靠在」「立于」这类拼进句子是碎片
    if (/^(穿着|裹着|戴着|手持|拿着|站在|坐在|靠在|立于|位于|穿着|身着)$/.test(r)) return;
    if (/[在的与和]$/.test(r)) return;
    if (out.indexOf(r) >= 0) return;
    out.push(r);
  });
  return out.slice(0, 4);
}

function fixArticles(s, text) {
  const src = String(s || '');
  if (!src) return src;
  if (typeof detectLanguage === 'function' && detectLanguage(text)) return src;   // 中文结果不动
  return src
    .replace(/\ba ([aeio])/g, 'an $1')
    .replace(/\bAn ([bcdfgjklmnpqrstvwxyz])/g, 'A $1')
    .replace(/\ban ([aeiou])/gi, function (m, v) { return 'an ' + v; });
}

function enClause(s, maxChars) {
  const src = String(s || '').trim();
  if (!src) return '';
  const parts = src.split(/[,，]/).map(function (x) { return x.trim(); }).filter(function (p) {
    if (!p) return false;
    const o = (p.match(/\(/g) || []).length;
    const c = (p.match(/\)/g) || []).length;
    return o === c;   // 括号不配对 = 数据里的半截，丢掉
  });
  const lim = maxChars || 90;
  const out = [];
  let len = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (out.length && len + p.length + 2 > lim) break;
    out.push(p);
    len += p.length + 2;
  }
  return out.join(', ').replace(/[，。；、]/g, ',').replace(/,{2,}/g, ',').replace(/,\s*$/, '').trim();
}

function withQualifiers(final, text, detection) {
  try {
    if (!final || (window && window.__noQualifierKeep)) return final;
    // 英文输出不追加限定语（2026-11-11）
    // 限定语是从**中文原话**里捞出来的残片，拼到英文句尾必然变成
    // 「…atmosphere，standing，snowy。」这种中英混排的乱码。
    // 中文侧这个功能有用（保留用户自己的说法），英文侧只有害。
    if (typeof detectLanguage === 'function' && !detectLanguage(text)) return final;
    if (typeof extractQualifiers !== 'function') return final;
    let qs = extractQualifiers(text, detection);
    if (!qs.length) return final;

    // 气质已由 trait 覆盖表达，去掉重复的限定词片段（「高冷」「白发病弱」）
    try {
      const tr = (typeof pickTraitOverride === 'function') ? pickTraitOverride(text) : null;
      if (tr && tr.re) qs = qs.filter(function (q) { return !tr.re.test(q); });
      if (!qs.length) return final;
    } catch (e) {}

    // ① 已经在结果里出现过的跳过
    //    除了完全包含，还要处理「坐在空荡的房」vs「坐在空荡的房间里」这种前缀重复
    qs = qs.filter(function (q) {
      if (final.indexOf(q) >= 0) return false;
      // 前缀重复：取前 6 字，若已在结果里出现，视为重复
      const head = q.slice(0, Math.min(6, q.length));
      if (head.length >= 4 && final.indexOf(head) >= 0) return false;
      // 尾部 N 字也检查：「坐在空荡的房间里」与已有的「坐在空荡的房」重叠
      const tail = q.slice(-6);
      if (tail.length >= 4 && final.indexOf(tail) >= 0) return false;
      return true;
    });
    // 片段之间也做一次前缀去重，保留更长的那个
    qs = qs.filter(function (q) {
      return !qs.some(function (o) {
        if (o === q) return false;
        const h1 = q.slice(0, Math.min(6, q.length));
        const h2 = o.slice(0, Math.min(6, o.length));
        return o.length > q.length && h2.indexOf(h1) >= 0;
      });
    });
    if (!qs.length) return final;

    // ② 服饰/颜色类限定词 → 替换「身着XXX」，而不是追加
    const CLOTH = /衣|裙|袍|衫|甲|服|披风|斗篷|斗笠|帽|靴|鞋|手套|面纱|红|白|黑|蓝|绿|紫|金|银/;
    let out = final;
    qs.forEach(function (q) {
      if (!CLOTH.test(q)) return;
      const m = out.match(/身着[^，。]{2,16}/);
      if (m) {
        // 档案已经给了服饰，用用户的替换掉，避免自相矛盾
        out = out.replace(m[0], /衣|裙|袍|衫|甲|服|披风|斗篷/.test(q) ? q : ('身着' + q + '装扮').replace('身着身着', '身着'));
        qs = qs.filter(function (x) { return x !== q; });
      }
    });

    // ②.5 归位：优先插到主体段之后（「身处…」「置身于…」之前），而不是句尾
    const body = final;
    const marker = body.search(/[，,]?\s*(身处|置身于|身处|置身)/);
    // 没有场景标记时，退而插到第一句（主体段）之后
    if (marker <= 0) {
      const dot = body.indexOf('。');
      if (dot > 0) {
        const head = body.slice(0, dot);
        const tail = body.slice(dot);
        const insert = qs.filter(function (q) { return head.indexOf(q) < 0; });
        if (insert.length) {
          return head + '，' + insert.join('，') + tail;
        }
      }
    }
    if (marker > 0) {
      const head = body.slice(0, marker);
      const tail = body.slice(marker);
      const insert = qs.filter(function (q) { return head.indexOf(q) < 0; });
      if (insert.length) {
        return head + '，' + insert.join('，') + tail;
      }
    }

    // ③ 片段之间互相包含的（「深处」vs「林深处」）只留长的
    qs = qs.filter(function (q) {
      return !qs.some(function (o2) { return o2 !== q && o2.indexOf(q) >= 0; });
    });

    // ④ 仍然没落地的，追加到末尾（位置次优，但信息不丢）
    const rest = qs.filter(function (q) { return out.indexOf(q) < 0; });
    if (rest.length) out = out.replace(/[。.]+$/, '') + '，' + rest.join('，') + '。';
    return out;
  } catch (e) { return final; }
}

function applyEraToText(final, text) {
  if (!final) return final;
  const t = String(text || '');
  const OLD = /古旧|老式|古董|复古|做旧|年代感|锈蚀|生锈|斑驳|怀旧|上世纪|旧式|老派|破败|废墟|残破|坍塌|荒废/;
  const NEW = /未来|赛博|霓虹|机甲|全息|太空|星际|量子|虚拟/;
  if (!OLD.test(t) || NEW.test(t)) return final;
  const REPL = [
    [/浪漫温馨氛围/g, '孤独寂寥氛围'],
    [/活力四射氛围/g, '苍凉辽远氛围'],
    [/欢快喜庆氛围/g, '静谧禅意氛围'],
    [/甜蜜幸福氛围/g, '静谧禅意氛围'],
    [/青春朝气氛围/g, '苍凉辽远氛围'],
    [/粉彩梦幻色调/g, '褪色复古色调'],
    [/霓虹粉紫色调/g, '莫兰迪色色调'],
    [/赛博霓虹色调/g, '莫兰迪色色调']
  ];
  let out = final;
  for (let i = 0; i < REPL.length; i++) out = out.replace(REPL[i][0], REPL[i][1]);
  return out;
}

function pickTraitOverride(text) {
  const t = String(text || '');
  for (let i = 0; i < TRAIT_OVERRIDES.length; i++) {
    if (TRAIT_OVERRIDES[i].re.test(t)) return TRAIT_OVERRIDES[i];
  }
  return null;
}

function characterOpening(name, gender, core) {
  const mw = measureWordOf(name);
  const g = gender ? gender : '';
  // 多人主体（2026-11-11）：「两个剑客」要写「两位」，不能写「一位」
  if (genState.count > 1) {
    const cntWord = genState.count === 2 ? '两' : (genState.count === 3 ? '三' : '数');
    const base = cntWord + '位' + core;
    const mode2 = rngPick(3);
    if (mode2 === 0) return base;
    if (mode2 === 1) return '画面中央，' + base;
    return '主体是' + base;
  }
  const base = '一' + mw + g + core;
  // 开句模式原来按角色名哈希 —— 同一个角色永远同一种开头。
  // 现在跟着「第几版」走：一次生成内一致，换一版会换开头。
  const mode = rngPick(4);
  if (mode === 0) return base;
  if (mode === 1) return core;                                // 直接去掉量词与性别
  if (mode === 2) return '画面中央，' + base;
  return '主体是' + base;
}

function dropAlreadySaid(list, already) {
  const raw = String(list || '');
  const a = String(already || '');
  if (!a || !raw) return raw;
  return raw.split(/[，,、；;]/).map(function (s) { return s.trim(); })
    .filter(function (s) {
      if (!s) return false;
      if (s.length < 2) return true;        // 单字（如「冷」）误杀率高，不判
      return a.indexOf(s) < 0;
    }).join('，');
}

function nameAlreadySaid(name, text) {
  const n = String(name || '');
  const t = String(text || '');
  if (!n || !t) return false;
  if (t.indexOf(n) >= 0) return true;
  const maxTail = Math.min(n.length - 1, 4);
  for (let len = maxTail; len >= 2; len--) {
    if (t.indexOf(n.slice(-len)) >= 0) return true;
  }
  return false;
}

function stripRepeatedDimensionNames(out, text, fills) {
  const t = String(text || '');
  const s = String(out || '');
  if (!t || !s) return out;
  const names = [];
  ['scene', 'lighting', 'atmosphere', 'color', 'composition', 'style'].forEach(function (dim) {
    const key = fills && fills[dim];
    const d = key && KW_DB[dim] && KW_DB[dim].categories && KW_DB[dim].categories[key];
    const core = d && d.zh && d.zh.core;
    if (core && nameAlreadySaid(core, t)) names.push(String(core));
  });
  if (!names.length) return out;
  const kept = s.split('，').filter(function (c) {
    const cc = c.trim();
    if (!cc) return false;
    /* 2026-11-11：「身处X」是场景的锚点，不能删。
       实测「一位科学家，医院」：场景细节（医疗设备/关怀感/洁白墙壁…）本来由
       「身处医院」引出来，这句被当成「只是把名字再说一遍」删掉之后，
       细节直接接在「随身带着数据平板」后面 —— 读成随身带着 14 件东西。
       V5.27 特意把「身处其间」改成「身处X」就是为了这个锚点，这里不能再删。 */
    const isAnchor = /^(身处|位于|置身于?|来到|走进|站在|置于)/.test(cc);
    for (let i = 0; i < names.length; i++) {
      const n = names[i];
      if (cc.indexOf(n) < 0) continue;
      if (isAnchor) return true;
      const rest = cc.split(n).join('').replace(/[，。；、！？\s]/g, '');
      // 只有「整句就是名字」或「名字 + 方位词」才算重复；「医院走廊」有信息，保留
      if (!rest) return false;
      if (rest.length <= 2 && /^(里|中|内|前|后|边|旁|外|上|下|间|处|的|之)$/.test(rest)) return false;
      /* 「清晨的江南水乡」这种「修饰语 + 的 + 名字」也算重复（2026-11-11）
         实测场景模式：放宽到「名字+方位词」之后，用户原话那半句被留下，
         和场景细节里的「典型的江南水乡小镇」撞出 5 字重复。 */
      if (/^[^，。]{1,3}的$/.test(rest)) return false;
    }
    return true;
  });
  return kept.join('，');
}

function sceneDetailMuted(style, detail) {
  if (!style || !detail) return false;
  return FUTURE_STYLE_RE.test(String(style)) && ERA_OLD_DETAIL_RE.test(String(detail));
}


/* 把用户的整句原话整理成「主语从句 + 姿态从句」（2026-11-11）
   ------------------------------------------------------------
   背景：认不出主体时，原来把整句原话贴到开头（防止丢信息），
   结果是「一个浑身是血的男人跪在教堂面前，身处其间，…」这种复读。
   用户的原话是「我要的始终是好用」——复读不算好用。

   这里只做三件确定性的事（不调模型、不猜内容）：
     1 量词与称谓规范化：一个→一位、男人→男性、女人→女性、小孩→孩童
     2 姿态动词提出来单独成句：跪→双膝跪地、坐→端坐、躺→仰卧 …
     3 场景尾巴剥掉（如果场景会被 scenePhrase 重新引入），避免「教堂…教堂」

   做不到的地方**照原样保留**——宁可啰嗦，也不要瞎改用户的话。
*/
const USER_POSE_MAP = [
  [/双膝跪(地|下)?|跪(在|着|下)/, '双膝跪地'],
  [/单膝跪/, '单膝跪地'],
  [/端坐|坐着|坐在|静坐/, '端坐'],
  [/躺(在|着|下)|仰卧|卧(在|于)/, '仰卧'],
  [/趴(在|着)|俯卧/, '俯卧'],
  [/蹲(在|着|下)/, '蹲身'],
  [/站(在|着|立)|伫立|直立/, '站立'],
  [/奔跑|跑(着|在)/, '奔跑'],
  [/行走|走(着|在)/, '行走'],
  [/回头|转身/, '回头'],
  [/低(着头|头)|垂首/, '低头'],
  [/抬(起)?头|仰望/, '抬头']
];

const USER_NOUN_MAP = [
  [/^一个(?=[\u4e00-\u9fff])/, '一位'],
  [/男人/g, '男性'],
  [/女人/g, '女性'],
  [/小孩|孩子/g, '孩童'],
  [/老头/g, '老者'],
  [/老太太|老妇/g, '老妇']
];

function polishUserSubject(raw, opts) {
  let t = String(raw || '').trim();
  if (!t) return '';
  opts = opts || {};
  const gender = opts.gender || '';

  // 1) 姿态先摘出来（要在删场景尾巴之前，因为「跪在」依赖后面的地点）
  let pose = '';
  for (let i = 0; i < USER_POSE_MAP.length; i++) {
    const re = USER_POSE_MAP[i][0];
    if (re.test(t)) { pose = USER_POSE_MAP[i][1]; break; }
  }

  // 2) 姿态从句：只有「场景会被 scenePhrase 重新引入」时，才把
  //    「动词 + 地点」整段摘掉，改成一个独立的姿态从句。
  //    没有场景可剥就**原样保留**——否则会得到「一位窗台上的女性，端坐」
  //    这种把句子截断的效果（2026-11-11 实测发现）。
  if (pose) {
    const sceneCore = opts.sceneCore || '';
    const cutRe = sceneCore
      ? new RegExp('(跪|坐|躺|趴|蹲|站|立|靠)(在|着|于)?[^，。；,]*?' + sceneCore + '[^，。；,]*')
      : null;
    if (cutRe && cutRe.test(t)) {
      t = t.replace(cutRe, '').trim();
      // 剥掉地点词后常残留方位词：「跪在教堂面前」→「面前」
      t = t.replace(/(面前|前面|前|旁边|边上|身旁|身后|背后|附近|周围|四周|之中|里面|里|内侧|外侧)$/g, '').trim();
      t = t.replace(/[，,]{2,}/g, '，').replace(/^[，,]+|[，,]+$/g, '').trim();
    } else {
      // 没有可剥的场景：不动动词，也不额外加姿态从句
      pose = '';
    }
  }

  // 3) 量词与称谓规范化
  USER_NOUN_MAP.forEach(function (pair) {
    t = t.replace(pair[0], pair[1]);
  });
  // 性别说了就对齐人称（用户写「男性」但性别判成女性时以用户为准，不动）
  if (gender === '女性' && /^一位男性/.test(t)) t = t.replace(/^一位男性/, '一位女性');

  // 4) 去掉开头的冗余虚词
  t = t.replace(/^[的了着是在于和与把被这那]+/, '').trim();

  if (!t && !pose) return String(raw || '').trim();   // 什么都抽不出来就原样返回
  if (!t) return pose;
  /* 剥完只剩「一个」这种半截词 → 退回原话（宁可啰嗦，也不要断句）。
     实测：「一个蹲在屋檐下的人」+ sceneCore=屋檐 → 「一个，蹲身」。 */
  if (t.replace(/[，,]/g, '').length < 2) return String(raw || '').trim();
  return pose ? (t + '，' + pose) : t;
}

/* 把结构化抽提取到的 raw 插进正文（2026-11-11）
   ------------------------------------------------------------
   raw 里放的是「用户原话里信息量最大、但库里归类不了」的短语：
   「浑身是血」「身上缠着绷带」「手里攥着一把断刀」「锈迹斑斑」。
   以前这些要么被硬套成库里最近的东西（浑身是血→吸血鬼），要么直接丢掉。
   现在原样插一句，不猜。

   只插没在正文里出现过的，最多 3 条，防止又变回堆砌。 */
function appendRawClause(final, text, isZh) {
  if (!isZh || !final) return final;
  const p = (typeof window !== 'undefined') ? window.__parse : null;
  if (!p || !p.data || String(p.text || '').trim() !== String(text || '').trim()) return final;
  const raws = Array.isArray(p.data.raw) ? p.data.raw : [];
  const add = raws.filter(function (r) {
    return r && String(final).indexOf(r) < 0;
  }).slice(0, 3);
  if (!add.length) return final;
  const clause = add.join('，');
  const i = String(final).indexOf('。');
  return i > 0 ? final.slice(0, i) + '，' + clause + final.slice(i) : final + '，' + clause;
}

/* 用抽取结果补空维度（只补空，规则同面板回填） */
const PARSE_DIM2FILL = { '角色': 'character', '场景': 'scene', '风格': 'style',
  '光线': 'lighting', '色彩': 'color', '氛围': 'atmosphere', '构图': 'composition' };

function applyParseFills(text, fills) {
  const p = (typeof window !== 'undefined') ? window.__parse : null;
  if (!p || !p.data || !fills) return [];
  if (String(p.text || '').trim() !== String(text || '').trim()) return [];
  const applied = [];
  const verbatim = p.data['原话'] || '';
  Object.keys(PARSE_DIM2FILL).forEach(function (k) {
    const target = PARSE_DIM2FILL[k];
    /* 场景是特例（2026-11-11）：不是「空才补」，而是「不是用户说的就换」。
       离线实测：24 个常见地点里 15 个最终场景不是用户写的（后厨/机房/工地/宿舍/网吧/健身房…），
       因为 smartFill 先用风格默认值把场景填满了，到这里「只补空」就永远补不进来。
       fills._sceneSource：user=用户说的（不动）；style=风格编的（可覆盖）；parse=抽取给的。 */
    const isScene = target === 'scene';
    const sceneFromUser = isScene && fills._sceneSource === 'user';
    if (!agentDimIsEmpty(fills[target]) && !isScene) return;
    if (sceneFromUser) return;
    /* 人物优先用「原话」而不是「角色」（2026-11-11）
       抽取会把「手上全是机油的老修理工」归纳成「修理工」。
       如果拿归纳后的名字去填，可能对上库内词条、用它的模板，
       把「手上全是机油」盖掉。原话不在库内 → 走 polishUserSubject，
       用户怎么写就怎么保留。 */
    const v = (target === 'character' && verbatim) ? verbatim : p.data[k];
    if (!v) return;
    if (isScene) {
      // 库外场景名要能进 scenePhrase，否则正文里一个场景词都不会出现
      const known = KW_DB.scene && KW_DB.scene.categories && KW_DB.scene.categories[v];
      if (!known && typeof synthScene === 'function') {
        try { synthScene(v, text); } catch (e) { }
      }
      fills._sceneSource = 'parse';
    }
    fills[target] = v;
    applied.push(v);
  });
  return applied;
}

/* 简体化：把「著」收回「着」（2026-11-11）
   ------------------------------------------------------------
   用户截图里发现「提著」混在简体正文中。静态数据里搜不到这个词，
   说明它来自推理生成的档案文案——所以在**输出层**统一，不追源头。

   保护真正的「著」：著作 / 著名 / 显著 / 土著 / 巨著 / 专著 / 著述 / 编著 / 著者。
   其它位置一律换成「着」（提著/穿著/帶着/拿著/站著/坐著/沿著/順著…）。 */
const ZHU_KEEP = ['著作', '著名', '显著', '土著', '巨著', '专著', '著述', '编著', '著者', '著书'];

function toSimplifiedParticles(s) {
  if (!s || String(s).indexOf('著') < 0) return s;
  let out = String(s);
  // 先把要保护的词换成占位符，避免被下面的替换吃掉
  const holes = [];
  ZHU_KEEP.forEach(function (w, i) {
    const tag = '\u0001' + i + '\u0001';
    if (out.indexOf(w) >= 0) { out = out.split(w).join(tag); holes.push({ tag: tag, w: w }); }
  });
  out = out.split('著').join('着');
  holes.forEach(function (h) { out = out.split(h.tag).join(h.w); });
  return out;
}

/* 叙述段 / 参数段 分段（2026-11-11）
   ------------------------------------------------------------
   为什么：用户反馈「不管输入什么，读起来都像各说各的」。
   根因不是文案，是结构——所有从句都用「，」串成一句清单：
     主体…，随身带着…，场景细节…，风格…，光线…，机位…，色调…，氛围…，画质…
   人写提示词会分两段：画面（谁、在哪、什么光）+ 参数（画风、色调、氛围、画质）。

   判据用标记词：命中参数词的从句归到第二段，其余留在第一段。
   组内仍用「，」，组间用「。」。只对中文生效，英文保持原样。 */
const PARAM_HINT = /风格|笔法|画风|画法|渲染|色系|色调|色彩|氛围|气息|质感|机位|视角|构图|景深|画幅|光照|照明|光线|光影|画质|分辨率|颗粒感|风格化|调性/;

function weaveClauses(final, isZh) {
  if (!isZh || !final) return final;
  const text = String(final).trim();
  if (text.length < 20) return final;

  // 只在「一整句」的情况下拆；已经有句号的（多段输出）不动
  if (text.indexOf('。') >= 0 && text.indexOf('。') < text.length - 2) return final;

  const body = text.replace(/[。.]+$/, '');
  const clauses = body.split(/，/).map(function (c) { return c.trim(); }).filter(Boolean);
  if (clauses.length < 5) return final;      // 太短就不用折腾

  const narrative = [];
  const params = [];
  clauses.forEach(function (c) {
    if (PARAM_HINT.test(c)) params.push(c);
    else narrative.push(c);
  });

  // 参数段里如果混进叙事从句（顺序会乱），就不拆，保持原样
  const firstParam = clauses.findIndex(function (c) { return PARAM_HINT.test(c); });
  if (firstParam > 0) {
    for (let i = firstParam; i < clauses.length; i++) {
      if (!PARAM_HINT.test(clauses[i])) return final;
    }
  }
  if (!narrative.length || !params.length) return final;

  /* 参数段再拆一层（2026-11-11）
     两段式之后参数段仍然很长（画风+光线+机位+色调+氛围+画质挤一句）。
     人读提示词时习惯：先看画法，再看色调氛围。
       A 画面（谁/在哪/什么光）
       B 画法（风格 / 光线 / 机位 / 构图）
       C 调性（色调 / 氛围 / 质感 / 画质） */
  const LOOK = /风格|笔法|画风|画法|渲染|光照|照明|光线|光影|机位|视角|构图|景深|画幅|风格化/;
  const look = [], tone = [];
  params.forEach(function (c) { (LOOK.test(c) ? look : tone).push(c); });
  if (!look.length || !tone.length) {
    return narrative.join('，') + '。' + params.join('，') + '。';
  }
  return narrative.join('，') + '。' + look.join('，') + '。' + tone.join('，') + '。';
}

/* 把最后一句「参数段」再拆成两句（2026-11-11）
   ------------------------------------------------------------
   段落构建器已经会输出两段（画面 / 参数），但参数段仍然把
   画风、光线、机位、色调、氛围、画质挤在一句里。
   人读提示词习惯：先看画法，再看调性。
     画法：风格 / 光线 / 机位 / 构图
     调性：色调 / 氛围 / 质感 / 画质
   只处理「最后一句」，且两边都非空才拆。 */
// 光线从句的写法很多：「烛火光映照」「冷蓝月光洒落」「午后灰白光线斜照」——
// 只用「光线」两个字匹配会漏掉大半，所以放宽到「含光/照/明」。
const LOOK_HINT = /风格|笔法|画风|画法|渲染|风格化|机位|视角|构图|景深|画幅|光|照|明暗|暗调/;
// 调性词优先判断：「冰蓝极光色调」含「光」但不是光线，是色调。
const TONE_HINT = /色调|色彩|色系|氛围|气息|质感|画质|分辨率|颗粒感/;

function splitParamSentence(final) {
  const s = String(final || '');
  const m = s.match(/^([\s\S]*。)([^。]+)。?$/);
  if (!m) return final;
  const head = m[1];
  const last = m[2];
  if (last.indexOf('，') < 0) return final;
  const clauses = last.split('，').map(function (c) { return c.trim(); }).filter(Boolean);
  if (clauses.length < 3) return final;
  const look = [], tone = [];
  clauses.forEach(function (c) {
    if (TONE_HINT.test(c)) { tone.push(c); return; }   // 调性优先，避免「极光色调」被当成光线
    (LOOK_HINT.test(c) ? look : tone).push(c);
  });
  if (!look.length || !tone.length) return final;
  return head + look.join('，') + '。' + tone.join('，') + '。';
}

/* 场景不该出现的随身物（2026-11-11）
   ------------------------------------------------------------
   用户截图：人物是「科学家」、场景是「街角咖啡馆」，
   正文却写「随身带着记录板，试管，显微镜，烧杯，数据平板」——
   在咖啡馆里带着一整套实验器材，读起来就不对。

   根因：人物词条的随身物是固定列表，与场景无关。
   修法：休闲场景（咖啡馆/酒馆/茶馆/餐厅/家/卧室…）里，
   过滤掉明显属于工作场所的器物。宁可少写，也不要写错。 */
/* 场景道具表（2026-11-11，用户提的设计）
   ------------------------------------------------------------
   用户的思路比我原来好：科学家出现在咖啡馆时，不该「删掉随身物」，
   而该**改成咖啡馆里会出现的道具**。删除会丢画面，替换会让画面更满。

   所以：人物自带的器材在休闲场景里被丢掉后，用这个表补一批场所道具。
   表里没有的场景就保持「删掉」的处理（宁可少写，不要写错）。 */
const SCENE_PROPS = {
  '咖啡馆': ['咖啡杯', '笔记本', '钥匙'],
  '咖啡厅': ['咖啡杯', '笔记本'],
  '酒馆': ['酒杯', '打火机', '钥匙'],
  '酒吧': ['酒杯', '火柴盒'],
  '茶馆': ['茶碗', '折扇'],
  '餐厅': ['餐巾', '菜单'],
  '食堂': ['餐盘', '饭卡'],
  '客厅': ['遥控器', '茶杯'],
  '卧室': ['台灯', '相框'],
  '书房': ['钢笔', '便签', '书签'],
  '图书馆': ['借书证', '便签', '书签'],
  '书店': ['书签', '帆布袋'],
  '公园': ['报纸', '水杯'],
  '沙滩': ['草帽', '毛巾'],
  '海边': ['草帽', '贝壳'],
  '阳台': ['茶杯', '毛毯']
};

const LEISURE_SCENE = /咖啡馆|咖啡厅|酒馆|酒吧|茶馆|餐厅|食堂|客厅|卧室|书房|阳台|公园|沙滩|海边|温泉|书店|图书馆/;
const WORK_ITEM = /试管|显微镜|烧杯|量筒|示波器|离心机|培养皿|数据平板|记录板|实验|样本|切片|试剂|焊枪|扳手|图纸|脚手架|工具箱|游标卡尺|万用表/;
/* 不可携带的「场景道具」（2026-11-11 扩表）
   ------------------------------------------------------------
   原来只挡建筑与地貌（教堂/墙/街/山/海…），实测联网后更糟：
     教堂 → 「随身带着长椅，烛台，碎玻璃」
     医院 → 「随身带着…病床，输液架，病历本」
     化粪池 → 「随身带着抽粪管，井盖」
   抽取给的「场景道具」是**这个场所里有什么**，不是**这个人身上有什么**。
   家具、设备、管线、垃圾一律不许进「随身带着」。
   注意：这里和收尾清洗是两处注入点，共用这一份（别各写一份 —— 今天已经栽过两次）。 */
const NOT_CARRY_PROP = /教堂|墙|建筑|房子|屋|街|路|桥|门|窗|台阶|阶|梯|海|山|河|湖|天空|日落|日出|云|地面|塔|堡|殿|柱|篱|栏|树|林|花丛|雪|沙滩|草|石|椅|凳|床|沙发|柜|架|桌|炉|灶|管道|抽粪管|水管|通气管|管线|电线|网线|缆线|砖|碎玻璃|瓦|毯|帘|灯|招牌|镜|井|梁|板|池|盆|台|病历|脚手架/;
/* 工作场所（2026-11-11）
   这里和装配阶段（约 1356 行）曾经各写一份同样的表，结果装配那份加了门禁、
   收尾这份漏了 —— 「科学家 + 实验室」的器材就是被收尾这一处清空的。
   现在只留这一份，两处共用，避免再分叉。 */
const WORK_SCENE = /实验室|车间|工厂|工地|医院|手术室|作坊|工作间|研究|调试间|机房|仓库|农场|船坞/;

/* 手写表按「包含」查（2026-11-11）
   装配阶段一直是「包含」匹配：「街角咖啡馆」能命中手写表里的「咖啡馆」。
   收尾这里却是**精确匹配** → 同一个场景，装配认得、收尾不认得。
   后果（离线时看得到）：道具补上了，但「手持记录板缓步穿过实验台」
   里的「实验台」换不成「桌边」——整段清洗被跳过，收尾前后一模一样。
   查表逻辑也只留这一份，两处共用（和 WORK_SCENE 一个道理）。 */
function scenePropTable(sceneCore) {
  const key = String(sceneCore || '');
  if (!key) return null;
  if (SCENE_PROPS[key]) return SCENE_PROPS[key];
  let hit = null;
  Object.keys(SCENE_PROPS).forEach(function (k) {
    if (!hit && key.indexOf(k) >= 0) hit = SCENE_PROPS[k];
  });
  return hit;
}

function dropSceneMismatchCarries(final, sceneCore) {
  /* 触发条件：只要这个场景有场景道具就生效（2026-11-11）
     原来只在 16 个手写休闲场景里生效。现在：**只要这个场景有场景道具**就生效，
     场景道具来自 /api/parse（任何场景都能给），所以覆盖不受手写表限制。
     手写表只在断网时兜底。 */
  if (!final || !sceneCore) return final;
  /* 工作场所：人物自带的器材原样保留（2026-11-11）
     实测「科学家 + 实验室」：装配阶段判定是对的，正文里已经有
       「随身带着记录板，试管，显微镜，烧杯，数据平板」，
     但走到这里又被下面的短句过滤 + 换道具逻辑清空，最后整句消失。
     工作场所本来就该有这些器材，所以这一处直接放行，不做任何清洗。 */
  if (WORK_SCENE.test(String(sceneCore))) return final;
  /* 场景道具先筛「能不能拿在手里」（2026-11-11）
     这里和装配阶段是**两处注入点**，两处共用 NOT_CARRY_PROP 一份表（不再各写一份）。 */
  const NOT_CARRY = NOT_CARRY_PROP;
  const carryable = function (arr) {
    return (arr || []).filter(function (x) { return !NOT_CARRY.test(String(x)); });
  };
  const parsedPropsRaw = (typeof window !== 'undefined' && window.__parse && window.__parse.data
    && Array.isArray(window.__parse.data['场景道具'])) ? window.__parse.data['场景道具'] : null;
  const parsedProps = carryable(parsedPropsRaw);
  // 手写表按「包含」查（「街角咖啡馆」→「咖啡馆」），装配阶段用的是同一份逻辑
  const sceneProps = scenePropTable(sceneCore);
  const hasSceneProps = !!(parsedProps && parsedProps.length) || !!sceneProps;
  if (!hasSceneProps) return final;
  let s = String(final);

  /* 裸列表形式（2026-11-11 修正）
     实测「科学家 + 街角咖啡馆」输出里器材是**裸列表**：
       「…眉眼沉静专注，试管，显微镜，烧杯，数据平板，两层小楼…」
     没有「随身带着」前缀，所以按前缀匹配抓不到。
     改按从句判断：**短小且整句都是器材名**的从句，在休闲场景里直接删。
     判据：命中 WORK_ITEM 且长度 ≤ 6 且不含动词性虚字。 */
  const parts = s.split('，');
  let dropped = 0;
  const kept = parts.filter(function (c) {
    const x = c.trim();
    if (!x || x.length > 6) return true;                 // 长句不动
    if (!WORK_ITEM.test(x)) return true;
    dropped++;
    return false;                                        // 纯器材名 → 去掉
  });
  if (dropped) {
    s = kept.join('，').replace(/，{2,}/g, '，').replace(/，。/g, '。');
    // 器材被清空时，用场所道具补一句（用户的设计：在哪个场所就找哪个场所的道具）
    const parsed = (typeof window !== 'undefined' && window.__parse && window.__parse.data
      && Array.isArray(window.__parse.data['场景道具'])) ? window.__parse.data['场景道具'] : null;
    const sp = (parsed && parsed.length) ? parsed : sceneProps;
    if (sp && sp.length && s.indexOf('随身带着') < 0) {
      const i = s.indexOf('。');
      const clause = '随身带着' + sp.join('，');
      s = i > 0 ? (s.slice(0, s.lastIndexOf('，', i) + 1) + clause + s.slice(i)) : (s + '，' + clause);
    }
  }

  // 动作里提到工作场所（「手持记录板缓步穿过实验台」）→ 换成中性场所
  // 但工作场所本身不该换：实验室里就该有实验台。
  if (!WORK_SCENE.test(String(sceneCore))) s = s.replace(/实验台|实验桌|操作台/g, '桌边');

  const m = s.match(/随身带着([^。，]*)/);
  if (!m) {
    /* 人物自带的器材在装配阶段就被过滤掉了（没有「随身带着」这句话），
       这时也要补场景道具，否则画面里少了「手边有什么」这一层。 */
    const sp0 = (parsedProps && parsedProps.length) ? parsedProps : sceneProps;
    if (sp0 && sp0.length) {
      const clause = '随身带着' + sp0.join('，');
      const dot = s.indexOf('。');
      if (dot > 0) {
        const comma = s.lastIndexOf('，', dot);
        return comma > 0 ? (s.slice(0, comma + 1) + clause + s.slice(dot)) : (s.slice(0, dot) + '，' + clause + s.slice(dot));
      }
    }
    return s;
  }
  const carryItems = m[1].split('，').map(function (x) { return x.trim(); }).filter(Boolean);
  const carryKept = carryItems.filter(function (x) { return !WORK_ITEM.test(x); });
  if (carryKept.length === carryItems.length) return s;
  if (!carryKept.length) {
    /* 全被过滤掉：先试着换成**该场所会出现的道具**（2026-11-11）
       科学家进咖啡馆 → 带咖啡杯/笔记本，而不是一整套实验器材。
       这个思路是用户提的：不是在咖啡馆里找实验室的东西，而是在咖啡馆里找。 */
    const sceneFallback = sceneProps;
    if (sceneFallback && sceneFallback.length) {
      return s.replace(/随身带着[^。]*?(?=，|。|$)/, '随身带着' + sceneFallback.join('，'));
    }
    return s.replace(/，?随身带着[^。]*?(?=，|。|$)/, '');
  }
  return s.replace('随身带着' + m[1], '随身带着' + carryKept.join('，'));
}

/* A 类取值冲突：人物气质 × 氛围（2026-11-11）
   ------------------------------------------------------------
   用户截图：人物是「温和的丰收女神」，氛围却是「肃杀」。
   这不是文案问题，是两个维度各取各的值，互相打架。

   判据（有意保守，只拦明显冲突）：
     温和类气质（温和/慈爱/丰收/悲悯/温暖/治愈/柔/善/母性）
       不该配死寂类氛围（肃杀/血腥/暴虐/恐怖/阴森/绝望/压抑/死寂）
   冲突时把氛围换成安全值：优先「温馨治愈」，没有就「清新自然」。

   为什么只做这一对：先放进最明显的一组，跑一段时间看还缺什么，
   而不是一次编一张大矩阵（编错了会误伤，比如「悲悯的女神 + 肃杀」其实成立）。 */
const WARM_TRAIT = /温和|温柔|慈爱|慈祥|丰收|悲悯|温暖|治愈|柔和|善良|母性|宽厚|仁|圣|女神|天使|慈悲|守护|祝福/;
const HARSH_ATMO = /肃杀|血腥|暴虐|恐怖|阴森|绝望|压抑|死寂|残酷|狰狞|戾气/;

function ensureMoodAtmosphere(fills, charData) {
  if (!fills || !fills.atmosphere) return fills;
  if (!HARSH_ATMO.test(String(fills.atmosphere))) return fills;

  // 气质来源：词条的 mood 字段，没有就看人物名
  const mood = String((charData && charData.zh && charData.zh.mood) || '') + ' ' +
               String(fills.character || '');
  if (!WARM_TRAIT.test(mood)) return fills;

  const pool = KW_DB && KW_DB.atmosphere && KW_DB.atmosphere.categories;
  const pick = ['温馨治愈', '清新自然', '庄严神圣'].find(function (x) { return pool && pool[x]; });
  if (!pick) return fills;
  if (typeof console !== 'undefined') {
    try { console.warn('[coherence] 氛围与人物气质冲突：' + fills.atmosphere + ' → ' + pick); } catch (e) {}
  }
  fills.atmosphere = pick;
  return fills;
}

function scenePhrase(sceneData, prefix, suffix, text) {
  if (!sceneData || !sceneData.zh || !sceneData.zh.core) return null;
  const core = sceneData.zh.core;
  let d = sceneData.zh.detail || sceneData.zh.effect || sceneData.zh.mode || '';

  /* 库外场景（用户自己写的地点）原来只有一句通用兜底：
     「四周的细节顺着光线一层层退远」——不是留白，是废话。
     2026-11-11：先查 PLACE_DETAIL 里有没有具体描写；没有就**不写细节**，
     只留场景名。具体 > 通顺 > 沉默。 */
  const isSynth = !d || (typeof SYNTH_SCENE_DETAILS !== 'undefined'
    && SYNTH_SCENE_DETAILS.indexOf(String(d)) >= 0);
  if (isSynth && typeof PLACE_DETAIL !== 'undefined' && PLACE_DETAIL[core]) {
    d = PLACE_DETAIL[core];
  } else if (isSynth) {
    d = '';   // 给不出具体描写，就别说废话
  }

  d = String(d).replace(/[。．.，,；;]+$/, '');   // 去掉结尾标点，避免拼出「。。」
  if (genState.muted) d = '';
  // 用户自己已经说了这个场景名（「站在雨夜的霓虹街道」），就只补描述。
  // 保留一个「身处其间」的连接词：直接删掉「身处霓虹街道」会让
  // 「…，身着长裙，湿漉漉的沥青路面…」读起来像突然换了主语。
  if (text && nameAlreadySaid(core, text)) {
    /* 没有细节时也要留锚点（2026-11-11）
       库外场景（后厨/机房/工地…）常常没有具体描写，原来这里 return null，
       于是正文里连「身处后厨」都没有，只剩一个孤零零的地点词当限定语。
       留一个「身处X」比什么都不说好：读者知道人在哪。 */
    if (!d) return '身处' + core;
    // 2026-11-11：'身处其间' 没有信息量，改成点名场景——
    // 「身处教堂，彩绘玻璃把光切成细长的色带」比「身处其间，…」好读。
    return '身处' + core + '，' + d;
  }
  return (prefix || '') + core + (suffix || '') + (d ? '，' + d : '');
}

function sceneCoreIfNew(sceneData, text) {
  if (!sceneData || !sceneData.zh) return null;
  const core = sceneData.zh.core;
  if (!core) return null;
  // 档案里有描述就一起带上（160 条场景有描述，原来完全没用上）
  if (String(text || '').indexOf(core) >= 0) {
    if (genState.muted) return null;
    let d0 = sceneData.zh.detail || sceneData.zh.effect || sceneData.zh.mode;
    d0 = String(d0 || '').replace(/[。．.，,；;]+$/, '');
    return d0 ? d0 : null;   // 场景名重复就只补描述
  }
  if (genState.muted) return core;
  const d = sceneData.zh.detail || sceneData.zh.effect || sceneData.zh.mode;
  return d ? core + '，' + d : core;
}

function pickSituation(detection, text) {
  const t = String(text || '');
  const atmo = (detection && detection.atmosphere && detection.atmosphere.detected) || '';
  const ACTION_ATMO = /紧张|热血|激昂|惊险|战斗|冲突|暴|狂|躁动|悬疑|压迫/;
  const QUIET_ATMO = /静谧|宁静|安详|孤独|寂寥|空灵|凄|哀伤|慵懒|禅|肃穆/;
  const ACTION_WORD = /打|战|冲|攻|击|斗|斩|砍|射|逃|追|撞|搏|决斗|迎敌|厮杀/;
  const QUIET_WORD = /静|独|望|沉思|发呆|休息|睡|躺|倚|坐|凝视|出神/;
  if (ACTION_ATMO.test(atmo) || ACTION_WORD.test(t)) return 'action';
  if (QUIET_ATMO.test(atmo) || QUIET_WORD.test(t)) return 'quiet';
  return 'daily';
}

function pickFace(detection, text, roleName) {
  const all = (typeof window !== 'undefined' && window.__ROLE_FACES) || null;
  if (!all || !roleName) return null;
  const f = all[roleName];
  if (!f) return null;
  const sit = pickSituation(detection, text);
  const raw = f[sit] || f.daily || null;
  return raw ? String(raw).replace(/[。．.；;，,]+$/, '') : null;
}

function pickVariant(detection, text, roleName) {
  const all = (typeof window !== 'undefined' && window.__ROLE_VARIANTS) || null;
  if (!all || !roleName) return null;
  const v = all[roleName];
  if (!v) return null;
  const sit = pickSituation(detection, text);
  const raw = v[sit] || v.daily || null;
  // 变体自带句末标点，拼进逗号串会变成「。，」，这里去掉
  return raw ? String(raw).replace(/[。．.；;，,]+$/, '') : null;
}

function measureWordOf(name) {
  return MEASURE_WORD[name] || '位';
}

// ============================================================
// VARIATION ENGINE — 随机重组短语，每次输出不同
// ============================================================
function pickRandom(arr, count) {
  // 用可复现随机源 + 无放回抽取。
  // 原来那句 sort(() => Math.random() - 0.5) 有两个毛病：
  // 比较器洗牌不是均匀洗牌，而且用 Math.random 没法复现某一版。
  return pickN(arr, count, __rng || Math.random);
}

function varyDescription(text, minItems) {
  if (!text) return '';
  const phrases = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  if (phrases.length <= 3) return text; // too short to vary
  const count = minItems || Math.max(Math.floor(phrases.length * 0.7), 3);
  return pickRandom(phrases, Math.min(count, phrases.length)).join(', ');
}

// 检测用户输入中是否已自带服装/穿着描述（问题：混搭风格时引擎不应覆盖用户服装意图）
function hasUserClothing(text) {
  return /穿着|身着|身穿|服裝|衣服|服装|服饰|汉服|旗袍|西装|长衫|长袍|短裙|长裙|连衣裙|裙|袍|甲胄|铠甲|披风|斗篷|配饰|衣饰|衣袂|衣冠|古装|制服|wearing|dressed in|clothed|clothes|robe|armor|armour|coat|dress|skirt|suit|kimono|qipao|cheongsam|cape|cloak|jacket|hoodie|t-shirt|shirt|pants|trousers|uniform/i.test(text);
}

// 提取用户已表达的服装/穿着描述，生成具体的中文服装细节
// （混搭风格时：hasUserClothing 只阻止库内服装覆盖，需主动把用户服装意图转成具体描述写进提示词）
function userClothingDetail(text) {
  if (!text) return '';
  // 中式服装细分
  if (/汉服/.test(text)) return '身着交领右衽的汉服，衣袂飘飘，腰束玉带，衣缘绣以云纹';
  if (/旗袍/.test(text)) return '身着修身的旗袍，立领盘扣，侧边开衩，衣身绣以牡丹纹样';
  if (/唐装|马褂/.test(text)) return '身着对襟唐装，盘扣立领，织锦面料，领口袖口滚边刺绣';
  if (/中式|中国风|传统服装|华夏|古风穿着/.test(text)) return '身着中式服装，立领盘扣，丝绸面料，衣襟绣以祥云与回纹刺绣';
  if (/古装|长衫|长袍/.test(text)) return '身着古装长袍，广袖流云，衣袂轻扬';
  if (/汉式|禅意/.test(text)) return '身着素雅禅意汉服，宽袖束腰，麻质衣料';
  // 未来/机械着装
  if (/义体|机械|赛博|机甲|装甲|金属/.test(text)) return '身着贴合体型的赛博机械外装，外露缆线与金属关节，泛着冷光';
  // 通用服装词
  if (/裙/.test(text)) return '身着飘逸长裙，裙摆随动作轻扬';
  if (/西装/.test(text)) return '身着剪裁利落的西装';
  if (/大衣|风衣/.test(text)) return '身着有型的大衣';
  if (/毛衣|针织/.test(text)) return '身着柔软针织毛衣';
  if (/制服/.test(text)) return '身着笔挺制服';
  // 兜底：截取用户原文中的穿着片段作为细节
  const m = text.match(/(?:穿着|身着|身穿|衣服|服装|服饰)[^，。,.；;、]{0,10}/);
  if (m) return '身着' + m[0].replace(/穿着|身着|身穿|衣服|服装|服饰/, '');
  return '';
}

// 英文版服装细节：避免英文输出混入中文（全英文约束）
function userClothingDetailEn(text) {
  if (!text) return '';
  if (/汉服|hanfu/i.test(text)) return 'wearing a traditional Hanfu with crossed collar and flowing sleeves, embroidered with cloud patterns';
  if (/旗袍|qipao|cheongsam/i.test(text)) return 'wearing a fitted qipao with mandarin collar and frog buttons, embroidered with peony motifs';
  if (/唐装|马褂|tang suit/i.test(text)) return 'wearing a Tang-style jacket with frog buttons and brocade fabric';
  if (/中式|中国风|traditional chinese|chinese style|chinese clothing/i.test(text)) return 'wearing traditional Chinese attire with mandarin collar and silk fabric, embroidered with auspicious cloud and fret patterns';
  if (/古装|长衫|长袍|robe/i.test(text)) return 'wearing a flowing traditional robe with wide sleeves';
  if (/汉式|禅意|zen/i.test(text)) return 'wearing an elegant zen-style robe with wide sleeves and linen fabric';
  if (/义体|机械|赛博|机甲|装甲|金属|cyber|mech|armor|armour/i.test(text)) return 'wearing a sleek cybernetic exosuit with exposed cables and metallic joints, glowing with cold light';
  if (/裙|dress|skirt/i.test(text)) return 'wearing a flowing dress';
  if (/西装|suit/i.test(text)) return 'wearing a sharply tailored suit';
  if (/大衣|风衣|coat/i.test(text)) return 'wearing a structured overcoat';
  if (/毛衣|针织|sweater/i.test(text)) return 'wearing a soft knitted sweater';
  if (/制服|uniform/i.test(text)) return 'wearing a crisp uniform';
  const m = text.match(/(?:wearing|dressed in|clothed in|in a|in an)[^.,;]{0,20}/i);
  if (m) return 'wearing ' + m[0].replace(/wearing|dressed in|clothed in|in a|in an/i, '').trim();
  return '';
}

function buildOptimizedPrompt(text, fills, depth, detection) {
  /* 验章（2026-11-11）
     smartFill 正常跑完会盖一次章。这里没看到章，说明调用方绕过了补全层，
     genState 里可能还是上一次生成的残留值 —— 那就退回安全默认值，
     而不是拿残留值去拼。这样「必须重置」是结构保证，不靠调用顺序的自觉。 */
  if (!genState.stamped) {
    genState.muted = false;
    genState.count = (typeof detectSubjectCount === 'function') ? detectSubjectCount(text) : 1;
    if (!genState.warnOnce) {
      genState.warnOnce = true;
      try { console.warn('[buildOptimizedPrompt] 未经 smartFill 直接调用，已退回安全默认值'); } catch (e) {}
    }
  }
  genState.stamped = false;   // 章只生效一次，下次必须重新盖
  // 连接词变体按「输入 + 维度 + 类别名」选：同输入可复现，跨输入会散开
  try { setConnSalt(text); } catch (e) {}
  // ===== LANGUAGE DETECTION =====
  const isZh = detectLanguage(text);

  // ===== COHERENCE CHECK: 确保人物和风格兼容 =====
  fills = ensureCoherence(fills, detection);
  // ===== COHERENCE CHECK: 确保风格和场景兼容 =====
  fills = ensureStyleSceneCoherence(fills, detection);
  // A 类取值冲突：温和人物不配肃杀氛围（2026-11-11）
  try {
    var _cd0 = (KW_DB.character && KW_DB.character.categories[fills.character]) || null;
    if (typeof ensureMoodAtmosphere === 'function') fills = ensureMoodAtmosphere(fills, _cd0);
  } catch (e) {}

  /* 面板结论回填（2026-11-11）——必须放在归一化**之后**。
     ensureCoherence / ensureStyleSceneCoherence 会重建 fills，
     把面板补的值清掉（库内该风格没有那个取值时）。
     实测：optimizeBody 里补完 applied=['8K超清']，走到这里又变回 null。 */
  try { if (typeof applyAgentResult === 'function') applyAgentResult(text, fills); } catch (e) {}
  try { if (typeof applyParseFills === 'function') applyParseFills(text, fills); } catch (e) {}

  const styleData = KW_DB.style.categories[fills.style];
  const lightingData = KW_DB.lighting.categories[fills.lighting];
  const compData = KW_DB.composition.categories[fills.composition];
  const qualityData = KW_DB.quality.categories[fills.quality];
  const colorData = KW_DB.color ? KW_DB.color.categories[fills.color] : null;
  const atmoData = KW_DB.atmosphere ? KW_DB.atmosphere.categories[fills.atmosphere] : null;
  let charData = (KW_DB.character ? KW_DB.character.categories[fills.character] : null)
    || (window.__CHAR_SYNTH ? window.__CHAR_SYNTH[fills.character] : null);

  /* 泛称占位词条不算「认出主体」（2026-11-11）
     视频实测：人物被判成「概念角色」时，下面会认为主体已被覆盖，
     于是贴它的模板文案（「想象力无边」「随身带着能量武器」），
     用户写的「浑身是血」「跪」全丢——系统自己还提示「描述大部分未使用 27%」。
     概念角色是兜底占位，不是具体角色，所以这里置空，
     让流程走 polishUserSubject（保留用户原话）。 */
  if (fills && fills.character === '概念角色') charData = null;
  // 档案描述里的性别优先：用户写「病娇少年」，但档案 core 是「少女」时，
// 会出现「一位男性…偏执的少女」这种自相矛盾，这里按档案校正。
  // ===== 性别与档案一致性 =====
  // 「病娇」档案写的是「少女」，用户输入「病娇少年」会推成男性 → 出现「一位男性…少女」。
  // 档案自带的性别词优先。
  (function alignGenderWithArchive() {
    const cd = KW_DB.character && KW_DB.character.categories && KW_DB.character.categories[fills.character];
    // 第 3 层推理出来的词条：模型判定中性时，直接不要性别前缀
    if (cd && cd._genderNeutral) { fills.gender = ''; return; }
    const core = cd && cd.zh && cd.zh.core ? String(cd.zh.core) : '';
    if (!core) return;
    let implied = '';
    if (/少女|女孩|女人|女性|女子|女神|学姐|学妹|千金|皇|后|母|娘|婆/.test(core)) implied = '女性';
    else if (/少年|男孩|男人|男性|男子|男神|学长|公子|父亲|父|爷/.test(core)) implied = '男性';
    // 档案 core 自己已经写了「少女」「女子」，再前置「女性」就成了「一位女性…的女子」
    if (implied) fills.gender = '';
  })();

let genderData = KW_DB.gender ? KW_DB.gender.categories[fills.gender] : null;
  const sceneData = (KW_DB.scene ? KW_DB.scene.categories[fills.scene] : null)
    || (window.__SCENE_SYNTH ? window.__SCENE_SYNTH[fills.scene] : null);
  const platData = KW_DB.platform.formats[fills.platform];

  // 统一出口约束（两条路径都会经过这里）
  // 年代/破败信号：约束补全出来的氛围与色彩（放在共用入口，两条路径都生效）
  if (typeof applyEraToFills === 'function') fills = applyEraToFills(fills, text);
  if (typeof sanitizeFills === 'function') fills = sanitizeFills(fills, currentMode);

  const prompt = text.trim();
  const isScene = currentMode === 'scene';
  const isProp = currentMode === 'prop';
  // 人物是否由用户输入明确指定：未指定时（如"紫色鲸鱼"）不强行套用库内角色描述
  const charFromUser = !!(detection.character && detection.character.detected);

  let final;

  // ===== PROP MODE: 道具/物品专属输出 =====
  if (isProp) {
    const matData = fills.material;
    const texData = fills.texture;
    const dispData = fills.display;
    const bgData = fills.background;

    if (isZh) {
      if (depth === 'basic') {
        const parts = [];
        if (styleData && styleData.zh && styleData.zh.core) parts.push(connTail('style', styleData.zh.core));
        if (matData) parts.push(matData + '材质');
        if (texData) parts.push(texData + '质感');
        if (dispData) parts.push(dispData);
        if (lightingData && lightingData.zh && lightingData.zh.core) parts.push(lightingData.zh.core);
        if (bgData) parts.push(bgData);
        if (qualityData && qualityData.zh && qualityData.zh.core) parts.push(qualityData.zh.core);
        final = parts.join('，');
      } else if (depth === 'standard') {
        const s1 = [];
        if (styleData && styleData.zh) s1.push(connTail('style', styleData.zh.core));
        if (dispData) s1.push(dispData);
        const s2 = [];
        if (matData) s2.push(matData + '材质');
        if (texData) s2.push(texData + '质感');
        if (lightingData && lightingData.zh && lightingData.zh.core) s2.push(connTail('lighting', lightingData.zh.core));
        if (compData && compData.zh && compData.zh.core) s2.push(connTail('composition', compData.zh.core));
        if (colorData && colorData.zh && colorData.zh.core) s2.push(connTail('color', colorData.zh.core));
        if (bgData) s2.push(bgData);
        if (atmoData && atmoData.zh && atmoData.zh.core) s2.push(connTail('atmosphere', atmoData.zh.core));
        if (qualityData && qualityData.zh && qualityData.zh.core) s2.push(qualityData.zh.core);
        final = s1.join('，') + ' — ' + s2.join('，');
      } else {
        // deep — 叙事化深度描述
        const paragraphs = [];
        // 段落1：风格 + 呈现方式
        const p1 = [];
        if (styleData && styleData.zh) p1.push(connProp('style', styleData.zh.core));
        if (dispData) p1.push('采用' + dispData + '的展示方式');
        if (p1.length > 0) paragraphs.push(p1.join('，'));

        // 段落2：材质、质感、光影、构图、色彩
        const p2 = [];
        if (matData) {
          if (texData) {
            p2.push(matData + '材质展露出' + texData + '的质感');
          } else {
            p2.push(matData + '材质的细节在光影下层次分明');
          }
        } else if (texData) {
          p2.push('表面呈现' + texData + '的质感');
        }
        if (lightingData && lightingData.zh) {
          const lDesc = lightingData.zh.effect
            ? lightingData.zh.core + '的' + lightingData.zh.effect
            : lightingData.zh.core + '勾勒出主体的轮廓与体量';
          p2.push(lDesc);
        }
        if (compData && compData.zh) {
          const cDesc = compData.zh.effect
            ? compData.zh.core + '视角下' + compData.zh.effect
            : compData.zh.core + '视角强化了主体的视觉冲击力';
          p2.push(cDesc);
        }
        if (colorData && colorData.zh) {
          const colDesc = colorData.zh.detail
            ? withSuffix(colorData.zh.core, '色调') + colorData.zh.detail
            : colorData.zh.core + '色调奠定了画面的情绪基调';
          p2.push(colDesc);
        }
        paragraphs.push(p2.join('，'));

        // 段落3：背景、氛围、品质
        const p3 = [];
        const atmoCore = (atmoData && atmoData.zh) ? String(atmoData.zh.core || '') : '';
        const atmoDetail = (atmoData && atmoData.zh) ? String(atmoData.zh.detail || '') : '';
        // 氛围的 detail 有时自己就写了类别名（「繁华热闹的都市喧嚣氛围」），
        // 这时再用「城市中都市喧嚣的氛围弥漫」点一次，就成了
        // 「城市中都市喧嚣的氛围弥漫，繁华热闹的都市喧嚣氛围」。
        const atmoDetailHasCore = !!(atmoCore && atmoDetail && atmoDetail.indexOf(atmoCore) >= 0);
        if (bgData) {
          if (atmoCore && atmoDetailHasCore) {
            p3.push(bgData + '中，' + atmoDetail);
          } else if (atmoCore) {
            p3.push(connProp('atmosphere', atmoCore, bgData));
          } else {
            p3.push(bgData + '的背景将主体烘托得更加突出');
          }
        } else if (atmoCore) {
          p3.push(atmoDetailHasCore ? atmoDetail : connProp('atmosphere', atmoCore, ''));
        }
        if (atmoDetail && !(bgData && atmoDetailHasCore)) {
          p3.push(atmoDetail);
        }
        if (qualityData && qualityData.zh) {
          const qDesc = qualityData.zh.mode
            ? qualityData.zh.core + '画质，' + qualityData.zh.mode
            : qualityData.zh.core + '画质呈现';
          p3.push(qDesc);
        }
        paragraphs.push(p3.join('，'));
        if (!isZh && styleData && styleData.ref) paragraphs.push('参考：' + styleData.ref);
        if (!isZh && styleData && styleData.negative) paragraphs.push('避免：' + styleData.negative);
        final = paragraphs.join('。');
      }
    } else {
      // English prop mode
      if (depth === 'basic') {
        const parts = [];
        if (styleData) parts.push(styleData.core + ' style');
        if (matData) parts.push(matData + ' material');
        if (texData) parts.push(texData + ' texture');
        if (dispData) parts.push(dispData);
        if (lightingData) parts.push(lightingData.core);
        if (bgData) parts.push(bgData);
        if (qualityData) parts.push(qualityData.core);
        final = parts.join(', ').replace(/\s+/g, ' ').trim();
      } else if (depth === 'standard') {
        const s1 = [];
        if (styleData) s1.push(styleData.core + ' style');
        if (dispData) s1.push(dispData);
        const s2 = [];
        if (matData) s2.push(matData + ' material');
        if (texData) s2.push(texData + ' texture');
        if (lightingData) s2.push(lightingData.core + ' lighting');
        if (compData) s2.push(compData.core + ' view');
        if (colorData) s2.push(colorData.core + ' tones');
        if (bgData) s2.push(bgData);
        if (atmoData) s2.push(atmoData.core + ' atmosphere');
        if (qualityData) s2.push(qualityData.core);
        final = s1.join(', ') + ' — ' + s2.join(', ').replace(/\s+/g, ' ').trim();
      } else {
        final = `${styleData ? styleData.core + ' style' : ''}, ${dispData || 'product shot'}, ${matData ? matData + ' material' : ''}, ${texData ? texData + ' texture' : ''}, ${lightingData ? lightingData.core : ''} lighting, ${compData ? compData.core : ''} view, ${colorData ? colorData.core + ' tones' : ''}, ${bgData ? bgData : ''}, ${atmoData ? atmoData.core + ' atmosphere' : ''}, ${qualityData ? qualityData.core : ''}`.replace(/\s+/g, ' ').trim();
      }
    }
    if (prompt) final = prompt + (isZh ? '，' : ', ') + final;
    if (typeof stripRepeatedDimensionNames === 'function') final = stripRepeatedDimensionNames(final, text, fills);
  if (typeof withQualifiers === 'function') final = withQualifiers(final, text, detection);
  if (typeof applyEraToText === 'function') final = applyEraToText(final, text);
  if (typeof stripRepeatedDimensionNames === 'function') final = stripRepeatedDimensionNames(final, text, fills);
  return { optimized: final, platform: fills.platform };
  }

  if (depth === 'basic') {
    if (isScene) {
      if (isZh) {
        // ===== 场景简洁中文 =====
        const parts = [];
        const scA = sceneCoreIfNew(sceneData, text);
        if (scA) parts.push(scA);
        if (styleData && styleData.zh && styleData.zh.core) parts.push(connTail('style', styleData.zh.core));
        if (lightingData && lightingData.zh && lightingData.zh.core) parts.push(lightingData.zh.core);
        if (compData && compData.zh && compData.zh.core) parts.push(compData.zh.core);
        if (colorData && colorData.zh && colorData.zh.core) parts.push(connTail('color', colorData.zh.core));
        if (atmoData && atmoData.zh && atmoData.zh.core) parts.push(connTail('atmosphere', atmoData.zh.core));
        if (qualityData && qualityData.zh && qualityData.zh.core) parts.push(qualityData.zh.core);
        final = parts.join('，');
      } else {
        // ===== 场景简洁英文 =====
        const parts = [];
        if (sceneData) parts.push(`a ${sceneData.core}`);
        if (styleData) parts.push(`${styleData.core} style`);
        if (lightingData) parts.push(lightingData.core);
        if (compData) parts.push(compData.core);
        if (colorData) parts.push(`${colorData.core} tones`);
        if (atmoData) parts.push(`${atmoData.core} atmosphere`);
        if (qualityData) parts.push(qualityData.core);
        final = parts.join(', ').replace(/\s+/g, ' ').trim();
      }
    } else {
      if (isZh) {
        // ===== 简洁中文 =====
        const parts = [];
        if (genderData && genderData.zh && genderData.zh.core) parts.push(genderData.zh.core);
        if (charData && charData.zh && charFromUser) parts.push(charData.zh.core);
        const spA = scenePhrase(sceneData, '', '之中', text);
        if (spA) parts.push(spA);
        if (styleData && styleData.zh && styleData.zh.core) parts.push(connTail('style', styleData.zh.core));
        if (lightingData && lightingData.zh && lightingData.zh.core) parts.push(lightingData.zh.core);
        if (compData && compData.zh && compData.zh.core) parts.push(compData.zh.core);
        if (qualityData && qualityData.zh && qualityData.zh.core) parts.push(qualityData.zh.core);
        final = parts.join('，');
      } else {
        // ===== 简洁英文 =====
        const parts = [];
        if (genderData) parts.push(genderData.core);
        if (charData && charFromUser) parts.push(`a ${charData.core}`);
        if (sceneData) parts.push(`in a ${sceneData.core}`);
        if (styleData) parts.push(`${styleData.core} style`);
        if (lightingData) parts.push(lightingData.core);
        if (compData) parts.push(compData.core);
        if (qualityData) parts.push(qualityData.core);
        final = parts.join(', ').replace(/\s+/g, ' ').trim();
      }
    }
  } else if (depth === 'standard') {
    if (isScene) {
      if (isZh) {
        // ===== 场景标准中文：场景叙事 =====
        let s1 = '', s2 = '';
        const s1Parts = [];
        const scB = sceneCoreIfNew(sceneData, text);
        if (scB) s1Parts.push(scB);
        s1 = s1Parts.join('，');

        const s2Parts = [];
        if (styleData && styleData.zh && styleData.zh.core) s2Parts.push(connTail('style', styleData.zh.core));
        if (lightingData && lightingData.zh && lightingData.zh.core) s2Parts.push(connTail('lighting', lightingData.zh.core));
        if (compData && compData.zh && compData.zh.core) s2Parts.push(connTail('composition', compData.zh.core));
        if (colorData && colorData.zh && colorData.zh.core) s2Parts.push(connTail('color', colorData.zh.core));
        if (atmoData && atmoData.zh && atmoData.zh.core) s2Parts.push(connTail('atmosphere', atmoData.zh.core));
        if (qualityData && qualityData.zh && qualityData.zh.core) s2Parts.push(connTail('quality', qualityData.zh.core));
        s2 = s2Parts.join('，');

        final = s1 ? (s1 + '。' + s2 + '。') : (s2 + '。');
      } else {
        // ===== 场景标准英文 =====
        let sentence1 = '', sentence2 = '';
        const s1 = [];
        if (sceneData) {
          s1.push(`a ${sceneData.core} — ${enClause(varyDescription(sceneData.detail), 120)}`);
        }
        sentence1 = s1.join(', ');

        const s2 = [];
        if (styleData) s2.push(`${styleData.core} style`);
        if (lightingData) s2.push(`illuminated by ${lightingData.core}, ${enClause(varyDescription(lightingData.detail), 60)}`);
        if (compData) s2.push(`composed with ${compData.core}`);
        if (colorData) s2.push(`featuring ${colorData.core} tones`);
        if (atmoData) s2.push(`evoking a ${atmoData.core} atmosphere`);
        if (qualityData) s2.push(`rendered in ${qualityData.core}`);
        sentence2 = s2.join(', ');

        final = (sentence1 + '. ' + sentence2).replace(/\s+/g, ' ').trim();
      }
    } else {
      if (isZh) {
        // ===== 标准中文：两段式叙事 =====
        let s1 = '', s2 = '';
        const s1Parts = [];
        if (charData && charData.zh && charFromUser) {
          const gender = (genderData && genderData.zh) ? genderData.zh.core : '';
          s1Parts.push(characterOpening(fills.character, gender, charData.zh.core));
          const faceA = pickFace(detection, text, fills.character);
          if (faceA) s1Parts.push(faceA);
          else if (charData.zh.face) s1Parts.push(charData.zh.face);
          const userPoseA = extractUserPose(text);
          const traitA = pickTraitOverride(text);
          const variantA = (userPoseA || traitA) ? null : pickVariant(detection, text, fills.character);
          if (userPoseA) {
            s1Parts.push(userPoseA);
          } else if (variantA) {
            s1Parts.push(variantA);          // 变体已包含姿态+服饰，下面不再重复
          } else if (traitA && traitA.pose) {
            s1Parts.push(traitA.pose);
          } else if (charData.zh.pose) {
            s1Parts.push(charData.zh.pose);
          }
          if (traitA && traitA.mood) s1Parts.push(traitA.mood);
          /* 人物随身物 vs 所在场景的道具（2026-11-11，用户设计）
             科学家进咖啡馆，该在咖啡馆里找道具，而不是把整套实验器材搬过去。
             场景道具来自 /api/parse（任意场景都能给），取不到才用人物自带的。
             判定：人物自带的是「工作器材」且场景有道具 → 换场景道具。 */
          var _sp = null;
          try {
            var _pp = (window.__parse && window.__parse.data && window.__parse.data['场景道具']) || null;
            if (_pp && _pp.length) {
              _sp = _pp;
            } else {
              var _sc0 = (fills && fills.scene) || (sceneData && sceneData.zh && sceneData.zh.core) || '';
              // 兜底表用「包含」匹配：fills.scene 可能是「街角咖啡馆」，表里只有「咖啡馆」
              if (typeof scenePropTable === 'function') _sp = scenePropTable(_sc0);
            }
          } catch (e) { _sp = null; }
          /* 工作场所保留人物自带的器材（2026-11-11）
             上面「有场景道具就换」太宽：实验室里科学家就该有显微镜。
             所以先判断场景是不是工作场所——是就一律保留。 */
          var _curScene = String((fills && fills.scene) || (sceneData && sceneData.zh && sceneData.zh.core) || '');
          var _isWorkScene = WORK_SCENE.test(_curScene);
          if (_isWorkScene) _sp = null;
          /* 场景道具还要筛「能不能拿在手里」（2026-11-11）
             实测「圣托里尼」的场景道具是：蓝顶教堂 / 白墙 / 陶罐 ——
             结果拼成「随身带着蓝顶教堂，白墙」，等于一个人扛着教堂。
             建筑、地貌、天空、光影一律不许进「随身带着」。 */
          var _NOT_CARRY = NOT_CARRY_PROP;   // 装配/收尾共用一份（见 NOT_CARRY_PROP 注释）
          if (_sp) {
            _sp = _sp.filter(function (x) { return !_NOT_CARRY.test(String(x)); });
            if (!_sp.length) _sp = null;
          }
          var _charProps = String(charData.zh.carries || '');
          var _isWorkProp = /试管|显微镜|烧杯|量筒|数据平板|记录板|示波器|离心机|培养皿|试剂|焊枪|扳手|图纸|游标卡尺|万用表/.test(_charProps);
          if (_sp && _sp.length && _isWorkProp) {
            s1Parts.push('随身带着' + _sp.join('，'));
          } else if (charData.zh.carries) {
            s1Parts.push('随身带着' + charData.zh.carries);
          }
          if (!variantA && (charData.zh.worn || charData.zh.detail)) {
            if (hasUserClothing(text)) { const ud = userClothingDetail(text); if (ud) s1Parts.push(ud); }
            else s1Parts.push('身着' + (charData.zh.worn || charData.zh.detail));
          }
        }
        if (sceneData && sceneData.zh) {
          const spB = scenePhrase(sceneData, '身处', '', text);
          if (spB) s1Parts.push(spB);
        }
        s1 = s1Parts.join('，');

        const s2Parts = [];
        if (styleData && styleData.zh && styleData.zh.core) s2Parts.push(connTail('style', styleData.zh.core));
        if (lightingData && lightingData.zh && lightingData.zh.core) s2Parts.push(connTail('lighting', lightingData.zh.core));
        if (compData && compData.zh && compData.zh.core) s2Parts.push(connTail('composition', compData.zh.core));
        if (colorData && colorData.zh && colorData.zh.core) s2Parts.push(connTail('color', colorData.zh.core));
        if (atmoData && atmoData.zh && atmoData.zh.core) s2Parts.push(connTail('atmosphere', atmoData.zh.core));
        if (qualityData && qualityData.zh && qualityData.zh.core) s2Parts.push(connTail('quality', qualityData.zh.core));
        s2 = s2Parts.join('，');

        final = s1 ? (s1 + '。' + s2 + '。') : (s2 + '。');
      } else {
        // ===== 标准英文 =====
        let sentence1 = '', sentence2 = '';
        const s1 = [];
        if (charData && charFromUser) {
          const face = enClause(varyDescription(charData.face), 80);
          const pose = enClause(varyDescription(charData.pose), 80);
          const detail = enClause(varyDescription(charData.detail), 60);
          const gender = genderData ? genderData.core + ' ' : '';
          s1.push(`a ${gender}${charData.core} with ${face}, ${pose}${hasUserClothing(text) ? userClothingDetailEn(text) : ', wearing ' + detail}`);
        }
        if (sceneData) {
          s1.push(`set in a ${sceneData.core} — ${enClause(varyDescription(sceneData.detail), 100)}`);
        }
        sentence1 = s1.join(', ');

        const s2 = [];
        if (styleData) s2.push(`${styleData.core} style`);
        if (lightingData) s2.push(`illuminated by ${lightingData.core}, ${enClause(varyDescription(lightingData.detail), 60)}`);
        if (compData) s2.push(`composed with ${compData.core}`);
        if (colorData) s2.push(`featuring ${colorData.core} tones`);
        if (atmoData) s2.push(`evoking a ${atmoData.core} atmosphere`);
        if (qualityData) s2.push(`rendered in ${qualityData.core}`);
        sentence2 = s2.join(', ');

        final = (sentence1 + '. ' + sentence2).replace(/\s+/g, ' ').trim();
      }
    }
  } else {
    if (isScene) {
      if (isZh) {
        // ===== 场景深度中文：完整场景段落 =====
        const paragraphs = [];

        // Para 1: 场景详细描述
        const p1 = [];
        const scC = sceneCoreIfNew(sceneData, text);
        if (scC) p1.push(scC);
        if (p1.length > 0) paragraphs.push(p1.join('，'));

        // Para 2: 风格 + 光线 + 构图 + 色彩
        const p2 = [];
        if (styleData && styleData.zh) p2.push(connDeep('style', styleData.zh.core));
        if (lightingData && lightingData.zh) p2.push(connDeep('lighting', lightingData.zh.core));
        if (compData && compData.zh) p2.push(connDeep('composition', compData.zh.core));
        if (colorData && colorData.zh) p2.push(connDeep('color', colorData.zh.core));
        paragraphs.push(p2.join('，'));

        // Para 3: 氛围 + 画质
        const p3 = [];
        if (atmoData && atmoData.zh && atmoData.zh.core) p3.push(connDeep('atmosphere', atmoData.zh.core));
        if (qualityData && qualityData.zh && qualityData.zh.core) p3.push(connDeep('quality', qualityData.zh.core));
        paragraphs.push(p3.join('，'));

        final = paragraphs.join('。');
      } else {
        // ===== 场景深度英文 =====
        const paragraphs = [];

        const p1 = [];
        if (sceneData) {
          p1.push(`a ${sceneData.core}, where ${varyDescription(sceneData.detail)}`);
        }
        if (p1.length > 0) paragraphs.push(p1.join(', '));

        const p2 = [];
        if (styleData) p2.push(`the ${styleData.core} style shapes the world with ${varyDescription(styleData.detail)}`);
        if (lightingData) p2.push(`${lightingData.core} bathes the scene, ${varyDescription(lightingData.detail)}`);
        if (compData) p2.push(`captured in ${compData.core}${compData.tech ? ' with ' + compData.tech : ''}`);
        if (colorData) p2.push(`the ${colorData.core} color palette${colorData.detail ? ' — ' + varyDescription(colorData.detail) : ''} dominates`);
        paragraphs.push(p2.join('. '));

        const p3 = [];
        if (atmoData) p3.push(`the atmosphere is ${atmoData.core}, ${varyDescription(atmoData.mood)}`);
        if (qualityData) p3.push(`rendered in ${qualityData.core}${qualityData.tech ? ', ' + qualityData.tech : ''}`);
        if (styleData && styleData.ref) p3.push(`inspired by ${styleData.ref}`);
        paragraphs.push(p3.join('. '));

        if (styleData && styleData.negative) paragraphs.push(`avoid: ${styleData.negative}`);

        final = paragraphs.join('. ').replace(/\s+/g, ' ').trim();
      }
    } else {
      if (isZh) {
        // ===== 深度中文：完整段落叙事 =====
        const paragraphs = [];

        // Para 1: 人物 + 场景
        const p1 = [];
        if (charData && charData.zh && charFromUser) {
          const gender = (genderData && genderData.zh) ? genderData.zh.core : '';
          p1.push(characterOpening(fills.character, gender, charData.zh.core));
          const faceB = pickFace(detection, text, fills.character);
          if (faceB) p1.push(faceB);
          else if (charData.zh.face) p1.push(charData.zh.face);
          const userPoseB = extractUserPose(text);
          const traitB = pickTraitOverride(text);
          const variantB = (userPoseB || traitB) ? null : pickVariant(detection, text, fills.character);
          if (userPoseB) {
            p1.push(userPoseB);
          } else if (variantB) {
            p1.push(variantB);
          } else if (traitB && traitB.pose) {
            p1.push(traitB.pose);
          } else if (charData.zh.pose) {
            p1.push(charData.zh.pose);
          }
          if (traitB && traitB.mood) p1.push(traitB.mood);
          if (!variantB && (charData.zh.worn || charData.zh.detail)) {
            if (hasUserClothing(text)) { const ud = userClothingDetail(text); if (ud) p1.push(ud); }
            else p1.push('身着' + (charData.zh.worn || charData.zh.detail));
          }
        }
        if (sceneData && sceneData.zh) {
          const spC = scenePhrase(sceneData, '置身于', '之中', text);
          if (spC) p1.push(spC);
        }
        if (p1.length > 0) paragraphs.push(p1.join('，'));

        // Para 2: 风格 + 光线 + 构图 + 色彩
        const p2 = [];
        if (styleData && styleData.zh) p2.push(connDeep('style', styleData.zh.core));
        if (lightingData && lightingData.zh) p2.push(connDeep('lighting', lightingData.zh.core));
        if (compData && compData.zh) p2.push(connDeep('composition', compData.zh.core));
        if (colorData && colorData.zh) p2.push(connDeep('color', colorData.zh.core));
        paragraphs.push(p2.join('，'));

        // Para 3: 氛围 + 画质 + 参考
        const p3 = [];
        if (atmoData && atmoData.zh && atmoData.zh.core) p3.push(connDeep('atmosphere', atmoData.zh.core));
        if (charData && charData.zh && charFromUser && charData.zh.mood) {
          const moodTxt = dropAlreadySaid(charData.zh.mood, p1.join('，') + '，' + p2.join('，'));
          if (moodTxt) p3.push('人物气质' + moodTxt);
        }
        if (qualityData && qualityData.zh && qualityData.zh.core) p3.push(connDeep('quality', qualityData.zh.core));
        paragraphs.push(p3.join('，'));

        // Para 4: 负面提示 (skip for Chinese — negative prompts are English keywords)
        if (!isZh && styleData && styleData.negative) paragraphs.push('avoid: ' + styleData.negative);

        final = paragraphs.join('。');
      } else {
        // ===== 深度英文 =====
        const paragraphs = [];

        const p1 = [];
        if (genderData) p1.push(genderData.core);
        if (charData && charFromUser) {
          p1.push(`a ${charData.core} with ${varyDescription(charData.face)}`);
          p1.push(varyDescription(charData.pose));
          if (hasUserClothing(text)) { const ud = userClothingDetailEn(text); if (ud) p1.push(ud); }
          else p1.push(`wearing ${varyDescription(charData.detail)}`);
        }
        if (sceneData) {
          p1.push(`standing in a ${sceneData.core}, where ${varyDescription(sceneData.detail)}`);
        }
        paragraphs.push(p1.join(', '));

        const p2 = [];
        if (styleData) p2.push(`the ${styleData.core} style shapes the world with ${varyDescription(styleData.detail)}`);
        if (lightingData) p2.push(`${lightingData.core} bathes the scene, ${varyDescription(lightingData.detail)}`);
        if (compData) p2.push(`captured in ${compData.core}${compData.tech ? ' with ' + compData.tech : ''}`);
        if (colorData) p2.push(`the ${colorData.core} color palette${colorData.detail ? ' — ' + varyDescription(colorData.detail) : ''} dominates`);
        paragraphs.push(p2.join('. '));

        const p3 = [];
        if (atmoData) p3.push(`the atmosphere is ${atmoData.core}, ${varyDescription(atmoData.mood)}`);
        if (charData && charFromUser && charData.mood) p3.push(`the character exudes ${varyDescription(charData.mood)}`);
        if (qualityData) p3.push(`rendered in ${qualityData.core}${qualityData.tech ? ', ' + qualityData.tech : ''}`);
        if (styleData && styleData.ref) p3.push(`inspired by ${styleData.ref}`);
        paragraphs.push(p3.join('. '));

        if (styleData && styleData.negative) paragraphs.push(`avoid: ${styleData.negative}`);

        final = paragraphs.join('. ').replace(/\s+/g, ' ').trim();
      }
    }
  }

  // ===== 保留用户原文作为主体，防止新颖概念被库内回退值替换 =====
  // ISSUE：原来无条件拼在开头，导致「用户原句一个主角 + 生成档案另一个主角」，
  // 例如「一位目光深邃的老者，一位男性强壮的摔跤手」——一句话两个主体。
  // 现在只在「用户描述的概念库里根本没识别出来」时才保留原句；
  // 一旦识别出了主体/场景，生成结果已经覆盖，不再重复粘贴。
  // 只有当「角色确实被识别出来」且「库内有该角色模板」时，生成结果才会自带主体；
  // 其余情况（只识别到场景 / 角色是库外名）必须保留用户原句，否则会输出缺主语的半句。
  const subjectCovered = !!(charFromUser && charData);
  if (prompt && !subjectCovered) {
    /* 认不出主体时，原来是整句原话照抄（「一个浑身是血的男人跪在教堂面前，身处其间…」）。
       2026-11-11 用户明确指出：复读不算好用。
       这里改成把原话整理成「主语从句 + 姿态从句」，
       场景尾巴剥掉（由 scenePhrase 正常引入，避免「教堂…教堂」）。
       整理不出来时 polishUserSubject 会原样返回，不会丢信息。 */
    let subjectLine = prompt;
    if (isZh && typeof polishUserSubject === 'function') {
      try {
        subjectLine = polishUserSubject(prompt, {
          gender: (fills && fills.gender) || '',
          sceneCore: (typeof sceneData !== 'undefined' && sceneData && sceneData.zh && sceneData.zh.core) || ''
        }) || prompt;
      } catch (e) { subjectLine = prompt; }
    }
    final = subjectLine + (isZh ? '，' : ', ') + final;
  }

  // ===== 去重：同一动词只保留一次、完全重复的段直接丢弃 =====
  // 解决「手持法杖…手持花束」「身着舞裙…身着长袍」这类重复动作，
  // 以及同一个词被两套模板各写一遍的问题。纯字符串处理，不改任何分支逻辑。
  if (typeof final === 'string' && final && isZh) {
    // 注意：实际输出里两种分隔符都会出现（中文「，」与英文 ", "），必须一起切
    const segs = final.split(/[，,]/);
    const seenSeg = new Set();
    const seenVerb = new Set();
    const kept = [];
    for (const raw of segs) {
      const p = raw.trim();
      if (!p) continue;
      const norm = p.replace(/\s+/g, '');
      if (seenSeg.has(norm)) continue;                       // 整段完全重复
      const vm = norm.match(/^(手持|手拿|身着|身穿|展开|举起|施展)/);
      if (vm) {
        if (seenVerb.has(vm[1])) continue;                   // 同一动词只留第一次
        seenVerb.add(vm[1]);
      }
      seenSeg.add(norm);
      kept.push(p);
    }
    final = kept.join('，');
  }

  // Platform formatting (language-aware)
  if (platData.format === 'mj') {
    final += platData.suffix;
  } else if (platData.format === 'sd') {
    const sdPrefix = isZh ? '(杰作，最佳画质:1.2), ' : '(masterpiece, best quality:1.2), ';
    final = sdPrefix + final;
  }

  if (typeof stripRepeatedDimensionNames === 'function') final = stripRepeatedDimensionNames(final, text, fills);
  if (typeof withQualifiers === 'function') final = withQualifiers(final, text, detection);
  if (typeof applyEraToText === 'function') final = applyEraToText(final, text);
  // 英文侧最后一道：冠词 a/an 对齐（2026-11-11）
  // 模板拼出来是 `a ${core}`，core 以元音开头就变成「a androgynous」「a epic」。
  if (typeof fixArticles === 'function') final = fixArticles(final, text);
  // 库外的描述（raw）原样插一句，不让它被硬套或丢掉
  try { if (typeof appendRawClause === 'function') final = appendRawClause(final, text, isZh); } catch (e) {}
  // 繁体形「著」收回「着」：不管源头是数据还是推理文案，出门前统一
  try { if (isZh && typeof toSimplifiedParticles === 'function') final = toSimplifiedParticles(final); } catch (e) {}
  // 分成「画面」与「参数」两段，避免读成一串清单
  try { if (typeof weaveClauses === 'function') final = weaveClauses(final, isZh); } catch (e) {}
  // 最后一段再拆一层：画法（风格/光线/机位）｜调性（色调/氛围/画质）
  try { if (isZh && typeof splitParamSentence === 'function') final = splitParamSentence(final); } catch (e) {}
  // 休闲场景里不该出现工作器材（科学家进咖啡馆还带显微镜）
  try {
    var _sc = (typeof sceneData !== 'undefined' && sceneData && sceneData.zh && sceneData.zh.core) || (fills && fills.scene) || '';
    if (isZh && typeof dropSceneMismatchCarries === 'function') final = dropSceneMismatchCarries(final, _sc);
  } catch (e) {}

  return {
    optimized: final,
    depth: depth,
    platform: fills.platform,
    sections: [final]
  };
}

function highlightDifferences(userText, optimized) {
  const userPrompt = userText.trim();
  const full = optimized;

  // Find where user's original text appears in the final output
  const idx = full.indexOf(userPrompt);
  if (idx === -1) {
    // User text modified (e.g., platform prefix added) — show all as plain
    return escapeHtml(full);
  }

  let html = '';
  // Text before user's prompt (platform prefix, etc.)
  if (idx > 0) {
    html += '<span class="ai-add">' + escapeHtml(full.substring(0, idx)) + '</span>';
  }
  // User's original text
  html += '<span class="user-text">' + escapeHtml(full.substring(idx, idx + userPrompt.length)) + '</span>';
  // AI additions after user's prompt
  if (idx + userPrompt.length < full.length) {
    html += '<span class="ai-add">' + escapeHtml(full.substring(idx + userPrompt.length)) + '</span>';
  }

  return html;
}
