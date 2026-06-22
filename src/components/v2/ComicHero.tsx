import React, { useEffect, useState } from 'react';

const GH = 'https://github.com/ayushmk7';
const LI = 'https://www.linkedin.com/in/ayushmk';
const RESUME = '/AyushMadhavResume.pdf';
const role = 'CS and Math @UMichigan';

const LAYOUTS = ['stack', 'right', 'left', 'portrait', 'banner', 'mini', 'wide'] as const;
type Layout = (typeof LAYOUTS)[number];
const LABELS: Record<Layout, string> = {
  stack: 'Stack',
  right: 'Pic Right',
  left: 'Pic Left',
  portrait: 'Portrait',
  banner: 'Banner',
  mini: 'Mini Pic',
  wide: 'Wide',
};

const githubSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);
const linkedinSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);

function PhotoBox({ size = 'clamp(7rem,18vmin,10rem)', ratio = '1 / 1', round = false }: { size?: string; ratio?: string; round?: boolean }) {
  const inner: React.CSSProperties = {
    position: 'relative', display: 'grid', placeItems: 'center', fontWeight: 800, overflow: 'hidden',
    background: 'var(--surface)', width: size, aspectRatio: ratio, height: 'auto',
    ...(round ? { borderRadius: '50%' } : {}),
  };
  return (
    <div className="panel" style={{ padding: '0.4rem', ...(round ? { borderRadius: '50%' } : {}) }}>
      <div className="ch-photo-pop" style={inner}>
        AK
        <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>
    </div>
  );
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

// shared text column (left-aligned on desktop)
function TextCol({ nameSize, align = true }: { nameSize: string; align?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 ${align ? 'items-center md:items-start text-center md:text-left' : 'items-center text-center'}`}>
      <Role size="clamp(0.85rem,2vw,1.05rem)" />
      <h1 style={bangers(nameSize)}>Ayush Madhav Kumar!</h1>
      <Nsf />
      <Buttons center={!align} />
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

      {/* STACK: centered column, medium pic */}
      {layout === 'stack' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full" style={{ gap: 'clamp(0.75rem,2.2vh,1.6rem)' }}>
          <PhotoBox />
          <Role size="clamp(0.85rem,2.2vw,1.125rem)" />
          <h1 style={bangers('clamp(2.5rem,8vw,6rem)')}>Ayush Madhav Kumar!</h1>
          <Nsf />
          <Buttons />
        </div>
      )}

      {/* RIGHT: text left, big pic right */}
      {layout === 'right' && (
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-8 md:gap-12 px-6 w-full max-w-5xl">
          <div className="order-2 md:order-1"><TextCol nameSize="clamp(2.2rem,6vw,4.5rem)" /></div>
          <div className="order-1 md:order-2 mx-auto md:mx-0"><PhotoBox size="clamp(8rem,22vmin,13rem)" /></div>
        </div>
      )}

      {/* LEFT: big pic left, text right */}
      {layout === 'left' && (
        <div className="grid md:grid-cols-[auto_1fr] items-center gap-8 md:gap-12 px-6 w-full max-w-5xl">
          <div className="mx-auto md:mx-0"><PhotoBox size="clamp(8rem,22vmin,13rem)" /></div>
          <div><TextCol nameSize="clamp(2.2rem,6vw,4.5rem)" /></div>
        </div>
      )}

      {/* PORTRAIT: large tall portrait dominant, compact text */}
      {layout === 'portrait' && (
        <div className="grid md:grid-cols-[auto_1fr] items-center gap-8 md:gap-12 px-6 w-full max-w-5xl">
          <div className="mx-auto md:mx-0"><PhotoBox size="clamp(9rem,26vmin,15rem)" ratio="3 / 4" /></div>
          <div><TextCol nameSize="clamp(2rem,5.5vw,4rem)" /></div>
        </div>
      )}

      {/* BANNER: small round pic, oversized full-width name */}
      {layout === 'banner' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full max-w-5xl" style={{ gap: 'clamp(0.7rem,2vh,1.4rem)' }}>
          <PhotoBox round size="clamp(5rem,13vmin,7rem)" />
          <h1 style={bangers('clamp(3rem,12vw,8rem)')}>Ayush Madhav Kumar!</h1>
          <Role size="clamp(0.85rem,2vw,1.1rem)" />
          <Nsf />
          <Buttons />
        </div>
      )}

      {/* MINI: tiny avatar inline with role, name huge */}
      {layout === 'mini' && (
        <div className="flex flex-col justify-center items-center text-center px-6 w-full max-w-4xl" style={{ gap: 'clamp(0.7rem,2.2vh,1.4rem)' }}>
          <div className="flex items-center" style={{ gap: '0.8rem' }}>
            <PhotoBox round size="3.4rem" />
            <Role size="1rem" />
          </div>
          <h1 style={bangers('clamp(2.8rem,10vw,7rem)')}>Ayush Madhav Kumar!</h1>
          <Nsf />
          <Buttons />
        </div>
      )}

      {/* WIDE: huge left name, small pic right, role+nsf inline */}
      {layout === 'wide' && (
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 md:gap-10 px-6 w-full max-w-6xl">
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <h1 style={bangers('clamp(2.6rem,8vw,6rem)')}>Ayush Madhav Kumar!</h1>
            <div className="flex items-center flex-wrap justify-center md:justify-start" style={{ gap: '0.75rem' }}>
              <Role size="0.95rem" />
              <Nsf />
            </div>
            <Buttons center={false} />
          </div>
          <div className="order-1 md:order-2 mx-auto md:mx-0"><PhotoBox size="clamp(6rem,15vmin,8.5rem)" /></div>
        </div>
      )}
    </section>
  );
}
