$ErrorActionPreference = "SilentlyContinue"

Write-Host "Stopping Cinebook local network..."
wsl -e bash -lc "export HOME=/home/kiit; export PATH=`$HOME/.cargo/bin:`$PATH; cd /home/kiit/cinebook-run && icp network stop"

Write-Host "Done."
