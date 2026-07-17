# Asset inventory

## In place (generated)

- `assets/img/favicon.svg` — N monogram
- `assets/img/covers/*.svg` — stylized case-study cover art (tuntaskilat,
  kontrack, m-clearance, iot-irrigation, tekka-pos, manob)
- `assets/img/sites/*.jpg` — screenshots of the 5 verified-live sites
  (orah-cafe, query-roastery, isu-indonesia, manob-production, kontrack)
- `assets/img/og-image.png` — social share card (1200×630)

## Wanted from Nabhan (optional upgrades)

- Portrait photo (3:4, dark background) → replaces the monogram frame in the
  "Who I am" section (`_includes/section-who.html`)
- Real app screenshots for Tuntaskilat (customer/crew/admin) and M-Clearance →
  `.case-screens` galleries in their case studies
- IoT field photos (ESP32 box, nursery rows) → IoT case study
- `assets/video/` Remotion renders — see `prompts/REMOTION_PROMPT.md`

## Rules

- Live-site screenshots must be re-captured if a site redesigns; remove the
  card entirely if a site goes down (see `_data/sites.yml`).
- Images ship with explicit width/height and `loading="lazy"` (hero: `eager`).
