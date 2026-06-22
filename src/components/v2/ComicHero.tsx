import React, { useEffect, useState } from 'react';

const GH = 'https://github.com/ayushmk7';
const LI = 'https://www.linkedin.com/in/ayushmk';
const RESUME = '/AyushMadhavResume.pdf';
const role = 'CS and Math @UMichigan';

const LAYOUTS = ['stack', 'portrait', 'duo', 'overlap', 'bigstack', 'diptych', 'framed'] as const;
type Layout = (typeof LAYOUTS)[number];
const LABELS: Record<Layout, string> = {
  stack: 'Stack',
  portrait: 'Portrait',
  duo: 'Duo',
  overlap: 'Overlap',
  bigstack: 'Big Stack',
  diptych: 'Diptych',
  framed: 'Framed',
};

const githubSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);
const linkedinSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);

function PhotoBox({ size = 'clamp(7rem,18vmin,10rem)', ratio = '1 / 1', round = false, bare = false }: { size?: string; ratio?: string; round?: boolean; bare?: boolean }) {
  const inner: React.CSSProperties = {
    position: 'relative', display: 'grid', placeItems: 'center', fontWeight: 800, overflow: 'hidden',
    background: 'var(--surface)', width: size, aspectRatio: ratio, height: 'auto',
    ...(round ? { borderRadius: '50%' } : {}),
  };
  const img = (
    <div className="ch-photo-pop" style={bare ? { ...inner, border: '3px solid var(--outline)', borderRadius: round ? '50%' : '0.5rem' } : inner}>
      AK
      <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
    </div>
  );
  if (bare) return img;
  return <div className="panel" style={{ padding: '0.4rem', ...(round ? { borderRadius: '50%' } : {}) }}>{img}</div>;
}

const bangers = (size: string): React.CSSProperties => ({
  fontFamily: 'var(--font-display)', WebkitTextStroke: '2px var(--outline)', paintOrder: 'stroke fill',
  color: 'var(--accent)', fontSize: size, lineHeight: 1,
});
const Role = ({ size = '1rem' }: { size?: string }) => (
  <div className="bubble" style={{ padding: '0.45rem 1.2rem' }}><p style={{ fontWeight: 800, fontSize: size }}>{role}</p></div>
);
const Nsf = () => <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: '0.02em' }}>&gt; NSF-backed research</p>;
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
      <div style={{ position: 'fixed', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {LAYOUTS.map((l) => (
          <button key={l} onClick={() => pick(l)} aria-pressed={layout === l} className="panel" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', padding: '0.2rem 0.55rem', whiteSpace: 'nowrap', background: layout === l ? 'var(--accent)' : 'var(--surface)', color: layout === l ? '#fff' : 'var(--text)', boxShadow: '3px 3px 0 var(--panel-shadow)', cursor: 'pointer' }}>
            {LABELS[l]}
          </button>
        ))}
      </div>

      {/* STACK */}
      {layout === 'stack' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full" style={{ gap: 'clamp(0.75rem,2.2vh,1.6rem)' }}>
          <PhotoBox />
          <Role size="clamp(0.85rem,2.2vw,1.125rem)" />
          <h1 style={bangers('clamp(2.5rem,8vw,6rem)')}>Ayush Madhav Kumar!</h1>
          <Nsf />
          <Buttons />
        </div>
      )}

      {/* PORTRAIT: tall portrait left, text right */}
      {layout === 'portrait' && (
        <div className="grid md:grid-cols-[auto_1fr] items-center gap-8 md:gap-12 px-6 w-full max-w-5xl">
          <div className="mx-auto md:mx-0"><PhotoBox size="clamp(9rem,26vmin,15rem)" ratio="3 / 4" /></div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <Role size="clamp(0.85rem,2vw,1.05rem)" />
            <h1 style={bangers('clamp(2rem,5.5vw,4rem)')}>Ayush Madhav Kumar!</h1>
            <Nsf />
            <Buttons center={false} />
          </div>
        </div>
      )}

      {/* DUO: big photo + big name, equal weight side by side */}
      {layout === 'duo' && (
        <div className="grid md:grid-cols-2 items-center gap-6 md:gap-10 px-6 w-full max-w-5xl">
          <div className="order-1 mx-auto md:justify-self-end"><PhotoBox size="clamp(8rem,26vmin,14rem)" /></div>
          <div className="order-2 flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <h1 style={bangers('clamp(2.5rem,7vw,5rem)')}>Ayush Madhav Kumar!</h1>
            <Role size="clamp(0.85rem,2vw,1.05rem)" />
            <Nsf />
            <Buttons center={false} />
          </div>
        </div>
      )}

      {/* OVERLAP: name overlaps the bottom of a big photo, both dominant */}
      {layout === 'overlap' && (
        <div className="flex flex-col items-center text-center px-6 w-full" style={{ gap: '0.9rem' }}>
          <PhotoBox size="clamp(9rem,28vmin,15rem)" />
          <h1 style={{ ...bangers('clamp(2.6rem,11vw,7.5rem)'), marginTop: 'clamp(-2.5rem,-4vw,-1.2rem)', position: 'relative', zIndex: 2 }}>Ayush Madhav Kumar!</h1>
          <Role size="clamp(0.85rem,2vw,1.05rem)" />
          <Buttons />
        </div>
      )}

      {/* BIG STACK: big photo then GIANT name, both large, tight */}
      {layout === 'bigstack' && (
        <div className="flex flex-col items-center text-center px-6 w-full" style={{ gap: 'clamp(0.5rem,1.6vh,1rem)' }}>
          <PhotoBox size="clamp(9rem,24vmin,14rem)" />
          <h1 style={bangers('clamp(3rem,11vw,7.5rem)')}>Ayush Madhav Kumar!</h1>
          <Role size="clamp(0.85rem,2vw,1.05rem)" />
          <Buttons />
        </div>
      )}

      {/* DIPTYCH: two equal panels - photo | name */}
      {layout === 'diptych' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mx-auto w-full max-w-5xl" style={{ maxHeight: '74vh' }}>
          <div className="panel flex items-center justify-center" style={{ padding: '0.9rem' }}><PhotoBox size="clamp(7rem,22vmin,12rem)" bare /></div>
          <div className="panel flex flex-col items-center justify-center text-center" style={{ padding: '1.25rem', gap: '0.8rem' }}>
            <h1 style={bangers('clamp(2rem,5.5vw,3.6rem)')}>Ayush Madhav Kumar!</h1>
            <Role size="0.95rem" />
            <Nsf />
            <Buttons />
          </div>
        </div>
      )}

      {/* FRAMED: name + photo inside one big comic panel as a unit */}
      {layout === 'framed' && (
        <div className="panel flex flex-col items-center text-center mx-auto" style={{ padding: 'clamp(1.25rem,4vw,2rem)', gap: 'clamp(0.7rem,2vh,1.2rem)', maxWidth: '44rem', width: '100%' }}>
          <h1 style={bangers('clamp(2.2rem,7vw,4.5rem)')}>Ayush Madhav Kumar!</h1>
          <PhotoBox size="clamp(8rem,22vmin,12rem)" bare />
          <Role size="clamp(0.85rem,2vw,1.05rem)" />
          <Nsf />
          <Buttons />
        </div>
      )}
    </section>
  );
}
