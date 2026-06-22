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
