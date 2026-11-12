# -*- coding: utf-8 -*-
"""把 技术说明.md 转成对外版 PDF（源文件本身不改动）。

为什么读 技术说明.md 而不是 README.md：2026-11-12 起 README.md 只做简介与常见问题
（仓库首页要短），技术细节全部搬到了 技术说明.md。这份 PDF 要的是细节，所以读后者。

用法：
    python build-readme-pdf.py

产出：
    _readme_external.html       中间产物（可删）
    PromptLab技术说明.pdf        对外交付件

清理项：
1. 本机绝对路径（含用户名、桌面目录名）
2. 方言测试输入「你在爪子」
3. 第二人称「你」→ 无人称表述
4. V5.1「路由是必需品」的结论已被后续 A/B 评估推翻 —— 补一段修正说明，避免对外文档自相矛盾
5. 原文一级标题与前置标题重复 → 降为二级

注意：Edge 必须加 --no-pdf-header-footer，否则会打印文件 URL（泄露本机路径）。
"""
import os
import re
import html
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '技术说明.md')
OUT = os.path.join(HERE, '_readme_external.html')
PDF = os.path.join(HERE, 'PromptLab技术说明.pdf')

md = open(SRC, encoding='utf-8').read()

# ---------------- 1. 内容清理 ----------------
REPL = [
    # 本机路径 + 目录名
    ("从 `C:\\Users\\plmht\\Desktop\\软著申请材料\\promptlab\\` 复制而来，已完成重构。",
     "本工作区为 PromptLab 的重构版本：把 1.26 MB 的单文件拆成 5 个模块，"
     "并加入语义检索（向量召回）与 LLM 约束决策层。"),
    # 方言输入 → 中性
    ("| 你好 / 你在爪子 | 0 | `chat` | 不反问（非出图） |",
     "| 你好 / 随便聊聊 | 0 | `chat` | 不反问（非出图） |"),
    ("  你好 / 你在爪子 / 帮我写首诗      → chat    → 不反问",
     "  你好 / 随便聊聊 / 帮我写首诗        → chat    → 不反问"),
    ("  r9 你在爪子 / r10 你好 → chat", "  r9 / r10            → chat"),
    # 第二人称 → 无人称
    ("（你 10 条真实输入里占 1 条）", "（约占真实输入的 1/10）"),
    ("等你用过之后再说", "待实际使用后另行决定"),
    ("**原则：不改 `app.js` 一行。**", "**原则：不改动 `app.js` 一行。**"),
    ("已踩过", "实践中遇到"),
    # 原文一级标题与前置标题重复 → 降为二级
    ("# PromptLab V5 工作区", "## 工作区结构"),
    # 兜底：残留的方言输入与第二人称问句
    ("你想画下面哪一个？", "下面哪一个更接近？"),
    ("你在爪子", "随便聊聊"),
]

for a, b in REPL:
    n = md.count(a)
    print(('OK  ' if n else 'MISS'), n, repr(a[:36]))
    md = md.replace(a, b)

# ---------------- 2.5 去掉「对外版 PDF」这一节 ----------------
# 那一节讲的是怎么生成这份 PDF（Edge 参数、--no-pdf-header-footer 之类），
# 属于内部构建说明，放进对外交付件里不合适。
_m = re.search(r'\n## 对外版 PDF[\s\S]*?\n---\n', md)
if _m:
    md = md[:_m.start()] + '\n---\n' + md[_m.end():]
    print('OK   去掉「对外版 PDF」构建说明')
else:
    print('MISS 未找到「对外版 PDF」小节')


# ---------------- 2.6 对外版剔除：整节删除 + 敏感词拦截 ----------------
# 为什么要有这一节：README 是写给自己的，里面有一半是内部内容
# （密钥怎么放、静态白名单补了哪个漏洞、_dev 脚本清单、回滚点）。
# 这些不能进对外交付件。规则用白名单不好维护，用「整节剔除 + 敏感词拦截」两层。

DROP_SECTIONS = [
    '### 给别人试用（2026-11-11）',   # 部署 / 访问码 / 密钥漏洞
    '## 四份文档的分工',              # 内部文档体系
    '## 备份',                        # _archive 快照与回滚
]

def drop_section(text, head):
    lines = text.split('\n')
    out, skipping, lvl = [], False, len(re.match(r'^#+', head).group(0))
    for ln in lines:
        if not skipping:
            if ln.strip() == head:
                skipping = True
                print('OK   剔除整节：' + head)
                continue
            out.append(ln)
        else:
            m = re.match(r'^(#+)\s', ln)
            if m and len(m.group(1)) <= lvl:
                skipping = False
                out.append(ln)
    return '\n'.join(out)

for h in DROP_SECTIONS:
    if h in md:
        md = drop_section(md, h)
    else:
        print('MISS 未找到节：' + h)

# 逐行敏感词拦截
GUARD = [
    ('sk-',            'API 密钥'),
    ('DEEPSEEK_API_KEY', '密钥环境变量'),
    ('PL_ACCESS_CODE', '访问码机制'),
    ('PL_HOST',        '监听配置'),
    ('config.local.js', '本地配置文件'),
    ('明文',           '敏感描述'),
    ('白名单',         '内部实现'),
    ('_archive',       '内部备份目录'),
    ('_dev/',          '内部工具目录'),
    ('TODO-2026',      '内部待办'),
    ('开发日志-2026',  '内部日志'),
    ('回滚点',         '内部流程'),
    ('C:\\Users\\',    '本机路径'),
    ('.local.js',      '本地配置后缀'),
]

_hits = {}
_kept = []
for ln in md.split('\n'):
    bad = next((r for tok, r in GUARD if tok in ln), None)
    if bad:
        _hits[bad] = _hits.get(bad, 0) + 1
        continue
    _kept.append(ln)
md = '\n'.join(_kept)
if _hits:
    print('OK   敏感词拦截：' + '，'.join('%s×%d' % (k, v) for k, v in sorted(_hits.items())))
else:
    print('OK   敏感词：无命中')

# 表格里被删掉几行后可能出现连续空行/空表，收一下
md = re.sub(r'\n{3,}', '\n\n', md)

# ---------------- 3. 补路由修正说明 ----------------
anchor = "**待优化：** 路由每请求固定增加 0.8–1.7 s。可考虑短输入跳过路由、或对相同输入缓存 route 结果。"
addition = anchor + """

> **后续修正（同日）**：上文「路由是必需品」只是在 3 个用例上得出的结论。
> 随后用 21 条用例做了 A/B 对照（路由开 vs 路由关）：
> 路由让单次决策快 1297 ms，但自身耗时 1914 ms，**端到端净慢 617 ms**，且覆盖率两臂均为 100%。
> 因此**路由已下线**，同样的分流作用改由「决策 prompt 内的非出图规则」承担（见 V5.3）。
> 保留本节，是为了记录一次被数据推翻的假设。"""
if anchor in md:
    md = md.replace(anchor, addition)
    print('OK   补路由修正说明')
else:
    print('MISS 补路由修正说明')

# ---------------- 3. 前置页 ----------------
FRONT = """# PromptLab 技术说明

> 一个纯前端的提示词装配工具：本地词库 + 向量语义检索 + LLM 约束决策。
> 本文记录从 V5.0 到 2026-11-11 的迭代过程、每个决策的数据依据，以及被推翻的假设。

| 版本 | 主题 | 关键结论 |
|---|---|---|
| V5.0 | 单文件拆分 | 1.26 MB / 16270 行 → 5 个模块，行数与括号平衡校验通过 |
| V5.1 | Agent 循环 | 加了路由与反思；**路由后来被 A/B 数据推翻** |
| V5.2 | 第 9 维「主体物」 | 词条 1953 → 2032；修复「画一把剑」无输出 |
| V5.3 | intent 字段 + 反问 | 用意图分类替代「全空即反问」，区分 chat 与 unclear |
| V5.4 | 近似标记 + 候选反问 | 50% 的选中项其实分数很低，必须标出来 |
| V5.5 | 模型生成追问 | 替换掉「拿噪声当建议」的旧反问 |
| V5.6 | 接入主工具 + 一键回归 | 旁路面板，不改 app.js；离线 75 项回归 |
| V5.7 | 修随机拼装矛盾 | 一句话两个主角 / 性别矛盾 / 场景错配 |
| V5.8 | 收口到 buildOptimizedPrompt | 两条出口统一；修 randomMix 换主体 |
| 11-10 | 现代角色 + 限定词归位 | 8 条真实漫剧输入，识别 2/8 → 6/8 |
| 11-11 | 第 3 层 LLM 推理兜底 | 原本被弹窗拦下的 21 条输入 → 21/21 补上 |
| 11-11 | 变体与去模板化 | 面容 272×3、姿态 273×3；连接词 1→5 种，结构同构率 53%→2% |
| 11-11 | 重复与随机 | 动作片段区间去重；可复现随机，每点一次换一版 |
| V5.15 | 推理校验器漏连字符 | `t-shirt` 被判非法 → 整条推理作废（约 1/6 失败率） |
| V5.16 | Agent 面板改走服务端代理 | 密钥不再下发到浏览器，面板恢复可用 |
| V5.17 | 推理触发却无结果 | 「怪」在生物正则里 → 一把剑被当人物；失败零反馈 |
| V5.18 | 晋升机制 | 影子池 + 反馈 → 五道闸门 → 独立一层 `archive-learned.js` |
| V5.19 | 英文侧四个硬伤 | 半截词 / 半截括号 / 中文标点 / 中英混排，全部修掉 |
| V5.20 | 主文件拆分 | 6363 行 → 5 个文件；**只搬函数声明**；12 条样本逐字一致 |
| V5.21 | 并发压测 | 监听队列默认 5 → 512；100 并发 0 失败 |
| V5.22 | 第 6 道闸门「合规」 | 四档：block / ip / review / combo；组合规则单独成类 |
| V5.23 | 输入侧过滤 + 抽检 + 举报 | Trie 0.015ms；抽样 30%；举报「有效 +10 / 无效 −2」 |
| V5.24 | 测试期看板 | 成本标注为估算；LLM 计数分「本次/历史」两个口径 |
| V5.25 | 文档结构检查 | 检查器必须能被「故意造坏样本」证伪 |
| V5.26 | 「浑身是血」被认成吸血鬼 | 23 个含血复合词遮蔽；真吸血鬼仍认得出 |
| V5.27 | 从「复读原话」到「说得更好」 | 用户原话：我要的始终是好用 |
| V5.28 | 连点覆盖 | 防重入 + 三态文案；并确认面板不参与生成 |
| V5.29 | 面板结论接回主流程 | 只补空 / 同句 / 10 分钟 / 分数 ≥ 0.55 |
| V5.30 | 泛称词条盖掉用户描述 | 「概念角色」视为没认出主体 |
| V5.31 | 结构化抽取 | 库外写法进 `raw[]`；代价 +2~4 秒 / 约 ¥0.003 |
| V5.32 | 收尾一批 | 进度文案 / 原话逐字校验 / 场景器材 / 验收体系 49 组 |

---

"""
md = FRONT + md

# ---------------- 4. Markdown → HTML（转换器共用 md2pdf.py）----------------
import md2pdf
_html = md2pdf.write_html(md, 'PromptLab 技术说明', OUT)

# ---------------- 5.5 发出去之前最后校验一次 ----------------
_secret_hits = [t for t in ('sk-', 'DEEPSEEK_API_KEY', 'PL_ACCESS_CODE', 'C:\\Users\\',
                            'config.local.js', '明文')
                if t in _html]
if _secret_hits:
    print('\n✗ 对外版校验失败，检测到：' + '，'.join(_secret_hits))
    print('  已中止，未生成 PDF。请检查 README 或补 DROP_SECTIONS。')
    raise SystemExit(2)
print('OK   对外版校验通过（无密钥 / 无本机路径 / 无内部配置）')

# ---------------- 5. 生成 PDF ----------------
md2pdf.print_pdf(OUT, PDF)
