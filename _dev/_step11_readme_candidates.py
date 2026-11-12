#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""README 同步：B 项（风格候选集）之后的数字与说明。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'README.md')
src = io.open(PATH, encoding='utf-8').read()

PAIRS = [
    # 文件表大小 + 说明
    ("| `archive-style-defaults.js` | 32.0 KB | 风格 → 光/色/氛围/场景 的默认值（323 键，320 个风格全覆盖） |",
     "| `archive-style-defaults.js` | 57.6 KB | 风格 → 光/色/氛围/场景 的候选值（320 风格 × 3 维 × 3 候选） |"),
    ("| `app.js` | 305.1 KB | 检测 / 补全 / 拼装 / UI 逻辑 |",
     "| `app.js` | 305.7 KB | 检测 / 补全 / 拼装 / UI 逻辑 |"),

    # 当前状态
    ("| 风格默认值 | 320 / 320 个风格都有光/色/氛围映射（改前 160 个落到兜底） |",
     "| 风格默认值 | 320 / 320 个风格都有映射，且每维 **3 个候选**（共 2880 个取值） |"),

    # 实测指标
    ("风格取值分散    光线 40 种 / 色彩 54 种 / 氛围 52 种",
     "风格取值分散    光线 40 种 / 色彩 54 种 / 氛围 52 种（跨风格）\n"
     "同一风格多版本   27 种可能组合（3×3×3），连点 8 次得 6~8 种"),

    # 去模板化边界表
    ("| **维度取值**（同一输入永远同一套光 / 色 / 氛围） | **没做**：需要 320 风格 × 5 维的兼容候选集，是数据工程 |",
     "| 维度取值（同一风格的光 / 色 / 氛围） | 做了：320 风格 × 3 维 × 3 候选 |"),

    # 那句「换一版目前只换说法」
    ("「换一版」目前只换说法、不换内容：19 个分句里 15 个逐字相同。\n"
     "要让内容也变，得先有兼容集，否则会出「古风剑客配霓虹光」这种矛盾\n"
     "（这类矛盾前面花了两轮才压到 0）。",
     "「换一版」现在会换内容：同一输入连点 3 次，光 / 色 / 氛围每版都不同。\n"
     "候选值都是从维度池子里挑的，且每个风格的三候选都经过「同风格不同取舍」的约束，\n"
     "不会出「古风剑客配霓虹光」这种矛盾。"),

    # 文件地图里补新工具
    ("│   gen-style-defaults.js       合并旧表 + 新数据 → archive-style-defaults.js",
     "│   gen-style-defaults.js       合并基线 + 新数据 → archive-style-defaults.js（幂等）\n"
     "│   gen-style-candidates.js     每风格每维 3 个协调候选\n"
     "│   verify-style-variants.js    候选合法性 / 取值落点 / 多版本 / 同轮次复现\n"
     "│   peek-style-candidates.js    人工过目候选集\n"
     "│   demo-content-rounds.js      同一输入连点 3 次，看内容有没有变"),

    # 变更摘要表里那一行
    ("| 同一输入永远同一输出 | 连点两次拿到一模一样的结果 | 可复现随机源 + 每点一次换一版 |",
     "| 同一输入永远同一输出 | 连点两次拿到一模一样的结果 | 可复现随机源 + 每点一次换一版 |\n"
     "| 同一风格的取值永远固定 | 光/色/氛围只有一个答案 | 320 风格 × 3 维 × 3 候选，取舍不同 |"),
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
