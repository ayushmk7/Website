// src/components/v2/ComicWorldMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import { places } from '../../data/places';
import { projectLatLng, gibsSnapshotUrl, weatherLabel, yesterdayUTC } from '../../lib/geo';

interface Weather { temp: number; label: string; wind: number }
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const MIN_SCALE = 1;
const MAX_SCALE = 8;
const VW = 1000, VH = 500; // svg viewBox, 2:1 equirectangular

// equirectangular: lon/lat -> viewBox units (same math as projectLatLng, scaled to viewBox)
const sx = (lng: number) => ((lng + 180) / 360) * VW;
const sy = (lat: number) => ((90 - lat) / 180) * VH;
function ringPath(ring: number[][]): string {
  return ring.map((c, i) => `${i ? 'L' : 'M'}${sx(c[0]).toFixed(1)} ${sy(c[1]).toFixed(1)}`).join(' ') + 'Z';
}
function featurePath(geom: any): string {
  if (!geom) return '';
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  return polys.map((poly: number[][][]) => poly.map(ringPath).join(' ')).join(' ');
}

export default function ComicWorldMap() {
  const [paths, setPaths] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [expanded, setExpanded] = useState(false);

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

  // load real country geometry once
  useEffect(() => {
    let cancelled = false;
    fetch('/world.geojson')
      .then((r) => r.json())
      .then((g) => { if (!cancelled) setPaths(g.features.map((f: any) => featurePath(f.geometry))); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { tyRef.current = ty; }, [ty]);

  const clampPan = (nx: number, ny: number, s: number) => {
    const el = wrapRef.current;
    if (!el) return { x: nx, y: ny };
    const w = el.clientWidth, h = el.clientHeight;
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
  }, [expanded]);

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
      const rect = wrapRef.current!.getBoundingClientRect();
      const cx = (a.x + b.x) / 2 - rect.left, cy = (a.y + b.y) / 2 - rect.top;
      const target = clamp(pinchStart.current.scale * (dist / pinchStart.current.dist), MIN_SCALE, MAX_SCALE);
      zoomAt(cx, cy, target / scale);
      movedRef.current = true;
      return;
    }
    if (drag.current) {
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
      const c = clampPan(drag.current.tx + dx, drag.current.ty + dy, scale);
      setTx(c.x); setTy(c.y);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const reset = () => { setScale(1); setTx(0); setTy(0); };
  const zoomBtn = (f: number) => { const el = wrapRef.current; if (el) zoomAt(el.clientWidth / 2, el.clientHeight / 2, f); };
  const onMapClick = () => { if (!movedRef.current && !expanded) setExpanded(true); };

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

  const mapInner = (
    <div ref={wrapRef} className="cwm-map" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClick={onMapClick}>
      <div className="cwm-stage" style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}>
        <svg className="cwm-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-label="World map">
          {paths.map((d, i) => <path key={i} d={d} className="cwm-land" />)}
        </svg>
        <div className="cwm-halftone" aria-hidden="true" />
        {places.map((p, i) => {
          const { x, y } = projectLatLng(p.lat, p.lng);
          return (
            <button key={p.name} className={`cwm-pin${selected === i ? ' is-active' : ''}`} style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${1 / scale})` }} aria-label={`${p.name}, ${p.country}`} onClick={(e) => { e.stopPropagation(); if (!movedRef.current) setSelected(i); }}>
              <span className="cwm-pin-dot" aria-hidden="true" />
              <span className="cwm-pin-label">{p.name}</span>
            </button>
          );
        })}
      </div>
      <div className="cwm-zoom">
        <button className="cwm-zoom-btn" aria-label="Zoom in" onClick={(e) => { e.stopPropagation(); zoomBtn(1.4); }}>+</button>
        <button className="cwm-zoom-btn" aria-label="Zoom out" onClick={(e) => { e.stopPropagation(); zoomBtn(0.71); }}>-</button>
        <button className="cwm-zoom-btn" aria-label="Reset map" onClick={(e) => { e.stopPropagation(); reset(); }}>o</button>
        <button className="cwm-zoom-btn" aria-label={expanded ? 'Shrink map' : 'Expand map'} onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>{expanded ? '><' : '<>'}</button>
      </div>
    </div>
  );

  return (
    <div className="cwm-wrap">
      {expanded ? (
        <div className="cwm-overlay" onClick={() => setExpanded(false)}>
          <div className="cwm-overlay-inner" onClick={(e) => e.stopPropagation()}>{mapInner}</div>
        </div>
      ) : mapInner}

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
