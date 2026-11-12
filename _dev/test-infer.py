#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第 3 层 LLM 推理兜底的联调脚本：逐条打 /api/infer，打印是否过闸门。"""
import json
import sys
import time
import urllib.request

API = 'http://127.0.0.1:8777/api/infer'


def ask(text, mode='character'):
    body = json.dumps({'text': text, 'mode': mode}, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(API, data=body,
                                 headers={'Content-Type': 'application/json'})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=90) as r:
        obj = json.loads(r.read().decode('utf-8'))
    obj['wallMs'] = int((time.time() - t0) * 1000)
    return obj


CASES = [
    '霸总',            # 网络流行语，程序里绝对没有
    '女帝',
    '白月光',
    '团宠',
    '赘婿',
    '赛博菩萨',
    '你好',            # 不该有主体 —— 模型自己该说不确定
]

if __name__ == '__main__':
    cases = sys.argv[1:] or CASES
    for c in cases:
        try:
            r = ask(c)
        except Exception as e:
            print(f'✗ {c}  请求异常：{e}')
            continue
        if r.get('ok'):
            d = r['data']
            print(f"✓ {c}  ->  {d['type']} / {d['subject']}  置信 {d['confidence']}"
                  f"  {r['wallMs']}ms{'  (缓存)' if r.get('cached') else ''}")
            print(f"      short  : {d['short']}")
            print(f"      worn   : {d['worn']}")
            print(f"      outward: {d['outward']}")
            print(f"      pose   : {d['pose']}")
            print(f"      en     : {d['en_core']}  |  {', '.join(d['en_worn'])}  |  {', '.join(d['en_tags'])}")
            print(f"      why    : {d['why']}")
        else:
            print(f"✗ {c}  ->  {r.get('error')}  {r['wallMs']}ms")
            if r.get('raw'):
                print(f"      raw: {r['raw'][:200]}")
        print()
