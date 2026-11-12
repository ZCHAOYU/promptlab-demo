#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 2 步：把 38 处写死的连接词换成变体取值。
每处都校验命中次数，数目不对就整体中止（不做半截替换）。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

# (原文, 替换为, 期望命中次数)
PAIRS = [
    # ---- 风格 ----
    ("if (styleData && styleData.zh) parts.push(withSuffix(styleData.zh.core, '风格'));",
     "if (styleData && styleData.zh) parts.push(connTail('style', styleData.zh.core));", 3),
    ("if (styleData && styleData.zh) s1.push(withSuffix(styleData.zh.core, '风格'));",
     "if (styleData && styleData.zh) s1.push(connTail('style', styleData.zh.core));", 1),
    ("if (styleData && styleData.zh) s2Parts.push(withSuffix(styleData.zh.core, '风格'));",
     "if (styleData && styleData.zh) s2Parts.push(connTail('style', styleData.zh.core));", 2),
    ("if (styleData && styleData.zh) p1.push('以' + styleData.zh.core + '风格呈现');",
     "if (styleData && styleData.zh) p1.push(connProp('style', styleData.zh.core));", 1),
    ("if (styleData && styleData.zh) p2.push(styleData.zh.core + '风格主导画面');",
     "if (styleData && styleData.zh) p2.push(connDeep('style', styleData.zh.core));", 2),

    # ---- 光线 ----
    ("if (lightingData && lightingData.zh) s2.push(lightingData.zh.core + '照明');",
     "if (lightingData && lightingData.zh) s2.push(connTail('lighting', lightingData.zh.core));", 1),
    ("if (lightingData && lightingData.zh) s2Parts.push(withSuffix(lightingData.zh.core, '映照'));",
     "if (lightingData && lightingData.zh) s2Parts.push(connTail('lighting', lightingData.zh.core));", 2),
    ("if (lightingData && lightingData.zh) p2.push(lightingData.zh.core + '洒落场景');",
     "if (lightingData && lightingData.zh) p2.push(connDeep('lighting', lightingData.zh.core));", 2),

    # ---- 构图 ----
    ("if (compData && compData.zh) s2.push(compData.zh.core + '视角');",
     "if (compData && compData.zh) s2.push(connTail('composition', compData.zh.core));", 1),
    ("if (compData && compData.zh) s2Parts.push(withSuffix(compData.zh.core, '构图'));",
     "if (compData && compData.zh) s2Parts.push(connTail('composition', compData.zh.core));", 2),
    ("if (compData && compData.zh) p2.push('采用' + withSuffix(compData.zh.core, '构图'));",
     "if (compData && compData.zh) p2.push(connDeep('composition', compData.zh.core));", 2),

    # ---- 色彩 ----
    ("if (colorData && colorData.zh) s2.push(withSuffix(colorData.zh.core, '色调'));",
     "if (colorData && colorData.zh) s2.push(connTail('color', colorData.zh.core));", 1),
    ("if (colorData && colorData.zh) parts.push(withSuffix(colorData.zh.core, '色调'));",
     "if (colorData && colorData.zh) parts.push(connTail('color', colorData.zh.core));", 1),
    ("if (colorData && colorData.zh) s2Parts.push(withSuffix(colorData.zh.core, '色调'));",
     "if (colorData && colorData.zh) s2Parts.push(connTail('color', colorData.zh.core));", 2),
    ("if (colorData && colorData.zh) p2.push('以' + colorData.zh.core + '色调为主');",
     "if (colorData && colorData.zh) p2.push(connDeep('color', colorData.zh.core));", 2),

    # ---- 氛围 ----
    ("if (atmoData && atmoData.zh) s2.push(withSuffix(atmoData.zh.core, '氛围'));",
     "if (atmoData && atmoData.zh) s2.push(connTail('atmosphere', atmoData.zh.core));", 1),
    ("if (atmoData && atmoData.zh) parts.push(withSuffix(atmoData.zh.core, '氛围'));",
     "if (atmoData && atmoData.zh) parts.push(connTail('atmosphere', atmoData.zh.core));", 1),
    ("if (atmoData && atmoData.zh) s2Parts.push(withSuffix(atmoData.zh.core, '氛围'));",
     "if (atmoData && atmoData.zh) s2Parts.push(connTail('atmosphere', atmoData.zh.core));", 2),
    ("if (atmoData && atmoData.zh) p3.push('氛围' + atmoData.zh.core);",
     "if (atmoData && atmoData.zh) p3.push(connDeep('atmosphere', atmoData.zh.core));", 2),
    ("p3.push(bgData + '中' + atmoCore + '的氛围弥漫');",
     "p3.push(connProp('atmosphere', atmoCore, bgData));", 1),
    ("p3.push(atmoDetailHasCore ? atmoDetail : atmoCore + '的氛围贯穿整个画面');",
     "p3.push(atmoDetailHasCore ? atmoDetail : connProp('atmosphere', atmoCore, ''));", 1),

    # ---- 画质 ----
    ("if (qualityData && qualityData.zh) s2Parts.push(withSuffix(qualityData.zh.core, '画质'));",
     "if (qualityData && qualityData.zh) s2Parts.push(connTail('quality', qualityData.zh.core));", 2),
    ("if (qualityData && qualityData.zh) p3.push(qualityData.zh.core + '画质呈现');",
     "if (qualityData && qualityData.zh) p3.push(connDeep('quality', qualityData.zh.core));", 2),
]

src = io.open(PATH, encoding='utf-8').read()

# 先全量校验，任何一处数目不符就中止
problems = []
for old, new, want in PAIRS:
    got = src.count(old)
    if got != want:
        problems.append((old[:60], got, want))
if problems:
    print('✗ 命中次数不符，未做任何替换：')
    for p in problems:
        print(f'   命中 {p[1]} 次（期望 {p[2]}）：{p[0]}…')
    sys.exit(1)

total = 0
for old, new, want in PAIRS:
    src = src.replace(old, new)
    total += want

io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print(f'✓ 已替换 {total} 处连接词拼接点')
