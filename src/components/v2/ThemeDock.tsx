// src/components/v2/ThemeDock.tsx
import * as React from 'react';
import { THEMES } from '../../lib/themes';

export function ThemeDock({ current }: { current: string }) {
  const go = (route: string, key: string) => {
    try { localStorage.setItem('v2-theme', key); } catch {}
    if (route !== window.location.pathname) window.location.href = route;
  };
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] overflow-x-auto">
      <div className="flex items-center gap-1 rounded-full border border-current/20 bg-[var(--surface)]/80 backdrop-blur-md px-2 py-1.5 shadow-lg">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => go(t.route, t.key)}
            aria-current={t.key === current}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${
              t.key === current ? 'bg-[var(--accent)] text-[var(--bg)]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
