# Lumoza site: working notes for Claude

Static site, no framework. `npm run build` generates `index.html` and `tr/index.html` from `scripts/pages.mjs`, checks them and writes `dist/`. Edit copy and structure in `scripts/pages.mjs`, styling in `styles.css`. Never edit the generated HTML by hand.

## Design skills (installed in `.claude/skills/`)

Pick by intent; load only what the task needs.

| Intent | Use |
| --- | --- |
| New page or visual direction | `ui-ux-pro-max` (system, tokens, accessibility rules), then `design-taste-frontend` (art direction, inspector) |
| "Why does this look bad / generic?" | `impeccable` (`.claude/skills/impeccable/scripts/impeccable detect <files>`), `interface-review`, `teardown` |
| Colour, type, layout, copy polish | `better-colors`, `better-typography`, `better-layout`, `better-writing`, `better-interface` |
| Accessibility or mobile fixes | `better-accessibility`, `better-layout` |
| Screenshot or Figma to code | `build-design` |

Details, versions and test results: `docs/design-skills.md`.

## Rules for this project

- Brand is fixed: indigo `#3346d3`, the L-and-spark mark in `assets/brand/`, Instrument Sans, and one flat colour field per game taken from its icon. Do not change them without being asked.
- The owner asked for a Liquid Glass touch (header bar, fact plates) and sulfur `#E1E620` on hover only. These are the only allowed exceptions to the taste skill's no-glass, no-gradient rules; they carry `taste-skill-ignore` comments in `styles.css`.
- AI stays a small mention (the studio sentence, one principle, page descriptions). Never in headlines.
- Every page change ships in English and Turkish.
- Gates before pushing: `npm run check`, `node .claude/skills/design-taste-frontend/scripts/lint.mjs index.html styles.css main.js`, and the inspector (needs Chrome; as root set `CHROME_PATH` to a wrapper that adds `--no-sandbox`).
- Impeccable hooks are not installed on purpose. Do not run `/impeccable init` unless asked.
