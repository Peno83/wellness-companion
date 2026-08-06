[CmdletBinding()]
param(
    [Parameter()]
    [string] $Root = (Get-Location).Path,

    [Parameter()]
    [string] $WorkflowPath = '.github/workflows/documentation-quality.yml',

    [Parameter()]
    [switch] $SelfTest
)

$ErrorActionPreference = 'Stop'
$approvedWorkflowPath = '.github/workflows/documentation-quality.yml'
$approvedActions = @(
    'actions/checkout@11d5960a326750d5838078e36cf38b85af677262',
    'DavidAnson/markdownlint-cli2-action@992badcdf24e3b8eb7e87ff9287fe931bcb00c6e',
    'lycheeverse/lychee-action@e7477775783ea5526144ba13e8db5eec57747ce8',
    'streetsidesoftware/cspell-action@76c6f6d52abd57f4bcab5f3fde1bbd4f19a99eb0'
)
$approvedRunCommands = @(
    './.github/scripts/Test-PhaseBoundary.ps1 -SelfTest',
    './.github/scripts/Test-WorkflowPolicy.ps1 -SelfTest',
    './.github/scripts/Test-WorkflowPolicy.ps1',
    './.github/scripts/Test-PhaseBoundary.ps1',
    './.github/scripts/Test-SecretPatterns.ps1 -SelfTest',
    './.github/scripts/Test-SecretPatterns.ps1'
)

function Test-WorkflowContent {
    param(
        [Parameter(Mandatory)][string] $Path,
        [Parameter(Mandatory)][string] $Content
    )

    $violations = @()
    $normalizedPath = $Path.Replace('\', '/') -replace '^\./', ''
    if ($normalizedPath -ne $approvedWorkflowPath) { $violations += 'workflow path is not approved' }
    if ($Content -match '(?m)^\s*pull_request_target\s*:') { $violations += 'pull_request_target is prohibited' }
    if ($Content -match '\$\{\{\s*secrets\.') { $violations += 'repository secrets are prohibited' }
    if ($Content -match '(?im)^\s*(?:permissions\s*:\s*write-all|[a-z-]+\s*:\s*write)\s*$') { $violations += 'write permissions are prohibited' }
    $insideWorkflowDispatch = $false
    foreach ($line in ($Content -split '\r?\n')) {
        if ($line -match '^  workflow_dispatch\s*:') {
            $insideWorkflowDispatch = $true
            continue
        }
        if ($insideWorkflowDispatch -and $line -match '^  [A-Za-z_-][A-Za-z0-9_-]*\s*:') {
            $insideWorkflowDispatch = $false
        }
        if ($insideWorkflowDispatch -and $line -match '^\s{4,}inputs\s*:') {
            $violations += 'workflow_dispatch inputs are prohibited'
            $insideWorkflowDispatch = $false
        }
    }
    if ($Content -match '(?i)\b(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod)\b') { $violations += 'arbitrary network commands are prohibited' }
    if ($Content -match '(?i)\b(?:npm|pnpm|yarn|bun|pip|pipx|poetry|cargo|gem|composer)\s+(?:install|add|ci)\b') { $violations += 'package installation is prohibited' }
    if ($Content -match '(?i)\b(?:next|npm|pnpm|yarn|bun|docker|dotnet|cargo|go)\s+(?:run\s+)?build\b') { $violations += 'application builds are prohibited' }
    if ($Content -match '(?i)\b(?:deploy|deployment|kubectl|helm|terraform\s+apply|vercel|flyctl)\b') { $violations += 'deployment operations are prohibited' }
    if ($Content -match '(?i)\b(?:prisma\s+migrate|psql|mysql|mongosh|database\s+migrate)\b') { $violations += 'database operations are prohibited' }

    foreach ($match in [regex]::Matches($Content, '(?m)^\s*uses\s*:\s*([^\s#]+)')) {
        if ($match.Groups[1].Value -notin $approvedActions) { $violations += "unapproved action: $($match.Groups[1].Value)" }
    }
    foreach ($match in [regex]::Matches($Content, '(?m)^\s*run\s*:\s*(.+?)\s*$')) {
        if ($match.Groups[1].Value.Trim() -notin $approvedRunCommands) { $violations += 'unapproved run command' }
    }

    return @($violations | Sort-Object -Unique)
}

if ($SelfTest) {
    $approvedPath = Join-Path $Root $approvedWorkflowPath
    $approvedContent = Get-Content -LiteralPath $approvedPath -Raw
    $evilFixturePath = Join-Path $Root '.github/fixtures/evil-build.yml.fixture'
    $evilContent = Get-Content -LiteralPath $evilFixturePath -Raw
    $approvedViolations = Test-WorkflowContent -Path $approvedWorkflowPath -Content $approvedContent
    $evilViolations = Test-WorkflowContent -Path '.github/workflows/evil-build.yml' -Content $evilContent
    if ($approvedViolations.Count -gt 0 -or $evilViolations.Count -eq 0) {
        Write-Error -ErrorAction Continue "Workflow-policy self-test failed. Approved violations: $($approvedViolations -join ', '); evil fixture was rejected: $($evilViolations.Count -gt 0)."
        exit 1
    }
    Write-Output "Workflow-policy self-test passed; evil-build.yml rejected for $($evilViolations.Count) policy violations."
    exit 0
}

$normalizedWorkflowPath = $WorkflowPath.Replace('\', '/') -replace '^\./', ''
$fullWorkflowPath = Join-Path $Root $normalizedWorkflowPath
if (-not (Test-Path -LiteralPath $fullWorkflowPath -PathType Leaf)) { throw "Approved workflow not found: $normalizedWorkflowPath" }
$workflowContent = Get-Content -LiteralPath $fullWorkflowPath -Raw
$violations = Test-WorkflowContent -Path $normalizedWorkflowPath -Content $workflowContent
if ($violations.Count -gt 0) {
    $violations | ForEach-Object { Write-Error -ErrorAction Continue "Workflow policy violation: $_" }
    exit 1
}

Write-Output "Workflow policy passed for $normalizedWorkflowPath."
