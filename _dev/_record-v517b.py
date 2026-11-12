# -*- coding: utf-8 -*-
"""V5.17 同批追加：面板候选加上精确命中优先。"""
import io, os

ROOT = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(ROOT)

def rd(n): return io.open(os.path.join(PARENT, n), encoding='utf-8').read()
def wr(n, s): io.open(os.path.join(PARENT, n), 'w', encoding='utf-8', newline='').write(s)

# ---------- 版本记录：追加到 V5.17 ----------
led = rd('版本记录.md')
anchor = '''**同一个输入现在的输出**

```
一个形状古怪有奇怪花纹的剑，产品特写 — 金属材质，电影侧光洒落，中景构图，
莫兰迪色调，暗调背景，诡异神秘气息，4K高清
```

道具该有的维度（材质 / 展示 / 背景）都在，也不再等 10 秒。'''
add = '''
**同批追加：面板候选加上「精确命中优先」**（同一天、紧邻上一个修复，按规则并入本版，不另开版本）

用户随后截图：面板已经通了（V5.16 有效），但输入「扎纸匠」给出
`角色=工匠 0.509 / 风格=纸雕 0.454 / 氛围=古朴 0.301`，两个还标「猜测」。

可词库里**已经有**「扎纸匠」这个词条（第 3 层推理补进来的）——明明认识，按不认识处理。

- 根因：面板的候选**只来自** `SemanticSearch.searchMulti` 的语义近邻，
  从不检查「用户原话里有没有现成的库名」。主流程有这一步（`matchByEntryName`），面板没有。
- 修法：`agent-panel.js` 加 `withExactHits()`，把输入里出现的库名按最长优先塞到候选最前面，
  `score=1` 并标 `exact`，语义近邻保留在后面（不删，只是降级）。
- 维度名要对齐：面板用 `role / light / atmosphere`，词库用 `character / lighting / atmosphere`，
  中间有一张 `DIM2KW` 映射表，写错就会静默失效。
- 验收：`_dev/verify-panel-exact.js`，13 项——精确命中排第一、带 exact、score=1、
  近邻不删、没有命中时行为完全不变、多命中按最长优先、候选上限 6 个。'''
if anchor in led:
    led = led.replace(anchor, anchor + add, 1)
    print('  版本记录: 已追加到 V5.17')
else:
    print('  !! 版本记录: 没找到锚点')
wr('版本记录.md', led)

# ---------- 开发日志 ----------
log = rd('开发日志-2026-11-09.md')
log += '''

### 35. 面板通了，但「明明认识却当不认识」（并入 V5.17）

V5.16 的代理验证成功了——用户截图显示面板顶部「完成 / 1 次调用 / token 1934/496」，
红色报错没了，说明服务端代理这条路是真的通了。

但结果不对。输入「扎纸匠」：

```
角色   工匠  0.509 · 第2名
风格   纸雕  0.454 · 第5名  猜测
氛围   古朴  0.301 · 第2名  猜测
```

而词库里**已经有「扎纸匠」这个词条**（第 3 层推理补的，缓存里也一直在，
`_dev/infer-cache.json` 的 `character|扎纸匠` → `扎纸匠人`）。

**根因**：面板的候选只来自语义检索，从不看「用户原话里有没有现成的库名」。
主流程有这一步（`matchByEntryName`，命中库名直接采用，语义只做兜底），面板没有——
同一件事两套逻辑，一个认得出来，一个认不出来。

**修法**：`withExactHits()`，输入里出现的库名按最长优先塞到候选最前面（score=1，标 exact），
语义近邻保留在后面。另外踩了一个小坑：面板的维度名是 `role / light`，
词库是 `character / lighting`，得加一张 `DIM2KW` 映射表，写错就静默不生效。

**教训（第七条）**：**同一件事有两套实现，迟早会分叉。**
识别主体这件事，主流程和面板各写了一套，主流程今天修了四五轮，面板一次没跟上。
以后新增「另一条入口」时，第一件事是把判断逻辑抽出来共用，而不是照着写一遍。

**版本处理**：同一天、紧邻上一个修复版、中间没发过新功能，按规则并入 V5.17，
`APP_VERSION` 不变，只改 `index.html` 缓存戳强制刷新。
'''
wr('开发日志-2026-11-09.md', log)
print('  开发日志: 已追加第 35 节')

# ---------- README 文件大小 ----------
r = rd('README.md')
import os as _os
k = round(_os.path.getsize(_os.path.join(PARENT, 'agent-panel.js')) / 1024, 1)
a = '| `agent-panel.js` | 10.8 KB'
if a in r:
    r = r.replace(a, '| `agent-panel.js` | ' + str(k) + ' KB', 1)
    print('  README: agent-panel.js -> ' + str(k) + ' KB')
else:
    print('  !! README: 没找到 agent-panel 那行')
wr('README.md', r)
print('done')
