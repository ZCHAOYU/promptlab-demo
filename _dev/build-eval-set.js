/* 第一轮评估集生成
 * L1 自动生成：从词条反推「用户会怎么说」→ 同时记录期望维度
 * L3 刁难集：手写（矛盾 / 模糊 / 指代 / 空 / 超长）
 * chat 集：手写闲聊
 *
 * 产出 eval-set.json
 */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./eval-lib.js');

const CFG = L.loadConfig();
require('../llm-arbiter.js');
const A = global.LLMArbiter;
A.configure(CFG);

/* 固定取样（按索引，避免名称不存在），保证可复现；每个维度至少 1 条 */
const PICKS = [
  ['scene', 0],        // 废弃老宅
  ['scene', 161],      // 酒吧
  ['role', 0],         // 古风侠客
  ['role', 122],       // 浪人
  ['style', 1],        // 水墨国风
  ['style', 319],      // 霓虹波普
  ['light', 0],        // 冷蓝月光
  ['light', 159],      // 橱窗光
  ['atmosphere', 1],   // 静谧禅意
  ['atmosphere', 144], // 幽深
  ['color', 0],        // 莫兰迪色系
  ['composition', 0],  // 中心构图
  ['quality', 0]       // 4K高清
];

function pickEntry(kind, idx) {
  const { entries } = L.loadVectors();
  const list = entries.filter(e => e.kind === kind);
  const e = list[idx];
  if (!e) throw new Error('取不到 ' + kind + '[' + idx + ']，共 ' + list.length + ' 条');
  return e;
}

async function callRaw(sys, user, opts) {
  opts = opts || {};
  const url = CFG.endpoint.replace(/\/+$/, '') + '/chat/completions';
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + CFG.key },
    body: JSON.stringify({
      model: CFG.model,
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.9,
      max_tokens: opts.maxTokens || 900,
      stream: false
    })
  });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  const ch = j.choices && j.choices[0];
  const raw = (ch && ch.message && ch.message.content) || '';
  const finish = ch ? ch.finish_reason : '?';
  let t = String(raw).trim();
  t = t.replace(/^["'“”「」『』\s]+|["'“”「」『』\s]+$/g, '');
  t = t.split('\n').filter(x => x.trim())[0] || '';
  t = t.trim();
  return { text: t, finish, rawLen: raw.length };
}

async function genQuery(entry) {
  const sys = '你在模仿一个普通用户描述自己想要的画面。只输出一句话，不要引号，不要解释。';
  const user = [
    '提示词词条：',
    '类别：' + L.DIM_CN[entry.kind],
    '名称：' + entry.name,
    '描述：' + String(entry.zh || entry.name).slice(0, 100),
    '',
    '写一句用户会自然说出口的话，隐含这个词条，但不要直接说出名称。',
    '只描述这个类别，不要涉及其他类别。10–30 字，口语。只输出这句话。'
  ].join('\n');

  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await callRaw(sys, user, { temperature: attempt === 1 ? 0.9 : 0.6, maxTokens: 900 });
    if (r.text) return { text: r.text, attempts: attempt };
    console.log('      （第 ' + attempt + ' 次空响应 finish=' + r.finish + ' rawLen=' + r.rawLen + '，重试）');
  }
  return { text: '', attempts: 3 };
}

/* ---------- L3 刁难集 ---------- */
const HARD = [
  {
    id: 'hard-1', type: 'hard', expectDims: ['scene', 'light'],
    note: '用户主动指定反差（深夜 + 晨雾光）→ 光线不该被清空',
    query: '深夜的老房子，要晨雾光那种清透感'
  },
  {
    id: 'hard-2', type: 'hard', expectDims: [],
    note: '极模糊，无检索线索 → 应大部分留空',
    query: '随便画点什么吧'
  },
  {
    id: 'hard-3', type: 'hard', expectDims: [],
    note: '指代上一轮结果，无上下文 → 应识别为 confirm 或直接留空',
    query: '把上次那个改得再冷一点'
  },
  {
    id: 'hard-4', type: 'hard', expectDims: [],
    note: '空输入 → 应报错，不得编造',
    query: ''
  },
  {
    id: 'hard-5', type: 'hard',
    expectDims: ['style', 'light', 'composition', 'color', 'quality', 'atmosphere'],
    note: '超长多维堆砌 → 应尽量填满且不矛盾',
    query: '一个有质感通透干净的画面，现代极简，摄影棚打光，浅景深，高动态范围，8K 高清，留白构图，柔和的雾蓝色调，安静氛围'
  }
];

/* ---------- chat 集 ---------- */
const CHAT = [
  { id: 'chat-1', type: 'chat', expectDims: [], note: '闲聊 → 不该检索', query: '今天好累，随便聊聊' },
  { id: 'chat-2', type: 'chat', expectDims: [], note: '问身份 → 不该检索', query: '你是谁，你能做什么' },
  { id: 'chat-3', type: 'chat', expectDims: [], note: '无关创作请求 → 不该检索词库', query: '帮我写一首关于秋天的短诗' }
];

/* ---------- 主流程 ---------- */
(async () => {
  await L.healthCheck();
  console.log('服务端就绪，开始生成 L1 自动集（' + PICKS.length + ' 条）…\n');

  const auto = [];
  let skipped = 0;
  for (let i = 0; i < PICKS.length; i++) {
    const [kind, idx] = PICKS[i];
    const e = pickEntry(kind, idx);
    const g = await genQuery(e);
    if (!g.text) {
      skipped++;
      console.log('  ✗ [' + L.DIM_CN[kind] + '] ' + e.name + ' → 连续 3 次空响应，跳过');
      continue;
    }
    auto.push({
      id: 'auto-' + (i + 1),
      type: 'auto',
      expectDims: [kind],
      expectName: e.name,
      note: '由词条反推：' + L.DIM_CN[kind] + ' / ' + e.name,
      query: g.text
    });
    console.log('  ' + String(auto.length).padStart(2) + '. [' + L.DIM_CN[kind] + '] ' + e.name);
    console.log('      → 「' + g.text + '」' + (g.attempts > 1 ? '（重试 ' + (g.attempts - 1) + ' 次）' : ''));
  }

  const set = {
    createdAt: new Date().toISOString(),
    model: CFG.model,
    round: 1,
    cases: [...auto, ...HARD, ...CHAT]
  };

  const out = path.join(__dirname, 'eval-set.json');
  fs.writeFileSync(out, JSON.stringify(set, null, 2), 'utf8');
  console.log('\n共 ' + set.cases.length + ' 条（自动 ' + auto.length + ' / 刁难 ' + HARD.length +
              ' / 闲聊 ' + CHAT.length + '）' + (skipped ? '　跳过 ' + skipped : ''));
  console.log('已写入 ' + out);
})().catch(e => { console.error('生成失败：', e); process.exit(1); });
