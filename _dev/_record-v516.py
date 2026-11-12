# -*- coding: utf-8 -*-
"""记录 V5.16：Agent 面板改走服务端代理 /api/chat。"""
import io, os

ROOT = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(ROOT)

def rd(n): return io.open(os.path.join(PARENT, n), encoding='utf-8').read()
def wr(n, s): io.open(os.path.join(PARENT, n), 'w', encoding='utf-8', newline='').write(s)

# ---------- app.js 版本号 ----------
s = rd('app.js')
s2 = s.replace("const APP_VERSION = 'V5.15';", "const APP_VERSION = 'V5.16';", 1)
print('  app.js: ' + ('V5.15 -> V5.16' if s2 != s else '!! MISS'))
wr('app.js', s2)

# ---------- 版本记录 ----------
entry = '''## V5.16 — 新增：Agent 面板改走服务端代理（/api/chat）

**日期**：2026-11-11　**类型**：新增

**用户看到的**

「语义检索 + 约束决策」面板每一跳都报：

```
决策失败：未配置 endpoint 或 key（检查 config.local.js）
```

**为什么会这样**

原来 key 是随页面下发的：

```
index.html: <script src="config.local.js">  →  window.LLM_CONFIG = { key: 'sk-...' }
agent-panel.js:20  LLMArbiter.configure(window.LLM_CONFIG)
llm-arbiter.js  →  用这个 key 在浏览器里直接请求 api.deepseek.com
```

也就是说**谁能打开页面，谁就能拿走 key**（`GET /config.local.js` 一次就够）。
V5.14 为了封这个洞，把该文件从静态白名单里挡掉了（404），于是 `window.LLM_CONFIG` 不存在，
arbiter 拿不到 key，整套面板失效。

**而且提示是误导的**：它说「检查 config.local.js」，可那个文件本身是好的，
是故意不让浏览器读。这句话让人去查一个永远查不出问题的地方。

**修法**

1. `serve.py` 新增 `POST /api/chat`：浏览器只发 `messages`，服务端用自己的 key 去调，
   返回 OpenAI 兼容格式（`choices[0].message.content`），前端解析代码一行没改。
   - 只管 OpenAI 兼容字段；`max_tokens` 夹在 64~4000 防滥用；`temperature` 夹在 0~2。
   - 上游失败 / 空回复返回 502 并把原因放进 `error` 字段，界面能直接显示。
   - 和其它 `/api/*` 一样受 `PL_ACCESS_CODE` 保护。
2. `llm-arbiter.js`：有 key（本地联调）就直连；没 key 自动走 `/api/chat`。
3. 把 `config.local.js` 从 index.html 的加载列表里去掉（它必然 404，留着只会在控制台报错）。
4. `agent-panel.js`：没有 `LLM_CONFIG` 改成 info 提示「走服务端代理（正常情况）」，不再是告警。

**验收**（`_dev/verify-chat-proxy.js`，13 项，**用真实 HTTP 打真实服务**，不是 mock）

| 场景 | 断言 |
|---|---|
| 没有 LLM_CONFIG | 请求只发到 `/api/chat`；不含任何 `sk-`；不碰 `deepseek.com`；返回的 JSON 能被正确解析成 intent |
| 有 LLM_CONFIG（联调） | 仍然直连 `api.deepseek.com`，自己带 Authorization |
| 服务端设了访问码 | 代理请求带上 `X-PL-Code`；401 原因能透到界面 |

服务没起时这条检查自动跳过（不算失败），不影响离线回归。

**顺带**：`call_llm` 拆成 `call_llm_msgs`，`/api/infer` 和 `/api/chat` 共用一份用量统计，
`/api/health` 的 `usage` 字段可以对着余额核对成本。

---

'''
led = rd('版本记录.md')
led2 = led.replace('## V5.15 — 修复：第 3 层推理的校验器把连字符当成非法字符',
                   entry + '## V5.15 — 修复：第 3 层推理的校验器把连字符当成非法字符', 1)
led2 = led2.replace(
    '| V5.15 | 2026-11-11 | 修复 | 第 3 层校验器把 `t-shirt` 判成非法 → 整条推理作废（约 1/6 失败率） |',
    '| V5.16 | 2026-11-11 | 新增 | Agent 面板改走服务端代理 `/api/chat`：key 不再进浏览器，面板恢复可用 |\n'
    '| V5.15 | 2026-11-11 | 修复 | 第 3 层校验器把 `t-shirt` 判成非法 → 整条推理作废（约 1/6 失败率） |',
    1)
print('  版本记录: ' + ('已插入 V5.16' if '## V5.16' in led2 else '!! MISS'))
wr('版本记录.md', led2)

# ---------- index.html 缓存戳 ----------
h = rd('index.html')
h2 = h.replace('app.js?v=20261111n', 'app.js?v=20261111p')
print('  index.html: ' + ('已更新' if h2 != h else '!! MISS'))
wr('index.html', h2)

# ---------- README ----------
r = rd('README.md')
r2 = r.replace(
    '| `llm-arbiter.js` | 29.3 KB | LLM 决策 / 反思（目前只在联调页用；`config.local.js` 被拦后不可用） |',
    '| `llm-arbiter.js` | 34.0 KB | LLM 决策 / 反思。没有 key 时自动走服务端 `/api/chat`，key 不进浏览器 |')
r2 = r2.replace(
    '| `serve.py` | 26.7 KB | 静态服务（白名单）+ `/api/embed` + `/api/infer` + `/api/feedback` |',
    '| `serve.py` | 33.4 KB | 静态服务（白名单）+ `/api/embed` + `/api/infer` + `/api/chat` + `/api/feedback` |')
r2 = r2.replace(
    '副作用：浏览器端拿不到 `window.LLM_CONFIG`，`llm-arbiter` 那个联调面板会不可用。\n'
    '主工具的推理走服务端 `/api/infer`，不受影响。要修就得把 key 改成服务端代理（记在 TODO 里）。',
    '副作用（V5.16 已解决）：浏览器端拿不到 `window.LLM_CONFIG`。现在 `llm-arbiter` 在没有 key 时\n'
    '自动走 `POST /api/chat`，key 留在服务端，联调面板照常可用。')
print('  README: ' + ('已更新' if r2 != r else '!! 未匹配'))
wr('README.md', r2)

# ---------- TODO ----------
t = rd('TODO-2026-11-09.md')
t2 = t.replace(
    '| P0 | **key 改成服务端代理**（新增 `POST /api/chat`） | 现在静态白名单挡住了 `config.local.js`，浏览器拿不到 key，`llm-arbiter` 联调面板因此不可用。正确做法是让面板走服务端，key 永不出现在页面里 |',
    '| ✅ | ~~key 改成服务端代理~~ | **V5.16 已做**：`POST /api/chat`，`llm-arbiter` 没 key 时自动走服务端，面板恢复 |')
print('  TODO: ' + ('已更新' if t2 != t else '!! 未匹配'))
wr('TODO-2026-11-09.md', t2)

# ---------- 开发日志 ----------
log = rd('开发日志-2026-11-09.md')
log += '''

### 33. Agent 面板为什么失效，怎么修（V5.16）

用户截了张图：面板里红字「决策失败：未配置 endpoint 或 key（检查 config.local.js）」。

这是我在 V5.14 封 key 时自己留的坑，当时记成 P0「要修但没修」。

**链条**：`config.local.js` 里是明文 key → 原来用 `<script>` 标签下发到浏览器 →
`LLMArbiter.configure` 拿到 key → 浏览器直接请求 api.deepseek.com。
封掉这个文件后 `window.LLM_CONFIG` 不存在，arbiter 就每一跳都失败。

**比功能失效更糟的是提示**：它让用户去「检查 config.local.js」，
可那个文件本身没问题，是故意不让浏览器读。**指向一个永远查不出问题的地方，等于把排查时间骗走。**

**修法**：`POST /api/chat` 服务端代理。浏览器只发 messages，key 留在服务端；
两边都是 OpenAI 兼容格式，`llm-arbiter` 里的解析代码一行没改。
没 key 时自动走代理，有 key（本地联调）仍然直连——两条路都保留。

**测试方式**：`_dev/verify-chat-proxy.js` 用**真实 HTTP 打真实服务**跑真实的 LLM 跳，
不是 mock。同时验证「没有 key → 只发 /api/chat、不含 sk-、不碰 deepseek.com」
和「有 key → 仍然直连并自带 Authorization」。服务没起时自动跳过，不拖红离线回归。

**教训（第四条）**：安全修复会连带打掉依赖它的功能。
改「谁能读到什么」的时候，必须同时找出所有读它的地方——`window.LLM_CONFIG` 只有一个消费者，
但我当时没找，结果用户替我发现了。
'''
wr('开发日志-2026-11-09.md', log)
print('  开发日志: 已追加第 33 节')
print('done')
