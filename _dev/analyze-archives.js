'use strict';
/* 档案内容健康度统计
   ① 各类型的 zh 描述段数（只有 1 段 = 只有名字，没有内容）
   ② 角色「服饰」字段里是否混入了手持物/抽象词
   ③ 非角色档案是否套用了人物字段（面容/姿态）
*/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const es = JSON.parse(fs.readFileSync(path.join(ROOT, 'entries.json'), 'utf8'));

const KIND_CN = {
  role: '角色', style: '风格', scene: '场景', light: '光线', composition: '构图',
  color: '色彩', atmosphere: '氛围', quality: '画质', gender: '性别',
  material: '材质', texture: '质感', background: '背景', subject: '主体物'
};

/* ① 段数分布 */
console.log('=== ① 描述段数分布（段数=1 表示只有名字没有内容）===');
const stat = {};
es.forEach(e => {
  const k = e.kind;
  const zh = String(e.zh || '').trim();
  const n = zh ? zh.split('；').map(x => x.trim()).filter(Boolean).length : 0;
  stat[k] = stat[k] || { total: 0, one: 0, zero: 0, more: 0 };
  stat[k].total++;
  if (n === 0) stat[k].zero++;
  else if (n === 1) stat[k].one++;
  else stat[k].more++;
});
let totalOne = 0, total = 0;
Object.keys(stat).sort((a, b) => stat[b].one - stat[a].one).forEach(k => {
  const s = stat[k];
  totalOne += s.one + s.zero; total += s.total;
  const pct = Math.round((s.one + s.zero) / s.total * 100);
  console.log('  ' + (KIND_CN[k] || k).padEnd(4) + ' 共 ' + String(s.total).padStart(4) +
    '  只有名字 ' + String(s.one + s.zero).padStart(4) + ' (' + pct + '%)' +
    '  有内容 ' + String(s.more).padStart(4));
});
console.log('  ────────────────────────────────');
console.log('  合计 共 ' + total + '  只有名字 ' + totalOne +
  ' (' + Math.round(totalOne / total * 100) + '%)');

/* ② 角色服饰字段污染 */
console.log('\n=== ② 角色「服饰」字段里混入的非服饰词 ===');
const SUSPECT = ['咖啡', '茶', '图纸', '工具', '敏捷', '智慧', '力量', '电脑', '手机',
  '书', '笔', '笔记本', '相机', '放大镜', '法杖', '武器', '弓', '枪', '刀', '剑',
  '伞', '灯', '箱', '包', '瓶'];
const dirty = [];
es.filter(e => e.kind === 'role').forEach(e => {
  const parts = String(e.zh || '').split('；').map(x => x.trim());
  const detail = parts[3] || '';
  if (!detail) return;
  const hit = SUSPECT.filter(w => detail.indexOf(w) >= 0);
  if (hit.length) dirty.push({ name: e.name, detail: detail, hit: hit });
});
console.log('  可疑条目: ' + dirty.length + ' / ' + es.filter(e => e.kind === 'role').length);
dirty.slice(0, 15).forEach(d => {
  console.log('    ' + d.name + '  命中[' + d.hit.join(',') + ']  ' + d.detail.slice(0, 46));
});

/* ③ 非角色档案是否套用了人物字段 */
console.log('\n=== ③ 非角色档案的段数是否异常（>2 段疑似套了人物字段）===');
const odd = es.filter(e => e.kind !== 'role' && e.kind !== 'subject' &&
  String(e.zh || '').split('；').filter(x => x.trim()).length > 2);
console.log('  条数: ' + odd.length);
odd.slice(0, 10).forEach(e => {
  console.log('    [' + (KIND_CN[e.kind] || e.kind) + '] ' + e.name + '  → ' +
    String(e.zh).slice(0, 60));
});

/* 写出完整清单 */
const report = {
  generatedAt: new Date().toISOString(),
  partStats: stat,
  dirtyDetail: dirty,
  oddCount: odd.length
};
fs.writeFileSync(path.join(__dirname, 'archive-health.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n明细已写入 _dev/archive-health.json');
