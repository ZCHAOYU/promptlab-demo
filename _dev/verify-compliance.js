'use strict';
/* 第 6 道闸门（合规）验证（2026-11-11）
   ------------------------------------------------------------------
   合规闸门最容易写成「看起来很严、其实拦不住」。所以这里正反两面都测：
     · 已知违规的必须被拦（假阴性 = 漏放）
     · 正常词条必须放行（假阳性 = 把好东西也拦了）
     · 组合规则（单词都不违规、拼起来违规）必须生效
     · review 级只打标、不阻断

   用法：node _dev/verify-compliance.js */
const path = require('path');
const g = require('./compliance-gate');

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ ' + msg); }
}

function entry(subject, opts) {
  return Object.assign({
    subject: subject, short: subject, gender: '中性',
    worn: '深色布衣，旧围裙', outward: '清瘦面容，短发', pose: '低头操作，神情专注',
    en_core: 'a craftsman', en_worn: ['apron'], en_tags: ['focused']
  }, opts || {});
}

console.log('=== 1. 必须拦住的（硬拒绝）===');
const mustBlock = [
  ['真实人物', entry('领导人肖像')],
  ['真实人物', entry('女帝', { outward: '面容酷似习近平' })]  ,
  ['色情', entry('少女', { pose: '全裸侧躺，情色姿态' })],
  ['暴力', entry('屠夫', { pose: '正在肢解尸体，内脏外露' })],
  ['违禁品', entry('化学爱好者', { worn: '手持炸弹制作图纸' })],
  ['仇恨', entry('演说者', { pose: '高呼劣等民族该被清除' })],
  ['受保护IP', entry('皮卡丘', { short: '皮卡丘' })],
  ['受保护IP', entry('米老鼠', {})],
  ['受保护IP', entry('漫威', { en_core: 'a marvel superhero' })],
];
mustBlock.forEach(function (c) {
  const r = g.checkCompliance(c[1]);
  ok(r.level === 'block', '拦住【' + c[0] + '】：' + (r.reasons[0] || '（未拦）'));
});

console.log('\n=== 2. 组合规则：未成年 + 性化 = 红线 ===');
const combo = g.checkCompliance(entry('少女', { pose: '穿比基尼在床上做诱惑姿势' }));
ok(combo.level === 'block', '「少女 + 比基尼/床上/诱惑」被拦（' + (combo.reasons[0] || '') + '）');
const combo2 = g.checkCompliance(entry('儿童', { worn: '半裸纱布' }));
ok(combo2.level === 'block', '「儿童 + 半裸」被拦（' + (combo2.reasons[0] || '') + '）');
// 未成年但非性化：不该被拦
const minorOk = g.checkCompliance(entry('小学生', { worn: '蓝白校服，红领巾', pose: '背着书包快步走' }));
ok(minorOk.level !== 'block', '「小学生 + 校服」不被硬拦（level=' + minorOk.level + '）');

console.log('\n=== 3. 正常词条必须放行（防止误杀）===');
const mustPass = [
  entry('扎纸匠人'),
  entry('街头涂鸦少年'),
  entry('山里的采药人'),
  entry('赛博朋克道士', { worn: '深灰道袍，霓虹电路纹饰' }),
  entry('老式钟表匠', { worn: '深蓝工作服，放大镜' }),
  entry('夜晚的霓虹街道', { short: '霓虹街道', en_core: 'a neon street at night' }),
];
mustPass.forEach(function (e) {
  const r = g.checkCompliance(e);
  ok(r.level === 'ok', '放行「' + e.subject + '」（level=' + r.level + (r.reasons.length ? ' / ' + r.reasons[0] : '') + '）');
});

console.log('\n=== 4. review 级只打标、不阻断 ===');
const rev = g.checkCompliance(entry('僧人', { worn: '袈裟，手持佛像' }));
ok(rev.level === 'review', '「僧人 + 佛像」标为 review（不阻断）');
// 2026-11-11 改成 Trie 后，原因格式是「review：佛像(宗教)」，类别放在括号里
ok(rev.reasons.length > 0 && rev.reasons[0].indexOf('review') === 0 && rev.reasons[0].indexOf('宗教') > 0,
  '原因带 review 前缀与类别：' + rev.reasons[0]);
const rev2 = g.checkCompliance(entry('战士', { worn: '军装，红领巾' }));
ok(rev2.level === 'review', '「军装 + 红领巾」标为 review');

console.log('\n=== 5. 必须是「拦不住变体」——写清楚这个边界 ===');
// 这条**故意**写成一个应该漏过的用例，用来固定「关键词表不是合规保证」这个事实。
// 如果哪天它被拦住了，说明表变强了，这个断言要改，但不能假装表能拦住所有变体。
const variant = g.checkCompliance(entry('人物', { pose: '姿势参考 luo ti' }));
ok(variant.level === 'ok', '拼音变体「luo ti」**没有**被拦（这是已知边界，不是 bug）');

console.log('\n=== 6. 两条管线用的是同一份判据（防止分叉）===');
const listFromGate = Object.keys(require('./compliance-list.json'));
ok(listFromGate.indexOf('block') >= 0 && listFromGate.indexOf('ip') >= 0 && listFromGate.indexOf('review') >= 0,
  '词表三档齐备：' + listFromGate.filter(function (k) { return k.charAt(0) !== '_'; }).join(' / '));
const pl = require('fs').readFileSync(path.join(__dirname, 'promote-learned.js'), 'utf8');
const lo = require('fs').readFileSync(path.join(__dirname, 'learn-oov.js'), 'utf8');
ok(pl.indexOf("require('./compliance-gate')") >= 0, 'promote-learned.js 走共享模块');
ok(lo.indexOf("require('./compliance-gate')") >= 0, 'learn-oov.js 走共享模块');

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
