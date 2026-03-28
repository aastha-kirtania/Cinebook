#!/usr/bin/env bash
set -euo pipefail

export HOME=/home/kiit
export PATH="$HOME/.cargo/bin:$PATH"
export MOC_PATH="$HOME/.motoko/moc/1.2.0/bin/moc"
export MOTOKO_CORE="$HOME/.motoko/core/moc-1.2.0"
export MOTOKO_BASE="$HOME/.motoko/base/SKIP"

cd "$HOME"
rm -rf cinebook-run
mkdir -p cinebook-run

cd /mnt/c/Users/KIIT0001/cinebook
tar \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.icp \
  --exclude=src/frontend/node_modules \
  --exclude=src/frontend/dist \
  -cf - . | (cd "$HOME/cinebook-run" && tar -xf -)

cd "$HOME/cinebook-run"

icp network start -d || true
icp canister create --environment local frontend || true
icp canister create --environment local backend || true

export BACKEND_CANISTER_ID
BACKEND_CANISTER_ID="$(icp canister settings show --environment local --id-only backend)"
export STORAGE_GATEWAY_URL=http://localhost:6188
export II_URL=http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8000

icp deploy --environment local frontend backend
