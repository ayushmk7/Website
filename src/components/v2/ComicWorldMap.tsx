// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { places } from '../../data/places';
import { gibsSnapshotUrl, weatherLabel, yesterdayUTC } from '../../lib/geo';

interface Weather { temp: number; label: string; wind: number }

export default function ComicWorldMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [expanded, setExpanded] = useState(false);

  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const place = selected === null ? null : places[selected];

  // init the real map once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const dark = document.documentElement.classList.contains('dark');
    const map = L.map(elRef.current, { worldCopyJump: true, minZoom: 1, maxZoom: 18 }).setView([25, -30], 2);
    const tiles = dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tiles, { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(map);

    const icon = L.divIcon({ className: 'cwm-pin-icon', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
    places.forEach((p, i) => {
      L.marker([p.lat, p.lng], { icon, title: `${p.name}, ${p.country}`, keyboard: true })
        .addTo(map)
        .on('click', () => setSelected(i));
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // resize the map when toggling fullscreen
  useEffect(() => {
    const m = mapRef.current;
    if (m) setTimeout(() => m.invalidateSize(), 60);
  }, [expanded]);

  // live weather for the selected place
  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setStatus('loading'); setWeather(null);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`)
      .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then((d) => { if (cancelled) return; const c = d.current; setWeather({ temp: Math.round(c.temperature_2m), label: weatherLabel(c.weather_code), wind: Math.round(c.wind_speed_10m) }); setStatus('idle'); })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [selected]);

  const date = yesterdayUTC();

  return (
    <div className={`cwm-wrap${expanded ? ' is-expanded' : ''}`}>
      <div className="cwm-map">
        <div ref={elRef} className="cwm-leaflet" />
        <button className="cwm-expand" aria-label={expanded ? 'Shrink map' : 'Expand map'} onClick={() => setExpanded(!expanded)}>
          {expanded ? '><' : '<>'}
        </button>
      </div>

      {place && (
        <div className="cwm-panel" role="status">
          <button className="cwm-close" aria-label="Close" onClick={() => setSelected(null)}>x</button>
          <img className="cwm-sat" src={gibsSnapshotUrl(place.lat, place.lng, date)} alt={`NASA satellite view of ${place.name}`} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
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
