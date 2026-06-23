// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { places, type Place } from '../../data/places';
import { weatherLabel } from '../../lib/geo';

function popupHtml(p: Place, wx: string): string {
  return `<div class="cwm-pop">
    <div class="cwm-pop-body">
      <h3 class="cwm-pop-title">${p.name}, ${p.country}</h3>
      <p class="cwm-pop-wx">${wx}</p>
    </div>
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
    import('leaflet').then((mod) => {
      const L = mod.default;
      if (disposed || !elRef.current || mapRef.current) return;
      const worldBounds = L.latLngBounds([[-58, -179], [80, 179]]);
      const map = L.map(elRef.current, {
        worldCopyJump: false,
        maxZoom: 18,
        zoomSnap: 0,
        scrollWheelZoom: false, // don't hijack page scroll; activated on click below
        maxBounds: worldBounds,
        maxBoundsViscosity: 0.9,
        attributionControl: false,
      });

      // wheel zoom only after the user clicks into the map; released when the
      // pointer leaves. stops accidental zoom while scrolling the page past it.
      map.on('click', () => map.scrollWheelZoom.enable());
      map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

      const base = 'dark_nolabels';
      L.tileLayer(`https://{s}.basemaps.cartocdn.com/${base}/{z}/{x}/{y}{r}.png`, {
        subdomains: 'abcd',
        maxZoom: 19,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
      }).addTo(map);

      const icon = L.divIcon({ className: 'cwm-pin-icon', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
      places.forEach((p) => {
        const m = L.marker([p.lat, p.lng], { icon, title: `${p.name}, ${p.country}` }).addTo(map);
        m.bindPopup(popupHtml(p, 'Loading live weather...'), { maxWidth: 250, minWidth: 170, className: 'cwm-pop-wrap', autoPanPadding: [24, 24] });
        m.on('popupopen', () => {
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`)
            .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
            .then((d) => {
              const c = d.current;
              const wx = `Right now: ${Math.round(c.temperature_2m)}°C, ${weatherLabel(c.weather_code)}, wind ${Math.round(c.wind_speed_10m)} km/h`;
              if (m.isPopupOpen()) m.setPopupContent(popupHtml(p, wx));
            })
            .catch(() => { if (m.isPopupOpen()) m.setPopupContent(popupHtml(p, 'Weather unavailable right now.')); });
        });
      });

      // cover-fill: zoom so tiles fill both axes, no empty band, no duplicates
      const fill = () => {
        map.invalidateSize({ animate: false, pan: false });
        map.setMinZoom(0);
        const z = map.getBoundsZoom(worldBounds, true);
        map.setView(worldBounds.getCenter(), z, { animate: false });
        map.setMinZoom(z);
      };
      mapRef.current = map;
      fillRef.current = fill;
      setTimeout(fill, 60);
      setTimeout(fill, 300);
      window.addEventListener('resize', fill);
      // one-shot: settle the initial layout (kills uncovered edges), then stop
      // so it never fights the user's own zoom/pan afterward.
      ro = new ResizeObserver(() => { fill(); if (ro) { ro.disconnect(); ro = null; } });
      ro.observe(elRef.current);
    });
    return () => {
      disposed = true;
      if (ro) ro.disconnect();
      if (fillRef.current) window.removeEventListener('resize', fillRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // refit instantly when expanding/collapsing (don't wait for ResizeObserver)
  useEffect(() => {
    if (fillRef.current) requestAnimationFrame(() => fillRef.current && fillRef.current());
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
        <div ref={elRef} className="cwm-leaflet" />
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
