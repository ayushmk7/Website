import * as React from 'react';
import { Copy, Check, Github, Linkedin } from 'lucide-react';

// Theme-aware contact block: email + copy-to-clipboard + GitHub/LinkedIn.
// Styled via CSS vars so it adapts to every theme. Drop into each theme's #contact footer.
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

  const iconBtn = 'inline-flex items-center justify-center rounded-lg border transition-colors shrink-0';
  const iconStyle = { borderColor: 'var(--accent)', color: 'var(--accent)', minWidth: '2.5rem', minHeight: '2.5rem' };

  return (
    <div className="flex flex-col items-center gap-4">
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
          className={iconBtn}
          style={iconStyle}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <a
          href="https://github.com/ayushmk7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 underline underline-offset-4 break-all"
          style={{ color: 'var(--accent)' }}
        >
          <Github className="w-4 h-4 shrink-0" />
          github.com/ayushmk7 <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://www.linkedin.com/in/ayushmk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 underline underline-offset-4 break-all"
          style={{ color: 'var(--accent)' }}
        >
          <Linkedin className="w-4 h-4 shrink-0" />
          linkedin.com/in/ayushmk <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
