/* 面板冒烟测试：桩 DOM 下 eval agent-panel.js，确认 boot 不抛错、FAB 被挂上 */
'use strict';
global.window = global;

function Node(tag) {
  return {
    tagName: tag, style: {}, textContent: '', innerHTML: '', _children: [], _h: {},
    setAttribute: function (k, v) {
      if (k === 'style' && typeof v === 'string') {
        // 粗略模拟浏览器：把 "a:b; c:d" 解析进 .style 对象（含 camelCase 转换）
        var self = this;
        self.style = self.style || {};
        v.split(';').forEach(function (decl) {
          var i = decl.indexOf(':');
          if (i <= 0) return;
          var key = decl.slice(0, i).trim().replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); });
          self.style[key] = decl.slice(i + 1).trim();
        });
      } else {
        this[k] = v;
      }
    },
    getAttribute: function (k) { return this[k]; },
    appendChild: function (c) { this._children.push(c); return c; },
    addEventListener: function (e, f) { this._h[e] = f; },
    querySelectorAll: function () { return []; }
  };
}

var body = Node('body');
global.document = {
  readyState: 'complete',
  body: body,
  createElement: function (t) { return Node(t); },
  getElementById: function (id) { return null; },
  addEventListener: function () {}
};
/* Node 24 自带只读的 navigator，必须用 defineProperty 覆盖 */
try {
  Object.defineProperty(global, 'navigator', { value: { clipboard: null }, configurable: true });
} catch (e) { /* 忽略，copyText 不在这条路径上 */ }
global.Event = function (t) { this.type = t; };

/* LLMArbiter 用真的，SemanticSearch 用桩 */
require('./llm-arbiter.js');
global.SemanticSearch = {
  init: async function () { return true; },
  searchMulti: async function () { return {}; },
  stats: { entries: 2032, dim: 512 },
  error: null
};
global.LLM_CONFIG = { endpoint: 'https://x/v1', key: 'k', model: 'm' };

var logs = [];
var origLog = console.log, origWarn = console.warn;
console.log = function () { logs.push(['log'].concat([].slice.call(arguments)).join(' ')); };
console.warn = function () { logs.push(['warn'].concat([].slice.call(arguments)).join(' ')); };

var threw = null;
try {
  require('./agent-panel.js');
} catch (e) {
  threw = e;
}
console.log = origLog; console.warn = origWarn;

var pass = 0, fail = 0;
function check(n, c, extra) {
  if (c) { pass++; console.log('  PASS  ' + n); }
  else { fail++; console.log('  FAIL  ' + n + (extra ? '  → ' + extra : '')); }
}

check('boot 未抛错', threw === null, threw && threw.message);
check('输出「已启用」', logs.some(function (l) { return l.indexOf('已启用') >= 0; }), JSON.stringify(logs));
check('FAB 与面板已挂到 body', body._children.length === 1 &&
      body._children[0]._children.length === 2, body._children.length);
var wrap = body._children[0];
check('FAB 是 button', wrap && wrap._children[0] && wrap._children[0].tagName === 'button');
check('FAB 文案为「语义 9 维」', wrap && wrap._children[0] && wrap._children[0].textContent === '语义 9 维',
      wrap && wrap._children[0] && wrap._children[0].textContent);
check('面板默认隐藏', wrap && wrap._children[1] &&
      String(wrap._children[1].style.display).indexOf('none') >= 0,
      wrap && wrap._children[1] && wrap._children[1].style.display);

console.log('\n通过 ' + pass + '　失败 ' + fail);
process.exit(fail ? 1 : 0);
