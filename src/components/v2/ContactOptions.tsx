import * as React from 'react';
import { Mail, Github, Linkedin, Copy, Check, ArrowUpRight } from 'lucide-react';

const EMAIL = 'contactayushmadhav@gmail.com';
const GH = 'https://github.com/ayushmk7';
const LI = 'https://www.linkedin.com/in/ayushmk';
const RESUME = '/AyushMadhavResume.pdf';

function useCopy() {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return { copied, copy };
}

/* ---------- 1. CURRENT (what ships today) ---------- */
function Current() {
  const { copied, copy } = useCopy();
  const row = { color: 'var(--accent)', minHeight: '2.5rem' } as React.CSSProperties;
  const social = [
    { Icon: Github, label: 'github.com/ayushmk7', href: GH },
    { Icon: Linkedin, label: 'linkedin.com/in/ayushmk', href: LI },
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="inline-flex items-center gap-2" style={row}>
        <Mail className="w-4 h-4 shrink-0" />
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 break-all">{EMAIL}</a>
        <button onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email'} className="inline-flex items-center justify-center rounded-md border shrink-0" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', width: '2rem', height: '2rem' }}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      {social.map(({ Icon, label, href }) => (
        <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 break-all" style={row}>
          <Icon className="w-4 h-4 shrink-0" />{label}<span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

/* ---------- 2. PROFESSIONAL (restrained card) ---------- */
function Professional() {
  const { copied, copy } = useCopy();
  return (
    <div className="panel mx-auto" style={{ maxWidth: '32rem', padding: '1.75rem 2rem', textAlign: 'left' }}>
      <p style={{ fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Get in touch</p>
      <p style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' }}>Open to software and research roles, and collaborations. Based in Ann Arbor, MI.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <a className="comic-link-btn comic-link-btn--site" href={`mailto:${EMAIL}`}><Mail className="w-4 h-4" />Email me</a>
        <button className="comic-link-btn" onClick={copy}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy address'}</button>
        <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" />GitHub</a>
        <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4" />LinkedIn</a>
      </div>
    </div>
  );
}

/* ---------- 3. CASUAL (speech bubble, friendly) ---------- */
function Casual() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="bubble" style={{ padding: '1rem 1.75rem', maxWidth: '34rem' }}>
        <p style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>Got a project, an idea, or just want to talk shop? My inbox is always open.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a className="panel panel--burst" href={`mailto:${EMAIL}`} style={{ fontFamily: 'var(--font-display)', height: '2.7rem', margin: 0, padding: '0 1.4rem', fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', boxShadow: '4px 4px 0 var(--panel-shadow)' }}>Say hi</a>
        <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ width: '2.7rem', height: '2.7rem', padding: 0, justifyContent: 'center' }}><Github className="w-5 h-5" /></a>
        <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ width: '2.7rem', height: '2.7rem', padding: 0, justifyContent: 'center' }}><Linkedin className="w-5 h-5" /></a>
      </div>
    </div>
  );
}

/* ---------- 4. LOUD ON-THEME (max comic) ---------- */
function Loud() {
  const { copied, copy } = useCopy();
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '2px var(--outline)', paintOrder: 'stroke fill', color: 'var(--accent-2)', fontSize: 'clamp(2.5rem,8vw,5rem)', lineHeight: 0.95 }}>Let's talk!</h3>
      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: '0.02em' }}>&gt; drop a line, get a reply</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
        <a className="burst-btn" href={`mailto:${EMAIL}`}>Email</a>
        <button className="comic-link-btn" onClick={copy} style={{ height: '2.7rem' }}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : EMAIL}</button>
      </div>
      <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.25rem' }}>
        <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ width: '2.7rem', height: '2.7rem', padding: 0, justifyContent: 'center' }}><Github className="w-5 h-5" /></a>
        <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ width: '2.7rem', height: '2.7rem', padding: 0, justifyContent: 'center' }}><Linkedin className="w-5 h-5" /></a>
      </div>
    </div>
  );
}

/* ---------- 5. MINIMAL (one line) ---------- */
function Minimal() {
  return (
    <div className="flex flex-col items-center gap-3">
      <a href={`mailto:${EMAIL}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '3px' }}>{EMAIL}</a>
      <div style={{ display: 'flex', gap: '1.25rem', fontWeight: 800 }}>
        <a href={GH} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: 'var(--text)' }}>GitHub</a>
        <a href={LI} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: 'var(--text)' }}>LinkedIn</a>
      </div>
    </div>
  );
}

/* ---------- 6. CARD GRID (three tiles) ---------- */
function CardGrid() {
  const cards = [
    { Icon: Mail, label: 'Email', value: 'Say hello', href: `mailto:${EMAIL}` },
    { Icon: Github, label: 'GitHub', value: 'ayushmk7', href: GH },
    { Icon: Linkedin, label: 'LinkedIn', value: 'ayushmk', href: LI },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-5 mx-auto" style={{ maxWidth: '46rem' }}>
      {cards.map(({ Icon, label, value, href }) => (
        <a key={href} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" className="panel flex flex-col items-start" style={{ padding: '1.25rem 1.4rem', textDecoration: 'none', color: 'var(--text)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.4rem', height: '2.4rem', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: '2px solid var(--outline)', marginBottom: '0.75rem' }}><Icon className="w-5 h-5" /></span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--comic-blue)' }}>{label}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.85rem' }}>{value}<ArrowUpRight className="w-3.5 h-3.5" /></span>
        </a>
      ))}
    </div>
  );
}

/* ---------- 7. CTA BANNER (full-width burst) ---------- */
function Banner() {
  return (
    <div className="panel panel--burst mx-auto" style={{ maxWidth: '50rem', padding: 'clamp(1.5rem,4vw,2.5rem)', textAlign: 'center' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,5vw,3rem)', lineHeight: 1, marginBottom: '0.5rem', color: 'var(--burst-text)' }}>Hiring, or building something?</h3>
      <p style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--burst-text)' }}>I am open to roles and collaborations. Let us make it happen.</p>
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a className="comic-link-btn" href={`mailto:${EMAIL}`} style={{ height: '2.7rem' }}><Mail className="w-4 h-4" />Email me</a>
        <a className="comic-link-btn" href={GH} target="_blank" rel="noopener noreferrer" style={{ height: '2.7rem' }}><Github className="w-4 h-4" />GitHub</a>
        <a className="comic-link-btn" href={LI} target="_blank" rel="noopener noreferrer" style={{ height: '2.7rem' }}><Linkedin className="w-4 h-4" />LinkedIn</a>
        <a className="comic-link-btn" href={RESUME} target="_blank" rel="noopener noreferrer" style={{ height: '2.7rem' }}>Résumé</a>
      </div>
    </div>
  );
}

const OPTIONS = [
  { key: 'current', name: 'Current', blurb: 'What ships today: email + social links with arrows.', render: Current },
  { key: 'professional', name: 'Professional', blurb: 'Restrained card, clear CTA, location. Recruiter-friendly.', render: Professional },
  { key: 'casual', name: 'Casual', blurb: 'Friendly speech bubble, warm copy.', render: Casual },
  { key: 'loud', name: 'Loud (on-theme)', blurb: 'Max comic energy: giant headline + starburst button.', render: Loud },
  { key: 'minimal', name: 'Minimal', blurb: 'One big email link, nothing else.', render: Minimal },
  { key: 'cards', name: 'Card grid', blurb: 'Three tappable tiles: Email, GitHub, LinkedIn.', render: CardGrid },
  { key: 'banner', name: 'CTA banner', blurb: 'Full-width red call-to-action panel.', render: Banner },
];

export default function ContactOptions() {
  const [sel, setSel] = React.useState('current');
  const active = OPTIONS.find((o) => o.key === sel) || OPTIONS[0];
  const Render = active.render;
  return (
    <div className="co-shell">
      <aside className="co-side">
        <p className="co-side-title">Contact styles</p>
        {OPTIONS.map((o, i) => (
          <button key={o.key} onClick={() => setSel(o.key)} className={`co-side-btn${o.key === sel ? ' co-side-btn--active' : ''}`}>
            <span className="co-side-num">{i + 1}</span>
            <span>
              <span className="co-side-name">{o.name}</span>
              <span className="co-side-blurb">{o.blurb}</span>
            </span>
          </button>
        ))}
      </aside>
      <div className="co-stage">
        <Render />
      </div>
    </div>
  );
}
