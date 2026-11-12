/* 生成第 9 维「主体物」词表 → subject-vocab.json
 * 用法：node build-subject-vocab.js
 * 种子名由我给定（保证覆盖），描述/英文/近义词由模型写。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const src = fs.readFileSync(path.join(DIR, 'config.local.js'), 'utf8');
new Function('window', src)(global);
const CFG = global.LLM_CONFIG;
const KEY = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY || CFG.key;
if (!KEY) { console.error('无 key'); process.exit(1); }

const SEEDS = [
  // 武器 / 装备
  '长剑', '长枪', '弓箭', '盾牌', '战斧', '法杖', '匕首', '镰刀', '头盔', '铠甲',
  // 道具 / 奇物
  '灯笼', '折扇', '油纸伞', '面具', '皇冠', '戒指', '怀表', '罗盘', '钥匙', '沙漏',
  '古书', '卷轴', '药瓶', '水晶球', '火把', '蜡烛', '天平', '长笛', '铃铛',
  // 机械 / 科幻
  '机械臂', '齿轮', '芯片', '全息投影', '无人机', '飞船', '机甲', '能量核心', '电缆',
  // 生物
  '巨龙', '凤凰', '乌鸦', '蝴蝶', '蜘蛛', '锦鲤', '骏马', '狼', '鹿', '猫',
  // 器物 / 家具
  '行李箱', '老式电话', '收音机', '打字机', '相机', '留声机', '镜子', '木门',
  '楼梯', '吊桥', '路灯', '长椅', '秋千', '钟楼', '书架',
  // 自然物
  '岩石', '枯树', '藤蔓', '蘑菇', '珊瑚', '贝壳', '陨石', '冰晶', '花朵', '落叶',
  // 生活
  '茶杯', '酒瓶', '蛋糕', '果盘', '书桌', '灯笼窗'
];

const SYS = [
  '你是提示词词库的编写者。你会收到一批「主体物」名称。',
  '为每一个写三个字段，风格必须像专业提示词词库。',
  '输出格式：**一行一条 JSON**（JSONL），不要数组方括号、不要逗号结尾、不要 markdown 代码块、不要任何解释。'
].join('\n');

function userFor(batch) {
  return [
    '为下面这些主体物各写一条词条：',
    batch.join('、'),
    '',
    '每行输出一个 JSON 对象，共 N 行（每个名称一行）：',
    '{',
    '  "name": "必须是给出的名称原文",',
    '  "zh": "中文描述，20–40 字，用「；」分隔 2–4 个短语，写清外形/材质/状态",',
    '  "en": "对应的英文提示词短语，逗号分隔",',
    '  "kw": "4–8 个中文近义词，空格分隔（越像用户会说的越好，含口语叫法）"',
    '}',
    '',
    '例：',
    '{"name":"长剑","zh":"古旧长剑；细长直刃，剑身有磨损，金属护手，缠绳剑柄","en":"ancient longsword, slender straight blade, worn steel, metal guard, wrapped hilt","kw":"剑 宝剑 长剑 刀剑 冷兵器 佩剑 剑身"}',
    '',
    '注意：kw 是最重要的检索信号，要覆盖用户可能的叫法（如「油纸伞」的 kw 要有 伞 雨伞 纸伞 古伞）。',
    '严格一行一个对象，共 N 行。'
  ].join('\n');
}

async function call(sys, user, maxTokens) {
  const url = CFG.endpoint.replace(/\/+$/, '') + '/chat/completions';
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
    body: JSON.stringify({
      model: CFG.model,
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: maxTokens || 6000,
      stream: false
    })
  });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  const ch = j.choices && j.choices[0];
  const content = (ch && ch.message && ch.message.content) || '';
  const usage = j.usage || {};
  console.log('    tokens in ' + usage.prompt_tokens + ' / out ' + usage.completion_tokens +
              '　finish=' + (ch ? ch.finish_reason : '?'));
  /* 逐行解析：容忍部分行坏掉，只要大多数能解析就用 */
  const items = [];
  let badLines = 0;
  for (const raw of String(content).split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    line = line.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    line = line.replace(/^\[\s*/, '').replace(/\s*\],?$/, '').replace(/,\s*$/, '');
    if (!line.startsWith('{')) continue;
    try { items.push(JSON.parse(line)); }
    catch (e) { badLines++; }
  }
  if (!items.length) throw new Error('一行都没解析出来，原始前 300 字：' + content.slice(0, 300));
  if (badLines) console.log('    跳过硬解析失败的行 ' + badLines + ' 行');
  return items;
}

(async () => {
  const out = [];
  const CHUNK = 20;
  for (let i = 0; i < SEEDS.length; i += CHUNK) {
    const batch = SEEDS.slice(i, i + CHUNK);
    console.log('批次 ' + (i / CHUNK + 1) + '：' + batch.length + ' 条');
    const arr = await call(SYS, userFor(batch), 6000);
    for (const it of arr) {
      const name = String(it.name || '').trim();
      if (!name) continue;
      out.push({
        name,
        zh: String(it.zh || '').trim(),
        en: String(it.en || '').trim(),
        kw: String(it.kw || '').trim()
      });
    }
    console.log('    累计 ' + out.length);
  }

  // 去重 + 校验
  const seen = new Set();
  const clean = [];
  const bad = [];
  for (const e of out) {
    if (seen.has(e.name)) continue;
    seen.add(e.name);
    if (!e.zh && !e.kw) { bad.push(e.name); continue; }
    clean.push(e);
  }
  console.log('\n生成 ' + out.length + ' 条，去重后 ' + clean.length + ' 条' +
              (bad.length ? '，丢弃空描述 ' + bad.length + ' 条：' + bad.join(',') : ''));

  const missing = SEEDS.filter(s => !seen.has(s));
  if (missing.length) console.log('⚠ 种子未覆盖：' + missing.join('、'));

  fs.writeFileSync(path.join(DIR, 'subject-vocab.json'), JSON.stringify(clean, null, 2), 'utf8');
  console.log('已写入 subject-vocab.json');
})().catch(e => { console.error('失败：', e.message); process.exit(1); });
