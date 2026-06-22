import * as React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

// Theme-aware contact block: mail, GitHub, LinkedIn as one unified set of links.
// Styled via CSS vars so it adapts to every theme.
const links = [
  { icon: Mail, label: 'contactayushmadhav@gmail.com', href: 'mailto:contactayushmadhav@gmail.com' },
  { icon: Github, label: 'github.com/ayushmk7', href: 'https://github.com/ayushmk7' },
  { icon: Linkedin, label: 'linkedin.com/in/ayushmk', href: 'https://www.linkedin.com/in/ayushmk' },
];

export function ThemeContact() {
  return (
    <div className="flex flex-col items-center gap-3">
      {links.map(({ icon: Icon, label, href }) => {
        const external = href.startsWith('http');
        return (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center gap-2 underline underline-offset-4 break-all"
            style={{ color: 'var(--accent)', minHeight: '2.5rem' }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            <span aria-hidden="true">↗</span>
          </a>
        );
      })}
    </div>
  );
}
