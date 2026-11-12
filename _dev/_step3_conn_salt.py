#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 3 步：给连接词选法加「盐」。
问题：com/quality 这两个维度只有 5~6 个不同的类别名，
      只按类别名哈希，几乎永远落在同一格（实测 构图 93% 只有一种说法）。
办法：哈希里再加用户输入。同一段输入永远同一结果（可复现），
      不同输入即使命中同一个构图，说法也会不同。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

src = io.open(PATH, encoding='utf-8').read()

OLD_HASH = """/* 稳定哈希：只用来选说法，不参与任何判定 */
function connHash(s) {
  var h = 0, t = String(s || '');
  for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 100003;
  return h;
}"""

NEW_HASH = """/* 稳定哈希：只用来选说法，不参与任何判定 */
function connHash(s) {
  var h = 0, t = String(s || '');
  for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 100003;
  return h;
}

/* 「盐」：本次生成用的用户输入。
   为什么要它：构图、画质这两个维度只有五六个不同的类别名，
   只按类别名哈希，几乎永远落在同一格（实测「构图」93% 只有一种说法）。
   加上用户输入后，同一段输入仍然永远同一结果（可复现），
   但不同输入即使命中同一个构图，说法也会换。
   生命周期：buildOptimizedPrompt 开头设置一次，函数内所有维度共用。 */
var __connSalt = '';
function setConnSalt(s) { __connSalt = String(s || ''); }"""

if 'setConnSalt' in src:
    print('已存在盐机制，跳过')
    sys.exit(0)

if OLD_HASH not in src:
    print('✗ 找不到 connHash 原文，停止')
    sys.exit(1)
src = src.replace(OLD_HASH, NEW_HASH, 1)

OLD_PICK = "  return list[connHash(family + '|' + dim + '|' + key) % list.length];"
NEW_PICK = "  return list[connHash(__connSalt + '|' + family + '|' + dim + '|' + key) % list.length];"
if OLD_PICK not in src:
    print('✗ 找不到 connPick 取模那一行，停止')
    sys.exit(1)
src = src.replace(OLD_PICK, NEW_PICK, 1)

# 在 buildOptimizedPrompt 开头设置盐
OLD_HEAD = "function buildOptimizedPrompt(text, fills, depth, detection) {"
NEW_HEAD = ("function buildOptimizedPrompt(text, fills, depth, detection) {\n"
            "  // 连接词变体按「输入 + 维度 + 类别名」选：同输入可复现，跨输入会散开\n"
            "  try { setConnSalt(text); } catch (e) {}")
if OLD_HEAD not in src:
    print('✗ 找不到 buildOptimizedPrompt 函数头，停止')
    sys.exit(1)
src = src.replace(OLD_HEAD, NEW_HEAD, 1)

io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print('✓ 已加入盐机制，并在 buildOptimizedPrompt 开头设置')
