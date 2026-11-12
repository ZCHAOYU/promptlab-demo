#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 4 步：修构图维度的两个别扭说法。
实测输出里出现：
  「中景取景」      —— 景/景 撞字
  「取荷兰角构图」  —— 少一个动词，读着像断句
220 条构图里 143 条本身就以「构图」结尾，所以追加式的说法只影响少数，
但既然看见了就改掉。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

PAIRS = [
    ("  composition: ['构图', '视角', '取景'],",
     "  composition: ['构图', '视角', '机位'],", 1),
    ("    function (c) { return '以' + withSuffix(c, '构图') + '取景'; },",
     "    function (c) { return '画面取' + withSuffix(c, '构图'); },", 1),
    ("    function (c) { return '取' + withSuffix(c, '构图'); }",
     "    function (c) { return withSuffix(c, '构图') + '铺开画面'; }", 1),
]

src = io.open(PATH, encoding='utf-8').read()
problems = [(o[:50], src.count(o), w) for o, n, w in PAIRS if src.count(o) != w]
if problems:
    print('✗ 命中次数不符，未做替换：')
    for p in problems:
        print(f'   命中 {p[1]}（期望 {p[2]}）：{p[0]}…')
    sys.exit(1)

n = 0
for old, new, want in PAIRS:
    src = src.replace(old, new)
    n += want
io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print(f'✓ 改了 {n} 处构图说法')
