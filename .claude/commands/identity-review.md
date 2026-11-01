---
description: Run the visual-identity auditors on a page, screen or folder and merge their reports
argument-hint: <url | path | screenshot paths>
---

Review `$ARGUMENTS` for visual identity. If no argument was given, use the site in this repository (build it with `npm run build` and serve `dist/` locally, or use the dev server).

1. Start these seven agents **in parallel**, each with the same target and a one-line brief of the product (read `CLAUDE.md` for it):
   `identity-brand-auditor`, `typography-auditor`, `colour-contrast-auditor`, `layout-composition-auditor`, `voice-content-auditor`, `imagery-art-direction-auditor`, `motion-interaction-auditor`.
   For a small change, run only the lenses it touches.
2. When all of them have returned, write one merged report in the user's language:
   - **Verdict** in two sentences and the scores in a table (lens, score, one-line reason). Average them, but say which lens drags the page down.
   - **Top 5 fixes across all lenses**, ordered by effect on identity, each with its evidence and the lens it came from. Merge duplicates the auditors reported from different angles.
   - **Conflicts** between auditors (for example, a bolder colour that costs contrast) and your recommendation.
   - **Not checked** collected from all of them.
3. Do not change any file. Offer to apply the fixes afterwards.
