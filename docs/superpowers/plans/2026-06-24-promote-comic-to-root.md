# Promote Comic Site to Root + Make It the Deployed Version

**Goal:** Make the Comic Pop page the site root (`/`), delete all unused old pages/components, merge into `main` (the Vercel production branch), and retire the `v2-theme-switcher` branch — so the deployed site shows this version.

**Branch now:** `v2-theme-switcher` (clean). **Deploy:** Vercel, `output: static`, production branch `main`, serves `/` from `src/pages/index.astro`.

**Decisions (confirmed):** Comic becomes `/` by MOVE · delete all unused old pages · replace `main` content via merge, keep `main` branch (Vercel needs it), delete `v2-theme-switcher` after.

---

## Phase 1 — Make comic the root (on `v2-theme-switcher`)

1. **Move** `src/pages/v2/comic/index.astro` → `src/pages/index.astro` (`git mv`).
2. **Rewrite import depth** in the moved file: every `../../../` → `../` (8 imports: ThemeLayout, comic.css, ComicHero, ThemeContact, data/v2, data/projects, resume.json, ComicWorldMap).
3. **Trim dead redirect** in `src/layouts/ThemeLayout.astro`: remove the "theme memory" `<script>` block (it redirects to `/v2`-style routes and gates on `here === 'current'` — both gone once comic is the only page at root). Keep the dark/light init script and `themeByKey` font logic.
4. **Build green:** `npm run build` → expect 1 page (`/`) or no errors; open `dist/index.html`, confirm comic markup (`cwm-map`, hero) present.

## Phase 2 — Prune unused (grep-verified closed set)

Every importer of each file below lives inside this same delete set — nothing reachable from `/` imports them.

**Delete pages:** `src/pages/reference.astro`, `src/pages/v2/index.astro`, `src/pages/v2/hackathons.astro` (and the now-empty `src/pages/v2/comic/`, `src/pages/v2/`).

**Delete components:** `ContactFooter.tsx`, `HeroSection.astro`, `ProjectsList.tsx`, `ProjectsSection.astro`, `ResumePreview.tsx`, `ResumeSection.astro`, `ThemeToggle.tsx`, `SocialLinks.tsx`, `reference/` (whole dir: `AnimatedReferenceSandbox.tsx`), `v2/Experience.astro`, `v2/Hackathons.astro`, `v2/Hero.tsx`, `v2/ProjectsV2.tsx`, `v2/Skills.astro`, `v2/ThemeDock.tsx`, `v2/shared/` (whole dir: `Photo.astro`).

**Delete layouts:** `Layout.astro`, `V2Layout.astro`.

**Keep (comic closure):** `layouts/ThemeLayout.astro`; `v2/ThemeNav.astro`, `v2/BB8Toggle.tsx`, `v2/ComicHero.tsx`, `v2/ThemeContact.tsx`, `v2/ComicWorldMap.tsx`; `lib/themes.ts`, `lib/geo.ts`; `data/v2.ts`, `data/projects.ts`, `data/places.ts`, `data/resume.json`; `styles/global.css`, `styles/themes/_base.css`, `styles/themes/comic.css`; `public/` assets (profile.jpg, AyushMadhavResume.pdf, favicon, og).

**Verify after delete:** `npm run build` still green. `grep -rn "v2/comic\|/v2\b" src` returns nothing stale.

*Optional (not required):* `npm uninstall react-pdf` — only `ResumePreview` used it. Leave if unsure; harmless to keep.

## Phase 3 — Commit on feature branch

5. One commit: `refactor: promote comic page to site root, remove legacy pages/components`.

## Phase 4 — Merge to `main`, retire feature branch

6. `git checkout main` → `git merge v2-theme-switcher` (fast-forward; `main` is an ancestor → `main` becomes this exact tip).
7. `git push origin main` → triggers Vercel production rebuild.
8. Delete feature branch: `git branch -d v2-theme-switcher` + `git push origin --delete v2-theme-switcher`.

## Phase 5 — Verify deploy

9. Confirm Vercel build succeeds and the production URL root (`/`) shows the comic site (hero, projects, hackathons, skills, world map, contact). If it 404s on old paths, that's expected — they were intentionally removed.

---

**Risk notes:**
- `main` branch is preserved (Vercel needs it); only its *content* is replaced. Deleting the *branch* would break deploys — not doing that.
- Feature-branch deletion (local + remote) is the only irreversible step; history is preserved inside `main` after the merge.
- No `vercel.json`; Astro static auto-detected. No config change needed.
