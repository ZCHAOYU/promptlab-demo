/* app-fill.js —— 补全层：决定每一维填什么（风格默认值、场景协调、随机混搭）。
   核心是 smartFill（202 行）与 ensureStyleSceneCoherence（192 行）。
   从 app.js 拆出（2026-11-11），只搬函数、不动顶层 const/let。
   加载顺序见 index.html：detect → fill → assemble → ui → app.js。 */

function smartFill(detection, text) {
  // 风格默认值现在是「候选集」，要从可复现随机源里挑一个。
  // 随机源按「输入 + 轮次」播种，所以这里先播一次：
  // buildOptimizedPrompt 里会用同一个种子再播一次，序列相同，互不干扰。
  try { setConnSalt(text); } catch (e) {}
  const fills = {};

  // 动物主体检测：全文匹配动物关键词，用于后续场景/氛围/角色适配，避免级联出人物默认
  const ANIMAL_KEYWORDS = /猫|猫咪|小猫|喵|狗|小狗|狗狗|鸟|小鸟|鸟儿|兔|兔子|动物|宠物|小动物|萌宠|cat|kitten|feline|kitty|dog|puppy|canine|pup|bird|songbird|sparrow|finch|robin|rabbit|bunny|animal|pet|creature|beast/i;
  const isAnimalSubject = ANIMAL_KEYWORDS.test(text);

  // Style — 根据检测到的人物反推默认风格，避免"古风侠客配像素艺术"
  if (detection.style.detected) {
    fills.style = detection.style.detected;
  } else {
    // 无风格关键词时，基于已检测维度反推风格，避免强默认"概念艺术"引发级联误判
    fills.style = inferStyleFromDimensions(detection);
  }

  // Lighting - smart default based on style
  if (detection.lighting.detected) {
    fills.lighting = detection.lighting.detected;
  } else {
    fills.lighting = styleDefault('lighting', fills.style, '电影级侧光');
  }

  // Composition
  fills.composition = detection.composition.detected || '中景';

  // Quality
  fills.quality = detection.quality.detected || '4K高清';

  // Color - smart default based on style
  if (detection.color.detected) {
    fills.color = detection.color.detected;
  } else {
    fills.color = styleDefault('color', fills.style, '莫兰迪色系');
  }

  // Atmosphere - smart default based on style
  if (detection.atmosphere.detected) {
    fills.atmosphere = detection.atmosphere.detected;
  } else {
    fills.atmosphere = styleDefault('atmosphere', fills.style, '史诗壮阔');
  }

  // 动物主体氛围适配：无明确氛围时，用温暖治愈/静谧安详，避免"活力四射"等人物氛围
  if (isAnimalSubject && !(detection.atmosphere && detection.atmosphere.detected)) {
    fills.atmosphere = '温暖治愈';
  }

  // Platform
  fills.platform = detection.platform.detected || '通用';

  // Character - smart default based on style (skip in scene/prop mode)
  if (currentMode === 'scene' || currentMode === 'prop') {
    fills.character = null;
  } else if (detection.character && detection.character.detected) {
    fills.character = detection.character.detected;
  } else {
    const charByStyle = {
      '东方奇幻': '古风侠客', '水墨国风': '水墨人物', '赛博朋克': '赛博改造人',
      '哥特暗黑': '暗黑骑士', '蒸汽朋克': '蒸汽朋克角色', '极简留白': '水墨人物',
      '二次元': '二次元少女', '写实摄影': '写实人物', '油画质感': '写实人物',
      '3D渲染': '概念角色', '波普艺术': '概念角色', '印象派': '写实人物',
      '水彩淡彩': '写实人物', '像素艺术': '概念角色', '扁平矢量': '概念角色',
      '浮世绘': '水墨人物', '低多边形': '概念角色', '超现实主义': '概念角色',
      '故障艺术': '赛博改造人', '复古胶片': '写实人物', '剪纸艺术': '水墨人物',
      '新艺术运动': '写实人物', '装饰艺术': '写实人物', '巴洛克': '暗黑骑士',
      '极繁主义': '概念角色', '赛博禅意': '赛博改造人', '幻想生物': '概念角色',
      '霓虹夜景': '赛博改造人', '波普拼贴': '概念角色',
      '赛博水墨': '赛博改造人', '敦煌飞天': '水墨人物', '洛可可宫廷': '写实人物', '浮世绘武士': '水墨人物',
      '剪纸拼贴': '概念角色', '水彩晕染': '写实人物', '蜡笔涂鸦': '概念角色', '素描速写': '写实人物',
      '版画拓印': '概念角色', '玻璃彩绘': '概念角色', '马赛克镶嵌': '概念角色', '像素复古': '概念角色',
      '超现实梦境': '概念角色', '波普漫画': '概念角色', '国画工笔': '水墨人物', '白描': '水墨人物',
      '青花瓷': '水墨人物', '唐三彩': '写实人物', '漆器': '水墨人物', '景泰蓝': '水墨人物',
      '苗族银饰': '写实人物', '藏族唐卡': '水墨人物', '和服纹样': '写实人物', '伊斯兰几何': '概念角色',
      '非洲部落': '写实人物', '玛雅文明': '写实人物', '印加黄金': '写实人物', '埃及壁画': '写实人物',
      '希腊陶瓶': '写实人物', '罗马马赛克': '写实人物', '哥特彩窗': '概念角色', '巴洛克穹顶': '写实人物',
      '洛可可贝壳': '写实人物', '维多利亚蕾丝': '写实人物', '孟菲斯': '概念角色', '欧普艺术': '概念角色',
      '色域绘画': '概念角色', '硬边绘画': '概念角色', '照相写实': '写实人物', '古典写实': '写实人物',
      '后印象派': '写实人物', '构成主义': '概念角色', '至上主义': '概念角色', '风格派': '概念角色',
      '贫穷艺术': '概念角色', '观念艺术': '概念角色', '大地艺术': '概念角色', '装置艺术': '概念角色',
      '行为艺术': '写实人物', '新表现主义': '概念角色', '厚涂油画': '写实人物', '湿壁画': '写实人物',
      '蛋彩画': '写实人物', '蚀刻版画': '概念角色', '石版画': '概念角色', '丝网印刷': '概念角色',
      '蜡染': '水墨人物', '扎染': '水墨人物', '刺绣': '写实人物', '编织艺术': '概念角色',
      '陶艺': '概念角色', '珐琅': '概念角色', '木雕': '概念角色', '石雕': '概念角色',
      '金属工艺': '概念角色', '折纸': '概念角色', '纸雕': '概念角色', '拼布': '概念角色',
      '珠绣': '写实人物', '羽毛画': '概念角色', '沙画': '概念角色', '冰雕': '概念角色',
      '糖画': '概念角色', '泥塑': '概念角色', '皮影': '水墨人物', '年画': '水墨人物',
      '壁画': '写实人物', '岩画': '概念角色', '水拓画': '概念角色', '波斯地毯': '概念角色'
    };
    // 检测到场景但无人物时，用中性"概念角色"，避免非人物主体（如鲸鱼）被误判为风格强关联人物
    if (fills.style && detection.scene && detection.scene.detected) {
      fills.character = '概念角色';
    } else {
      fills.character = fills.style ? (charByStyle[fills.style] || '概念角色') : null;
    }
  }

  // 动物主体特殊处理：检测到动物却没有明确人物类型时，强制使用动物类别，避免级联出人物默认
  if (isAnimalSubject && (!detection.character || !detection.character.detected)) {
    fills.character = '动物';
    fills.gender = null;
  }

  // Gender - smart default based on character type (skip in scene/prop mode)
  if (currentMode === 'scene' || currentMode === 'prop') {
    fills.gender = null;
  } else if (detection.gender && detection.gender.detected) {
    fills.gender = detection.gender.detected;
  } else {
    fills.gender = GENDER_BY_CHAR[fills.character] || '中性';
  }

  // Scene - smart default based on style (prop 模式不默认补场景，避免"自然山水"级联误判 ISSUE-018)
  /* 2026-11-11：记下场景是「谁的」。
     离线实测：24 个常见地点里 15 个最终场景不是用户写的 —— 因为这里先用风格默认值
     把场景填满了，而抽取结果（applyParseFills）只补空维，正确的场景永远补不进来。
     有了这个标记，抽取就能只覆盖「风格编的」，不覆盖「用户说的」。 */
  if (currentMode === 'prop') {
    fills.scene = detection.scene && detection.scene.detected ? detection.scene.detected : null;
    fills._sceneSource = fills.scene ? 'user' : null;
  } else if (detection.scene && detection.scene.detected) {
    fills.scene = detection.scene.detected;
    fills._sceneSource = 'user';
  } else {
    // 无风格推断时不强制兜底场景，避免"老人/年轻人"等纯人物描述被塞入"自然山水"（ISSUE-021）
    fills.scene = styleDefault('scene', fills.style, null);
    fills._sceneSource = fills.scene ? 'style' : null;
  }

  // 场景细节的年代闸门：赛博朋克配「竹筐陶罐」这种要静音（见 sceneDetailMuted）
  try {
    const _sd = fills.scene ? (KW_DB.scene && KW_DB.scene.categories[fills.scene]) : null;
    const _dt = _sd && _sd.zh ? (_sd.zh.detail || _sd.zh.effect || _sd.zh.mode || '') : '';
    genState.muted = sceneDetailMuted(fills.style, _dt);
  } catch (e) { genState.muted = false; }

  // 人数：影响拼装时的量词（「一位」→「两位」）
  genState.count = detectSubjectCount(text);
  genState.stamped = true;   // 盖章：告诉 buildOptimizedPrompt「本次状态已就绪」

  // 动物主体场景适配：无明确场景时，用自然/温馨场景，避免"樱花庭院"等人物场景
  if (isAnimalSubject && !(detection.scene && detection.scene.detected)) {
    fills.scene = '自然山水';
    fills._sceneSource = 'style';
  }

  // ===== Prop-specific fills =====
  // ISSUE：display / background 原来无条件给默认值（"产品特写"/"暗调背景"），
  // 导致人物模式里也会出现「display: 产品特写」这种明显不搭的维度。
  // 现在只在道具模式补默认值；其它模式只保留用户明确提到的。
  const isPropMode = (currentMode === 'prop');
  fills.material = detection.material && detection.material.detected ? detection.material.detected : null;
  fills.texture = detection.texture && detection.texture.detected ? detection.texture.detected : null;
  fills.display = detection.display && detection.display.detected
    ? detection.display.detected
    : (isPropMode ? '产品特写' : null);
  fills.background = (detection.background && detection.background.detected)
    ? detection.background.detected
    : (isPropMode ? '暗调背景' : null);

  // ===== 维度上限 =====
  // ISSUE：12–13 维几乎必然互相冲突（"婚礼教堂 + 摔跤手 + 暗黑童话"）。
  // 每多填一维就多一组可能打架的默认值，而其中好几维用户根本没提。
  // 规则：用户明确检测到的维度优先保留，其余按核心度排序，超出的置空。
  // 注意 platform 不能清（buildOptimizedPrompt 直接取 formats[platform]）。
  //
  // 2026-11-11 修正：原来只按固定顺序排，人物模式里「金属 / 手持展示 / 城市背景」
  // 这些顺手命中的道具维会挤掉光照和色彩——真机审计里 2/12 条输入的色彩被裁成 null，
  // 而色彩恰恰是最能区分成品的维度。现在按「层级」排：
  //   道具模式：材质类最该留（那是主体）；
  //   其它模式：主体 → 风格 → 审美（光/色/氛围/构图）→ 道具，道具最先牺牲。
  const DIM_KEEP_ORDER = [
    'character', 'gender', 'scene', 'style', 'lighting', 'color', 'atmosphere',
    'composition', 'quality', 'material', 'texture', 'display', 'background'
  ];
  const MAX_DIMS = (currentMode === 'prop') ? 10 : 8;
  const DIM_TIER_PROP = {
    material: 0, texture: 0, display: 0, background: 0,
    lighting: 1, color: 1, atmosphere: 1, composition: 1, quality: 1,
    style: 2, character: 3, gender: 3, scene: 3
  };
  const DIM_TIER_SUBJECT = {
    character: 0, gender: 0, scene: 0,
    style: 1,
    lighting: 2, color: 2, atmosphere: 2, composition: 2, quality: 2,
    material: 3, texture: 3, display: 3, background: 3
  };
  const dimTier = (currentMode === 'prop') ? DIM_TIER_PROP : DIM_TIER_SUBJECT;
  const filledDims = DIM_KEEP_ORDER.filter(k => fills[k]);
  if (filledDims.length > MAX_DIMS) {
    const fromUser = new Set();
    Object.keys(detection || {}).forEach(k => {
      if (detection[k] && detection[k].detected) fromUser.add(k);
    });
    const sorted = filledDims.slice().sort((a, b) => {
      const ta = dimTier[a] === undefined ? 2 : dimTier[a];
      const tb = dimTier[b] === undefined ? 2 : dimTier[b];
      if (ta !== tb) return ta - tb;
      const ua = fromUser.has(a) ? 0 : 1;
      const ub = fromUser.has(b) ? 0 : 1;
      if (ua !== ub) return ua - ub;
      return DIM_KEEP_ORDER.indexOf(a) - DIM_KEEP_ORDER.indexOf(b);
    });
    sorted.slice(MAX_DIMS).forEach(k => { fills[k] = null; });
  }

  return fills;
}

// ===== STYLE → SCENE COHERENCE: 防止"哥特暗黑+古风宫殿"之类冲突 =====
function ensureStyleSceneCoherence(fills, detection) {
  if (!fills.style || !fills.scene) return fills;

  // 风格→场景兼容映射：每个风格允许的场景列表
  const STYLE_SCENE_COMPAT = {
    '哥特暗黑':      ['哥特城堡', '暗黑森林', '废墟末世', '废弃教堂', '墓地', '暗黑宫殿'],
    '东方奇幻':      ['仙山云海', '古风宫殿', '自然山水', '樱花庭院', '竹林深处', '月光庭院', '竹林小径', '樱花林', '古战场', '瀑布峡谷', '云端之上', '浮空岛', '龙之谷', '精灵森林'],
    '水墨国风':      ['自然山水', '仙山云海', '古风宫殿', '竹林深处'],
    '赛博朋克':      ['赛博都市', '霓虹街道', '霓虹夜景', '太空站', '蒸汽都市', '未来都市'],
    '蒸汽朋克':      ['蒸汽都市', '赛博都市', '图书馆', '实验室', '工厂', '车间', '火车站'],
    '极简留白':      ['自然山水', '纯色背景', '极简空间', '日式庭院'],
    '二次元':        ['樱花庭院', '教室', '街角咖啡馆', '赛博都市', '自然山水'],
    '写实摄影':      ['街角咖啡馆', '自然山水', '城市街道', '室内', '图书馆', '公园', '餐厅', '咖啡店', '花店', '面包店'],
    '油画质感':      ['暗黑森林', '古风宫殿', '哥特城堡', '自然山水'],
    '3D渲染':        ['太空站', '赛博都市', '废墟末世', '实验室'],
    '波普艺术':      ['波普画廊', '赛博都市', '街角咖啡馆'],
    '印象派':        ['自然山水', '樱花庭院', '街角咖啡馆', '森林深处', '瀑布峡谷', '草原旷野', '月光庭院', '市集广场', '码头港口', '灯塔海岸', '樱花林', '湖泊', '河流', '花园', '公园', '沙滩'],
    '水彩淡彩':      ['樱花庭院', '自然山水', '街角咖啡馆', '瀑布峡谷', '灯塔海岸', '樱花林', '竹林小径', '湖泊', '河流', '花园'],
    '像素艺术':      ['像素世界', '赛博都市', '街角咖啡馆'],
    '扁平矢量':      ['波普画廊', '赛博都市', '街角咖啡馆'],
    '浮世绘':        ['自然山水', '樱花庭院', '古风宫殿', '月光庭院', '樱花林', '竹林小径'],
    '低多边形':      ['像素世界', '自然山水', '赛博都市'],
    '超现实主义':    ['废墟末世', '超现实空间', '暗黑森林', '火山口', '海底遗迹', '废弃工厂', '熔岩洞窟', '水晶矿脉', '异星地表', '亡灵墓地'],
    '故障艺术':      ['赛博都市', '霓虹街道', '废墟末世', '未来都市'],
    '复古胶片':      ['街角咖啡馆', '城市街道', '自然山水', '樱花庭院', '酒馆', '码头港口', '灯塔海岸'],
    '剪纸艺术':      ['自然山水', '古风宫殿', '樱花庭院'],
    '新艺术运动':    ['古风宫殿', '自然山水', '哥特城堡', '月光庭院'],
    '装饰艺术':      ['赛博都市', '波普画廊', '哥特城堡', '未来都市'],
    '巴洛克':        ['哥特城堡', '古风宫殿', '暗黑森林', '竞技场', '皇家宫殿'],
    '极繁主义':      ['波普画廊', '古风宫殿', '赛博都市'],
    '赛博禅意':      ['赛博都市', '霓虹街道', '日式庭院'],
    '概念艺术':      ['废墟末世', '暗黑森林', '哥特城堡', '赛博都市', '仙山云海', '地下城', '古战场', '竞技场', '水晶矿脉', '精灵森林', '龙之谷', '异星地表'],
    '幻想生物':      ['暗黑森林', '哥特城堡', '仙山云海', '地下城', '水晶矿脉', '精灵森林', '龙之谷'],
    '霓虹夜景':      ['赛博都市', '霓虹街道', '未来都市'],
    '波普拼贴':      ['波普画廊', '赛博都市', '街角咖啡馆'],
    '敦煌壁画':      ['仙山云海', '古风宫殿', '敦煌洞窟'],
    '毛毡风':        ['自然山水', '街角咖啡馆', '室内'],
    '黏土风':        ['自然山水', '街角咖啡馆', '室内'],
    '黑色电影':      ['城市街道', '暗黑森林', '街角咖啡馆', '幽暗洞穴', '雨夜小巷', '酒馆', '亡灵墓地'],
    '魔法奇幻':      ['魔法阵', '暗黑森林', '哥特城堡', '古风宫殿', '仙山云海', '水晶洞穴', '浮空岛', '炼金实验室', '水晶矿脉', '精灵森林', '龙之谷'],
    '火焰地狱':      ['火焰地狱', '火山熔岩', '废墟末世', '暗影领域', '龙巢', '火山口', '熔岩洞窟'],
    '冰霜世界':      ['冰原极光', '雪山之巅', '水晶洞穴', '自然山水', '浮空岛', '极地冰原', '冰封王座', '冰原', '雪山'],
    '雷电之力':      ['天空之城', '雪山之巅', '赛博都市', '废墟末世', '暗影领域'],
    '暗影深渊':      ['暗影领域', '地下洞穴', '暗黑森林', '废墟末世', '哥特城堡', '幽暗洞穴', '地下城', '熔岩洞窟', '亡灵墓地'],
    '自然之力':      ['自然山水', '热带雨林', '竹林', '樱花庭院', '水晶洞穴', '浮空岛', '森林深处', '悬崖峭壁', '瀑布峡谷', '草原旷野', '湖泊', '河流', '海洋', '海岛', '沙滩', '瀑布', '峡谷', '雪山', '雨林', '沼泽'],
    '神圣光辉':      ['圣殿', '天空之城', '浮空岛', '古风宫殿', '自然山水', '云端之上', '浮空遗迹'],
    '废土求生':      ['废墟末世', '沙漠古城', '火山熔岩', '地下洞穴', '暗影领域', '火山口', '废弃工厂', '墓地', '工厂', '仓库'],
    '异星科幻':      ['太空站', '异星世界', '水晶洞穴', '沙漠古城', '天空之城', '海底遗迹', '水晶矿脉', '星际飞船', '异星地表', '未来都市', '空间站', '月球基地', '火星基地', '外星城市'],
    '克苏鲁':        ['暗影领域', '地下洞穴', '海底世界', '暗黑森林', '废墟末世', '沼泽湿地', '幽暗洞穴', '海底遗迹', '迷雾沼泽', '墓地', '沼泽', '洞穴'],
    '文艺复兴':      ['古风宫殿', '圣殿', '图书馆', '哥特城堡', '自然山水', '云端之上', '皇家宫殿', '浮空遗迹'],
    '洛可可':        ['古风宫殿', '樱花庭院', '圣殿', '哥特城堡', '月光庭院', '皇家宫殿', '樱花林'],
    '新古典主义':    ['圣殿', '古风宫殿', '古代遗迹', '自然山水', '皇家宫殿'],
    '浪漫主义':      ['自然山水', '雪山之巅', '废墟末世', '仙山云海', '星空', '森林深处', '悬崖峭壁', '瀑布峡谷', '沙漠绿洲', '云端之上', '月光庭院', '古战场', '灯塔海岸', '冰封王座', '精灵森林'],
    '现实主义':      ['街角咖啡馆', '自然山水', '图书馆', '古代遗迹', '悬崖峭壁', '草原旷野', '极地冰原', '古战场', '竞技场', '市集广场', '酒馆', '码头港口', '灯塔海岸', '冰封王座', '农场', '牧场', '葡萄园', '果园', '市场', '集市', '广场', '公园'],
    '表现主义':      ['暗黑森林', '废墟末世', '哥特城堡', '地下洞穴', '幽暗洞穴', '火山口', '雨夜小巷', '废弃工厂', '地下城', '熔岩洞窟', '亡灵墓地', '迷雾沼泽'],
    '立体主义':      ['赛博都市', '波普画廊', '废墟末世', '街角咖啡馆'],
    '未来主义':      ['赛博都市', '太空站', '天空之城', '蒸汽都市', '浮空遗迹', '星际飞船', '未来都市'],
    '达达主义':      ['波普画廊', '街角咖啡馆', '废墟末世', '赛博都市'],
    '抽象表现主义':  ['波普画廊', '自然山水', '星空', '赛博都市'],
    '野兽派':        ['热带雨林', '自然山水', '樱花庭院', '波普画廊', '森林深处'],
    '点彩派':        ['自然山水', '樱花庭院', '街角咖啡馆', '热带雨林', '森林深处', '草原旷野'],
    '拉斐尔前派':    ['暗黑森林', '古风宫殿', '樱花庭院', '自然山水', '樱花林', '精灵森林'],
    '象征主义':      ['暗影领域', '星空', '沼泽湿地', '暗黑森林', '海底遗迹', '迷雾沼泽', '亡灵墓地'],
    '拜占庭':        ['圣殿', '古风宫殿', '天空之城', '古代遗迹', '云端之上', '皇家宫殿', '浮空遗迹'],
    '埃及':          ['沙漠古城', '古代遗迹', '圣殿', '地下洞穴', '沙漠绿洲'],
    '希腊古典':      ['圣殿', '古代遗迹', '仙山云海', '自然山水', '古战场', '竞技场'],
    '北欧神话':      ['雪山之巅', '冰原极光', '暗黑森林', '龙巢', '星空', '悬崖峭壁', '极地冰原', '古战场', '冰封王座', '龙之谷'],
    '凯尔特':        ['暗黑森林', '沼泽湿地', '古代遗迹', '竹林', '迷雾沼泽'],
    '波斯细密画':    ['沙漠古城', '古风宫殿', '仙山云海', '樱花庭院', '沙漠绿洲'],
    '印度莫卧儿':    ['古风宫殿', '樱花庭院', '沙漠古城', '圣殿', '皇家宫殿'],
    '阿拉伯':        ['沙漠古城', '古风宫殿', '圣殿', '天空之城', '沙漠绿洲'],
    '蒸汽波':        ['赛博都市', '像素世界', '太空站', '波普画廊', '星际飞船', '未来都市'],
    '赛博西部':      ['沙漠古城', '赛博都市', '废墟末世', '火山熔岩', '异星地表'],
    '柴油朋克':      ['蒸汽都市', '废墟末世', '赛博都市', '天空之城'],
    '生物朋克':      ['暗黑森林', '沼泽湿地', '地下洞穴', '热带雨林', '迷雾沼泽'],
    '太阳朋克':      ['自然山水', '天空之城', '樱花庭院', '竹林', '浮空岛', '竹林小径'],
    '太空歌剧':      ['太空站', '星空', '浮空岛', '天空之城', '浮空遗迹', '星际飞船', '空间站', '银河', '星云', '黑洞', '陨石带', '月球基地', '火星基地'],
    '田园牧歌':      ['自然山水', '樱花庭院', '竹林', '热带雨林', '森林深处', '草原旷野', '竹林小径', '农场', '牧场', '葡萄园', '果园', '花园'],
    '都市写实':      ['赛博都市', '街角咖啡馆', '蒸汽都市', '废墟末世', '雨夜小巷', '废弃工厂', '市集广场', '码头港口', '未来都市', '城市街道', '地铁站', '公交站', '便利店', '超市', '商场', '火车站'],
    '铅笔画':        ['街角咖啡馆', '自然山水', '图书馆', '古代遗迹'],
    '炭笔画':        ['暗黑森林', '废墟末世', '哥特城堡', '地下洞穴', '幽暗洞穴', '废弃工厂'],
    '版画':          ['自然山水', '古风宫殿', '古代遗迹', '街角咖啡馆'],
    '海报艺术':      ['波普画廊', '赛博都市', '街角咖啡馆', '太空站'],
    '涂鸦艺术':      ['赛博都市', '废墟末世', '街角咖啡馆', '地下洞穴', '雨夜小巷'],
    '街头艺术':      ['赛博都市', '街角咖啡馆', '废墟末世', '波普画廊', '雨夜小巷'],
    '波西米亚':      ['街角咖啡馆', '自然山水', '樱花庭院', '竹林', '市集广场', '酒馆'],
    '复古未来主义':  ['太空站', '赛博都市', '天空之城', '蒸汽都市', '星际飞船'],
    '极简几何':      ['波普画廊', '自然山水', '赛博都市', '像素世界', '未来都市'],
    '手绘插画':      ['自然山水', '樱花庭院', '街角咖啡馆', '像素世界', '仙山云海', '市集广场', '酒馆', '码头港口', '樱花林', '竹林小径'],
    '赛博水墨':      ['赛博都市', '霓虹街道', '未来都市', '日式庭院'],
    '敦煌飞天':      ['仙山云海', '古风宫殿', '沙漠古城', '云端之上'],
    '洛可可宫廷':    ['皇家宫殿', '古风宫殿', '樱花庭院', '歌剧院'],
    '浮世绘武士':    ['古风宫殿', '樱花庭院', '月光庭院', '樱花林'],
    '剪纸拼贴':      ['自然山水', '古风宫殿', '樱花庭院', '街角咖啡馆'],
    '水彩晕染':      ['樱花庭院', '自然山水', '街角咖啡馆', '樱花林', '竹林小径'],
    '蜡笔涂鸦':      ['教室', '街角咖啡馆', '游乐场', '公园'],
    '素描速写':      ['街角咖啡馆', '图书馆', '自然山水', '古代遗迹'],
    '版画拓印':      ['自然山水', '古代遗迹', '古风宫殿', '市集广场'],
    '玻璃彩绘':      ['圣殿', '废弃教堂', '哥特城堡', '博物馆'],
    '马赛克镶嵌':    ['圣殿', '古代遗迹', '皇家宫殿', '博物馆'],
    '像素复古':      ['像素世界', '赛博都市', '街角咖啡馆', '未来都市'],
    '超现实梦境':    ['超现实空间', '废墟末世', '星空', '异星地表'],
    '波普漫画':      ['波普画廊', '赛博都市', '街角咖啡馆', '市集广场'],
    '国画工笔':      ['古风宫殿', '自然山水', '樱花庭院', '竹林'],
    '白描':          ['自然山水', '古风宫殿', '竹林', '樱花庭院'],
    '青花瓷':        ['古风宫殿', '自然山水', '竹林', '樱花庭院'],
    '唐三彩':        ['沙漠古城', '古代遗迹', '市集广场', '古风宫殿'],
    '漆器':          ['古风宫殿', '皇家宫殿', '月光庭院', '日式庭院'],
    '景泰蓝':        ['古风宫殿', '皇家宫殿', '圣殿', '博物馆'],
    '苗族银饰':      ['市集广场', '古风宫殿', '竹林', '自然山水'],
    '藏族唐卡':      ['圣殿', '雪山之巅', '古风宫殿', '云端之上'],
    '和服纹样':      ['樱花庭院', '日式庭院', '月光庭院', '樱花林'],
    '伊斯兰几何':    ['沙漠古城', '圣殿', '沙漠绿洲', '市集广场'],
    '非洲部落':      ['沙漠古城', '热带雨林', '草原旷野', '沙漠绿洲'],
    '玛雅文明':      ['古代遗迹', '热带雨林', '沙漠古城', '地下洞穴'],
    '印加黄金':      ['古代遗迹', '雪山之巅', '沙漠古城', '地下城'],
    '埃及壁画':      ['沙漠古城', '古代遗迹', '沙漠绿洲', '圣殿'],
    '希腊陶瓶':      ['圣殿', '古代遗迹', '市集广场', '竞技场'],
    '罗马马赛克':    ['圣殿', '古代遗迹', '皇家宫殿', '竞技场'],
    '哥特彩窗':      ['圣殿', '废弃教堂', '哥特城堡', '博物馆'],
    '巴洛克穹顶':    ['圣殿', '皇家宫殿', '歌剧院', '博物馆'],
    '洛可可贝壳':    ['皇家宫殿', '古风宫殿', '歌剧院', '花园'],
    '维多利亚蕾丝':  ['皇家宫殿', '街角咖啡馆', '图书馆', '花园'],
    '孟菲斯':        ['波普画廊', '美术馆', '未来都市', '商场'],
    '欧普艺术':      ['波普画廊', '美术馆', '未来都市', '地铁站'],
    '色域绘画':      ['美术馆', '极简空间', '博物馆', '波普画廊'],
    '硬边绘画':      ['美术馆', '极简空间', '波普画廊', '博物馆'],
    '照相写实':      ['街角咖啡馆', '城市街道', '自然山水', '室内'],
    '古典写实':      ['圣殿', '皇家宫殿', '古代遗迹', '图书馆'],
    '后印象派':      ['自然山水', '樱花庭院', '街角咖啡馆', '森林深处'],
    '构成主义':      ['波普画廊', '未来都市', '工厂', '美术馆'],
    '至上主义':      ['美术馆', '极简空间', '博物馆', '波普画廊'],
    '风格派':        ['美术馆', '极简空间', '波普画廊', '博物馆'],
    '贫穷艺术':      ['废弃工厂', '美术馆', '地下城', '博物馆'],
    '观念艺术':      ['美术馆', '博物馆', '极简空间', '波普画廊'],
    '大地艺术':      ['自然山水', '草原旷野', '沙漠古城', '雪山之巅'],
    '装置艺术':      ['美术馆', '博物馆', '废弃工厂', '波普画廊'],
    '行为艺术':      ['市集广场', '广场', '剧院', '街角咖啡馆'],
    '新表现主义':    ['波普画廊', '美术馆', '废墟末世', '城市街道'],
    '厚涂油画':      ['古风宫殿', '自然山水', '暗黑森林', '街角咖啡馆'],
    '湿壁画':        ['圣殿', '古风宫殿', '古代遗迹', '博物馆'],
    '蛋彩画':        ['圣殿', '古风宫殿', '图书馆', '博物馆'],
    '蚀刻版画':      ['图书馆', '古代遗迹', '博物馆', '街角咖啡馆'],
    '石版画':        ['图书馆', '博物馆', '街角咖啡馆', '古代遗迹'],
    '丝网印刷':      ['波普画廊', '美术馆', '市集广场', '博物馆'],
    '蜡染':          ['市集广场', '古风宫殿', '竹林', '自然山水'],
    '扎染':          ['市集广场', '古风宫殿', '竹林', '自然山水'],
    '刺绣':          ['古风宫殿', '皇家宫殿', '市集广场', '樱花庭院'],
    '编织艺术':      ['市集广场', '室内', '古风宫殿', '街角咖啡馆'],
    '陶艺':          ['市集广场', '古风宫殿', '室内', '博物馆'],
    '珐琅':          ['古风宫殿', '皇家宫殿', '博物馆', '圣殿'],
    '木雕':          ['古风宫殿', '古代遗迹', '市集广场', '森林深处'],
    '石雕':          ['古代遗迹', '圣殿', '市集广场', '博物馆'],
    '金属工艺':      ['古代遗迹', '工厂', '车间', '博物馆'],
    '折纸':          ['极简空间', '教室', '室内', '日式庭院'],
    '纸雕':          ['美术馆', '博物馆', '极简空间', '图书馆'],
    '拼布':          ['室内', '市集广场', '街角咖啡馆', '农场'],
    '珠绣':          ['古风宫殿', '皇家宫殿', '市集广场', '樱花庭院'],
    '羽毛画':        ['自然山水', '森林深处', '博物馆', '花园'],
    '沙画':          ['沙漠古城', '沙漠绿洲', '沙滩', '市集广场'],
    '冰雕':          ['冰原极光', '雪山之巅', '极地冰原', '冰封王座'],
    '糖画':          ['市集广场', '游乐场', '街角咖啡馆', '集市'],
    '泥塑':          ['市集广场', '古代遗迹', '博物馆', '室内'],
    '皮影':          ['古风宫殿', '剧院', '市集广场', '月光庭院'],
    '年画':          ['市集广场', '古风宫殿', '街角咖啡馆', '集市'],
    '壁画':          ['古风宫殿', '圣殿', '古代遗迹', '城市街道'],
    '岩画':          ['古代遗迹', '地下洞穴', '峡谷', '沙漠古城'],
    '水拓画':        ['市集广场', '博物馆', '美术馆', '室内'],
    '波斯地毯':      ['皇家宫殿', '古风宫殿', '图书馆', '博物馆']
  };

  const allowedScenes = STYLE_SCENE_COMPAT[fills.style];
  if (!allowedScenes) return fills; // 未知风格，跳过

  if (!allowedScenes.includes(fills.scene)) {
    // 用户明确指定了场景时，尊重用户选择，不覆盖（如"海边""星空"）
    if (detection && detection.scene && detection.scene.detected) {
      return fills;
    }
    // 场景为自动填充且不兼容，用默认场景替换，并记录供 UI 提示
    try {
      coherenceWarnings.push({
        label: '场景协调',
        words: [`${fills.style}`, `${fills.scene}`, `${allowedScenes[0]}`],
        applied: true
      });
    } catch (e) { /* ignore */ }
    fills.scene = allowedScenes[0];
  }

  return fills;
}

function ensureCoherence(fills, detection) {
  // If no character or style, nothing to check
  if (!fills.character || !fills.style) return fills;

  // 人物为库内回退值"概念角色"且用户未明确指定时，不强制改风格：
  // 避免"概念角色"回退值把风格级联成"概念艺术"、场景级联成"废墟末世"
  if (fills.character === '概念角色' && !(detection && detection.character && detection.character.detected)) {
    return fills;
  }

  const compatStyles = CHARACTER_STYLE_COMPAT[fills.character];
  if (!compatStyles) return fills; // unknown character, skip

  // If current style is NOT compatible with character, override
  if (!compatStyles.includes(fills.style)) {
    // 用户明确指定了风格时，尊重用户选择，仅提示不覆盖（如"古风侠客+像素艺术"）
    if (detection && detection.style && detection.style.detected) {
      try {
        coherenceWarnings.push({
          label: '风格协调',
          words: [`${fills.character}`, `${fills.style}`, `${compatStyles[0]}`],
          applied: false
        });
      } catch (e) { /* ignore */ }
      return fills;
    }
    const newStyle = compatStyles[0];

    // 记录修正，供 UI 提示（不再完全静默）
    try {
      coherenceWarnings.push({
        label: '风格协调',
        words: [`${fills.character}`, `${fills.style}`, `${newStyle}`],
        applied: true
      });
    } catch (e) { /* ignore */ }

    // Cascade: update all dimension defaults that were derived from the old style

    fills.style = newStyle;
    var _l = styleDefault('lighting', newStyle, null);
    if (_l) fills.lighting = _l;
    var _c = styleDefault('color', newStyle, null);
    if (_c) fills.color = _c;
    var _a = styleDefault('atmosphere', newStyle, null);
    if (_a) fills.atmosphere = _a;
    var _s = styleDefault('scene', newStyle, null);
    if (_s) { fills.scene = _s; fills._sceneSource = 'style'; }
  }

  return fills;
}

function sanitizeFills(fills, mode) {
  if (!fills || typeof fills !== 'object') return fills;

  const isProp = (mode === 'prop');

  // 1) 道具专属维度：非道具模式一律清掉（否则人物提示词里会出现「display: 产品特写」）
  if (!isProp) {
    if (fills.display && !(fills.display.fromUser)) fills.display = null;
    if (fills.background && !(fills.background.fromUser)) fills.background = null;
  }
  // 说明：这里无法判断用户是否明确提到 display/background，
  // 因此改为「只有道具模式才允许」——人物/场景模式下这两维一律不输出。

  // 2) 维度上限：12–13 维几乎必然互相冲突
  // 道具模式下「材质/质感/展示/背景」才是核心，不能被上限挤掉
  const ORDER = isProp
    ? ['material', 'texture', 'display', 'background', 'lighting', 'composition',
       'color', 'atmosphere', 'quality', 'style', 'character', 'gender', 'scene']
    : ['character', 'gender', 'scene', 'style', 'lighting', 'color', 'atmosphere',
       'composition', 'quality', 'material', 'texture', 'display', 'background'];
  const MAX = isProp ? 10 : 8;
  const filled = ORDER.filter(k => fills[k]);
  if (filled.length > MAX) {
    // 保留顺序：先核心维度，后可选修饰
    filled.slice(MAX).forEach(k => { fills[k] = null; });
  }
  return fills;
}

// ============================================================
// RANDOM MIX — 风格导向随机混搭：70%兼容 + 30%惊喜
// ============================================================
function weightedPick(affinityList, allKeys) {
  // 70% chance: pick from compatible set
  // 30% chance: pick from all keys (creative surprise)
  if (Math.random() < 0.7 && affinityList && affinityList.length > 0) {
    return affinityList[Math.floor(Math.random() * affinityList.length)];
  }
  return allKeys[Math.floor(Math.random() * allKeys.length)];
}

function randomMix() {
  bumpVariantRound();
  // ===== 模式判定（修复 ISSUE-01：isProp/isScene 未定义导致 ReferenceError）=====
  const isScene = currentMode === 'scene';
  const isProp = currentMode === 'prop';

  // ===== 保留用户已输入的主体，避免随机混搭破坏意图 =====
  const hasInput = !!input.value.trim();
  const inputDetection = hasInput ? detectDimensions(input.value.trim(), currentMode) : null;
  const keepCharacter = inputDetection && inputDetection.character && inputDetection.character.detected
    ? inputDetection.character.detected : null;
  const keepScene = inputDetection && inputDetection.scene && inputDetection.scene.detected
    ? inputDetection.scene.detected : null;

  // 风格池：有用户主体时，只在与该主体兼容的风格中随机
  let stylePool = Object.keys(KW_DB.style.categories);
  if (keepCharacter && CHARACTER_STYLE_COMPAT[keepCharacter]) {
    stylePool = CHARACTER_STYLE_COMPAT[keepCharacter];
    if (keepScene && typeof STYLE_SCENE_COMPAT !== 'undefined') {
      const sceneStyles = [];
      for (const [style, scenes] of Object.entries(STYLE_SCENE_COMPAT)) {
        if (scenes.includes(keepScene)) sceneStyles.push(style);
      }
      const intersection = stylePool.filter(s => sceneStyles.includes(s));
      if (intersection.length > 0) stylePool = intersection;
    }
  } else if (keepScene && typeof STYLE_SCENE_COMPAT !== 'undefined') {
    const sceneStyles = [];
    for (const [style, scenes] of Object.entries(STYLE_SCENE_COMPAT)) {
      if (scenes.includes(keepScene)) sceneStyles.push(style);
    }
    if (sceneStyles.length > 0) stylePool = sceneStyles;
  }

  // Step 1: Pick a random style from the pool
  const pickedStyle = stylePool[Math.floor(Math.random() * stylePool.length)];
  const affinity = STYLE_AFFINITY[pickedStyle] || {};

  // Step 2: Pick other dimensions using affinity-weighted random
  const picks = { style: pickedStyle };

  // Character: 保留用户主体，否则 70% 兼容随机
  // 但如果用户写了东西、却既没识别出角色也没识别出场景（例："一位目光深邃的老者"，
  // 词典里没有「老者」），**不能随机换一个主体** —— 那会让「老者」变成「木乃伊」「相扑手」。
  // 这种情况角色留空，让 buildOptimizedPrompt 保留用户原句作为主体。
  const charKeys = Object.keys(KW_DB.character.categories);
  const keepNeutral = hasInput && !keepCharacter && !keepScene;
  picks.character = keepCharacter || (keepNeutral ? null : weightedPick(affinity.character, charKeys));

  // Scene: 保留用户场景，否则 70% 兼容随机
  const sceneKeys = Object.keys(KW_DB.scene.categories);
  picks.scene = keepScene || weightedPick(affinity.scene, sceneKeys);

  // Lighting: 70% compatible, 30% random
  const lightKeys = Object.keys(KW_DB.lighting.categories);
  picks.lighting = weightedPick(affinity.lighting, lightKeys);

  // Composition: always random (universal)
  const compKeys = Object.keys(KW_DB.composition.categories);
  picks.composition = compKeys[Math.floor(Math.random() * compKeys.length)];

  // Color: 70% compatible, 30% random
  const colorKeys = Object.keys(KW_DB.color.categories);
  picks.color = weightedPick(affinity.color, colorKeys);

  // Atmosphere: 70% compatible, 30% random
  const atmoKeys = Object.keys(KW_DB.atmosphere.categories);
  picks.atmosphere = weightedPick(affinity.atmosphere, atmoKeys);

  // Quality: always random
  const qualKeys = Object.keys(KW_DB.quality.categories);
  picks.quality = qualKeys[Math.floor(Math.random() * qualKeys.length)];

  // Platform: always random
  const platKeys = Object.keys(KW_DB.platform.formats);
  picks.platform = platKeys[Math.floor(Math.random() * platKeys.length)];

  // Gender: 先按角色推导（否则会抽出「男性 + 公主」这种矛盾），
  // 角色没有对应记录时才回落到风格亲和随机。
  const genderKeys = Object.keys(KW_DB.gender.categories);
  picks.gender = keepNeutral ? null : (GENDER_BY_CHAR[picks.character] || weightedPick(affinity.gender, genderKeys));

  // ===== COHERENCE CHECK: 确保人物和风格兼容，防止"古风侠客+像素艺术" =====
  ensureCoherence(picks);

  // Step 3: Update all dimTags
  for (const [dim, value] of Object.entries(picks)) {
    const tag = document.querySelector(`.dim-tag[data-dim="${dim}"]`);
    if (tag) {
      tag.querySelector('.dim-value').textContent = value;
      tag.classList.add('detected');
      tag.classList.remove('missing');
    }
  }

  // If input is empty, fill in a placeholder based on mode
  if (!input.value.trim()) {
    let placeholders;
    if (isProp) {
      placeholders = [
        '一把散发着微光的魔法剑悬浮于空中',
        '一个精致的紫檀木宝箱静置于案几',
        '一盏纸灯笼在夜色中摇曳',
        '一本古老的魔法书摊开在桌面',
        '一颗铭刻着符文的水晶球缓缓旋转',
        '一朵发光的奇异蘑菇生长在古木上',
        '一把历经岁月洗礼的古琴',
        '一张精雕细琢的银色面具',
        '一枚镶嵌红宝石的黄金戒指',
        '一艘流线型的星际飞船悬浮在机库中'
      ];
    } else if (isScene) {
      placeholders = [
        '一片宁静的竹林在晨雾中',
        '一座悬浮在云端的天空之城',
        '一条霓虹闪烁的赛博街区',
        '一片被月光笼罩的暗黑森林',
        '一座荒废的哥特式古堡',
        '一间洒满阳光的街角咖啡馆',
        '一片绚丽的极光下的冰原',
        '一座蒸汽弥漫的维多利亚都市',
        '一片樱花飘落的日式庭院',
        '一座浮在星海中的太空站'
      ];
    } else {
      placeholders = [
        '一个神秘的角色站在画面中央',
        '一位身披斗篷的旅人',
        '一位优雅的精灵女王',
        '一位手持法杖的魔法师',
        '一位身披铠甲的武士',
        '一位戴着面具的刺客',
        '一位漂浮在空中的仙子',
        '一位目光深邃的老者',
        '一位眼神坚定的少女',
        '一位霸气侧漏的将军'
      ];
    }
    // 关键修正：原来这里随便挑一句占位文字，然后下面的 optimize() 去解析那句文字，
    // 于是出现「标题是刺客、内容是教授」—— 抽到的维度和输入框文字完全无关。
    // 现在让输入框文字由本次抽到的维度生成，保证两者一致。
    if (picks.character) {
      const gTxt = picks.gender === '男性' ? '男' : (picks.gender === '女性' ? '女' : '');
      input.value = '一' + (isProp ? '件' : measureWordOf(picks.character)) + gTxt + picks.character +
        (picks.scene ? '，' + picks.scene : '');
    } else {
      input.value = placeholders[Math.floor(Math.random() * placeholders.length)];
    }
    charCount.textContent = input.value.length;
    // 记住"这段文字是随机生成的"，供标签区分来源（用户一改就自动失效）
    window.__randomText = String(input.value || '').trim();
  }


  // Auto optimize
  optimize();
}
