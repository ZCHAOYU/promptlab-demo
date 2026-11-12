'use strict';
/* 全量回归：把校验脚本跑一遍，只报通过/失败。
   用法：node _dev/run-all.js
   为什么用 node 而不是 ps1：这台机器 PowerShell 的执行策略禁止直接跑 .ps1。

   ---- 2026-11-11：服务端不再靠「人记得先起」 ----
   有两组要服务端在跑（/api/chat、/api/embed）：verify-chat-proxy.js、verify-semantic-layer.js。
   原来它们直接混在离线组里：服务端没起，整组就红，而且红得像「代码坏了」。
   当天就出现过一次「偶发失败」，其实就是 serve.py 没起。
   现在：
     1. 先探 /api/health；没起就自动 `python serve.py 8777` 拉起来（拉不起来则下面第 2 条）；
     2. 拉不起来 → 这两组记成「跳过（服务端没起）」，**大声打出来**，不冒充通过、也不冤枉代码；
     3. 自己拉起来的服务，跑完自己关掉；本来就在跑的（用户开着），不碰。
*/
const { spawnSync, spawn } = require('child_process');
const http = require('http');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const NODE = process.execPath;
const HEALTH = 'http://127.0.0.1:8777/api/health';

// 离线组：不依赖服务端、不联网
const SUITES = [
  'test-agent-logic.js',
  'test-agent-ui.js',
  'test-agent-panel.js',
  '_dev/verify-pose-extract.js',
  '_dev/verify-pose.js',
  '_dev/verify-subject-guard.js',
  '_dev/verify-variation.js',
  '_dev/verify-style-variants.js',
  '_dev/verify-faces.js',
  '_dev/verify-variants.js',
  '_dev/verify-scene-detail.js',
  '_dev/verify-real-phrases.js',
  '_dev/verify-oov.js',
  '_dev/verify-chips.js',
  '_dev/verify-fill-applied.js',
  '_dev/verify-plan-a.js',
  // verify-rollback.js 是工具不是测试：必须带一个备份文件名才能跑，不能进回归
  /* 场景道具这条原来没接进回归（2026-11-11 补）：它红了一整天，
     「45 组全绿」却一直是绿的 —— 因为根本没跑它。
     验收脚本不在 gate 里，等于没有验收。 */
  '_dev/verify-scene-props.js',
  '_dev/verify-sanitize.js',
  '_dev/verify-jianke.js',
  '_dev/verify-new-roles.js',
  '_dev/verify-user-place.js',
  '_dev/verify-subject-mismatch.js',
  '_dev/verify-ui-wiring.js',
  '_dev/verify-ui-flow.js',
  '_dev/verify-infer-gate.js',
  '_dev/verify-panel-exact.js',
  '_dev/verify-infer-tidy.js',
  '_dev/verify-en-output.js',
  '_dev/verify-genstate.js',
  '_dev/verify-compliance.js',
  '_dev/verify-guard-parity.js',
  '_dev/verify-doc-structure.js',
  '_dev/verify-blood-compound.js',
  '_dev/verify-optimize-guard.js',
  '_dev/verify-agent-bridge.js',
  '_dev/verify-parse-raw.js',
  '_dev/verify-parse-verbatim.js',
  '_dev/verify-mood-coherence.js',
  '_dev/stats.js --assert',
  '_dev/verify-refactor-equivalence.js',
  '_dev/check-determinism.js',
  '_dev/audit-repeat.js',
  '_dev/audit-face-contamination.js',
  '_dev/audit-docs.js',
  '_dev/audit-version.js',
  '_dev/audit-reality.js',
  '_dev/audit-reality-wide.js',
  '_dev/assert-style-refactor.js'
];

// 服务端组：需要 http://127.0.0.1:8777 在跑
const SERVER_SUITES = [
  '_dev/verify-chat-proxy.js',
  '_dev/verify-semantic-layer.js',
  // 场景链路要 /api/parse 才能验「用户说的地点能不能覆盖风格默认值」
  '_dev/verify-scene-chain.js'
];

function health() {
  return new Promise(function (resolve) {
    const req = http.get(HEALTH, { timeout: 1500 }, function (res) {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('timeout', function () { req.destroy(); resolve(false); });
    req.on('error', function () { resolve(false); });
  });
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/** 找出「真的能用」的 python 解释器；找不到返回 null
    为什么要过滤 WindowsApps：Windows 上 `python`/`python3` 常常只是
    Microsoft Store 的占位程序（App Execution Alias），真跑起来是打开商店。
    这里用 where.exe 只查路径、不执行它。 */
function findPython(cmd) {
  if (process.platform !== 'win32') return cmd;
  try {
    const r = spawnSync('where', [cmd], { encoding: 'utf8', timeout: 3000 });
    if (r.status !== 0 || !r.stdout) return null;
    const first = r.stdout.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean)[0];
    if (!first) return null;
    if (/\\WindowsApps\\/i.test(first)) return null;   // 商店占位程序，不是解释器
    return first;
  } catch (e) { return null; }
}

/** 试着把 serve.py 拉起来；返回子进程，失败返回 null */
async function tryStartServer() {
  const cands = [];
  if (process.env.PYTHON) cands.push([process.env.PYTHON, ['serve.py', '8777']]);
  [['python', ['serve.py', '8777']], ['python3', ['serve.py', '8777']], ['py', ['-3', 'serve.py', '8777']]]
    .forEach(function (c) {
      const exe = findPython(c[0]);
      if (exe) cands.push([exe, c[1]]);
    });
  if (!cands.length) {
    console.log('  没找到可用的 python（`python` 可能只是 Microsoft Store 的占位程序）。');
    console.log('  可以：先自己 `python serve.py 8777`，或者用 PYTHON=完整路径 再跑本脚本。');
    return null;
  }
  for (const c of cands) {
    let child;
    try {
      child = spawn(c[0], c[1], { cwd: ROOT, stdio: 'ignore', detached: false });
    } catch (e) { continue; }
    let died = false;
    child.on('error', function () { died = true; });
    child.on('exit', function () { died = true; });
    for (let i = 0; i < 30 && !died; i++) {          // 最多等 15 秒
      await sleep(500);
      if (await health()) return child;
    }
    if (!died) { try { child.kill(); } catch (e) { } }
  }
  return null;
}

function runSuite(f) {
  const full = path.join(ROOT, f);
  if (!fs.existsSync(full)) { return { state: 'missing' }; }
  const r = spawnSync(NODE, [full], { cwd: ROOT, stdio: 'ignore' });
  return r.status === 0 ? { state: 'ok' } : { state: 'fail', code: r.status };
}

/* 服务端组要打真实请求（/api/chat 走真实模型），偶发失败不能直接算红。
   2026-11-11 实测：服务刚起来时就跑，第一次会失败，隔几秒就正常。
   这里只对服务端组重试一次，并且把「重试过」打出来 —— 不静默。 */
async function runServerSuite(f) {
  const first = runSuite(f);
  if (first.state !== 'fail') return first;
  console.log('  ↻ ' + f + ' 第一次失败（exit ' + first.code + '），等 2 秒重试一次…');
  await sleep(2000);
  const second = runSuite(f);
  if (second.state === 'ok') return { state: 'ok', retried: true };
  return second;
}

(async function main() {
  const failed = [];
  const missing = [];
  const skippedServer = [];

  // ---- 服务端预检 ----
  let serverUp = await health();
  let startedByUs = null;
  if (!serverUp) {
    console.log('服务端没在跑，尝试自动启动 serve.py 8777 …');
    startedByUs = await tryStartServer();
    serverUp = await health();
    if (serverUp) {
      await sleep(800);                             // 端口通了不等于 /api/chat 就绪，给一点预热时间
      console.log('已启动（跑完会关掉）。\n');
    } else console.log('启动失败：服务端组将跳过。\n');
  }

  // ---- 离线组 ----
  SUITES.forEach(function (f) {
    const r = runSuite(f);
    if (r.state === 'missing') { missing.push(f); return; }
    if (r.state === 'fail') { failed.push(f + ' (exit ' + r.code + ')'); console.log('✗ ' + f + '  exit ' + r.code); }
    else console.log('✓ ' + f);
  });

  // ---- 服务端组 ----
  if (serverUp) {
    for (const f of SERVER_SUITES) {
      const r = await runServerSuite(f);
      if (r.state === 'missing') { missing.push(f); continue; }
      if (r.state === 'fail') { failed.push(f + ' (exit ' + r.code + ')'); console.log('✗ ' + f + '  exit ' + r.code); }
      else console.log('✓ ' + f + (r.retried ? '（重试一次后通过）' : ''));
    }
  } else {
    SERVER_SUITES.forEach(function (f) { skippedServer.push(f); });
  }

  // ---- 自己起的服务，自己关 ----
  if (startedByUs) {
    try { startedByUs.kill(); } catch (e) { }
    console.log('\n（已关闭本次自动启动的 serve.py）');
  }

  const total = SUITES.length + SERVER_SUITES.length;
  const ran = total - missing.length - skippedServer.length;

  console.log('');
  if (missing.length) console.log('跳过（不存在）: ' + missing.join(', '));
  if (skippedServer.length) {
    console.log('跳过（服务端没起）: ' + skippedServer.join('、'));
    console.log('  ⚠ 这 ' + skippedServer.length + ' 组没跑过 ≠ 通过。先 `serve.py 8777` 再跑一次。');
  }
  if (!failed.length) {
    console.log(skippedServer.length
      ? '通过 ' + ran + ' 组，跳过 ' + skippedServer.length + ' 组（服务端没起）'
      : '全部通过（' + ran + ' 组）');
    process.exit(0);
  }
  console.log('失败 ' + failed.length + ' 组：' + failed.join('、'));
  process.exit(1);
})();
