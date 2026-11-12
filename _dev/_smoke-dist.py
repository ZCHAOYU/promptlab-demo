# -*- coding: utf-8 -*-
"""临时：对打包产物做端到端冒烟（启动服务 → 打接口 → 关掉）。
用法：python _dev/_smoke-dist.py <包目录> [key]
   不给 key 时验证「没 key 也能优雅降级」。
"""
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
PKG = os.path.abspath(sys.argv[1])
KEY = sys.argv[2] if len(sys.argv) > 2 else ''
PY = os.path.join(PKG, 'runtime', 'python.exe')
if not os.path.exists(PY):
    PY = sys.executable
BASE = 'http://127.0.0.1:8791'   # 换端口，避免和开发中的 8777 冲突


def call(path, payload=None, timeout=60):
    url = BASE + path
    if payload is None:
        req = urllib.request.Request(url)
    else:
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'),
                                     method='POST', headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')
    except Exception as e:
        return 'ERR', str(e)


env = dict(os.environ)
env.pop('DEEPSEEK_API_KEY', None)
if KEY:
    env['DEEPSEEK_API_KEY'] = KEY
env['PYTHONIOENCODING'] = 'utf-8'

print('包目录:', PKG)
print('解释器:', PY)
proc = subprocess.Popen([PY, 'serve.py', '8791'], cwd=PKG, env=env,
                        stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
ok = 0
bad = 0


def check(cond, msg, extra=''):
    global ok, bad
    if cond:
        ok += 1
        print('  ✓ ' + msg)
    else:
        bad += 1
        print('  ✗ ' + msg + (('  → ' + extra[:200]) if extra else ''))


try:
    # 等服务起来
    up = False
    for _ in range(40):
        time.sleep(0.5)
        st, body = call('/api/health', timeout=3)
        if st == 200:
            up = True
            break
    check(up, '服务启动成功（/api/health 200）')
    if not up:
        raise SystemExit(1)
    h = json.loads(body)
    check(h.get('vectors') is True, '本地向量模型加载成功（vectors=true, model=' + str(h.get('model')) + '）')

    st, page = call('/index.html')
    check(st == 200 and 'PromptLab' in page, 'index.html 可访问（' + str(len(page)) + ' 字节）')

    st, page = call('/app.js')
    check(st == 200, '静态 JS 可访问（/app.js）')

    st, body = call('/config.local.js')
    check(st == 404, 'config.local.js 被 404（不泄露配置）')

    st, body = call('/_dev/compliance-list.json')
    check(st == 404, '内部目录 /_dev 被 404')

    st, body = call('/api/embed', {'texts': ['雪山之巅的剑客']})
    dim = None
    if st == 200:
        try:
            j = json.loads(body)
            v = j.get('vectors') or j.get('vector') or j.get('embeddings') or []
            if isinstance(v, list) and v and isinstance(v[0], list):
                dim = len(v[0])
            elif isinstance(v, list):
                dim = len(v)
        except Exception:
            pass
    check(st == 200 and dim and dim > 0, '向量接口可用（维度 ' + str(dim) + '）', body)

    st, body = call('/api/infer', {'text': '一位叫张三的焊工', 'mode': 'character'}, timeout=90)
    if KEY:
        check(st == 200 and '"ok": true' in body, '有 key：第 3 层推理可用', body)
    else:
        check(st in (200, 503) and '密钥' in body, '没 key：推理给出明确提示而不是崩溃', body)

    st, body = call('/api/parse', {'text': '一位科学家，医院'}, timeout=90)
    if KEY:
        check(st == 200 and '"ok": true' in body, '有 key：结构化抽取可用', body)
    else:
        check(st in (200, 502, 503), '没 key：抽取优雅失败（不崩服务）', body)
finally:
    proc.terminate()
    try:
        out = proc.communicate(timeout=10)[0].decode('utf-8', 'replace')
    except Exception:
        proc.kill()
        out = ''
    tail = [l for l in out.splitlines() if l.strip()][-4:]
    if tail:
        print('\n服务端最后几行输出：')
        for l in tail:
            print('    ' + l)

print('\n== 通过 ' + str(ok) + ' / 失败 ' + str(bad) + ' ==')
sys.exit(1 if bad else 0)
