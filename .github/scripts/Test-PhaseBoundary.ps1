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
    if ($normalized -match '(^|/)\.env(?:\..+)?$' -and $normalized -ne '.env.example') { return $false }
    if ($normalized -match '\.(?:pem|key|p12|pfx|jks|keystore)$') { return $false }
    if ($normalized -match '(?i)(^|/)(?:credentials?|secrets?|tokens?)(?:/|\.|$)') { return $false }
    if ($normalized -match '(?i)(^|/)(?:fixtures?|test-data)/(?:personal|production|real|health-data)(?:/|\.|$)') { return $false }
    if ($normalized -match '(?i)^src/modules/connectors/(?!contracts\.ts$|index\.ts$|synthetic/)[^/]+') { return $false }
    if ($normalized -match '(?i)(?:oauth|healthkit|health-connect-client|samsung-health-sdk|garmin-api|fitbit-api|oura-api|hume-api)') { return $false }

    if ($normalized -in @('package.json', 'package-lock.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.ts', 'postcss.config.mjs', 'eslint.config.mjs', 'vitest.config.ts', 'vitest.setup.ts', 'playwright.config.ts', 'components.json', '.dependency-cruiser.cjs', '.prettierrc.json', '.prettierignore', 'Dockerfile', 'docker-compose.yml', '.dockerignore', '.env.example')) { return $true }
    if ($normalized -match '^app/(?:api/health/route\.ts|globals\.css|layout\.tsx|page\.tsx|error\.tsx)$') { return $true }
    if ($normalized -match '^src/(?:lib|modules)/[A-Za-z0-9_./-]+\.(?:ts|tsx)$') { return $true }
    if ($normalized -match '^src/components/ui/[A-Za-z0-9_-]+\.tsx$') { return $true }
    if ($normalized -match '^(?:tests|e2e)/[A-Za-z0-9_./-]+\.(?:ts|tsx|mjs)$') { return $true }
    if ($normalized -match '^prisma/(?:schema\.prisma|migrations/migration_lock\.toml|migrations/[0-9A-Za-z_-]+/migration\.sql)$') { return $true }

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
    $allowed = @('README.md', 'docs/governance/policy.md', 'docs/schema/overview.md', 'docs/migrations.md', '.github/workflows/documentation-quality.yml', '.github/dependabot.yml', '.cspell.json', '.github/scripts/Test-PhaseBoundary.ps1', 'package.json', 'package-lock.json', 'tsconfig.json', 'app/page.tsx', 'app/api/health/route.ts', 'src/modules/governance/index.ts', 'src/modules/connectors/contracts.ts', 'src/modules/connectors/synthetic/SyntheticWhoopConnector.ts', 'tests/governance.test.ts', 'tests/architecture/attack-boundaries.mjs', 'e2e/status.spec.ts', 'prisma/schema.prisma', 'prisma/migrations/0001_platform_foundation/migration.sql', '.env.example', 'Dockerfile', 'docker-compose.yml')
    $prohibited = @('.env', '.env.local', 'secrets/private.pem', 'credentials.json', '.github/workflows/evil-build.yml', 'src/modules/connectors/whoop/oauth.ts', 'src/modules/connectors/garmin-api.ts', 'src/modules/connectors/hume-api-client.ts', 'tests/fixtures/personal/user-health.json', 'tests/test-data/production/measurements.json')

    $allowedFailures = Invoke-BoundaryCheck -CandidateFiles $allowed
    $missedProhibited = @($prohibited | Where-Object { Test-PermittedPath -Path $_ })
    if ($allowedFailures.Count -gt 0 -or $missedProhibited.Count -gt 0) {
        Write-Error -ErrorAction Continue "Phase-boundary self-test failed. Allowed rejected: $($allowedFailures -join ', '); prohibited accepted: $($missedProhibited -join ', ')"
        exit 1
    }

    Write-Output 'Phase 2A.1 synthetic-foundation boundary self-test passed.'
    exit 0
}

$candidateFiles = if ($PSBoundParameters.ContainsKey('Files')) { $Files } else { Get-RepositoryFiles -RepositoryRoot $Root }
$violations = Invoke-BoundaryCheck -CandidateFiles $candidateFiles
if ($violations.Count -gt 0) {
    $violations | ForEach-Object { Write-Error -ErrorAction Continue "Phase 2A.1 boundary violation: $_" }
    exit 1
}

Write-Output "Phase 2A.1 synthetic-foundation boundary passed for $($candidateFiles.Count) repository files."
