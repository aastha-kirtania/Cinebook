$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$wslScript = "/mnt/c/Users/KIIT0001/cinebook/scripts/run-wsl-deploy.sh"

Write-Host "Starting Cinebook in WSL..."
wsl -e bash $wslScript

Write-Host ""
Write-Host "Cinebook is available at:"
Write-Host "  http://txyno-ch777-77776-aaaaq-cai.localhost:8000"
