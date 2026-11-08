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

- Brand: the final Lumoza logo (2026-11-05, do not redesign; see `docs/brand.md`), master file `assets/brand/lumoza-mark.svg`, Instrument Sans for text and Clash Display (Fontshare API, never committed to the repo) for display type, one flat colour field per game taken from its icon, and the owner's palette for the studio itself (since 2026-11-05): warm dark ground `#2f2826` (never pure black), cream ink `#f4ece0`, accents `#B87076` rose, `#B88370` terracotta, `#709FB8` blue, `#70B8A9` teal, `#635854` taupe; dark text `#1d1715` on the palette fields. Do not change them without being asked.
- Studio name: "Lumoza Studio" in text, titles, developer and copyright lines; the logo and wordmark stay "Lumoza". Never "Studio Nostos" or "Nostoscomp".
- The owner asked for a Liquid Glass touch (header bar, fact plates) and sulfur `#E1E620` on hover only (resting link underlines use the text colour). These are the only allowed exceptions to the taste skill's no-glass, no-gradient rules; they carry `taste-skill-ignore` comments in `styles.css`.
- Design since 2026-11-08 (the owner asked for a professional, original redesign and allowed changing things he liked): "the dark room" (taste-skill direction `dark-room`, `.taste-skill/direction.json`). Lumoza means light, so the whole page is one warm dark ground and the only light comes from the things in it: the Lumoza card hanging from a cord like a lamp (Matter.js pendulum, draggable), each game as a lit window in its own colour with its own ambient light, and Ankara at dusk behind the contact card. Hero = the hanging card plus a rail (h1 "Lumoza Studio", one sentence, the "New" link and one button). Then: Out now (three windows), Coming soon (two landscape windows), Still in the oven (a line-up list), On the web (Alvera), the studio with its icon wall, contact, a one-line footer. The Kenji headline, the colour-cycling hero, the marquee, the iOS shelf and the giant footer wordmark were removed in this redesign. Run the inspector with `--allow shadow` (the hanging card's shadow).
- The English page sends Turkish browsers to `/tr/` once (inline script in the head); an explicit language click is remembered in `localStorage` (`lumoza-lang`).
- The owner loves the torn game titles that slide apart while scrolling (now: each game's name sits above its window, the halves meet at the middle of the screen and part sideways on either side; the owner loved this, 2026-11-08). The screens in each window move with the scroll too: they drop in from above at three speeds, settle mid-screen and drift on (`@keyframes fall`, GSAP fallback in `main.js`). The hero is only as tall as its content (the stage height comes from the card size, `--stage-h`), because the owner found the empty space too big; around the Lumoza card the games hang on their own cords at different lengths (`HANG` in `scripts/pages.mjs`, two of them on phones), sway out of step and link to their windows. and the ambient layer behind each game (embers for Hearthwalker, falling gold leaf for MİHENKAYNAK, rising price ticks for TradeUp, warm motes for Little Stove, soap bubbles for Sparkle Fleet, stone glints for Alvera). Keep them.
- Motion libraries live in `assets/vendor/` (GSAP + ScrollTrigger, Lenis, Matter.js; see `assets/vendor/LICENSES.md`). Matter.js makes the hero card a draggable pendulum; Lenis smooths desktop wheel scrolling; GSAP covers the torn titles where CSS scroll timelines are missing and speeds the marquee with scroll. Everything is skipped under reduced motion and the page works without them.
- The contact photograph is "Ankara by night 2013" by OscarKosy (CC BY-SA 3.0, Wikimedia Commons); its credit line is in the footer and in `assets/credits.json`. Keep the credit if the photo stays.
- Statistics: Umami Cloud (cookie-free), script in the page head, counting only on lumoza.art. Clicks are named in `scripts/pages.mjs` (`track()`): app-store (with game), project-site, launch-news, email, language, next-screens.
- Safari is testable here: Playwright WebKit is installed. WebKit cannot reach local servers in this container, so test `dist/` through `page.route` on a fake https origin.
- Own-game promotion (asked 2026-11-05): the newest game gets Apple's Smart App Banner (`NEWEST_APP` in `scripts/pages.mjs`) and a small "New" link under the hero button (`news` copy). When the next game ships, update both. No third-party ads.
- Each window shows three screens: portrait games three phones (Hearthwalker's middle one is a muted gameplay loop, `hearth-play.mp4`, paused under reduced motion); landscape games (Little Stove, Sparkle Fleet; `wide:` instead of `shots:`) one large and two small (`.is-land`, `.frame-land`); "Next screens" cycles the rest. Little Stove's in-game screens exist in English and Turkish (`{lang}` in the file name); Sparkle Fleet's are Turkish only.
- The owner wants the site to stay compact: one page per language, short scroll. Do not add sections, pages (game pages, press kit) or new libraries unless asked.
- No AI on the page (owner, 2026-11-08: the site felt bland and cringe; AI was removed from the copy, the principles and the page descriptions). Do not add it back unless asked.
- Voice (since 2026-11-08): plain, warm and a little playful, short sentences, "tiny studio", "little worlds". No corporate lines ("design with intent", "a person makes every decision"). The iOS shelf and the hero store links were removed as repeats; each game's stage carries its own button.
- Every page change ships in English and Turkish.
- Gates before pushing: `npm run check`, `node .claude/skills/design-taste-frontend/scripts/lint.mjs index.html styles.css main.js`, and the inspector (needs Chrome; as root set `CHROME_PATH` to a wrapper that adds `--no-sandbox`).
- Impeccable hooks are not installed on purpose. Do not run `/impeccable init` unless asked.
