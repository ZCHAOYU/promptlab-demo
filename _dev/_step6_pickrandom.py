#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 3 步：把 pickRandom 接到可复现随机源上。
原来：
    [...arr].sort(() => Math.random() - 0.5).slice(0, count)
两个问题：
  1. 比较器洗牌不是均匀洗牌（Chrome/V8 上会明显偏）
  2. 用的是 Math.random，没法复现某一版
改成用 pickN + __rng：均匀、无放回、可复现。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

OLD = """function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}"""

NEW = """function pickRandom(arr, count) {
  // 用可复现随机源 + 无放回抽取。
  // 原来那句 sort(() => Math.random() - 0.5) 有两个毛病：
  // 比较器洗牌不是均匀洗牌，而且用 Math.random 没法复现某一版。
  return pickN(arr, count, __rng || Math.random);
}"""

src = io.open(PATH, encoding='utf-8').read()
if 'return pickN(arr, count' in src:
    print('已替换过，跳过')
    sys.exit(0)
if OLD not in src:
    print('✗ 找不到 pickRandom 原文，停止')
    sys.exit(1)
src = src.replace(OLD, NEW, 1)
io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print('✓ pickRandom 已改为「无放回 + 可复现」')
