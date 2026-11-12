# 全量回归：把所有离线校验脚本跑一遍，只报通过/失败。
# 用法：pwsh -File _dev\run-all.ps1
$ErrorActionPreference = 'Continue'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $here
Set-Location $root

$node = "$env:USERPROFILE\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
if (-not (Test-Path $node)) { $node = 'node' }

$suites = @(
    'test-agent-logic.js',
    'test-agent-ui.js',
    'test-agent-panel.js',
    '_dev\verify-pose-extract.js',
    '_dev\verify-subject-guard.js',
    '_dev\verify-variation.js',
    '_dev\verify-style-variants.js',
    '_dev\verify-faces.js',
    '_dev\verify-variants.js',
    '_dev\verify-scene-detail.js',
    '_dev\verify-real-phrases.js',
    '_dev\verify-oov.js',
    '_dev\verify-chips.js',
    '_dev\verify-fill-applied.js',
    '_dev\verify-plan-a.js',
    '_dev\verify-rollback.js',
    '_dev\verify-jianke.js',
    '_dev\verify-new-roles.js',
    '_dev\check-determinism.js',
    '_dev\audit-repeat.js',
    '_dev\audit-face-contamination.js',
    '_dev\audit-docs.js',
    '_dev\audit-reality.js',
    '_dev\assert-style-refactor.js'
)

$failed = @()
foreach ($f in $suites) {
    if (-not (Test-Path $f)) { Write-Host ("跳过（不存在）" + $f) -ForegroundColor DarkGray; continue }
    & $node $f *> $null
    if ($LASTEXITCODE -ne 0) {
        $failed += $f
        Write-Host ("✗ " + $f + "  退出码 " + $LASTEXITCODE) -ForegroundColor Red
    } else {
        Write-Host ("✓ " + $f) -ForegroundColor Green
    }
}

Write-Host ""
if ($failed.Count -eq 0) {
    Write-Host ("全部通过（" + $suites.Count + " 组）") -ForegroundColor Green
    exit 0
}
Write-Host ("失败 " + $failed.Count + " 组：" + ($failed -join '、')) -ForegroundColor Red
exit 1
