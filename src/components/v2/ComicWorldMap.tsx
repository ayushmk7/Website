// src/components/v2/ComicWorldMap.tsx
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { places, type Place } from '../../data/places';
import { weatherLabel } from '../../lib/geo';

type WxParts = { temp?: string; cond?: string; wind?: string; status?: string };

const WX_TTL_MS = 10 * 60 * 1000; // re-fetch weather older than 10 min
const WX_TIMEOUT_MS = 8000;       // a hung request must not leave "Loading…" forever
const wxCache = new Map<string, { parts: WxParts; at: number }>();
const wxPending = new Map<string, Promise<WxParts>>();

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);
const keyOf = (p: Place) => `${p.lat},${p.lng}`;

/** Cached + de-duplicated + timed-out weather lookup. */
function getWeather(p: Place, outerSignal: AbortSignal): Promise<WxParts> {
  const key = keyOf(p);
  const hit = wxCache.get(key);
  if (hit && Date.now() - hit.at < WX_TTL_MS) return Promise.resolve(hit.parts);
  const inflight = wxPending.get(key);
  if (inflight) return inflight;

  const ctl = new AbortController();
  const onOuterAbort = () => ctl.abort();
  outerSignal.addEventListener('abort', onOuterAbort, { once: true });
  const timeout = setTimeout(() => ctl.abort(), WX_TIMEOUT_MS);

  const req = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`,
    { signal: ctl.signal },
  )
    .then((r) => { if (!r.ok) throw new Error(`weather ${r.status}`); return r.json(); })
    .then((d) => {
      const c = d?.current;
      if (!c || typeof c.temperature_2m !== 'number') throw new Error('weather payload');
      const parts: WxParts = {
        temp: `${Math.round(c.temperature_2m)}°C`,
        cond: weatherLabel(c.weather_code),
        wind: `Wind ${Math.round(c.wind_speed_10m)} km/h`,
      };
      wxCache.set(key, { parts, at: Date.now() });
      return parts;
    })
    .finally(() => {
      clearTimeout(timeout);
      outerSignal.removeEventListener('abort', onOuterAbort);
      wxPending.delete(key);
    });

  wxPending.set(key, req);
  return req;
}

function popupHtml(p: Place, parts: WxParts): string {
  const wx = parts.temp != null
    ? `<span class="cwm-pop-temp">${esc(parts.temp)}</span>
       <span class="cwm-pop-meta"><span class="cwm-pop-cond">${esc(parts.cond ?? '')}</span><span class="cwm-pop-wind">${esc(parts.wind ?? '')}</span></span>`
    : `<span class="cwm-pop-status">${esc(parts.status ?? '')}</span>`;
  return `<div class="cwm-pop">
    <div class="cwm-pop-head">
      <h3 class="cwm-pop-title">${esc(p.name)}</h3>
      <p class="cwm-pop-country">${esc(p.country)}</p>
    </div>
    <div class="cwm-pop-wx">${wx}</div>
    ${p.blurb ? `<p class="cwm-pop-sub">${esc(p.blurb)}</p>` : ''}
  </div>`;
}

export default function ComicWorldMap() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const fitRef = useRef<((mode: 'home' | 'keep') => void) | null>(null);
  const focusPlaceRef = useRef<((i: number) => void) | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);   // first basemap tiles painted
  const [offHome, setOffHome] = useState(false); // user has panned/zoomed away
  const [hint, setHint] = useState<string | null>(null);

  const showHint = useCallback((msg: string) => {
    setHint(msg);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 1400);
  }, []);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let themeObs: MutationObserver | null = null;
    const timers: ReturnType<typeof setTimeout>[] = [];
    // one controller retires everything async: weather fetches AND every raw
    // DOM listener we add below (they take { signal }), so nothing survives unmount
    const ac = new AbortController();

    (async () => {
      const L = (await import('leaflet')).default;
      if (disposed || !elRef.current || mapRef.current) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      // touch-primary device (phone/tablet) — a hybrid laptop with a mouse keeps
      // normal one-finger dragging
      const touchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

      const worldBounds = L.latLngBounds([[-58, -179], [84, 179]]);
      const map = L.map(elRef.current, {
        worldCopyJump: false,
        maxZoom: 18,
        zoomSnap: 0,
        // wheel over the map used to swallow page scroll (Leaflet preventDefaults
        // it), so you got stuck zooming instead of scrolling past the section.
        // Wheel zoom is now opt-in via ctrl/⌘ + wheel — handled by hand below.
        scrollWheelZoom: false,
        zoomDelta: 0.6,
        // hard pan limit exactly at the world edge so you never overscroll into
        // the out-of-bounds margin (no border peeking in on pan)
        maxBounds: worldBounds,
        maxBoundsViscosity: 1.0,
        zoomAnimation: !reduceMotion,
        fadeAnimation: !reduceMotion,
        markerZoomAnimation: !reduceMotion,
        attributionControl: true, // CARTO free tier requires visible CARTO + OSM credit
      });
      map.attributionControl.setPrefix('');

      // light basemap in light mode, dark basemap in dark mode; swap on theme toggle
      const tileOpts = {
        subdomains: 'abcd',
        // 512px (@2x) tiles instead of 256px. The frame shows the world at a
        // fractional zoom (zoomSnap:0), which makes Chromium composite each tile
        // separately and leave a ~1px light hairline wherever two tiles meet —
        // that was the cross of lines through the middle of the default view.
        // At 512 the whole default view is ONE tile, so there is no seam to draw.
        // detectRetina flips 2x screens back to 256px @2x tiles (same pixel
        // density as before, and a seam there is only half a CSS pixel).
        tileSize: 512,
        zoomOffset: -1,
        minNativeZoom: 1, // with zoomOffset -1 this floors the requested tile at z0
        detectRetina: true,
        maxZoom: 20,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]] as any,
        crossOrigin: true as any,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      };
      const tileUrl = (dark: boolean) =>
        `https://{s}.basemaps.cartocdn.com/${dark ? 'dark_nolabels' : 'light_nolabels'}/{z}/{x}/{y}@2x.png?key=cb1_2vcl_1_ffefe7146ebbbd1728488c39`;

      let isDark = document.documentElement.classList.contains('dark');
      let tiles = L.tileLayer(tileUrl(isDark), tileOpts).addTo(map);
      tiles.once('load', () => { if (!disposed) setReady(true); });
      timers.push(setTimeout(() => { if (!disposed) setReady(true); }, 4000)); // never hang the skeleton

      // Theme swap. Every swap gets a generation id: a stale 'load' (two quick
      // toggles, slow first layer) must not remove the newer layer and leave the
      // wrong basemap on screen — the old code compared object identity only.
      let gen = 0;
      themeObs = new MutationObserver(() => {
        const d = document.documentElement.classList.contains('dark');
        if (d === isDark) return;
        isDark = d;
        const mine = ++gen;
        const prev = tiles;
        const next = L.tileLayer(tileUrl(d), tileOpts).addTo(map);
        let swapped = false;
        const swap = () => {
          if (swapped) return;
          swapped = true;
          clearTimeout(fallback);
          if (disposed) return;
          if (mine === gen) { tiles = next; map.removeLayer(prev); }
          else { map.removeLayer(next); } // superseded: drop the layer we just made
        };
        next.once('load', swap);
        const fallback = setTimeout(swap, 700); // in case 'load' is missed
        timers.push(fallback);
      });
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Bigger hit box on touch (16px dot was a ~22px tap target); the dot itself
      // is centred by CSS so the visual size is unchanged.
      const hit = coarse ? 36 : 26;
      const icon = L.divIcon({ className: 'cwm-pin-icon', html: '<span></span>', iconSize: [hit, hit], iconAnchor: [hit / 2, hit / 2] });
      const markers: any[] = [];

      const paint = (m: any, p: Place, parts: WxParts) => { if (!disposed) m.setPopupContent(popupHtml(p, parts)); };
      const loadWx = (m: any, p: Place) => {
        getWeather(p, ac.signal)
          .then((parts) => { if (m.isPopupOpen()) paint(m, p, parts); })
          .catch(() => { if (!ac.signal.aborted && m.isPopupOpen()) paint(m, p, { status: 'Weather unavailable' }); });
      };

      places.forEach((p, i) => {
        const label = `${p.name}, ${p.country}`;
        const m = L.marker([p.lat, p.lng], { icon, title: label, alt: label, riseOnHover: true }).addTo(map);
        m.bindPopup(popupHtml(p, { status: 'Loading weather…' }), {
          // never wider than the frame it lives in (mobile popups used to run to the edge)
          maxWidth: Math.max(180, Math.min(340, (elRef.current?.clientWidth ?? 340) - 36)),
          minWidth: 190,
          className: 'cwm-pop-wrap',
          autoPanPadding: [18, 18],
        });
        // hover/keyboard-focus label. Skipped on touch, where Leaflet also opens
        // tooltips on tap and you'd get the tooltip and the popup at once.
        if (!touchOnly) m.bindTooltip(p.name, { direction: 'top', offset: [0, -hit / 2 - 2], className: 'cwm-tip', opacity: 1 });
        // Name the pin for screen readers (a divIcon carries no alt text of its
        // own). The icon element does not exist yet — the map has no view at this
        // point, so Leaflet defers every layer's onAdd until it does — hence the
        // 'add' listener rather than touching getElement() straight away.
        const name = () => m.getElement()?.setAttribute('aria-label', `${label} — show local weather`);
        m.on('add', name); name();
        // warm the cache before the click lands, so the popup usually opens with data
        m.on('mouseover', () => { getWeather(p, ac.signal).catch(() => {}); });
        m.on('popupopen', () => {
          const hitCache = wxCache.get(keyOf(p));
          if (hitCache && Date.now() - hitCache.at < WX_TTL_MS) paint(m, p, hitCache.parts);
          else loadWx(m, p);
        });
        markers.push(m);
      });

      // ---- view fitting -------------------------------------------------
      // 'home': snap back to the whole world flush in the frame (box aspect
      // 1.49:1 == the world's mercator aspect, so no padding, no ocean ring).
      // 'keep': re-measure but hold the view the user chose. Any resize used to
      // force a full re-fit, which threw their zoom/pan away — and on mobile the
      // URL bar hiding fires resize on every scroll, so the map reset mid-gesture.
      // If they never left the world view we still re-home, so expand/collapse
      // and rotate keep showing the whole world.
      let homeZoom = 0;
      let atHome = true;
      // NB: worldBounds.getCenter() is the *arithmetic* lat/lng midpoint, which
      // is not the mercator midpoint of [-58, 84] — using it put the map ~30°
      // off centre. fitBounds computes the real one; read it back afterwards.
      let homeCenter = worldBounds.getCenter();
      const fit = (mode: 'home' | 'keep') => {
        if (disposed) return;
        map.invalidateSize({ animate: false, pan: false });
        map.setMinZoom(0);
        if (mode === 'home' || atHome) {
          map.fitBounds(worldBounds, { padding: [0, 0], animate: false });
          homeZoom = map.getZoom();
          homeCenter = map.getCenter();
        } else {
          const z = map.getBoundsZoom(worldBounds, false);
          homeZoom = z;
          if (map.getZoom() < z - 1e-4) map.setZoom(z, { animate: false });
        }
        map.setMinZoom(homeZoom);
        syncOffHome();
      };
      const syncOffHome = () => {
        if (disposed) return;
        const z = map.getZoom();
        const drift = map.project(map.getCenter(), z).distanceTo(map.project(homeCenter, z));
        const away = z > homeZoom + 0.01 || drift > 6;
        atHome = !away;
        setOffHome(away);
      };
      map.on('moveend zoomend', syncOffHome);

      mapRef.current = map;
      // dev-only handle so the map can be poked from the console (window.__cwm)
      if ((import.meta as any).env?.DEV) (window as any).__cwm = map;
      fitRef.current = fit;
      focusPlaceRef.current = (i: number) => {
        const p = places[i];
        const m = markers[i];
        if (!p || !m) return;
        const z = Math.max(homeZoom + 1.6, 4);
        map.setView([p.lat, p.lng], z, { animate: !reduceMotion, duration: 0.6 });
        m.openPopup();
      };

      fit('home');
      timers.push(setTimeout(() => fit('home'), 60));
      timers.push(setTimeout(() => fit('home'), 300));

      // debounced resize: re-measure, keep the user's view
      let rt: ReturnType<typeof setTimeout> | null = null;
      let lastW = elRef.current.clientWidth;
      let lastH = elRef.current.clientHeight;
      const onResize = () => {
        if (rt) clearTimeout(rt);
        rt = setTimeout(() => {
          if (disposed || !elRef.current) return;
          const w = elRef.current.clientWidth, h = elRef.current.clientHeight;
          if (w === lastW && h === lastH) return; // pure viewport-height noise: ignore
          lastW = w; lastH = h;
          fit('keep');
        }, 120);
      };
      window.addEventListener('resize', onResize, { signal: ac.signal });
      // one-shot: settle initial layout (kills uncovered edges), then stop so it
      // never fights the user's own zoom/pan afterward.
      ro = new ResizeObserver(() => { fit('home'); if (ro) { ro.disconnect(); ro = null; } });
      ro.observe(elRef.current);

      // ---- gesture ergonomics -------------------------------------------
      const container = map.getContainer();
      const zoomKey = /Mac|iPhone|iPad/.test(navigator.platform ?? '') ? '⌘' : 'Ctrl';
      container.addEventListener('wheel', (e: WheelEvent) => {
        // ctrl/⌘ + wheel (and macOS trackpad pinch, which arrives as ctrlKey)
        // zooms; a plain wheel is left to the page so scrolling never gets stuck.
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const z = map.getZoom() - e.deltaY * (e.deltaMode === 1 ? 0.08 : 0.0035);
          map.setZoomAround(map.mouseEventToContainerPoint(e), z, { animate: false });
        } else {
          showHint(`Use ${zoomKey} + scroll to zoom`);
        }
      }, { passive: false, signal: ac.signal });

      if (touchOnly) {
        // One finger scrolls the page — a full-bleed map used to swallow the
        // swipe and strand you mid-page. Two fingers still pan AND pinch-zoom:
        // Leaflet's touchZoom handler moves the centre by the midpoint delta,
        // so nothing is lost by turning one-finger dragging off entirely.
        map.dragging.disable();
        let sx = 0, sy = 0;
        container.addEventListener('touchstart', (e: TouchEvent) => {
          if (e.touches.length !== 1) return;
          sx = e.touches[0].clientX; sy = e.touches[0].clientY;
        }, { passive: true, signal: ac.signal });
        container.addEventListener('touchmove', (e: TouchEvent) => {
          if (e.touches.length !== 1) return;
          const dx = Math.abs(e.touches[0].clientX - sx);
          const dy = Math.abs(e.touches[0].clientY - sy);
          // sideways swipe = a pan attempt, not page scrolling — say why nothing moved
          if (dx > 14 && dx > dy) showHint('Use two fingers to move the map');
        }, { passive: true, signal: ac.signal });
      }
    })();

    return () => {
      disposed = true;
      ac.abort(); // cancels weather fetches AND removes every { signal } listener
      timers.forEach(clearTimeout);
      if (ro) ro.disconnect();
      if (themeObs) themeObs.disconnect();
      if (hintTimer.current) clearTimeout(hintTimer.current);
      fitRef.current = null;
      focusPlaceRef.current = null;
      if (mapRef.current) { mapRef.current.off(); mapRef.current.remove(); mapRef.current = null; }
    };
  }, [showHint]);

  // Re-measure synchronously AFTER the expand/collapse layout is applied but
  // BEFORE paint, so the map never flashes at its old size. 'keep' preserves
  // whatever the user was looking at instead of yanking them back to the world.
  useLayoutEffect(() => {
    fitRef.current?.('keep');
  }, [expanded]);

  // expanded = modal: Escape closes, page behind is locked, focus lands on X
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const expandIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
  );
  const globeIcon = (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></svg>
  );

  return (
    <div className={`cwm-wrap${expanded ? ' cwm-wrap--expanded' : ''}`}>
      <div className="cwm-map" role={expanded ? 'dialog' : undefined} aria-modal={expanded || undefined} aria-label={expanded ? 'Expanded world map' : undefined}>
        <div ref={elRef} className="cwm-leaflet" role="region" aria-label="World map of places I've visited; select a pin for local weather" />
        {!ready && <div className="cwm-skeleton" aria-hidden="true"><span className="cwm-skeleton-label">Loading map…</span></div>}
        {hint && <div className="cwm-hint" role="status">{hint}</div>}
        <div className="cwm-tools">
          {offHome && (
            <button type="button" className="cwm-tool-btn" onClick={() => fitRef.current?.('home')} aria-label="Reset map to the whole world" title="Reset view">
              {globeIcon}
            </button>
          )}
          <button
            ref={closeBtnRef}
            type="button"
            className="cwm-tool-btn cwm-expand-btn"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Close expanded map' : 'Expand map'}
            aria-pressed={expanded}
          >
            {expanded ? <span className="cwm-expand-x">X</span> : expandIcon}
          </button>
        </div>
      </div>
      <ul className="cwm-index" aria-label="Places, jump to one on the map">
        {places.map((p, i) => (
          <li key={`${p.name}-${p.country}`}>
            <button type="button" className="cwm-chip" onClick={() => focusPlaceRef.current?.(i)}>
              {p.name}<span className="cwm-chip-cc">{p.country}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
