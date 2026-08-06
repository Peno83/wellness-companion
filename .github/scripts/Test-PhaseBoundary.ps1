[CmdletBinding()]
param(
    [Parameter()]
    [string] $Root = (Get-Location).Path,

    [Parameter()]
    [string[]] $Files,

    [Parameter()]
    [switch] $SelfTest
)

$ErrorActionPreference = 'Stop'

function Test-PermittedPath {
    param([Parameter(Mandatory)][string] $Path)

    $normalized = $Path.Replace('\', '/') -replace '^\./', ''

    if ($normalized -match '\.md$') { return $true }
    if ($normalized -match '(^|/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|Dockerfile|docker-compose(?:\.[^/]+)?\.ya?ml)$') { return $false }
    if ($normalized -match '^(app|src|packages)/') { return $false }
    if ($normalized -match '\.(?:ts|tsx|js|jsx|mjs|cjs|py|java|cs|go|rs|rb|php|sql|prisma)$') { return $false }
    if ($normalized -match '(^|/)(?:schema|migrations?)(/|\.)') { return $false }
    if ($normalized -match '(^|/)\.env(?:\..+)?$') { return $false }
    if ($normalized -match '\.(?:pem|key|p12|pfx|jks|keystore)$') { return $false }

    if ($normalized -in @('.gitignore', '.gitattributes', '.editorconfig', '.markdownlint.jsonc', '.cspell.json', '.lychee.toml', 'CODEOWNERS')) { return $true }
    if ($normalized -eq '.github/workflows/documentation-quality.yml') { return $true }
    if ($normalized -eq '.github/fixtures/evil-build.yml.fixture') { return $true }
    if ($normalized -match '^\.github/(?:dependabot\.yml|CODEOWNERS|ISSUE_TEMPLATE/[^/]+\.(?:md|ya?ml)|PULL_REQUEST_TEMPLATE\.md|scripts/Test-(?:PhaseBoundary|SecretPatterns|WorkflowPolicy)\.ps1)$') { return $true }

    return $false
}

function Get-RepositoryFiles {
    param([Parameter(Mandatory)][string] $RepositoryRoot)

    $result = & git -C $RepositoryRoot ls-files --cached --others --exclude-standard
    if ($LASTEXITCODE -ne 0) { throw 'Unable to enumerate repository files.' }
    return @($result | Where-Object { $_ })
}

function Invoke-BoundaryCheck {
    param([Parameter(Mandatory)][string[]] $CandidateFiles)

    return @($CandidateFiles | Where-Object { -not (Test-PermittedPath -Path $_) })
}

if ($SelfTest) {
    $allowed = @('README.md', 'docs/governance/policy.md', 'docs/schema/overview.md', 'docs/migrations.md', '.github/workflows/documentation-quality.yml', '.github/dependabot.yml', '.cspell.json', '.github/scripts/Test-PhaseBoundary.ps1')
    $prohibited = @('package.json', 'src/index.ts', 'SRC/Index.TS', 'app/page.tsx', 'Dockerfile', 'prisma/schema.prisma', '.env', 'secrets/private.pem', '.github/workflows/evil-build.yml')

    $allowedFailures = Invoke-BoundaryCheck -CandidateFiles $allowed
    $missedProhibited = @($prohibited | Where-Object { Test-PermittedPath -Path $_ })
    if ($allowedFailures.Count -gt 0 -or $missedProhibited.Count -gt 0) {
        Write-Error -ErrorAction Continue "Phase-boundary self-test failed. Allowed rejected: $($allowedFailures -join ', '); prohibited accepted: $($missedProhibited -join ', ')"
        exit 1
    }

    Write-Output 'Phase-boundary self-test passed.'
    exit 0
}

$candidateFiles = if ($PSBoundParameters.ContainsKey('Files')) { $Files } else { Get-RepositoryFiles -RepositoryRoot $Root }
$violations = Invoke-BoundaryCheck -CandidateFiles $candidateFiles
if ($violations.Count -gt 0) {
    $violations | ForEach-Object { Write-Error -ErrorAction Continue "Phase 2A.0 boundary violation: $_" }
    exit 1
}

Write-Output "Phase 2A.0 boundary passed for $($candidateFiles.Count) repository files."
