'use strict';
/* 风格映射的串味检测：
   传统/手工艺类不许配赛博/霓虹/故障；数字/生成类不许配水墨/宣纸/绢本。
   跟面容变体那次一样，「领域词 + 用自己的名字判断该不该出现」。
   用法：node _dev/audit-style-maps.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'style-maps.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'style-map-todo.json'), 'utf8'));

// 风格本身属于哪个领域，用它自己的名字判断
const DIGITAL = /AI|算法|程序化|生成艺术|体素|全息|投影|增强现实|虚拟现实|数字|赛博|故障|低保真|酸性|神经|交互|沉浸|新媒体|数据可视化|分形|光绘|像素雕塑/;
const TRADITIONAL = /画派|山水|水墨|工笔|写意|泼墨|焦墨|界画|没骨|重彩|绢|宣纸|陶瓷|瓷|窑|盏|陶|漆|雕|镶嵌|金银错|锤|錾|花丝|点翠|烧蓝|珐琅|琉璃|玉|竹|核|根|紫砂|建盏|唐卡|壁画|圣像|细密画|瓷砖|蓝瓷|代尔夫特|套娃|漆器|金箔|纹样|纹身|书法/;

// 池子里「明显属于另一领域」的词
const DIGITAL_MARK = /霓虹|赛博|故障|全息|激光|LED|屏幕|数字/;
const TRAD_MARK = /宣纸|水墨|绢|工笔|白描|赭石|朱砂|藤黄|石青|石绿|墨绿|月白|青碧|黛蓝|粉彩|唐三彩|青花/;

const flags = [];
Object.keys(d).forEach(function (style) {
  const v = d[style];
  const isDigital = DIGITAL.test(style);
  const isTrad = TRADITIONAL.test(style);
  const vals = [v.lighting, v.color, v.atmosphere];
  if (isTrad && !isDigital) {
    vals.forEach(function (x) {
      if (DIGITAL_MARK.test(x)) flags.push(`${style} → 配了「${x}」（传统类配了数字感）`);
    });
  }
  if (isDigital && !isTrad) {
    vals.forEach(function (x) {
      if (TRAD_MARK.test(x)) flags.push(`${style} → 配了「${x}」（数字类配了传统材质）`);
    });
  }
  // 自己也说不清的两类都没命中，跳过
});

console.log(`检查 ${Object.keys(d).length} 条，可疑 ${flags.length} 处\n`);
flags.forEach(f => console.log('  ✗ ' + f));

// ---- 顺带统计：三个维度用了多少种不同取值 ----
function dist(field) {
  const c = {};
  Object.keys(d).forEach(k => { c[d[k][field]] = (c[d[k][field]] || 0) + 1; });
  return c;
}
console.log('\n=== 新增映射的取值分布（看有没有全压在一个值上）===');
[['lighting', '光线'], ['color', '色彩'], ['atmosphere', '氛围']].forEach(function ([f, label]) {
  const c = dist(f);
  const keys = Object.keys(c).sort((a, b) => c[b] - c[a]);
  const top = keys[0];
  console.log(`  ${label} 用了 ${keys.length} 种，最高「${top}」${c[top]} 次 (${(c[top] / 160 * 100).toFixed(0)}%)`);
  console.log('    ' + keys.slice(0, 8).map(k => `${k}×${c[k]}`).join('  '));
});

process.exit(flags.length ? 1 : 0);
