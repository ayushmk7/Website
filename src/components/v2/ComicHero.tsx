import React, { useEffect, useState } from 'react';

const GH = 'https://github.com/ayushmk7';
const LI = 'https://www.linkedin.com/in/ayushmk';
const RESUME = '/AyushMadhavResume.pdf';
const role = 'CS and Math @UMichigan';

const LAYOUTS = ['stack', 'halftone', 'pow', 'stickers', 'panels', 'vertical'] as const;
type Layout = (typeof LAYOUTS)[number];
const LABELS: Record<Layout, string> = {
  stack: 'Stack',
  halftone: 'Halftone',
  pow: 'POW',
  stickers: 'Stickers',
  panels: 'Panels',
  vertical: 'Vertical',
};

const githubSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);
const linkedinSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);

function PhotoBox({ className = '', style = {}, round = false, size }: { className?: string; style?: React.CSSProperties; round?: boolean; size?: string }) {
  const inner: React.CSSProperties = {
    position: 'relative', display: 'grid', placeItems: 'center', fontWeight: 800, overflow: 'hidden',
    background: 'var(--surface)',
    ...(round ? { borderRadius: '50%' } : {}),
    ...(size ? { width: size, height: size, aspectRatio: '1 / 1' } : {}),
  };
  return (
    <div className={`panel ${className}`} style={{ padding: '0.4rem', ...(round ? { borderRadius: '50%' } : {}), ...style }}>
      <div className="comic-hero-photo ch-photo-pop" style={inner}>
        AK
        <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>
    </div>
  );
}

const bangers = (size: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: 'var(--font-display)', WebkitTextStroke: '2px var(--outline)', paintOrder: 'stroke fill',
  color: 'var(--accent)', fontSize: size, lineHeight: 1, ...extra,
});

const Nsf = ({ style = {} }: { style?: React.CSSProperties }) => (
  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: '0.02em', ...style }}>&gt; NSF-backed research</p>
);
const Role = ({ size = '1rem' }: { size?: string }) => (
  <p style={{ fontWeight: 800, fontSize: size }}>{role}</p>
);

function Buttons({ center = true }: { center?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start' }}>
      <a className="panel panel--burst" href={RESUME} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-display)', background: 'var(--accent-2)', color: '#141414', padding: '0.45rem 1.4rem', fontSize: '1.35rem', display: 'inline-block', boxShadow: '6px 6px 0 var(--panel-shadow)' }}>Résumé</a>
      <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" style={{ minWidth: 36, minHeight: 36, padding: '0.5rem' }}>{githubSvg}</a>
      <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" style={{ minWidth: 36, minHeight: 36, padding: '0.5rem' }}>{linkedinSvg}</a>
    </div>
  );
}

export default function ComicHero() {
  const [layout, setLayout] = useState<Layout>('stack');

  useEffect(() => {
    const v = localStorage.getItem('comic-hero-layout') as Layout | null;
    if (v && LAYOUTS.includes(v)) setLayout(v);
  }, []);

  const pick = (v: Layout) => {
    setLayout(v);
    localStorage.setItem('comic-hero-layout', v);
  };

  return (
    <section className="comic-hero" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* left floating layout switcher */}
      <div style={{ position: 'fixed', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {LAYOUTS.map((l) => (
          <button key={l} onClick={() => pick(l)} aria-pressed={layout === l} className="panel" style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', padding: '0.2rem 0.55rem', background: layout === l ? 'var(--accent)' : 'var(--surface)', color: layout === l ? '#fff' : 'var(--text)', boxShadow: '3px 3px 0 var(--panel-shadow)', cursor: 'pointer' }}>
            {LABELS[l]}
          </button>
        ))}
      </div>

      {/* STACK */}
      {layout === 'stack' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full" style={{ gap: 'clamp(0.75rem,2.2vh,1.6rem)' }}>
          <PhotoBox />
          <div className="bubble" style={{ padding: '0.5rem 1.25rem' }}><Role size="clamp(0.85rem,2.2vw,1.125rem)" /></div>
          <h1 style={bangers('clamp(2.5rem,8vw,6rem)')}>Ayush Madhav Kumar!</h1>
          <Nsf />
          <Buttons />
        </div>
      )}

      {/* HALFTONE: name built from ben-day dots, oversized */}
      {layout === 'halftone' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full" style={{ gap: 'clamp(0.6rem,2vh,1.4rem)' }}>
          <PhotoBox size="clamp(6rem,16vmin,9rem)" />
          <h1 className="ch-halftone-text" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,14vw,9rem)', textTransform: 'uppercase' }}>Ayush<br />Madhav Kumar</h1>
          <div className="bubble" style={{ padding: '0.45rem 1.2rem' }}><Role size="clamp(0.8rem,2vw,1.05rem)" /></div>
          <Buttons />
        </div>
      )}

      {/* POW: name inside a jagged explosion with radiating action rays */}
      {layout === 'pow' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full" style={{ gap: 'clamp(0.8rem,2.5vh,1.6rem)' }}>
          <div className="ch-rays" style={{ display: 'grid', placeItems: 'center' }}>
            <div className="ch-burst">
              <h1 style={bangers('clamp(1.6rem,5.5vw,3.4rem)', { color: '#141414', WebkitTextStroke: '0', textTransform: 'uppercase' })}>Ayush<br />Madhav<br />Kumar!</h1>
            </div>
          </div>
          <PhotoBox round size="clamp(5rem,13vmin,7rem)" />
          <div className="bubble" style={{ padding: '0.45rem 1.2rem' }}><Role size="0.95rem" /></div>
          <Buttons />
        </div>
      )}

      {/* STICKERS: scattered, rotated, overlapping sticker pieces */}
      {layout === 'stickers' && (
        <div className="flex flex-wrap items-center justify-center px-6" style={{ gap: '1rem', maxWidth: '60rem' }}>
          <div style={{ transform: 'rotate(-5deg)' }}><PhotoBox size="clamp(6rem,15vmin,8.5rem)" /></div>
          <h1 className="ch-sticker" style={{ ...bangers('clamp(2rem,6vw,4rem)'), transform: 'rotate(3deg)', padding: '0.4rem 1rem' }}>Ayush Madhav Kumar!</h1>
          <div className="ch-sticker" style={{ transform: 'rotate(-3deg)', background: 'var(--accent-2)', color: '#141414' }}><Role size="1rem" /></div>
          <div className="ch-sticker" style={{ transform: 'rotate(4deg)' }}><Nsf /></div>
          <div style={{ transform: 'rotate(-2deg)' }}><Buttons /></div>
        </div>
      )}

      {/* PANELS: a real 2x2 comic page with gutters + numbered captions */}
      {layout === 'panels' && (
        <div className="ch-page px-4 mx-auto" style={{ maxWidth: '54rem', maxHeight: '74vh' }}>
          <div className="ch-cell"><span className="ch-cap">1</span><PhotoBox size="clamp(5rem,14vmin,8rem)" style={{ boxShadow: 'none', border: 'none', margin: 0 }} /></div>
          <div className="ch-cell"><span className="ch-cap">2</span><h1 style={bangers('clamp(1.6rem,5vw,3rem)', { textTransform: 'uppercase' })}>Ayush Madhav Kumar!</h1></div>
          <div className="ch-cell"><span className="ch-cap">3</span><div className="bubble" style={{ padding: '0.5rem 1.1rem' }}><Role size="0.95rem" /></div></div>
          <div className="ch-cell" style={{ flexDirection: 'column', gap: '0.7rem' }}><span className="ch-cap">4</span><Nsf style={{ fontSize: '0.9rem' }} /><Buttons /></div>
        </div>
      )}

      {/* VERTICAL: spine lettering running down the side */}
      {layout === 'vertical' && (
        <div className="flex items-center justify-center px-6" style={{ gap: 'clamp(1rem,4vw,2.5rem)' }}>
          <h1 style={{ ...bangers('clamp(2.2rem,10vh,5.5rem)', { textTransform: 'uppercase' }), writingMode: 'vertical-rl' as React.CSSProperties['writingMode'] }}>Ayush Kumar</h1>
          <div className="flex flex-col items-start" style={{ gap: '0.9rem' }}>
            <PhotoBox size="clamp(6rem,16vmin,9rem)" />
            <div className="bubble" style={{ padding: '0.5rem 1.2rem' }}><Role size="1rem" /></div>
            <Nsf />
            <Buttons center={false} />
          </div>
        </div>
      )}
    </section>
  );
}
