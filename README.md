# Lumoza

Independent AI-native game and product studio. A fast single-page website built with HTML and CSS, without application dependencies or client-side JavaScript.

## Local preview

Requires Node.js 22 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:4173. To test the production package:

```sh
npm run build
npm run preview
```

Use `npm run check` to verify assets, navigation, document structure and Vercel configuration. Stop the local server with Ctrl+C before starting another on the same port.

## Publish

The existing repository is `ouzhaanttnn-afk/lumoza.art`. Vercel builds the production branch using the included `vercel.json`:

- Framework: Other
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: none

The production domain is https://lumoza.art. Keep the existing Google Workspace email DNS records when changing hosting.

## Edit content

Change text and links in `index.html`, presentation in `styles.css`, and images in `assets/games/`. Project statuses distinguish the released MİHENKAYNAK from games still in development. Add App Store links only when the app is publicly available.

Fonts are self-hosted Instrument Sans and Instrument Serif, with their licenses in `assets/fonts/`. Game artwork comes from the owner's existing game websites; source URLs are documented in `assets/games/SOURCES.md`. All site content and navigation remain available without JavaScript.
