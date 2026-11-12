/* app-ui.js —— 界面层：渲染、历史、反馈、版本条、首次引导、服务状态。
   这一层碰 DOM，是唯一有副作用的地方。
   从 app.js 拆出（2026-11-11），只搬函数、不动顶层 const/let。
   加载顺序见 index.html：detect → fill → assemble → ui → app.js。 */

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============================================================
// 将最终 fills 同步到 SmartEngine 分析，保证推理面板与 UI 检测结果一致
// ============================================================
function syncAnalysisWithFills(analysis, fills) {
  if (!analysis || !analysis.dimensions) return;
  for (const [dim, value] of Object.entries(fills)) {
    if (!value) continue;
    const existing = analysis.dimensions[dim];
    if (existing && existing.value === value) continue;
    analysis.dimensions[dim] = {
      value: value,
      score: existing ? existing.score : 0,
      confidence: existing && existing.value === value ? existing.confidence : 100,
      keywords: existing ? existing.keywords : [],
      source: 'ui'
    };
  }
  // 重新生成推理与决策来源，与最终 fills 保持一致
  if (typeof generateReasoning === 'function') {
    analysis.reasoning = generateReasoning(analysis.dimensions);
  }
  if (typeof generateDecisionSource === 'function') {
    analysis.decisionSource = generateDecisionSource(analysis.dimensions);
  }
}

function renderSmartPanel(analysis) {
  if (!analysis) {
    smartPanel.classList.remove('visible');
    return;
  }

  smartPanel.classList.add('visible');
  smartPanel.classList.remove('collapsed');
  smartPanelHeader.querySelector('.smart-panel-toggle').textContent = '▲';

  // 意图扩展
  smartExpansionText.textContent = analysis.expansion;

  // 推理过程
  smartReasoningItems.innerHTML = '';
  const dimOrder = ['style', 'scene', 'lighting', 'color', 'atmosphere', 'composition', 'quality', 'character', 'gender'];
  for (const dim of dimOrder) {
    const r = analysis.reasoning[dim];
    if (!r) continue;
    const item = document.createElement('div');
    item.className = 'smart-reasoning-item source-' + r.source;

    let confClass = 'low';
    if (r.confidence >= 80) confClass = 'high';
    else if (r.confidence >= 50) confClass = 'mid';

    const hits = r.keywords.length > 0
      ? `<span class="smart-reasoning-hits">命中: ${r.keywords.join('、')}</span>`
      : '';

    item.innerHTML = `
      <div class="smart-reasoning-header">
        <span class="smart-reasoning-dim">${r.label} · ${r.value}</span>
        <span class="smart-reasoning-confidence ${confClass}">${r.confidence}%</span>
      </div>
      <div class="smart-reasoning-bar">
        <div class="smart-reasoning-bar-fill ${confClass}" style="width:${r.confidence}%"></div>
      </div>
      <div class="smart-reasoning-detail">
        ${hits ? hits + '<br>' : ''}推理: ${r.logic}
      </div>`;
    smartReasoningItems.appendChild(item);
  }

  // 决策来源
  const ds = analysis.decisionSource;
  const parts = [];
  if (ds.layer1.length > 0) {
    parts.push(`<span class="smart-decision-src l1">Layer 1 关键词</span> → ${ds.layer1.join('、')}`);
  }
  if (ds.layer1Cross.length > 0) {
    parts.push(`<span class="smart-decision-src cross">交叉推断</span> → ${ds.layer1Cross.join('、')}`);
  }
  if (ds.layer2.length > 0) {
    parts.push(`<span class="smart-decision-src l2">Layer 2 ${analysis.templateName ? '"' + analysis.templateName + '"' : '模板'}</span> → ${ds.layer2.join('、')}`);
  }
  smartDecisionRow.innerHTML = parts.join('<br>');
}

function liveDetect() {
  clearTimeout(liveDetectTimer);
  liveDetectTimer = setTimeout(() => {
    const text = input.value.trim();
    if (!text) {
      resetAllResults();
      return;
    }
    const detection = detectDimensions(text, currentMode);

    // ===== COHERENCE CHECK: 实时检测也确保人物和风格不冲突 =====
    const detectedChar = detection.character && detection.character.detected;
    const detectedStyle = detection.style && detection.style.detected;
    if (detectedChar && detectedStyle && CHARACTER_STYLE_COMPAT[detectedChar]) {
      if (!CHARACTER_STYLE_COMPAT[detectedChar].includes(detectedStyle)) {
        // Style incompatible with character — override style detection
        detection.style.detected = CHARACTER_STYLE_COMPAT[detectedChar][0];
        detection.style.keywords = ['(coherence override)'];
      }
    }

    updateDimTags(detection);
  }, 300);
}

function resetDimTags() {
  dimTags.forEach(tag => {
    tag.classList.remove('detected', 'missing');
    const valSpan = tag.querySelector('.dim-value');
    if (tag.dataset.dim === 'platform') {
      valSpan.textContent = '通用';
    } else {
      valSpan.textContent = '未检测';
    }
  });
}

// ============================================================
// 完整重置：清空输入后同步清空所有结果区（问题8/11）
// ============================================================
function resetAllResults() {
  resetDimTags();

  // 隐藏输出区
  outputSection.classList.remove('visible');

  // 清空过程网格
  const grid = document.getElementById('processGrid');
  if (grid) grid.innerHTML = '';

  // 重置摘要与结果标签
  dimSummary.textContent = '';
  const resultTagEl = document.getElementById('resultTag');
  if (resultTagEl) resultTagEl.textContent = '';

  // 清空优化结果
  optimizedDisplay.innerHTML = '';
  // 版本条与反馈行跟着结果一起收起来
  try {
    if (window.__verStack) window.__verStack.length = 0;
    const vb = document.getElementById('versionBar'); if (vb) vb.hidden = true;
    const fb = document.getElementById('feedbackRow'); if (fb) fb.hidden = true;
  } catch (e) {}

  // 隐藏负向提示词
  const negPanel = document.getElementById('negativePanel');
  if (negPanel) negPanel.classList.remove('visible');
  const negContent = document.getElementById('negativeContent');
  if (negContent) negContent.innerHTML = '';

  // 隐藏智能建议
  const sugPanel = document.getElementById('suggestionsPanel');
  if (sugPanel) sugPanel.classList.remove('visible');
  const sugList = document.getElementById('suggestionsList');
  if (sugList) sugList.innerHTML = '';

  // 隐藏 AI 思考面板
  smartPanel.classList.remove('visible');

  // 隐藏矛盾警告
  const cw = document.getElementById('contradictionWarning');
  if (cw) cw.classList.remove('visible');

  // 清除缓存结果
  lastResult = null;
  window._lastSuggestions = null;
}

// 清空输入框并重置所有结果
function clearInput() {
  input.value = '';
  charCount.textContent = 0;
  resetAllResults();
  input.focus();
}

function updateDimTags(detection) {
  dimTags.forEach(tag => {
    const dim = tag.dataset.dim;
    const valSpan = tag.querySelector('.dim-value');
    tag.classList.remove('detected', 'missing');

    if (dim === 'platform') {
      if (detection.platform && detection.platform.detected) {
        tag.classList.add('detected');
        valSpan.textContent = detection.platform.detected;
      } else {
        valSpan.textContent = '通用';
      }
      return;
    }

    if (detection[dim] && detection[dim].detected) {
      tag.classList.add('detected');
      valSpan.textContent = detection[dim].detected;
    } else {
      tag.classList.add('missing');
      valSpan.textContent = '待补全';
    }
  });
}

function showCategoryPicker(tag, dim) {
  const dimData = KW_DB[dim];
  if (!dimData || !dimData.categories) return;
  const categories = Object.keys(dimData.categories);
  const current = tag.querySelector('.dim-value').textContent;

  // Remove existing picker
  const existing = document.querySelector('.picker-dropdown');
  if (existing) existing.remove();

  const dropdown = document.createElement('div');
  dropdown.className = 'picker-dropdown';
  dropdown.style.cssText = `
    position: absolute; top: 100%; left: 0; margin-top: 6px;
    background: var(--bg-elevated); border: 1px solid var(--border-active);
    border-radius: var(--radius-md); padding: 8px 0; z-index: 50;
    min-width: 180px; max-height: 240px; overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  `;

  categories.forEach(cat => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 8px 16px; cursor: pointer; font-size: 13px;
      color: ${cat === current ? 'var(--accent)' : 'var(--text-secondary)'};
      transition: all var(--transition);
      background: ${cat === current ? 'var(--accent-glow)' : 'transparent'};
    `;
    item.textContent = cat;
    item.addEventListener('mouseenter', () => {
      item.style.background = cat === current ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)';
      item.style.color = 'var(--text-primary)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = cat === current ? 'var(--accent-glow)' : 'transparent';
      item.style.color = cat === current ? 'var(--accent)' : 'var(--text-secondary)';
    });
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      tag.querySelector('.dim-value').textContent = cat;
      tag.classList.add('detected');
      tag.classList.remove('missing');
      dropdown.remove();
    });
    dropdown.appendChild(item);
  });

  tag.style.position = 'relative';
  tag.appendChild(dropdown);

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closePicker(e) {
      if (!dropdown.contains(e.target) && e.target !== tag) {
        dropdown.remove();
        document.removeEventListener('click', closePicker);
      }
    });
  }, 0);
}

function showPlatformPicker(tag) {
  const platforms = Object.keys(KW_DB.platform.formats);
  const current = tag.querySelector('.dim-value').textContent;

  const existing = document.querySelector('.picker-dropdown');
  if (existing) existing.remove();

  const dropdown = document.createElement('div');
  dropdown.className = 'picker-dropdown';
  dropdown.style.cssText = `
    position: absolute; top: 100%; left: 0; margin-top: 6px;
    background: var(--bg-elevated); border: 1px solid var(--border-active);
    border-radius: var(--radius-md); padding: 8px 0; z-index: 50;
    min-width: 180px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  `;

  platforms.forEach(plat => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 8px 16px; cursor: pointer; font-size: 13px;
      color: ${plat === current ? 'var(--accent)' : 'var(--text-secondary)'};
      transition: all var(--transition);
      background: ${plat === current ? 'var(--accent-glow)' : 'transparent'};
    `;
    item.textContent = plat;
    item.addEventListener('mouseenter', () => {
      item.style.background = plat === current ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)';
      item.style.color = 'var(--text-primary)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = plat === current ? 'var(--accent-glow)' : 'transparent';
      item.style.color = plat === current ? 'var(--accent)' : 'var(--text-secondary)';
    });
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      tag.querySelector('.dim-value').textContent = plat;
      tag.classList.add('detected');
      tag.classList.remove('missing');
      dropdown.remove();
    });
    dropdown.appendChild(item);
  });

  tag.style.position = 'relative';
  tag.appendChild(dropdown);

  setTimeout(() => {
    document.addEventListener('click', function closePicker(e) {
      if (!dropdown.contains(e.target) && e.target !== tag) {
        dropdown.remove();
        document.removeEventListener('click', closePicker);
      }
    });
  }, 0);
}

function detectContradictions(text) {
  const warnings = [];
  for (const pair of CONTRADICTION_PAIRS) {
    const hitA = pair.a.filter(k => text.includes(k));
    const hitB = pair.b.filter(k => text.includes(k));
    if (hitA.length > 0 && hitB.length > 0) {
      warnings.push({
        label: pair.label,
        words: [...hitA.slice(0, 2), ...hitB.slice(0, 2)],
        sideA: hitA.slice(0, 2),
        sideB: hitB.slice(0, 2)
      });
    }
  }
  return warnings;
}

function showContradictionWarnings(text) {
  const el = document.getElementById('contradictionWarning');
  const itemsEl = document.getElementById('contradictionItems');
  const titleEl = document.getElementById('contradictionTitle');
  const hintEl = document.getElementById('contradictionHint');
  if (!el || !itemsEl) return;

  const inputWarnings = detectContradictions(text);
  const allWarnings = [...inputWarnings, ...coherenceWarnings];

  if (allWarnings.length === 0) {
    el.classList.remove('show');
    itemsEl.innerHTML = '';
    return;
  }

  // 标题与提示随冲突类型变化
  const hasInputConflict = inputWarnings.length > 0;
  const hasAppliedAdjust = allWarnings.some(w => w.applied);
  const onlyNoSubject = allWarnings.length > 0 &&
    allWarnings.every(w => w.label === '没认出主体');
  // 方案 A：多主体 / 描述大部分未使用 —— 不阻塞生成，只告知用了多少
  const AUDIT_LABELS = ['多个候选主体', '多个主体', '描述大部分未使用'];
  const onlyAuditHint = allWarnings.length > 0 &&
    allWarnings.every(w => AUDIT_LABELS.indexOf(w.label) >= 0);
  if (titleEl) {
    titleEl.textContent = onlyNoSubject
      ? '没认出主体'
      : (onlyAuditHint
        ? '部分描述未能使用'
        : (hasInputConflict
          ? '检测到描述冲突'
          : (hasAppliedAdjust ? '已自动协调风格' : '风格搭配提示')));
  }
  if (hintEl) {
    hintEl.textContent = onlyNoSubject
      ? '补充一句具体的人或场景，再点一键优化。'
      : (onlyAuditHint
        ? '结果只用了你输入里的一部分，可以补全，或换成更具体的说法。'
        : (hasInputConflict
          ? '系统已按主要意图自动协调冲突维度，可修改输入后重新优化。'
          : (hasAppliedAdjust
            ? '检测到人物与风格不兼容，已自动调整为更协调的组合，可手动修改维度。'
            : '检测到人物与风格搭配较特别，已保留你的选择，如需更协调可手动修改维度。')));
  }

  itemsEl.innerHTML = allWarnings.map(w => {
    let text;
    const action = w.applied ? '已调整为' : '建议调整为';
    if (w.label === '风格协调') {
      text = `· 风格协调：「${w.words[0]}」不兼容「${w.words[1]}」，${action}「${w.words[2]}」`;
    } else if (w.label === '场景协调') {
      text = `· 场景协调：「${w.words[1]}」与「${w.words[0]}」不匹配，${action}「${w.words[2]}」`;
    } else if (w.label === '多个候选主体' || w.label === '多个主体' || w.label === '描述大部分未使用') {
      text = '· ' + w.label + '：' + w.detail;
    } else if (w.label === '没认出主体') {
      // 缺主体不是"冲突"，words 里是两句说明，直接拼接显示
      text = '· ' + w.words.join('；');
    } else {
      // 输入级冲突：按两侧分组显示（优先使用 sideA/sideB，兼容无分组的旧数据）
      let sideA, sideB;
      if (w.sideA && w.sideB) {
        sideA = w.sideA.map(x => `「${x}」`).join('、');
        sideB = w.sideB.map(x => `「${x}」`).join('、');
      } else {
        sideA = w.words.slice(0, 2).map(x => `「${x}」`).join('、');
        sideB = w.words.slice(2).map(x => `「${x}」`).join('、');
      }
      text = `· ${w.label}：${sideA} 与 ${sideB} 同时出现`;
    }
    return `<div class="cw-item">${text}</div>`;
  }).join('');
  el.classList.add('show');
}

function showSubjectConfirm(text) {
  const old = document.getElementById('subjectConfirmMask');
  if (old) old.remove();

  const mask = document.createElement('div');
  mask.id = 'subjectConfirmMask';
  mask.setAttribute('style',
    'position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:10000;' +
    'display:flex;align-items:center;justify-content:center;padding:20px;');

  const card = document.createElement('div');
  card.setAttribute('style',
    'width:440px;max-width:100%;background:#0e0e1a;border:1px solid #2c4660;' +
    'border-radius:14px;padding:22px 24px;color:#e8e8f0;' +
    'box-shadow:0 24px 60px rgba(0,0,0,.7)');

  card.innerHTML =
    '<div style="font-size:15.5px;font-weight:700;color:#ff6b35;margin-bottom:10px">没认出主体</div>' +
    '<div style="font-size:13.5px;line-height:1.75;color:#b9b9cc">' +
      '这句「' + escapeHtml(String(text).slice(0, 30)) + '」里，没能识别出具体的人或场景。' +
      '现在生成的话，出来的会是一组和这句话无关的默认参数。' +
    '</div>' +
    '<div style="margin:14px 0 6px;font-size:12.5px;color:#6a6a80">点一下换成一句能识别的，或者自己改输入框：</div>' +
    '<div id="subjectChips" style="display:flex;flex-wrap:wrap;gap:8px"></div>' +
    '<div style="display:flex;gap:10px;margin-top:20px">' +
      '<button id="subjectCancel" style="flex:1;padding:11px;border-radius:9px;border:1px solid #2c4660;' +
        'background:transparent;color:#b9b9cc;cursor:pointer;font-size:13.5px">去补充</button>' +
      '<button id="subjectGo" style="flex:1;padding:11px;border-radius:9px;border:none;' +
        'background:#00d4ff;color:#04121a;font-weight:700;cursor:pointer;font-size:13.5px">' +
        '仍然生成</button>' +
    '</div>';

  mask.appendChild(card);
  document.body.appendChild(mask);

  function close() { mask.remove(); }

  const chips = card.querySelector('#subjectChips');
  // 示例词必须都能被识别（已用 _dev/verify-chips.js 验证过），否则点了还是白点
  const CHIPS = (currentMode === 'scene')
    ? ['一片竹林', '一座哥特城堡', '一条赛博街区', '一间街角咖啡馆']
    : ['一位老人', '一位剑客', '一位魔法师', '一只猫'];
  const origText = String(input.value || '').trim();
  CHIPS.forEach(function (ex) {
    const b = document.createElement('button');
    b.textContent = ex;
    b.setAttribute('style',
      'padding:7px 12px;border-radius:8px;border:1px solid #2c4660;background:#141422;' +
      'color:#00d4ff;cursor:pointer;font-size:12.5px');
    b.onclick = function () {
      // 替换而非追加：追加会造成「老人，一位老人，一位老人」这种重复
      input.value = ex;
      try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      close();
      if (ex === origText) window.__subjectConfirmFor = ex;   // 防止原地打转
      optimize();
    };
    chips.appendChild(b);
  });

  card.querySelector('#subjectCancel').onclick = function () {
    close();
    input.focus();
    input.style.borderColor = 'var(--warm)';
    setTimeout(function () { input.style.borderColor = ''; }, 1200);
  };

  card.querySelector('#subjectGo').onclick = function () {
    window.__subjectConfirmFor = text;   // 本次文本已确认，不再弹
    close();
    optimize();
  };

  mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
}

// ============================================================
// 负向提示词渲染
// ============================================================
function renderNegativePrompt(analysis) {
  const panel = document.getElementById('negativePanel');
  const content = document.getElementById('negativeContent');

  if (!analysis || !analysis.negativePrompt || analysis.negativePrompt.length === 0) {
    panel.classList.remove('visible');
    return;
  }

  content.innerHTML = analysis.negativePrompt.map(item =>
    `<span class="negative-tag">${item}</span>`
  ).join('');

  panel.classList.add('visible');
}

// ============================================================
// 智能建议渲染
// ============================================================
function renderSuggestions(analysis) {
  const panel = document.getElementById('suggestionsPanel');
  const list = document.getElementById('suggestionsList');

  if (!analysis || !analysis.suggestions || analysis.suggestions.length === 0) {
    panel.classList.remove('visible');
    return;
  }

  list.innerHTML = analysis.suggestions.map((s, i) => `
    <div class="suggestion-item" data-suggestion-index="${i}" title="点击应用此模板重新生成">
      <div class="suggestion-info">
        <div class="suggestion-name">${s.template.name}</div>
        <div class="suggestion-reason">${s.reason}</div>
      </div>
      <div class="suggestion-arrow">→</div>
    </div>
  `).join('');

  panel.classList.add('visible');
  // 缓存建议数据
  window._lastSuggestions = analysis.suggestions;

  // 事件委托：点击建议项
  list.onclick = function(e) {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    const idx = parseInt(item.dataset.suggestionIndex);
    if (!isNaN(idx)) applySuggestion(idx);
  };
}

// ============================================================
// 应用智能建议 — 切换模板重新生成
// ============================================================
function applySuggestion(index) {
  const suggestions = window._lastSuggestions;
  if (!suggestions || !suggestions[index]) return;

  const template = suggestions[index].template;
  const text = input.value.trim();
  if (!text) return;

  // 直接构建：用建议模板的维度构建 fills
  const detection = detectDimensions(text, currentMode);
  const dimKeys = ['style', 'lighting', 'composition', 'color', 'atmosphere', 'quality'];
  for (const dk of dimKeys) {
    if (template.dimensions[dk] && detection[dk]) {
      detection[dk].detected = template.dimensions[dk];
    }
  }
  const fills = smartFill(detection, text);
  for (const dk of dimKeys) {
    if (template.dimensions[dk]) {
      fills[dk] = template.dimensions[dk];
    }
  }

  const result = buildOptimizedPrompt(text, fills, currentDepth, detection);

  // 更新维度标签
  for (const dk of dimKeys) {
    const tag = document.querySelector(`.dim-tag[data-dim="${dk}"]`);
    if (tag && template.dimensions[dk]) {
      tag.querySelector('.dim-value').textContent = template.dimensions[dk];
      tag.classList.add('detected');
      tag.classList.remove('missing');
    }
  }
  // 同步道具维度
  const propDims = ['material', 'texture', 'display', 'background'];
  for (const dk of propDims) {
    if (fills[dk]) {
      const tag = document.querySelector(`.dim-tag[data-dim="${dk}"]`);
      if (tag) {
        tag.querySelector('.dim-value').textContent = fills[dk];
        tag.classList.add('detected');
        tag.classList.remove('missing');
      }
    }
  }

  // 更新显示
  optimizedDisplay.innerHTML = highlightDifferences(text, result.optimized);
  lastResult = result.optimized;
  try { pushVersion(text, result.optimized); versionRender(); } catch (e) {}

  // 保存历史
  const dimSnapshot = {};
  dimTags.forEach(tag => {
    const dim = tag.dataset.dim;
    const val = tag.querySelector('.dim-value').textContent;
    if (val !== '未检测' && val !== '待补全' && val !== '通用') {
      dimSnapshot[dim] = val;
    }
  });
  saveToHistory(text, currentMode, '快速切换', result.optimized, null, dimSnapshot);

  // 更新输出面板标签
  const resultTag = document.getElementById('resultTag');
  if (resultTag) resultTag.textContent = template.name;

  toast.textContent = '已切换至「' + template.name + '」模板';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================================
// COPY
// ============================================================
function copyResult() {
  if (!lastResult) return;

  navigator.clipboard.writeText(lastResult).then(() => {
    btnCopy.classList.add('copied');
    copyText.textContent = '已复制！';

    // Toast
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);

    setTimeout(() => {
      btnCopy.classList.remove('copied');
    copyText.textContent = '一键复制优化结果';
    }, 3000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = lastResult;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btnCopy.classList.add('copied');
    copyText.textContent = '已复制！';
    setTimeout(() => {
      btnCopy.classList.remove('copied');
    copyText.textContent = '一键复制优化结果';
    }, 3000);
  });
}

function renderTemplates() {
  const grid = document.getElementById('templateGrid');
  document.getElementById('templateCount').textContent = `共 ${templates.length} 个模板`;

  templates.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
            <div class="tpl-name">${tpl.name}</div>
      <div class="tpl-desc">${tpl.desc}</div>
    `;
    card.addEventListener('click', () => {
      input.value = tpl.prompt;
      charCount.textContent = tpl.prompt.length;
      input.focus();
      liveDetect();
      // Scroll to input
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    grid.appendChild(card);
  });
}

function formatTime(isoString) {
  const d = new Date(isoString);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function saveToHistory(input, mode, depth, result, analysis, dimensions) {
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    round: __variantRound,
    input,
    mode,
    depth,
    result,
    analysis: analysis ? {
      dimensions: analysis.dimensions,
      reasoning: analysis.reasoning,
      expansion: analysis.expansion,
      decisionSource: analysis.decisionSource,
      templateName: analysis.templateName
    } : null,
    dimensions: dimensions || {}
  };
  HistoryManager.save(entry);
  renderHistoryList();
}

function renderHistoryList() {
  const history = HistoryManager.getAll();
  historyCount.textContent = history.length;

  if (history.length === 0) {
    historyEmpty.style.display = 'block';
    historyList.innerHTML = '';
    return;
  }

  historyEmpty.style.display = 'none';
  historyList.innerHTML = '';

  history.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    if (historyCompareMode) item.classList.add('compare-mode');
    item.dataset.id = entry.id;
    if (historySelected.includes(entry.id)) {
      item.classList.add('selected');
    }

    const modeLabel = entry.mode === 'scene' ? '场景' : (entry.mode === 'prop' ? '道具' : '人物');
    const depthLabel = { basic: '简洁', standard: '标准', deep: '深度' }[entry.depth] || '标准';

    // Count dimensions
    const dimCount = Object.keys(entry.dimensions).length;

    item.innerHTML = `
      <div class="history-item-top">
        <div class="history-item-select" data-action="select">选</div>
        <div class="history-item-info">
          <div class="history-item-time">${formatTime(entry.timestamp)}</div>
          <div class="history-item-input" title="${escapeHtml(entry.input)}">${escapeHtml(entry.input)}</div>
          <div class="history-item-meta">
            <span class="history-badge mode">${modeLabel}模式</span>
            <span class="history-badge depth">${depthLabel}</span>
            ${dimCount > 0 ? `<span class="history-badge dims">${dimCount}项维度</span>` : ''}
          </div>
        </div>
        <div class="history-item-actions">
          <button class="history-item-btn" data-action="expand" title="展开详情">展</button>
          <button class="history-item-btn" data-action="restore" title="回溯到输入框">回</button>
          <button class="history-item-btn delete" data-action="delete" title="删除">删</button>
        </div>
      </div>
      <div class="history-item-detail">
        <div class="history-detail-section">
          <div class="history-detail-label">优化结果</div>
          <div class="history-detail-result">${escapeHtml(entry.result)}</div>
        </div>
        ${renderHistoryDimensions(entry)}
      </div>
    `;

    // Event delegation
    item.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');

      if (action) {
        e.stopPropagation();
        const actionType = action.dataset.action;

        if (actionType === 'select') {
          toggleHistorySelect(entry.id);
        } else if (actionType === 'expand') {
          item.classList.toggle('expanded');
          action.textContent = item.classList.contains('expanded') ? '收' : '展';
        } else if (actionType === 'restore') {
          restoreFromHistory(entry.id);
        } else if (actionType === 'delete') {
          deleteHistoryEntry(entry.id);
        }
      } else if (historyCompareMode) {
        // In compare mode, clicking anywhere on the item selects/deselects it
        toggleHistorySelect(entry.id);
      }
    });

    historyList.appendChild(item);
  });
}

function renderHistoryDimensions(entry) {
  if (!entry.dimensions || Object.keys(entry.dimensions).length === 0) return '';

  const dimLabels = {
    style: '风格', scene: '场景', lighting: '光线', color: '色彩',
    atmosphere: '氛围', composition: '构图', quality: '画质', character: '人物', gender: '性别'
  };

  let html = '<div class="history-detail-section"><div class="history-detail-label">维度详情</div><div class="history-detail-dims">';
  for (const [dim, val] of Object.entries(entry.dimensions)) {
    html += `<span class="history-detail-dim"><span class="dim-label">${dimLabels[dim] || dim}:</span> <span class="dim-val">${escapeHtml(val)}</span></span>`;
  }
  html += '</div></div>';
  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function toggleHistorySelect(id) {
  if (!historyCompareMode) {
    // Not in compare mode, just expand the item
    const item = historyList.querySelector(`[data-id="${id}"]`);
    if (item) item.classList.toggle('expanded');
    return;
  }

  const idx = historySelected.indexOf(id);
  if (idx >= 0) {
    historySelected.splice(idx, 1);
  } else {
    if (historySelected.length >= 2) {
      // Remove oldest
      historySelected.shift();
    }
    historySelected.push(id);
  }

  renderHistoryList();

  if (historySelected.length === 2) {
    renderCompare();
  } else {
    comparePanel.classList.remove('visible');
  }
}

function toggleCompareMode() {
  historyCompareMode = !historyCompareMode;
  historySelected = [];

  if (historyCompareMode) {
    historyCompareBtn.classList.add('compare-active');
    historyCompareBtn.textContent = '⇆ 对比中...';
  } else {
    historyCompareBtn.classList.remove('compare-active');
    historyCompareBtn.textContent = '⇆ 对比';
    comparePanel.classList.remove('visible');
  }

  renderHistoryList();
}

function closeCompare() {
  historyCompareMode = false;
  historySelected = [];
  historyCompareBtn.classList.remove('compare-active');
  historyCompareBtn.textContent = '⇆ 对比';
  comparePanel.classList.remove('visible');
  renderHistoryList();
}

function renderCompare() {
  if (historySelected.length !== 2) return;

  const entryA = HistoryManager.getById(historySelected[0]);
  const entryB = HistoryManager.getById(historySelected[1]);

  if (!entryA || !entryB) return;

  comparePanel.classList.add('visible');

  const dimLabels = {
    style: '风格', scene: '场景', lighting: '光线', color: '色彩',
    atmosphere: '氛围', composition: '构图', quality: '画质', character: '人物', gender: '性别'
  };

  function renderCompareCol(entry, label) {
    const modeLabel = entry.mode === 'scene' ? '场景' : (entry.mode === 'prop' ? '道具' : '人物');
    const depthLabel = { basic: '简洁', standard: '标准', deep: '深度' }[entry.depth] || '标准';

    let dimsHtml = '';
    const allDims = new Set([...Object.keys(entryA.dimensions || {}), ...Object.keys(entryB.dimensions || {})]);
    for (const dim of allDims) {
      const valA = (entryA.dimensions || {})[dim];
      const valB = (entryB.dimensions || {})[dim];
      const val = (entry.dimensions || {})[dim];
      const isDiff = valA !== valB;
      dimsHtml += `<div class="compare-row">
        <div class="compare-row-label">${dimLabels[dim] || dim}</div>
        <div class="compare-row-value${isDiff ? ' diff' : ''}">${val || '—'}</div>
      </div>`;
    }

    return `
      <div class="compare-row">
        <div class="compare-row-label">时间</div>
        <div class="compare-row-value">${formatTime(entry.timestamp)}</div>
      </div>
      <div class="compare-row">
        <div class="compare-row-label">模式 / 深度</div>
        <div class="compare-row-value">${modeLabel} · ${depthLabel}</div>
      </div>
      <div class="compare-row">
        <div class="compare-row-label">输入</div>
        <div class="compare-row-value">${escapeHtml(entry.input)}</div>
      </div>
      <div class="compare-row">
        <div class="compare-row-label">优化结果</div>
        <div class="compare-row-value">${escapeHtml(entry.result)}</div>
      </div>
      ${dimsHtml}
      <div class="compare-row">
        <div class="compare-row-label">意图扩展</div>
        <div class="compare-row-value">${entry.analysis && entry.analysis.expansion ? escapeHtml(entry.analysis.expansion) : '—'}</div>
      </div>
    `;
  }

  document.getElementById('compareColLeft').querySelector('.compare-col-header').textContent = '记录 A';
  document.getElementById('compareColRight').querySelector('.compare-col-header').textContent = '记录 B';
  document.getElementById('compareLeftContent').innerHTML = renderCompareCol(entryA, 'A');
  document.getElementById('compareRightContent').innerHTML = renderCompareCol(entryB, 'B');

  // Highlight differences
  highlightDiffs(entryA, entryB);

  comparePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function highlightDiffs(entryA, entryB) {
  const allDims = new Set([...Object.keys(entryA.dimensions || {}), ...Object.keys(entryB.dimensions || {})]);
  for (const dim of allDims) {
    const valA = (entryA.dimensions || {})[dim];
    const valB = (entryB.dimensions || {})[dim];
    if (valA !== valB) {
      // Highlight both sides' diff values
      const leftVals = document.querySelectorAll('#compareLeftContent .compare-row-value.diff');
      const rightVals = document.querySelectorAll('#compareRightContent .compare-row-value.diff');
    }
  }
}

function restoreFromHistory(id) {
  const entry = HistoryManager.getById(id);
  if (!entry) return;

  // Restore input
  input.value = entry.input;
  charCount.textContent = input.value.length;

  // Restore mode
  if (entry.mode && entry.mode !== currentMode) {
    currentMode = entry.mode;
    modeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.mode === currentMode);
    });
    const container = document.querySelector('.main-card') || document.body;
    container.classList.remove('mode-scene', 'mode-prop');
    if (currentMode === 'scene') {
      container.classList.add('mode-scene');
    } else if (currentMode === 'prop') {
      container.classList.add('mode-prop');
    }
  }

  // Restore depth
  if (entry.depth && entry.depth !== currentDepth) {
    currentDepth = entry.depth;
    depthBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.depth === currentDepth);
    });
  }

  // Trigger optimization
  optimize();

  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deleteHistoryEntry(id) {
  if (historySelected.includes(id)) {
    historySelected = historySelected.filter(s => s !== id);
  }
  HistoryManager.delete(id);
  if (historySelected.length < 2) {
    comparePanel.classList.remove('visible');
  }
  renderHistoryList();
}

function confirmMaskClose() {
  const mask = document.getElementById('confirmMask');
  if (mask) {
    mask.classList.remove('visible');
    mask.style.display = 'none';
    const dialog = mask.querySelector('.confirm-dialog');
    if (dialog) dialog.classList.remove('pop-in');
  }
}

function doClearHistory() {
  HistoryManager.clear();
  historySelected = [];
  historyCompareMode = false;
  if (historyCompareBtn) historyCompareBtn.classList.remove('compare-active');
  if (historyCompareBtn) historyCompareBtn.textContent = '⇆ 对比';
  if (comparePanel) comparePanel.classList.remove('visible');
  renderHistoryList();
  confirmMaskClose();
}

function clearHistory() {
  if (HistoryManager.getAll().length === 0) return;
  // 使用自定义确认框，避免原生 confirm() 在自动化/部分环境下不可见
  const mask = document.getElementById('confirmMask');
  if (mask) {
    mask.style.display = 'flex';
    mask.classList.add('visible');
    const dialog = mask.querySelector('.confirm-dialog');
    if (dialog) dialog.classList.add('pop-in');
  }
}

async function initServiceStatus() {
  const el = (typeof document !== 'undefined') ? document.getElementById('svcBadge') : null;
  const set = function (cls, text, tip) {
    window.__svcStatus = cls;
    if (!el) return;
    try {
      el.className = 'svc-badge ' + cls;
      el.textContent = text;
      el.title = tip || '';
    } catch (e) { /* mock DOM */ }
  };

  if (typeof location !== 'undefined' && /^file:/i.test(location.protocol || '')) {
    set('bad', '本地文件打开',
      '直接双击 index.html 时 fetch 会被浏览器拦掉。\n请在 promptlab 目录运行 python serve.py，再打开 http://127.0.0.1:8777/');
    return;
  }
  try {
    const r = await fetch('/api/health', { cache: 'no-store' });
    const j = await r.json();
    if (j && j.ok) {
      const hasSem = !!j.vectors;
      const hasInfer = !!j.infer;
      if (hasSem && hasInfer) {
        set('ok', '语义 + 推理',
          '本地服务正常。\n语义检索：已加载（' + (j.model || 'bge') + '）\n第 3 层推理：可用（已有 ' + (j.inferCached || 0) + ' 条缓存）');
      } else if (hasSem) {
        set('partial', '仅语义检索',
          '语义检索可用，但第 3 层推理没启用。\n通常是 serve.py 没读到 LLM key（看 config.local.js）。');
      } else {
        set('partial', '服务已连 · 向量未就绪',
          'serve.py 已启动，但向量库没加载，语义检索暂时不可用。\n第 3 层推理状态：' + (hasInfer ? '可用' : '不可用'));
      }
      return;
    }
    set('partial', '服务状态异常', 'serve.py 有响应但不是 ok 状态：' + JSON.stringify(j).slice(0, 200));
  } catch (e) {
    set('bad', '服务未启动',
      '语义检索与第 3 层推理都不可用，当前只用本地词库生成。\n启动方式：在 promptlab 目录运行 python serve.py，然后打开 http://127.0.0.1:8777/');
  }
}

function initVersionLabel() {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('appVersion');
  if (el) {
    try {
      el.textContent = APP_VERSION;
      el.title = '当前版本 ' + APP_VERSION + '（明细见 版本记录.md）';
    } catch (e) {}
  }
  try { console.info('[PromptLab] ' + APP_VERSION + ' / ' + (window.__APP_VERSION || '')); } catch (e) {}
}

function initOnboarding() {
  if (typeof document === 'undefined') return;
  const box = document.getElementById('onboard');
  if (!box) return;
  let seen = false;
  try { seen = localStorage.getItem('pl_onboarded') === '1'; } catch (e) {}
  const close = function () {
    try { box.hidden = true; } catch (e) {}
    try { localStorage.setItem('pl_onboarded', '1'); } catch (e) {}
  };
  if (seen) { try { box.hidden = true; } catch (e) {} return; }
  try { box.hidden = false; } catch (e) {}

  const btn = document.getElementById('onboardClose');
  if (btn && btn.addEventListener) btn.addEventListener('click', close);

  let egs = [];
  try { egs = document.querySelectorAll('.onboard-eg') || []; } catch (e) { egs = []; }
  Array.prototype.forEach.call(egs, function (b) {
    if (!b || !b.addEventListener) return;
    b.addEventListener('click', function () {
      const t = b.getAttribute('data-text') || '';
      if (!t) return;
      try {
        input.value = t;
        charCount.textContent = t.length;
        if (typeof liveDetect === 'function') liveDetect();
        close();
        if (typeof optimize === 'function') optimize();
      } catch (e) { /* ignore */ }
    });
  });
}

function feedbackQueueLoad() {
  try { return JSON.parse(localStorage.getItem(FB_QUEUE_KEY) || '[]') || []; }
  catch (e) { return []; }
}

function feedbackQueueSave(list) {
  try { localStorage.setItem(FB_QUEUE_KEY, JSON.stringify((list || []).slice(-50))); }
  catch (e) { /* 存储满了就算了，不阻塞用户 */ }
}

function feedbackPayload(rating, note) {
  return {
    rating: rating,
    note: String(note || '').slice(0, 120),
    text: (input && input.value ? String(input.value) : '').trim(),
    prompt: String((typeof lastResult !== 'undefined' && lastResult) || '').slice(0, 1500),
    mode: (typeof currentMode !== 'undefined' ? currentMode : ''),
    depth: (typeof currentDepth !== 'undefined' ? currentDepth : ''),
    round: (typeof __variantRound === 'number' ? __variantRound : 0),
    ts: Date.now(),
    ua: (typeof navigator !== 'undefined' ? String(navigator.userAgent || '').slice(0, 100) : '')
  };
}

function feedbackMark(msg, cls) {
  const el = document.getElementById('feedbackMsg');
  if (!el) return;
  el.textContent = msg || '';
  try { el.style.color = cls === 'bad' ? '#f87171' : (cls === 'ok' ? '#4ade80' : ''); } catch (e) {}
}

async function feedbackPost(rec) {
  const r = await fetch('/api/feedback', {
    method: 'POST',
    headers: plHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(rec)
  });
  if (!r.ok) throw new Error('http ' + r.status);
  return await r.json();
}

/* 把攒下来的补发掉。静默失败，不影响使用。 */
async function feedbackFlush() {
  const q = feedbackQueueLoad();
  if (!q.length) return;
  const keep = [];
  for (let i = 0; i < q.length; i++) {
    try { await feedbackPost(q[i]); }
    catch (e) { keep.push(q[i]); }
  }
  feedbackQueueSave(keep);
}

async function feedbackSend(rating, note) {
  const up = document.getElementById('fbUp');
  const down = document.getElementById('fbDown');
  const rec = feedbackPayload(rating, note);
  if (!rec.text) { feedbackMark('还没有输入内容', 'bad'); return; }
  try {
    await feedbackPost(rec);
    feedbackMark(rating === 'up' ? '记下了，谢谢' : '记下了，这条最有价值', 'ok');
  } catch (e) {
    const q = feedbackQueueLoad();
    q.push(rec);
    feedbackQueueSave(q);
    feedbackMark('已存到本地，下次打开会自动补发', 'ok');
  }
  [up, down].forEach(function (b) {
    if (!b) return;
    b.disabled = true;
  });
  const hit = rating === 'up' ? up : down;
  if (hit) { try { hit.classList.add('sent'); } catch (e) {} }
  const note2 = document.getElementById('feedbackNote');
  if (note2) { try { note2.hidden = true; } catch (e) {} }
}

/* 生成出新结果时才把反馈行放出来；每生成一版都重置状态。 */
/* 举报通道（2026-11-11）
   为什么放在反馈行旁边：用户觉得输出有问题时，正是在那个位置。
   奖励规则（服务端）：提交不加分，人工判定有效 +10，无效 -2 ——
   提交就加分等于鼓励刷举报；只奖不罚，刷子靠量也能赚。 */
function reportProblem() {
  try {
    const text = (input && input.value || '').trim();
    if (!text) { alert('先写一句描述，再举报。'); return; }
    const reason = (typeof prompt === 'function')
      ? (prompt('哪里有问题？（例如：画错了 / 内容不当 / 风格不对）') || '')
      : '';
    let visitor = '';
    try { visitor = localStorage.getItem('pl_visitor') || ''; } catch (e) {}
    if (!visitor) {
      visitor = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      try { localStorage.setItem('pl_visitor', visitor); } catch (e) {}
    }
    fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text, reason: reason, visitor: visitor,
        prompt: (lastResult && lastResult.optimized) || ''
      })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) {
        alert('已收到举报（编号 ' + j.id + '）。\n' + (j.note || ''));
      } else {
        alert('举报失败：' + ((j && j.error) || '未知错误'));
      }
    }).catch(function () {
      alert('举报失败：连不上本地服务。请确认 serve.py 在跑。');
    });
  } catch (e) {}
}

function showFeedbackRow() {
  const row = document.getElementById('feedbackRow');
  if (!row) return;
  try { row.hidden = false; } catch (e) {}
  const up = document.getElementById('fbUp');
  const down = document.getElementById('fbDown');
  [up, down].forEach(function (b) {
    if (!b) return;
    b.disabled = false;
    try { b.classList.remove('sent'); } catch (e) {}
  });
  const note = document.getElementById('feedbackNote');
  if (note) { try { note.hidden = true; } catch (e) {} }
  const ni = document.getElementById('feedbackNoteInput');
  if (ni) { try { ni.value = ''; } catch (e) {} }
  feedbackMark('');
}

function initFeedback() {
  /* 举报按钮（2026-11-11）：和 👍/👎 并列，用户觉得「有问题」时就在那个位置 */
  try {
    const rb = document.getElementById('fbReport');
    if (rb && !rb.__wired) { rb.__wired = true; rb.addEventListener('click', reportProblem); }
  } catch (e) {}

  if (typeof document === 'undefined') return;
  const up = document.getElementById('fbUp');
  const down = document.getElementById('fbDown');
  const send = document.getElementById('fbSend');
  const note = document.getElementById('feedbackNote');
  const noteInput = document.getElementById('feedbackNoteInput');
  if (up && up.addEventListener) up.addEventListener('click', function () { feedbackSend('up', ''); });
  if (down && down.addEventListener) down.addEventListener('click', function () {
    if (note) { try { note.hidden = false; } catch (e) {} }
    if (noteInput && noteInput.focus) { try { noteInput.focus(); } catch (e) {} }
  });
  if (send && send.addEventListener) send.addEventListener('click', function () {
    feedbackSend('down', noteInput ? noteInput.value : '');
  });
  if (noteInput && noteInput.addEventListener) noteInput.addEventListener('keydown', function (e) {
    if (e && e.key === 'Enter') feedbackSend('down', noteInput.value);
  });
  // 上次没发出去的，现在补
  try { feedbackFlush(); } catch (e) {}
}

/* ============================================================
 * 版本控制（2026-11-11）
 * ------------------------------------------------------------
 * 每点一次「一键优化」都会 bumpVariantRound()，同一句输入连点两次就是两版。
 * 原来只在 toast 里闪一下「第 N 版」——人记不住第几版，也没法退回去。
 * 这里做三件事：
 *   1. 结果下面常显「第 N 版」；
 *   2. 「换一版」= 同样输入再来一版（连接词、开句、风格候选都会换）；
 *   3. 「回到上一版」= 从本次会话的版本栈里退一层，不影响历史记录。
 * 为什么用内存栈而不是读 localStorage：栈要反映「这次输入连点了几次」，
 * 混进上次打开页面留下的记录反而乱。
 * ============================================================ */
function versionStack() {
  if (!window.__verStack) window.__verStack = [];
  return window.__verStack;
}

function pushVersion(text, optimized) {
  if (!optimized) return;
  const st = versionStack();
  const last = st[st.length - 1];
  // 换了输入就是新话题，版本栈从头算——不然「回到上一版」会跳回上一句的内容
  if (last && last.text !== text) st.length = 0;
  const cur = st[st.length - 1];
  if (cur && cur.text === text && cur.optimized === optimized) return;  // 同一条不重复压栈
  st.push({ round: (typeof __variantRound === 'number' ? __variantRound : 1), text: text, optimized: optimized });
  if (st.length > 20) st.shift();
}

function versionRender() {
  const bar = document.getElementById('versionBar');
  const num = document.getElementById('versionNum');
  const hint = document.getElementById('vbHint');
  const st = versionStack();
  if (!bar || !st.length) return;
  try { bar.hidden = false; } catch (e) {}
  if (num) { try { num.textContent = String(st[st.length - 1].round); } catch (e) {} }
  if (hint) {
    try {
      hint.textContent = st.length > 1 ? ('本次已生成 ' + st.length + ' 版') : '';
    } catch (e) {}
  }
}

function versionNext() {
  const inp = document.getElementById('promptInput');
  if (!inp || !String(inp.value || '').trim()) return;
  if (typeof optimize === 'function') optimize();
}

function versionPrev() {
  const st = versionStack();
  if (st.length < 2) {
    const hint = document.getElementById('vbHint');
    if (hint) { try { hint.textContent = '这是第一版'; } catch (e) {} }
    return;
  }
  st.pop();
  const v = st[st.length - 1];
  try {
    lastResult = v.optimized;
    optimizedDisplay.innerHTML = highlightDifferences(v.text, v.optimized);
  } catch (e) { return; }
  const num = document.getElementById('versionNum');
  if (num) { try { num.textContent = String(v.round); } catch (e) {} }
  const hint = document.getElementById('vbHint');
  if (hint) { try { hint.textContent = '已回到上一版（第 ' + v.round + ' 版）'; } catch (e) {} }
  try { showFeedbackRow(); } catch (e) {}
}

function initVersionBar() {
  if (typeof document === 'undefined') return;
  const nx = document.getElementById('btnNextVersion');
  const pv = document.getElementById('btnPrevVersion');
  if (nx && nx.addEventListener) nx.addEventListener('click', versionNext);
  if (pv && pv.addEventListener) pv.addEventListener('click', versionPrev);
}
