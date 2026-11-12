@echo off
rem ============================================================
rem PromptLab 局域网启动（2026-11-11）
rem 给同一 Wi-Fi 下的几个人试用。会要求设一个访问码——
rem 不设的话，任何能打开这个地址的人都能调用 /api/infer 花你的 key。
rem ============================================================
setlocal
cd /d "%~dp0"

set PL_HOST=0.0.0.0

echo.
echo   LAN mode: other devices on this Wi-Fi can open the page.
echo   An access code is strongly recommended.
echo.
set /p PL_ACCESS_CODE=  Access code (blank = NO protection, not recommended): 
if "%PL_ACCESS_CODE%"=="" (
  echo.
  echo   [WARN] No access code. Anyone on this network can spend your API key.
  echo          Press Ctrl+C now if that is not what you want.
  echo.
  timeout /t 4 >nul
)

call "%~dp0start.bat"
