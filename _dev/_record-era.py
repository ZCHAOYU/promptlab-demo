# -*- coding: utf-8 -*-
"""同批追加⑤：场景细节年代闸门 + 文档同步（README 补 archive-learned / promote-learned）"""
import io, os
ROOT = os.path.dirname(os.path.abspath(__file__)); PARENT = os.path.dirname(ROOT)
def rd(n): return io.open(os.path.join(PARENT, n), encoding='utf-8').read()
def wr(n, s): io.open(os.path.join(PARENT, n), 'w', encoding='utf-8', newline='').write(s)

h = rd('index.html'); h2 = h.replace('app.js?v=20261111u', 'app.js?v=20261111v')
print('  index.html: ' + ('ok' if h2 != h else 'MISS')); wr('index.html', h2)

# README：结构表补两行
r = rd('README.md')
a = '| `archive-style-defaults.js` | 57.6 KB |'
line = '| `archive-learned.js` | 1.0 KB | 晋升机制的产物（推理词条过五道闸门后进这里），**生成文件，勿手改** |\n'
if 'archive-learned.js' not in r and a in r:
    idx = r.find(a)
    r = r[:idx] + line + r[idx:]
    print('  README: 已补 archive-learned.js')
else:
    print('  README: archive-learned 已存在或锚点缺失')
wr('README.md', r)

# 版本记录
led = rd('版本记录.md')
anchor = '''- **没改到的**：如果别的维度已经命中了一个风格（比如「废弃的教堂」命中「自然之力」），
  这条规则不覆盖——那是设计如此（不抢已经识别出来的风格），但「自然之力 + 废弃教堂」
  本身也偏，属于还没解决的问题。'''
add = '''
**同批追加：场景细节的年代闸门**（用户「那就开始修复」的第二条）

「赛博朋克城市里的雨夜集市，霓虹灯牌映在积水里」——场景名对（集市），
细节却是**古代集市**：

```
青石板路两侧挤满木棚布篷，竹筐陶罐盛着蔬果干货…窄巷里人声与炊烟交织
```

- 修法：`sceneDetailMuted()`。风格属未来/现代系（赛博/未来/蒸汽/霓虹/科幻/写实…）
  且场景细节含强年代标记（竹筐/陶罐/木棚/炊烟/青石板/灯笼/蓑衣…约 20 个）时，
  **整段细节静音，只保留场景名**。宁可少一句描写，也不写错年代——
  和「地点优先用用户原话」同一个原则：宁缺勿错。
- 修之后：那段「竹筐陶罐」不见了，剩下正常的赛博描述。
- 测试也跟着改了一条：场景名本来就在用户原话里、细节被静音时，
  输出里没有场景名是**对的**（用户自己说了，没丢信息）。'''
if anchor in led:
    led = led.replace(anchor, anchor + add, 1); print('  版本记录: ok')
else: print('  版本记录: MISS')
wr('版本记录.md', led)

log = rd('开发日志-2026-11-09.md')
log += '''

### 41. 场景细节的年代闸门（第 3 条）

「赛博朋克城市里的雨夜集市」——场景名对，细节是古代的：竹筐陶罐、木棚布篷、炊烟。

**修法**：`sceneDetailMuted()`。风格属未来/现代系 + 细节含强年代标记 → 整段细节静音。
宁可少一句描写，也不写错年代。这和「地点优先用用户原话」是同一条原则：**宁缺勿错**。

**顺带改了一条测试**：`verify-user-place.js` 原来断言「场景必须出现在输出里」。
细节被静音、且场景名本来就在用户原话里时，输出里没有场景名是**对的**——
用户自己说了，没有信息丢失。判据没变松，是把「合法的第三种情况」补上了。

**教训（第十二条）**：断言写太窄，会把正确的行为判成 bug。
改测试之前先问：「是这个实现错了，还是我的期望只覆盖了一种情况？」

### 42. 文档同步（用户要求）

- README 结构表补 `archive-learned.js`
- `版本记录.md` V5.18 补「晋升机制」全章 + 同批追加（地点→风格、场景年代闸门）
- `TODO` 里 P0「反馈→晋升机制」标为已完成
- 本次新增的工具：`_dev/promote-learned.js`（五道闸门 + `--write/--min-up/--only/--out`）
'''
wr('开发日志-2026-11-09.md', log)
print('  开发日志: ok')
print('done')
