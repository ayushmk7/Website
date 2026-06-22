# Comic World Map ("Places I've Been") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a comic-pop styled interactive world-map section to the Comic Pop theme page (`/v2/comic`), placed before the contact footer, with pins at places Ayush has been; clicking a pin reveals that location's live weather (Open-Meteo) and a NASA satellite image (NASA GIBS) inside a comic panel.

**Architecture:** A flat equirectangular world map image styled comic (thick outline, halftone overlay) lives in a React island. Pins are absolutely positioned over it via an equirectangular lat/lng -> percent projection (pure function). Clicking a pin fetches current weather from Open-Meteo (free, no key) and builds a NASA GIBS Snapshot image URL (free, no key) for a bounding box around the point, shown in a comic speech-bubble panel. All fetching is client-side (the site is `output: 'static'`). The places list is a single editable array so new places are one-line additions.

**Tech Stack:** Astro 5 (static), React 19 island, Tailwind + comic.css tokens, `fetch` to Open-Meteo + NASA GIBS (no API keys, no new dependencies).

## Global Constraints

- **Comic Pop theme only.** Touch only the comic theme + shared data; do not alter other themes or the registry.
- **No new npm dependencies.** No globe/three.js. Map is a static SVG/PNG asset + CSS; data via `fetch`.
- **No API keys.** Open-Meteo needs none. NASA GIBS Snapshot (`wvs.earthdata.nasa.gov`) needs none. Do NOT use api.nasa.gov key-gated endpoints.
- **No em dashes, no emojis** in user-facing copy. Weather conditions use word labels, not emoji.
- **One `style=` attribute per element.**
- **Comic identity:** thick `var(--border)` outlines, `var(--panel-shadow)` hard shadows, Bangers (`var(--font-display)`) for headings only, halftone dots, red `var(--accent)` / yellow `var(--accent-2)`. Must work in BOTH light and dark mode (use tokens, not hardcoded colors).
- **Accessibility:** pins are real `<button>`s with `aria-label`; focus-visible outline; >=36px tap targets; respect `prefers-reduced-motion` for any pin pulse.
- **One viewport rule does NOT apply here** (this is a mid-page section, not the hero). It should size naturally and not cause horizontal scroll at 360px.
- **Place list is data-driven and easy to extend:** adding a place = appending one object to `src/data/places.ts`.

---

## File Structure

- `src/data/places.ts` — Create. The editable list of places (name, country, lat, lng, optional blurb) + the `Place` type.
- `src/lib/geo.ts` — Create. Pure `projectLatLng(lat,lng)` -> `{x,y}` percent, plus `gibsSnapshotUrl(lat,lng,date)` and `weatherLabel(code)` helpers (pure, easy to check).
- `public/world-map.svg` — Add. A public-domain equirectangular (2:1) world map used as the map base.
- `src/components/v2/ComicWorldMap.tsx` — Create. The React island: renders the map + pins, handles selection + data fetch, renders the comic info panel.
- `src/styles/themes/comic.css` — Modify. Add `.cwm-*` styles (map frame, halftone, pins, info panel) under `html[data-theme="comic"]`.
- `src/pages/v2/comic/index.astro` — Modify. Import + render `<ComicWorldMap client:visible />` in a new `<section id="places">` before the `#contact` footer.

---

### Task 1: Places data + geo/util helpers

**Files:**
- Create: `src/data/places.ts`
- Create: `src/lib/geo.ts`

**Interfaces:**
- Produces: `export interface Place { name: string; country: string; lat: number; lng: number; blurb?: string }` and `export const places: Place[]`.
- Produces: `projectLatLng(lat: number, lng: number): { x: number; y: number }` (percent 0-100, equirectangular).
- Produces: `gibsSnapshotUrl(lat: number, lng: number, date: string): string` (NASA GIBS true-color JPEG of a bbox around the point).
- Produces: `weatherLabel(code: number): string` (WMO weather code to short word label).
- Produces: `yesterdayUTC(): string` (YYYY-MM-DD, one day back so GIBS imagery is available).

- [ ] **Step 1: Create the places list (easy to extend - append one object to add a place)**

```ts
// src/data/places.ts
export interface Place {
  name: string;
  country: string;
  lat: number;
  lng: number;
  blurb?: string;
}

// Add a new place by appending one object here.
export const places: Place[] = [
  { name: 'Ann Arbor', country: 'USA', lat: 42.2808, lng: -83.7430, blurb: 'University of Michigan' },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Cork', country: 'Ireland', lat: 51.8985, lng: -8.4756, blurb: 'Douglas Community School' },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, blurb: 'Patch accelerator, CareTether' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
];
```

- [ ] **Step 2: Create the geo/util helpers**

```ts
// src/lib/geo.ts

// Equirectangular projection -> percent position on a 2:1 world map.
// x: 0% at -180 lng, 100% at +180 lng. y: 0% at +90 lat (north), 100% at -90 lat (south).
export function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  };
}

// One UTC day back, YYYY-MM-DD. GIBS imagery for "today" is often not yet processed.
export function yesterdayUTC(): string {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// NASA GIBS Snapshot: true-color MODIS Terra image of a bbox around the point. No API key.
// BBOX order for CRS=EPSG:4326 is "minLat,minLng,maxLat,maxLng".
export function gibsSnapshotUrl(lat: number, lng: number, date: string): string {
  const pad = 6; // degrees around the point
  const minLat = Math.max(-90, lat - pad);
  const maxLat = Math.min(90, lat + pad);
  const minLng = Math.max(-180, lng - pad);
  const maxLng = Math.min(180, lng + pad);
  const bbox = `${minLat},${minLng},${maxLat},${maxLng}`;
  const params = new URLSearchParams({
    REQUEST: 'GetSnapshot',
    TIME: date,
    BBOX: bbox,
    CRS: 'EPSG:4326',
    LAYERS: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    WRAP: 'DAY',
    FORMAT: 'image/jpeg',
    WIDTH: '480',
    HEIGHT: '320',
    AUTOSCALE: 'TRUE',
  });
  return `https://wvs.earthdata.nasa.gov/api/v1/snapshot?${params.toString()}`;
}

// WMO weather interpretation codes -> short word labels (no emojis).
export function weatherLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}
```

- [ ] **Step 3: Verify the pure functions (repo has no test runner; use a one-off node check)**

Run:
```bash
cd /Users/ayush/Downloads/Website
npx tsx -e "import {projectLatLng,weatherLabel,gibsSnapshotUrl} from './src/lib/geo.ts'; import assert from 'node:assert'; const c=projectLatLng(0,0); assert.deepStrictEqual(c,{x:50,y:50}); const nw=projectLatLng(90,-180); assert.deepStrictEqual(nw,{x:0,y:0}); assert.strictEqual(weatherLabel(0),'Clear sky'); assert.strictEqual(weatherLabel(95),'Thunderstorm'); assert.ok(gibsSnapshotUrl(42.28,-83.74,'2026-06-21').includes('wvs.earthdata.nasa.gov')); console.log('geo OK');"
```
Expected: prints `geo OK` (no assertion error). If `tsx` is unavailable, run `npx --yes tsx -e "..."`.

- [ ] **Step 4: Commit**

```bash
git add src/data/places.ts src/lib/geo.ts
git commit -m "feat(comic): places data + geo/weather/GIBS helpers"
```

---

### Task 2: World map asset + ComicWorldMap base render (map + pins, no data yet)

**Files:**
- Add: `public/world-map.svg`
- Create: `src/components/v2/ComicWorldMap.tsx`
- Modify: `src/styles/themes/comic.css`

**Interfaces:**
- Consumes: `places`, `Place` from `src/data/places.ts`; `projectLatLng` from `src/lib/geo.ts`.
- Produces: `export default function ComicWorldMap()` (default export, used as `<ComicWorldMap client:visible />`).
- Produces CSS classes consumed by Task 3: `.cwm-wrap`, `.cwm-map`, `.cwm-pin`, `.cwm-panel`.

- [ ] **Step 1: Add the world map base image**

Download a public-domain equirectangular (2:1 aspect, EPSG:4326) world map SVG to `public/world-map.svg`. Use Wikimedia Commons "Equirectangular projection SW" / "BlankMap-World" (public domain). Command:
```bash
cd /Users/ayush/Downloads/Website
curl -L -o public/world-map.svg "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
```
Verify it saved and is an SVG:
```bash
head -c 80 public/world-map.svg
```
Expected: starts with `<?xml` or `<svg`. If the download fails or is not 2:1 equirectangular, substitute any public-domain equirectangular world map SVG/PNG at `public/world-map.svg`; the pin projection assumes full-world equirectangular bounds (-180..180 lng, -90..90 lat).

- [ ] **Step 2: Build the base component (map frame + halftone + pins; pins log on click for now)**

```tsx
// src/components/v2/ComicWorldMap.tsx
import React, { useState } from 'react';
import { places } from '../../data/places';
import { projectLatLng } from '../../lib/geo';

export default function ComicWorldMap() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="cwm-wrap">
      <div className="cwm-map">
        <img src="/world-map.svg" alt="World map" className="cwm-map-img" />
        <div className="cwm-halftone" aria-hidden="true" />
        {places.map((p, i) => {
          const { x, y } = projectLatLng(p.lat, p.lng);
          return (
            <button
              key={p.name}
              className={`cwm-pin${selected === i ? ' is-active' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`${p.name}, ${p.country}`}
              onClick={() => setSelected(i)}
            >
              <span className="cwm-pin-dot" aria-hidden="true" />
              <span className="cwm-pin-label">{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add comic map styles (append to comic.css)**

```css
/* ============================================================
   Comic World Map ("Places I've Been")
   ============================================================ */
html[data-theme="comic"] .cwm-wrap { width: 100%; max-width: 60rem; margin: 0 auto; }
html[data-theme="comic"] .cwm-map {
  position: relative;
  border: var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 6px 6px 0 var(--panel-shadow);
  overflow: hidden;
  aspect-ratio: 2 / 1;
}
html[data-theme="comic"] .cwm-map-img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  /* comic duotone: flatten the map to the theme ink */
  filter: grayscale(1) contrast(1.1) opacity(0.55);
}
/* ben-day dot overlay on the map */
html[data-theme="comic"] .cwm-halftone {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(var(--outline) 18%, transparent 20%);
  background-size: 10px 10px; opacity: 0.18;
}
/* pins */
html[data-theme="comic"] .cwm-pin {
  position: absolute; transform: translate(-50%, -50%);
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: transparent; border: none; cursor: pointer;
  min-width: 36px; min-height: 36px; padding: 0;
}
html[data-theme="comic"] .cwm-pin-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--accent); border: 3px solid var(--outline);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 35%, transparent);
}
html[data-theme="comic"] .cwm-pin.is-active .cwm-pin-dot { background: var(--accent-2); }
html[data-theme="comic"] .cwm-pin-label {
  font-family: var(--font-display); font-size: 0.85rem; color: var(--text);
  background: var(--surface); border: 2px solid var(--outline);
  padding: 0 0.3rem; border-radius: 0.3rem; white-space: nowrap;
}
html[data-theme="comic"] .cwm-pin:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
@media (prefers-reduced-motion: no-preference) {
  html[data-theme="comic"] .cwm-pin-dot { animation: cwmPulse 1.8s ease-in-out infinite; }
  @keyframes cwmPulse { 0%,100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent); } 50% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--accent) 10%, transparent); } }
}
/* on small screens hide the text label, keep dots */
@media (max-width: 640px) {
  html[data-theme="comic"] .cwm-pin-label { display: none; }
}
```

- [ ] **Step 4: Build and verify the base render**

Run: `cd /Users/ayush/Downloads/Website && npm run build`
Expected: PASS. (The component is not yet on the page; this just confirms it compiles. Skip visual check until Task 4.)

- [ ] **Step 5: Commit**

```bash
git add public/world-map.svg src/components/v2/ComicWorldMap.tsx src/styles/themes/comic.css
git commit -m "feat(comic): world map base (comic-styled map + pins)"
```

---

### Task 3: Live weather + NASA satellite image on pin click (comic info panel)

**Files:**
- Modify: `src/components/v2/ComicWorldMap.tsx`
- Modify: `src/styles/themes/comic.css`

**Interfaces:**
- Consumes: `places`, `projectLatLng`, plus `gibsSnapshotUrl`, `weatherLabel`, `yesterdayUTC` from `src/lib/geo.ts`.
- Produces: an info panel rendered when a pin is selected, showing place name, live weather text, and the NASA GIBS image.

- [ ] **Step 1: Add fetch + info panel to the component**

Replace the entire contents of `src/components/v2/ComicWorldMap.tsx` with:

```tsx
// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useState } from 'react';
import { places } from '../../data/places';
import { projectLatLng, gibsSnapshotUrl, weatherLabel, yesterdayUTC } from '../../lib/geo';

interface Weather { temp: number; label: string; wind: number }

export default function ComicWorldMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const place = selected === null ? null : places[selected];

  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setStatus('loading');
    setWeather(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json(); })
      .then((d) => {
        if (cancelled) return;
        const c = d.current;
        setWeather({ temp: Math.round(c.temperature_2m), label: weatherLabel(c.weather_code), wind: Math.round(c.wind_speed_10m) });
        setStatus('idle');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [selected]);

  const date = yesterdayUTC();

  return (
    <div className="cwm-wrap">
      <div className="cwm-map">
        <img src="/world-map.svg" alt="World map" className="cwm-map-img" />
        <div className="cwm-halftone" aria-hidden="true" />
        {places.map((p, i) => {
          const { x, y } = projectLatLng(p.lat, p.lng);
          return (
            <button
              key={p.name}
              className={`cwm-pin${selected === i ? ' is-active' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`${p.name}, ${p.country}`}
              onClick={() => setSelected(i)}
            >
              <span className="cwm-pin-dot" aria-hidden="true" />
              <span className="cwm-pin-label">{p.name}</span>
            </button>
          );
        })}
      </div>

      {place && (
        <div className="cwm-panel" role="status">
          <button className="cwm-close" aria-label="Close" onClick={() => setSelected(null)}>x</button>
          <img
            className="cwm-sat"
            src={gibsSnapshotUrl(place.lat, place.lng, date)}
            alt={`NASA satellite view of ${place.name}`}
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="cwm-info">
            <h3 className="cwm-place">{place.name}, {place.country}</h3>
            {place.blurb && <p className="cwm-blurb">{place.blurb}</p>}
            {status === 'loading' && <p className="cwm-wx">Loading live weather...</p>}
            {status === 'error' && <p className="cwm-wx">Weather unavailable right now.</p>}
            {weather && <p className="cwm-wx">Right now: {weather.temp}C, {weather.label}, wind {weather.wind} km/h</p>}
            <p className="cwm-credit">Satellite: NASA GIBS (MODIS Terra), {date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add info-panel styles (append to comic.css)**

```css
/* info panel: comic speech-panel with NASA image + weather */
html[data-theme="comic"] .cwm-panel {
  position: relative;
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 6px 6px 0 var(--panel-shadow);
  overflow: hidden;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 560px) { html[data-theme="comic"] .cwm-panel { flex-direction: row; } }
html[data-theme="comic"] .cwm-sat {
  width: 100%; max-width: 100%; height: auto; object-fit: cover;
  border-bottom: var(--border); background: var(--bg-2);
}
@media (min-width: 560px) {
  html[data-theme="comic"] .cwm-sat { width: 200px; height: auto; border-bottom: none; border-right: var(--border); }
}
html[data-theme="comic"] .cwm-info { padding: 0.9rem 1.1rem; flex: 1; }
html[data-theme="comic"] .cwm-place { font-family: var(--font-display); color: var(--accent); font-size: 1.6rem; line-height: 1; margin-bottom: 0.3rem; }
html[data-theme="comic"] .cwm-blurb { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem; }
html[data-theme="comic"] .cwm-wx { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.4rem; }
html[data-theme="comic"] .cwm-credit { font-size: 0.7rem; color: var(--text-dim); }
html[data-theme="comic"] .cwm-close {
  position: absolute; top: 0; right: 0; z-index: 2;
  font-family: var(--font-display); font-size: 1rem; line-height: 1;
  width: 2rem; height: 2rem; background: var(--accent); color: #fff;
  border: none; border-left: var(--border); border-bottom: var(--border); cursor: pointer;
}
html[data-theme="comic"] .cwm-close:focus-visible { outline: 3px solid var(--accent-2); outline-offset: 2px; }
```

- [ ] **Step 3: Build and verify it compiles**

Run: `cd /Users/ayush/Downloads/Website && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/ComicWorldMap.tsx src/styles/themes/comic.css
git commit -m "feat(comic): live weather (Open-Meteo) + NASA GIBS satellite image on pin click"
```

---

### Task 4: Place the section on the comic page (before contact) + verify live

**Files:**
- Modify: `src/pages/v2/comic/index.astro`

**Interfaces:**
- Consumes: `ComicWorldMap` default export.

- [ ] **Step 1: Import the component**

In the frontmatter of `src/pages/v2/comic/index.astro` (the `---` block at top), add:
```astro
import ComicWorldMap from '../../../components/v2/ComicWorldMap';
```

- [ ] **Step 2: Add the section immediately before the `<footer id="contact"` element**

Insert this block right before the contact footer in `src/pages/v2/comic/index.astro`:
```astro
  <section id="places" class="max-w-6xl mx-auto py-16" style="padding-left:clamp(1rem,4vw,2rem);padding-right:clamp(1rem,4vw,2rem)">
    <div class="section-heading">
      <h2 class="text-6xl text-[var(--comic-blue)]" style="font-family:var(--font-display);-webkit-text-stroke:2px var(--outline)">Places I have been</h2>
    </div>
    <p class="mb-6" style="font-weight:700">Tap a pin for live weather and a NASA satellite view.</p>
    <ComicWorldMap client:visible />
  </section>
```

- [ ] **Step 3: Add "Places" to the in-page nav (optional consistency)**

The shared `ThemeNav` links are global; do not edit it for one theme. Skip (the section is reachable by scroll). No change.

- [ ] **Step 4: Build and verify live**

Run: `cd /Users/ayush/Downloads/Website && npm run build`
Expected: PASS, `/v2/comic/index.html` rebuilt.

Then with the dev server running, load `http://localhost:4321/v2/comic`, scroll to "Places I have been":
- The comic map renders with halftone overlay and pulsing red pins at Ann Arbor, SF, NYC, Cork, Dublin, Mumbai (roughly correct positions).
- Click a pin: an info panel appears with the place name, its blurb, a line of live weather (e.g. "Right now: 14C, Overcast, wind 12 km/h"), and a NASA satellite image of the region. The pin turns yellow while active.
- Toggle BB8 dark mode: the map frame, halftone, pins, and panel all flip to dark surface + light outline; text stays legible.
- Open DevTools Network: confirm requests to `api.open-meteo.com` (200, JSON) and `wvs.earthdata.nasa.gov` (200, JPEG). If GIBS returns an error image, the `onError` hides it gracefully.
- Resize to 360px wide: pin labels hide (dots remain), panel stacks vertically, no horizontal scroll.

- [ ] **Step 5: Commit**

```bash
git add src/pages/v2/comic/index.astro
git commit -m "feat(comic): add Places-I-have-been world map section before contact"
```

---

## Self-Review

**Spec coverage:** Comic flat world map (Task 2 asset + render). Pins at places (Task 1 data + Task 2 projection). Click -> live weather Open-Meteo (Task 3) + NASA satellite image GIBS (Task 3). No-key NASA (GIBS only, Task 1 helper + Global Constraints). Easy to add places (single `places[]` array, Task 1). Comic-pop styling both modes (Task 2 + 3 CSS via tokens). Placed before contact (Task 4). Places included: Ann Arbor, SF, NYC, Cork, Dublin, India(Mumbai) (Task 1).

**Placeholder scan:** no TBD/TODO; every code step is complete; the pure helpers have a runnable node assert check (Task 1 Step 3); visual/network verification is explicit (Task 4 Step 4). The repo has no unit-test runner, so non-pure UI is verified by build + manual + Network panel, stated up front.

**Type consistency:** `Place` fields (name, country, lat, lng, blurb?) used identically in places.ts, projectLatLng args, and the component. `projectLatLng -> {x,y}`, `gibsSnapshotUrl(lat,lng,date)`, `weatherLabel(code)`, `yesterdayUTC()` signatures match between geo.ts and component usage. CSS class names `.cwm-wrap/.cwm-map/.cwm-map-img/.cwm-halftone/.cwm-pin/.cwm-pin-dot/.cwm-pin-label/.cwm-panel/.cwm-sat/.cwm-info/.cwm-place/.cwm-blurb/.cwm-wx/.cwm-credit/.cwm-close` defined in CSS match the component.

**Known risks to flag at execution:** (1) The `public/world-map.svg` download URL may change; if it 404s, drop in any public-domain equirectangular world map and pins still project correctly. (2) GIBS imagery for a given day/region can occasionally be cloudy or missing; `yesterdayUTC()` reduces this and `onError` hides a broken image. (3) Equirectangular pin projection is linear and accurate for a true equirectangular map; if the chosen world-map.svg is a different projection (e.g. Mercator), pins will be vertically off and a Mercator y-projection would be needed instead.
