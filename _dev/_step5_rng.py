#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 2 项：可复现随机 + 每点一次换一版。
设计：
  · makeRng(seed)  —— xorshift32，同一 seed 永远同一串数
  · __variantRound —— optimize()/randomMix() 每点一次 +1
  · connPick / characterOpening 改成从 __rng 抽，不再用哈希取模
  · 直接调 buildOptimizedPrompt 的（测试、脚本）不递增 round，
    所以测试仍然是确定性的，不会被随机搞飘
"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'app.js')

src = io.open(PATH, encoding='utf-8').read()
if 'makeRng' in src:
    print('已存在 makeRng，跳过')
    sys.exit(0)

PAIRS = []

# ---- 1. 随机源与轮次 ----
PAIRS.append((
    """var __connSalt = '';
function setConnSalt(s) { __connSalt = String(s || ''); }""",
    """var __connSalt = '';

/* 可复现随机数（xorshift32）：同一个 seed 永远同一串数。
   为什么不用 Math.random：用户要能「回到上一版」，测试也要能钉死某一版。 */
function makeRng(seed) {
  var s = (seed >>> 0) || 1;
  return function () {
    s ^= (s << 13); s >>>= 0;
    s ^= (s >> 17);
    s ^= (s << 5); s >>>= 0;
    return s / 4294967296;
  };
}

/* 无放回抽若干个：从池子里取走，不会取到重复项 */
function pickN(list, n, rng) {
  var pool = (list || []).slice();
  var out = [];
  var k = Math.min(n, pool.length);
  for (var i = 0; i < k; i++) {
    var j = Math.floor((rng ? rng() : 0.5) * pool.length);
    if (j >= pool.length) j = pool.length - 1;
    out.push(pool.splice(j, 1)[0]);
  }
  return out;
}

/* 「第几版」：optimize() / randomMix() 每点一次 +1。
   直接调 buildOptimizedPrompt 的脚本不会递增，所以测试保持确定性。 */
var __variantRound = 0;
var __rng = null;

function bumpVariantRound() {
  __variantRound = (__variantRound + 1) % 100000;
  return __variantRound;
}

/* 抽一个 [0, n) 的整数。__rng 为空时退回哈希，保证任何时候都有结果。 */
function rngPick(n) {
  if (!n || n < 1) return 0;
  if (!__rng) return connHash('fallback|' + __connSalt) % n;
  var v = Math.floor(__rng() * n);
  return v >= n ? n - 1 : (v < 0 ? 0 : v);
}

function setConnSalt(s) {
  __connSalt = String(s || '');
  // seed = 输入 + 轮次。同输入同轮次 → 同结果；换一版 → 全变。
  __rng = makeRng(connHash(__connSalt) + __variantRound * 7919);
}""", 1))

# ---- 2. connPick 改用 rng 抽取 ----
PAIRS.append((
    "  return list[connHash(__connSalt + '|' + family + '|' + dim + '|' + key) % list.length];",
    "  return list[rngPick(list.length)];", 1))

# ---- 3. characterOpening 跟着轮次换开句 ----
PAIRS.append((
    """  let h = 0;
  const key = String(name || '');
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 997;
  const mode = h % 4;""",
    """  // 开句模式原来按角色名哈希 —— 同一个角色永远同一种开头。
  // 现在跟着「第几版」走：一次生成内一致，换一版会换开头。
  const mode = rngPick(4);""", 1))

# ---- 4. optimize() 递增轮次 ----
PAIRS.append((
    """  try { await tryLLMInfer(text); } catch (e) {}
  return optimizeBody();""",
    """  try { await tryLLMInfer(text); } catch (e) {}
  // 每点一次「一键优化」= 新的一版：连接词与开句都跟着换。
  // 想回到上一版：历史里还在，点开就是。
  bumpVariantRound();
  const out = optimizeBody();
  if (!window.__llmInfer && typeof inferHint === 'function') {
    try { inferHint('第 ' + __variantRound + ' 版', 1400); } catch (e) {}
  }
  return out;""", 1))

# ---- 5. randomMix 也递增 ----
PAIRS.append((
    """function randomMix() {
  // ===== 模式判定（修复 ISSUE-01：isProp/isScene 未定义导致 ReferenceError）=====""",
    """function randomMix() {
  bumpVariantRound();
  // ===== 模式判定（修复 ISSUE-01：isProp/isScene 未定义导致 ReferenceError）=====""", 1))

# ---- 6. 历史里记下第几版 ----
PAIRS.append((
    """    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),""",
    """    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    round: __variantRound,""", 1))

problems = [(o[:50], src.count(o), w) for o, n, w in PAIRS if src.count(o) != w]
if problems:
    print('✗ 锚点命中次数不符，未做任何修改：')
    for p in problems:
        print(f'   命中 {p[1]}（期望 {p[2]}）：{p[0]}…')
    sys.exit(1)

for old, new, want in PAIRS:
    src = src.replace(old, new)

io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print(f'✓ 已加入可复现随机源，改了 {len(PAIRS)} 处')
