'use strict';
/* 打包：把「运行所需」的东西抽成一个可交付目录（+ zip）。
   ------------------------------------------------------------------
   用法：
     node _dev/build-dist.js              # 标准版（要本机 Python + requirements.txt）
     node _dev/build-dist.js --portable   # 便携版（带 Python 运行时，双击就跑）

   原则：
     1 清单只从 index.html 读（和测试同一套规矩），不手写第二份；
     2 **绝不打包 config.local.js**（里面有明文 key）——只放 .example 模板；
     3 _dev / _archive / 内部文档 / PDF 一律不进包；
     4 打完立刻做一遍「文件齐不齐」自检，缺一个就报错退出。
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORTABLE = process.argv.indexOf('--portable') >= 0;
const NAME = 'PromptLab-V5.32' + (PORTABLE ? '-portable' : '');
const DIST_ROOT = path.join(ROOT, 'dist');
const OUT = path.join(DIST_ROOT, NAME);

const PY_RUNTIME = 'C:\\Users\\plmht\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python';

function fail(msg) { console.error('✗ ' + msg); process.exit(1); }

/* ---- 1. 从 index.html 读运行文件 ---- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
  .map(function (m) { return m[1]; })
  .filter(function (u) { return !/^https?:|^data:/i.test(u); })
  .map(function (u) { return u.split('?')[0].split('#')[0]; });

const RUNTIME_FILES = [...new Set(refs)].filter(function (f) {
  return f !== 'config.local.js';           // 有 key，不打包
});

/* ---- 2. 非 index.html 引用、但运行必需的文件 ---- */
const EXTRA_FILES = [
  'index.html',            // 页面本身不在「被引用文件」清单里，得单独列
  'serve.py',
  'entries.json',
  'vectors.bin',
  'vectors.meta.json',
  'start.bat',
  'start-lan.bat',
  'requirements.txt',
  'config.local.example.js',
  '安装与启动.md',
  '体验指南.md',
  /* 服务端运行时要读这份判据做输入过滤（不是开发脚本，是数据）。
     `_dev/` 目录对 HTTP 是 404，不会把内部结构暴露出去。 */
  '_dev/compliance-list.json'
];

const EXTRA_DIRS = ['models'];

/* ---- 3. 干净输出目录 ---- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

function copyFile(rel) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) fail('缺文件：' + rel);
  const dst = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

RUNTIME_FILES.forEach(copyFile);
EXTRA_FILES.forEach(copyFile);
EXTRA_DIRS.forEach(function (d) {
  const src = path.join(ROOT, d);
  if (!fs.existsSync(src)) fail('缺目录：' + d);
  fs.cpSync(src, path.join(OUT, d), { recursive: true });
});

/* ---- 4. 产品版 start.bat（去掉开发机路径，优先用自带运行时）---- */
const START_BAT = String.raw`@echo off
rem ============================================================
rem PromptLab one-click start
rem   double-click: find Python -> start server -> open browser
rem ============================================================
setlocal
cd /d "%~dp0"

set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
if "%PORT%"=="" set PORT=8777
if "%PL_HOST%"=="" set PL_HOST=127.0.0.1

set "PY="
if exist "%~dp0runtime\python.exe" set "PY=%~dp0runtime\python.exe"
rem 2026-11-13：以前只判断「where python 有没有结果」，被微软商店的占位符骗了 ——
rem 那个 python.exe 能找到，但跑起来什么都不做、退出码 9009、一个字都不打印，
rem 于是窗口里只剩 "Server stopped."，用户根本不知道发生了什么。
rem 现在两条规矩：① 跳过 WindowsApps 下的假 python；② 找到了也要真的跑一次才算数。
if not defined PY (
  for /f "delims=" %%P in ('where python 2^>nul ^| find /v /i "WindowsApps"') do if not defined PY set "PY=%%P"
)
if not defined PY (
  for /f "delims=" %%P in ('where py 2^>nul ^| find /v /i "WindowsApps"') do if not defined PY set "PY=%%P"
)
if defined PY (
  "%PY%" -c "import sys;raise SystemExit(0 if sys.version_info>=(3,8) else 1)" >nul 2>nul
  if errorlevel 1 set "PY="
)
if not defined PY (
  echo.
  echo [ERROR] No usable Python found on this PC.
  echo.
  echo   The "python" from Microsoft Store is only a placeholder - it does nothing.
  echo.
  echo   Option 1 - easiest: use the portable package
  echo             ^(the folder that has a "runtime" subfolder inside^)
  echo             double-click start.bat there; it carries its own Python.
  echo.
  echo   Option 2 - install Python 3.10 or newer from python.org
  echo             during setup TICK "Add python.exe to PATH", then run:
  echo                 pip install -r requirements.txt
  echo.
  pause
  exit /b 1
)

echo.
echo   PromptLab  server: http://127.0.0.1:%PORT%/
if "%PL_HOST%"=="0.0.0.0" echo   LAN access: enabled
if defined PL_ACCESS_CODE echo   Access code: enabled
echo   Close this window to stop the server.
echo.

if not "%NOBROWSER%"=="1" start "" "http://127.0.0.1:%PORT%/"
"%PY%" serve.py %PORT%
set "RC=%ERRORLEVEL%"
echo.
if not "%RC%"=="0" (
  echo [ERROR] Server exited with code %RC% - see the message above.
  echo         "No module named ..."        -^>  pip install -r requirements.txt
  echo         "address already in use"     -^>  set PORT=8788  then run again
  echo.
)
echo Server stopped.
pause
exit /b %RC%
`;
fs.writeFileSync(path.join(OUT, 'start.bat'), START_BAT.replace(/\n/g, '\r\n'), 'utf8');

/* ---- 5. 便携版：复制并精简 Python 运行时 ---- */
if (PORTABLE) {
  if (!fs.existsSync(PY_RUNTIME)) fail('找不到 Python 运行时：' + PY_RUNTIME);
  const RT = path.join(OUT, 'runtime');
  fs.mkdirSync(RT, { recursive: true });

  /* 根目录的文件全带（python.exe / python312.dll / python3.dll / vcruntime*.dll …）。
     上次按白名单只带了几个，漏掉 python3.dll —— tokenizers 的 pyd 正是链它，
     报错却是笼统的「DLL load failed」，查了半天。少一份白名单，少一类坑。 */
  for (const e of fs.readdirSync(PY_RUNTIME, { withFileTypes: true })) {
    if (!e.isFile()) continue;
    fs.copyFileSync(path.join(PY_RUNTIME, e.name), path.join(RT, e.name));
  }
  /* DLLs 目录（里面是 .pyd 依赖的扩展模块）*/
  fs.cpSync(path.join(PY_RUNTIME, 'DLLs'), path.join(RT, 'DLLs'), { recursive: true });

  /* C++ 运行时：onnxruntime / tokenizers 的 pyd 依赖 msvcp140*.dll。
     开发机上 System32 里有（装过 VC++ 运行库），**干净 Windows 上不一定有**，
     缺了就是「模型加载不出来」，而且报错很笼统。这里直接把需要的打包带上。 */
  const sys32 = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32');
  ['msvcp140.dll', 'msvcp140_1.dll', 'concrt140.dll', 'vcomp140.dll'].forEach(function (n) {
    const src = path.join(sys32, n);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(RT, n));
  });

  /* Lib 要留，但把这些没用的大块裁掉（都是测试/IDE/示例） */
  const DROP_LIB = new Set(['test', 'idlelib', 'turtledemo', 'ensurepip', 'site-packages\\pip',
    'site-packages\\setuptools', 'site-packages\\wheel', 'site-packages\\pkg_resources']);
  fs.cpSync(path.join(PY_RUNTIME, 'Lib'), path.join(RT, 'Lib'), {
    recursive: true,
    filter: function (src) {
      const rel = path.relative(path.join(PY_RUNTIME, 'Lib'), src);
      if (!rel) return true;
      if (rel.split(path.sep)[0] === '__pycache__') return false;
      if (DROP_LIB.has(rel)) return false;
      if (path.basename(src) === '__pycache__') return false;
      return true;
    }
  });
  fs.rmSync(path.join(RT, 'Lib', 'site-packages', 'pip'), { recursive: true, force: true });

  /* 用复制出来的运行时自检依赖（这是「便携版能不能用」的硬证据） */
  const r = require('child_process').spawnSync(
    path.join(RT, 'python.exe'),
    ['-c', 'import numpy,onnxruntime,tokenizers;print("deps-ok")'],
    { encoding: 'utf8', timeout: 120000 }
  );
  if (r.status !== 0) {
    console.error(r.stdout, r.stderr);
    fail('便携版运行时自检失败（import numpy/onnxruntime/tokenizers）');
  }
  console.log('✓ 便携运行时自检通过：' + String(r.stdout).trim());
}

/* ---- 6. 打包后自检：清单里每个文件都在 ---- */
const missing = [];
RUNTIME_FILES.concat(EXTRA_FILES).forEach(function (f) {
  if (!fs.existsSync(path.join(OUT, f))) missing.push(f);
});
EXTRA_DIRS.forEach(function (d) {
  if (!fs.existsSync(path.join(OUT, d))) missing.push(d + '/');
});
if (missing.length) fail('打包后缺文件：' + missing.join(', '));

/* 绝不打包 key：只扫「看起来像真钥匙」的串（sk- 后面跟 20+ 位），
   文档里的 `sk-...` 占位符不算。 */
if (fs.existsSync(path.join(OUT, 'config.local.js'))) fail('包里出现了 config.local.js（会泄漏 key）');
const REAL_KEY = /sk-[A-Za-z0-9]{20,}/;
const leaked = [];
(function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { scan(f); continue; }
    if (!/\.(js|md|txt|bat)$/i.test(e.name)) continue;
    let txt = '';
    try { txt = fs.readFileSync(f, 'utf8'); } catch (err) { continue; }
    if (REAL_KEY.test(txt)) leaked.push(path.relative(OUT, f));
  }
})(OUT);
if (leaked.length) fail('包里出现疑似真实密钥：' + leaked.join(', '));

/* ---- 7. 统计 ---- */
function dirSize(p) {
  let total = 0, count = 0;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else { total += fs.statSync(f).size; count++; }
    }
  })(p);
  return { mb: total / 1048576, count: count };
}
const s = dirSize(OUT);
console.log('✓ 已生成 ' + path.relative(ROOT, OUT));
console.log('  文件 ' + s.count + ' 个 / ' + s.mb.toFixed(1) + ' MB（' + (PORTABLE ? '便携版，含 Python 运行时' : '标准版，需本机 Python') + '）');
