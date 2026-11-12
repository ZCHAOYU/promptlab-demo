'use strict';
/* 批量补全空壳档案的描述（先用 20 条做样板）
   用法：
     $env:DEEPSEEK_API_KEY="sk-..."
     node _dev/fill-archives.js --limit 20 --dry-run      # 只挑条目，不调用
     node _dev/fill-archives.js --limit 20 --write-preview # 调用并写预览
*/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://api.deepseek.com/v1';
const KEY = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-flash';

const argv = process.argv.slice(2);
const argOf = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const LIMIT = parseInt(argOf('--limit', '20'), 10);
const WRITE = argv.includes('--write-preview');

/* 每个维度的描述要求 */
const SPEC = {
  scene: {
    label: '场景',
    guide: '描述这个场景的视觉构成：环境主体、建筑或地形特征、材质细节、光照与氛围线索。40–70 字，用逗号分隔的短句，不要重复场景名字本身。'
  },
  color: {
    label: '色彩',
    guide: '描述这个色调的色相、明度、饱和倾向和情绪感。15–30 字，用逗号分隔。'
  },
  light: {
    label: '光线',
    guide: '描述光源、方向、质感（硬/柔）、色温、明暗对比。15–30 字，用逗号分隔。'
  },
  composition: {
    label: '构图',
    guide: '描述画面结构、主体位置、视线引导方式。15–30 字，用逗号分隔。'
  },
  atmosphere: {
    label: '氛围',
    guide: '描述这个氛围的情绪基调与可感知的细节线索。15–30 字，用逗号分隔。'
  },
  quality: {
    label: '画质',
    guide: '描述清晰度、细节保留、质感特征。10–20 字，用逗号分隔。'
  }
};

/* 挑选空壳条目：按各维度空壳数量比例分配名额 */
function pickEmpty(limit) {
  const es = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));
  const pool = [];
  es.forEach(e => {
    if (!SPEC[e.kind]) return;
    const parts = String(e.zh || '').split('；').map(x => x.trim()).filter(Boolean);
    if (parts.length <= 1) pool.push(e);
  });
  const byKind = {};
  pool.forEach(e => { (byKind[e.kind] = byKind[e.kind] || []).push(e); });

  // 按空壳占比分配名额（最少 1 条，保证每类都能看到样板）
  const total = pool.length;
  const quota = {};
  let used = 0;
  Object.keys(byKind).forEach(k => {
    quota[k] = Math.max(1, Math.round(byKind[k].length / total * limit));
    used += quota[k];
  });
  // 修正总数
  const keys = Object.keys(byKind).sort((a, b) => byKind[b].length - byKind[a].length);
  let i = 0;
  while (used !== limit && i < 200) {
    const k = keys[i % keys.length];
    if (used > limit && quota[k] > 1) { quota[k]--; used--; }
    else if (used < limit) { quota[k]++; used++; }
    i++;
  }

  const picked = [];
  keys.forEach(k => {
    const arr = byKind[k].slice();
    // 确定性打散，保证每次抽到的差不多
    let seed = 20261109;
    arr.sort((a, b) => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const x = seed / 2147483648;
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return x - seed / 2147483648;
    });
    picked.push.apply(picked, arr.slice(0, quota[k] || 0).map(e => ({ kind: e.kind, name: e.name })));
  });
  return picked;
}

async function genOne(item) {
  const spec = SPEC[item.kind];
  const sys = '你是一个中文视觉描述词典的编写者。你只输出描述文本，不输出任何解释、标题、序号或标点开头。';
  const user =
    '为「' + spec.label + '」类目下的条目「' + item.name + '」写一句中文描述。\n' +
    '要求：\n' + spec.guide + '\n' +
    '硬性约束：\n' +
    '1) 只输出描述本身，不要重复条目名；\n' +
    '2) 不要输出引号、书名号、序号、换行；\n' +
    '3) 用中文逗号分隔短句，不要用句号结尾；\n' +
    '4) 不要写"这个场景""该色调"这类指代词。';

  const resp = await fetch(BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: 900   // 推理模型的思考会吃掉预算，300 会返回空内容
    })
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error('HTTP ' + resp.status + ' ' + t.slice(0, 160));
  }
  const j = await resp.json();
  const choice = (j.choices || [])[0] || {};
  const text = ((choice.message || {}).content || '').trim();
  return { text: text, usage: j.usage || {}, finish: choice.finish_reason };
}

(async () => {
  const items = pickEmpty(LIMIT);
  console.log('待补条目 ' + items.length + ' 条：');
  const byKind = {};
  items.forEach(x => { byKind[x.kind] = (byKind[x.kind] || 0) + 1; });
  console.log('  分布:', JSON.stringify(byKind));
  items.forEach((x, i) => console.log('  ' + (i + 1) + '. [' + x.kind + '] ' + x.name));

  if (!WRITE) {
    console.log('\n（未加 --write-preview，只列清单，不调用 API）');
    return;
  }
  if (!KEY) {
    console.log('\n缺少 API key：请设置 $env:DEEPSEEK_API_KEY');
    process.exit(1);
  }

  const out = [];
  let tin = 0, tout = 0;
  for (const item of items) {
    try {
      let r = await genOne(item);
      tin += r.usage.prompt_tokens || 0;
      tout += r.usage.completion_tokens || 0;
      if (!r.text) {                       // 空内容 → 重试一次
        r = await genOne(item);
        tin += r.usage.prompt_tokens || 0;
        tout += r.usage.completion_tokens || 0;
      }
      out.push({ kind: item.kind, name: item.name, desc: r.text, finish: r.finish });
      console.log('✓ [' + item.kind + '] ' + item.name + ' → ' + r.text.slice(0, 60));
    } catch (e) {
      out.push({ kind: item.kind, name: item.name, desc: '', error: e.message });
      console.log('✗ [' + item.kind + '] ' + item.name + ' → ' + e.message);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'archive-fill-preview.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('\ntoken: in ' + tin + ' / out ' + tout);
  console.log('已写入 _dev/archive-fill-preview.json');
})();
