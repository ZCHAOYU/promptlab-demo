/* 档案内容修正 —— 手工维护，针对人工审阅指出的问题
   加载位置：archive-detail.js 之后。

   修正原则：
   1. 语义不当 → 直接改写
   2. 「服饰」字段只保留**穿在身上/佩戴**的东西；
      「拿在手里 / 放在包里 / 抽象属性」一律剔除
      （笔记本、相机、图纸、放大镜、潜水电脑、空中敏捷…都是这一类）
*/
(function () {
  if (typeof KW_DB === 'undefined') return;

  function getZh(kind, name) {
    var c = KW_DB[kind] && KW_DB[kind].categories && KW_DB[kind].categories[name];
    if (!c) return null;
    c.zh = c.zh || {};
    return c.zh;
  }
  var n = 0;

  /* ---------- 1. 语义不当 ---------- */
  var zh = getZh('character', '私家侦探');
  if (zh) {
    zh.core = '敏锐的私家侦探，秘密的破解者';
    zh.mood = '冷静观察，敏锐分析，执着坚韧，足智多谋';
    n++;
  }

  zh = getZh('scene', '巨人国度');
  if (zh) {
    zh.core = '巨人国度';
    zh.detail = '巨人的国度，尺度悬殊的家具与器物，巨大的脚印，云层与巨人齐平，神话般的气氛';
    n++;
  }

  // 炼金术士：服饰里不该有护目镜（面部已有眼镜，且不合穿着逻辑）
  zh = getZh('character', '炼金术士');
  if (zh && zh.detail && zh.detail.indexOf('护目镜') >= 0) {
    zh.detail = zh.detail.split('，').filter(function (x) { return x.indexOf('护目镜') < 0; }).join('，');
    n++;
  }

  // 柬埔寨吴哥：「仙女形象」不是风格词，改为浮雕元素
  var zs = getZh('style', '柬埔寨吴哥');
  if (zs && zs.detail && zs.detail.indexOf('仙女形象') >= 0) {
    zs.detail = zs.detail.replace('仙女形象', '阿普萨拉仙女浮雕');
    n++;
  }

  // 歌剧院：原描述写的是外立面，与「歌剧院」预期不符，改为内景
  var zc = getZh('scene', '歌剧院');
  if (zc) {
    zc.detail = '穹顶垂下巨型水晶吊灯，暗红丝绒包厢层层环绕，舞台幕布半启，' +
                '金色雕花栏杆映着暖光，深色地毯吸走脚步声，空气里有松香与旧木的气味';
    n++;
  }

  // 植物学家：「皮肤晒黑」有地域/种族局限性
  zh = getZh('character', '植物学家');
  if (zh && zh.face && zh.face.indexOf('皮肤晒黑') >= 0) {
    zh.face = zh.face.split('，').filter(function (x) {
      return x.indexOf('皮肤晒黑') < 0 && x.indexOf('晒黑') < 0;
    }).join('，');
    n++;
  }

  /* ---------- 2. 服饰字段清理 ---------- */
  // 明确「能穿在身上/佩戴」的词 —— 命中就保留
  var KEEP_HARD = ['腰带', '护腕', '护目镜', '面罩', '面具', '披风', '斗篷', '盔甲', '铠甲',
    '头盔', '围巾', '手套', '靴', '鞋', '帽', '项链', '耳环', '戒指', '胸针', '徽章',
    '臂环', '肩甲', '袖', '领', '袍', '裙', '衫', '衣', '甲', '服', '裤', '袜', '包袱',
    '背心', '外套', '马甲', '围裙', '斗笠', '罩', '环', '带子'];
  // 明确「拿在手里 / 放在包里 / 抽象属性」的词 —— 命中就剔除
  var DROP = ['笔记本', '相机', '摄像机', '图纸', '放大镜', '标本', '工具', '扳手',
    '零件', '显示器', '键盘', '电脑', '平板', '手机', '咖啡', '杯', '瓶', '碗',
    '书', '手稿', '打字机', '日志', '钥匙', '地图', '罗盘', '哨子', '箱',
    '盒', '罐', '杖', '弓', '枪', '刀', '剑', '矛', '盾', '铃', '机动性',
    '采集袋', '背包', '行囊', '工作区', '编辑器', '显示器', '油渍', '粉尘',
    '敏捷', '智慧', '光环', '气场'];

  var fixedRoles = [];
  Object.keys((KW_DB.character && KW_DB.character.categories) || {}).forEach(function (name) {
    var c = KW_DB.character.categories[name];
    if (!c || !c.zh || !c.zh.detail) return;
    var parts = String(c.zh.detail).split('，').map(function (x) { return x.trim(); }).filter(Boolean);
    var kept = [];
    var changed = false;
    parts.forEach(function (p) {
      var keep = false, drop = false, i;
      for (i = 0; i < KEEP_HARD.length; i++) if (p.indexOf(KEEP_HARD[i]) >= 0) { keep = true; break; }
      if (!keep) {
        for (i = 0; i < DROP.length; i++) if (p.indexOf(DROP[i]) >= 0) { drop = true; break; }
      }
      if (drop) { changed = true; return; }
      kept.push(p);
    });
    if (changed && kept.length) {
      c.zh.detail = kept.join('，');
      fixedRoles.push(name);
      n++;
    }
  });

  window.__archiveFixCount = n;
  window.__archiveFixRoles = fixedRoles;
})();
