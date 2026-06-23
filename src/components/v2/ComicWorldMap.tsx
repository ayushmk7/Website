// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { places, type Place } from '../../data/places';
import { gibsSnapshotUrl, weatherLabel, yesterdayUTC } from '../../lib/geo';

const date = yesterdayUTC();

function popupHtml(p: Place, wx: string): string {
  return `<div class="cwm-pop">
    <img class="cwm-pop-sat" src="${gibsSnapshotUrl(p.lat, p.lng, date)}" alt="NASA satellite view of ${p.name}" loading="lazy" onerror="this.style.display='none'" />
    <div class="cwm-pop-body">
      <h3 class="cwm-pop-title">${p.name}, ${p.country}</h3>
      ${p.blurb ? `<p class="cwm-pop-blurb">${p.blurb}</p>` : ''}
      <p class="cwm-pop-wx">${wx}</p>
      <p class="cwm-pop-credit">Satellite: NASA GIBS, ${date}</p>
    </div>
  </div>`;
}

export default function ComicWorldMap() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const fillRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    let disposed = false;
    import('leaflet').then((mod) => {
      const L = mod.default;
      if (disposed || !elRef.current || mapRef.current) return;
      const dark = document.documentElement.classList.contains('dark');
      const worldBounds = L.latLngBounds([[-58, -179], [80, 179]]);
      const map = L.map(elRef.current, {
        worldCopyJump: false,
        maxZoom: 18,
        zoomSnap: 0,
        maxBounds: worldBounds,
        maxBoundsViscosity: 1.0,
        attributionControl: false,
      });

      const base = dark ? 'dark_nolabels' : 'light_nolabels';
      L.tileLayer(`https://{s}.basemaps.cartocdn.com/${base}/{z}/{x}/{y}{r}.png`, {
        subdomains: 'abcd',
        maxZoom: 19,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
      }).addTo(map);

      const icon = L.divIcon({ className: 'cwm-pin-icon', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
      places.forEach((p) => {
        const m = L.marker([p.lat, p.lng], { icon, title: `${p.name}, ${p.country}` }).addTo(map);
        m.bindPopup(popupHtml(p, 'Loading live weather...'), { maxWidth: 280, minWidth: 220, className: 'cwm-pop-wrap', autoPanPadding: [24, 24] });
        m.on('popupopen', () => {
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`)
            .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
            .then((d) => {
              const c = d.current;
              const wx = `Right now: ${Math.round(c.temperature_2m)}C, ${weatherLabel(c.weather_code)}, wind ${Math.round(c.wind_speed_10m)} km/h`;
              if (m.isPopupOpen()) m.setPopupContent(popupHtml(p, wx));
            })
            .catch(() => { if (m.isPopupOpen()) m.setPopupContent(popupHtml(p, 'Weather unavailable right now.')); });
        });
      });

      // fill the frame exactly (cover): no empty border, no world duplicates
      const fill = () => {
        map.invalidateSize();
        map.setMinZoom(0);
        // cover-fill: zoom so tiles fill both axes (no letterbox band)
        const z = map.getBoundsZoom(worldBounds, true);
        map.setView(worldBounds.getCenter(), z, { animate: false });
        map.setMinZoom(z);
      };
      mapRef.current = map;
      fillRef.current = fill;
      setTimeout(fill, 60);
      window.addEventListener('resize', fill);
    });
    return () => {
      disposed = true;
      if (fillRef.current) window.removeEventListener('resize', fillRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  return (
    <div className="cwm-wrap">
      <div className="cwm-map">
        <div ref={elRef} className="cwm-leaflet" />
      </div>
    </div>
  );
}
