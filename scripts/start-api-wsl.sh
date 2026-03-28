#!/usr/bin/env bash
set -euo pipefail

export HOME=/home/kiit
export PATH="$HOME/.cargo/bin:$PATH"

cd "$HOME"
rm -rf cinebook-api
mkdir -p cinebook-api

cd /mnt/c/Users/KIIT0001/cinebook
tar \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.icp \
  --exclude=src/frontend/node_modules \
  --exclude=src/frontend/dist \
  -cf - . | (cd "$HOME/cinebook-api" && tar -xf -)

cd "$HOME/cinebook-api"
cp src/server/.env.example src/server/.env
pnpm install
pnpm --filter @cinebook/server start
