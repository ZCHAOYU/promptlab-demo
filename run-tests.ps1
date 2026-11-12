# PromptLab 一键回归
# 用法：
#   pwsh -File run-tests.ps1           # 只跑离线测试（不需要 key 和服务）
#   pwsh -File run-tests.ps1 -Live     # 额外跑真机验证（需要 key + serve.py）

param([switch]$Live)

$ErrorActionPreference = 'Continue'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

# ---- 找 node ----
$node = $null
$c = Get-Command node -ErrorAction SilentlyContinue
if ($c) { $node = $c.Source }
if (-not $node) {
    $cands = @(
        "$env:USERPROFILE\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe",
        "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
    )
    foreach ($p in $cands) { if (Test-Path $p) { $node = $p; break } }
}
if (-not $node) { Write-Host "找不到 node.exe，请把 node 加进 PATH" -ForegroundColor Red; exit 1 }
Write-Host "node: $node`n" -ForegroundColor DarkGray

$offline = @(
    @{ name = '逻辑（45 项）';      file = 'test-agent-logic.js' },
    @{ name = 'UI 集成（24 项）';   file = 'test-agent-ui.js' },
    @{ name = '面板冒烟（6 项）';   file = 'test-agent-panel.js' }
)

$live = @(
    @{ name = '规则边界（8 项）';   file = '_dev\probe-rules.js' },
    @{ name = '意图分流（8 项）';   file = '_dev\probe-intent.js' },
    @{ name = '近似标记';           file = '_dev\probe-weak.js' },
    @{ name = '追问质量';           file = '_dev\probe-clarify.js' },
    @{ name = '真实输入 10 条';     file = '_dev\run-real.js' }
)

$failed = @()

function Run-Suite($list, $label) {
    Write-Host "===== $label =====" -ForegroundColor Cyan
    foreach ($t in $list) {
        Write-Host ("--- " + $t.name + " (" + $t.file + ")") -ForegroundColor DarkGray
        & $node $t.file
        $code = $LASTEXITCODE
        if ($code -ne 0) {
            $failed += $t.name
            Write-Host ("    ✗ 退出码 " + $code) -ForegroundColor Red
        } else {
            Write-Host "    ✓" -ForegroundColor Green
        }
        Write-Host ""
    }
}

Run-Suite $offline '离线测试（不联网）'

if ($Live) {
    if (-not $env:DEEPSEEK_API_KEY) {
        Write-Host "提示：未设置 `$env:DEEPSEEK_API_KEY，将用 config.local.js 里的 key" -ForegroundColor Yellow
    }
    Run-Suite $live '真机验证（需 serve.py 已启动）'
}

Write-Host "================ 汇总 ================" -ForegroundColor Cyan
if ($failed.Count -eq 0) {
    Write-Host "全部通过" -ForegroundColor Green
    exit 0
} else {
    Write-Host ("失败 " + $failed.Count + " 组：" + ($failed -join '、')) -ForegroundColor Red
    exit 1
}
