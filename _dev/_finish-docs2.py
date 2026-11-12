# -*- coding: utf-8 -*-
"""收尾 2：把大样本体检（48 条）和另外 4 个同类缺陷写进文档。"""
import io, os

ROOT = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(ROOT)

def edit(name, pairs):
    p = os.path.join(PARENT, name)
    s = io.open(p, encoding='utf-8').read()
    orig = s
    for a, b in pairs:
        if a not in s:
            print(f'  [MISS] {name}: {a[:40]!r}')
        s = s.replace(a, b)
    if s != orig:
        io.open(p, 'w', encoding='utf-8', newline='').write(s)
        print(f'  [OK]   {name}')

edit('README.md', [
    ('回归：`node _dev/run-all.js` → **27 组全通过**。',
     '大样本体检（`_dev/audit-reality-wide.js`，48 条覆盖人物 / 场景 / 道具 / 口语 / 长句 / 抽象边界）：\n'
     '**0 条机械可检出问题**。它同时当回归门用——有问题就退出码非 0。\n\n'
     '回归：`node _dev/run-all.js` → **28 组全通过**。'),
    ('新增的验收脚本（都进了 `_dev/run-all.js`，全量共 27 组）：',
     '扩样本时又抓到 4 个同类缺陷（都已修）：\n\n'
     '| 输入 | 修之前 | 修之后 |\n'
     '|---|---|---|\n'
     '| 「一位少女…手里拿着一把黑色的伞」 | 被「一把」判成**道具**，输出成了「布料材质 / 虚空吞噬质感 / 手持展示」 | 人物优先于量词 |\n'
     '| 「女高中生放学回家」 | 主体认成**「回家」**（人物后缀里的「家」），输出「回家，女高中生放学。」 | 去掉「家/手/后/主」四个泛后缀，补「高中生/大学生/老板/总裁/程序员…」 |\n'
     '| 「老板发火」 | 「火」被当成火光 → 烛火光 + 蒸汽朋克 + 蒸汽都市（发脾气的人被放进锅炉房） | 「发火/上火/走火」当复合词遮蔽 |\n'
     '| 「老年的渔夫…坐在乌篷船头」 | 场景给「街角咖啡馆」 | 补「船头/船上/甲板/帐篷/渡口/站台」等地点词，认用户写的 |\n\n'
     '新增的验收脚本（都进了 `_dev/run-all.js`，全量共 28 组）：'),
    ('_dev/verify-subject-mismatch.js  15 项  单字不穿透、本来对的不能误伤、兜底不发明职业',
     '_dev/verify-subject-mismatch.js  25 项  单字不穿透、量词不抢人物、泛后缀不吃动词、兜底不发明职业'),
    ('_dev/audit-reality-wide.js', '_dev/audit-reality-wide.js'),
])

edit('TODO-2026-11-09.md', [
    ('| ⑨ | 每次点出来是新的一版，但看不见也退不回 | 只在 toast 闪一下 | 常显「第 N 版」+ 换一版 / 回到上一版 |',
     '| ⑨ | 每次点出来是新的一版，但看不见也退不回 | 只在 toast 闪一下 | 常显「第 N 版」+ 换一版 / 回到上一版 |\n'
     '| ⑩ | 扩样本后又抓到 4 个同类缺陷 | 见下 | 已修（量词抢人物 / 泛后缀吃动词 / 「发火」当火光 / 船头不算地点） |'),
    ('`_dev/verify-ui-wiring.js`、`_dev/verify-ui-flow.js`、`_dev/run-all.js`（27 组全量回归）',
     '`_dev/verify-ui-wiring.js`、`_dev/verify-ui-flow.js`、`_dev/audit-reality-wide.js`、\n'
     '`_dev/run-all.js`（28 组全量回归）'),
])

edit('开发日志-2026-11-09.md', [
    ('全量回归         27 组 全通过', '全量回归         28 组 全通过'),
    ('- `_dev/run-all.js` —— 27 组全量回归', '- `_dev/run-all.js` —— 28 组全量回归'),
])

print('done')
