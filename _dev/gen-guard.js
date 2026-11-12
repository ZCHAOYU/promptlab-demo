'use strict';
/* 把 compliance-list.json 生成成浏览器可用的 guard-data.js（2026-11-11）
   ============================================================
   为什么要生成而不是手写：词表只有一份（compliance-list.json），
   浏览器侧、Node 侧、服务端侧都从它派生。
   手写第二份必然分叉 —— 今天已经栽过一次。

   生成物：guard-data.js（挂 window.__GUARD，含 Trie + checkText）
   用法：node _dev/gen-guard.js
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'compliance-list.json');
const OUT = path.join(ROOT, 'guard-data.js');

const list = JSON.parse(fs.readFileSync(SRC, 'utf8'));

function flat(obj) {
    return Object.keys(obj || {}).filter(k => k.charAt(0) !== '_')
        .reduce((a, k) => a.concat(obj[k] || []), []);
}
const combo = (list.combo || {})['未成年性化'] || {};

const data = {
    block: flat(list.block),
    ip: flat(list.ip),
    review: flat(list.review),
    minor: combo.minor || [],
    sexual: combo.sexual || []
};

/* 词 → 类别（报原因用） */
const catOf = {};
['block', 'ip', 'review'].forEach(function (level) {
    Object.keys(list[level] || {}).forEach(function (cat) {
        if (cat.charAt(0) === '_') return;
        (list[level][cat] || []).forEach(function (w) { catOf[String(w).toLowerCase()] = cat; });
    });
});

const out = `/* guard-data.js —— 生成文件，不要手改（2026-11-11）
   来源：_dev/compliance-list.json
   生成：node _dev/gen-guard.js
   浏览器侧的输入过滤用这一份；Node / Python 侧用的是同一个 JSON，
   保证三处判据同源（有 _dev/verify-guard-parity.js 盯着是否一致）。 */
(function () {
  var RAW = ${JSON.stringify(data)};
  var CAT = ${JSON.stringify(catOf)};

  function buildTrie(words) {
    var root = { n: {}, w: '' };
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (!w) continue;
      var node = root;
      var s = String(w).toLowerCase();
      for (var j = 0; j < s.length; j++) {
        var ch = s[j];
        if (!node.n[ch]) node.n[ch] = { n: {}, w: '' };
        node = node.n[ch];
      }
      node.w = String(w);
    }
    return root;
  }

  var T = {
    block: buildTrie(RAW.block),
    ip: buildTrie(RAW.ip),
    review: buildTrie(RAW.review),
    minor: buildTrie(RAW.minor),
    sexual: buildTrie(RAW.sexual)
  };

  function compact(s) {
    return String(s || '').replace(/[\\s\\-_·•|\\/\\\\.,，。、；;：:！!？?（）()【】\\[\\]"'“”‘’<>]+/g, '');
  }

  function scan(trie, text) {
    var t = String(text || '').toLowerCase();
    var hits = [], seen = {};
    for (var i = 0; i < t.length; i++) {
      var node = trie;
      for (var j = i; j < t.length; j++) {
        node = node.n[t[j]];
        if (!node) break;
        if (node.w && !seen[node.w]) { seen[node.w] = 1; hits.push(node.w); }
      }
    }
    return hits;
  }

  function hitsAll(key, raw, packed) {
    var a = scan(T[key], raw), b = scan(T[key], packed);
    var out = [], seen = {};
    a.concat(b).forEach(function (w) { if (!seen[w]) { seen[w] = 1; out.push(w); } });
    return out;
  }

  function label(w) { return w + '(' + (CAT[String(w).toLowerCase()] || '?') + ')'; }

  /* 输入侧判定：block 硬拒；ip / review 只打标 */
  function checkText(text) {
    var raw = String(text || '');
    if (!raw.trim()) return { level: 'ok', reasons: [], hits: [] };
    var packed = compact(raw);
    var reasons = [];

    var b = hitsAll('block', raw, packed);
    if (b.length) reasons.push('block：' + b.slice(0, 4).map(label).join('、'));

    var mn = hitsAll('minor', raw, packed);
    var sx = hitsAll('sexual', raw, packed);
    if (mn.length && sx.length) {
      reasons.push('block/组合：未成年性化（' + mn.slice(0, 2).join('、') + ' + ' + sx.slice(0, 2).join('、') + '）');
    }
    if (reasons.length) return { level: 'block', reasons: reasons, hits: b.concat(mn, sx) };

    var ip = hitsAll('ip', raw, packed);
    if (ip.length) reasons.push('review/ip：' + ip.slice(0, 3).map(label).join('、'));
    var rv = hitsAll('review', raw, packed);
    if (rv.length) reasons.push('review：' + rv.slice(0, 3).map(label).join('、'));

    if (reasons.length) return { level: 'review', reasons: reasons, hits: ip.concat(rv) };
    return { level: 'ok', reasons: [], hits: [] };
  }

  window.__GUARD = {
    version: '${new Date().toISOString().slice(0, 10)}',
    count: { block: RAW.block.length, ip: RAW.ip.length, review: RAW.review.length },
    checkText: checkText
  };
})();
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log('已生成 guard-data.js（' + Math.round(out.length / 1024) + ' KB）');
console.log('  词表：block ' + data.block.length + ' / ip ' + data.ip.length +
    ' / review ' + data.review.length + ' / minor ' + data.minor.length + ' / sexual ' + data.sexual.length);
