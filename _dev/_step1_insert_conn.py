#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 1 步：在 withSuffix 之后插入「连接词变体表 + 三个取值函数」。
只插一次，重复运行会检测到已存在并跳过。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

MARK = 'CONN_TAIL_VARIANTS'

BLOCK = r'''
/* ============================================================
 * 连接词变体（2026-11-11）
 * ------------------------------------------------------------
 * 为什么加：用 _dev/audit-templating.js 测了 90 条样本，
 *   「映照」90/90、「色调」90/90、「氛围」90/90、「中景构图」84/90。
 *   每条输出结尾都是同一套连接词 —— 这是测出来的模板感，不是感觉。
 *
 * 选法：按「族 + 维度 + 类别名」做哈希取模。
 *   同一类别永远同一个说法（可复现，测试不会飘），
 *   不同类别会散开（跨输入多样性）。权重不做，因为这里需要的是"不一样"，
 *   不是"哪个更常见"。
 * ============================================================ */
const CONN_TAIL_VARIANTS = {
  style:       ['风格', '笔法', '画风', '风格化处理'],
  lighting:    ['映照', '洒落', '铺开', '笼罩', '照明'],
  composition: ['构图', '视角', '取景'],
  color:       ['色调', '色系', '色彩基调'],
  atmosphere:  ['氛围', '气息', '氛围感'],
  quality:     ['画质', '画面质感', '成像质量']
};

const CONN_DEEP_VARIANTS = {
  style: [
    function (c) { return c + '风格主导画面'; },
    function (c) { return '整体呈' + c + '风格'; },
    function (c) { return '以' + c + '风格为基调'; }
  ],
  lighting: [
    function (c) { return c + '洒落场景'; },
    function (c) { return c + '笼罩全场'; },
    function (c) { return c + '铺满整个画面'; }
  ],
  composition: [
    function (c) { return '采用' + withSuffix(c, '构图'); },
    function (c) { return '以' + withSuffix(c, '构图') + '取景'; },
    function (c) { return '取' + withSuffix(c, '构图'); }
  ],
  color: [
    function (c) { return '以' + c + '色调为主'; },
    function (c) { return c + '色调统领画面'; },
    function (c) { return '整体落在' + c + '色系上'; }
  ],
  atmosphere: [
    function (c) { return '氛围' + c; },
    function (c) { return '整体气息' + c; },
    function (c) { return '画面氛围' + c; }
  ],
  quality: [
    function (c) { return c + '画质呈现'; },
    function (c) { return '画面达到' + c; },
    function (c) { return '以' + c + '出片'; }
  ]
};

const CONN_PROP_VARIANTS = {
  style: [
    function (c) { return '以' + c + '风格呈现'; },
    function (c) { return '走' + c + '路线'; },
    function (c) { return '整体为' + c + '风格'; }
  ],
  atmosphere: [
    function (c, bg) { return bg ? (bg + '中' + c + '的氛围弥漫') : (c + '的氛围贯穿整个画面'); },
    function (c, bg) { return bg ? (bg + '里' + c + '的气息散开') : (c + '的气息贯穿始终'); },
    function (c, bg) { return bg ? (bg + '范围内' + c + '的氛围铺陈') : (c + '的氛围包裹主体'); }
  ]
};

/* 稳定哈希：只用来选说法，不参与任何判定 */
function connHash(s) {
  var h = 0, t = String(s || '');
  for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 100003;
  return h;
}

function connPick(family, dim, key) {
  var table = family === 'deep' ? CONN_DEEP_VARIANTS
    : (family === 'prop' ? CONN_PROP_VARIANTS : CONN_TAIL_VARIANTS);
  var list = table && table[dim];
  if (!list || !list.length) return null;
  return list[connHash(family + '|' + dim + '|' + key) % list.length];
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
'''

src = io.open(PATH, encoding='utf-8').read()
if MARK in src:
    print('已存在，跳过插入')
    sys.exit(0)

anchor = """function withSuffix(core, suffix) {
  if (!core) return '';
  var c = String(core).trim();
  if (!suffix) return c;
  return c.endsWith(suffix) ? c : (c + suffix);
}"""
if anchor not in src:
    print('✗ 找不到 withSuffix 原文，停止')
    sys.exit(1)

# 顺手修一个老毛病：「莫兰迪色」+「色调」原来会拼成「莫兰迪色色调」
new_anchor = anchor.replace(
    "return c.endsWith(suffix) ? c : (c + suffix);",
    "if (c.endsWith(suffix)) return c;\n"
    "  // 「莫兰迪色」+「色调」会拼成「莫兰迪色色调」，去掉重复的那个字\n"
    "  if (c.charAt(c.length - 1) === suffix.charAt(0)) return c + suffix.slice(1);\n"
    "  return c + suffix;")

src = src.replace(anchor, new_anchor + '\n' + BLOCK, 1)
io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print('✓ 已插入连接词变体表，并修掉「莫兰迪色色调」这类叠字')
