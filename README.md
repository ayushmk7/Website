# Portfolio Website

Astro portfolio with a main page (`/`) and comic page (`/fun`). Both use
`src/data/` for experience, projects, hackathons, places, and skills.
`src/lib/profile.ts` holds the shared curation for the main page and skill lists.
Keep existing portfolio entries when updating the résumé; correct or add entries
instead of dropping them.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321/` or `http://localhost:4321/fun`.

To test the production build locally:

```bash
npm run build
npm run preview
```
