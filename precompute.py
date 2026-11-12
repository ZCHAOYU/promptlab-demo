#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PromptLab V5 — 预计算词条向量

把 entries.json 的 1939 条词条一次性编码成向量，写到 vectors.bin。
前端只读这个文件，不再在浏览器里编码词条。

用法：
    python precompute.py            # 生成 vectors.bin
    python precompute.py --check    # 只体检，不写文件
"""
import json
import os
import sys
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(HERE, 'models', 'bge-small-zh-v1.5')
ENTRIES = os.path.join(HERE, 'entries.json')
OUT_BIN = os.path.join(HERE, 'vectors.bin')
OUT_META = os.path.join(HERE, 'vectors.meta.json')

MAX_LEN = 128        # 绝大多数词条 < 128 token，超出的截断，省一半以上时间
BATCH = 32           # 按长度排序后的小批量，padding 浪费最小


def load(threads=None):
    import onnxruntime as ort
    from tokenizers import Tokenizer

    tok = Tokenizer.from_file(os.path.join(MODEL_DIR, 'tokenizer.json'))
    tok.enable_truncation(max_length=MAX_LEN)
    tok.enable_padding(pad_id=0, pad_token='[PAD]')

    so = ort.SessionOptions()
    so.intra_op_num_threads = threads or min(16, os.cpu_count() or 8)
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess = ort.InferenceSession(
        os.path.join(MODEL_DIR, 'onnx', 'model_quantized.onnx'),
        so, providers=['CPUExecutionProvider'])
    return tok, sess, [i.name for i in sess.get_inputs()], so.intra_op_num_threads


def embed(tok, sess, input_names, batch):
    enc = tok.encode_batch(batch)
    ids = np.array([e.ids for e in enc], dtype=np.int64)
    mask = np.array([e.attention_mask for e in enc], dtype=np.int64)
    feeds = {'input_ids': ids, 'attention_mask': mask}
    if 'token_type_ids' in input_names:
        feeds['token_type_ids'] = np.zeros_like(ids)
    out = sess.run(None, feeds)[0]                 # [B, T, H]
    cls = out[:, 0, :].astype(np.float32)          # bge 用 CLS pooling
    norm = np.linalg.norm(cls, axis=1, keepdims=True)
    return cls / np.maximum(norm, 1e-9)


def main():
    check_only = '--check' in sys.argv
    entries = json.load(open(ENTRIES, encoding='utf-8'))
    texts = [e.get('text') or (e.get('name', '') + ' ' + (e.get('zh') or '')) for e in entries]
    print(f'词条 {len(texts)} 条')

    tok, sess, input_names, threads = load()
    print(f'线程 {threads}，max_len {MAX_LEN}，batch {BATCH}')

    # 按 token 长度排序，减少 padding 浪费
    lens = [len(tok.encode(t).ids) for t in texts]
    order = sorted(range(len(texts)), key=lambda i: lens[i])
    print(f'token 长度：min {min(lens)} / 中位 {sorted(lens)[len(lens)//2]} / max {max(lens)}')

    t0 = time.time()
    vecs = np.zeros((len(texts), 512), dtype=np.float32)
    done = 0
    for s in range(0, len(order), BATCH):
        idx = order[s:s + BATCH]
        v = embed(tok, sess, input_names, [texts[i] for i in idx])
        vecs[idx] = v
        done += len(idx)
        if done % 256 == 0 or done == len(texts):
            el = time.time() - t0
            print(f'  {done}/{len(texts)}  {el:.1f}s  ({el*1000/max(done,1):.1f} ms/条)')
    dt = time.time() - t0
    print(f'总耗时 {dt:.1f}s  →  {dt*1000/len(texts):.1f} ms/条')

    if check_only:
        q = embed(tok, sess, input_names, ['阴森的老房子，晚上，有雾'])[0]
        sims = vecs @ q
        print('\n语义抽查（"阴森的老房子，晚上，有雾"）：')
        for i in np.argsort(-sims)[:8]:
            print(f'  {sims[i]:.3f}  {entries[i]["kind"]:12s} {entries[i]["name"]}')
        return

    vecs.astype(np.float32).tofile(OUT_BIN)
    json.dump({
        'count': int(vecs.shape[0]),
        'dim': int(vecs.shape[1]),
        'dtype': 'float32',
        'model': 'bge-small-zh-v1.5',
        'maxLen': MAX_LEN,
        'pooling': 'cls',
        'normalized': True,
        'builtAt': time.strftime('%Y-%m-%d %H:%M:%S'),
    }, open(OUT_META, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'\n已写出 {OUT_BIN}  {os.path.getsize(OUT_BIN)/1024/1024:.2f} MB')
    print(f'已写出 {OUT_META}')


if __name__ == '__main__':
    main()
