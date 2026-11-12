#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""README 同步：
1. 把过期的「文件地图」整段换掉（旧版少了 6 个文件、词条数还是 2032、依赖还是 9 个）
2. 在 V5.7 之前插入 11-10 ~ 11-11 的变更摘要
3. 顶部加一份「三份文档的分工」已经由上一步完成
用标记定位，不靠行号。"""
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'README.md')

src = io.open(PATH, encoding='utf-8').read()

if '## 文件地图' not in src:
    print('✗ 找不到「## 文件地图」，停止')
    sys.exit(1)
if '2026-11-10 ~ 11-11 变更' in src:
    print('变更摘要已存在，跳过')
    sys.exit(0)

start = src.index('## 文件地图')
end = src.index('## V5.7 — 修随机拼装的三处矛盾')
old_len = end - start

NEW_MAP = '''## 文件地图

```
promptlab/
├─ index.html            ← 主工具（必须走 http://127.0.0.1:8777/index.html）
├─ review.html           ← 人工评分页（输出基线 / 档案抽检，结果导出 JSON）
├─ test-arbiter.html     ← 联调页：⓪路由 ①检索 ②决策 ③反思，两个开关可对照
├─ test-semantic.html    ← 单维检索调试页
│
├─ 【页面依赖】index.html 直接加载的 13 个文件
│   styles.css  logo.png
│   translations.js  smart-engine.js  data-kwdb.js
│   archive-detail.js  archive-slots.js  archive-fix.js
│   archive-variants.js  archive-faces.js
│   app.js  config.local.js  semantic-search.js  llm-arbiter.js  agent-panel.js
│
├─ 【数据】页面与脚本共用
│   entries.json        2060 条词条
│   vectors.bin         float32 2060×512（4.02 MB）
│   vectors.meta.json
│
├─ 【服务 / 构建】
│   serve.py            静态服务 + POST /api/embed（向量）+ POST /api/infer（第 3 层 LLM）
│   precompute.py       重算 vectors.bin（改词条后必跑）
│   extract_entries.js  重建 entries.json
│   _gen_faces_js.py    体检 + 生成 archive-faces.js（--write 才写）
│   build-readme-pdf.py 生成对外 PDF
│
├─ 【测试与审计】_dev/ 下 84 个脚本，常用的这些
│   ── 回归 ──
│   load-scripts.js             统一「按 index.html 顺序加载」（所有测试都走它）
│   smoke-all-modes.js          三模式 × 三深度 30 组
│   smoke-optimize.js           真实点击路径 optimize()
│   smoke-randommix.js          真实点击路径 randomMix()
│   verify-subject-guard.js     「没认出主体」弹窗守卫
│   verify-rollback.js          任意 _archive 快照可用性
│   ── 数据质量 ──
│   audit-mappings.js           2060 条词条可识别性（0% 错配门槛）
│   audit-coverage.js           姿势 / 面容 / 档案三张表按角色对覆盖率
│   audit-face-contamination.js 8 个领域簇的「串味」检测
│   audit-repeat.js             输出内 ≥5 字子串重复扫描
│   audit-templating.js         模板感度量（开句分布 / 说法种类 / 结构同构率）
│   ── 生成与验证 ──
│   gen-variants.js / gen-variants-js.js   姿态变体生成与合并（带线上比对闸门）
│   gen-faces.js                           面容变体生成
│   verify-faces.js / verify-variants.js   三情境必须互不相同
│   verify-variation.js                    连点 8 次各不相同 + 回到某一版复现
│   verify-pose-extract.js                 动作片段：不重叠 / 不截断 / 不重复
│   test-layer3.js / test-infer.py         第 3 层 LLM 兜底端到端
│   probe-oov.js                           批量找「会弹窗」的输入
│   ── 诊断 ──
│   find-connectives.js   列出所有写死的连接词拼接点
│   sample-tail.js        只看句尾，人工过目说法是否读得通
│   sample-faces.js       随机抽样面容变体人工过目
│   peek-variants.js      看某个角色存了什么（判断是数据问题还是代码问题）
│   check-determinism.js  同一输入连跑 5 次，看变不变
│   doc-stats.js          量真实数字（写文档前先跑它）
│
└─ _archive/             每一步的快照，随时可删
    index.orig.html（1.26 MB 原始单文件）
    app.before-XXX.js / app.with-XXX.js（每步改动前后各一份）
    entries.before-subject.json  vectors.before-subject.bin
    _readme_external.html（对外 PDF 的中间产物）
```

---

# 2026-11-10 ~ 11-11 变更

> 详细过程、踩的坑、回滚点见 `开发日志-2026-11-09.md` 第七节之后。

## 一、输出质量

| 项 | 问题 | 结果 |
|---|---|---|
| 现代角色缺失 | 「霸总」「女帝」「白月光」这类词完全识别不到 | 补 17 个现代角色 |
| 限定词丢失 | 「一位白山剑客」的「白山」被吞 | 连续区间抽取 + 三级插入位置 |
| 开头千篇一律 | 提示词都以「一位 / 一个」起头 | `characterOpening` 分 4 种开头（全库分布 22 / 23 / 26 / 29%） |
| 同一角色永远同一张脸 | 档案里只有一个 `face` 字段 | 生成 272 角色 × 3 档面容变体 |
| 同一角色永远同一套动作 | 档案里只有一个 `pose` 字段 | 补到 273 角色 × 3 档姿态变体 |
| 句尾连接词全一样 | 实测「映照」「色调」「氛围」出现率 100% | 连接词变体表，各维度 1 种 → 3~5 种 |
| 局部重复 | 「抱着玩偶坐在空荡的房，坐在空荡的房间里」 | 动作片段改区间去重 + 出口去重 |
| 同一输入永远同一输出 | 连点两次拿到一模一样的结果 | 可复现随机源 + 每点一次换一版 |

## 二、识别能力：第 3 层 LLM 推理兜底

前两层（词条名直匹 / 上下文映射 / 语义检索）都认不出主体时，原来只会弹「没认出主体」。
现在先问模型：

```
POST /api/infer {text, mode}
```

- 密钥只在服务端（`serve.py` 正则读 `config.local.js`），不进页面
- 过 9 道校验闸门才返回：`known` 必须 true、`subject` 必须是输入原词、
  字段不许以数量词开头、命中禁用词整条作废、置信度 < 0.60 直接拒
- 通过后**写成一条运行时词条塞进 `KW_DB`**，后面的档案 / 拆字段 / 变体全都不用改
- 结果落盘成 `_dev/infer-cache.json`（现在的影子词条池）

实测：45 条真实输入里原本 21 条被弹窗拦下，接入后 **21/21 补上**；
「你好」这类仍然弹窗，1 ms 返回，不发请求。

## 三、去模板化的边界

这是**查表拼装**工具，不是生成模型。所以「去模板化」只能是
「让模板的每一格都有足够多的真实选项」，不能是「没有模板」。

| 层 | 状态 |
|---|---|
| 语法骨架（主体→面容→姿态→服饰→场景→风格/光/构图/色调/氛围/画质） | **没动**，是产品形态 |
| 开句（4 种，随轮次变） | 做了 |
| 说法（6 个维度的连接词，随轮次变） | 做了，结构同构率 53% → 2% |
| 内容（姿态 / 面容 / 档案，273×3） | 做了 |
| **维度取值**（同一输入永远同一套光 / 色 / 氛围） | **没做**：需要 320 风格 × 5 维的兼容候选集，是数据工程 |

「换一版」目前只换说法、不换内容：19 个分句里 15 个逐字相同。
要让内容也变，得先有兼容集，否则会出「古风剑客配霓虹光」这种矛盾
（这类矛盾前面花了两轮才压到 0）。

## 四、工具与流程

- `_dev/load-scripts.js`：加载清单只从 `index.html` 读，测试不可能再看漏文件
- 生成器加了三道闸门：**预先校验命中次数**（不符就整体中止，不做半截替换）、
  **写文件前和线上逐条比对**（`gen-variants-js.js`）、**质检后再落盘**（套话 / 重复 / 长度）
- 审计脚本能同口径对比改前改后：`audit-templating.js --app <旧版本>`
- 踩过的共同坑：**推理模型 `max_tokens` 给少了会把预算全花在思考上**，
  `finish_reason=length` 且 `content` 为空。改成预算递增 `[3000, 6000, 10000]`

---

'''

src = src[:start] + NEW_MAP + src[end:]
io.open(PATH, 'w', encoding='utf-8', newline='\n').write(src)
print(f'✓ 文件地图已替换（原 {old_len} 字符），并插入变更摘要')
