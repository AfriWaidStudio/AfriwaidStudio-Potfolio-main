$ErrorActionPreference = "Stop"

npm.cmd run build

$server = Start-Process -FilePath node -ArgumentList @("dist/server.cjs", "--production") -WorkingDirectory (Get-Location) -WindowStyle Hidden -PassThru
try {
  $ready = $false
  for ($i = 0; $i -lt 30; $i++) {
    try {
      Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch {
      Start-Sleep -Seconds 1
    }
  }

  if (-not $ready) {
    throw "Production server did not become ready on http://127.0.0.1:3000."
  }

  npx.cmd playwright test
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}
