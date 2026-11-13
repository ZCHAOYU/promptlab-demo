@echo off
rem ============================================================
rem PromptLab 一键启动（2026-11-11）
rem 双击即可：先找 Python，再起服务，最后自动打开浏览器。
rem 只用英文提示，避免 cmd 代码页把中文显示成乱码。
rem ============================================================
setlocal
cd /d "%~dp0"

set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
if "%PORT%"=="" set PORT=8777
if "%PL_HOST%"=="" set PL_HOST=127.0.0.1

set "PY="
if exist "%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" (
  set "PY=%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
)
rem 2026-11-13：光看 where 有没有结果不算数 —— 微软商店那个 python.exe 是占位符，
rem 能找到、跑起来却什么都不做（退出码 9009、零输出）。跳过 WindowsApps，并要求真能跑。
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
  echo   Install Python 3.10+ from python.org ^(TICK "Add python.exe to PATH"^),
  echo   then run:  pip install -r requirements.txt
  echo.
  pause
  exit /b 1
)

echo.
echo   PromptLab  server: http://127.0.0.1:%PORT%/
if "%PL_HOST%"=="0.0.0.0" echo   LAN access: enabled ^(see addresses below^)
if defined PL_ACCESS_CODE echo   Access code: enabled
echo.
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
