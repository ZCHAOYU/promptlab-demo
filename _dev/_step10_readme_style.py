#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""README 同步：把 archive-style-defaults.js 补进文件表、加载顺序、文件地图，
并更新 app.js 大小和「当前状态」里的风格默认值覆盖。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'README.md')
src = io.open(PATH, encoding='utf-8').read()

PAIRS = [
    # 1. 文件表：改大小 + 插入新行
    ("| `app.js` | 336.1 KB | 检测 / 补全 / 拼装 / UI 逻辑 |",
     "| `app.js` | 305.1 KB | 检测 / 补全 / 拼装 / UI 逻辑 |"),
    ("| `archive-faces.js` | 79.3 KB | 角色面容变体（272 × 3） |",
     "| `archive-faces.js` | 79.3 KB | 角色面容变体（272 × 3） |\n"
     "| `archive-style-defaults.js` | 32.0 KB | 风格 → 光/色/氛围/场景 的默认值（323 键，320 个风格全覆盖） |"),

    # 2. 加载顺序
    ("→ archive-variants.js → archive-faces.js\n→ app.js",
     "→ archive-variants.js → archive-faces.js → archive-style-defaults.js\n→ app.js"),

    # 3. 加载顺序下面的说明补一句为什么单独成文件
    ("**测试脚本不再各自写死这份清单**",
     "`archive-style-defaults.js` 单独成文件的原因：原来这四张表**写死在 `app.js` 里，而且有两套**\n"
     "（163 键 / 83 键，一套给 `smartFill`、一套给「风格冲突后级联更新」），\n"
     "键不一样 —— 同一个风格在两处会得到不同结果。现在数据只有一个来源。\n\n"
     "**测试脚本不再各自写死这份清单**"),

    # 4. 当前状态表
    ("| 档案描述 | 454 条补丁 + 256 条手工修正 |",
     "| 档案描述 | 454 条补丁 + 256 条手工修正 |\n"
     "| 风格默认值 | 320 / 320 个风格都有光/色/氛围映射（改前 160 个落到兜底） |"),

    # 5. 实测指标
    ("第 3 层补全     21/21（原本会被「没认出主体」弹窗拦下的输入）",
     "第 3 层补全     21/21（原本会被「没认出主体」弹窗拦下的输入）\n"
     "风格映射覆盖    320/320（原本有映射的 160 个，改后逐字未变）\n"
     "风格取值分散    光线 40 种 / 色彩 54 种 / 氛围 52 种"),

    # 6. 文件地图
    ("│   archive-variants.js  archive-faces.js\n│   app.js  config.local.js",
     "│   archive-variants.js  archive-faces.js  archive-style-defaults.js\n│   app.js  config.local.js"),

    # 7. 文件地图里的 _dev 工具
    ("│   audit-templating.js         模板感度量（开句分布 / 说法种类 / 结构同构率）",
     "│   audit-templating.js         模板感度量（开句分布 / 说法种类 / 结构同构率）\n"
     "│   audit-style-maps.js         风格映射的串味检测（传统类配霓虹）\n"
     "│   audit-style-coverage.js     320 个风格的光/色/氛围取值分散度（改前改后对比）\n"
     "│   assert-style-refactor.js    重构安全断言（原本有映射的必须一字不差）\n"
     "│   snapshot-style-fills.js     给 320 个风格各生成一次 fills 存快照，用于改前改后对比\n"
     "│   gen-style-maps.js           用模型补缺失的风格映射（值必须来自池子）\n"
     "│   gen-style-defaults.js       合并旧表 + 新数据 → archive-style-defaults.js"),
]

problems = [(a[:46], src.count(a)) for a, b in PAIRS if src.count(a) != 1]
if problems:
    print('✗ 锚点命中次数不符，未修改：')
    for p in problems:
        print(f'   命中 {p[1]} 次：{p[0]}')
    sys.exit(1)

for a, b in PAIRS:
    src = src.replace(a, b, 1)

io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print(f'✓ README 改了 {len(PAIRS)} 处')
