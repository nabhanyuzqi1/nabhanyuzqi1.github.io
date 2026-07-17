#!/bin/sh
# Captures screenshots of the 5 verified-live portfolio sites + the OG image.
# Requires Google Chrome. Run from the repo root:  sh scripts/capture-screenshots.sh
set -e

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="assets/img/sites"
mkdir -p "$OUT"

shot() { # name url
  echo "→ $1"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1280,800 --virtual-time-budget=15000 \
    --screenshot="$OUT/$1.png" "$2" >/dev/null 2>&1
  # convert to compressed jpg at card resolution, drop the png
  sips -s format jpeg -s formatOptions 82 -Z 1024 "$OUT/$1.png" --out "$OUT/$1.jpg" >/dev/null
  rm "$OUT/$1.png"
}

shot orah-cafe        "https://orah-cafe-website.web.app"
shot query-roastery   "https://query-roastery-sampit.web.app/id"
shot isu-indonesia    "https://www.isuindonesia.id"
shot manob-production "https://manobproduction.com"
shot kontrack         "https://kontrack.web.app/"

echo "→ og-image"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=4000 \
  --screenshot=assets/img/og-image.png "file://$(pwd)/scripts/og-image.html" >/dev/null 2>&1

echo "Done:"
ls -la assets/img/sites assets/img/og-image.png
