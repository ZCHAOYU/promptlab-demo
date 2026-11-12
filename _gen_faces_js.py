#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 _dev/role-faces.json 转成浏览器可直接加载的 archive-faces.js，
并顺带做一轮质检：缺谁、套话、重复、自相矛盾。

用法：
    python _gen_faces_js.py            # 只体检，不写文件
    python _gen_faces_js.py --write    # 体检通过才写 archive-faces.js
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, '_dev', 'role-faces.json')
OUT = os.path.join(ROOT, 'archive-faces.js')

# 生成时明令禁用的套话（第一版 273 条日常脸全一样，就是因为没禁）
BANNED = ['眉眼舒展', '唇角浅笑', '目光温和', '神情松弛', '气色温润',
          '目光柔和', '面带笑意', '神情放松', '神态从容', '眉眼柔和',
          '浅浅笑意', '唇边含着一点浅笑']

SITS = ('daily', 'action', 'quiet')

# 这几个不是「角色」，是风格类目的占位词条（core: photorealistic person）。
# 模型硬给它们编了脸：「眉心竖纹未散，眼尾压着朝议后的倦意」「瞳底压着未落的诏令」
# —— 朝议、诏令全是它自己加的。这类 meta 词条不该有面部变体，
# 让 pickFace() 返回 null、回退到档案自带 face 就对了。
NO_FACE = {'写实人物'}


def load():
    with open(SRC, encoding='utf-8') as f:
        raw = json.load(f)
    if isinstance(raw, list):
        # [{name: '女帝', faces: {daily, action, quiet}}, ...]
        out = {}
        for x in raw:
            if isinstance(x, dict) and x.get('name'):
                out[x['name']] = x.get('faces') or {}
        return out
    if isinstance(raw, dict):
        out = {}
        for k, v in raw.items():
            out[k] = (v.get('faces') if isinstance(v, dict) and 'faces' in v else v)
        return out
    return {}


def load_roles():
    """从 data-kwdb.js 里抠出角色名单（不跑 node，够用就行）"""
    import re
    src = open(os.path.join(ROOT, 'data-kwdb.js'), encoding='utf-8').read()
    i = src.index('character:')
    j = src.index('categories:', i)
    # 从 categories: 之后逐层匹配花括号，取到 character 的 categories 结束
    depth = 0
    start = None
    for k in range(j, len(src)):
        c = src[k]
        if c == '{':
            if depth == 0:
                start = k
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and start is not None:
                block = src[start + 1:k]
                break
    names = re.findall(r"^\s*'([^']+)':\s*\{", block, re.M)
    return names


def main(write=False):
    data = load()
    roles = load_roles()
    print(f'词库角色 {len(roles)} 条，文件里 {len(data)} 条')

    missing = [r for r in roles if r not in data]
    extra = [k for k in data if k not in roles]
    print(f'缺失 {len(missing)} 条：' + ('、'.join(missing) if missing else '无'))
    if extra:
        print(f'不在词库的 {len(extra)} 条：' + '、'.join(extra))

    problems = []
    seen = {}
    dup_roles = 0
    for name, v in data.items():
        if name in NO_FACE:
            continue
        if not isinstance(v, dict):
            problems.append((name, '结构不对'))
            continue
        texts = []
        for s in SITS:
            t = str(v.get(s) or '').strip()
            if not t:
                problems.append((name, f'{s} 为空'))
                continue
            texts.append(t)
        if len(texts) == 3 and len(set(texts)) < 3:
            dup_roles += 1
            problems.append((name, '三种情境有重复'))
        for t in texts:
            if len(t) < 8:
                problems.append((name, f'太短({len(t)}字)：{t}'))
            elif len(t) > 60:
                problems.append((name, f'太长({len(t)}字)'))
            for b in BANNED:
                if b in t:
                    problems.append((name, f'套话「{b}」：{t}'))
            if t in seen:
                problems.append((name, f'与「{seen[t]}」逐字相同：{t}'))
            else:
                seen[t] = name

    print(f'\n质检问题 {len(problems)} 处')
    for n, p in problems[:60]:
        print(f'  {n}  {p}')
    if len(problems) > 60:
        print(f'  …… 还有 {len(problems) - 60} 处')

    if missing:
        print('\n⚠ 有缺失，不写文件')
        return 1
    if problems:
        print('\n⚠ 有质检问题。确认能接受再加 --force 写入')
        if '--force' not in sys.argv:
            return 1

    if not write:
        print('\n（体检模式，未写文件。加 --write 生成 archive-faces.js）')
        return 0

    payload = {}
    for name in roles:
        if name in NO_FACE:
            continue
        v = data[name]
        payload[name] = {s: str(v[s]).strip().rstrip('。．.') for s in SITS}
    print(f'写入角色 {len(payload)} 条（跳过 NO_FACE {len(NO_FACE)} 条：'
          + '、'.join(sorted(NO_FACE)) + '）')

    body = json.dumps(payload, ensure_ascii=False, indent=0)
    js = (
        '/* 角色面部变体 —— 由 _dev/gen-faces.js 生成\n'
        '   每个角色 3 组面容/表情（日常 / 行动中 / 静谧独处），\n'
        '   由 app.js 的 pickFace() 按 pickSituation() 选择。\n'
        '   为什么单独成文件：translations.js 有重复 key，直接改会插错位置。\n'
        '   撤销：删掉 index.html 里的这个 script 标签即可。 */\n'
        '(function () {\n'
        '  if (typeof window === "undefined") return;\n'
        '  window.__ROLE_FACES = ' + body + ';\n'
        '})();\n')
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        f.write(js)
    print(f'\n✓ 已写入 {OUT}（{len(payload)} 角色，{os.path.getsize(OUT) / 1024:.1f} KB）')
    return 0


if __name__ == '__main__':
    sys.exit(main(write='--write' in sys.argv))
