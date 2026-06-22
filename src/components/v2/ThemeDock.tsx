// src/components/v2/ThemeDock.tsx
import * as React from 'react';
import { THEMES } from '../../lib/themes';

// Side-mounted dock: a small vertical handle on the right edge that expands
// into the theme list on hover (desktop) or tap (touch).
export function ThemeDock({ current }: { current: string }) {
  const [open, setOpen] = React.useState(false);

  const go = (route: string, key: string) => {
    try { localStorage.setItem('v2-theme', key); } catch {}
    if (route !== window.location.pathname) window.location.href = route;
  };

  return (
    <div
      className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* expanding panel (sits left of the handle) */}
      <div
        className={`flex flex-col gap-1 rounded-2xl border border-current/20 bg-[var(--surface)] backdrop-blur-md p-1.5 shadow-xl transition-all duration-300 ${
          open ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => go(t.route, t.key)}
            aria-current={t.key === current}
            className={`whitespace-nowrap text-left px-3 py-1.5 rounded-xl text-xs transition-colors ${
              t.key === current ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold' : 'opacity-70 hover:opacity-100 hover:bg-current/10'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* always-visible handle */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch theme"
        aria-expanded={open}
        className="flex flex-col items-center gap-1.5 rounded-full border border-current/20 bg-[var(--surface)] backdrop-blur-md py-3 px-1.5 shadow-lg"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        <span className="text-[10px] tracking-[0.25em] uppercase [writing-mode:vertical-rl]">Theme</span>
      </button>
    </div>
  );
}
