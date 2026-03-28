$ErrorActionPreference = "Stop"

Write-Host "Starting MySQL container..."
& "C:\Program Files\Docker\Docker\resources\bin\docker.exe" compose -f docker-compose.mysql.yml up -d
Write-Host "MySQL is starting on port 3307."
