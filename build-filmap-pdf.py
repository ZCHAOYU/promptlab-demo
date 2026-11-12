# -*- coding: utf-8 -*-
"""生成《文件地图（框架）》PDF —— 按仓库实际文件扫描，不手写清单。

用法：
    python build-filmap-pdf.py

产出：
    工具文件地图_V5.32.html / .pdf

为什么用脚本而不是手写：文件和行数天天变，手写的树一定会过期
（README 里那份旧树就还写着 13 个依赖文件、test-arbiter 路由 ⓪ —— 都已经不存在了）。
"""
import io
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = HERE            # 本脚本就放在项目目录里，扫描的就是它自己所在的目录
OUT_HTML = os.path.join(HERE, '工具文件地图_V5.32.html')
OUT_PDF = os.path.join(HERE, '工具文件地图_V5.32.pdf')
EDGE = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
]


def stat(name):
    p = os.path.join(ROOT, name)
    if not os.path.exists(p):
        return {'kb': '-', 'lines': '-', 'exists': False}
    if os.path.isdir(p):
        total = 0
        for base, _dirs, files in os.walk(p):
            for fn in files:
                try:
                    total += os.path.getsize(os.path.join(base, fn))
                except OSError:
                    pass
        return {'kb': round(total / 1024), 'lines': '-', 'exists': True}
    kb = round(os.path.getsize(p) / 1024)
    lines = '-'
    if name.endswith(('.js', '.py', '.html', '.css', '.md', '.json', '.bat', '.ps1', '.jsonl')):
        try:
            with open(p, encoding='utf-8', errors='ignore') as f:
                lines = sum(1 for _ in f)
        except Exception:
            pass
    return {'kb': kb, 'lines': lines, 'exists': True}


# (文件, 作用, 标记)   标记: '' 普通 / 'gen' 生成物 / 'local' 本地配置
GROUPS = [
    ('入口与页面', [
        ('index.html', '页面骨架；<b>唯一的脚本加载顺序来源</b>（测试也从这里读清单）', ''),
        ('styles.css', '全部样式（含 CSS 绘制的 logo，页面不加载 logo.png）', ''),
        ('logo.png', '原始 logo 图（456 KB）。<b>页面不使用</b>，仅作图源保留', ''),
        ('review.html', '人工评分页：输出基线 / 档案抽检，结果导出 JSON（开发期用）', ''),
        ('test-arbiter.html', '约束决策联调页（对照开关，开发期用）', ''),
        ('test-semantic.html', '单维语义检索调试页（开发期用）', ''),
    ]),
    ('应用五层（主流程自上而下依赖）', [
        ('app.js', '主流程 + 顶层状态 + 第 3 层编排 + 面板结论回填 + 初始化', ''),
        ('app-detect.js', '检测层：字面直匹 → 概念映射 → 地点/年代规则 → 用户地点优先', ''),
        ('app-fill.js', '补全层：风格默认值（候选集）、场景协调、维度上限、随机混搭', ''),
        ('app-assemble.js', '拼装层：模板与连接词、三段式、去重、场景/道具清洗', ''),
        ('app-ui.js', '界面层：渲染、历史、版本条、服务状态徽标、反馈与引导', ''),
    ]),
    ('词库与引擎（数据 + 纯计算）', [
        ('data-kwdb.js', '关键词库结构：英文侧 + 触发词 + 维度映射', ''),
        ('translations.js', '中文词条正文（角色 / 风格 / 场景 …）', ''),
        ('smart-engine.js', '打分、模板匹配、推理链（不碰 DOM）', ''),
    ]),
    ('数据补丁层（叠加在词库之上）', [
        ('archive-detail.js', '档案描述补丁：给词条补一段可直接拼的描写', ''),
        ('archive-slots.js', '档案字段拆分：服饰 / 体貌 / 随身物 / 抽象属性', ''),
        ('archive-fix.js', '手工修正：叠词、服饰污染、场景错配', ''),
        ('archive-variants.js', '角色姿态变体（273 × 3）', 'gen'),
        ('archive-faces.js', '角色面容变体（272 × 3）', 'gen'),
        ('archive-style-defaults.js', '风格 → 光/色/氛围/场景 候选（320 × 3 维 × 3）', 'gen'),
        ('archive-learned.js', '晋升机制的产物：推理词条过闸门后进这里', 'gen'),
        ('guard-data.js', '输入侧合规判据（由同一份 JSON 生成，前后端同源）', 'gen'),
    ]),
    ('语义与决策（可选增强，缺了照常出图）', [
        ('semantic-search.js', '前端向量检索；服务不可用时回落到浏览器内 wasm', ''),
        ('llm-arbiter.js', '约束决策与反思；无密钥时自动走服务端代理', ''),
        ('agent-panel.js', '语义面板（旁路，不影响主流程）', ''),
    ]),
    ('数据与索引', [
        ('entries.json', '词条库：2060 条 / 13 类（中英双语）', ''),
        ('vectors.bin', '向量索引：2060 × 512 · float32（bge-small-zh-v1.5，已归一化）', ''),
        ('vectors.meta.json', '索引元信息：count / dim / model / 构建时间', ''),
        ('models/', '本地向量模型（量化 ONNX，约 23 MB）', ''),
        ('subject-vocab.json', '主体物词表（第 9 维的候选来源）', ''),
    ]),
    ('服务与启动', [
        ('serve.py', '静态白名单 + <code>/api/embed</code> + <code>/api/infer</code> + <code>/api/parse</code> + <code>/api/chat</code> + 合规与用量', ''),
        ('start.bat', '一键启动：找 Python（优先自带运行时）→ 起服务 → 开浏览器', ''),
        ('start-lan.bat', '局域网模式：要求设访问码，再调用 start.bat', ''),
        ('requirements.txt', '服务端三个依赖：numpy / onnxruntime / tokenizers', ''),
        ('config.local.example.js', '本地配置模板（填模型密钥用）', ''),
        ('config.local.js', '本机实际配置（<b>含密钥，绝不进仓库、绝不进包</b>）', 'local'),
    ]),
    ('构建与文档', [
        ('precompute.py', '改词条后重算 vectors.bin（必跑）', ''),
        ('extract_entries.js', '重建 entries.json', ''),
        ('build-subject-vocab.js', '生成主体物词表', ''),
        ('_gen_faces_js.py', '体检 + 生成 archive-faces.js（<code>--write</code> 才写）', ''),
        ('md2pdf.py', 'Markdown → HTML → PDF 的<b>唯一</b>转换器（两份 PDF 共用）', ''),
        ('build-readme-pdf.py', '对外技术说明 PDF（会剔内部路径与部署细节）', ''),
        ('build-log-pdf.py', '内部开发日志 PDF（保留脚本名与回滚点）', ''),
        ('README.md', '现状：怎么跑 / 结构 / 交付件 / 历史记录', ''),
        ('版本记录.md', 'V5.9~V5.32 逐版记录（V5.1~V5.8 在 README）', ''),
        ('开发日志-2026-11-09.md', '为什么这么改、踩了什么坑、教训 1~38', ''),
        ('交接.md', '给下一个会话的一页纸（只留指针）', ''),
        ('TODO-2026-11-09.md', '待办与明确不做的项', ''),
        ('体验指南.md', '给试用的人看（不用懂技术）', ''),
        ('安装与启动.md', '部署三步：解压 / 双击 / 填不填 key', ''),
    ]),
]

DEV_CATS = [
    ('verify-*', 41, '验收脚本：改完一处功能就跑它，断言失败即红'),
    ('audit-*', 12, '体检：词条可识别性、输出重复、模板感、串味、真实输入'),
    ('gen-*', 7, '生成器：变体、风格映射、候选集（写文件前有比对闸门）'),
    ('test-*', 9, '端到端：真实点击路径、面板、第 3 层'),
    ('smoke-*', 3, '冒烟：三模式 × 三深度、optimize、randomMix'),
    ('check-*', 4, '一致性：确定性、两套实现对齐'),
    ('probe-*/diag-*/peek-*/sample-*', 22, '诊断：批量找问题输入、人工过目样本'),
    ('load-scripts.js 等', '-', '统一加载器：清单只从 index.html 读'),
    ('_ 开头（生成/录制/临时）', 35, '一次性脚本与记录工具，不参与回归'),
]

DEV_KEY = [
    ('run-all.js', '全量回归 50 组（离线 47 + 服务端 3；服务端未起会大声跳过）'),
    ('load-scripts.js', '所有测试的加载器：按 index.html 顺序执行脚本'),
    ('verify-scene-chain.js', '场景链路：24 个地点 / 家具不进随身物 / 锚点保留'),
    ('verify-scene-props.js', '场景道具与工作场所器材（10 项）'),
    ('audit-reality-wide.js', '48 条真实输入体检（有问题非 0 退出）'),
    ('audit-mappings.js', '2060 条词条喂给自己的检测器（未识别 0 / 错配 0）'),
    ('dump-out.js', '直接看某句输入的完整输出'),
    ('build-dist.js', '打包：标准版 / 便携版（含清单自检与密钥扫描）'),
    ('verify-dist.js', '包验收：引用齐全 + 能加载 + 能生成'),
]


def table(rows, head=('文件', '作用'), with_stat=True, cls=''):
    """长表要允许跨页，否则整张表被顶到下一页、留半页空白。"""
    split = len(rows) > 6
    h = '<table class="%s%s"><thead><tr>' % (cls, ' split' if split else '')
    if with_stat:
        h += '<th style="width:30%%">%s</th><th style="width:8%%">行数</th><th style="width:7%%">大小</th><th>%s</th>' % (head[0], head[1])
    else:
        h += '<th style="width:30%%">%s</th><th>%s</th>' % (head[0], head[1])
    h += '</tr></thead><tbody>'
    for row in rows:
        name, desc = row[0], row[1]
        mark = row[2] if len(row) > 2 else ''
        s = stat(name.rstrip('/'))
        tag = ''
        if mark == 'gen':
            tag = ' <span class="tag gen">生成物</span>'
        elif mark == 'local':
            tag = ' <span class="tag local">不进包</span>'
        if with_stat:
            h += '<tr><td><code>%s</code>%s</td><td class="num">%s</td><td class="num">%s</td><td>%s</td></tr>' % (
                name, tag, s['lines'], (str(s['kb']) + 'K') if s['kb'] != '-' else '-', desc)
        else:
            h += '<tr><td><code>%s</code>%s</td><td>%s</td></tr>' % (name, tag, desc)
    h += '</tbody></table>'
    return h


# 页面依赖（按 index.html 实际顺序）
ORDER = ['styles.css', 'translations.js', 'smart-engine.js', 'data-kwdb.js',
         'archive-detail.js', 'archive-slots.js', 'archive-fix.js', 'archive-variants.js',
         'archive-faces.js', 'archive-style-defaults.js', 'archive-learned.js', 'guard-data.js',
         'app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js',
         'config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js']
ROLE = {
    'styles.css': '全部样式', 'translations.js': '中文词条', 'smart-engine.js': '打分与推理链',
    'data-kwdb.js': '关键词库结构', 'archive-detail.js': '档案描述补丁', 'archive-slots.js': '档案字段拆分',
    'archive-fix.js': '手工修正', 'archive-variants.js': '姿态变体（生成物）',
    'archive-faces.js': '面容变体（生成物）', 'archive-style-defaults.js': '风格默认值（生成物）',
    'archive-learned.js': '晋升词条（生成物）', 'guard-data.js': '合规判据（生成物）',
    'app-detect.js': '检测层', 'app-fill.js': '补全层', 'app-assemble.js': '拼装层',
    'app-ui.js': '界面层', 'app.js': '主流程',
    'config.local.js': '本机配置：<b>故意不随包分发</b>，缺失时自动走服务端代理',
    'semantic-search.js': '前端向量检索', 'llm-arbiter.js': '约束决策与反思',
    'agent-panel.js': '语义面板（旁路）',
}
order_rows = []
for i, f in enumerate(ORDER):
    order_rows.append((f, ROLE.get(f, ''), 'local' if f == 'config.local.js' else ''))

dev_cat_rows = [('%s <span class="small">%s 个</span>' % (c, n), d) for c, n, d in DEV_CATS]
dev_key_rows = [(f, d, '') for f, d in DEV_KEY]

n_files = len([f for f in os.listdir(ROOT) if os.path.isfile(os.path.join(ROOT, f))])
n_dev = len([f for f in os.listdir(os.path.join(ROOT, '_dev')) if f.endswith(('.js', '.py'))])

TPL = os.path.join(HERE, '_filmap_template.html')
if not os.path.exists(TPL):
    raise SystemExit('缺少模板文件：' + TPL)
HTML = io.open(TPL, encoding='utf-8').read()

REPL = {
    '{{N_FILES}}': str(n_files),
    '{{N_DEV}}': str(n_dev),
    '{{T_ENTRY}}': table([(f, d, m) for f, d, m in GROUPS[0][1]]),
    '{{T_ORDER}}': table(order_rows),
    '{{T_LAYERS}}': table([(f, d, m) for f, d, m in GROUPS[1][1]]),
    '{{T_ENGINE}}': table([(f, d, m) for f, d, m in GROUPS[2][1]]),
    '{{T_ARCHIVE}}': table([(f, d, m) for f, d, m in GROUPS[3][1]]),
    '{{T_SEM}}': table([(f, d, m) for f, d, m in GROUPS[4][1]]),
    '{{T_DATA}}': table([(f, d, m) for f, d, m in GROUPS[5][1]]),
    '{{T_SRV}}': table([(f, d, m) for f, d, m in GROUPS[6][1]]),
    '{{T_BUILD}}': table([(f, d, m) for f, d, m in GROUPS[7][1]]),
    '{{T_DEVCAT}}': table(dev_cat_rows, head=('类别', '说明'), with_stat=False),
    '{{T_DEVKEY}}': table(dev_key_rows, head=('脚本', '作用'), with_stat=False),
}
for k, v in REPL.items():
    HTML = HTML.replace(k, v)

left = [k for k in REPL if k in HTML]
if left:
    raise SystemExit('有占位符没替换：' + ', '.join(left))

io.open(OUT_HTML, 'w', encoding='utf-8', newline='\n').write(HTML)
print('已写出 HTML:', OUT_HTML, len(HTML), 'chars')

edge = next((p for p in EDGE if os.path.exists(p)), None)
if not edge:
    raise SystemExit('找不到 msedge.exe')
if os.path.exists(OUT_PDF):
    os.remove(OUT_PDF)
subprocess.run([edge, '--headless=new', '--disable-gpu', '--no-sandbox',
                '--no-pdf-header-footer', '--print-to-pdf=' + OUT_PDF,
                'file:///' + OUT_HTML.replace('\\', '/')], check=False, timeout=300)
print('已写出 PDF:', OUT_PDF, round(os.path.getsize(OUT_PDF) / 1024, 1), 'KB')
