#!/bin/sh
# Finishing steps for the v2 redesign. Run from the repo root:
#   sh scripts/finish-v2.sh
set -e

echo "— 1/4 CV into the repo"
mkdir -p cv
cp "/Users/nabhan/Downloads/nabhanyuzqi1-github-io/cv/Nabhan_Yuzqi_CV.pdf" cv/

echo "— 2/4 remove v1 leftovers"
rm -f _includes/section-who.html _includes/section-think.html _includes/section-sites.html \
      _includes/section-skills.html _includes/section-timeline.html _includes/section-contact.html \
      _data/sites.yml _data/skills.yml remotion/src/ProjectDemo.tsx

echo "— 3/4 regenerate OG image (new design)"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot="$(pwd)/assets/img/og-image.png" "file://$(pwd)/scripts/og-image.html" >/dev/null 2>&1

echo "— 4/4 render Remotion showreel (first run downloads packages — a few minutes)"
sh scripts/render-videos.sh

echo ""
echo "Done. Review, then deploy with:"
echo "  git add -A && git commit -m 'v2: authentic redesign — route board, work index, Remotion showreel, real CV data' && git push"
