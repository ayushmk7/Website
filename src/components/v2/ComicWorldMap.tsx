// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import { places } from '../../data/places';
import { projectLatLng, gibsSnapshotUrl, weatherLabel, yesterdayUTC } from '../../lib/geo';

interface Weather { temp: number; label: string; wind: number }
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const MIN_SCALE = 1;
const MAX_SCALE = 6;

export default function ComicWorldMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const tyRef = useRef(0);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const movedRef = useRef(false);

  const place = selected === null ? null : places[selected];

  useEffect(() => { tyRef.current = ty; }, [ty]);

  const clampPan = (nx: number, ny: number, s: number) => {
    const el = wrapRef.current;
    if (!el) return { x: nx, y: ny };
    const w = el.clientWidth;
    const h = el.clientHeight;
    return { x: clamp(nx, -(s - 1) * w, 0), y: clamp(ny, -(s - 1) * h, 0) };
  };

  const zoomAt = (px: number, py: number, factor: number) => {
    setScale((prev) => {
      const ns = clamp(prev * factor, MIN_SCALE, MAX_SCALE);
      const k = ns / prev;
      setTx((ptx) => {
        const c = clampPan(px - (px - ptx) * k, py - (py - tyRef.current) * k, ns);
        setTy(c.y);
        return c.x;
      });
      return ns;
    });
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.15 : 0.87);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedRef.current = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      drag.current = null;
    } else {
      drag.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const el = wrapRef.current!;
      const rect = el.getBoundingClientRect();
      const cx = (a.x + b.x) / 2 - rect.left;
      const cy = (a.y + b.y) / 2 - rect.top;
      const target = clamp(pinchStart.current.scale * (dist / pinchStart.current.dist), MIN_SCALE, MAX_SCALE);
      zoomAt(cx, cy, target / scale);
      movedRef.current = true;
      return;
    }
    if (drag.current) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
      const c = clampPan(drag.current.tx + dx, drag.current.ty + dy, scale);
      setTx(c.x);
      setTy(c.y);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const reset = () => { setScale(1); setTx(0); setTy(0); };
  const zoomBtn = (f: number) => {
    const el = wrapRef.current;
    if (!el) return;
    zoomAt(el.clientWidth / 2, el.clientHeight / 2, f);
  };

  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setStatus('loading');
    setWeather(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
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
      <div
        ref={wrapRef}
        className="cwm-map"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="cwm-stage" style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}>
          <img src="/world-map.jpg" alt="World map" className="cwm-map-img" draggable={false} />
          <div className="cwm-halftone" aria-hidden="true" />
          {places.map((p, i) => {
            const { x, y } = projectLatLng(p.lat, p.lng);
            return (
              <button
                key={p.name}
                className={`cwm-pin${selected === i ? ' is-active' : ''}`}
                style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${1 / scale})` }}
                aria-label={`${p.name}, ${p.country}`}
                onClick={() => { if (!movedRef.current) setSelected(i); }}
              >
                <span className="cwm-pin-dot" aria-hidden="true" />
                <span className="cwm-pin-label">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="cwm-zoom">
          <button className="cwm-zoom-btn" aria-label="Zoom in" onClick={() => zoomBtn(1.4)}>+</button>
          <button className="cwm-zoom-btn" aria-label="Zoom out" onClick={() => zoomBtn(0.71)}>-</button>
          <button className="cwm-zoom-btn" aria-label="Reset map" onClick={reset}>o</button>
        </div>
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
