/* app-detect.js —— 检测层：从一句中文里认出维度（字面 → 概念 → 地点/地域/年代规则）。
   核心是 detectDimensions（472 行）。这一层只读输入、不写输出。
   从 app.js 拆出（2026-11-11），只搬函数、不动顶层 const/let。
   加载顺序见 index.html：detect → fill → assemble → ui → app.js。 */

function applyEnglishDetection(text, result) {
  const t = text.toLowerCase();
  for (const [words, dim, key] of EN_RULES) {
    if (result[dim] && result[dim].detected) continue;
    for (const w of words) {
      if (t.includes(w)) {
        result[dim].detected = key;
        result[dim].keywords.push(w);
        break;
      }
    }
  }
}

function detectConceptSemantics(text) {
  const hits = {};
  for (const [word, mapping] of Object.entries(CONCEPT_MAP)) {
    if (text.includes(word)) {
      for (const [dim, value] of Object.entries(mapping)) {
        if (!hits[dim]) hits[dim] = value;
      }
    }
  }
  return hits;
}

function detectSimpleItemSemantics(text) {
  const hits = {};
  let bestKey = '';
  for (const key of Object.keys(SIMPLE_ITEM_MAP)) {
    // 最长关键词优先，避免"红苹果"被"苹果"、"雨伞"被"伞"等子串误判
    if (key.length >= bestKey.length && text.includes(key)) {
      bestKey = key;
    }
  }
  if (bestKey) {
    const mapping = SIMPLE_ITEM_MAP[bestKey];
    for (const [dim, value] of Object.entries(mapping)) {
      if (!hits[dim]) hits[dim] = value;
    }
  }
  return hits;
}

function detectSubjectCount(text) {
  const t = String(text || '');
  if (/(一群|众人|成群|若干|多位|数位)/.test(t)) return 3;
  if (/(三个|三位|三名|三人|仨)/.test(t)) return 3;
  if (/(两个|两位|两名|俩人|二人|一对|双人|双手各)/.test(t)) return 2;
  return 1;
}

function extractUserPose(text) {
  const t = String(text || '');
  const spans = [];

  function add(re) {
    const g = new RegExp(re.source, 'g');
    let m;
    while ((m = g.exec(t)) !== null) {
      const s = m.index;
      const e = s + m[0].length;
      let clash = false;
      for (let i = 0; i < spans.length; i++) {
        if (Math.min(e, spans[i].e) > Math.max(s, spans[i].s)) { clash = true; break; }
      }
      if (!clash) { spans.push({ s: s, e: e }); return; }
      g.lastIndex = e > s ? e : s + 1;   // 这段和别人撞了，往后找下一段
    }
  }

  add(POSE_HOLD_RE);   // 手持物更具体，先占位
  add(POSE_MOVE_RE);

  if (!spans.length) return null;
  spans.sort(function (a, b) { return a.s - b.s; });   // 按原文顺序，不按匹配顺序
  return spans.slice(0, 2).map(function (sp) {
    return t.slice(sp.s, sp.e).trim();
  }).filter(Boolean).join('，');
}

/* 两个词共享的字数，用于「只共享一个字就降权」 */
function sharedCharCount(a, b) {
  const set = {};
  String(b || '').split('').forEach(function (c) { set[c] = 1; });
  let n = 0;
  String(a || '').split('').forEach(function (c) { if (set[c]) { n++; set[c] = 0; } });
  return n;
}

function inferSubjectType(text, detection) {
  const t = String(text || '');
  const c = detection && detection.character && detection.character.detected;
  const s = detection && detection.scene && detection.scene.detected;
  const m = detection && detection.material && detection.material.detected;

  // 生物优先：「只」既用于动物也用于物件，生物词出现时按人物处理
  // 2026-11-11 修：原来单字「精 / 怪」也在里面，于是「形状古怪」「奇怪花纹」
  // 全被判成生物 → 一把剑被当成人物去推理（服务端拿 worn/outward/pose 问它，
  // 必然「描述太薄」），用户白等 10 秒。
  // 单字保留 妖 / 魔（几乎只用于生物），组合词用「妖怪 / 精怪 / 怪物」兜。
  const CREATURE = /龙|凤|凰|兽|鹰|蛇|狼|虎|豹|狮|熊|鸟|鱼|猫|狗|兔|马|鹿|羊|牛|猪|狐|猿|猴|妖|魔|妖怪|精怪|怪物|生物|巨兽|巨蟒|飞龙|麒麟|独角兽|坐骑/;
  if (CREATURE.test(t)) return 'character';

  // 人物词优先于量词： 「一位穿着长裙的少女，手里拿着一把黑色的伞」
  // 原来被「一把」直接判成道具，整条输出变成「布料材质 / 虚空吞噬质感 / 手持展示」。
  const HAS_PERSON_WORD = /(女子|男子|少女|少年|女人|男人|老人|老者|孩子|孩童|姑娘|小伙|先生|小姐|老板|总裁|经理|女仆|道士|骑士|剑客|剑修|机械师|艺人|乐手|战士|学生|士|客|师|侠|者|人)/;
  if (/[一这那]\s*(把|盏|杯|只|部|件|台|枚|柄|颗|根)/.test(t) && !HAS_PERSON_WORD.test(t)) return 'prop';
  if (/[一这那]\s*(位|名)/.test(t)) return 'character';
  if (/[一这那]\s*个/.test(t) && c) return 'character';
  if (/[一这那]\s*(片|座|间|处|栋|条)/.test(t)) return 'scene';

  // 3. 人称名词优先于材质： 「雨夜中撑伞的女子」里「伞」会带出材质「布料」，
  //    而「女子」不在角色库，原来会被判成道具。
  if (/(女子|男子|少女|少年|女人|男人|老人|老者|孩子|孩童|姑娘|小伙|先生|小姐|士|客|师|侠|者|人)/.test(t)) {
    if (!/[一这那]\s*(把|盏|杯|只|部|件|台|枚|柄)/.test(t)) return 'character';
  }

  // 4. 以物件名词结尾的，基本是物而不是人（「古旧的机械怀表」原来被判成人物，
  //    因为「机械」命中了角色映射「机械师」）
  if (/(表|钟|灯|剑|刀|枪|杯|碗|壶|镜|箱|盒|册|卷轴|钱币|徽章|面具|披风|长袍|器|装置|载具|飞船|特写)\s*$/.test(t.trim())) return 'prop';

  if (c && !m) return 'character';
  // 场景优先于材质：「冰原」「银河」会带出材质（冰晶/金属），但它们本质是场景
  if (s && !c) return 'scene';
  if (m && !c) return 'prop';
  if (c) return 'character';
  if (s) return 'scene';
  return 'character';
}

function maskCompounds(text) {
  let out = String(text || '');
  COMPOUND_WORDS.forEach(function (w) {
    if (out.indexOf(w) >= 0) {
      out = out.split(w).join('〇'.repeat(w.length));
    }
  });
  return out;
}

function hasPlaceEvidence(t, p, w) {
  const before = t.slice(Math.max(0, p - 2), p);
  const after = t.slice(p + w.length, p + w.length + 2);
  if (/[在于是从自往向到]/.test(before)) return true;
  if (/^(前|后|上|下|里|中|内|外|旁|边|处|之|的|的|，|。|、|！|？|$)/.test(after)) return true;
  if (p === 0 || /[，。；、！？\n]$/.test(t.slice(0, p - 0))) return true;
  return false;
}

function extractUserPlace(text) {
  const t = String(text || '');
  if (!t) return null;
  const hits = [];
  for (let i = 0; i < PLACE_NOUNS.length; i++) {
    const w = PLACE_NOUNS[i];
    let p = t.indexOf(w);
    while (p >= 0) {
      if (hasPlaceEvidence(t, p, w)) { hits.push({ w: w, p: p, len: w.length }); break; }
      p = t.indexOf(w, p + 1);
    }
  }
  // 兜底：「X屋」「X楼」这类没进词表的，靠后缀 + 索引证再抓一次
  if (!hits.length) {
    const RE = /([\u4e00-\u9fff]{1,2})(殿|堂|庙|寺|塔|楼|阁|亭|台|窗|街|巷|院|园|林|山|峰|崖|洞|谷|海|岸|城|镇|村|室|厅|馆|场|檐|树|宫|井|墓|间|岛|溪|潭|堡|巢|穴|窟|站|舱)/g;
    let m;
    while ((m = RE.exec(t)) !== null) {
      const w = m[1] + m[2];
      // 吃掉「的」这类修饰，只留名词本身
      const clean = w.replace(/^[的了着是在于和与把被这那]/, '');
      if (clean.length < 2) continue;
      if (hasPlaceEvidence(t, m.index, w)) hits.push({ w: clean, p: m.index, len: clean.length });
    }
  }
  if (!hits.length) return null;
  hits.sort(function (a, b) { return b.len - a.len || a.p - b.p; });
  return hits[0].w;
}

function synthScene(place, seedText) {
  if (!place) return null;
  if (!window.__SCENE_SYNTH) window.__SCENE_SYNTH = {};
  if (!window.__SCENE_SYNTH[place]) {
    const idx = (connHash ? connHash(String(seedText || place) + place) : 0) % SYNTH_SCENE_DETAILS.length;
    window.__SCENE_SYNTH[place] = {
      core: '',
      zh: { core: place, detail: SYNTH_SCENE_DETAILS[idx] },
      _synth: true
    };
  }
  return window.__SCENE_SYNTH[place];
}

function sceneLibCore(name) {
  const cat = KW_DB && KW_DB.scene && KW_DB.scene.categories
    ? KW_DB.scene.categories[name] : null;
  if (!cat) return name;
  return (cat.zh && cat.zh.core) || name;
}

function oneCharStandalone(key, text) {
  if (!key || key.length !== 1) return true;
  let i = text.indexOf(key);
  if (i < 0) return false;
  while (i >= 0) {
    const before = text.slice(0, i);
    const after = text.slice(i + 1);
    const okB = before === '' || /[，。；、！？\s的是有个位名只把被和与在之这那]/.test(before.slice(-2)) || /[，。；、！？\s]$/.test(before);
    const okA = after === '' || /^[，。；、！？\s的]/.test(after);
    if (okB && okA) return true;
    i = text.indexOf(key, i + 1);
  }
  return false;
}

function synthSubject(noun) {
  if (!noun) return null;
  if (!window.__CHAR_SYNTH) window.__CHAR_SYNTH = {};
  if (!window.__CHAR_SYNTH[noun]) {
    window.__CHAR_SYNTH[noun] = {
      core: '',
      zh: { core: noun, worn: '', face: '', pose: '', detail: '', carries: '', mood: '' },
      _synth: true
    };
  }
  return window.__CHAR_SYNTH[noun];
}

function detectDimensions(text, mode) {
  // 原始输入留一份：下面会 stripEmoji / maskCompounds，
  // 但「用户到底写了哪个地点」要按原话来判断，不能按遮蔽后的串。
  const originalText = String(text || '');
  // 先提取概念核心词语义（ISSUE-006/008），再过滤 emoji 避免误判
  const conceptHits = detectConceptSemantics(text);
  // 简单物品语义提取（ISSUE-005）
  const itemHits = detectSimpleItemSemantics(text);
  // 过滤 emoji / 特殊符号，避免误判为关键词（问题10）
  text = stripEmoji(text);
  // 复合词保护：先遮蔽再检测，避免单字误触
  text = maskCompounds(text);
  const result = {};
  const dims = ['style', 'lighting', 'composition', 'quality', 'color', 'atmosphere', 'character', 'gender', 'scene', 'platform', 'material', 'texture', 'display', 'background'];
  dims.forEach(d => { result[d] = { detected: null, keywords: [] }; });

  // 方案 A：记录本次检测的「信息利用率」与「多主体」
  const A_UTIL_THRESHOLD = 0.35;   // 命中字数 / 输入字数，低于此值视为利用不足
  const aMulti = {};               // { dim: [命中的库名...] } 仅当 >=2 个
  const aMatched = [];             // 命中的库名（去重）

  // 应用概念核心词检测结果（优先作为该维度来源）
  for (const [dim, value] of Object.entries(conceptHits)) {
    if (result[dim]) {
      result[dim].detected = value;
      result[dim].keywords.push('概念');
    }
  }

  // 应用简单物品检测结果（材质/质感/展示/背景）
  for (const [dim, value] of Object.entries(itemHits)) {
    if (result[dim] && !result[dim].detected) {
      result[dim].detected = value;
      result[dim].keywords.push('物品');
    }
  }

  // 英文输入时先补充英文语义匹配，避免 0 命中（ISSUE-011）
  if (!detectLanguage(text)) {
    applyEnglishDetection(text, result);
  }

  // Detect platform
  for (const [plat, data] of Object.entries(KW_DB.platform.formats)) {
    if (plat === '通用') continue; // Skip generic, check specific platforms first
    const pkw = data.keywords || [];
    for (const kw of pkw) {
      if (text.toLowerCase().includes(kw.toLowerCase())) { result.platform.detected = plat; result.platform.keywords.push(kw); break; }
    }
    if (result.platform.detected) break;
  }

  // Detect quality
  // 原实现：对每个类目遍历"全局扁平 keywords"，任何关键词都会命中第一个类目
  // （于是 4K高清 / 电影级 / HDR / 极致细节 全被归成 8K超高清）。
  // 现在只做「类目名直匹 + 最长优先」，由下面的名字直匹块统一处理。
  // 关键词表本身与类目没有映射关系，无法正确回退，故不再使用。

  // ===== 兜底：直接用「词条名」匹配（最长优先）=====
  // 审计结果：词库 1667 条，CONTEXT_MAP 只覆盖约 100 条，其余 94% 永远命中不了。
  // 用户若直接说出库里某个名字，那是最强信号，应优先于关键词映射。
  // 放在 CONTEXT_MAP 之前：命中后，下面的循环会因为 detected 已存在而跳过。
  (function matchByEntryName() {
    const NAME_DIMS = ['scene', 'character', 'style', 'lighting', 'composition', 'color', 'atmosphere', 'quality'];
    NAME_DIMS.forEach(function (dim) {
      const cur = result[dim];
      // 概念/物品映射只根据一个短词推出来的结果，可以被更具体的库名覆盖
      // 例：「樱花林」原来被概念词「樱花」判成「樱花庭院」，应改为「樱花林」
      const srcKey = cur && cur.keywords && cur.keywords[0];
      const overridable = (srcKey === '概念' || srcKey === '物品');
      if (cur && cur.detected && !overridable) return;
      const cats = (KW_DB[dim] && KW_DB[dim].categories) || {};
      const cands = [];
      for (const name in cats) {
        if (text.indexOf(name) >= 0) cands.push(name);
      }
      if (!cands.length) return;
      cands.sort(function (a, b) { return b.length - a.length; });
      if (cands.length > 1) aMulti[dim] = cands.slice(0, 4);
      const best = cands[0];
      result[dim].detected = best;
      result[dim].keywords = [best];
      if (aMatched.indexOf(best) < 0) aMatched.push(best);
    });
  })();

  // Detect via context mapping (style, lighting, composition, color, atmosphere)
  // 最长关键词优先匹配，避免"月光庭院"被"庭院"、"星空中"被"空中"等子串误判
  const dimMap = { style: 'style', lighting: 'lighting', composition: 'composition', color: 'color', atmosphere: 'atmosphere', character: 'character', gender: 'gender', scene: 'scene' };
  // 道具模式：跳过人物/性别/场景检测，避免"火焰长枪"被误判为"火焰法师"（ISSUE-020）
  const propSkipDims = mode === 'prop' ? new Set(['character', 'gender', 'scene']) : new Set();
  for (const [ctxKey, dimKey] of Object.entries(dimMap)) {
    if (!CONTEXT_MAP[ctxKey]) continue;
    // 道具模式跳过非道具维度
    if (propSkipDims.has(dimKey)) continue;
    // 英文已命中该维度则跳过中文匹配，避免覆盖英文结果（ISSUE-011）
    if (result[dimKey] && result[dimKey].detected) continue;

    // style 维度：优先匹配"X风格"显式声明（如"水墨风格"），再回退到最长关键词
    if (ctxKey === 'style') {
      const styleDecl = text.match(/([\u4e00-\u9fff]{1,5})风格/);
      if (styleDecl) {
        const word = styleDecl[1];
        for (const mapping of CONTEXT_MAP.style) {
          if (mapping.keys.includes(word)) {
            result.style.detected = mapping.style;
            result.style.keywords.push(word);
            break;
          }
        }
      }
      if (result.style.detected) continue;
    }

    let bestMapping = null;
    let bestKey = '';
    for (const mapping of CONTEXT_MAP[ctxKey]) {
      for (const key of mapping.keys) {
        // 人物/场景：单字 key 被包在更长的词里就不算（龙傲天 ≠ 龙骑士）
        if ((ctxKey === 'character' || ctxKey === 'scene') && !oneCharStandalone(key, text)) continue;
        // 同长度时后者（更具体的映射）胜出，避免"星空下的森林"被先出现的"森林"压过
        if (key.length >= bestKey.length && text.includes(key)) {
          bestKey = key;
          bestMapping = mapping;
        }
      }
    }
    if (bestMapping) {
      result[dimKey].detected = bestMapping[dimKey];
      result[dimKey].keywords.push(bestKey);
    }
  }

  // ===== 用户写的地点优先 =====
  // 分两种情形：
  //   a) 识别出了场景，但那个场景的名字根本不是用户写的字（祠堂 → 雨夜小巷）→ 换成用户的
  //   b) 什么都没识别出来 → 也不再让风格默认值编一个地点出来（桃树 → 仙山云海）
  (function preferUserPlace() {
    if (mode === 'prop') return;
    const det = result.scene && result.scene.detected;
    const t = String(text || '');
    if (det) {
      const core = sceneLibCore(det);
      // 用户就是说了库里这个名字（霓虹街道 / 集市 / 雪山之巅），保留
      if (core && t.indexOf(core) >= 0) return;
    }
    const place = extractUserPlace(originalText);
    if (!place) return;
    if (det && (place === sceneLibCore(det) || t.indexOf(place) < 0)) return;
    synthScene(place, originalText);
    result.scene = { detected: place, keywords: [place], _fromUserPlace: true, _replaced: det || null };
  })();

  // Detect prop dimensions (material, texture, display, background)
  // 最长关键词优先，避免"红宝石"被"宝石"、"蓝宝石"被"宝石"等子串误判（ISSUE-019）
  // 场景模式跳过道具维度，避免"面包香气"被误判为材质"烘焙食品"（ISSUE-010）
  if (mode !== 'scene') {
    const propDimDB = { material: KW_DB.material, texture: KW_DB.texture, display: KW_DB.display, background: KW_DB.background };
    for (const [dimKey, db] of Object.entries(propDimDB)) {
      if (!db) continue;
      let bestCat = null;
      let bestKw = '';
      for (const [cat, data] of Object.entries(db.categories)) {
        for (const kw of data.keywords) {
          // 同长度时后者（更具体的映射）胜出
          if (kw.length >= bestKw.length && text.includes(kw)) {
            bestKw = kw;
            bestCat = cat;
          }
        }
      }
      if (bestCat) {
        // 多材质检测：镶嵌/装饰/点缀 时，宝石类应为装饰而非主材质
        if (dimKey === 'material' && /镶嵌|装饰|点缀|包裹/.test(text)) {
          const gemCats = ['宝石', '红宝石', '蓝宝石', '钻石', '珍珠', '翡翠', '玉石', '玛瑙', '水晶', '琥珀', '猫眼石'];
          if (gemCats.includes(bestCat)) {
            result.decoration = { type: bestCat, keyword: bestKw };
            // 回退找金属材质
            const metalKeywords = ['银', '金', '铁', '钢', '铜', '铝', '钛', '合金', '黄金', '白银', '青铜', '黄铜', '不锈钢', '镀金', '镀铬'];
            for (const mk of metalKeywords) {
              if (text.includes(mk) && mk.length >= bestKw.length) {
                bestKw = mk; bestCat = '金属'; break;
              }
            }
            // 如果没找到金属关键词，回退到默认金属
            if (gemCats.includes(bestCat)) {
              bestCat = '金属';
              bestKw = '镶嵌物';
            }
          }
        }
        result[dimKey].detected = bestCat;
        result[dimKey].keywords.push(bestKw);
      }
    }
  }

  // ===== 地域 / 时代词 → 风格（2026-11-11）=====
  // 「一位欧洲皇后」原来给东方奇幻 + 仙山云海：角色认对了，画风整个错。
  // 地域/时代词是最强的画风信号之一，只在没有其它风格线索时才用（不抢用户明说的风格）。
  // 为什么放在这里：必须在 styleDefault 之前定下风格，场景/光线/色彩才会跟着走对。
  (function applyRegionStyle() {
    if (result.style && result.style.detected) return;
    const t = originalText;
    const MAP = [
      [/欧洲|英国|法国|德国|意大利|西班牙|葡萄牙|荷兰|罗马|希腊|拜占庭|中世纪|文艺复兴|维多利亚|巴洛克|欧式/, '巴洛克'],
      [/日本|和风|日式|浮世绘/, '浮世绘'],
      [/美国|美式|西部|牛仔/, '复古胶片'],
      [/民国|上世纪|复古/, '复古胶片'],
      [/中国|中华|唐朝|宋朝|元朝|明朝|清朝|汉代|唐代|宋代|明代|清代|古风|中式|东方|古代/, '东方奇幻'],
    ];
    for (let i = 0; i < MAP.length; i++) {
      if (MAP[i][0].test(t)) {
        result.style = { detected: MAP[i][1], keywords: ['地域'], _region: true };
        return;
      }
    }
  })();

  // ===== 地点 → 风格（2026-11-11，与上面的地域词互补）=====
  // 「站在雨夜的祠堂前」原来给哥特暗黑 + 阴森恐怖：地点对了，画风整错。
  // 地域词那句管「欧洲/日本」，这里管**具体场所**：
  // 中式祠堂配哥特暗黑，和欧洲皇后配仙山云海是同一个毛病，只是方向相反。
  // 同样只在没有其它风格线索时生效，不抢用户明说的风格。
  (function applyPlaceStyle() {
    if (result.style && result.style.detected) return;
    const place = (result.scene && result.scene._fromUserPlace && result.scene.detected) || '';
    if (!place) return;
    const MAP = [
      [/祠堂|寺庙|殿|龙椅|客栈|牌坊|书院|古巷|宫|阁|塔|亭|庭院|廊/, '东方奇幻'],
      [/竹林|山林|湖|溪|雪山|峰|峡谷|瀑布/, '水墨国风'],
      [/樱花|鸟居|日式/, '浮世绘'],
      [/教堂|神殿|圣殿|彩窗/, '巴洛克'],
      [/城堡|地牢|墓|废墟|荒/, '哥特暗黑'],
      [/咖啡|写字楼|办公|落地窗|地铁|便利|车间|厂房|码头|街|巷子/, '写实摄影'],
    ];
    for (let i = 0; i < MAP.length; i++) {
      if (MAP[i][0].test(place)) {
        result.style = { detected: MAP[i][1], keywords: ['地点'], _placeStyle: true };
        return;
      }
    }
  })();

  // ===== 弱匹配标记 + 人物后缀补性别（2026-11-11）=====
  // 「机械姬」被认成「机械师」：命中词本身没打错，但输入里的主体比命中词长，
  // 后面那个字是个人物后缀。这种时候不直接改结论（可能确实对），
  // 只标一个 _weak，让第 3 层推理有机会再判一次。
  (function markWeakSubject() {
    if (!result.character || !result.character.detected) return;
    const ck = (result.character.keywords || [])[0];
    if (!ck || ck.length > 2) return;
    const p = originalText.indexOf(ck);
    if (p < 0) return;
    const next = originalText.charAt(p + ck.length);
    if (next && PERSON_SUFFIX.indexOf(next) >= 0) {
      result.character._weak = true;
      // 把「命中词 + 后面的人物后缀」整个记下来：「机械」+「姬」→「机械姬」。
      // 这是用户自己写的名词，比库里最近的「机械师」可信。
      let tok = ck + next;
      const p2 = p + ck.length + 1;
      const n2 = originalText.charAt(p2);
      if (n2 && /[\u4e00-\u9fff]/.test(n2)) tok += n2;
      result.character._weakToken = tok;
      // 同一个词根带出来的场景（机械→蒸汽都市）也是弱匹配
      const sk = result.scene && (result.scene.keywords || [])[0];
      if (sk && sk === ck) result.scene._weak = true;
    }
  })();

  // 性别后缀兜底：「姬 / 娘 / 妹 / 媛」这类字符本身就是性别信号，
  // 原来完全没被用上，于是「机械姬」会输出「一位中性机械师」。
  (function genderBySuffix() {
    if (result.gender && result.gender.detected) return;
    if (/(姬|娘|妹|姐|媛|娥|姝|嫱|嫔|妃|婆|嫂|姑|婶|姨)/.test(originalText)) {
      result.gender = { detected: '女性', keywords: ['后缀'] };
    } else if (/(哥|爷|佬|仔|汉|弟|伯|叔|翁|叟|郎)/.test(originalText)) {
      result.gender = { detected: '男性', keywords: ['后缀'] };
    }
  })();

  // ===== 泛主体兜底（2026-11-11）=====
  // 单字关键词收紧后，「皮影艺人」不再被硬认成「忍者」，但也因此没了主体，
  // 输出只剩场景和风格，读起来是半句话。这里不发明职业：
  // 用户说了「艺人」就用「艺人」本身当主体，只给骨架不给细节。
  // 第 3 层推理认得出更具体的词条时，会被那个词条顶掉。
  (function synthGenericSubject() {
    // 弱匹配优先用「用户自己写的那个名词」（2026-11-11）
    // 「机械姬」命中「机械」+ 后缀「姬」，库里最近的是「机械师」——那是把职业认错了。
    // 用户写的是「机械姬」，那就用「机械姬」，不自作聪明改成机械师。
    // 这是同一个原则：**不知道就照抄用户的话，别猜。**
    const weakTok = result.character && result.character._weak && result.character._weakToken;
    if (weakTok && !(KW_DB.character && KW_DB.character.categories[weakTok])) {
      synthSubject(weakTok);
      result.character = { detected: weakTok, keywords: [weakTok], _synth: true };
      return;
    }
    if (result.character && result.character.detected) return;
    const m = originalText.match(PERSON_NOUN_RE);
    if (!m) return;
    const noun = m[0].replace(/^[的了着是在于和与把被这那一个位名只]/, '');
    if (noun.length < 2) return;
    if (KW_DB.character && KW_DB.character.categories[noun]) return;
    synthSubject(noun);
    result.character = { detected: noun, keywords: [noun], _synth: true };
  })();

  // ===== 年代约束：古旧主体不应被配上未来系风格 =====
  // 「古旧的机械怀表」里「机械」会命中风格「未来主义」，
  // 结果一枚老怀表被写成未来科技风。这里按年代信号做一次纠正。
  (function applyEraConstraint() {
    if (!result.style) return;
    const ERA_OLD = /古旧|老式|古董|复古|做旧|年代感|锈蚀|生锈|斑驳|怀旧|上世纪|旧式|老派/;
    const ERA_NEW = /未来|赛博|霓虹|机甲|全息|太空|星际|量子|虚拟/;
    const FUTURE_STYLES = ['未来主义', '赛博朋克', '科幻', '太空歌剧', '霓虹夜景',
      '赛博都市', '未来科幻', '赛博', '未来主义风格', '废土科幻'];
    if (!ERA_OLD.test(text)) return;
    if (ERA_NEW.test(text)) return;                       // 用户自己说了未来感，尊重
    // 有年代信号时：已经选了未来系风格要纠正；完全没有风格则补一个复古系
    if (result.style.detected && FUTURE_STYLES.indexOf(result.style.detected) < 0) return;
    // 有机械/齿轮/钟表类词 → 蒸汽朋克；否则 → 复古胶片
    const MECH = /机械|齿轮|钟表|怀表|发条|金属|铜|铁|蒸汽|管道/;
    const cats = (KW_DB.style && KW_DB.style.categories) || {};
    const prefer = MECH.test(text) ? ['蒸汽朋克', '复古胶片'] : ['复古胶片', '蒸汽朋克'];
    let pick = '';
    for (let i = 0; i < prefer.length; i++) {
      if (cats[prefer[i]]) { pick = prefer[i]; break; }
    }
    if (pick) {
      result.style.detected = pick;
      result.style.keywords = [pick];
    }

    // ---- 同一套信号扩展到氛围 ----
    // 「生锈的长剑」原来配「浪漫温馨」；「古旧怀表」配「活力四射」，都不合。
    const NEG_ATMO = ['浪漫温馨', '活力四射', '欢快喜庆', '喜悦欢腾', '兴奋激动',
      '青春朝气', '朝气蓬勃', '甜蜜幸福', '幸福美满', '生机盎然', '童趣天真',
      '天真烂漫', '乐观积极', '自由洒脱', '豪迈奔放', '狂热躁动', '温情脉脉'];
    const OLD_ATMO = ['孤独寂寥', '苍凉辽远', '悲壮苍凉', '静谧禅意', '颓废末世',
      '阴森诡谲', '史诗壮阔', '肃穆庄严'];
    if (result.atmosphere && result.atmosphere.detected &&
        NEG_ATMO.indexOf(result.atmosphere.detected) >= 0) {
      const acats = (KW_DB.atmosphere && KW_DB.atmosphere.categories) || {};
      let apick = '';
      for (let i = 0; i < OLD_ATMO.length; i++) {
        if (acats[OLD_ATMO[i]]) { apick = OLD_ATMO[i]; break; }
      }
      if (apick) {
        result.atmosphere.detected = apick;
        result.atmosphere.keywords = [apick];
      }
    }

    // ---- 色彩：高饱和鲜艳色不适合古旧/破败主体 ----
    const HIGH_SAT = ['霓虹粉紫', '赛博霓虹', '炽热红', '彩虹色', '品红', '洋红',
      '宝蓝', '翠绿', '桃红', '粉红', '粉彩梦幻', '黑白高对比', '荧光绿'];
    const OLD_COLOR = ['褪色复古', '莫兰迪色系', '复古70年代', '暖灰', '米灰',
      '卡其', '亚麻色', '烟灰', '暖金琥珀'];
    if (result.color && result.color.detected &&
        HIGH_SAT.indexOf(result.color.detected) >= 0) {
      const ccats = (KW_DB.color && KW_DB.color.categories) || {};
      let cpick = '';
      for (let i = 0; i < OLD_COLOR.length; i++) {
        if (ccats[OLD_COLOR[i]]) { cpick = OLD_COLOR[i]; break; }
      }
      if (cpick) {
        result.color.detected = cpick;
        result.color.keywords = [cpick];
      }
    }
  })();

  // ===== 第 2 层：语义检索兜底（只在空缺维度上生效）=====
  if (typeof window !== 'undefined' && window.__semanticFill) {
    const sf = window.__semanticFill;
    Object.keys(sf).forEach(function (d) {
      if (result[d] && !result[d].detected) {
        result[d].detected = sf[d];
        result[d].keywords = [sf[d], '语义'];
      }
    });
  }

  // ===== 方案 A：路径无关的检测质量统计 =====
  // 只统计"名字直匹"会漏掉概念/关键词路径，也会把「暗黑骑士 ⊃ 骑士」误判成多主体。
  // 这里把所有路径的命中词汇总，再按"长词优先"去掉被包含的短词。
  (function buildAudit() {
    const candsAB = [];   // { word, dim, target }
    const push = function (word, dim, target) {
      if (!word || word.length < 1) return;
      candsAB.push({ word: word, dim: dim, target: target || '' });
    };

    // 概念映射
    for (const w in CONCEPT_MAP) {
      if (text.indexOf(w) < 0) continue;
      for (const d in CONCEPT_MAP[w]) push(w, d, CONCEPT_MAP[w][d]);
    }
    // 上下文关键词
    for (const d in CONTEXT_MAP) {
      for (const m of (CONTEXT_MAP[d] || [])) {
        for (const k of (m.keys || [])) {
          if (text.indexOf(k) >= 0) push(k, d, m[d]);
        }
      }
    }
    // 名字直匹（NAME_DIMS 在另一个闭包里，这里用同一份清单）
    ['scene', 'character', 'style', 'lighting', 'composition', 'color', 'atmosphere', 'quality'].forEach(function (d) {
      const cats = (KW_DB[d] && KW_DB[d].categories) || {};
      for (const name in cats) if (text.indexOf(name) >= 0) push(name, d, name);
    });
    // 简单物品
    for (const w in SIMPLE_ITEM_MAP) {
      if (text.indexOf(w) < 0) continue;
      for (const d in SIMPLE_ITEM_MAP[w]) push(w, d, SIMPLE_ITEM_MAP[w][d]);
    }

    // 去掉被更长命中词包含的短词（避免「暗黑骑士」+「骑士」算两个）
    const kept = candsAB.filter(function (c) {
      return !candsAB.some(function (o) {
        return o.word !== c.word && o.word.length > c.word.length && o.word.indexOf(c.word) >= 0;
      });
    });

    // 去重（同一个词可能被多条规则命中）
    const uniqWords = [];
    const seenW = {};
    kept.forEach(function (c) {
      if (!seenW[c.word]) { seenW[c.word] = 1; uniqWords.push(c.word); }
    });

    // 多主体：同一维度里，目标值不同的命中词 ≥2
    // 多主体：必须按「词」去重，且互不包含，才算真的提到了两个东西
    // （「剑客」会被多条规则重复命中；「暗黑骑士」与「骑士」是同一个主体）
    const multi = {};
    const byDim = {};
    kept.forEach(function (c) {
      (byDim[c.dim] = byDim[c.dim] || []).push(c.word);
    });
    Object.keys(byDim).forEach(function (d) {
      const uniq = [];
      byDim[d].forEach(function (w) { if (uniq.indexOf(w) < 0) uniq.push(w); });
      const distinct = uniq.filter(function (w) {
        return !uniq.some(function (o) { return o !== w && o.indexOf(w) >= 0; });
      });
      if (distinct.length > 1) multi[d] = distinct.slice(0, 4);
    });

    // 用户描述的动作会被 extractUserPose 直接采用，也算"用上了"，
    // 否则会出现「坐在长椅上明明进了结果，却提示大部分未使用」这种误报。
    try {
      const poseTxt = (typeof extractUserPose === 'function') ? extractUserPose(text) : null;
      if (poseTxt) {
        poseTxt.split('，').forEach(function (x) {
          if (x && uniqWords.indexOf(x) < 0) uniqWords.push(x);
        });
      }
    } catch (e) {}

    const matchedLen = uniqWords.reduce(function (n, w) { return n + w.length; }, 0);
    result._audit = {
      inputLen: (text || '').length,
      matched: uniqWords,
      matchedLen: matchedLen,
      multi: multi,
      utilization: text ? Math.min(1, matchedLen / text.length) : 0,
      threshold: A_UTIL_THRESHOLD
    };
  })();

  return result;
}

function inferStyleFromDimensions(detection) {
  // 1. 人物反推（优先，与 CHARACTER_STYLE_COMPAT 一致）
  const detectedChar = detection.character && detection.character.detected;
  if (detectedChar && CHARACTER_STYLE_COMPAT[detectedChar]) {
    return CHARACTER_STYLE_COMPAT[detectedChar][0];
  }
  // 2. 场景反推（优先于光线，避免"星空木屋→浮世绘"类误判）
  const detectedScene = detection.scene && detection.scene.detected;
  if (detectedScene && SCENE_TO_DEFAULT_STYLE[detectedScene]) {
    return SCENE_TO_DEFAULT_STYLE[detectedScene];
  }
  // 3. 光线反推
  const detectedLighting = detection.lighting && detection.lighting.detected;
  if (detectedLighting) {
    const lightingToStyle = {
      '雾中光': ['东方奇幻', '水墨国风', '象征主义', '生物朋克', '凯尔特'],
      '霓虹彩光': ['赛博朋克', '故障艺术', '极繁主义', '赛博禅意', '霓虹夜景', '异星科幻', '蒸汽波', '海报艺术', '像素复古'],
      '暗调低调': ['哥特暗黑', '暗影深渊', '废土求生', '克苏鲁', '表现主义', '柴油朋克', '炭笔画'],
      '烛火光': ['蒸汽朋克', '火焰地狱', '漆器', '皮影'],
      '柔光漫射': ['极简留白', '水彩淡彩', '剪纸艺术', '新艺术运动', '神圣光辉', '敦煌壁画', '毛毡风', '黏土风', '文艺复兴', '拉斐尔前派', '手绘插画'],
      '自然日光': ['二次元', '写实摄影', '波普艺术', '像素艺术', '扁平矢量', '自然之力', '现实主义', '抽象表现主义', '野兽派', '点彩派', '太阳朋克', '铅笔画', '版画', '街头艺术', '蜡笔涂鸦', '素描速写', '波普漫画'],
      '戏剧对比': ['油画质感', '超现实主义', '巴洛克'],
      '电影级侧光': ['3D渲染', '装饰艺术', '幻想生物', '概念艺术', '魔法奇幻', '新古典主义'],
      '暖金黄昏': ['印象派', '低多边形', '复古胶片', '波斯细密画', '波西米亚', '后印象派', '唐三彩', '陶艺', '木雕', '糖画', '泥塑'],
      '冷蓝月光': ['浮世绘', '冰霜世界'],
      '黄金时刻': ['浪漫主义', '拜占庭', '埃及', '印度莫卧儿', '阿拉伯', '田园牧歌', '敦煌飞天', '景泰蓝', '玛雅文明', '印加黄金', '埃及壁画', '希腊陶瓶', '罗马马赛克', '珐琅', '石雕'],
      '硬光': ['雷电之力', '立体主义', '硬边绘画', '构成主义'],
      '逆光剪影': ['达达主义'],
      '伦勃朗光': ['古典写实'],
      '舞台光': ['苗族银饰', '装置艺术', '金属工艺']
    };
    const candidates = lightingToStyle[detectedLighting] || [];
    if (candidates.length > 0) return candidates[0];
  }
  return null;
}

// ===== LANGUAGE DETECTION =====
function detectLanguage(text) {
  if (!text || !text.trim()) return false;
  const cleaned = text.trim();
  // Check for Chinese characters (CJK Unified Ideographs)
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf]/;
  // Check for Japanese-specific characters (Hiragana, Katakana)
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  // If text has Japanese characters, treat as non-Chinese
  if (japaneseRegex.test(cleaned)) return false;
  // If Chinese characters found, treat as Chinese
  if (chineseRegex.test(cleaned)) return true;
  // Default: treat as English
  return false;
}

// 过滤 emoji / 特殊符号，避免检测误判（问题10）
function stripEmoji(text) {
  return text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}\u{2764}\u{1F004}\u{3297}\u{3299}\u{00A9}\u{00AE}\u{2122}\u{3030}\u{303D}]/gu, '').replace(/\s+/g, ' ').trim();
}
