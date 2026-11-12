@echo off
rem ============================================================
rem 一键建仓（2026-11-11）
rem 为什么要这个脚本：这台机器原本没装 git，也没有 .gitignore，
rem 而 config.local.js 里有明文 API key —— 直接 git init && git add .
rem 会把密钥写进历史，删都删不掉。所以把顺序写死：先确认忽略规则生效，再提交。
rem
rem 用法：双击，或在 promptlab 目录运行 init-repo.bat
rem ============================================================
setlocal
cd /d "%~dp0"

set "GIT="
where git >nul 2>nul && set "GIT=git"
if not defined GIT (
  for %%P in ("C:\Program Files\Git\cmd\git.exe" "%LOCALAPPDATA%\Programs\Git\cmd\git.exe") do (
    if exist %%P set "GIT=%%~P"
  )
)
if not defined GIT (
  echo.
  echo [ERROR] Git not found.
  echo   Install: winget install --id Git.Git -e
  echo   Then run this file again.
  echo.
  pause
  exit /b 1
)

if not exist ".gitignore" (
  echo [ERROR] .gitignore missing - refusing to init. Config key would be exposed.
  pause
  exit /b 1
)

if not exist ".git" (
  echo [1/4] git init
  "%GIT%" init -q
  rem 本仓库专用身份，不动全局配置
  "%GIT%" config user.name "Zhang Chenghao"
  "%GIT%" config user.email "dev@promptlab.local"
  "%GIT%" config core.quotepath false
) else (
  echo [1/4] repo already exists, skip init
)

echo [2/4] staging files
"%GIT%" add -A

echo [3/4] secret check
"%GIT%" ls-files --error-unmatch config.local.js >nul 2>nul
if not errorlevel 1 (
  echo.
  echo [FATAL] config.local.js is staged! Aborting before commit.
  echo         Run: git rm --cached config.local.js
  echo.
  pause
  exit /b 1
)
echo       config.local.js not staged - OK

echo [4/4] commit
"%GIT%" commit -q -m "V5.19: 首次纳入版本控制" -m "纳入：app.js / serve.py / 数据层 / 测试脚本 / 文档四份" -m "排除：config.local.js（含明文密钥）/ models / vectors.bin / _archive"
"%GIT%" log --oneline -1

echo.
echo Done. Useful next steps:
echo   git status            - what changed
echo   git diff              - line-by-line diff
echo   git checkout -- x.js  - revert one file
echo.
pause
