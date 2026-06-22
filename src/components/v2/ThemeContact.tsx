import * as React from 'react';
import { Mail, Github, Linkedin, Copy, Check } from 'lucide-react';

// Theme-aware contact block. Email copies to clipboard; GitHub/LinkedIn open out.
const email = 'contactayushmadhav@gmail.com';
const social = [
  { icon: Github, label: 'github.com/ayushmk7', href: 'https://github.com/ayushmk7' },
  { icon: Linkedin, label: 'linkedin.com/in/ayushmk', href: 'https://www.linkedin.com/in/ayushmk' },
];

export function ThemeContact() {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const rowStyle = { color: 'var(--accent)', minHeight: '2.5rem' } as React.CSSProperties;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="inline-flex items-center gap-2" style={rowStyle}>
        <Mail className="w-4 h-4 shrink-0" />
        <a href={`mailto:${email}`} className="underline underline-offset-4 break-all">{email}</a>
        <button
          onClick={copy}
          aria-label={copied ? 'Email copied' : 'Copy email'}
          title={copied ? 'Copied' : 'Copy email'}
          className="inline-flex items-center justify-center rounded-md border shrink-0"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)', width: '2rem', height: '2rem' }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {social.map(({ icon: Icon, label, href }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 underline underline-offset-4 break-all"
          style={rowStyle}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
