# -*- coding: utf-8 -*-
"""收尾：把文档里的回归组数从 26 改成 27，并补上 verify-ui-flow.js 的说明。
为什么要用脚本改：PowerShell 里带中文的 -replace 反复出编码问题。"""
import io, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(ROOT)

def edit(name, pairs):
    p = os.path.join(PARENT, name)
    s = io.open(p, encoding='utf-8').read()
    orig = s
    for a, b in pairs:
        if a not in s:
            print(f'  [跳过] {name}: 没找到 {a[:40]!r}')
        s = s.replace(a, b)
    if s != orig:
        io.open(p, 'w', encoding='utf-8', newline='').write(s)
        print(f'  [写入] {name}')

edit('README.md', [
    ('回归：`node _dev/run-all.js` → **26 组全通过**。',
     '回归：`node _dev/run-all.js` → **27 组全通过**。'),
    ('_dev/verify-ui-wiring.js         18 项  getElementById 的 id 必须真存在 + 版本栈逻辑 + 访问码读取',
     '_dev/verify-ui-wiring.js         18 项  getElementById 的 id 必须真存在 + 版本栈逻辑 + 访问码读取\n'
     '_dev/verify-ui-flow.js           29 项  引导/反馈/版本条/状态徽标的点击流程（假 DOM 跑真流程）'),
])

edit('TODO-2026-11-09.md', [
    ('`_dev/verify-ui-wiring.js`、`_dev/run-all.js`（26 组全量回归）',
     '`_dev/verify-ui-wiring.js`、`_dev/verify-ui-flow.js`、`_dev/run-all.js`（27 组全量回归）'),
])

edit('开发日志-2026-11-09.md', [
    ('全量回归         26 组 全通过', '全量回归         27 组 全通过'),
    ('- `_dev/verify-user-place.js`（38 项）/ `_dev/verify-subject-mismatch.js`（15 项）/ `_dev/verify-ui-wiring.js`（18 项）',
     '- `_dev/verify-user-place.js`（38 项）/ `_dev/verify-subject-mismatch.js`（15 项）\n'
     '- `_dev/verify-ui-wiring.js`（18 项，id 接线）/ `_dev/verify-ui-flow.js`（29 项，假 DOM 跑真点击流程）'),
    ('`run-all.js` —— 26 组全量回归', '`run-all.js` —— 27 组全量回归'),
])

print('done')
