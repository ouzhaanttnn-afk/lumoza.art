# Design skills: installation and integration report

Installed on 2026-11-01 into this repository (`.claude/`), at project scope. The cloud session that did this is ephemeral, so a global (`~/.claude`) install would have been lost; project scope travels with the repo and works in any new session that opens it.

## What is installed

| System | Source | Commit | Installer used | Location |
| --- | --- | --- | --- | --- |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | `3a13158` | `npx ui-ux-pro-max-cli init --ai claude` (CLI 2.15.0) | `.claude/skills/ui-ux-pro-max`, plus its helper skills `design`, `design-system`, `brand`, `banner-design`, `slides`, `ui-styling` |
| Taste Skill | https://github.com/Leonxlnx/taste-skill | `12af471` | `npx skills add … --skill design-taste-frontend -a claude-code --copy` | `.claude/skills/design-taste-frontend` |
| Impeccable | https://github.com/pbakaus/impeccable | `e89e3ad` | `npx impeccable install -y --providers=claude --scope=project --no-hooks` (CLI 4.8.0, engine 0.1.18) | `.claude/skills/impeccable`, `.claude/agents/impeccable-*.md` |
| Jakub Krehel skills | https://github.com/jakubkrehel/skills | `592aedc` | `npx skills add jakubkrehel/skills -a claude-code -s '*' --copy` | 14 skills: `better-ui`, `better-interface`, `better-colors`, `better-typography`, `better-layout`, `better-accessibility`, `better-writing`, `interface-review`, `build-design`, `break`, `teardown`, `variant`, `state-machine`, `explain-interface` |

`skills-lock.json` records the taste and Jakub skills with content hashes. The other two record their version in `.claude/skills/impeccable/scripts/VERSION` and in this file.

## Checks done before and during install

- Node 22.22, npm 10.9, git 2.43, Python 3.13, Claude Code 2.1.316. Chromium at `/opt/pw-browsers/chromium`.
- The repo was clean; `.claude/` did not exist, so nothing was overwritten. `~/.claude` was not modified.
- The npm packages have no install scripts. `taste-skill/install.sh` (symlink helper) was read and not used.
- The Impeccable engine binary (22 MB, Linux x64) matches the SHA-256 in `engine-checksums.txt` (`736ed785…`).
- Impeccable ships Claude Code hooks (`SessionStart`, `PostToolUse` on Edit/Write, `Stop`). They run a local binary on every edit and at the end of every turn, so they were **not installed** (`--no-hooks`). The detector is used by hand instead.
- `/impeccable init` was not run.

## Name conflicts

No two project skills share a name. The plugin skills available in some environments (`design:design-system`, `website-design:design-system`, `frontend-design:frontend-design`, …) are namespaced, so they do not collide with `design-system`, `design` and `slides` here. `ui-ux-pro-max`, `design-taste-frontend`, `frontend-design` and `website-design` overlap in purpose; routing in `CLAUDE.md` says which to use when.

## How they work together (used for the 2026-11-01 rebuild)

1. Plan: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<brief>" --design-system -p "Lumoza"`. Its dark/black palette suggestion was rejected (brand and owner preference); its pattern and accessibility checklist were kept.
2. Art direction: `node .claude/skills/design-taste-frontend/scripts/draw.mjs …` dealt "The pinned poster" (seed 61957078, saved in `.taste-skill/direction.json`). The idea sentence: the studio's name stays pinned while each game's own screens and colour pass beneath it, and each game's name is torn at the seam.
3. Build: `scripts/pages.mjs` + `styles.css`, real pictures only (App Store screenshots, the BIMQUEST repository's own screenshots, one credited Wikimedia photograph).
4. Audit: `node …/inspect.mjs` at 1440, 768 and 390; `…/lint.mjs`; `impeccable detect`.
5. Polish: rules from `better-accessibility`, `better-colors`, `better-typography`, `better-layout` applied by hand (focus visibility under the fixed bar, label-in-name, live region for the screen switcher, contrast table, 44px targets, short-viewport fallback).

## Test results

| Check | Result |
| --- | --- |
| ui-ux-pro-max `search.py --design-system` | Ran; produced a design system. |
| taste `draw.mjs`, `assets.mjs`, `lint.mjs`, `inspect.mjs` | Ran. Final inspector run: 0 FAIL. Remaining WARN: no footage (no honest clip of the subject), pinned title halves pass over the next game's pictures while the stages hand over. |
| `impeccable detect` | Ran (engine verified). Its static contrast findings for white text on the games' fields are false positives because the field colours are set on child panes; real ratios were computed by hand (all ≥ 4.5:1 for text; the smallest, 5.7:1). It also flags Instrument Sans as common; kept because it is the brand face. |
| Jakub skills | Installed and readable; their rules were applied by hand. They were **not invoked as slash skills** in the session that installed them, because Claude Code loads skills at session start. |
| New session sees the skills | **Not verified** in the installing session. Open the repo in a new session and run `/skills`. |
| Global (user-level) install | Not done on purpose (see above). |

## Update, remove, roll back

```bash
npx ui-ux-pro-max-cli update            # or: npx ui-ux-pro-max-cli init --ai claude
npx skills update                       # taste + Jakub skills (uses skills-lock.json)
npx impeccable update --no-hooks
git checkout -- .claude skills-lock.json   # roll back to the committed state
git rm -r .claude skills-lock.json         # remove everything
```

## Using them in a new project

Copy `.claude/` (and `skills-lock.json`) into the project, or install globally on a machine you control:

```bash
npm install -g ui-ux-pro-max-cli && uipro init --ai claude --global
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -g -a claude-code
npx skills add jakubkrehel/skills -g -a claude-code -s '*'
npx impeccable install -y --providers=claude --scope=global --no-hooks
```

Automatic: nothing runs by itself (no hooks). Manual: every skill is invoked by Claude when the request matches its description, or by you with `/<skill-name>`; the scripts (`search.py`, `draw.mjs`, `inspect.mjs`, `impeccable detect`) are run on request.

## Critique of the final build (references/critique.md format, short)

- Strengths: one idea carried through (name pinned, games' own screens and colour pass beneath, names torn at the seam); real pictures only; first screen says what it is and what to do; the same structure in two languages.
- Weaknesses: the torn titles cross the next game's pictures while stages hand over (inspector WARN); the contact screen is mostly colour field with one large address; no footage; the three small `Son Ocak` crops are drawn from one icon at 2x and are soft.
- Not done: scroll-scene gate (`scenes.mjs`) because the page has no scroll scenes from the taste library; Safari and Firefox were not tested (the torn effect needs scroll-driven animations; without them the titles simply stay aligned).
- Allowed exceptions, as requested by the owner: Liquid Glass bar and plates, indigo accent, sulfur hover.

## Later change

The owner disliked the pinned "Lumo / za" halves and the floating app screens in the hero. The name is now one plain "Lumoza" title, and the hero stage floats only the Lumoza logo over the colour that changes with each game. The torn game titles stay.

## Visual identity auditors (written for this project)

Seven read-only agents in `.claude/agents/`, each with one lens, the same input rules (screenshots at 1440, 768 and 390 px before judging), the same evidence rule and the same report format (score 0-10, what works, ranked findings with fixes, hand-offs, not checked):

| Agent | Lens |
| --- | --- |
| `identity-brand-auditor` | Logo, brand assets, distinctiveness, consistency across surfaces and sub-brands |
| `typography-auditor` | Faces, scale, hierarchy, measure, display type, other languages, loading |
| `colour-contrast-auditor` | Palette roles, WCAG contrast computed on real backgrounds, colour blindness, media fit |
| `layout-composition-auditor` | First screen, hierarchy, grid, spacing, balance, responsive, scroll length |
| `voice-content-auditor` | Message, voice, CTAs, claims and proof, status truthfulness, languages, alt text |
| `imagery-art-direction-auditor` | Pictures as one family: treatment, quality, honesty, credits and licences |
| `motion-interaction-auditor` | Signature motion, readability while moving, feedback states, reduced motion, keyboard, browser support |

`/identity-review <target>` (`.claude/commands/identity-review.md`) runs all seven in parallel and merges them into one verdict, a score table, the top five fixes and the conflicts between lenses. The agents never edit files. Copy `.claude/agents/*auditor.md` and the command into another project, or into `~/.claude/` on your own machine, to use them everywhere.
