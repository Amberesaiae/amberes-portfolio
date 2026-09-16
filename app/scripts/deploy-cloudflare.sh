#!/usr/bin/env bash
# Build + deploy to Cloudflare Workers with Static Assets.
#
# /vids/* is served from R2 by the worker (single files exceed the 25 MiB
# Workers asset cap), so dist/vids is held aside for the upload and restored
# after — local dev and previews keep using public/vids untouched.
set -euo pipefail

cd "$(dirname "$0")/.."

npm run build

STASH="$(mktemp -d)/vids"
if [ -d dist/vids ]; then
  mv dist/vids "$STASH"
  trap 'mv "$STASH" dist/vids' EXIT
fi

wrangler deploy
