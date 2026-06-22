import React, { useState } from 'react';
import { projects } from '../../data/projects';
import { hackathons } from '../../data/v2';
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

// Hackathon builds live in the Hackathons section; keep them out of Projects so nothing overlaps.
const hackathonProjects = new Set(hackathons.map((h) => h.project));
const list = projects.filter((p) => !hackathonProjects.has(p.title));

export default function ProjectsV2() {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? list : list.slice(0, 6);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <div
            key={p.title}
            className="flex flex-col rounded-2xl border-2 border-black dark:border-white bg-background p-6 hover:border-blue-600 dark:hover:border-blue-500 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <div className="flex gap-2 shrink-0">
                {p.websiteUrl && (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-foreground hover:bg-blue-600 hover:border-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
                    aria-label={`Visit ${p.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-foreground hover:bg-blue-600 hover:border-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
                    aria-label={`${p.title} on GitHub`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="text-foreground/75 text-sm leading-relaxed flex-grow">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {p.tags.map((t) => (
                <span key={t} className="px-3 py-1 text-xs rounded-full border border-foreground font-mono">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {list.length > 6 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-black dark:border-white bg-background hover:bg-blue-600 hover:border-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors duration-200 font-medium"
          >
            {showAll ? <>Show less <ChevronUp className="w-5 h-5" /></> : <>Show all {list.length} <ChevronDown className="w-5 h-5" /></>}
          </button>
        </div>
      )}
    </div>
  );
}
