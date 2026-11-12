'use strict';
/* 合规判据（Trie / DFA 实现，2026-11-11）
   ============================================================
   第一版是一条条 indexOf 扫，词表上到几百条就慢、而且每加一类就要多扫一遍。
   改成 Trie（中文生态里通称 DFA，参考开源的 sieve / go-sensitive / sensitive-word）：
   一次扫描 O(文本长度 × 最大词长)，词表多大都不影响遍历次数的数量级。

   两个使用面：
     checkText(text)        —— 输入侧过滤（用户写的那句话）
     checkCompliance(entry) —— 入库侧闸门（推理词条的所有字段拼起来查）

   分级：block（硬拒）/ ip（不入库）/ review（打标人工看）/ combo（组合规则）

   边界（写在代码里，防止有人当成保证）：
     关键词匹配挡不住变体、拼音、拆字、隐喻。加空白/符号粘连能挡，
     拼音和拆字挡不住。这是第一道筛子。
*/
const fs = require('fs');
const path = require('path');

/* ---------------- Trie ---------------- */
function buildTrie(words) {
    const root = { next: Object.create(null), word: '' };
    for (const w of words) {
        if (!w) continue;
        let node = root;
        const s = String(w).toLowerCase();
        for (const ch of s) {
            let nx = node.next[ch];
            if (!nx) { nx = { next: Object.create(null), word: '' }; node.next[ch] = nx; }
            node = nx;
        }
        node.word = String(w);            // 记原词，报原因时用原写法
    }
    return root;
}

/* 在 text 里扫一遍，返回命中的所有词（去重） */
function scan(trie, text) {
    const t = String(text || '').toLowerCase();
    const hits = new Set();
    for (let i = 0; i < t.length; i++) {
        let node = trie;
        for (let j = i; j < t.length; j++) {
            node = node.next[t[j]];
            if (!node) break;
            if (node.word) hits.add(node.word);
        }
    }
    return [...hits];
}

/* 紧凑写法：去掉空白与常见分隔符，「全 裸」「全-裸」「全*裸」也能命中 */
function compact(s) {
    return String(s || '').replace(/[\s\-_·•|/\\.,，。、；;：:！!？?（）()【】\[\]"'“”‘’<>]+/g, '');
}

/* ---------------- 词表 ---------------- */
let LIST = null;
let TRIES = null;

function loadList() {
    if (LIST) return LIST;
    LIST = JSON.parse(fs.readFileSync(path.join(__dirname, 'compliance-list.json'), 'utf8'));
    return LIST;
}

function getTries() {
    if (TRIES) return TRIES;
    const L = loadList();
    const flat = (obj) => Object.keys(obj || {})
        .filter(k => k.charAt(0) !== '_')
        .reduce((a, k) => a.concat(obj[k] || []), []);
    TRIES = {
        block: buildTrie(flat(L.block)),
        ip: buildTrie(flat(L.ip)),
        review: buildTrie(flat(L.review)),
        comboMinor: buildTrie((L.combo && L.combo['未成年性化'] && L.combo['未成年性化'].minor) || []),
        comboSexual: buildTrie((L.combo && L.combo['未成年性化'] && L.combo['未成年性化'].sexual) || []),
        // 分类映射：词 → 类别名，报原因时用
        catOf: (() => {
            const m = Object.create(null);
            ['block', 'ip', 'review'].forEach(level => {
                Object.keys(L[level] || {}).forEach(cat => {
                    if (cat.charAt(0) === '_') return;
                    (L[level][cat] || []).forEach(w => { m[String(w).toLowerCase()] = cat; });
                });
            });
            return m;
        })()
    };
    return TRIES;
}

/* ---------------- 对外：输入侧 ---------------- */
/**
 * @returns {{level:'ok'|'block'|'review', reasons:string[], hits:string[]}}
 */
function checkText(text) {
    const raw = String(text || '');
    if (!raw.trim()) return { level: 'ok', reasons: [], hits: [] };
    const T = getTries();
    const packed = compact(raw);

    const hitsOf = (trie) => {
        const a = scan(trie, raw);
        const b = scan(trie, packed);
        return [...new Set(a.concat(b))];
    };

    const reasons = [];

    // 1) 硬拒绝
    const blockHits = hitsOf(T.block);
    if (blockHits.length) {
        reasons.push('block：' + blockHits.slice(0, 4).map(w => w + '(' + (T.catOf[String(w).toLowerCase()] || '?') + ')').join('、'));
    }

    // 2) 组合规则：未成年 + 性化
    const minor = hitsOf(T.comboMinor);
    const sexual = hitsOf(T.comboSexual);
    if (minor.length && sexual.length) {
        reasons.push('block/组合：未成年性化（' + minor.slice(0, 2).join('、') + ' + ' + sexual.slice(0, 2).join('、') + '）');
    }

    if (reasons.length) return { level: 'block', reasons: reasons, hits: blockHits.concat(minor, sexual) };

    // 3) 受保护 IP：输入侧不硬拒（用户可能只是问「皮卡丘风格怎么画」），但要人工看
    const ipHits = hitsOf(T.ip);
    if (ipHits.length) {
        reasons.push('review/ip：' + ipHits.slice(0, 3).map(w => w + '(' + (T.catOf[String(w).toLowerCase()] || '?') + ')').join('、'));
    }

    // 4) 其他 review
    const revHits = hitsOf(T.review);
    if (revHits.length) {
        reasons.push('review：' + revHits.slice(0, 3).map(w => w + '(' + (T.catOf[String(w).toLowerCase()] || '?') + ')').join('、'));
    }

    if (reasons.length) return { level: 'review', reasons: reasons, hits: ipHits.concat(revHits) };
    return { level: 'ok', reasons: [], hits: [] };
}

/* ---------------- 对外：入库侧闸门 ---------------- */
function entryText(e) {
    const parts = [
        e.subject, e.short, e.worn, e.outward, e.pose, e.en_core,
        Array.isArray(e.en_worn) ? e.en_worn.join(' ') : e.en_worn,
        Array.isArray(e.en_tags) ? e.en_tags.join(' ') : e.en_tags
    ];
    return parts.filter(Boolean).join(' ');
}

/**
 * @returns {{level:'ok'|'block'|'review', reasons:string[]}}
 */
function checkCompliance(e) {
    const r = checkText(entryText(e));
    // 入库侧更严：ip 级也不让它进词库（输入侧只是 review）
    const L = loadList();
    const text = entryText(e);
    const T = getTries();
    const ipHits = [...new Set(scan(T.ip, text).concat(scan(T.ip, compact(text))))];
    if (r.level === 'block') return { level: 'block', reasons: r.reasons };
    if (ipHits.length) {
        return {
            level: 'block',
            reasons: ['ip/' + (T.catOf[String(ipHits[0]).toLowerCase()] || '?') + '：' + ipHits.slice(0, 3).join('、')]
        };
    }
    return { level: r.level, reasons: r.reasons };
}

/* 给管线用的闸门封装：返回 [] 表示通过 */
function gateCompliance(e) {
    const r = checkCompliance(e);
    return r.level === 'ok' ? [] : r.reasons;
}

module.exports = { checkText, checkCompliance, gateCompliance, loadList, entryText, compact, buildTrie, scan };
