# -*- coding: utf-8 -*-
"""HTML → PDF（Edge 无头打印），并做页数/关键文本自检。

用法：
    python build-framework-pdf.py 源.html 输出.pdf [--png 输出目录]

为什么单独一个脚本：架构说明会随版本更新，重新出 PDF 应该是**一条命令**，
而不是每次手敲 Edge 参数（那个 --no-pdf-header-footer 漏一次就泄露本机路径）。
"""
import os
import subprocess
import sys

from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

EDGE_CANDIDATES = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
]

if len(sys.argv) < 3:
    raise SystemExit(__doc__)

SRC = os.path.abspath(sys.argv[1])
OUT = os.path.abspath(sys.argv[2])
PNG_DIR = None
if '--png' in sys.argv:
    i = sys.argv.index('--png')
    if i + 1 < len(sys.argv):
        PNG_DIR = os.path.abspath(sys.argv[i + 1])

if not os.path.exists(SRC):
    raise SystemExit('源文件不存在：' + SRC)

edge = next((p for p in EDGE_CANDIDATES if os.path.exists(p)), None)
if not edge:
    raise SystemExit('找不到 msedge.exe')

if os.path.exists(OUT):
    os.remove(OUT)
subprocess.run([edge, '--headless=new', '--disable-gpu', '--no-sandbox',
                '--no-pdf-header-footer', '--print-to-pdf=' + OUT,
                'file:///' + SRC.replace('\\', '/')],
               check=False, timeout=300)
if not os.path.exists(OUT):
    raise SystemExit('PDF 生成失败')

reader = PdfReader(OUT)
text = ''.join((p.extract_text() or '') for p in reader.pages)
print('已写出:', OUT, round(os.path.getsize(OUT) / 1024, 1), 'KB')
print('页数:', len(reader.pages))
probes = ['架构说明', '总体架构', '生成链路', '模块职责', '关键机制', '边界与已知限制',
          '附录 A', '2060', '512', '50 组']
print('关键内容自检:')
for k in probes:
    print('   %-16s %s' % (k, '✓' if k in text else '✗'))
bad = [t for t in ('C:\\Users', 'sk-', 'config.local.js') if t in text]
print('泄露检查:', '✗ ' + '/'.join(bad) if bad else '✓ 无本机路径 / 无密钥')

if PNG_DIR:
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '_pylibs'))
    import pypdfium2 as pdfium
    os.makedirs(PNG_DIR, exist_ok=True)
    doc = pdfium.PdfDocument(OUT)
    for i in range(len(doc)):
        img = doc[i].render(scale=1.6).to_pil()
        p = os.path.join(PNG_DIR, 'page%02d.png' % (i + 1))
        img.save(p)
        print('   预览', os.path.basename(p), img.size)
