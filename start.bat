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
if not defined PY (
  where python >nul 2>nul && set "PY=python"
)
if not defined PY (
  where py >nul 2>nul && set "PY=py"
)
if not defined PY (
  echo.
  echo [ERROR] Python not found.
  echo         Install Python 3.10+ and make sure "python" is on PATH,
  echo         then run this file again.
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
echo.
echo Server stopped.
pause
