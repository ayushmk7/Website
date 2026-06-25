// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { places, type Place } from '../../data/places';
import { weatherLabel } from '../../lib/geo';

type WxParts = { temp?: string; cond?: string; wind?: string; status?: string };
function popupHtml(p: Place, parts: WxParts): string {
  const wx = parts.temp != null
    ? `<span class="cwm-pop-temp">${parts.temp}</span>
       <span class="cwm-pop-meta"><span class="cwm-pop-cond">${parts.cond}</span><span class="cwm-pop-wind">${parts.wind}</span></span>`
    : `<span class="cwm-pop-status">${parts.status}</span>`;
  return `<div class="cwm-pop">
    <div class="cwm-pop-head">
      <h3 class="cwm-pop-title">${p.name}</h3>
      <p class="cwm-pop-country">${p.country}</p>
    </div>
    <div class="cwm-pop-wx">${wx}</div>
  </div>`;
}

export default function ComicWorldMap() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const fillRef = useRef<(() => void) | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let themeObs: MutationObserver | null = null;
    (async () => {
      const L = (await import('leaflet')).default;
      if (disposed || !elRef.current || mapRef.current) return;

      const worldBounds = L.latLngBounds([[-58, -179], [84, 179]]);
      const map = L.map(elRef.current, {
        worldCopyJump: false,
        maxZoom: 18,
        zoomSnap: 0,
        // wheel zoom only fires while the cursor is over the map (Leaflet default)
        scrollWheelZoom: true,
        // pan limit is padded out beyond the world so the fitted view keeps its
        // margin instead of being snapped flush to the frame (which clipped edge pins)
        maxBounds: worldBounds.pad(0.18),
        maxBoundsViscosity: 0.7,
        attributionControl: false,
      });

      // light basemap in light mode, dark basemap in dark mode; swap on theme toggle
      const tileOpts = { subdomains: 'abcd', maxZoom: 19, noWrap: true, bounds: [[-85, -180], [85, 180]] as any };
      const tileUrl = (dark: boolean) =>
        `https://{s}.basemaps.cartocdn.com/${dark ? 'dark_nolabels' : 'light_nolabels'}/{z}/{x}/{y}{r}.png`;
      let isDark = document.documentElement.classList.contains('dark');
      let tiles = L.tileLayer(tileUrl(isDark), tileOpts).addTo(map);
      themeObs = new MutationObserver(() => {
        const d = document.documentElement.classList.contains('dark');
        if (d === isDark) return;
        isDark = d;
        const next = L.tileLayer(tileUrl(d), tileOpts).addTo(map);
        const swap = () => { if (tiles && tiles !== next) { map.removeLayer(tiles); tiles = next; } };
        next.once('load', swap);
        setTimeout(swap, 700); // fallback if 'load' is missed
      });
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      const icon = L.divIcon({ className: 'cwm-pin-icon', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
      places.forEach((p) => {
        const m = L.marker([p.lat, p.lng], { icon, title: `${p.name}, ${p.country}` }).addTo(map);
        m.bindPopup(popupHtml(p, { status: 'Loading weather…' }), { maxWidth: 360, minWidth: 200, className: 'cwm-pop-wrap', autoPanPadding: [24, 24] });
        m.on('popupopen', () => {
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`)
            .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
            .then((d) => {
              const c = d.current;
              const parts = {
                temp: `${Math.round(c.temperature_2m)}°C`,
                cond: weatherLabel(c.weather_code),
                wind: `Wind ${Math.round(c.wind_speed_10m)} km/h`,
              };
              if (m.isPopupOpen()) m.setPopupContent(popupHtml(p, parts));
            })
            .catch(() => { if (m.isPopupOpen()) m.setPopupContent(popupHtml(p, { status: 'Weather unavailable' })); });
        });
      });

      // contain-fit: whole world visible (Greenland included), no crop. Frame
      // aspect (1.695:1) matches the world's mercator aspect, so no letterbox.
      const fill = () => {
        map.invalidateSize({ animate: false, pan: false });
        map.setMinZoom(0);
        // fit the whole world INSIDE the frame with px padding on every side, so
        // edge cities (e.g. San Francisco) always have margin and never clip.
        map.fitBounds(worldBounds, { padding: [24, 20], animate: false });
        map.setMinZoom(map.getZoom());
      };
      mapRef.current = map;
      fillRef.current = fill;
      setTimeout(fill, 60);
      setTimeout(fill, 300);
      window.addEventListener('resize', fill);
      // one-shot: settle initial layout (kills uncovered edges), then stop so it
      // never fights the user's own zoom/pan afterward.
      ro = new ResizeObserver(() => { fill(); if (ro) { ro.disconnect(); ro = null; } });
      ro.observe(elRef.current);
    })();
    return () => {
      disposed = true;
      if (ro) ro.disconnect();
      if (themeObs) themeObs.disconnect();
      if (fillRef.current) window.removeEventListener('resize', fillRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Refit synchronously AFTER the expand/collapse layout is applied but BEFORE
  // the browser paints, so the map never flashes its old size/position.
  useLayoutEffect(() => {
    if (fillRef.current) fillRef.current();
  }, [expanded]);

  // close expanded view on Escape
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const expandIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
  );

  return (
    <div className={`cwm-wrap${expanded ? ' cwm-wrap--expanded' : ''}`}>
      <div className="cwm-map">
        <div ref={elRef} className="cwm-leaflet" role="region" aria-label="World map of places I've visited; select a pin for local weather" />
        <button
          type="button"
          className="cwm-expand-btn"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Close expanded map' : 'Expand map'}
        >
          {expanded ? <span className="cwm-expand-x">X</span> : expandIcon}
        </button>
      </div>
    </div>
  );
}
