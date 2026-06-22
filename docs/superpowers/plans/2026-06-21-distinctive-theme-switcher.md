# Distinctive Theme Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the `/v2` site into a multi-theme experience where a floating dock switches between fully distinct designs — each with its own typography, color, motion, background, AND layout — following `distinctive-frontend.md`, keeping today's look as the "Current" option.

**Architecture:** Static Astro, so layout-level variation is done by route, not by client-side DOM swapping. Each theme is its own static page under `/v2/<key>/` (Current stays at `/v2`). All themes share the same data (`resume.json`, `projects.ts`, `v2.ts`) and a small set of shared primitives (photo, social links, BB8 toggle). A shared `ThemeLayout.astro` injects the active theme's Google Fonts + `data-theme` attribute and renders a shared `ThemeDock`. Per-theme CSS lives in `src/styles/themes/<key>.css`, scoped under `html[data-theme="<key>"]`. The dock writes the chosen theme to `localStorage`; visiting `/v2` honors the saved choice via a redirect script (default = Current).

**Tech Stack:** Astro 5, React 19 (islands), Tailwind 3 (utility shell), `motion` (already installed), Google Fonts via `<link>`, CSS custom properties for tokens.

## Global Constraints

- **No em dashes, no emojis** in any user-facing copy (existing rule for this site). Use commas/periods; placement/labels stay plain text.
- **Current theme must remain pixel-identical** to today's `/v2`. Do not refactor existing `/v2` components in a way that changes their render. New themes are additive.
- **Single viewport hero** rule from today applies per-theme unless a theme's blueprint explicitly says otherwise: hero locked to `100dvh` with `svh` fallback, photo over name on mobile.
- **Photo:** `public/profile.jpg` is 600x900 (2:3). Desktop frames should respect 2:3 (full portrait), mobile may square-crop.
- **`prefers-reduced-motion`:** every theme's load animation must no-op under reduced motion (set final state, skip keyframes).
- **Fonts load per active theme only** (each theme page injects just its own families). Never load all theme fonts on one page.
- **Data is shared and read-only here:** `src/data/resume.json`, `src/data/projects.ts`, `src/data/v2.ts`. Do not duplicate content into theme files.
- **Build gate:** `npm run build` must pass after every task. Static frontend has no unit tests; the "test" for each task is a clean build plus a named manual viewport check (desktop + mobile width + dark/light where the theme supports it + reduced-motion).

---

## Theme Lineup (Current + 7)

| Key | Name | Family | Reference | One-line identity |
|-----|------|--------|-----------|-------------------|
| `current` | Current | — | existing | Mono-brutalist black/white + blue, system font. Unchanged. |
| `blueprint` | Blueprint | Technical | CAD / engineering draft | Navy ground, cyan hairline grid, dashed plates, "FIG. 0N" labels, lines draw in. |
| `terminal` | Phosphor | Technical | CRT terminal / CTF | Green-on-black, mono only, scanlines, type-on, content as a shell session. |
| `editorial` | Editorial | Editorial | high-end print magazine | Fraunces serif display + sans body, ivory/ink + ink-red, drop caps, slow fades, asymmetric columns. |
| `brutal` | Brutalist | Brutalist | Swiss punk / concrete | Anton condensed black, red+black on concrete, 4px borders, hard offset shadows, snappy no-ease motion. |
| `riso` | Risograph | Retro | riso duotone print | Electric blue + fluoro pink, heavy grain, misregistration offset, bouncy stagger, zine stacks. |
| `outrun` | Outrun | Retro | 80s synthwave | Magenta-to-orange sunset, neon horizon grid, chrome italic wide display, glow, parallax sun. |
| `aurora` | Aurora | "and more" | Nord + northern lights | Frost blues + aurora accents, soft mesh-gradient, Space Grotesk + Inter, calm gentle motion. |
| `bauhaus` | Bauhaus | extra-unique | Bauhaus 1919 / constructivism | Primary red/blue/yellow blocks, circles + triangles, Jost geometric sans, asymmetric hard-edged panels. |
| `comic` | Comic Pop | extra-unique | Lichtenstein pop art | Ben-Day halftone dots, thick black outlines, Bangers display, speech-bubble cards, action-burst hero. |

Build order recommendation: Phase 0 infra, then `blueprint` (Task 2) and `terminal` (Task 3) to validate the pattern end to end, review, then the rest. Each theme is independently shippable; the dock simply lists whatever routes exist.

---

## File Structure

**Phase 0 (infra), create:**
- `src/lib/themes.ts` — theme registry: key, name, route, font `<link>` href(s), family CSS value. Single source of truth for the dock + layout.
- `src/layouts/ThemeLayout.astro` — base layout for every theme page: head/meta/OG, font injection, `data-theme` on `<html>`, theme CSS import, renders `<slot/>` + `<ThemeDock>`, reduced-motion + theme-memory inline scripts.
- `src/components/v2/ThemeDock.tsx` — floating bottom-center dock (React island), lists themes, highlights active, navigates + persists choice.
- `src/styles/themes/_base.css` — shared token contract (the variable NAMES every theme must define) + shared reveal/util classes keyed off variables.
- `src/components/v2/shared/Photo.astro` — extracted photo primitive (initials + `/profile.jpg` cover, configurable shape).
- (reuse existing `SocialLinks.tsx`, `BB8Toggle.tsx`, data files.)

**Phase 0, modify:**
- `src/pages/v2/index.astro` — add theme-memory redirect script; wrap in nothing else (stays Current visually). Mount `<ThemeDock current="current" />`.
- `src/styles/global.css` — no change required beyond what exists; theme CSS is separate.

**Per theme (Tasks 2-8), create:**
- `src/pages/v2/<key>/index.astro` — the theme's page composition (its own layout).
- `src/styles/themes/<key>.css` — tokens + bespoke layout/background/motion, all scoped under `html[data-theme="<key>"]`.
- `src/components/v2/themes/<key>/*.astro|tsx` — only the section components whose layout genuinely differs from a primitive (fold trivial ones inline into the page).

---

### Task 1: Theme infrastructure (registry, layout, dock, memory, base tokens)

**Files:**
- Create: `src/lib/themes.ts`
- Create: `src/styles/themes/_base.css`
- Create: `src/components/v2/shared/Photo.astro`
- Create: `src/components/v2/ThemeDock.tsx`
- Create: `src/layouts/ThemeLayout.astro`
- Modify: `src/pages/v2/index.astro`

**Interfaces:**
- Produces: `THEMES` array of `{ key: string; name: string; route: string; fontHrefs: string[]; }` from `themes.ts`.
- Produces: `ThemeLayout` props `{ themeKey: string; title: string; description?: string }`.
- Produces: `<ThemeDock client:load current={key} />`.
- Produces shared CSS variable contract (consumed by every theme CSS): `--bg`, `--bg-2`, `--surface`, `--text`, `--text-dim`, `--accent`, `--accent-2`, `--font-display`, `--font-body`, `--font-mono`, `--w-display`, `--w-body`, `--radius`, `--border`, `--ease`, `--dur`.

- [ ] **Step 1: Create the theme registry**

```ts
// src/lib/themes.ts
export interface ThemeDef {
  key: string;
  name: string;
  route: string;       // where the dock links
  fontHrefs: string[]; // Google Fonts hrefs injected by ThemeLayout
}

export const THEMES: ThemeDef[] = [
  { key: 'current',   name: 'Current',   route: '/v2',           fontHrefs: [] },
  { key: 'blueprint', name: 'Blueprint', route: '/v2/blueprint', fontHrefs: ['https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap'] },
  { key: 'terminal',  name: 'Phosphor',  route: '/v2/terminal',  fontHrefs: ['https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap'] },
  { key: 'editorial', name: 'Editorial', route: '/v2/editorial', fontHrefs: ['https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,900&family=Source+Sans+3:wght@300;600&display=swap'] },
  { key: 'brutal',    name: 'Brutalist', route: '/v2/brutal',    fontHrefs: ['https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@300;800;900&display=swap'] },
  { key: 'riso',      name: 'Risograph', route: '/v2/riso',      fontHrefs: ['https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;800&family=Space+Grotesk:wght@500;700&display=swap'] },
  { key: 'outrun',    name: 'Outrun',    route: '/v2/outrun',    fontHrefs: ['https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&family=Rajdhani:wght@300;600&display=swap'] },
  { key: 'aurora',    name: 'Aurora',    route: '/v2/aurora',    fontHrefs: ['https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Inter:wght@200;500&display=swap'] },
  { key: 'bauhaus',   name: 'Bauhaus',   route: '/v2/bauhaus',   fontHrefs: ['https://fonts.googleapis.com/css2?family=Jost:wght@300;500;700&display=swap'] },
  { key: 'comic',     name: 'Comic Pop', route: '/v2/comic',     fontHrefs: ['https://fonts.googleapis.com/css2?family=Bangers&family=Nunito+Sans:wght@300;800&display=swap'] },
];

export const themeByKey = (k: string) => THEMES.find((t) => t.key === k);
```

- [ ] **Step 2: Create the shared token contract + reveal utilities**

```css
/* src/styles/themes/_base.css
   Every theme defines these vars under html[data-theme="<key>"].
   These defaults are a safety net only (match Current). */
:root {
  --bg: #ffffff; --bg-2: #ffffff; --surface: #ffffff;
  --text: oklch(0.145 0 0); --text-dim: #717182;
  --accent: #2563eb; --accent-2: #2563eb;
  --font-display: ui-sans-serif, system-ui, sans-serif;
  --font-body: ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  --w-display: 500; --w-body: 400;
  --radius: 1rem; --border: 2px solid currentColor;
  --ease: cubic-bezier(0.16, 1, 0.3, 1); --dur: 0.6s;
}

/* Page-load reveal driven by stagger index var --i */
[data-load] {
  opacity: 0;
  transform: translateY(24px);
  animation: themeReveal var(--dur) var(--ease) forwards;
  animation-delay: calc(var(--i, 0) * 90ms);
}
@keyframes themeReveal { to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  [data-load] { animation: none; opacity: 1; transform: none; }
}

/* Grain overlay helper (themes opt in via class) */
.grain::after {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
  opacity: 0.06; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 3: Extract the shared Photo primitive**

```astro
---
// src/components/v2/shared/Photo.astro
interface Props { class?: string }
const { class: klass = '' } = Astro.props;
---
<div class={`relative bg-[var(--surface)] grid place-items-center font-bold overflow-hidden ${klass}`}>
  AK
  <img src="/profile.jpg" alt="Ayush Madhav Kumar" class="absolute inset-0 h-full w-full object-cover" onerror="this.style.display='none'" />
</div>
```

- [ ] **Step 4: Build the floating dock**

```tsx
// src/components/v2/ThemeDock.tsx
import * as React from 'react';
import { THEMES } from '../../lib/themes';

export function ThemeDock({ current }: { current: string }) {
  const go = (route: string, key: string) => {
    try { localStorage.setItem('v2-theme', key); } catch {}
    if (route !== window.location.pathname) window.location.href = route;
  };
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] overflow-x-auto">
      <div className="flex items-center gap-1 rounded-full border border-current/20 bg-[var(--surface)]/80 backdrop-blur-md px-2 py-1.5 shadow-lg">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => go(t.route, t.key)}
            aria-current={t.key === current}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${
              t.key === current ? 'bg-[var(--accent)] text-[var(--bg)]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Build ThemeLayout**

```astro
---
// src/layouts/ThemeLayout.astro
import '../styles/global.css';
import './../styles/themes/_base.css';
import Analytics from '@vercel/analytics/astro';
import { ThemeDock } from '../components/v2/ThemeDock';
import { themeByKey } from '../lib/themes';

interface Props { themeKey: string; title: string; description?: string }
const { themeKey, title, description = 'Ayush Madhav Kumar. CS and Math @UMichigan. Systems programming, AI infrastructure, on-device inference, and hackathon wins.' } = Astro.props;
const def = themeByKey(themeKey);
---
<!DOCTYPE html>
<html lang="en" data-theme={themeKey}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    {def?.fontHrefs.map((href) => <link rel="stylesheet" href={href} />)}
    <Analytics />
    <script is:inline>
      // theme memory: remember last picked (dock handles writes)
      try {
        const saved = localStorage.getItem('v2-theme');
        const here = document.documentElement.getAttribute('data-theme');
        // only the Current page (/v2) auto-redirects to a saved non-current theme
        if (here === 'current' && saved && saved !== 'current' && !location.search.includes('stay')) {
          const routes = {"blueprint":"/v2/blueprint","terminal":"/v2/terminal","editorial":"/v2/editorial","brutal":"/v2/brutal","riso":"/v2/riso","outrun":"/v2/outrun","aurora":"/v2/aurora","bauhaus":"/v2/bauhaus","comic":"/v2/comic"};
          if (routes[saved]) location.replace(routes[saved]);
        }
      } catch (e) {}
    </script>
  </head>
  <body class="bg-[var(--bg)] text-[var(--text)] min-h-screen antialiased" style="font-family: var(--font-body); font-weight: var(--w-body);">
    <slot />
    <ThemeDock client:load current={themeKey} />
  </body>
</html>
```

- [ ] **Step 6: Wire theme memory + dock into the Current page**

In `src/pages/v2/index.astro`, keep the existing `V2Layout` and content unchanged, but add the dock + memory redirect. Add at the top of the `<V2Layout>` body:

```astro
---
// add import
import { ThemeDock } from '../../components/v2/ThemeDock';
---
```
Add this inline script inside the existing layout (e.g. right after `<Hero client:load />` is fine, script placement is irrelevant):
```astro
<script is:inline>
  try {
    const saved = localStorage.getItem('v2-theme');
    if (saved && saved !== 'current' && !location.search.includes('stay')) {
      const r = {"blueprint":"/v2/blueprint","terminal":"/v2/terminal","editorial":"/v2/editorial","brutal":"/v2/brutal","riso":"/v2/riso","outrun":"/v2/outrun","aurora":"/v2/aurora","bauhaus":"/v2/bauhaus","comic":"/v2/comic"}[saved];
      if (r) location.replace(r);
    }
  } catch (e) {}
</script>
<ThemeDock client:load current="current" />
```

- [ ] **Step 7: Build and verify**

Run: `npm run build`
Expected: PASS, routes include `/v2` (existing). Load `/v2`: dock visible bottom-center listing all 8 names, "Current" highlighted, other chips present (routes 404 until built — acceptable mid-phase). Verify clicking "Current" does nothing; verify dock does not overlap the contact section badly on mobile (it floats; that is fine).

- [ ] **Step 8: Commit**

```bash
git add src/lib/themes.ts src/styles/themes/_base.css src/components/v2/shared/Photo.astro src/components/v2/ThemeDock.tsx src/layouts/ThemeLayout.astro src/pages/v2/index.astro
git commit -m "feat(v2): theme switcher infrastructure (registry, layout, dock, memory)"
```

---

### Task 2: Blueprint theme

**Reference:** Engineering / CAD draft. **Vectors:** Space Grotesk display + JetBrains Mono labels; navy ground with cyan hairline grid; dashed plate borders; section labels "FIG. 0N"; reveal = elements fade while a cyan underline "draws" left-to-right.

**Files:**
- Create: `src/styles/themes/blueprint.css`
- Create: `src/pages/v2/blueprint/index.astro`
- Create: `src/components/v2/themes/blueprint/Plate.astro` (annotated section wrapper)

**Interfaces:**
- Consumes: `ThemeLayout` (Task 1), shared `Photo.astro`, data from `resume.json`/`projects.ts`/`v2.ts`.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Tokens + background + draw motion**

```css
/* src/styles/themes/blueprint.css */
html[data-theme="blueprint"] {
  --bg: #0a1929; --bg-2: #0c1f33; --surface: #0e2236;
  --text: #d7e9f7; --text-dim: #5b86a8;
  --accent: #00d9ff; --accent-2: #ffd23f;
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --w-display: 700; --w-body: 300;
  --radius: 0; --border: 1px dashed rgba(0,217,255,0.5);
  --ease: cubic-bezier(0.16,1,0.3,1); --dur: 0.7s;
}
html[data-theme="blueprint"] body {
  background:
    linear-gradient(rgba(0,217,255,0.06) 1px, transparent 1px) 0 0 / 100% 32px,
    linear-gradient(90deg, rgba(0,217,255,0.06) 1px, transparent 1px) 0 0 / 32px 100%,
    var(--bg);
}
html[data-theme="blueprint"] .fig-label {
  font-family: var(--font-mono); color: var(--accent); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase;
}
html[data-theme="blueprint"] .draw-underline { position: relative; }
html[data-theme="blueprint"] .draw-underline::after {
  content: ''; position: absolute; left: 0; bottom: -6px; height: 2px; width: 100%;
  background: var(--accent); transform: scaleX(0); transform-origin: left;
  animation: bpDraw 0.9s var(--ease) forwards; animation-delay: 0.3s;
}
@keyframes bpDraw { to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) {
  html[data-theme="blueprint"] .draw-underline::after { animation: none; transform: scaleX(1); }
}
```

- [ ] **Step 2: Plate wrapper component**

```astro
---
// src/components/v2/themes/blueprint/Plate.astro
interface Props { fig: string; title: string; id?: string }
const { fig, title, id } = Astro.props;
---
<section id={id} class="max-w-6xl mx-auto px-4 md:px-8 py-16 border-t border-dashed border-[var(--accent)]/30">
  <p class="fig-label" data-load style="--i:0">FIG. {fig}</p>
  <h2 class="draw-underline inline-block text-3xl md:text-5xl mt-2 mb-10" style="font-family:var(--font-display);font-weight:700;letter-spacing:-0.02em" data-load>{title}</h2>
  <slot />
</section>
```

- [ ] **Step 3: Compose the page**

```astro
---
// src/pages/v2/blueprint/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/blueprint.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import Plate from '../../../components/v2/themes/blueprint/Plate.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="blueprint" title="Ayush Madhav Kumar. Blueprint">
  <!-- HERO: spec-sheet rail left, title block right -->
  <section class="min-h-[100svh] min-h-[100dvh] grid md:grid-cols-[260px_1fr]">
    <aside class="hidden md:flex flex-col justify-between border-r border-dashed border-[var(--accent)]/30 p-6 font-mono text-[var(--text-dim)] text-xs">
      <div data-load style="--i:0">DRAWING NO. AMK-001<br/>SCALE 1:1<br/>UNITS dp</div>
      <div data-load style="--i:2">REV. 2026.06<br/>ANN ARBOR, MI</div>
    </aside>
    <div class="flex flex-col justify-center p-6 md:p-12">
      <div class="mb-6" data-load style="--i:0"><Photo class="h-40 w-40 md:h-[19rem] md:w-[12.6rem] border border-[var(--accent)]/50" /></div>
      <p class="fig-label" data-load style="--i:1">CS AND MATH @UMICHIGAN</p>
      <h1 class="text-5xl md:text-7xl my-3" style="font-family:var(--font-display);font-weight:700;letter-spacing:-0.03em" data-load>Ayush Madhav Kumar</h1>
      <p class="font-mono text-[var(--accent)] text-sm" data-load style="--i:3">&gt; NSF-backed research</p>
      <a class="font-mono text-[var(--accent)] text-sm hover:underline" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" data-load style="--i:4">&gt; view resume (pdf)</a>
    </div>
  </section>

  <Plate fig="01" title="Experience" id="experience">
    <div class="grid md:grid-cols-2 gap-px bg-[var(--accent)]/20">
      {experience.map((j, i) => (
        <div class="bg-[var(--bg)] p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-mono text-xs text-[var(--accent)]">{j.period}</p>
          <h3 class="text-lg" style="font-weight:700">{j.company}</h3>
          <p class="text-[var(--text-dim)]">{j.role}</p>
          <ul class="mt-3 space-y-1 text-sm">{j.bullets.map((b) => <li>- {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </Plate>

  <Plate fig="02" title="Projects" id="projects">
    <div class="grid md:grid-cols-3 gap-px bg-[var(--accent)]/20">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="bg-[var(--bg)] p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 style="font-weight:700">{p.title}</h3>
          <p class="text-sm text-[var(--text-dim)] mt-2">{p.description}</p>
          <p class="font-mono text-xs text-[var(--accent)] mt-3">{p.tags.slice(0,4).join(' / ')}</p>
        </div>
      ))}
    </div>
  </Plate>

  <Plate fig="03" title="Hackathons" id="hackathons">
    <div class="grid md:grid-cols-2 gap-px bg-[var(--accent)]/20">
      {hackathons.map((h, i) => (
        <div class="bg-[var(--bg)] p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-mono text-xs text-[var(--accent)]">&gt; {h.placement}</p>
          <h3 style="font-weight:700">{h.event}</h3>
          <p class="text-sm text-[var(--text-dim)] mt-2">{h.blurb}</p>
        </div>
      ))}
    </div>
  </Plate>

  <Plate fig="04" title="Stack" id="skills">
    <div class="grid md:grid-cols-2 gap-6">
      {Object.entries(resumeData.skills).map(([k, items], i) => (
        <div data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-mono text-xs text-[var(--accent)] mb-2">{k}</p>
          <p class="text-sm">{items.join(' . ')}</p>
        </div>
      ))}
    </div>
  </Plate>

  <footer id="contact" class="max-w-6xl mx-auto px-4 md:px-8 py-20 text-center font-mono">
    <a href="mailto:contactayushmadhav@gmail.com" class="text-[var(--accent)] hover:underline">contactayushmadhav@gmail.com</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: PASS, route `/v2/blueprint/` built. Load it: navy grid background, cyan dashed plates, "FIG. 0N" labels, title underline draws in, hero is one viewport with spec rail on desktop, dock highlights "Blueprint". Toggle reduced-motion (DevTools rendering): underline appears instantly, content static. Mobile width: rail hidden, photo over name.

- [ ] **Step 5: Commit**

```bash
git add src/styles/themes/blueprint.css src/pages/v2/blueprint src/components/v2/themes/blueprint
git commit -m "feat(v2): blueprint theme"
```

---

### Task 3: Phosphor Terminal theme

**Reference:** CRT terminal / CTF. **Vectors:** JetBrains Mono only; green-on-near-black; scanline + faint flicker background; reveal = type-on (lines appear sequentially with a blinking caret on the last); content framed as a shell session (`$ cat experience.md`, `$ ls projects/`).

**Files:**
- Create: `src/styles/themes/terminal.css`
- Create: `src/pages/v2/terminal/index.astro`

**Interfaces:** Consumes Task 1 + shared data. Produces nothing downstream.

- [ ] **Step 1: Tokens + scanlines + caret**

```css
/* src/styles/themes/terminal.css */
html[data-theme="terminal"] {
  --bg: #050806; --bg-2: #0a0f0b; --surface: #0a120c;
  --text: #43f57b; --text-dim: #1f8f45;
  --accent: #b6ff00; --accent-2: #43f57b;
  --font-display: 'JetBrains Mono', monospace;
  --font-body: 'JetBrains Mono', monospace;
  --font-mono: 'JetBrains Mono', monospace;
  --w-display: 800; --w-body: 400;
  --radius: 0; --border: 1px solid rgba(67,245,123,0.4);
  --ease: steps(1,end); --dur: 0.01s;
}
html[data-theme="terminal"] body {
  text-shadow: 0 0 4px rgba(67,245,123,0.4);
  background:
    repeating-linear-gradient(rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.25) 2px 4px),
    var(--bg);
}
html[data-theme="terminal"] .caret::after {
  content: '_'; color: var(--accent); animation: tBlink 1s steps(1) infinite;
}
@keyframes tBlink { 50% { opacity: 0; } }
/* type-on: reuse [data-load] but with no transform, just sequential fade */
html[data-theme="terminal"] [data-load] { transform: none; }
```

- [ ] **Step 2: Compose the page as a shell session**

```astro
---
// src/pages/v2/terminal/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/terminal.css';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
const prompt = 'ayush@umich:~$';
---
<ThemeLayout themeKey="terminal" title="Ayush Madhav Kumar. Phosphor">
  <main class="max-w-4xl mx-auto px-4 py-24 leading-relaxed text-sm md:text-base">
    <p data-load style="--i:0">{prompt} whoami</p>
    <pre data-load style="--i:1" class="text-2xl md:text-4xl my-2" >Ayush Madhav Kumar</pre>
    <p data-load style="--i:2" class="text-[var(--text-dim)]">CS and Math @UMichigan . Ann Arbor, MI</p>
    <p data-load style="--i:3" class="caret">&gt; NSF-backed research</p>

    <p class="mt-10" data-load style="--i:4">{prompt} cat experience.md</p>
    {experience.map((j, i) => (
      <div class="mt-3" data-load style={`--i:${5+Math.min(i,4)}`}>
        <p class="text-[var(--accent)]"># {j.company} . {j.role} . {j.period}</p>
        {j.bullets.map((b) => <p class="text-[var(--text-dim)]">- {b}</p>)}
      </div>
    ))}

    <p class="mt-10" data-load style="--i:5">{prompt} ls hackathons/</p>
    {hackathons.map((h) => (
      <p data-load style="--i:6">[{h.placement}] <span class="text-[var(--accent)]">{h.event}</span> -> {h.project}</p>
    ))}

    <p class="mt-10" data-load style="--i:6">{prompt} ls projects/</p>
    <div class="grid md:grid-cols-2 gap-x-8" data-load style="--i:7">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p) => (
        <p>{p.title} <span class="text-[var(--text-dim)]"># {p.tags.slice(0,3).join(',')}</span></p>
      ))}
    </div>

    <p class="mt-10" data-load style="--i:7">{prompt} cat stack.txt</p>
    {Object.entries(resumeData.skills).map(([k, items]) => (
      <p data-load style="--i:8"><span class="text-[var(--accent)]">{k}:</span> {items.join(' ')}</p>
    ))}

    <p class="mt-10 caret" id="contact" data-load style="--i:8">{prompt} mail contactayushmadhav@gmail.com </p>
  </main>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/terminal/` built. Green-on-black, scanlines, blinking caret, content reads as a shell session, lines fade in sequentially, dock highlights "Phosphor". Reduced-motion: everything visible, caret may still blink (acceptable; or guard with the reduced-motion rule). Mobile: text wraps, readable.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/terminal.css src/pages/v2/terminal
git commit -m "feat(v2): phosphor terminal theme"
```

---

### Task 4: Editorial theme

**Reference:** High-end print magazine. **Vectors:** Fraunces (900 display / 300 italic) + Source Sans 3 body; ivory ground, ink text, single ink-red accent; asymmetric column grid, drop cap on intro, numbered articles; slow elegant fades, generous whitespace.

**Files:**
- Create: `src/styles/themes/editorial.css`
- Create: `src/pages/v2/editorial/index.astro`

- [ ] **Step 1: Tokens**

```css
/* src/styles/themes/editorial.css */
html[data-theme="editorial"] {
  --bg: #f7f3ec; --bg-2: #efe9df; --surface: #fffdf8;
  --text: #1b1a17; --text-dim: #6b655b;
  --accent: #b3402e; --accent-2: #1b1a17;
  --font-display: 'Fraunces', serif;
  --font-body: 'Source Sans 3', sans-serif;
  --font-mono: 'Source Sans 3', sans-serif;
  --w-display: 900; --w-body: 300;
  --radius: 0; --border: 1px solid #1b1a17; --dur: 0.9s;
}
html[data-theme="editorial"] .dropcap::first-letter {
  font-family: var(--font-display); font-weight: 900; font-size: 3.4em;
  float: left; line-height: 0.8; padding-right: 0.08em; color: var(--accent);
}
html[data-theme="editorial"] .rule { border-top: 1px solid var(--text); }
```

- [ ] **Step 2: Compose (asymmetric editorial grid, numbered sections)**

```astro
---
// src/pages/v2/editorial/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/editorial.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="editorial" title="Ayush Madhav Kumar. Editorial">
  <header class="max-w-5xl mx-auto px-6 pt-24 pb-10">
    <p class="uppercase tracking-[0.3em] text-xs text-[var(--accent)]" data-load>Portfolio . MMXXVI</p>
    <h1 class="text-6xl md:text-8xl leading-[0.95] mt-4" style="font-family:var(--font-display);font-weight:900" data-load style="--i:1">Ayush<br/>Madhav Kumar</h1>
  </header>
  <section class="min-h-[60svh] max-w-5xl mx-auto px-6 grid md:grid-cols-[1fr_300px] gap-10 items-end pb-16">
    <p class="dropcap text-xl leading-relaxed max-w-prose" data-load style="--i:2">
      CS and Math at the University of Michigan working in systems programming and AI infrastructure: on-device inference engines, fine-tuned coding agents, and the tooling around them. NSF-backed research; contributor at Cactus (YC S25). <a class="underline text-[var(--accent)]" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer">Read the resume.</a>
    </p>
    <Photo class="h-[19rem] w-[12.6rem] justify-self-end" />
  </section>

  <!-- numbered article sections; reuse a small inline pattern -->
  <section id="experience" class="rule max-w-5xl mx-auto px-6 py-16">
    <div class="grid md:grid-cols-[120px_1fr] gap-6">
      <p class="text-5xl text-[var(--text-dim)]" style="font-family:var(--font-display)">01</p>
      <div>
        <h2 class="text-3xl mb-8" style="font-family:var(--font-display);font-weight:900">Experience</h2>
        {experience.map((j, i) => (
          <div class="mb-8 max-w-prose" data-load style={`--i:${Math.min(i,4)}`}>
            <h3 class="text-xl" style="font-family:var(--font-display);font-weight:900">{j.company}</h3>
            <p class="italic text-[var(--text-dim)]" style="font-family:var(--font-display)">{j.role} . {j.period}</p>
            <ul class="mt-2 space-y-1">{j.bullets.map((b) => <li>{b}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section id="projects" class="rule max-w-5xl mx-auto px-6 py-16">
    <div class="grid md:grid-cols-[120px_1fr] gap-6">
      <p class="text-5xl text-[var(--text-dim)]" style="font-family:var(--font-display)">02</p>
      <div>
        <h2 class="text-3xl mb-8" style="font-family:var(--font-display);font-weight:900">Projects</h2>
        <div class="columns-1 md:columns-2 gap-10">
          {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p) => (
            <div class="mb-6 break-inside-avoid">
              <h3 class="text-lg" style="font-family:var(--font-display);font-weight:900">{p.title}</h3>
              <p class="text-[var(--text-dim)]">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

  <section id="hackathons" class="rule max-w-5xl mx-auto px-6 py-16">
    <div class="grid md:grid-cols-[120px_1fr] gap-6">
      <p class="text-5xl text-[var(--text-dim)]" style="font-family:var(--font-display)">03</p>
      <div>
        <h2 class="text-3xl mb-8" style="font-family:var(--font-display);font-weight:900">Hackathons</h2>
        {hackathons.map((h) => (
          <div class="mb-6 max-w-prose">
            <p class="italic text-[var(--accent)]" style="font-family:var(--font-display)">{h.placement}</p>
            <h3 class="text-lg" style="font-family:var(--font-display);font-weight:900">{h.event}</h3>
            <p class="text-[var(--text-dim)]">{h.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section id="skills" class="rule max-w-5xl mx-auto px-6 py-16">
    <div class="grid md:grid-cols-[120px_1fr] gap-6">
      <p class="text-5xl text-[var(--text-dim)]" style="font-family:var(--font-display)">04</p>
      <div>
        <h2 class="text-3xl mb-8" style="font-family:var(--font-display);font-weight:900">Stack</h2>
        {Object.entries(resumeData.skills).map(([k, items]) => (
          <p class="mb-3 max-w-prose"><span class="text-[var(--accent)]" style="font-family:var(--font-display)">{k}. </span>{items.join(', ')}</p>
        ))}
      </div>
    </div>
  </section>

  <footer id="contact" class="rule max-w-5xl mx-auto px-6 py-20 text-center">
    <a href="mailto:contactayushmadhav@gmail.com" class="text-2xl underline text-[var(--accent)]" style="font-family:var(--font-display)">contactayushmadhav@gmail.com</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/editorial/` built. Ivory paper, Fraunces headings, drop cap on intro, numbered sections with hairline rules, multi-column projects, dock highlights "Editorial". Mobile: columns collapse, numbers stack.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/editorial.css src/pages/v2/editorial
git commit -m "feat(v2): editorial theme"
```

---

### Task 5: Brutalist theme

**Reference:** Swiss punk / concrete. **Vectors:** Anton (display) + Archivo (body); concrete off-white, red + black; 4px solid borders, hard offset box-shadows (`6px 6px 0 #000`); snappy linear motion (no easing); a top marquee strip.

**Files:**
- Create: `src/styles/themes/brutal.css`
- Create: `src/pages/v2/brutal/index.astro`

- [ ] **Step 1: Tokens + hard-shadow utility + marquee**

```css
/* src/styles/themes/brutal.css */
html[data-theme="brutal"] {
  --bg: #e9e6dd; --bg-2: #ffffff; --surface: #ffffff;
  --text: #111111; --text-dim: #444444;
  --accent: #ff2200; --accent-2: #111111;
  --font-display: 'Anton', sans-serif;
  --font-body: 'Archivo', sans-serif;
  --font-mono: 'Archivo', monospace;
  --w-display: 400; --w-body: 300;
  --radius: 0; --border: 4px solid #111; --ease: linear; --dur: 0.25s;
}
html[data-theme="brutal"] .hard { border: var(--border); box-shadow: 6px 6px 0 #111; background: var(--surface); }
html[data-theme="brutal"] .hard-accent { box-shadow: 6px 6px 0 var(--accent); }
html[data-theme="brutal"] .marquee { overflow: hidden; white-space: nowrap; border-block: var(--border); background: var(--accent); color: #fff; }
html[data-theme="brutal"] .marquee span { display: inline-block; padding-block: 0.4rem; animation: bMarq 18s linear infinite; font-family: var(--font-display); letter-spacing: 0.05em; }
@keyframes bMarq { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { html[data-theme="brutal"] .marquee span { animation: none; } }
```

- [ ] **Step 2: Compose (poster grid, oversized type)**

```astro
---
// src/pages/v2/brutal/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/brutal.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
const ticker = 'AYUSH MADHAV KUMAR . SYSTEMS . AI INFRA . HACKATHON WINS . ';
---
<ThemeLayout themeKey="brutal" title="Ayush Madhav Kumar. Brutalist">
  <div class="marquee" data-load><span>{ticker}{ticker}{ticker}{ticker}</span></div>

  <section class="min-h-[100svh] min-h-[100dvh] grid md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto px-4 py-12">
    <div>
      <h1 class="text-7xl md:text-9xl leading-[0.85] uppercase" style="font-family:var(--font-display)" data-load>Ayush<br/>Madhav<br/>Kumar</h1>
      <p class="mt-6 text-lg font-bold uppercase" data-load style="--i:1">CS + MATH @UMICHIGAN</p>
      <a href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" class="hard hard-accent inline-block mt-4 px-5 py-2 font-bold uppercase" data-load style="--i:2">Resume PDF</a>
    </div>
    <div class="hard p-2 justify-self-center" data-load style="--i:1"><Photo class="h-[20rem] w-[13.3rem]" /></div>
  </section>

  <section id="experience" class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-5xl uppercase mb-6" style="font-family:var(--font-display)">Experience</h2>
    <div class="grid md:grid-cols-2 gap-6">
      {experience.map((j, i) => (
        <div class="hard p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-bold text-[var(--accent)] uppercase">{j.period}</p>
          <h3 class="text-2xl uppercase" style="font-family:var(--font-display)">{j.company}</h3>
          <p class="font-bold">{j.role}</p>
          <ul class="mt-2 space-y-1 text-sm">{j.bullets.map((b) => <li>+ {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section id="projects" class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-5xl uppercase mb-6" style="font-family:var(--font-display)">Projects</h2>
    <div class="grid md:grid-cols-3 gap-6">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="hard p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 class="text-xl uppercase" style="font-family:var(--font-display)">{p.title}</h3>
          <p class="text-sm mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="hackathons" class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-5xl uppercase mb-6" style="font-family:var(--font-display)">Hackathons</h2>
    <div class="grid md:grid-cols-2 gap-6">
      {hackathons.map((h, i) => (
        <div class="hard hard-accent p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-bold text-[var(--accent)] uppercase">{h.placement}</p>
          <h3 class="text-2xl uppercase" style="font-family:var(--font-display)">{h.event}</h3>
          <p class="text-sm mt-2">{h.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="skills" class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-5xl uppercase mb-6" style="font-family:var(--font-display)">Stack</h2>
    <div class="flex flex-wrap gap-2">
      {Object.values(resumeData.skills).flat().map((s) => <span class="hard px-3 py-1 text-sm font-bold">{s}</span>)}
    </div>
  </section>

  <footer id="contact" class="max-w-6xl mx-auto px-4 py-20">
    <a href="mailto:contactayushmadhav@gmail.com" class="hard hard-accent inline-block px-6 py-3 text-2xl uppercase font-bold" style="font-family:var(--font-display)">contactayushmadhav@gmail.com</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/brutal/` built. Concrete bg, Anton oversized headings, red marquee scrolling, hard offset shadows on cards, dock highlights "Brutalist". Reduced-motion: marquee static. Mobile: type scales, cards stack.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/brutal.css src/pages/v2/brutal
git commit -m "feat(v2): brutalist theme"
```

---

### Task 6: Risograph theme

**Reference:** Riso duotone print. **Vectors:** Hanken Grotesk (800/300) + Space Grotesk; electric blue + fluoro pink on warm paper; heavy grain overlay (`.grain` from base); misregistration offset (duplicate-text shadow in second ink); bouncy stagger entrance.

**Files:**
- Create: `src/styles/themes/riso.css`
- Create: `src/pages/v2/riso/index.astro`

- [ ] **Step 1: Tokens + misregistration + bounce**

```css
/* src/styles/themes/riso.css */
html[data-theme="riso"] {
  --bg: #f3ecdd; --bg-2: #f3ecdd; --surface: #fbf6ea;
  --text: #1d2bd4; --text-dim: #5a63c9;   /* riso blue as "ink 1" */
  --accent: #ff48a6; --accent-2: #1d2bd4; /* fluoro pink "ink 2" */
  --font-display: 'Hanken Grotesk', sans-serif;
  --font-body: 'Hanken Grotesk', sans-serif;
  --font-mono: 'Space Grotesk', monospace;
  --w-display: 800; --w-body: 300;
  --radius: 1.5rem; --border: 2px solid var(--text); --dur: 0.6s;
}
html[data-theme="riso"] .misreg { position: relative; }
html[data-theme="riso"] .misreg::before {
  content: attr(data-text); position: absolute; left: 3px; top: 3px;
  color: var(--accent); z-index: -1; mix-blend-mode: multiply;
}
html[data-theme="riso"] [data-load] { animation-timing-function: cubic-bezier(0.34,1.56,0.64,1); }
```

- [ ] **Step 2: Compose (zine stacks, offset color)**

```astro
---
// src/pages/v2/riso/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/riso.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="riso" title="Ayush Madhav Kumar. Risograph">
  <div class="grain"></div>
  <section class="min-h-[100svh] min-h-[100dvh] flex flex-col justify-center max-w-5xl mx-auto px-6">
    <Photo class="h-40 w-40 md:h-[19rem] md:w-[12.6rem] rounded-[1.5rem] border-2 border-[var(--text)]" />
    <h1 class="misreg text-6xl md:text-8xl mt-6" data-text="Ayush Madhav Kumar" style="font-family:var(--font-display);font-weight:800" data-load>Ayush Madhav Kumar</h1>
    <p class="text-xl mt-4" data-load style="--i:1">CS and Math @UMichigan. Systems and AI infrastructure.</p>
    <p class="font-mono mt-2 text-[var(--accent)]" data-load style="--i:2">&gt; NSF-backed research</p>
    <a class="font-mono text-[var(--accent)] underline" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" data-load style="--i:3">&gt; view resume (pdf)</a>
  </section>

  <!-- sections: rounded cards with pink offset; reuse same shell per section -->
  <section id="experience" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="misreg text-4xl mb-8" data-text="Experience" style="font-family:var(--font-display);font-weight:800">Experience</h2>
    <div class="space-y-5">
      {experience.map((j, i) => (
        <div class="bg-[var(--surface)] border-2 border-[var(--text)] rounded-[1.5rem] p-5 shadow-[6px_6px_0_var(--accent)]" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-mono text-[var(--accent)]">{j.period}</p>
          <h3 class="text-xl" style="font-weight:800">{j.company} . {j.role}</h3>
          <ul class="mt-2 space-y-1 text-sm">{j.bullets.map((b) => <li>- {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section id="projects" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="misreg text-4xl mb-8" data-text="Projects" style="font-family:var(--font-display);font-weight:800">Projects</h2>
    <div class="grid md:grid-cols-2 gap-5">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="bg-[var(--surface)] border-2 border-[var(--text)] rounded-[1.5rem] p-5 shadow-[6px_6px_0_var(--accent)]" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 class="text-lg" style="font-weight:800">{p.title}</h3>
          <p class="text-sm mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="hackathons" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="misreg text-4xl mb-8" data-text="Hackathons" style="font-family:var(--font-display);font-weight:800">Hackathons</h2>
    <div class="grid md:grid-cols-2 gap-5">
      {hackathons.map((h, i) => (
        <div class="bg-[var(--surface)] border-2 border-[var(--text)] rounded-[1.5rem] p-5 shadow-[6px_6px_0_var(--accent)]" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="font-mono text-[var(--accent)]">&gt; {h.placement}</p>
          <h3 class="text-lg" style="font-weight:800">{h.event}</h3>
          <p class="text-sm mt-2">{h.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="skills" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="misreg text-4xl mb-8" data-text="Stack" style="font-family:var(--font-display);font-weight:800">Stack</h2>
    <div class="flex flex-wrap gap-2">
      {Object.values(resumeData.skills).flat().map((s) => <span class="border-2 border-[var(--text)] rounded-full px-3 py-1 text-sm">{s}</span>)}
    </div>
  </section>

  <footer id="contact" class="max-w-5xl mx-auto px-6 py-20 text-center">
    <a href="mailto:contactayushmadhav@gmail.com" class="text-xl underline text-[var(--accent)]">contactayushmadhav@gmail.com</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/riso/` built. Warm paper, blue ink text with pink misregistration on headings, grain overlay, pink offset shadows, bouncy entrance, dock highlights "Risograph". Mobile: cards stack, misreg readable.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/riso.css src/pages/v2/riso
git commit -m "feat(v2): risograph theme"
```

---

### Task 7: Outrun theme

**Reference:** 80s synthwave. **Vectors:** Orbitron (900) display + Rajdhani body; magenta-to-orange sunset gradient; neon perspective horizon grid; chrome/glow text; parallax sun behind hero; scanline. Hero is centered over the grid horizon.

**Files:**
- Create: `src/styles/themes/outrun.css`
- Create: `src/pages/v2/outrun/index.astro`

- [ ] **Step 1: Tokens + sunset + horizon grid + glow**

```css
/* src/styles/themes/outrun.css */
html[data-theme="outrun"] {
  --bg: #1a0b2e; --bg-2: #2a1145; --surface: rgba(42,17,69,0.6);
  --text: #ffe9ff; --text-dim: #b98fd6;
  --accent: #ff2e97; --accent-2: #ffb347;
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Rajdhani', monospace;
  --w-display: 900; --w-body: 300;
  --radius: 0.5rem; --border: 1px solid var(--accent); --dur: 0.7s;
}
html[data-theme="outrun"] body {
  background:
    radial-gradient(circle at 50% 78%, #ffb347 0 6%, #ff2e97 12%, transparent 40%),
    linear-gradient(#1a0b2e 0 55%, #3a1259 80%, #ff2e97 120%);
  background-attachment: fixed;
}
html[data-theme="outrun"] .horizon {
  position: fixed; inset: 55% 0 0 0; z-index: 0; pointer-events: none;
  background-image: linear-gradient(rgba(255,46,151,0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(255,46,151,0.4) 2px, transparent 2px);
  background-size: 100% 40px, 40px 100%;
  transform: perspective(300px) rotateX(72deg); transform-origin: top;
}
html[data-theme="outrun"] .glow { text-shadow: 0 0 12px var(--accent), 0 0 28px rgba(255,46,151,0.5); }
html[data-theme="outrun"] section, html[data-theme="outrun"] header, html[data-theme="outrun"] footer { position: relative; z-index: 1; }
```

- [ ] **Step 2: Compose (centered hero over horizon, neon cards)**

```astro
---
// src/pages/v2/outrun/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/outrun.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="outrun" title="Ayush Madhav Kumar. Outrun">
  <div class="horizon"></div>
  <section class="min-h-[100svh] min-h-[100dvh] flex flex-col items-center justify-center text-center px-6">
    <Photo class="h-40 w-40 rounded-full border-2 border-[var(--accent)] shadow-[0_0_30px_var(--accent)]" />
    <p class="uppercase tracking-[0.3em] mt-6 text-[var(--accent-2)]" data-load>CS and Math @UMichigan</p>
    <h1 class="glow text-5xl md:text-7xl uppercase mt-3" style="font-family:var(--font-display);font-weight:900;letter-spacing:0.05em" data-load style="--i:1">Ayush Madhav Kumar</h1>
    <p class="font-mono mt-4 text-lg" data-load style="--i:2">&gt; NSF-backed research</p>
    <a class="mt-4 px-6 py-2 border border-[var(--accent)] glow uppercase tracking-wider" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" data-load style="--i:3">Resume</a>
  </section>

  <section id="experience" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="glow text-4xl uppercase mb-8" style="font-family:var(--font-display)">Experience</h2>
    <div class="grid md:grid-cols-2 gap-5">
      {experience.map((j, i) => (
        <div class="border border-[var(--accent)] bg-[var(--surface)] backdrop-blur p-5 rounded-lg" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="text-[var(--accent-2)] uppercase tracking-wide">{j.period}</p>
          <h3 class="text-xl uppercase" style="font-family:var(--font-display)">{j.company}</h3>
          <p>{j.role}</p>
          <ul class="mt-2 space-y-1 text-sm text-[var(--text-dim)]">{j.bullets.map((b) => <li>- {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section id="projects" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="glow text-4xl uppercase mb-8" style="font-family:var(--font-display)">Projects</h2>
    <div class="grid md:grid-cols-3 gap-5">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="border border-[var(--accent)] bg-[var(--surface)] backdrop-blur p-5 rounded-lg" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 class="uppercase" style="font-family:var(--font-display)">{p.title}</h3>
          <p class="text-sm text-[var(--text-dim)] mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="hackathons" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="glow text-4xl uppercase mb-8" style="font-family:var(--font-display)">Hackathons</h2>
    <div class="grid md:grid-cols-2 gap-5">
      {hackathons.map((h, i) => (
        <div class="border border-[var(--accent)] bg-[var(--surface)] backdrop-blur p-5 rounded-lg" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="text-[var(--accent-2)] uppercase">{h.placement}</p>
          <h3 class="uppercase" style="font-family:var(--font-display)">{h.event}</h3>
          <p class="text-sm text-[var(--text-dim)] mt-2">{h.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="skills" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="glow text-4xl uppercase mb-8" style="font-family:var(--font-display)">Stack</h2>
    <div class="flex flex-wrap gap-2">
      {Object.values(resumeData.skills).flat().map((s) => <span class="border border-[var(--accent)] rounded-full px-3 py-1 text-sm">{s}</span>)}
    </div>
  </section>

  <footer id="contact" class="max-w-5xl mx-auto px-6 py-20 text-center">
    <a href="mailto:contactayushmadhav@gmail.com" class="glow text-2xl uppercase" style="font-family:var(--font-display)">Contact</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/outrun/` built. Sunset gradient, neon perspective horizon, glowing Orbitron headings, glassy neon cards, dock highlights "Outrun". Mobile: horizon still reads, hero centered.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/outrun.css src/pages/v2/outrun
git commit -m "feat(v2): outrun theme"
```

---

### Task 8: Aurora theme

**Reference:** Nord + northern lights. **Vectors:** Space Grotesk (700) + Inter (200); Nord frost/polar palette; soft animated mesh-gradient background (aurora ribbons); calm gentle fades; rounded soft cards. Light/dark aware (Nord has both polar-night and snow-storm).

**Files:**
- Create: `src/styles/themes/aurora.css`
- Create: `src/pages/v2/aurora/index.astro`

- [ ] **Step 1: Tokens + mesh aurora background**

```css
/* src/styles/themes/aurora.css */
html[data-theme="aurora"] {
  --bg: #2e3440; --bg-2: #3b4252; --surface: rgba(59,66,82,0.55);
  --text: #eceff4; --text-dim: #a9b3c9;
  --accent: #88c0d0; --accent-2: #a3be8c;
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --w-display: 700; --w-body: 200;
  --radius: 1.25rem; --border: 1px solid rgba(136,192,208,0.4); --dur: 0.8s;
}
html[data-theme="aurora"] body {
  background:
    radial-gradient(at 15% 20%, rgba(136,192,208,0.35) 0, transparent 45%),
    radial-gradient(at 80% 15%, rgba(163,190,140,0.30) 0, transparent 45%),
    radial-gradient(at 70% 85%, rgba(180,142,173,0.30) 0, transparent 45%),
    radial-gradient(at 25% 80%, rgba(94,129,172,0.35) 0, transparent 45%),
    var(--bg);
  background-attachment: fixed;
  animation: auroraShift 18s ease-in-out infinite alternate;
}
@keyframes auroraShift { to { background-position: 8% -6%, -6% 8%, 6% -8%, -8% 6%; } }
@media (prefers-reduced-motion: reduce) { html[data-theme="aurora"] body { animation: none; } }
html[data-theme="aurora"] .glass { background: var(--surface); backdrop-filter: blur(10px); border: var(--border); border-radius: var(--radius); }
```

- [ ] **Step 2: Compose (calm glass card grid)**

```astro
---
// src/pages/v2/aurora/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/aurora.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="aurora" title="Ayush Madhav Kumar. Aurora">
  <section class="min-h-[100svh] min-h-[100dvh] flex flex-col justify-center items-center text-center px-6">
    <Photo class="h-40 w-40 md:h-[19rem] md:w-[12.6rem] rounded-[1.25rem] border border-[var(--accent)]/40" />
    <p class="mt-6 text-[var(--accent)]" data-load>CS and Math @UMichigan</p>
    <h1 class="text-5xl md:text-7xl mt-3" style="font-family:var(--font-display);font-weight:700;letter-spacing:-0.02em" data-load style="--i:1">Ayush Madhav Kumar</h1>
    <p class="font-mono mt-4 text-[var(--accent)]" data-load style="--i:2">&gt; NSF-backed research</p>
    <a class="font-mono text-[var(--accent)] hover:underline" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" data-load style="--i:3">&gt; view resume (pdf)</a>
  </section>

  <section id="experience" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-4xl mb-8" style="font-family:var(--font-display);font-weight:700">Experience</h2>
    <div class="grid md:grid-cols-2 gap-5">
      {experience.map((j, i) => (
        <div class="glass p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="text-[var(--accent)] text-sm">{j.period}</p>
          <h3 class="text-xl" style="font-family:var(--font-display);font-weight:700">{j.company}</h3>
          <p class="text-[var(--text-dim)]">{j.role}</p>
          <ul class="mt-2 space-y-1 text-sm">{j.bullets.map((b) => <li>- {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section id="projects" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-4xl mb-8" style="font-family:var(--font-display);font-weight:700">Projects</h2>
    <div class="grid md:grid-cols-3 gap-5">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="glass p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 style="font-family:var(--font-display);font-weight:700">{p.title}</h3>
          <p class="text-sm text-[var(--text-dim)] mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="hackathons" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-4xl mb-8" style="font-family:var(--font-display);font-weight:700">Hackathons</h2>
    <div class="grid md:grid-cols-2 gap-5">
      {hackathons.map((h, i) => (
        <div class="glass p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="text-[var(--accent)] text-sm">&gt; {h.placement}</p>
          <h3 style="font-family:var(--font-display);font-weight:700">{h.event}</h3>
          <p class="text-sm text-[var(--text-dim)] mt-2">{h.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="skills" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-4xl mb-8" style="font-family:var(--font-display);font-weight:700">Stack</h2>
    <div class="flex flex-wrap gap-2">
      {Object.values(resumeData.skills).flat().map((s) => <span class="glass px-3 py-1 text-sm rounded-full">{s}</span>)}
    </div>
  </section>

  <footer id="contact" class="max-w-5xl mx-auto px-6 py-20 text-center">
    <a href="mailto:contactayushmadhav@gmail.com" class="text-xl text-[var(--accent)] hover:underline">contactayushmadhav@gmail.com</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/aurora/` built. Nord palette, slow-shifting aurora mesh background, glass cards, calm fades, dock highlights "Aurora". Reduced-motion: background static. Mobile: cards stack.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/aurora.css src/pages/v2/aurora
git commit -m "feat(v2): aurora theme"
```

---

### Task 9: Bauhaus theme

**Reference:** Bauhaus 1919 / constructivism. **Vectors:** Jost (geometric, Futura-like) 700 display / 300 body; primary red/blue/yellow + black on bone white; large flat color blocks and geometric shapes (circle, triangle, bar) as composition, not decoration; hard-edged asymmetric grid; motion = blocks slide in from alternating sides.

**Files:**
- Create: `src/styles/themes/bauhaus.css`
- Create: `src/pages/v2/bauhaus/index.astro`

**Interfaces:** Consumes Task 1 + shared data. Produces nothing downstream.

- [ ] **Step 1: Tokens + geometric shapes + slide motion**

```css
/* src/styles/themes/bauhaus.css */
html[data-theme="bauhaus"] {
  --bg: #f4f1ea; --bg-2: #ffffff; --surface: #ffffff;
  --text: #141414; --text-dim: #555555;
  --accent: #e63329;   /* red */
  --accent-2: #1f4ed8; /* blue */
  --bau-yellow: #f4c20d;
  --font-display: 'Jost', sans-serif;
  --font-body: 'Jost', sans-serif;
  --font-mono: 'Jost', monospace;
  --w-display: 700; --w-body: 300;
  --radius: 0; --border: 3px solid #141414; --dur: 0.6s;
}
html[data-theme="bauhaus"] .shape { position: absolute; z-index: 0; }
html[data-theme="bauhaus"] .circle { border-radius: 50%; background: var(--accent); }
html[data-theme="bauhaus"] .square { background: var(--accent-2); }
html[data-theme="bauhaus"] .tri {
  width: 0; height: 0; background: transparent;
  border-left: 60px solid transparent; border-right: 60px solid transparent;
  border-bottom: 104px solid var(--bau-yellow);
}
html[data-theme="bauhaus"] .block { border: var(--border); }
/* alternate slide direction by nth */
html[data-theme="bauhaus"] [data-load]:nth-child(even) { animation-name: bauSlideR; }
@keyframes bauSlideR { from { opacity:0; transform: translateX(40px); } to { opacity:1; transform:none; } }
```

- [ ] **Step 2: Compose (asymmetric panels + flat shapes)**

```astro
---
// src/pages/v2/bauhaus/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/bauhaus.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="bauhaus" title="Ayush Madhav Kumar. Bauhaus">
  <section class="relative overflow-hidden min-h-[100svh] min-h-[100dvh] grid md:grid-cols-2">
    <div class="shape circle" style="width:220px;height:220px;top:-60px;right:-40px"></div>
    <div class="shape tri" style="bottom:40px;left:30%"></div>
    <div class="relative z-10 flex flex-col justify-center p-8 md:p-14">
      <div class="h-3 w-24 bg-[var(--accent)] mb-6" data-load></div>
      <p class="uppercase tracking-[0.2em]" data-load style="--i:1">CS and Math @UMichigan</p>
      <h1 class="text-6xl md:text-8xl uppercase leading-[0.9] mt-3" style="font-family:var(--font-display);font-weight:700" data-load style="--i:2">Ayush<br/>Madhav<br/>Kumar</h1>
      <a class="block mt-6 w-fit px-5 py-2 bg-[var(--accent-2)] text-white uppercase tracking-wider" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" data-load style="--i:3">Resume</a>
    </div>
    <div class="relative z-10 grid place-items-center bg-[var(--bau-yellow)] p-8">
      <Photo class="h-[20rem] w-[13.3rem] block border-[3px] border-[var(--text)]" />
    </div>
  </section>

  <section id="experience" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-5xl uppercase mb-8" style="font-family:var(--font-display);font-weight:700">Experience</h2>
    <div class="grid md:grid-cols-2 gap-6">
      {experience.map((j, i) => (
        <div class="block p-5 bg-[var(--surface)]" data-load style={`--i:${Math.min(i,4)}`}>
          <div class="h-2 w-12 mb-3" style={i % 2 ? 'background:var(--accent-2)' : 'background:var(--accent)'}></div>
          <p class="uppercase text-sm">{j.period}</p>
          <h3 class="text-2xl uppercase" style="font-family:var(--font-display);font-weight:700">{j.company}</h3>
          <p>{j.role}</p>
          <ul class="mt-2 space-y-1 text-sm">{j.bullets.map((b) => <li>- {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section id="projects" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-5xl uppercase mb-8" style="font-family:var(--font-display);font-weight:700">Projects</h2>
    <div class="grid md:grid-cols-3 gap-6">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="block p-5 bg-[var(--surface)]" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 class="text-xl uppercase" style="font-family:var(--font-display);font-weight:700">{p.title}</h3>
          <p class="text-sm mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="hackathons" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-5xl uppercase mb-8" style="font-family:var(--font-display);font-weight:700">Hackathons</h2>
    <div class="grid md:grid-cols-2 gap-6">
      {hackathons.map((h, i) => (
        <div class="block p-5" style={i % 2 ? 'background:var(--accent)' : 'background:var(--accent-2)'} data-load>
          <p class="uppercase text-sm text-white">{h.placement}</p>
          <h3 class="text-2xl uppercase text-white" style="font-family:var(--font-display);font-weight:700">{h.event}</h3>
          <p class="text-sm mt-2 text-white">{h.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="skills" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-5xl uppercase mb-8" style="font-family:var(--font-display);font-weight:700">Stack</h2>
    <div class="flex flex-wrap gap-2">
      {Object.values(resumeData.skills).flat().map((s) => <span class="block px-3 py-1 text-sm bg-[var(--surface)]">{s}</span>)}
    </div>
  </section>

  <footer id="contact" class="max-w-6xl mx-auto px-4 py-20">
    <a href="mailto:contactayushmadhav@gmail.com" class="inline-block px-6 py-3 bg-[var(--accent)] text-white text-2xl uppercase" style="font-family:var(--font-display)">contactayushmadhav@gmail.com</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/bauhaus/` built. Bone-white ground, red circle + yellow triangle shapes, yellow photo panel, Jost uppercase headings, primary-color hackathon panels, blocks slide in alternating sides, dock highlights "Bauhaus". Reduced-motion: blocks static. Mobile: panels stack, shapes do not cause horizontal scroll (overflow hidden on hero).

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/bauhaus.css src/pages/v2/bauhaus
git commit -m "feat(v2): bauhaus theme"
```

---

### Task 10: Comic Pop theme

**Reference:** Lichtenstein pop art / comic panel. **Vectors:** Bangers display + Nunito Sans body; bright red/yellow/blue on cream; Ben-Day halftone dot background; thick 3px black outlines on everything; hard black drop shadow; speech-bubble and panel framing; motion = panels pop in with a slight overshoot.

**Files:**
- Create: `src/styles/themes/comic.css`
- Create: `src/pages/v2/comic/index.astro`

**Interfaces:** Consumes Task 1 + shared data. Produces nothing downstream.

- [ ] **Step 1: Tokens + halftone + outlines + pop motion**

```css
/* src/styles/themes/comic.css */
html[data-theme="comic"] {
  --bg: #fff6df; --bg-2: #ffffff; --surface: #ffffff;
  --text: #141414; --text-dim: #444444;
  --accent: #ff3b3b;   /* red */
  --accent-2: #ffd400; /* yellow */
  --comic-blue: #2b6cff;
  --font-display: 'Bangers', cursive;
  --font-body: 'Nunito Sans', sans-serif;
  --font-mono: 'Nunito Sans', monospace;
  --w-display: 400; --w-body: 300;
  --radius: 0.75rem; --border: 3px solid #141414; --dur: 0.5s;
}
html[data-theme="comic"] body {
  background-image: radial-gradient(circle, rgba(0,0,0,0.14) 1.5px, transparent 1.7px);
  background-size: 14px 14px; background-color: var(--bg);
}
html[data-theme="comic"] .panel { border: var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: 6px 6px 0 #141414; }
html[data-theme="comic"] .bubble { border: var(--border); border-radius: 1.5rem; background: #fff; position: relative; }
html[data-theme="comic"] .bubble::after { content:''; position:absolute; bottom:-14px; left:32px; width:0;height:0; border:10px solid transparent; border-top-color:#141414; }
html[data-theme="comic"] .pop { letter-spacing: 0.02em; }
html[data-theme="comic"] [data-load] { animation-timing-function: cubic-bezier(0.34,1.56,0.64,1); }
```

- [ ] **Step 2: Compose (comic panels + speech bubble hero)**

```astro
---
// src/pages/v2/comic/index.astro
import ThemeLayout from '../../../layouts/ThemeLayout.astro';
import '../../../styles/themes/comic.css';
import Photo from '../../../components/v2/shared/Photo.astro';
import { experience, hackathons } from '../../../data/v2';
import { projects } from '../../../data/projects';
import resumeData from '../../../data/resume.json';
---
<ThemeLayout themeKey="comic" title="Ayush Madhav Kumar. Comic Pop">
  <section class="min-h-[100svh] min-h-[100dvh] flex flex-col justify-center items-center text-center px-6 gap-6">
    <div class="panel p-2" data-load><Photo class="h-44 w-44 rounded-xl" /></div>
    <div class="bubble px-6 py-3" data-load style="--i:1"><p class="text-lg" style="font-weight:800">CS and Math @UMichigan</p></div>
    <h1 class="pop text-6xl md:text-8xl text-[var(--accent)]" style="font-family:var(--font-display);-webkit-text-stroke:2px #141414" data-load style="--i:2">Ayush Madhav Kumar!</h1>
    <a class="panel px-6 py-2 text-2xl bg-[var(--accent-2)]" style="font-family:var(--font-display)" href="/AyushMadhavResume.pdf" target="_blank" rel="noopener noreferrer" data-load style="--i:3">Resume</a>
  </section>

  <section id="experience" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-6xl text-[var(--comic-blue)] mb-8" style="font-family:var(--font-display);-webkit-text-stroke:2px #141414">Experience</h2>
    <div class="grid md:grid-cols-2 gap-6">
      {experience.map((j, i) => (
        <div class="panel p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="text-sm" style="font-weight:800">{j.period}</p>
          <h3 class="text-3xl text-[var(--accent)]" style="font-family:var(--font-display)">{j.company}</h3>
          <p style="font-weight:800">{j.role}</p>
          <ul class="mt-2 space-y-1 text-sm">{j.bullets.map((b) => <li>- {b}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section id="projects" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-6xl text-[var(--accent)] mb-8" style="font-family:var(--font-display);-webkit-text-stroke:2px #141414">Projects</h2>
    <div class="grid md:grid-cols-3 gap-6">
      {projects.filter((p) => !hackathons.some((h) => h.project === p.title)).map((p, i) => (
        <div class="panel p-5" data-load style={`--i:${Math.min(i,4)}`}>
          <h3 class="text-2xl text-[var(--comic-blue)]" style="font-family:var(--font-display)">{p.title}</h3>
          <p class="text-sm mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="hackathons" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-6xl text-[var(--comic-blue)] mb-8" style="font-family:var(--font-display);-webkit-text-stroke:2px #141414">Hackathons</h2>
    <div class="grid md:grid-cols-2 gap-6">
      {hackathons.map((h, i) => (
        <div class="panel p-5 bg-[var(--accent-2)]" data-load style={`--i:${Math.min(i,4)}`}>
          <p class="text-sm" style="font-weight:800">{h.placement}</p>
          <h3 class="text-3xl text-[var(--accent)]" style="font-family:var(--font-display)">{h.event}</h3>
          <p class="text-sm mt-2">{h.blurb}</p>
        </div>
      ))}
    </div>
  </section>

  <section id="skills" class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-6xl text-[var(--accent)] mb-8" style="font-family:var(--font-display);-webkit-text-stroke:2px #141414">Stack</h2>
    <div class="flex flex-wrap gap-2">
      {Object.values(resumeData.skills).flat().map((s) => <span class="panel px-3 py-1 text-sm" style="box-shadow:3px 3px 0 #141414;font-weight:800">{s}</span>)}
    </div>
  </section>

  <footer id="contact" class="max-w-6xl mx-auto px-4 py-20 text-center">
    <a href="mailto:contactayushmadhav@gmail.com" class="panel inline-block px-6 py-3 text-3xl bg-[var(--comic-blue)] text-white" style="font-family:var(--font-display)">Contact</a>
  </footer>
</ThemeLayout>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS, `/v2/comic/` built. Cream halftone-dot background, Bangers stroked headings, thick black panel outlines with hard shadows, speech bubble in hero, yellow hackathon panels, panels pop in with overshoot, dock highlights "Comic Pop". Reduced-motion: panels static. Mobile: panels stack.

- [ ] **Step 4: Commit**

```bash
git add src/styles/themes/comic.css src/pages/v2/comic
git commit -m "feat(v2): comic pop theme"
```

---

### Task 11: Cross-theme polish pass

**Files:** any theme CSS/page needing fixes found during review.

- [ ] **Step 1: Dock contrast audit** — on every route, confirm the dock chips are legible against that theme's background (the dock uses `var(--surface)`/`var(--accent)`; adjust per-theme `--surface` alpha if a chip row is unreadable). The dock now holds 10 chips; verify it scrolls horizontally on narrow phones without breaking layout. Verify by loading each of the 10 routes.
- [ ] **Step 2: Hero viewport audit** — on iPhone-SE width (375x667) and a short laptop (1280x720), confirm each themed hero fits one screen without vertical scroll-to-see-name. Note any overflow and reduce hero type/photo for that theme only.
- [ ] **Step 3: Reduced-motion audit** — with "Emulate prefers-reduced-motion: reduce" on, load each route; confirm no looping animation runs (marquee, aurora shift, caret blink, horizon) and all content is visible.
- [ ] **Step 4: Memory audit** — pick a non-Current theme, navigate to `/v2`; confirm it redirects to the saved theme. Visit `/v2?stay`; confirm it stays on Current.
- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix(v2): cross-theme polish (dock contrast, viewport, reduced-motion)"
```

---

## Self-Review

**Spec coverage:** four-vector model (typography/color/motion/background) — each theme task defines all four in its tokens + page (Tasks 2-10). Layout variation per theme — yes, each page composition is structurally distinct (spec rail, shell log, editorial columns, poster grid, zine stacks, centered horizon, glass grid, geometric panels, comic panels). Current kept identical — Task 1 leaves `/v2` render untouched, only adds dock + memory script. Floating dock — Task 1. Memory/default Current — Task 1 redirect script. 9 new themes delivered (7 requested + 2 extra unique: Bauhaus, Comic Pop). No em dashes / emojis — copy uses commas/plain labels; verify in review. Per-theme fonts only — `ThemeLayout` injects only `def.fontHrefs`.

**Placeholder scan:** no TBD/TODO; every step ships concrete code or an exact build+viewport check. Visual themes have no unit tests by nature; verification is build + named manual checks, stated in Global Constraints.

**Type consistency:** `THEMES`/`themeByKey` defined in Task 1 and consumed by `ThemeLayout` + `ThemeDock`. `ThemeLayout` prop `themeKey` used identically in Tasks 2-8. Shared CSS var names from `_base.css` reused verbatim in every theme. `Photo.astro` prop `class` used consistently. Data fields (`experience[].company/role/period/bullets`, `hackathons[].event/placement/blurb/project`, `projects[].title/description/tags`, `resumeData.skills`) match the existing data files.

**Known risk to flag at execution:** "skin + layout variation" means 7 bespoke page compositions; this is the bulk of the effort. The plan front-loads infra (Task 1) so each theme after is independently shippable and reviewable. Recommend building Tasks 2-3 first, reviewing the pattern, then continuing.
