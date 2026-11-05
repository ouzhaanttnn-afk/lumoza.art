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
| Visual identity review of any page | `/identity-review <url or path>` runs seven read-only auditors in parallel: `identity-brand-auditor`, `typography-auditor`, `colour-contrast-auditor`, `layout-composition-auditor`, `voice-content-auditor`, `imagery-art-direction-auditor`, `motion-interaction-auditor` (`.claude/agents/`) |

Details, versions and test results: `docs/design-skills.md`.

## Rules for this project

- Brand: the L-and-spark mark in `assets/brand/` (indigo tile), Instrument Sans, one flat colour field per game taken from its icon, and the owner's palette for the studio itself (since 2026-11-05): warm dark ground `#2f2826` (never pure black), cream ink `#f4ece0`, accents `#B87076` rose, `#B88370` terracotta, `#709FB8` blue, `#70B8A9` teal, `#635854` taupe; dark text `#1d1715` on the palette fields. Do not change them without being asked.
- The owner asked for a Liquid Glass touch (header bar, fact plates) and sulfur `#E1E620` on hover only (resting link underlines use the text colour). These are the only allowed exceptions to the taste skill's no-glass, no-gradient rules; they carry `taste-skill-ignore` comments in `styles.css`.
- The hero is deliberately lively, inspired by kenjilambert.com: a three-line headline with game icons in parentheses (allowed past the two-line rule: run the inspector with `--allow headline-lines`), and a Lumoza card swinging from a cord over a colour that cycles through the palette. The "OUR GAMES *" marquee, coloured pill tags on games and development cards come from the same direction.
- The English page sends Turkish browsers to `/tr/` once (inline script in the head); an explicit language click is remembered in `localStorage` (`lumoza-lang`).
- The owner loves the torn game titles that slide apart while scrolling and the ambient layer behind each game (embers for Hearthwalker, falling gold leaf for MİHENKAYNAK, rising price ticks for TradeUp, stone glints for Alvera). Keep them.
- AI stays a small mention (the studio sentence, one principle, page descriptions). Never in headlines.
- Every page change ships in English and Turkish.
- Gates before pushing: `npm run check`, `node .claude/skills/design-taste-frontend/scripts/lint.mjs index.html styles.css main.js`, and the inspector (needs Chrome; as root set `CHROME_PATH` to a wrapper that adds `--no-sandbox`).
- Impeccable hooks are not installed on purpose. Do not run `/impeccable init` unless asked.
