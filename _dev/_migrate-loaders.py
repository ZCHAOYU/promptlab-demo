#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把各测试脚本里写死的加载清单换成「从 index.html 读」。
一次性维护脚本，跑完可以留着当参考。"""
import io
import re

OFFLINE = "['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']"
SEMANTIC = "['config.local.js', 'llm-arbiter.js', 'agent-panel.js']"

TARGETS = {
    'test-hot.js': OFFLINE,
    'test-manju.js': OFFLINE,
    'test-layer3.js': OFFLINE,
    'verify-variants.js': OFFLINE,
    'verify-semantic-layer.js': SEMANTIC,
}

PAT = re.compile(
    r"for \(const f of \[[^\]]*\]\) \{\r?\n"
    r"\s*vm\.runInContext\(fs\.readFileSync\(path\.join\(ROOT, f\), 'utf8'\), ctx, \{ filename: f \}\);\r?\n"
    r"\}",
    re.S)

for name, skip in TARGETS.items():
    src = io.open(name, encoding='utf-8').read()
    repl = ("const { loadApp } = require('./load-scripts');\n"
            "// 加载清单统一来自 index.html，不再各自写死（否则新增脚本测试看不见）\n"
            "loadApp(ctx, { skip: " + skip + " });")
    new, n = PAT.subn(repl, src)
    if n != 1:
        print(f'{name}: 未匹配（{n} 次），跳过')
        continue
    io.open(name, 'w', encoding='utf-8', newline='\n').write(new)
    print(f'{name}: 已改')
