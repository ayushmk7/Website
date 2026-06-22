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
