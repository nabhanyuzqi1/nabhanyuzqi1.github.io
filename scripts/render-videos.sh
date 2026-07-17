#!/bin/sh
# Renders the Remotion showreel into assets/video/. Run from the repo root:
#   sh scripts/render-videos.sh
set -e

mkdir -p remotion/public/shots assets/video
cp assets/img/sites/*.jpg remotion/public/shots/

cd remotion
# --cache: route around a root-owned ~/.npm (avoids EACCES without sudo)
[ -d node_modules ] || npm install --cache "${TMPDIR:-/tmp}/npm-cache-portfolio"
npx --cache "${TMPDIR:-/tmp}/npm-cache-portfolio" remotion render Showreel ../assets/video/showreel.webm --codec=vp8
cd ..

ls -la assets/video/
