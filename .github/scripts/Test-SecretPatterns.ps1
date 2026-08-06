[CmdletBinding()]
param(
    [Parameter()]
    [string] $Root = (Get-Location).Path,

    [Parameter()]
    [switch] $SelfTest
)

$ErrorActionPreference = 'Stop'

$secretPatterns = [ordered]@{
    'private-key' = '-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'
    'aws-access-key' = '(?<![A-Z0-9])(?:AKIA|ASIA)[0-9A-Z]{16}(?![A-Z0-9])'
    'github-token' = '(?<![A-Za-z0-9_])(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{80,255})(?![A-Za-z0-9_])'
    'openai-key' = '(?<![A-Za-z0-9_-])sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}(?![A-Za-z0-9_-])'
    'anthropic-key' = '(?<![A-Za-z0-9_-])sk-ant-[A-Za-z0-9_-]{32,}(?![A-Za-z0-9_-])'
    'google-api-key' = '(?<![A-Za-z0-9_-])AIza[0-9A-Za-z_-]{35}(?![A-Za-z0-9_-])'
    'stripe-secret-key' = '(?<![A-Za-z0-9_])sk_(?:live|test)_[0-9A-Za-z]{20,}(?![A-Za-z0-9])'
    'jwt-bearer-token' = '(?i)(?:Bearer\s+)?eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
    'azure-storage-connection' = '(?i)DefaultEndpointsProtocol=https?;AccountName=[^;\s]+;AccountKey=[A-Za-z0-9+/=]{20,};EndpointSuffix=[^;\s]+'
    'credentialed-database-url' = '(?i)(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|mssql):\/\/[^\s:/@]+:[^<\s/@]+@[^\s]+'
    'slack-token' = '(?<![A-Za-z0-9-])xox[baprs]-[A-Za-z0-9-]{20,}(?![A-Za-z0-9-])'
    'oauth-client-secret' = '(?i)(?:oauth[_-]?)?client[_-]?secret\s*[:=]\s*["'']?[A-Za-z0-9+/=_-]{16,}["'']?'
    'generic-assigned-secret' = '(?i)(?:api[_-]?key|access[_-]?token|password)\s*[:=]\s*["''][A-Za-z0-9+/=_-]{16,}["'']'
}

function Find-SecretPatternNames {
    param([Parameter(Mandatory)][string] $Content)

    $patternNames = @()
    foreach ($entry in $secretPatterns.GetEnumerator()) {
        if ($Content -match $entry.Value) { $patternNames += $entry.Key }
    }
    return @($patternNames)
}

if ($SelfTest) {
    $positiveFixtures = [ordered]@{
        'openai' = 'sk-proj-' + ('A' * 48)
        'anthropic' = 'sk-ant-api03-' + ('B' * 48)
        'google' = 'AIza' + ('C' * 35)
        'stripe-live' = 'sk_live_' + ('D' * 24)
        'stripe-test' = 'sk_test_' + ('E' * 24)
        'jwt' = 'Bearer eyJ' + ('a' * 20) + '.' + ('b' * 24) + '.' + ('c' * 24)
        'azure-storage' = 'DefaultEndpointsProtocol=https;AccountName=sample;AccountKey=' + ('A' * 40) + ';EndpointSuffix=core.windows.net'
        'postgres' = 'postgresql://sample_user:' + ('p' * 20) + '@db.example.invalid/sample'
        'generic-database' = 'mysql://sample_user:' + ('q' * 20) + '@db.example.invalid/sample'
        'github-classic' = 'ghp_' + ('F' * 40)
        'github-fine-grained' = 'github_pat_' + ('G' * 82)
        'aws' = 'AKIA' + ('H' * 16)
        'private-key' = '-----BEGIN ' + 'PRIVATE KEY-----'
        'oauth' = 'client_secret=' + ('I' * 24)
        'slack' = 'xoxb-' + ('1' * 12) + '-' + ('J' * 24)
    }
    $safeFixtures = [ordered]@{
        'openai-placeholder' = 'sk-REPLACE_ME'
        'environment-reference' = '${OPENAI_API_KEY}'
        'redacted-database-url' = 'postgresql://user:<password>@host/database'
        'ordinary-prose' = 'The client secret must never be committed.'
        'example-label' = 'api_key = "example"'
    }

    $failures = @()
    foreach ($entry in $positiveFixtures.GetEnumerator()) {
        if ((Find-SecretPatternNames -Content $entry.Value).Count -eq 0) { $failures += "positive:$($entry.Key)" }
    }
    foreach ($entry in $safeFixtures.GetEnumerator()) {
        if ((Find-SecretPatternNames -Content $entry.Value).Count -gt 0) { $failures += "safe:$($entry.Key)" }
    }

    if ($failures.Count -gt 0) {
        $failures | ForEach-Object { Write-Error -ErrorAction Continue "Secret-scanner self-test failure: $_ [value redacted]" }
        exit 1
    }

    Write-Output "Secret-scanner self-test passed: $($positiveFixtures.Count) positive and $($safeFixtures.Count) safe fixtures."
    exit 0
}

$files = & git -C $Root ls-files --cached --others --exclude-standard
if ($LASTEXITCODE -ne 0) { throw 'Unable to enumerate repository files.' }

$findings = @()
foreach ($relativePath in $files) {
    $fullPath = Join-Path $Root $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) { continue }
    $content = Get-Content -LiteralPath $fullPath -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { continue }
    $matchedNames = Find-SecretPatternNames -Content $content
    foreach ($matchedName in $matchedNames) {
        $findings += [pscustomobject]@{ Path = $relativePath; Pattern = $matchedName }
    }
}

if ($findings.Count -gt 0) {
    $findings | Sort-Object Path, Pattern -Unique | ForEach-Object {
        Write-Error -ErrorAction Continue "Potential secret detected in $($_.Path) (pattern: $($_.Pattern); value: [REDACTED])"
    }
    exit 1
}

Write-Output "Secret-pattern check passed for $($files.Count) repository files."
