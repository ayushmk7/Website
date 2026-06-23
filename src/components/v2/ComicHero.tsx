import React, { useState } from 'react';

const GH = 'https://github.com/ayushmk7';
const LI = 'https://www.linkedin.com/in/ayushmk';
const RESUME = '/AyushMadhavResume.pdf';
const role = 'CS and Math @UMichigan';

const githubSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);
const linkedinSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);

export default function ComicHero() {
  const [open, setOpen] = useState(false);
  return (
    <section className="comic-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex flex-col items-center text-center px-6 w-full" style={{ gap: 'clamp(0.5rem,1.8vh,1.1rem)' }}>
        <button type="button" className="panel" onClick={() => setOpen(true)} aria-label="Expand photo" style={{ padding: '0.4rem', cursor: 'zoom-in', background: 'var(--surface)' }}>
          <div className="comic-hero-photo" style={{ position: 'relative', display: 'grid', placeItems: 'center', fontWeight: 800, overflow: 'hidden', background: 'var(--surface)', width: 'clamp(9rem,24vmin,14rem)' }}>
            AK
            <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
        </button>

        {open && (
          <div className="comic-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'grid', placeItems: 'center', padding: 'clamp(1rem,3vw,2rem)', background: 'rgba(0,0,0,0.72)', cursor: 'zoom-out' }}>
            <div className="panel" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', padding: '0.5rem', background: 'var(--surface)' }}>
              <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ display: 'block', width: 'auto', height: 'auto', maxHeight: '82vh', maxWidth: '88vw', borderRadius: '2px' }} />
              <button type="button" className="comic-link-btn" onClick={() => setOpen(false)} aria-label="Close" style={{ position: 'absolute', top: '-0.9rem', right: '-0.9rem', width: '2.4rem', height: '2.4rem', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>X</button>
            </div>
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '2px var(--outline)', paintOrder: 'stroke fill', color: 'var(--accent)', fontSize: 'clamp(2.6rem,10vw,7.5rem)', lineHeight: 1, width: '100%', maxWidth: '20ch', padding: '0 0.5rem', overflowWrap: 'break-word' }}>Ayush Madhav Kumar</h1>

        <div className="bubble" style={{ padding: '0.45rem 1.2rem' }}><p style={{ fontWeight: 800, fontSize: 'clamp(0.85rem,2.2vw,1.1rem)' }}>{role}</p></div>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: '0.02em' }}>&gt; NSF-backed research</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a className="panel panel--burst" href={RESUME} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-display)', background: 'var(--accent-2)', color: '#141414', height: '2.7rem', margin: 0, padding: '0 1.4rem', fontSize: '1.35rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 var(--panel-shadow)' }}>Résumé</a>
          <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" style={{ width: '2.7rem', height: '2.7rem', margin: 0, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{githubSvg}</a>
          <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" style={{ width: '2.7rem', height: '2.7rem', margin: 0, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{linkedinSvg}</a>
        </div>
      </div>
    </section>
  );
}
