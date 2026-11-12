'use strict';
/* 文档结构检查（2026-11-11）
   ============================================================
   从 audit-docs.js 抽出来的，因为要能被测试单独调用。
   一个检查如果不能用「故意造一个坏样本」证明它会报错，那它只是装饰。

   三类判据：
     1 编号倒挂（ERROR）  ### NN. 落在 ## MM. 里且 NN > MM → 该提升为顶层
     2 目录不同步（ERROR）目录条目数 ≠ 顶层节数
     3 编号子项提示（WARN）无编号父节下有一堆编号子项，10 以上疑似该提升
        —— 有意做分组时，在那一节里写 <!-- 允许分组 --> 即可豁免
*/
const fs = require('fs');
const path = require('path');

/* 标题规范化：去掉「45.」「十一、」这类编号前缀，以及结尾的「（2026-11-11）」
   让正文标题和目录条目能直接比对。 */
function normTitle(t) {
    return String(t || '')
        .trim()
        .replace(/^\d+\.\s+/, '')
        .replace(/^[一二三四五六七八九十]+、\s*/, '')
        .replace(/（\d{4}-\d{2}-\d{2}）\s*$/, '')
        .trim();
}

function checkText(name, text) {
    const errs = [];
    const warns = [];
    const lines = String(text).split('\n');

    let curH2 = null;
    let curH2Num = null;
    let curGroup = [];
    let curGroupLine = 0;
    let curAllowGroup = false;
    let h2Count = 0;
    let tocItems = 0;
    const topTitles = [];   // 顶层节的规范化标题
    const tocTitles = [];   // 目录里的条目（去掉 "- " 前缀）
    const seenNums = new Set();
    let inToc = false;

    function flushGroup() {
        if (curGroup.length && !curAllowGroup) {
            const min = Math.min.apply(null, curGroup);
            const max = Math.max.apply(null, curGroup);
            const big = max >= 10;
            warns.push(name + ':' + curGroupLine + ' 「' + String(curH2).replace(/^## /, '') + '」下有 ' +
                curGroup.length + ' 个编号子项（' + min + '–' + max + '）' +
                (big ? '  ← 疑似该提升为顶层节' : '  ← 小项编号，通常没问题'));
        }
        curGroup = [];
        curAllowGroup = false;
    }

    lines.forEach(function (ln, i) {
        const where = name + ':' + (i + 1);

        if (/^## 目录\s*$/.test(ln)) { inToc = true; return; }
        if (inToc) {
            if (/^---\s*$/.test(ln)) inToc = false;
            else if (/^- /.test(ln)) { tocItems++; tocTitles.push(normTitle(ln.replace(/^-\s+/, ''))); }
            return;
        }

        if (/^## /.test(ln)) {
            flushGroup();
            if (/^## (一页摘要|目录)\s*$/.test(ln)) { curH2 = null; curH2Num = null; return; }
            h2Count++;
            topTitles.push(normTitle(ln.replace(/^##\s+/, '')));
            const m = ln.match(/^## (\d+)\.\s+/);
            curH2 = ln;
            curH2Num = m ? parseInt(m[1], 10) : null;
            curGroupLine = i + 1;
            if (curH2Num !== null) {
                if (seenNums.has(curH2Num)) errs.push(where + ' 顶层节编号重复：' + curH2Num);
                seenNums.add(curH2Num);
            }
            return;
        }

        if (/<!--\s*(允许分组|allow-group)\s*-->/.test(ln)) { curAllowGroup = true; return; }

        const m = ln.match(/^### (\d+)\.\s+/);
        if (!m) return;
        const n = parseInt(m[1], 10);

        if (curH2Num !== null) {
            if (n > curH2Num) {
                errs.push(where + ' 编号倒挂：### ' + n + '. 落在 ## ' + curH2Num + '. 之下（应提升为顶层节）');
            }
        } else if (curH2) {
            curGroup.push(n);
            if (!curGroupLine) curGroupLine = i + 1;
        }
    });
    flushGroup();

    /* 目录检查：逐条比对标题，不只比数量。
       数量相同也可能「缺一条 + 多算一条」地互相抵消。 */
    if (tocItems > 0) {
        topTitles.forEach(function (t) {
            if (tocTitles.indexOf(t) < 0) {
                errs.push(name + ' 目录缺条目：「' + t + '」（该节没有出现在目录里）');
            }
        });
        tocTitles.forEach(function (t) {
            if (topTitles.indexOf(t) < 0) {
                errs.push(name + ' 目录多条目：「' + t + '」（目录里有，正文里找不到同名节）');
            }
        });
        if (!topTitles.length && tocItems !== h2Count) {
            errs.push(name + ' 目录不同步：目录 ' + tocItems + ' 条，顶层节 ' + h2Count + ' 个');
        }
    }
    return { errs: errs, warns: warns };
}

function checkDocStructure(files, root) {
    /* 2026-11-11 事故：抽出模块后，调用处写成 checkDocStructure()（没传参），
       于是遍历空数组、永远 0 错误，一直报「✓ 正常」——一个什么都不查的检查器。
       所以这里改成缺参数直接抛：宁可崩，也不要静默通过。 */
    if (!Array.isArray(files) || !files.length) {
        throw new Error("checkDocStructure 需要文件列表，例如 checkDocStructure(['开发日志-2026-11-09.md'])");
    }
    const R = root || path.join(__dirname, '..');
    const errs = [];
    const warns = [];
    files.forEach(function (name) {
        const fp = path.join(R, name);
        if (!fs.existsSync(fp)) return;
        const r = checkText(name, fs.readFileSync(fp, 'utf8'));
        errs.push.apply(errs, r.errs);
        warns.push.apply(warns, r.warns);
    });
    return { errs: errs, warns: warns };
}

module.exports = { checkDocStructure, checkText };
