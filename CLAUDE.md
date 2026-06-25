# Updating this site from a résumé

Ayush's portfolio — Astro static site, single page (`src/pages/index.astro`),
comic-pop theme with a newspaper card skin. When the user drops a `resume.tex`
(or PDF/any résumé) and asks to update the site, follow this.

## GOLDEN RULE — never remove, only add or change

- **Never delete** an experience, project, hackathon, skill, place, or any field.
- Only **ADD** new entries, or **CHANGE** (edit/correct) existing ones.
- If something in the résumé matches an existing entry, update that entry in
  place. If it's new, append it. When unsure whether to drop something, keep it.
- The only exception is a genuinely broken/dead thing the user explicitly asks to
  fix (e.g. a 404 link) — and even then, prefer changing over removing.

## Where the data lives and what it renders

| Section on page | Source file | Shape |
|---|---|---|
| **Stack** | `src/data/resume.json` → `skills` | object: `categoryKey -> string[]` |
| **Experience** | `src/data/v2.ts` → `experience` | `{ company, role, period, location?, kind, badge?, url?, bullets[] }` |
| **Projects** | `src/data/projects.ts` → `projects` | `{ title, description, tags[], githubUrl?, websiteUrl? }` |
| **Hackathons** | `src/data/v2.ts` → `hackathons` | `{ event, organizer, date, placement, project, blurb, prize?, repoUrl?, siteUrl? }` |
| **Places (map)** | `src/data/places.ts` → `places` | `{ name, country, lat, lng, blurb? }` |

Notes:
- Projects whose `title` equals a hackathon's `project` are auto-hidden from the
  Projects section (they show under Hackathons). Don't duplicate them.
- Skill `categoryKey`s must match the labels map in `src/pages/index.astro`
  (`categoryLabels`): `programmingLanguages, aiMl, softwareDevelopment,
  databases, devOps, cybersecurity, coreCs`. Add a label there if you add a new
  category key.
- `experience.kind` is one of `"Work" | "Research" | "Leadership" | "Founder"`.
  `badge` is a short tag like `"YC S25"` or `"NSF, $300K"`.

## Steps to apply a résumé

1. Read the résumé. Pull: name, experience (org, dates, title, location,
   bullets), projects (name, tech, links, bullets), skills by category.
2. **Experience** (`v2.ts`): for each résumé role, normalize the company name
   (lowercase, strip non-alphanumerics) and compare to existing. Match → update
   that entry's fields. No match → append a new object. Derive `kind` from the
   role (Founder/Research/Lead→Leadership/else Work); pull a `badge` from a
   parenthetical like `Cactus (YC S25)`.
3. **Skills** (`resume.json`): add any new skill to the right category. Dedupe on
   the normalized key so `Scikit learn` == `Scikit-learn` (don't add a near-dup;
   fix the spelling on the existing one if needed). Keep every category **sorted
   A→Z** (case-insensitive).
4. **Projects** (`projects.ts`) / **Hackathons** (`v2.ts`): append new ones;
   correct existing ones. Never drop curated entries that aren't in the résumé.
5. Don't touch layout/theme (baked: Experience=accordion, Projects=carousel,
   Hackathons=newspaper, Stack=carousel, newspaper card skin) unless asked.

## After any change — verify

- `npm run build` must pass clean.
- If links changed, check none 404 (curl each `githubUrl`/`websiteUrl`/`repoUrl`/
  `siteUrl`; LinkedIn returning `999` is bot-blocking, not broken).
- Preview locally with `npm run dev` (http://localhost:4321/). If the map
  vanishes in dev it's a stale Vite cache — `rm -rf node_modules/.vite && npm run dev`.
- Commit. Push only if the user asks (push to `main` auto-deploys via Vercel).
