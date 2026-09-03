import React, { useEffect, useRef, useState } from 'react';

const GH = 'https://github.com/ayushmk7';
const LI = 'https://www.linkedin.com/in/ayushmk';
const RESUME = '/AyushMadhavResume.pdf';
const EMAIL = 'contactayushmadhav@gmail.com';
const role = 'CS and Math @UMichigan';

const githubSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);
const linkedinSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);
const mailSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7 10-7" /></svg>
);
const copySvg = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
const checkSvg = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function ComicHero() {
  const [open, setOpen] = useState(false);
  const [imgOk, setImgOk] = useState(true); // photo loaded? gate the lightbox on it
  const [copied, setCopied] = useState(false);
  const [tip, setTip] = useState(false);
  const copiedTimer = useRef<number>();
  const tipTimer = useRef<number>();

  const showTip = () => { clearTimeout(tipTimer.current); setTip(true); };
  const hideTipDelayed = () => { clearTimeout(tipTimer.current); tipTimer.current = window.setTimeout(() => setTip(false), 2000); };

  const copyEmail = () => {
    const fallback = () => { window.location.href = 'mailto:' + EMAIL; };
    if (!navigator.clipboard?.writeText) { fallback(); return; }
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
    }).catch(fallback);
  };
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const focusables = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href],button,[tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onTab);
    // restore focus to the trigger, not document.activeElement (which a click
    // often leaves on <body> in WebKit/Firefox)
    return () => { window.removeEventListener('keydown', onTab); triggerRef.current?.focus(); };
  }, [open]);

  return (
    <section className="comic-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex flex-col items-center text-center px-6 w-full" style={{ gap: 'clamp(0.5rem,1.8vh,1.1rem)' }}>
        <button ref={triggerRef} type="button" className="panel" onClick={() => imgOk && setOpen(true)} aria-label="Expand photo" style={{ padding: '0.4rem', cursor: imgOk ? 'zoom-in' : 'default', background: 'var(--surface)' }}>
          <div className="comic-hero-photo" style={{ position: 'relative', display: 'grid', placeItems: 'center', fontWeight: 800, overflow: 'hidden', background: 'var(--surface)', width: 'clamp(9rem,24vmin,14rem)' }}>
            AK
            <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; setImgOk(false); }} />
          </div>
        </button>

        {open && (
          <div ref={dialogRef} className="comic-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'grid', placeItems: 'center', padding: 'clamp(1rem,3vw,2rem)', background: 'rgba(0,0,0,0.72)', cursor: 'zoom-out' }}>
            <div className="panel" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', padding: '0.5rem', background: 'var(--surface)' }}>
              <img src="/profile.jpg" alt="Ayush Madhav Kumar" style={{ display: 'block', width: 'auto', height: 'auto', maxHeight: '82vh', maxWidth: '88vw', borderRadius: '2px' }} />
              <button type="button" className="comic-link-btn" onClick={() => setOpen(false)} aria-label="Close" style={{ position: 'absolute', top: '-0.9rem', right: '-0.9rem', width: '2.4rem', height: '2.4rem', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>X</button>
            </div>
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '2px var(--outline)', paintOrder: 'stroke fill', color: 'var(--accent)', fontSize: 'clamp(2.6rem,10vw,7.5rem)', lineHeight: 1, width: '100%', maxWidth: '20ch', padding: '0 0.5rem', overflowWrap: 'break-word' }}>Ayush Madhav</h1>

        <div className="bubble" style={{ padding: '0.45rem 1.2rem' }}><p style={{ fontWeight: 800, fontSize: 'clamp(0.85rem,2.2vw,1.1rem)' }}>{role}</p></div>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: '0.02em' }}>&gt; NSF-backed research</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a className="panel panel--burst" href={RESUME} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-display)', background: 'var(--accent-2)', color: '#141414', height: '2.7rem', margin: 0, padding: '0 1.4rem', fontSize: '1.35rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 var(--panel-shadow)' }}>Résumé</a>
          <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" style={{ width: '2.7rem', height: '2.7rem', margin: 0, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{githubSvg}</a>
          <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" style={{ width: '2.7rem', height: '2.7rem', margin: 0, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{linkedinSvg}</a>
          <span
            style={{ position: 'relative', display: 'inline-flex' }}
            onMouseEnter={showTip}
            onMouseLeave={hideTipDelayed}
            onFocus={showTip}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hideTipDelayed(); }}
          >
            <button type="button" className="comic-link-btn" onClick={copyEmail} aria-label={`Copy email: ${EMAIL}`} style={{ width: '2.7rem', height: '2.7rem', margin: 0, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{mailSvg}</button>
            {tip && (
              // padding-bottom, not a margin/offset: keeps the hover area contiguous
              // with the button so moving the pointer into the popup doesn't close it
              <span style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: '0.55rem', zIndex: 5 }}>
                <span role="tooltip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.4rem 0.3rem 0.7rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, background: 'var(--surface)', color: 'var(--text)', border: '3px solid var(--outline)', borderRadius: '6px', boxShadow: '4px 4px 0 var(--panel-shadow)' }}>
                  <span aria-live="polite">{copied ? 'Copied to clipboard' : EMAIL}</span>
                  <button type="button" onClick={copyEmail} aria-label="Copy email address" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.6rem', height: '1.6rem', padding: 0, border: '2px solid var(--outline)', borderRadius: '4px', background: copied ? 'var(--accent)' : 'transparent', color: copied ? '#fff' : 'var(--text)', cursor: 'pointer' }}>{copied ? checkSvg : copySvg}</button>
                </span>
              </span>
            )}
          </span>
        </div>
      </div>
    </section>
  );
}
