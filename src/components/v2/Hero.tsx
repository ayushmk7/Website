import React from 'react';
import { SocialLinks } from '../SocialLinks';

function Photo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative rounded-3xl border-4 border-black dark:border-white bg-background grid place-items-center font-bold shadow-lg overflow-hidden ${className}`}
    >
      AK
      <img
        src="/profile.jpg"
        alt="Ayush Madhav Kumar"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[40rem] overflow-hidden flex flex-col">
      <div className="flex-1 grid place-items-center px-4 md:px-8 pt-20 pb-16">
        {/* EDITORIAL: left-aligned name block, photo right. mobile: photo stacked above name. */}
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-14 items-center max-w-5xl w-full">
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 md:gap-4">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium tracking-wide uppercase">CS and Math at UMichigan</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-tight">Ayush Madhav Kumar</h1>
            <div className="h-px w-24 bg-foreground/30" />
            <div className="flex justify-center md:justify-start">
              <SocialLinks showThemeToggle={false} />
            </div>
            <p className="font-mono text-sm text-blue-600 dark:text-blue-400">&gt; NSF-backed research</p>
            <a
              href="/AyushMadhavResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              &gt; view résumé (pdf)
            </a>
          </div>
          <div className="order-1 md:order-2 mx-auto md:mx-0">
            {/* mobile: square. desktop: 2:3 portrait. */}
            <Photo className="h-36 w-36 sm:h-44 sm:w-44 md:h-[22rem] md:w-[14.67rem] text-4xl sm:text-5xl" />
          </div>
        </div>
      </div>

      {/* scroll-down cue */}
      <a
        href="#experience"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-opacity"
        aria-label="Scroll to experience"
      >
        <span className="text-foreground/70 text-xs tracking-widest uppercase">Scroll</span>
        <svg
          className="w-5 h-5 text-foreground/70 animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
