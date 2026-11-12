# -*- coding: utf-8 -*-
"""把开发日志转成 PDF（内部记录用，不是对外交付件）。

用法：
    python build-log-pdf.py

产出：
    _log_external.html           中间产物（可删）
    开发日志-2026-11-09.pdf       内部记录 PDF

和 build-readme-pdf.py 的分工：
    README 那份是**对外**技术说明（会剔除内部路径、部署细节、密钥相关）；
    这份是**内部**开发记录，`_dev/`、`_archive/`、回滚点等内容**保留**——
    它本来就是给接手的人看的。所以两者共用一个转换器（md2pdf.py），
    但清理规则不同，各自管各自的。
"""
import os
import re
import sys

import md2pdf

# 控制台是 GBK 时，中文标点能打，但 ✓ / ✗ 这类符号会抛 UnicodeEncodeError。
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '开发日志-2026-11-09.md')
OUT = os.path.join(HERE, '_log_external.html')
PDF = os.path.join(HERE, '开发日志-2026-11-09.pdf')

md = open(SRC, encoding='utf-8').read()

FRONT = """# PromptLab 开发日志

> 2026-11-09 → 2026-11-11　当前版本 **V5.32**　回归 **49 组全绿**
>
> 记录「做了什么、为什么这么做、结果如何、怎么回滚」。
> 对外交付件是 `PromptLab技术说明.pdf`；这份是内部记录，保留了 `_dev/` 脚本名、
> 回滚点与当时被推翻的判断。

| 项 | 值 |
|---|---|
| 覆盖范围 | 2026-11-09 → 11-11（64 节） |
| 当前版本 | V5.32（`app.js` 的 `APP_VERSION` 是唯一权威值） |
| 回归 | 49 组全通过（其中 2 组需要本地服务） |
| 教训编号 | 到第三十二条 |

---

"""
md = FRONT + md

# 最低限度的发出去之前检查：本机绝对路径、真实密钥值不该出现。
# 注意：日志里**提到** `PL_ACCESS_CODE` / `DEEPSEEK_API_KEY` 这些变量名是正常的
# （它记录的就是密钥外泄那次修复），所以只拦「看起来像真钥匙」的串。
if re.search(r'C:\\Users\\', md):
    print('✗ 检出本机绝对路径（已中止，未生成 PDF）')
    raise SystemExit(2)
if re.search(r'sk-[A-Za-z0-9]{16,}', md):
    print('✗ 检出疑似真实密钥（已中止，未生成 PDF）')
    raise SystemExit(2)
print('OK   无本机绝对路径 / 无真实密钥')

md2pdf.render(md, 'PromptLab 开发日志', OUT, PDF)
