'use strict';
/* 面容变体验证：同一角色在三种情境下，脸必须不一样，
   且不能出现第一版那套「眉眼舒展 / 唇角浅笑」。
   用法：node _dev/verify-faces.js [角色名...] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function mk() {
  return {
    style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild(c) { return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k] || null; },
    querySelector() { return mk(); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    focus() {}, click() {}, remove() {}
  };
}
const cache = {};
const doc = {
  readyState: 'complete', body: mk(), head: mk(), documentElement: mk(),
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, createTextNode() { return mk(); },
  addEventListener() {}, execCommand() { return true; }
};
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document: doc,
  navigator: { userAgent: 'node', clipboard: null, hardwareConcurrency: 4 },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: async () => { throw new Error('offline'); },
  alert() {}, prompt() { return null; }, confirm() { return true; },
  performance: { now: () => Date.now() },
  location: { href: 'http://x/', protocol: 'http:', search: '', hash: '' },
  requestAnimationFrame(cb) { return setTimeout(cb, 0); }, cancelAnimationFrame() {}
};
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['translations.js', 'smart-engine.js', 'data-kwdb.js',
  'archive-detail.js', 'archive-slots.js', 'archive-fix.js',
  'archive-variants.js', 'archive-faces.js', 'app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}

const BANNED = ['眉眼舒展', '唇角浅笑', '目光温和', '神情松弛', '气色温润',
  '目光柔和', '面带笑意', '神情放松', '神态从容'];

const total = vm.runInContext('Object.keys(window.__ROLE_FACES||{}).length', ctx);
console.log('window.__ROLE_FACES 角色数:', total);
console.log('');

const ROLES = process.argv.slice(2).length ? process.argv.slice(2)
  : ['女帝', '霸总', '病娇', '剑修', '刺客', '机器人', '乞丐', '旗袍美人', '写实人物'];

const CASES = [
  ['daily', '一位{0}'],
  ['action', '一位{0}迎敌厮杀'],
  ['quiet', '一位{0}静坐出神']
];

let bad = 0, ok = 0;
for (const role of ROLES) {
  const got = [];
  const sits = [];
  for (const [want, tpl] of CASES) {
    const t = tpl.replace('{0}', role);
    const r = JSON.parse(vm.runInContext(
      '(function(){var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
      'var s=pickSituation(d,' + JSON.stringify(t) + ');' +
      'var f=pickFace(d,' + JSON.stringify(t) + ',' + JSON.stringify(role) + ');' +
      'return JSON.stringify({sit:s,face:f,char:d.character&&d.character.detected||null});})()', ctx));
    sits.push(r.sit);
    got.push(r.face);
  }
  const uniq = new Set(got.filter(Boolean));
  const hitBanned = got.filter(Boolean).filter(f => BANNED.some(b => f.includes(b)));
  const allNull = got.every(x => !x);
  let flag;
  if (allNull) { flag = '○ 无变体（走档案回退）'; }
  else if (sits.join() !== 'daily,action,quiet') { flag = '⚠ 情境识别不对：' + sits.join('/'); bad++; }
  else if (uniq.size < 3) { flag = `✗ 只有 ${uniq.size} 种（应 3 种）`; bad++; }
  else if (hitBanned.length) { flag = '✗ 命中套话：' + hitBanned[0]; bad++; }
  else { flag = '✓ 3/3 互不相同'; ok++; }
  console.log(`${role}  ${flag}`);
  if (!allNull) got.forEach((g, i) => console.log(`   ${['日常', '行动', '静谧'][i]}: ${g || '（空）'}`));
  console.log('');
}
console.log(`== 通过 ${ok}，有问题 ${bad} ==`);
