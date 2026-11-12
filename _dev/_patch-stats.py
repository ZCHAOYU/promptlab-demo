# -*- coding: utf-8 -*-
"""给 serve.py 加 /api/stats + /api/log（2026-11-11）

/api/stats  测试期看板：用量 / 推理成本 / 合规拦截 / 举报 / 抽检进度 / 延迟
/api/log    客户端每次生成上报一条（不含生成结果，只记输入与合规判级）

为什么要有 /api/log：
  现在 usage-log 只记 /api/infer，所以「用户点了几次生成」根本看不到。
  50 人测试期间最该知道的恰恰是这个——用得多不多、卡在哪、拦了多少。
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'serve.py')
s = io.open(P, encoding='utf-8').read()

if '_stats_payload' in s:
    print('已经加过，跳过'); raise SystemExit(0)

HELPER = '''

# ============================================================
# 测试期看板（2026-11-11）
# ------------------------------------------------------------
# 数据全部来自本地 jsonl，不引入数据库。
# 关键取舍：**没有的字段不猜**。成本按「约 ¥0.003/次推理」估，
# 并且明确标成估算值——把估算当真数写进看板，比不给数字更糟。
# ============================================================
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
            cat = reason.split('：')[0]
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
            'infer_cache': _feedback_count() if False else None,
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
            'llm_calls': _usage.get('calls', 0),
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
    L.append('  估算 ¥%.3f  |  LLM 累计 %d 次  prompt %d / completion %d tokens' % (
        p['cost']['est_cny'], p['cost']['llm_calls'], p['cost']['prompt_tokens'], p['cost']['completion_tokens']))
    if p['by_day']:
        L.append('')
        L.append('按日')
        for d, v in p['by_day'].items():
            L.append('  %s  生成 %-4d 推理 %-4d 拦 %-3d 审 %-3d' % (d, v['gen'], v['infer'], v['block'], v['review']))
    return '\\n'.join(L)

'''

anchor = '\nclass Handler(http.server.SimpleHTTPRequestHandler):'
assert anchor in s
s = s.replace(anchor, HELPER + anchor, 1)

# 路径常量
s = s.replace("_CREDIT_PATH = os.path.join(ROOT, '_dev', 'credits.json')",
              "_CREDIT_PATH = os.path.join(ROOT, '_dev', 'credits.json')\n_DECISION_PATH = os.path.join(ROOT, '_dev', 'review-decisions.jsonl')", 1)

# 路由
s = s.replace("""        if self.path.startswith('/api/report'):
            return self._report()""",
"""        if self.path.startswith('/api/report'):
            return self._report()
        if self.path.startswith('/api/log'):
            return self._log()""", 1)

s = s.replace("""        if self.path.startswith('/api/review'):
            return self._review_list()""",
"""        if self.path.startswith('/api/stats'):
            return self._stats()
        if self.path.startswith('/api/review'):
            return self._review_list()""", 1)

METHODS = '''
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

'''
s = s.replace('    def log_message(self, fmt, *args):', METHODS + '    def log_message(self, fmt, *args):', 1)

io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('serve.py: /api/stats + /api/log 已加')
