# -*- coding: utf-8 -*-
"""Markdown → HTML → PDF 的共用转换器。

为什么单独一个文件：
    README 和开发日志都要出 PDF。第一版是各自写一份转换逻辑，
    但这个项目已经栽过两次「同一套逻辑写两处 → 必然分叉」（见版本记录 V5.20/V5.32）。
    所以转换器只留一份，两个入口（build-readme-pdf.py / build-log-pdf.py）都调它。

用法：
    import md2pdf
    md2pdf.render(md_text, '标题', html_path, pdf_path)

注意：调用 Edge 必须带 --no-pdf-header-footer，否则页脚会打印 file:///C:/...
（本机路径泄露），这个坑踩过一次。
"""
import html
import os
import re
import subprocess

EDGE_CANDIDATES = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
]

CSS = """
@page { size: A4; margin: 18mm 16mm 16mm 16mm; }
* { box-sizing: border-box; }
body {
  font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
  font-size: 10.4pt; line-height: 1.62; color: #1a1a1a; margin: 0;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
h1 { font-size: 21pt; margin: 0 0 8pt; letter-spacing: .5pt; }
h2 {
  font-size: 14pt; margin: 22pt 0 8pt; padding-left: 8pt;
  border-left: 4px solid #1f3b57; color: #1f3b57;
  break-after: avoid; page-break-after: avoid;
}
h3 { font-size: 11.4pt; margin: 14pt 0 5pt; color: #16293b;
     break-after: avoid; page-break-after: avoid; }
p { margin: 0 0 6pt; }
strong { color: #0d1b26; }
ul, ol { margin: 4pt 0 8pt; padding-left: 18pt; }
li { margin-bottom: 3pt; }
code {
  font-family: Consolas, "Cascadia Mono", monospace; font-size: 9.2pt;
  background: #f2f4f7; padding: 1pt 3.5pt; border-radius: 3px; color: #1b3a52;
}
pre {
  font-family: Consolas, "Cascadia Mono", monospace; font-size: 8.8pt; line-height: 1.5;
  background: #f7f8fa; border: 1px solid #e2e6ec; border-radius: 5px;
  padding: 8pt 10pt; margin: 6pt 0 10pt; white-space: pre-wrap; word-break: break-all;
  break-inside: avoid; page-break-inside: avoid;
}
pre code { background: none; padding: 0; }
blockquote {
  margin: 8pt 0; padding: 7pt 11pt; background: #fbf7ef;
  border-left: 3px solid #d99a44; color: #4a3a22;
}
blockquote p { margin: 0 0 3pt; }
blockquote p:last-child { margin-bottom: 0; }
table {
  width: 100%; border-collapse: collapse; margin: 7pt 0 11pt;
  font-size: 9.3pt; break-inside: avoid; page-break-inside: avoid;
}
th, td { border: 1px solid #d5dbe3; padding: 5pt 7pt; text-align: left; vertical-align: top; }
th { background: #edf1f6; color: #16324a; font-weight: 700; }
tr:nth-child(even) td { background: #fafbfc; }
hr { border: none; border-top: 1px solid #d5dbe3; margin: 16pt 0; }
a { color: #1f5f8b; text-decoration: none; }
"""

HTML_TMPL = """<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<title>%s</title>
<style>%s</style></head><body>
%s
</body></html>"""

SPECIAL = re.compile(r'^(#{1,4}\s|\s*[-*]\s|\s*\d+\.\s|>|\||```)')


def inline(t):
    t = re.sub(r'`([^`]+)`', lambda m: '<code>' + html.escape(m.group(1), quote=False) + '</code>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', lambda m: '<strong>' + m.group(1) + '</strong>', t)
    return t


def cells(row):
    return [c.strip() for c in row.strip().strip('|').split('|')]


def render_table(rows):
    head = cells(rows[0])
    body = [cells(r) for r in rows[2:]]
    h = ['<table><thead><tr>']
    h += ['<th>' + inline(c) + '</th>' for c in head]
    h.append('</tr></thead><tbody>')
    for r in body:
        h.append('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in r) + '</tr>')
    h.append('</tbody></table>')
    return ''.join(h)


def md_to_html(text):
    lines = text.split('\n')
    out, i, n = [], 0, len(lines)
    while i < n:
        s = lines[i].rstrip()
        if not s.strip():
            i += 1
            continue
        if s.strip().startswith('```'):
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith('```'):
                buf.append(lines[i]); i += 1
            i += 1
            out.append('<pre>' + html.escape('\n'.join(buf), quote=False) + '</pre>')
            continue
        if re.match(r'^-{3,}\s*$', s.strip()):
            out.append('<hr>'); i += 1; continue
        m = re.match(r'^(#{1,4})\s+(.*)$', s)
        if m:
            lv = len(m.group(1))
            out.append('<h%d>%s</h%d>' % (lv, inline(m.group(2)), lv))
            i += 1; continue
        if s.strip().startswith('|') and i + 1 < n and re.match(r'^\s*\|[\s:|-]+\|\s*$', lines[i + 1]):
            rows = []
            while i < n and lines[i].strip().startswith('|'):
                rows.append(lines[i].strip()); i += 1
            out.append(render_table(rows))
            continue
        if re.match(r'^\s*[-*]\s+', s):
            buf = []
            while i < n and re.match(r'^\s*[-*]\s+', lines[i]):
                buf.append(re.sub(r'^\s*[-*]\s+', '', lines[i]).rstrip()); i += 1
            out.append('<ul>' + ''.join('<li>' + inline(x) + '</li>' for x in buf) + '</ul>')
            continue
        if re.match(r'^\s*\d+\.\s+', s):
            buf = []
            while i < n and re.match(r'^\s*\d+\.\s+', lines[i]):
                buf.append(re.sub(r'^\s*\d+\.\s+', '', lines[i]).rstrip()); i += 1
            out.append('<ol>' + ''.join('<li>' + inline(x) + '</li>' for x in buf) + '</ol>')
            continue
        if s.strip().startswith('>'):
            buf = []
            while i < n and lines[i].strip().startswith('>'):
                buf.append(re.sub(r'^\s*>\s?', '', lines[i]).rstrip()); i += 1
            out.append('<blockquote>' + ''.join('<p>' + inline(x) + '</p>' for x in buf) + '</blockquote>')
            continue
        buf = [s.strip()]
        i += 1
        while i < n and lines[i].strip() and not SPECIAL.match(lines[i].strip()):
            buf.append(lines[i].strip()); i += 1
        merged = buf[0]
        for nxt in buf[1:]:
            sep = ' ' if (re.match(r'[A-Za-z0-9]', merged[-1:]) and re.match(r'[A-Za-z0-9]', nxt[:1])) else ''
            merged += sep + nxt
        out.append('<p>' + inline(merged) + '</p>')
    return '\n'.join(out)


def write_html(md_text, title, html_path):
    body = md_to_html(md_text)
    doc = HTML_TMPL % (html.escape(title, quote=False), CSS, body)
    open(html_path, 'w', encoding='utf-8', newline='\n').write(doc)
    print('已写出', os.path.basename(html_path), len(doc), 'bytes')
    return doc


def find_edge():
    return next((p for p in EDGE_CANDIDATES if os.path.exists(p)), None)


def print_pdf(html_path, pdf_path):
    edge = find_edge()
    if not edge:
        print('未找到 msedge.exe，只生成了 HTML')
        return False
    if os.path.exists(pdf_path):
        os.remove(pdf_path)
    url = 'file:///' + os.path.abspath(html_path).replace('\\', '/')
    subprocess.run(
        [edge, '--headless=new', '--disable-gpu', '--no-sandbox',
         '--no-pdf-header-footer',          # 关键：否则页脚打印 file:// URL，泄露本机路径
         '--print-to-pdf=' + pdf_path, url],
        check=False, timeout=300
    )
    if os.path.exists(pdf_path):
        print('已写出', os.path.basename(pdf_path), round(os.path.getsize(pdf_path) / 1024, 1), 'KB')
        return True
    print('PDF 生成失败')
    return False


def render(md_text, title, html_path, pdf_path):
    write_html(md_text, title, html_path)
    return print_pdf(html_path, pdf_path)


if __name__ == '__main__':
    import sys
    print('这是共用模块，请用 build-readme-pdf.py 或 build-log-pdf.py。')
    print('用法示例：import md2pdf; md2pdf.render(md, "标题", "out.html", "out.pdf")')
    sys.exit(0)
