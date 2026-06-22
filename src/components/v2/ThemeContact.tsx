import * as React from 'react';
import { Copy, Check } from 'lucide-react';

// Theme-aware contact line: email + copy-to-clipboard. Styled via CSS vars so
// it adapts to every theme. Drop into each theme's #contact footer.
export function ThemeContact() {
  const [copied, setCopied] = React.useState(false);
  const email = 'contactayushmadhav@gmail.com';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      <a
        href={`mailto:${email}`}
        className="underline underline-offset-4 break-all"
        style={{ color: 'var(--accent)' }}
      >
        {email}
      </a>
      <button
        onClick={copy}
        aria-label={copied ? 'Email copied' : 'Copy email'}
        title={copied ? 'Copied' : 'Copy email'}
        className="p-2 rounded-lg border transition-colors shrink-0"
        style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
