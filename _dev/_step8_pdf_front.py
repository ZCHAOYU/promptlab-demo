#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""更新 build-readme-pdf.py 的前置页表格（原来只写到 V5.6）。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'build-readme-pdf.py')

src = io.open(PATH, encoding='utf-8').read()

OLD_INTRO = "> 本文记录从 V5.0 到 V5.6 的迭代过程、每个决策的数据依据，以及被推翻的假设。"
NEW_INTRO = "> 本文记录从 V5.0 到 2026-11-11 的迭代过程、每个决策的数据依据，以及被推翻的假设。"

OLD_ROW = "| V5.6 | 接入主工具 + 一键回归 | 旁路面板，不改 app.js；离线 75 项回归 |"
NEW_ROW = (
    "| V5.6 | 接入主工具 + 一键回归 | 旁路面板，不改 app.js；离线 75 项回归 |\n"
    "| V5.7 | 修随机拼装矛盾 | 一句话两个主角 / 性别矛盾 / 场景错配 |\n"
    "| V5.8 | 收口到 buildOptimizedPrompt | 两条出口统一；修 randomMix 换主体 |\n"
    "| 11-10 | 现代角色 + 限定词归位 | 8 条真实漫剧输入，识别 2/8 → 6/8 |\n"
    "| 11-11 | 第 3 层 LLM 推理兜底 | 原本被弹窗拦下的 21 条输入 → 21/21 补上 |\n"
    "| 11-11 | 变体与去模板化 | 面容 272×3、姿态 273×3；连接词 1→5 种，结构同构率 53%→2% |\n"
    "| 11-11 | 重复与随机 | 动作片段区间去重；可复现随机，每点一次换一版 |"
)

problems = []
for old in (OLD_INTRO, OLD_ROW):
    if old not in src:
        problems.append(old[:50])
if problems:
    print('✗ 找不到锚点：')
    for p in problems:
        print('   ' + p)
    sys.exit(1)

src = src.replace(OLD_INTRO, NEW_INTRO, 1)
src = src.replace(OLD_ROW, NEW_ROW, 1)
io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print('✓ 前置页表格已更新到 11-11')
