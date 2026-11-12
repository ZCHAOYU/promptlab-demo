# -*- coding: utf-8 -*-
"""给 serve.py 加三样（2026-11-11）：
   1 输入侧过滤（Trie，和服务端判据一致；命中 block 就不调模型）
   2 使用日志（供人工抽检抽样）
   3 举报通道 + 积分奖励 + 频率限制
另加 GET /api/review 给抽检脚本取待审列表。

判据来源和 _dev/compliance-gate.js 共用同一份 _dev/compliance-list.json。
两套实现是风险点，所以另有一致性测试（_dev/verify-guard-parity.js）盯着。
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'serve.py')
s = io.open(P, encoding='utf-8').read()

if '_check_text' in s:
    print('已经加过，跳过'); raise SystemExit(0)

HELPERS = '''

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
    return re.sub(r'[\\s\\-_·•|/\\\\.,，。、；;：:！!？?（）()【】\\[\\]"\\'“”‘’<>]+', '', str(s or ''))


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

    reasons = []
    b = hits('block')
    if b:
        reasons.append('block：' + '、'.join(b[:4]))
    minor, sexual = hits('minor'), hits('sexual')
    if minor and sexual:
        reasons.append('block/组合：未成年性化（' + '、'.join(minor[:2]) + ' + ' + '、'.join(sexual[:2]) + '）')
    if reasons:
        return {'level': 'block', 'reasons': reasons}

    ip = hits('ip')
    if ip:
        reasons.append('review/ip：' + '、'.join(ip[:3]))
    rv = hits('review')
    if rv:
        reasons.append('review：' + '、'.join(rv[:3]))
    if reasons:
        return {'level': 'review', 'reasons': reasons}
    return {'level': 'ok', 'reasons': []}


# ---- 追加写 JSONL 的小工具 ----
def _append_jsonl(path, rec):
    try:
        with open(path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\\n')
        return True
    except Exception as e:
        print(f'[log] 写入失败 {path}: {e}')
        return False


_USAGE_PATH = os.path.join(ROOT, '_dev', 'usage-log.jsonl')
_REPORT_PATH = os.path.join(ROOT, '_dev', 'reports.jsonl')
_CREDIT_PATH = os.path.join(ROOT, '_dev', 'credits.json')

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

'''

anchor = '\nclass Handler(http.server.SimpleHTTPRequestHandler):'
assert anchor in s, '找不到 Handler 类'
s = s.replace(anchor, HELPERS + anchor, 1)

# ---- 路由：GET /api/review、POST /api/report ----
s = s.replace("""        if self.path.startswith('/api/feedback'):
            return self._feedback()""",
"""        if self.path.startswith('/api/feedback'):
            return self._feedback()
        if self.path.startswith('/api/report'):
            return self._report()""", 1)

s = s.replace("""        if self._deny_for_static(self.path):
            return self._json({'ok': False, 'error': 'not found'}, 404)""",
"""        if self.path.startswith('/api/review'):
            return self._review_list()
        if self._deny_for_static(self.path):
            return self._json({'ok': False, 'error': 'not found'}, 404)""", 1)

# ---- /api/infer：先过输入侧过滤，再进模型 ----
s = s.replace("""            print(f'[infer] {mode} | {text}')""",
"""            # 输入侧过滤：命中 block 直接拒，不花一次模型调用
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
            print(f'[infer] {mode} | {text}')""", 1)

# ---- 两个处理方法 ----
METHODS = '''
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

'''
s = s.replace('    def log_message(self, fmt, *args):', METHODS + '    def log_message(self, fmt, *args):', 1)

io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('serve.py 已打补丁')
