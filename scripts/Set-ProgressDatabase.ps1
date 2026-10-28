[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)][ValidateNotNullOrEmpty()][string]$ResourceGroup,
    [Parameter(Mandatory)][ValidateNotNullOrEmpty()][string]$SourceApp,
    [Parameter(Mandatory)][ValidateNotNullOrEmpty()][string]$TargetApp,
    [string]$Subscription
)

$ErrorActionPreference = 'Stop'
if ($SourceApp -eq $TargetApp) { throw 'Source and target applications must be different.' }
if (-not (Get-Command az -ErrorAction SilentlyContinue)) { throw 'Azure CLI is required. Run this script in an authenticated Azure PowerShell Cloud Shell session.' }

$tokenArguments = @('account', 'get-access-token', '--resource-type', 'arm', '--output', 'json', '--only-show-errors')
if ($Subscription) { $tokenArguments += @('--subscription', $Subscription) }
$tokenJson = & az @tokenArguments 2>$null
if ($LASTEXITCODE -ne 0 -or -not $tokenJson) { throw 'An authenticated Azure CLI session is required.' }
$azureSession = ($tokenJson -join "`n") | ConvertFrom-Json
if (-not $azureSession.accessToken -or $azureSession.subscription -notmatch '^[0-9a-fA-F-]{36}$') { throw 'Azure authentication did not return a valid subscription and access token.' }
$azureHeaders = @{ Authorization = 'Bearer ' + $azureSession.accessToken }
$azureApiVersion = '2024-11-01'
$groupSegment = [Uri]::EscapeDataString($ResourceGroup)
$resourcePrefix = "https://management.azure.com/subscriptions/$($azureSession.subscription)/resourceGroups/$groupSegment/providers/Microsoft.Web/sites/"
$sourceEndpoint = $resourcePrefix + [Uri]::EscapeDataString($SourceApp) + '/config/appsettings'
$targetEndpoint = $resourcePrefix + [Uri]::EscapeDataString($TargetApp) + '/config/appsettings'

function Invoke-ApplicationSettings([string]$Endpoint, [string]$Method, [string]$Body) {
    $requestParameters = @{ Uri = $Endpoint; Method = $Method; Headers = $azureHeaders; ErrorAction = 'Stop' }
    if ($Body) { $requestParameters.Body = $Body; $requestParameters.ContentType = 'application/json' }
    try { return Invoke-RestMethod @requestParameters }
    catch { throw 'Azure application settings request failed. Verify the application names, subscription and access permissions.' }
}

try {
    $sourceConfiguration = Invoke-ApplicationSettings ($sourceEndpoint + '/list?api-version=' + $azureApiVersion) 'Post' ''
    $targetConfiguration = Invoke-ApplicationSettings ($targetEndpoint + '/list?api-version=' + $azureApiVersion) 'Post' ''
    if ($null -eq $sourceConfiguration.properties -or $null -eq $targetConfiguration.properties) { throw 'Azure returned invalid application settings.' }
    $databaseSettings = @{}
    if (-not [string]::IsNullOrWhiteSpace($sourceConfiguration.properties.PROGRESS_DATABASE_URL)) {
        $databaseSettings.PROGRESS_DATABASE_URL = [string]$sourceConfiguration.properties.PROGRESS_DATABASE_URL
        $databaseSettings.PROGRESS_USE_AZURE_POSTGRESQL = 'false'
    } else {
        if ($sourceConfiguration.properties.PROGRESS_USE_AZURE_POSTGRESQL -ne 'true') { throw 'The source application does not have progress database settings enabled.' }
        foreach ($settingName in @('AZURE_POSTGRESQL_HOST', 'AZURE_POSTGRESQL_DATABASE', 'AZURE_POSTGRESQL_USER', 'AZURE_POSTGRESQL_PASSWORD')) {
            $settingValue = [string]$sourceConfiguration.properties.$settingName
            if ([string]::IsNullOrWhiteSpace($settingValue)) { throw "The source application is missing $settingName." }
            $databaseSettings[$settingName] = $settingValue
        }
        $databaseSettings.AZURE_POSTGRESQL_PORT = if ($sourceConfiguration.properties.AZURE_POSTGRESQL_PORT) { [string]$sourceConfiguration.properties.AZURE_POSTGRESQL_PORT } else { '5432' }
        $databaseSettings.PROGRESS_USE_AZURE_POSTGRESQL = 'true'
        $databaseSettings.PROGRESS_DATABASE_URL = ''
    }
    $updatedSettings = @{}
    foreach ($setting in $targetConfiguration.properties.PSObject.Properties) { $updatedSettings[$setting.Name] = $setting.Value }
    foreach ($settingName in $databaseSettings.Keys) { $updatedSettings[$settingName] = $databaseSettings[$settingName] }
    if ($PSCmdlet.ShouldProcess($TargetApp, 'Apply progress database settings')) {
        $requestBody = @{ properties = $updatedSettings } | ConvertTo-Json -Depth 10 -Compress
        $null = Invoke-ApplicationSettings ($targetEndpoint + '?api-version=' + $azureApiVersion) 'Put' $requestBody
        $verifiedConfiguration = Invoke-ApplicationSettings ($targetEndpoint + '/list?api-version=' + $azureApiVersion) 'Post' ''
        foreach ($settingName in $databaseSettings.Keys) {
            if ([string]$verifiedConfiguration.properties.$settingName -cne [string]$databaseSettings[$settingName]) { throw 'The applied database settings could not be verified.' }
        }
        Write-Output 'Progress database settings applied and verified.'
    }
} finally {
    $azureHeaders = $null
    $azureSession = $null
    $tokenJson = $null
    $sourceConfiguration = $null
    $targetConfiguration = $null
    $databaseSettings = $null
    $updatedSettings = $null
    $requestBody = $null
    $verifiedConfiguration = $null
}
