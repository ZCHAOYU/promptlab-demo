#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 app.js 里两套写死的 xxxByStyle 表删掉，改成统一读 archive-style-defaults.js。

为什么删：原来有两套同名表（163 键 / 83 键），一套给 smartFill、
一套给「风格冲突后级联更新」，键不一样 —— 同一个风格两处会得到不同结果。
现在数据只有一个来源（补丁文件），取值只有一个函数（styleDefault）。

保留 charByStyle：它管的是「没写角色时补哪个角色」，和这次的四维不是一回事。
"""
import io
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

src = io.open(PATH, encoding='utf-8').read()

if 'styleDefault(' in src:
    print('已经改过，跳过')
    sys.exit(0)

# ---------- 1. 删掉四张表的所有副本 ----------
TABLES = ['lightingByStyle', 'colorByStyle', 'atmoByStyle', 'sceneByStyle']
removed = 0
for name in TABLES:
    pat = re.compile(r'\n[ \t]*const ' + name + r' = \{[\s\S]*?\n[ \t]*\};\n')
    src, n = pat.subn('\n', src)
    removed += n
    print(f'  删除 {name}: {n} 处')

# ---------- 2. 加取值函数 ----------
ANCHOR = "function withSuffix(core, suffix) {"
HELPER = '''/* 风格 → 光/色/氛围/场景 的默认值。
   数据在 archive-style-defaults.js（323 个键，320 个真实风格全覆盖）。
   这里只负责取值和兜底：补丁文件没加载时退回原来的硬编码值，
   宁可退化也不要报错。
   为什么要有这个函数：原来是四张写死在 app.js 里的表，而且有两套（163 键 / 83 键），
   同一个风格在两处会得到不同结果。 */
function styleDefault(dim, style, fallback) {
  if (!style) return fallback;
  var D = (typeof window !== 'undefined' && window.__STYLE_DEFAULTS) || null;
  var v = D && D[dim] ? D[dim][style] : null;
  return v || fallback;
}

function withSuffix(core, suffix) {'''
if ANCHOR not in src:
    print('✗ 找不到 withSuffix 锚点')
    sys.exit(1)
src = src.replace(ANCHOR, HELPER, 1)

# ---------- 3. 改取值处 ----------
USES = [
    ("    fills.lighting = lightingByStyle[fills.style] || '电影级侧光';",
     "    fills.lighting = styleDefault('lighting', fills.style, '电影级侧光');"),
    ("    fills.color = colorByStyle[fills.style] || '莫兰迪色系';",
     "    fills.color = styleDefault('color', fills.style, '莫兰迪色系');"),
    ("    fills.atmosphere = atmoByStyle[fills.style] || '史诗壮阔';",
     "    fills.atmosphere = styleDefault('atmosphere', fills.style, '史诗壮阔');"),
    ("    fills.scene = fills.style ? (sceneByStyle[fills.style] || null) : null;",
     "    fills.scene = styleDefault('scene', fills.style, null);"),
    ("    if (lightingByStyle[newStyle]) fills.lighting = lightingByStyle[newStyle];",
     "    var _l = styleDefault('lighting', newStyle, null);\n    if (_l) fills.lighting = _l;"),
    ("    if (colorByStyle[newStyle]) fills.color = colorByStyle[newStyle];",
     "    var _c = styleDefault('color', newStyle, null);\n    if (_c) fills.color = _c;"),
    ("    if (atmoByStyle[newStyle]) fills.atmosphere = atmoByStyle[newStyle];",
     "    var _a = styleDefault('atmosphere', newStyle, null);\n    if (_a) fills.atmosphere = _a;"),
    ("    if (sceneByStyle[newStyle]) fills.scene = sceneByStyle[newStyle];",
     "    var _s = styleDefault('scene', newStyle, null);\n    if (_s) fills.scene = _s;"),
]

problems = []
for old, new in USES:
    n = src.count(old)
    if n != 1:
        problems.append((old.strip()[:60], n))
if problems:
    print('✗ 取值处命中次数不符，未写入：')
    for p in problems:
        print(f'   命中 {p[1]} 次：{p[0]}')
    sys.exit(1)

for old, new in USES:
    src = src.replace(old, new, 1)

io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print(f'✓ 删掉 {removed} 张表，改了 {len(USES)} 处取值')
