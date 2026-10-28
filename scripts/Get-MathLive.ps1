$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$vendorRoot = Join-Path $projectRoot 'vendor'
if (Test-Path -LiteralPath $vendorRoot) { throw 'vendor există deja. Păstrează copia existentă sau verifică manual înainte de înlocuire.' }
$version = '0.111.1'
$metadata = Invoke-RestMethod -Uri "https://registry.npmjs.org/mathlive/$version"
if ($metadata.version -ne $version -or $metadata.dist.tarball -ne "https://registry.npmjs.org/mathlive/-/mathlive-$version.tgz") { throw 'Metadatele pachetului nu corespund versiunii așteptate.' }
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ('sai-mathlive-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempRoot | Out-Null
$archive = Join-Path $tempRoot 'mathlive.tgz'
Invoke-WebRequest -Uri $metadata.dist.tarball -OutFile $archive
$hash=[Security.Cryptography.SHA512]::Create()
$stream=[IO.File]::OpenRead($archive)
try { $actual='sha512-'+[Convert]::ToBase64String($hash.ComputeHash($stream)) } finally { $stream.Dispose(); $hash.Dispose() }
if ($actual -ne $metadata.dist.integrity) { throw 'Verificarea SHA-512 a eșuat. Pachetul nu este copiat.' }
$entries = & tar -tzf $archive
if ($LASTEXITCODE -ne 0 -or ($entries | Where-Object { $_ -notmatch '^package/' -or $_ -match '(^|/)\.\.(/|$)' })) { throw 'Arhiva conține căi nepermise.' }
& tar -xzf $archive -C $tempRoot
if ($LASTEXITCODE -ne 0) { throw 'Extragerea arhivei a eșuat.' }
$dist = Join-Path $tempRoot 'package'
if (-not (Test-Path -LiteralPath (Join-Path $dist 'mathlive.min.js'))) { throw 'Distribuția MathLive lipsește.' }
New-Item -ItemType Directory -Path $vendorRoot | Out-Null
Copy-Item -LiteralPath (Join-Path $dist 'mathlive.min.js') -Destination $vendorRoot
Copy-Item -LiteralPath (Join-Path $dist 'fonts') -Destination $vendorRoot -Recurse
$license = Get-ChildItem -LiteralPath (Join-Path $tempRoot 'package') -File | Where-Object { $_.Name -match '^LICENSE' } | Select-Object -First 1
if (-not $license) { throw 'Licența nu a fost găsită; verifică manual distribuția.' }
Copy-Item -LiteralPath $license.FullName -Destination (Join-Path $vendorRoot 'MATHLIVE-LICENSE.txt')
@{ package = 'mathlive'; version = $version; integrity = $actual; source = $metadata.dist.tarball } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $vendorRoot 'mathlive-package.json') -Encoding utf8
Write-Output "MathLive $version și fonturile sunt disponibile local în $vendorRoot"
Write-Output "Arhiva verificată rămâne în $tempRoot"


