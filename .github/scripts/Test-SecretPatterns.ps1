[CmdletBinding()]
param([Parameter()][string] $Root = (Get-Location).Path)

$ErrorActionPreference = 'Stop'
$patterns = @(
    '-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'AKIA[0-9A-Z]{16}',
    'gh[pousr]_[A-Za-z0-9]{36,255}',
    'github_pat_[A-Za-z0-9_]{80,255}',
    'xox[baprs]-[A-Za-z0-9-]{20,}',
    '(?i)(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*["''][A-Za-z0-9+/=_-]{16,}["'']'
)

$files = & git -C $Root ls-files --cached --others --exclude-standard
if ($LASTEXITCODE -ne 0) { throw 'Unable to enumerate repository files.' }

$findings = @()
foreach ($relativePath in $files) {
    $fullPath = Join-Path $Root $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) { continue }
    $content = Get-Content -LiteralPath $fullPath -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { continue }
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $findings += $relativePath
            break
        }
    }
}

if ($findings.Count -gt 0) {
    $findings | Sort-Object -Unique | ForEach-Object { Write-Error "Potential secret pattern detected in: $_" }
    exit 1
}

Write-Output "Secret-pattern check passed for $($files.Count) repository files."
