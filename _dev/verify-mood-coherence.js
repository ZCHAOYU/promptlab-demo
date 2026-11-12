'use strict';
/* A 类取值冲突：温和人物不配肃杀氛围（2026-11-11） */
const path = require('path'), vm = require('vm');
function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '', disabled: false,
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
    addEventListener() { }, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute() { return null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() { }, click() { }, remove() { }
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() { }, execCommand() { return true; }
};
const ctx = {
  console: { log() { }, warn() { }, error() { } }, document: doc,
  navigator: { userAgent: 'n' }, localStorage: { getItem() { return null; }, setItem() { } },
  sessionStorage: { getItem() { return null; }, setItem() { } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('off') }, alert() { }, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() }, location: { href: 'http://x/', protocol: 'http:' }
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
require('./load-scripts').loadApp(ctx, { skip: ['config.local.js', 'semantic-search.js', 'llm-arbiter.js', 'agent-panel.js'] });
const G = (e) => vm.runInContext(e, ctx);

let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } }
function run(char, atmo) {
  ctx.__c = char; ctx.__a = atmo;
  return G(`(function(){var f={character:window.__c,atmosphere:window.__a};
    var c=KW_DB.character.categories[window.__c]||null;
    ensureMoodAtmosphere(f,c);return f.atmosphere})()`);
}

console.log('=== 冲突必须被拦 ===');
const a = run('丰收女神', '肃杀');
ok(a !== '肃杀', '丰收女神 + 肃杀 → ' + a + '（已替换）');
const b = run('圣女', '血腥');
ok(b !== '血腥', '圣女 + 血腥 → ' + b);

console.log('\n=== 不该误伤 ===');
ok(run('剑客', '肃杀') === '肃杀', '剑客 + 肃杀 → 保留（本来就配）');
ok(run('屠夫', '血腥') === '血腥', '屠夫 + 血腥 → 保留');
ok(run('丰收女神', '清新自然') === '清新自然', '不冲突的氛围不动');

console.log('\n=== 输出层也要生效 ===');
const out = G(`(function(){
  var t='温和的丰收女神站在拆迁废墟里';
  var d=detectDimensions(t,'character'); currentMode=inferSubjectType(t,d);
  var f=smartFill(d,t); f.atmosphere='肃杀';
  var r=buildOptimizedPrompt(t,f,'standard',d);
  return (typeof r==='string')?r:r.optimized;
})()`);
ok(String(out).indexOf('肃杀') < 0, '完整生成里不再出现「肃杀」');
console.log('    输出：' + String(out).slice(-46));

console.log('\n== 通过 ' + pass + ' / 失败 ' + fail + ' ==');
process.exit(fail ? 1 : 0);
