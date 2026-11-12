#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PromptLab 本地服务器（静态文件 + 嵌入 API）

用法：
    python serve.py [端口]
默认 8777。

页面：
    http://127.0.0.1:8777/index.html              主程序
    http://127.0.0.1:8777/test-semantic.html      语义检索测试页
    http://127.0.0.1:8777/test-arbiter.html       检索 + LLM 决策联调页

接口：
    POST /api/embed    {"texts": ["...", ...]}  ->  {"vectors": [[...]], "dim": 512, "ms": 3}
    POST /api/infer    {"text": "...", "mode": "character"}  ->  推理一条词条（第 3 层）
    POST /api/chat     {"messages": [...], "max_tokens": 2000}  ->  服务端代理 chat/completions
    POST /api/feedback {"rating": "up|down", "text": "...", ...}  ->  追加写 _dev/feedback.jsonl
    GET  /api/health   -> 模型与线程状态

为什么用服务端编码：
    浏览器 WASM 在部分机器上会卡在线程初始化，且单条约 85ms；
    原生 onnxruntime + 16 线程 + 长度排序批处理，单条约 1.9ms，快 45 倍。
"""
import http.server
import json
import os
import re
import socketserver
import sys
import threading
import time
import urllib.request
from urllib.parse import unquote

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
ROOT = os.path.dirname(os.path.abspath(__file__))
CACHE_PATH = os.path.join(ROOT, '_dev', 'infer-cache.json')
# 运行时数据目录：发行包里只有 compliance-list.json，其余文件由服务自己生成。
# 以前只在写推理缓存时才 makedirs，导致「打包后第一次写 parse 缓存 / 用量日志」静默失败。
try:
    os.makedirs(os.path.join(ROOT, '_dev'), exist_ok=True)
except Exception:
    pass
MODEL_DIR = os.path.join(ROOT, 'models', 'bge-small-zh-v1.5')
MAX_LEN = 128

# ---- 给别人试用时的两个开关（2026-11-11）----
# PL_HOST  默认 127.0.0.1（只有本机能开）。设成 0.0.0.0 才允许同局域网的人访问。
# PL_ACCESS_CODE  一旦设了，所有 /api/* 都要带 X-PL-Code 头才给用。
#   为什么要密码：/api/infer 是花你自己的 key 的。公开一个不带密码的地址
#   等于把 key 的消费权交出去。只在「要发链接给别人」时才需要设。
HOST = os.environ.get('PL_HOST', '127.0.0.1').strip() or '127.0.0.1'
ACCESS_CODE = os.environ.get('PL_ACCESS_CODE', '').strip()

_embedder = {'tok': None, 'sess': None, 'inputs': None, 'threads': 0, 'err': None}

# LLM 用量累计（进程内），/api/health 会带出来，方便对着余额核对成本
_usage = {'calls': 0, 'prompt': 0, 'completion': 0}


def get_embedder():
    """懒加载：第一次调用 /api/embed 时才载入模型"""
    if _embedder['sess'] is not None or _embedder['err'] is not None:
        return _embedder
    try:
        import numpy as np
        import onnxruntime as ort
        from tokenizers import Tokenizer

        tok = Tokenizer.from_file(os.path.join(MODEL_DIR, 'tokenizer.json'))
        tok.enable_truncation(max_length=MAX_LEN)
        tok.enable_padding(pad_id=0, pad_token='[PAD]')

        so = ort.SessionOptions()
        threads = min(16, os.cpu_count() or 8)
        so.intra_op_num_threads = threads
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        sess = ort.InferenceSession(
            os.path.join(MODEL_DIR, 'onnx', 'model_quantized.onnx'),
            so, providers=['CPUExecutionProvider'])

        _embedder.update(tok=tok, sess=sess, threads=threads,
                         inputs=[i.name for i in sess.get_inputs()])
        print(f'[embed] 模型就绪：线程 {threads}，max_len {MAX_LEN}')
    except Exception as e:
        _embedder['err'] = str(e)
        print(f'[embed] 加载失败：{e}')
    return _embedder


def embed_texts(texts):
    import numpy as np
    ed = get_embedder()
    if ed['err']:
        raise RuntimeError(ed['err'])
    enc = ed['tok'].encode_batch(texts)
    ids = np.array([e.ids for e in enc], dtype=np.int64)
    mask = np.array([e.attention_mask for e in enc], dtype=np.int64)
    feeds = {'input_ids': ids, 'attention_mask': mask}
    if 'token_type_ids' in ed['inputs']:
        feeds['token_type_ids'] = np.zeros_like(ids)
    out = ed['sess'].run(None, feeds)[0]
    cls = out[:, 0, :].astype(np.float32)
    norm = np.linalg.norm(cls, axis=1, keepdims=True)
    vec = cls / np.maximum(norm, 1e-9)
    return vec


# ============================================================
# 第 3 层：LLM 推理兜底（/api/infer）
# ------------------------------------------------------------
# 为什么放在服务端而不是浏览器：
#   1. 密钥不进页面（config.local.js 现在只有服务端读）
#   2. 校验闸门不依赖前端，改不动就改不出脏数据
#   3. 结果落盘成 infer-cache.json，天然就是「影子词条池」
# ============================================================

# 提示词里的禁用词：模型极爱往回写这些，一写就变成套话
BANNED_WORDS = [
    '优雅', '迷人', '魅力', '气质出众', '令人', '美丽', '帅气', '精致',
    '神秘感', '高级感', '氛围感', '充满', '散发'
]

INFER_PROMPT = """你是中文视觉提示词词典的解析器。
用户输入一句中文描述，里面可能含有词典里没有的主体词（流行文化/网络用语/职业黑话），
例如：团宠、赘婿、社畜、算命先生、扎纸匠、赛博菩萨。

任务：判断这个词在**视觉上**到底长什么样，按字段拆开输出一个 JSON 对象。

铁律：
1. 只输出 JSON，不要 markdown 代码块，不要任何解释文字。
2. 每个字段只写**能被画出来**的东西。写"眼角下垂的疲惫感"可以；写"气质出众"不行。
3. 所有中文字段都不许以数量词开头（不许出现「一位」「一个」「一只」「一名」）。
4. 禁用词（出现即算不合格）：{banned}
5. 不确定就把 known 设成 false，不要硬编。

字段说明：
- known       true/false，你是否能确定它指什么
- subject     输入里的那个主体**中心词**，原样抄，不要改写。
              **只填中心词，2~8 字**：输入「一个形状古怪有奇怪花纹的剑」→ 填「剑」，
              输入「银发红瞳的病弱少年」→ 填「少年」。不要照抄整句，整句会被判不合格。
- type        "character" 或 "scene" 或 "prop"
- short       中文主体简称，4~12 字，用来拼「一位___」。
             要带身份名词，例如「冷脸总裁」「扎纸匠人」「城郊游乐园」。
             不许带逗号；不许写「被…的」「正在…的」这种从句。
- gender      只对 type=character 有意义："男" 或 "女" 或 "中性"。
             拿不准就填 "中性"，别猜。
- worn        中文，穿在身上的东西，10~30 字，**最多 3 段**，用逗号分隔。没有就填空字符串
- outward     中文，长相/体貌特征，8~30 字，**最多 3 段**。没有就填 ""
- pose        中文，动作与神情，8~30 字，**最多 3 段**。没有就填 ""
              （这三项会被当作句子拼进正文，堆太多段就成名词沙拉了）
- en_core     英文主体短语，以 a 或 an 开头，3~10 个词，例如 "a domineering corporate heir"
- en_worn     英文服饰标签，逗号分隔，0~6 个，danbooru 风格下划线小写
- en_tags     英文姿态/气质标签，逗号分隔，2~6 个，danbooru 风格
- confidence  0.0~1.0
- why         不超过 25 字，说明判断依据

输出（严格按这个结构，不要增减字段）：
{{"known":true,"subject":"...","type":"character","short":"...","gender":"女","worn":"...","outward":"...","pose":"...","en_core":"...","en_worn":"...","en_tags":"...","confidence":0.8,"why":"..."}}

用户输入：{text}"""


def _bad_quantity(s):
    """不许以数量词开头"""
    return bool(re.match(r'^[一二三四五六七八九十几两这那0-9]+\s*(位|个|名|只|把|张|条|片|座|间|栋)', s))


def _banned_hits(s):
    return [w for w in BANNED_WORDS if w in s]


def _norm_zh(s):
    """中文段统一用全角逗号：模型有时图省事写半角，看着别扭但不算错。"""
    return re.sub(r'[,;；、]+', '，', s).strip('，').strip()


def _norm_en(s):
    """英文字段先归一化再校验：模型经常混用全角逗号/顿号，
    这是格式问题不是内容问题，不该因此把整条结果扔掉。"""
    s = s.lower()
    s = re.sub(r'[，、；;|]+', ',', s)
    s = re.sub(r'\s*,\s*', ',', s)
    s = re.sub(r',+', ',', s)
    return s.strip().strip(',')



def load_llm_config():
    """密钥只从服务端读：优先环境变量，其次 config.local.js"""
    cfg = {
        'endpoint': os.environ.get('DEEPSEEK_ENDPOINT', 'https://api.deepseek.com/v1'),
        'key': os.environ.get('DEEPSEEK_API_KEY', ''),
        'model': os.environ.get('DEEPSEEK_MODEL', 'deepseek-flash'),
        'maxTokens': 2000,
        'timeoutMs': 40000,
    }
    path = os.path.join(ROOT, 'config.local.js')
    if os.path.exists(path):
        try:
            src = open(path, encoding='utf-8').read()
            m = re.search(r"endpoint\s*:\s*'([^']+)'", src)
            if m:
                cfg['endpoint'] = m.group(1)
            m = re.search(r"key\s*:\s*'([^']+)'", src)
            if m:
                cfg['key'] = m.group(1)
            m = re.search(r"model\s*:\s*'([^']+)'", src)
            if m:
                cfg['model'] = m.group(1)
        except Exception as e:
            print(f'[infer] 读取 config.local.js 失败：{e}')
    return cfg


_cache_lock = threading.Lock()
_cache = {'data': None}


def _load_cache():
    if _cache['data'] is not None:
        return _cache['data']
    d = {}
    if os.path.exists(CACHE_PATH):
        try:
            d = json.load(open(CACHE_PATH, encoding='utf-8'))
        except Exception:
            d = {}
    _cache['data'] = d
    return d


def _feedback_count():
    """已收到的反馈条数（按行数算，不解析内容）。"""
    p = os.path.join(ROOT, '_dev', 'feedback.jsonl')
    if not os.path.exists(p):
        return 0
    try:
        with open(p, encoding='utf-8') as f:
            return sum(1 for line in f if line.strip())
    except Exception:
        return 0


def _save_cache(d):
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    tmp = CACHE_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, CACHE_PATH)


def validate_infer(obj, text, ms=0):
    """校验闸门。任一环节不过就整条作废——宁可弹窗问人，也不塞脏数据。"""
    bad = []

    def fail(reason):
        bad.append(reason)
        return {'ok': False, 'error': reason, 'all': bad}

    if not isinstance(obj, dict):
        return fail('返回不是对象')
    if obj.get('known') is not True:
        return {'ok': False, 'error': '模型自己说不确定（known≠true）', 'all': ['known!=true']}
    if obj.get('type') not in ('character', 'scene', 'prop'):
        return fail('type 不在枚举内')

    subject = str(obj.get('subject') or '').strip()
    if not (1 <= len(subject) <= 12):
        return fail('subject 长度异常')
    if subject not in text:
        return fail('subject 不是输入里的原词')

    def zh_field(name, lo, hi, need_seg=False, max_items=0):
        s = _norm_zh(str(obj.get(name) or ''))
        if not s:
            return '', None
        if not (lo <= len(s) <= hi):
            return '', f'{name} 长度 {len(s)} 不在 {lo}~{hi}'
        # 2026-11-11 加：分段数上限。
        # 模板是把字段当**句子**拼进正文的（「身着___」「___，___」），
        # 字段里堆 5~6 段就成了名词沙拉：
        #   「裱糊手茧，手指灵巧，腰/臂节扎、手握竹篾身姿、竹篾绞出骨架、竹篾在指间翻飞」
        # 上游日志里「扎纸匠传统手艺人」就是这么出来的。超过 3 段直接判不合格，
        # 让模型重写一版（infer_subject 会换一次采样）。
        if max_items:
            parts = [p for p in s.split('，') if p.strip()]
            if len(parts) > max_items:
                return '', f'{name} 分了 {len(parts)} 段，上限 {max_items} 段'
        if _bad_quantity(s):
            return '', f'{name} 以数量词开头'
        hits = _banned_hits(s)
        if hits:
            return '', f'{name} 命中禁用词：' + '、'.join(hits)
        if need_seg and '，' not in s:
            return '', f'{name} 没用逗号分段'
        return s, None

    short = _norm_zh(str(obj.get('short') or ''))
    if not (2 <= len(short) <= 14):
        return fail('short 长度不在 2~14')
    if re.search(r'[，,。；;]', short):
        return fail('short 里带了标点')
    if re.search(r'^被|的$|^正在', short):
        return fail('short 写成了从句，不是身份名词')
    hits = _banned_hits(short)
    if hits:
        return fail('short 命中禁用词：' + '、'.join(hits))

    gender = str(obj.get('gender') or '中性').strip()
    if gender not in ('男', '女', '中性'):
        gender = '中性'

    worn, e1 = zh_field('worn', 10, 40, max_items=3)
    outward, e2 = zh_field('outward', 8, 40, max_items=3)
    pose, e3 = zh_field('pose', 8, 40, max_items=3)
    for e in (e1, e2, e3):
        if e:
            return fail(e)

    paint = worn + outward + pose
    if len(paint) < 18:
        return fail(f'可画描述总量只有 {len(paint)} 字，太薄')
    if not (worn or outward or pose):
        return fail('worn/outward/pose 全空')

    en_core = _norm_en(str(obj.get('en_core') or '')).replace(',', ' ')
    en_core = re.sub(r'\s+', ' ', en_core).strip()
    if not re.match(r"^an? [A-Za-z0-9' \-]{4,70}$", en_core):
        return fail('en_core 不是 "a/an ..." 形式')

    def tags_of(name, lo, hi):
        s = _norm_en(str(obj.get(name) or ''))
        if not s:
            return [], None
        # 2026-11-11 修：原来字符集里没有连字符，于是 `t-shirt` 直接判非法，
        # 整条推理被扔掉，用户看到的是「没认出主体」。
        # 这不是模型的问题——带连字符的服饰标签本来就该是合法的（t-shirt / u-neck / o-ring）。
        # 实测「夜市烧烤摊主」因为 apron,t-shirt,arm_sleeves,towel 这一串 100% 失败。
        if not re.match(r'^[a-z0-9_ ()\-]+(,[a-z0-9_ ()\-]+)*$', s):
            return [], f'{name} 含非法字符：{s[:40]}'
        t = [x.strip() for x in s.split(',') if x.strip()]
        if not (lo <= len(t) <= hi):
            return [], f'{name} 标签数 {len(t)} 不在 {lo}~{hi}'
        if any(len(x) > 40 for x in t):
            return [], f'{name} 单个标签过长'
        return t, None

    en_worn, e4 = tags_of('en_worn', 0, 8)
    en_tags, e5 = tags_of('en_tags', 2, 8)
    for e in (e4, e5):
        if e:
            return fail(e)

    try:
        conf = float(obj.get('confidence'))
    except Exception:
        return fail('confidence 不是数字')
    if conf < 0.6:
        return {'ok': False, 'error': f'置信度 {conf:.2f} 低于 0.60',
                'all': ['confidence<0.6']}

    return {
        'ok': True,
        'data': {
            'subject': subject,
            'type': obj['type'],
            'short': short,
            'gender': gender,
            'worn': worn,
            'outward': outward,
            'pose': pose,
            'en_core': en_core,
            'en_worn': en_worn,
            'en_tags': en_tags,
            'confidence': round(conf, 2),
            'why': str(obj.get('why') or '')[:40],
        },
        'ms': ms,
    }


def call_llm_msgs(cfg, messages, max_tokens, temperature=0.2, json_mode=False):
    """底层一次 chat/completions 调用。prompt 版本和 messages 版本都走这里，
    这样用量统计只有一份，不会漏记。"""
    payload = {
        'model': cfg['model'],
        'messages': messages,
        'temperature': temperature,
        'max_tokens': max_tokens,
        'stream': False,
    }
    if json_mode:
        payload['response_format'] = {'type': 'json_object'}
    body = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        cfg['endpoint'].rstrip('/') + '/chat/completions',
        data=body,
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cfg['key'],
        },
        method='POST')
    with urllib.request.urlopen(req, timeout=cfg['timeoutMs'] / 1000.0) as r:
        resp = json.loads(r.read().decode('utf-8'))
    # 把 token 用量打出来（2026-11-11）。
    # 为什么要打：之前按「一次几百 token」估过成本，实测余额掉得比估算快得多，
    # 估算不可靠。有了每条的 usage，成本就能自己算，不用猜。
    u = resp.get('usage') or {}
    if u:
        _usage['calls'] += 1
        _usage['prompt'] += int(u.get('prompt_tokens') or 0)
        _usage['completion'] += int(u.get('completion_tokens') or 0)
        print(f"[llm] model={resp.get('model')} prompt={u.get('prompt_tokens')} "
              f"completion={u.get('completion_tokens')} "
              f"cache_hit={u.get('prompt_cache_hit_tokens')} "
              f"| 累计 {_usage['calls']} 次 prompt={_usage['prompt']} completion={_usage['completion']}")
    return resp


def call_llm(cfg, prompt, max_tokens):
    return call_llm_msgs(cfg, [{'role': 'user', 'content': prompt}], max_tokens)


def infer_subject(text, mode='character'):
    t0 = time.time()
    cfg = load_llm_config()
    if not cfg['key']:
        return {'ok': False, 'error': '服务端没有 API 密钥（config.local.js / DEEPSEEK_API_KEY）'}

    key = (mode or '') + '|' + text
    with _cache_lock:
        d = _load_cache()
        if key in d:
            hit = dict(d[key])
            hit['cached'] = True
            hit['ms'] = int((time.time() - t0) * 1000)
            return hit

    prompt = INFER_PROMPT.format(banned='、'.join(BANNED_WORDS), text=text)
    raw = None
    last_fail = None
    # 2026-11-11：校验不过原来直接返回失败，实测约每 6 次会有 1 次——
    # 模型给了合法 JSON 但字段不合格（比如中英混用、缺字段）。
    # 这种情况换一次采样往往就过了，而失败意味着用户看到「没认出主体」，
    # 代价比多调一次大得多。所以：校验失败再多试一次。
    for validation_try in range(2):
        for budget in (2000, 3000):
            try:
                resp = call_llm(cfg, prompt, budget)
            except Exception as e:
                return {'ok': False, 'error': f'请求失败：{e}', 'ms': int((time.time() - t0) * 1000)}
            choice = (resp.get('choices') or [{}])[0]
            content = (choice.get('message') or {}).get('content') or ''
            raw = content
            if not content.strip():
                continue   # 推理把 token 吃光了，加预算重试
            m = re.search(r'\{[\s\S]*\}', content)
            if not m:
                continue
            try:
                obj = json.loads(m.group(0))
            except Exception:
                continue
            res = validate_infer(obj, text, int((time.time() - t0) * 1000))
            if res.get('ok'):
                with _cache_lock:
                    d = _load_cache()
                    d[key] = res
                    try:
                        _save_cache(d)
                    except Exception as e:
                        print(f'[infer] 写缓存失败：{e}')
                res['cached'] = False
                return res
            # 校验没过：记下原因，进入下一轮（换一次采样可能就过）
            last_fail = res
            last_fail['raw'] = content[:600]
            print(f'[infer] 校验没过（第 {validation_try + 1} 次）：{res.get("error")}')
            break

    if last_fail:
        last_fail['ms'] = int((time.time() - t0) * 1000)
        return last_fail

    return {'ok': False, 'error': '模型输出为空或不是合法 JSON', 'raw': (raw or '')[:600],
            'ms': int((time.time() - t0) * 1000)}



# ============================================================
# 合规：输入侧过滤 + 使用日志 + 举报（2026-11-11）
# ------------------------------------------------------------
# 为什么服务端也要查一遍：
#   客户端过滤只能拦「正常操作」。任何人直接 POST /api/infer 就绕过了。
#   而 /api/infer 是要花钱的（打的是我的 key），所以这一层是必须的，不是重复。
# 判据和前端共用 _dev/compliance-list.json，避免两套词表分叉。
# ============================================================
_COMP_PATH = os.path.join(ROOT, '_dev', 'compliance-list.json')
_COMP = {'list': None, 'tries': None}


def _load_compliance():
    if _COMP['list'] is not None:
        return _COMP['list']
    try:
        with open(_COMP_PATH, encoding='utf-8') as f:
            _COMP['list'] = json.load(f)
    except Exception as e:
        print(f'[compliance] 词表读取失败：{e}')
        _COMP['list'] = {}
    return _COMP['list']


def _flat(obj):
    out = []
    for k, v in (obj or {}).items():
        if k.startswith('_') or not isinstance(v, list):
            continue
        out.extend(v)
    return out


def _build_trie(words):
    root = {'n': {}, 'w': ''}
    for w in words:
        if not w:
            continue
        node = root
        for ch in str(w).lower():
            node = node['n'].setdefault(ch, {'n': {}, 'w': ''})
        node['w'] = str(w)
    return root


def _cat_map():
    """词 → 类别名。JS 侧 reasons 带类别（『全裸(色情低俗)』），
    Python 侧原来不带，导致看板的分类统计只看到『block』。
    两套实现的等级一致、但原因不一致，也算不一致。"""
    L = _load_compliance()
    m = {}
    for level in ('block', 'ip', 'review'):
        for cat, words in (L.get(level) or {}).items():
            if cat.startswith('_') or not isinstance(words, list):
                continue
            for w in words:
                m[str(w).lower()] = cat
    return m


def _label(w, cats):
    return w + '(' + cats.get(str(w).lower(), '?') + ')'


def _gets():
    if _COMP['tries'] is not None:
        return _COMP['tries']
    L = _load_compliance()
    combo = (L.get('combo') or {}).get('未成年性化') or {}
    _COMP['tries'] = {
        'block': _build_trie(_flat(L.get('block'))),
        'ip': _build_trie(_flat(L.get('ip'))),
        'review': _build_trie(_flat(L.get('review'))),
        'minor': _build_trie(combo.get('minor') or []),
        'sexual': _build_trie(combo.get('sexual') or []),
    }
    return _COMP['tries']


def _compact(s):
    return re.sub(r'[\s\-_·•|/\\.,，。、；;：:！!？?（）()【】\[\]"\'“”‘’<>]+', '', str(s or ''))


def _scan(trie, text):
    t = str(text or '').lower()
    hits = []
    seen = set()
    for i in range(len(t)):
        node = trie
        for j in range(i, len(t)):
            node = node['n'].get(t[j])
            if node is None:
                break
            if node['w'] and node['w'] not in seen:
                seen.add(node['w'])
                hits.append(node['w'])
    return hits


def _check_text(text):
    """返回 {'level': 'ok'|'review'|'block', 'reasons': [...]}"""
    raw = str(text or '')
    if not raw.strip():
        return {'level': 'ok', 'reasons': []}
    T = _gets()
    packed = _compact(raw)

    def hits(key):
        return list(dict.fromkeys(_scan(T[key], raw) + _scan(T[key], packed)))

    cats = _cat_map()
    reasons = []
    b = hits('block')
    if b:
        reasons.append('block：' + '、'.join(_label(w, cats) for w in b[:4]))
    minor, sexual = hits('minor'), hits('sexual')
    if minor and sexual:
        reasons.append('block/组合：未成年性化（' + '、'.join(minor[:2]) + ' + ' + '、'.join(sexual[:2]) + '）')
    if reasons:
        return {'level': 'block', 'reasons': reasons}

    ip = hits('ip')
    if ip:
        reasons.append('review/ip：' + '、'.join(_label(w, cats) for w in ip[:3]))
    rv = hits('review')
    if rv:
        reasons.append('review：' + '、'.join(_label(w, cats) for w in rv[:3]))
    if reasons:
        return {'level': 'review', 'reasons': reasons}
    return {'level': 'ok', 'reasons': []}


# ---- 追加写 JSONL 的小工具 ----
def _append_jsonl(path, rec):
    try:
        with open(path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')
        return True
    except Exception as e:
        print(f'[log] 写入失败 {path}: {e}')
        return False


_USAGE_PATH = os.path.join(ROOT, '_dev', 'usage-log.jsonl')
_REPORT_PATH = os.path.join(ROOT, '_dev', 'reports.jsonl')
_CREDIT_PATH = os.path.join(ROOT, '_dev', 'credits.json')
_DECISION_PATH = os.path.join(ROOT, '_dev', 'review-decisions.jsonl')

# 举报频率限制：同一 visitor 60 秒内最多 3 条
_recent_reports = {}
_report_lock = threading.Lock()


def _report_rate_ok(visitor):
    now = time.time()
    with _report_lock:
        arr = [t for t in _recent_reports.get(visitor, []) if now - t < 60]
        if len(arr) >= 3:
            _recent_reports[visitor] = arr
            return False
        arr.append(now)
        _recent_reports[visitor] = arr
        return True


def _credits_load():
    try:
        with open(_CREDIT_PATH, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def _credits_save(d):
    try:
        with open(_CREDIT_PATH, 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f'[credits] 写入失败：{e}')



# ============================================================
# 测试期看板（2026-11-11）
# ------------------------------------------------------------
# 数据全部来自本地 jsonl，不引入数据库。
# 关键取舍：**没有的字段不猜**。成本按「约 ¥0.003/次推理」估，
# 并且明确标成估算值——把估算当真数写进看板，比不给数字更糟。
# ============================================================
def _infer_cache_size():
    """推理缓存条数（_dev/infer-cache.json 的条目数）"""
    try:
        with open(os.path.join(ROOT, '_dev', 'infer-cache.json'), encoding='utf-8') as f:
            d = json.load(f)
        return len(d) if hasattr(d, '__len__') else 0
    except Exception:
        return 0


def _read_jsonl(path, limit=None):
    if not os.path.exists(path):
        return []
    out = []
    try:
        with open(path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    out.append(json.loads(line))
                except Exception:
                    continue
    except Exception:
        return []
    return out[-limit:] if limit else out


def _stats_payload(days=7):
    now_ms = int(time.time() * 1000)
    since = now_ms - days * 86400 * 1000

    usage = [r for r in _read_jsonl(_USAGE_PATH) if r.get('ts', 0) >= since]
    reports = _read_jsonl(_REPORT_PATH)
    decisions = _read_jsonl(_DECISION_PATH)
    credits = _credits_load()

    # ---- 用量 ----
    gens = [r for r in usage if r.get('kind') == 'gen']
    infers = [r for r in usage if r.get('kind') == 'infer']
    visitors = set(r.get('visitor') for r in usage if r.get('visitor') and r.get('visitor') != 'anonymous')

    # ---- 按日 ----
    by_day = {}
    for r in usage:
        d = time.strftime('%m-%d', time.localtime(r.get('ts', 0) / 1000.0))
        slot = by_day.setdefault(d, {'gen': 0, 'infer': 0, 'block': 0, 'review': 0})
        if r.get('kind') == 'gen':
            slot['gen'] += 1
        elif r.get('kind') == 'infer':
            slot['infer'] += 1
        lv = r.get('level')
        if lv == 'block':
            slot['block'] += 1
        elif lv == 'review':
            slot['review'] += 1

    # ---- 合规 ----
    blocked = [r for r in usage if r.get('level') == 'block']
    review = [r for r in usage if r.get('level') == 'review']
    cat_count = {}
    for r in blocked:
        for reason in (r.get('reasons') or []):
            # 原因格式：block：全裸(色情低俗) / block/组合：未成年性化（…）
            if '/组合' in reason:
                cat = '未成年性化组合'
            else:
                m = re.search(r'\(([^)]+)\)', reason)
                cat = m.group(1) if m else reason.split('：')[0]
            cat_count[cat] = cat_count.get(cat, 0) + 1

    # ---- 举报 / 抽检 ----
    decided = {d.get('id'): d for d in decisions}
    pending = [r for r in reports if r.get('id') not in decided]
    valid = [d for d in decisions if d.get('verdict') == 'valid']
    invalid = [d for d in decisions if d.get('verdict') == 'invalid']

    # ---- 推理成本（估算，明确标注）----
    cost_note = '按约 ¥0.003/次估算，非账单口径'
    est_cost = len(infers) * 0.003

    return {
        'ok': True,
        'window_days': days,
        'generated_at': now_ms,
        'usage': {
            'generate': len(gens),
            'infer': len(infers),
            'visitors': len(visitors),
            'infer_cache': _infer_cache_size(),
        },
        'by_day': dict(sorted(by_day.items())),
        'compliance': {
            'blocked': len(blocked),
            'review': len(review),
            'block_rate': round(len(blocked) / len(usage), 4) if usage else 0,
            'by_category': dict(sorted(cat_count.items(), key=lambda kv: -kv[1])),
        },
        'reports': {
            'total': len(reports),
            'pending': len(pending),
            'valid': len(valid),
            'invalid': len(invalid),
            'top_reporters': dict(sorted(credits.items(), key=lambda kv: -kv[1])[:5]),
        },
        'review': {
            'decided': len(decisions),
            'queue_open': len(pending),
            'sample_ratio': 0.3,
        },
        'cost': {
            'est_cny': round(est_cost, 3),
            'note': cost_note,
            # 内存计数只代表「本次进程」，重启就归零，所以单独标出来；
            # 历史口径用「没被拦下的推理请求数」，这个是持久化的。
            'llm_calls_process': _usage.get('calls', 0),
            'llm_calls_persisted': len([r for r in infers if r.get('level') != 'block']),
            'prompt_tokens': _usage.get('prompt', 0),
            'completion_tokens': _usage.get('completion', 0),
        },
    }


def _stats_text(p):
    L = []
    L.append('=== PromptLab 测试看板 · 近 %d 天 ===' % p['window_days'])
    L.append('')
    L.append('用量')
    L.append('  生成次数      %d' % p['usage']['generate'])
    L.append('  推理调用      %d' % p['usage']['infer'])
    L.append('  独立访客      %d' % p['usage']['visitors'])
    L.append('')
    L.append('合规')
    L.append('  拦下(block)   %d（占 %.1f%%）' % (p['compliance']['blocked'], p['compliance']['block_rate'] * 100))
    L.append('  需人工(review) %d' % p['compliance']['review'])
    if p['compliance']['by_category']:
        L.append('  分类          ' + '、'.join('%s×%d' % (k, v) for k, v in p['compliance']['by_category'].items()))
    L.append('')
    L.append('举报')
    L.append('  总计 %d / 待审 %d / 有效 %d / 无效 %d' % (
        p['reports']['total'], p['reports']['pending'], p['reports']['valid'], p['reports']['invalid']))
    if p['reports']['top_reporters']:
        L.append('  积分榜        ' + '、'.join('%s:%d' % (k, v) for k, v in p['reports']['top_reporters'].items()))
    L.append('')
    L.append('抽检')
    L.append('  已判定 %d / 队列 %d（抽样比例 %d%%）' % (
        p['review']['decided'], p['review']['queue_open'], p['review']['sample_ratio'] * 100))
    L.append('')
    L.append('成本（%s）' % p['cost']['note'])
    L.append('  估算 ¥%.3f' % p['cost']['est_cny'])
    L.append('  实际调用      本次进程 %d 次 / 历史 %d 次（重启会重置进程计数）' % (
        p['cost']['llm_calls_process'], p['cost']['llm_calls_persisted']))
    L.append('  token         本次进程 prompt %d / completion %d' % (
        p['cost']['prompt_tokens'], p['cost']['completion_tokens']))
    if p['by_day']:
        L.append('')
        L.append('按日')
        for d, v in p['by_day'].items():
            L.append('  %s  生成 %-4d 推理 %-4d 拦 %-3d 审 %-3d' % (d, v['gen'], v['infer'], v['block'], v['review']))
    return '\n'.join(L)



# ============================================================
# 结构化抽取（2026-11-11）
# ------------------------------------------------------------
# 目的：把「认维度」从规则匹配换成 schema 约束的模型抽取。
#   · 库内认识的 → 填库内名，后面的拼装保持确定性
#   · 库内不认识的 → 原样进 raw[]，绝不硬套成库里最近的东西
# raw 是「词库以外」的正式出口 —— 有了它，就不必再靠加白名单续命。
#
# 成本和代价（写在这里，避免以后有人以为是免费的）：
#   · 每次新输入一次 LLM 调用，约 ¥0.003，2~4 秒
#   · 有缓存（_dev/parse-cache.json），同一句只花一次
#   · 失败时返回 ok:false，前端退回规则匹配（能力不退化）
# ============================================================
_PARSE_PATH = os.path.join(ROOT, '_dev', 'parse-cache.json')
_PARSE_CACHE = {'data': None}

_PARSE_PROMPT = """你是「可画性结构化抽取器」。把用户的一句中文描述拆成字段。

规则：
1 只输出 JSON，不要解释。
2 「角色」「场景」「风格」三个字段：只能填**通用美术名词**（如 剑客/骑士/少女/教堂/雪山/巴洛克/写实摄影）。用户写的是具体人设时，角色填最接近的通用名；实在没有就给空字符串。
3 「原话」字段最重要：把**用户原话里对人物/主体的称呼，逐字照抄**。
   不许改写、不许归纳、不许去掉修饰：
     用户写「老修理工」→ 原话「老修理工」（不能写「修理工」）
     用户写「浑身是血的男人」→ 原话「浑身是血的男人」
     用户写「穿红裙的少女」→ 原话「穿红裙的少女」
   没有人物就把「原话」给空字符串。
4 raw 字段：把**信息量最大、但无法归类**的描述短语原样摘出来，例如「浑身是血」「双膝跪地」「袖口磨破」「手里攥着一把断刀」。每条不超过 12 个字，最多 4 条。
5 不要把「一个」「这位」这类虚词放进 raw。
6 不要编造用户没写的内容。

7 「场景道具」字段：给 2~3 个**这个场景里会自然出现的道具**（不写人物自带的专业设备）。
   例子：咖啡馆 → 咖啡杯、笔记本；拆迁废墟 → 碎砖、钢筋头；菜市场 → 塑料袋、秤。
   每个不超过 6 个字。场景不明就给空数组。

输出格式（严格）：
{"角色":"","原话":"","场景":"","风格":"","光线":"","色彩":"","氛围":"","构图":"","场景道具":[],"raw":[]}"""


def _parse_cache_load():
    if _PARSE_CACHE['data'] is not None:
        return _PARSE_CACHE['data']
    try:
        with open(_PARSE_PATH, encoding='utf-8') as f:
            _PARSE_CACHE['data'] = json.load(f)
    except Exception:
        _PARSE_CACHE['data'] = {}
    return _PARSE_CACHE['data']


def _parse_cache_save():
    try:
        with open(_PARSE_PATH, 'w', encoding='utf-8') as f:
            json.dump(_PARSE_CACHE['data'], f, ensure_ascii=False)
    except Exception as e:
        print(f'[parse] 缓存写入失败：{e}')


def _clean_raw(arr):
    """只保留像样的短语：长度 2~16、不是纯虚词、去重、最多 4 条"""
    BAD = {'一个', '一位', '这名', '这个', '那个', '男人', '女人', '东西', '样子', '感觉'}
    out = []
    if not isinstance(arr, list):
        return out
    for x in arr:
        t = str(x or '').strip().strip('，。、,.')
        if not t or len(t) < 2 or len(t) > 16:
            continue
        if t in BAD or t in out:
            continue
        out.append(t)
        if len(out) >= 4:
            break
    return out


def _do_parse(text):
    """返回 (data, cached)。data 里一定包含干净的 raw 列表。"""
    key = str(text or '').strip()
    if not key:
        return None, False
    cache = _parse_cache_load()
    if key in cache:
        return cache[key], True

    cfg = load_llm_config()
    if not cfg.get('key'):
        return None, False

    msgs = [
        {'role': 'system', 'content': _PARSE_PROMPT},
        {'role': 'user', 'content': key},
    ]
    # 预算：实测长输入写到 400 token 会被截断，JSON 不完整直接失败。
    # 所以给 700，失败再试 900（截断的代价比多一次调用大）。
    resp, content = None, ''
    for budget in (700, 900):
        try:
            resp = call_llm_msgs(cfg, msgs, budget, 0.2, True)
        except Exception as e:
            print(f'[parse] 上游失败：{e}')
            return None, False
        try:
            content = (resp.get('choices') or [{}])[0].get('message', {}).get('content') or ''
        except Exception:
            content = ''
        if content.count('{') and content.rstrip().endswith('}'):
            break
        print(f'[parse] JSON 不完整（budget={budget}），重试')
    # 模型偶尔会包一层 ```json，剥掉
    content = content.strip()
    if content.startswith('```'):
        content = content.strip('`')
        if content.lower().startswith('json'):
            content = content[4:]
    i, j = content.find('{'), content.rfind('}')
    if i < 0 or j < 0:
        return None, False
    try:
        data = json.loads(content[i:j + 1])
    except Exception:
        return None, False
    if not isinstance(data, dict):
        return None, False

    clean = {}
    for k in ('角色', '场景', '风格', '光线', '色彩', '氛围', '构图'):
        v = data.get(k)
        clean[k] = str(v).strip()[:16] if isinstance(v, str) else ''

    # 「原话」必须是输入的子串 —— 这一条硬校验保证它真的逐字来自用户，
    # 而不是模型改写后的版本。不满足就丢掉（宁缺勿错）。
    yh = data.get('原话')
    yh = str(yh).strip() if isinstance(yh, str) else ''
    if yh and yh in key and len(yh) <= 24:
        clean['原话'] = yh
    else:
        clean['原话'] = ''
        if yh:
            print(f'[parse] 原话不合规已丢弃：{yh!r}')

    clean['raw'] = _clean_raw(data.get('raw'))
    # 场景道具：任何场景都能给（不靠手写表），只留短词，最多 3 条
    props = data.get('场景道具') if isinstance(data.get('场景道具'), list) else []
    clean['场景道具'] = [p for p in [str(x).strip()[:6] for x in props[:5]] if p][:3]

    cache[key] = clean
    _PARSE_CACHE['data'] = cache
    _parse_cache_save()
    return clean, False


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.md': 'text/markdown; charset=utf-8',
        '.bin': 'application/octet-stream',
        '.wasm': 'application/wasm',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---- 静态文件白名单过滤（2026-11-11）----
    # 原来的 SimpleHTTPRequestHandler 会把整个 promptlab 目录都吐出去，
    # 包括 config.local.js —— 那里面是明文的 DEEPSEEK_API_KEY。
    # 也就是说：任何人只要能访问这个端口，`/config.local.js` 一次 GET 就能拿到 key。
    # 这里改成白名单：只有明确要给的静态资源才放行。
    ALLOW_EXT = {'.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico',
                 '.woff', '.woff2', '.bin', '.wasm', '.json'}
    # 明确禁止：密钥、脚本、备份、缓存、日志、文档、内部工具
    DENY_NAMES = {'config.local.js', 'serve.py', 'precompute.py', 'extract_entries.js',
                  'build-subject-vocab.js', 'run-tests.ps1'}
    DENY_DIRS = ('_dev', '_archive', '__pycache__', 'models', 'vendor')
    DENY_EXT = {'.py', '.pyc', '.md', '.pdf', '.ps1', '.bat', '.cmd', '.jsonl', '.log'}

    def _deny_for_static(self, path):
        rel = unquote(path.split('?', 1)[0]).lstrip('/')
        if not rel:
            return None          # 根目录：走 SimpleHTTPRequestHandler 的 index.html
        if rel.endswith('/'):
            # 目录列表一律不给：/_dev/ 和 /_archive/ 的列表会把内部结构摊开给人看
            return True
        parts = [p for p in rel.split('/') if p]
        if any(p in self.DENY_DIRS for p in parts[:-1]):
            return True
        name = parts[-1]
        low = name.lower()
        if name in self.DENY_NAMES:
            return True
        # 任何 *.local.js 都不给（复制一份改名也不会漏）
        if low.endswith('.local.js'):
            return True
        ext = os.path.splitext(low)[1]
        if ext in self.DENY_EXT:
            return True
        if ext and ext not in self.ALLOW_EXT:
            return True
        return None

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Resource-Policy', 'cross-origin')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith('/api/health'):
            ed = get_embedder()
            return self._json({
                'ok': ed['err'] is None,
                'error': ed['err'],
                'threads': ed['threads'],
                'maxLen': MAX_LEN,
                'model': 'bge-small-zh-v1.5',
                'vectors': os.path.exists(os.path.join(ROOT, 'vectors.bin')),
                'infer': bool(load_llm_config()['key']),
                'inferCached': len(_load_cache()),
                'feedback': _feedback_count(),
                'usage': dict(_usage),
            })
        if self.path.startswith('/api/stats'):
            return self._stats()
        if self.path.startswith('/api/review'):
            return self._review_list()
        if self._deny_for_static(self.path):
            return self._json({'ok': False, 'error': 'not found'}, 404)
        return super().do_GET()

    def do_HEAD(self):
        # 顺手让 HEAD 也走同一套过滤（SimpleHTTPRequestHandler 原来两条路都通）
        if self._deny_for_static(self.path):
            self.send_response(404)
            self.end_headers()
            return
        return super().do_HEAD()

    def _code_ok(self):
        """访问码校验。没设 PL_ACCESS_CODE 时永远通过（本机自用）。"""
        if not ACCESS_CODE:
            return True
        got = (self.headers.get('X-PL-Code') or '').strip()
        if got and got == ACCESS_CODE:
            return True
        # 兼容 ?code=xxx，方便直接把带码的链接发出去
        if '?' in self.path:
            qs = unquote(self.path.split('?', 1)[1])
            for part in qs.split('&'):
                if part.startswith('code=') and part[5:] == ACCESS_CODE:
                    return True
        return False

    def do_POST(self):
        if self.path.startswith('/api/') and not self._code_ok():
            return self._json({'ok': False, 'error': '需要访问码（X-PL-Code）'}, 401)
        if self.path.startswith('/api/infer'):
            return self._infer()
        if self.path.startswith('/api/chat'):
            return self._chat()
        if self.path.startswith('/api/feedback'):
            return self._feedback()
        if self.path.startswith('/api/report'):
            return self._report()
        if self.path.startswith('/api/log'):
            return self._log()
        if self.path.startswith('/api/parse'):
            return self._parse_handler()
        if not self.path.startswith('/api/embed'):
            return self._json({'ok': False, 'error': 'unknown endpoint'}, 404)
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            texts = payload.get('texts') or []
            if not isinstance(texts, list) or not texts:
                return self._json({'ok': False, 'error': 'texts 为空'}, 400)
            texts = [str(t) for t in texts[:64]]
            t0 = time.time()
            vec = embed_texts(texts)
            ms = int((time.time() - t0) * 1000)
            return self._json({
                'ok': True,
                'vectors': [[round(float(x), 6) for x in row] for row in vec],
                'dim': int(vec.shape[1]),
                'count': len(texts),
                'ms': ms,
            })
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)

    def _infer(self):
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            text = str(payload.get('text') or '').strip()[:80]
            mode = str(payload.get('mode') or 'character')
            if not text:
                return self._json({'ok': False, 'error': 'text 为空'}, 400)
            # 道具类直接拒绝（2026-11-11）。
            # 这条接口的 schema 是人物/场景那套（worn / outward / pose），
            # 一把剑没有服饰、长相、姿态，模型只能给出 17 个字的空壳，
            # 然后被「描述太薄」判掉——用户等 5~10 秒什么也拿不到。
            # 道具本来就有材质/质感/展示/背景四个维度可查，不需要造词条。
            if mode == 'prop':
                return self._json({
                    'ok': False,
                    'error': '道具类不做主体推理（材质/质感/展示维度已够用）',
                    'skip': True,
                }, 400)
            # 输入侧过滤：命中 block 直接拒，不花一次模型调用
            _cmp = _check_text(text)
            _append_jsonl(_USAGE_PATH, {
                'ts': int(time.time() * 1000), 'kind': 'infer', 'text': text,
                'level': _cmp['level'], 'reasons': _cmp['reasons'],
            })
            if _cmp['level'] == 'block':
                print(f'[infer] 输入命中合规规则，已拒：{text[:24]}')
                return self._json({
                    'ok': False, 'blocked': True,
                    'error': '输入命中合规规则：' + '；'.join(_cmp['reasons']),
                    'reasons': _cmp['reasons'],
                }, 400)
            print(f'[infer] {mode} | {text}')
            t0 = time.time()
            res = infer_subject(text, mode)
            res.setdefault('ms', int((time.time() - t0) * 1000))
            print(f'[infer] -> {"OK" if res.get("ok") else res.get("error")} ({res["ms"]}ms)')
            return self._json(res)
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)

    def _chat(self):
        """服务端代理一次 chat/completions（2026-11-11）。

        为什么必须有这个接口：
          原来 `<script src="config.local.js">` 把明文 key 塞进浏览器，页面直接用 key
          请求 api.deepseek.com —— 谁能打开页面，谁就能拿走 key。
          为了封这个洞，config.local.js 不再对外提供，于是浏览器拿不到 key，
          「语义检索 + 约束决策」面板整套失效（报「未配置 endpoint 或 key」）。

        现在改成：浏览器只发 messages，key 留在服务端。
        请求和响应都保持 OpenAI 兼容格式，前端 llm-arbiter.js 的解析代码不用改。
        """
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            msgs = payload.get('messages')
            if not isinstance(msgs, list) or not msgs:
                return self._json({'ok': False, 'error': 'messages 为空'}, 400)
            clean = []
            for m in msgs[:8]:
                if not isinstance(m, dict):
                    continue
                role = str(m.get('role') or 'user')
                if role not in ('system', 'user', 'assistant'):
                    role = 'user'
                content = str(m.get('content') or '')[:8000]
                if content:
                    clean.append({'role': role, 'content': content})
            if not clean:
                return self._json({'ok': False, 'error': 'messages 内容为空'}, 400)

            cfg = load_llm_config()
            if not cfg['key']:
                return self._json({'ok': False, 'error': '服务端没有 API 密钥（config.local.js / DEEPSEEK_API_KEY）'}, 503)

            try:
                max_tokens = int(payload.get('max_tokens') or cfg['maxTokens'] or 2000)
            except Exception:
                max_tokens = 2000
            max_tokens = max(64, min(max_tokens, 4000))   # 防止前端传个离谱的值把额度烧掉

            try:
                temperature = float(payload.get('temperature'))
            except Exception:
                temperature = 0.2
            temperature = max(0.0, min(temperature, 2.0))

            json_mode = bool(payload.get('json'))

            print(f'[chat] {len(clean)} 条消息 | max_tokens={max_tokens} json={json_mode}')
            t0 = time.time()
            try:
                resp = call_llm_msgs(cfg, clean, max_tokens, temperature, json_mode)
            except Exception as e:
                print(f'[chat] 调用失败：{e}')
                return self._json({'ok': False, 'error': f'上游调用失败：{e}'}, 502)

            choice = (resp.get('choices') or [{}])[0]
            content = (choice.get('message') or {}).get('content') or ''
            ms = int((time.time() - t0) * 1000)
            if not content.strip():
                reason = choice.get('finish_reason') or '空内容'
                print(f'[chat] 空回复（{reason}）')
                return self._json({'ok': False, 'error': f'模型返回空内容（{reason}）'}, 502)

            print(f'[chat] -> OK {ms}ms {len(content)} 字')
            return self._json({
                'ok': True,
                'choices': [{'message': {'role': 'assistant', 'content': content},
                             'finish_reason': choice.get('finish_reason')}],
                'usage': resp.get('usage') or {},
                'model': resp.get('model') or cfg['model'],
                'ms': ms,
            })
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)

    def _feedback(self):
        """试用反馈：一行一条 JSONL，追加写。
        为什么存文件不存数据库：量很小（试用阶段），而且这些记录要能被
        _dev 里的脚本直接读出来做统计，SQLite 只会多一层麻烦。"""
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            rating = str(payload.get('rating') or '').strip()
            if rating not in ('up', 'down'):
                return self._json({'ok': False, 'error': 'rating 必须是 up/down'}, 400)
            text = str(payload.get('text') or '').strip()[:500]
            if not text:
                return self._json({'ok': False, 'error': 'text 为空'}, 400)
            rec = {
                'ts': int(payload.get('ts') or int(time.time() * 1000)),
                'rating': rating,
                'note': str(payload.get('note') or '')[:120],
                'text': text,
                'prompt': str(payload.get('prompt') or '')[:1500],
                'mode': str(payload.get('mode') or '')[:20],
                'depth': str(payload.get('depth') or '')[:20],
                'round': payload.get('round'),
                'ua': str(payload.get('ua') or '')[:120],
            }
            path = os.path.join(ROOT, '_dev', 'feedback.jsonl')
            with open(path, 'a', encoding='utf-8') as f:
                f.write(json.dumps(rec, ensure_ascii=False) + '\n')
            print(f'[feedback] {rating} | {rec["text"][:24]}')
            return self._json({'ok': True, 'count': _feedback_count()})
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)


    def _report(self):
        """举报通道（2026-11-11）。

        奖励设计：**提交不加分，人工判定有效才加分**（有效 +10，无效 -2）。
        为什么不在提交时加：不这么做就会有人刷「随便举报」白拿奖励。
        为什么无效要扣分：只奖不罚，刷子依然能靠量堆收益。
        """
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            text = str(payload.get('text') or '').strip()[:500]
            reason = str(payload.get('reason') or '').strip()[:200]
            visitor = str(payload.get('visitor') or '').strip()[:64] or 'anonymous'
            if not text:
                return self._json({'ok': False, 'error': 'text 为空'}, 400)
            if not _report_rate_ok(visitor):
                return self._json({'ok': False, 'error': '举报太频繁（1 分钟最多 3 条）'}, 429)
            rid = 'r' + str(int(time.time() * 1000)) + '-' + str(len(_credits_load()) + 1)
            rec = {
                'id': rid, 'ts': int(time.time() * 1000),
                'visitor': visitor, 'text': text, 'reason': reason,
                'prompt': str(payload.get('prompt') or '')[:1500],
                'status': 'pending',
                'auto': _check_text(text),
            }
            _append_jsonl(_REPORT_PATH, rec)
            print(f'[report] {rid} pending | {text[:24]}')
            return self._json({
                'ok': True, 'id': rid, 'status': 'pending',
                'note': '待人工确认；确认有效后加 10 分，无效扣 2 分',
            })
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)

    def _review_list(self):
        """给抽检脚本取待审列表：GET /api/review?n=20"""
        try:
            qs = self.path.split('?', 1)[1] if '?' in self.path else ''
            n = 20
            for part in qs.split('&'):
                if part.startswith('n='):
                    try:
                        n = max(1, min(200, int(part[2:])))
                    except Exception:
                        pass
            items = []
            if os.path.exists(_USAGE_PATH):
                with open(_USAGE_PATH, encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if not line:
                            continue
                        try:
                            rec = json.loads(line)
                        except Exception:
                            continue
                        if rec.get('level') in ('review', 'block'):
                            items.append(rec)
            items = items[-200:]
            return self._json({'ok': True, 'total': len(items), 'items': items[-n:]})
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)


    def _stats(self):
        """GET /api/stats?days=7&format=text"""
        try:
            qs = self.path.split('?', 1)[1] if '?' in self.path else ''
            days, fmt = 7, 'json'
            for part in qs.split('&'):
                if part.startswith('days='):
                    try:
                        days = max(1, min(365, int(part[5:])))
                    except Exception:
                        pass
                elif part.startswith('format='):
                    fmt = part[7:]
            p = _stats_payload(days)
            if fmt == 'text':
                body = _stats_text(p).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            return self._json(p)
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)

    def _log(self):
        """POST /api/log —— 客户端每次生成上报一条（不含生成结果）

        只记输入文本与合规判级。**不记输出**：
        输出能从输入重算，多存一份只是多一份泄露面。
        文本要留给人工抽检，所以必须和体验指南里写的「会记录输入」对上。
        """
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            text = str(payload.get('text') or '').strip()[:500]
            if not text:
                return self._json({'ok': False, 'error': 'text 为空'}, 400)
            visitor = str(payload.get('visitor') or '').strip()[:64] or 'anonymous'
            cmp = _check_text(text)
            _append_jsonl(_USAGE_PATH, {
                'ts': int(time.time() * 1000), 'kind': 'gen',
                'visitor': visitor, 'text': text,
                'mode': str(payload.get('mode') or '')[:24],
                'level': cmp['level'], 'reasons': cmp['reasons'],
            })
            return self._json({'ok': True, 'level': cmp['level']})
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)


    def _parse_handler(self):
        """POST /api/parse {text} → {ok, data:{角色,场景,...,raw:[...]}, cached}"""
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            text = str(payload.get('text') or '').strip()[:500]
            if not text:
                return self._json({'ok': False, 'error': 'text 为空'}, 400)
            # 输入侧合规：不合规的不要送去模型
            cmp = _check_text(text)
            if cmp['level'] == 'block':
                return self._json({'ok': False, 'blocked': True,
                                   'error': '输入命中合规规则：' + '；'.join(cmp['reasons'])}, 400)
            data, cached = _do_parse(text)
            if data is None:
                return self._json({'ok': False, 'error': '抽取失败（模型不可用或返回非法 JSON）'}, 502)
            print(f'[parse] {"cache" if cached else "llm"} | {text[:24]} | raw={data.get("raw")}')
            return self._json({'ok': True, 'data': data, 'cached': cached})
        except Exception as e:
            return self._json({'ok': False, 'error': str(e)}, 500)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
    # 2026-11-11 压测发现：默认监听队列只有 5。
    # 50 个并发连接一上来，accept 队列溢出 → 客户端拿到 ECONNREFUSED，
    # 服务端抛 ConnectionResetError (WinError 10054)。
    # 实测 10 个并发就够把它打崩。提到 512。
    request_queue_size = 512


if __name__ == '__main__':
    os.chdir(ROOT)
    print(f"serving {ROOT}")
    print(f"  http://127.0.0.1:{PORT}/index.html")
    print(f"  http://127.0.0.1:{PORT}/test-semantic.html")
    print(f"  http://127.0.0.1:{PORT}/test-arbiter.html")
    print(f"  POST http://127.0.0.1:{PORT}/api/embed")
    if os.path.exists(os.path.join(ROOT, 'vectors.bin')):
        print("  vectors.bin 已存在，前端将直接读取")
    else:
        print("  ⚠ 未找到 vectors.bin，请先运行 python precompute.py")

    # ---- 监听地址与局域网地址（2026-11-11）----
    if HOST in ('0.0.0.0', '::'):
        print("\n已开启局域网访问（PL_HOST=0.0.0.0）。同一 Wi-Fi 下的人可以用下面的地址打开：")
        try:
            import socket
            for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
                ip = info[4][0]
                if ip and not ip.startswith('127.'):
                    print(f"  http://{ip}:{PORT}/")
        except Exception as e:
            print(f"  （取本机 IP 失败：{e}）")
        print("  注意：这是明文 HTTP，仅在同局域网内试用于少数几个人。")
    else:
        print(f"\n只监听 127.0.0.1（只有本机能访问）。要让别人打开：")
        print(f"  Windows PowerShell: $env:PL_HOST='0.0.0.0'; python serve.py {PORT}")

    if ACCESS_CODE:
        print(f"\n已开启访问码保护：/api/* 需要 X-PL-Code 头，或链接带 ?code=***")
    else:
        print("\n未设访问码（PL_ACCESS_CODE）。如果要公开出去，请务必设置，"
              "否则任何人调用 /api/infer 都在花你的 key。")

    with Server((HOST, PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nbye")
