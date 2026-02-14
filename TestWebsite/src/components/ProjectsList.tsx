import React, { useState, useEffect } from 'react';
import { projects } from '../data/projects';
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

function getProjectsPerRow() {
  if (typeof window === 'undefined') return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3; // lg
  if (w >= 768) return 2;  // md
  return 1;                 // default
}

export default function ProjectsList() {
  const [showAll, setShowAll] = useState(false);
  const [perRow, setPerRow] = useState(3);
  useEffect(() => {
    const update = () => setPerRow(getProjectsPerRow());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const initialCount = perRow;
  const displayedProjects = showAll ? projects : projects.slice(0, initialCount);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProjects.map((project, index) => (
          <div 
            key={index}
            className="border-2 border-foreground rounded-2xl p-6 hover:border-blue-600 transition-colors duration-200 relative group flex flex-col bg-background"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-foreground hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200"
                  aria-label={`Visit ${project.title} website`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-foreground hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

            <h3 className="text-xl font-bold mb-3 pr-20">{project.title}</h3>
            <p className="text-muted-foreground mb-6 flex-grow">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="px-3 py-1 text-sm rounded-full border border-foreground bg-background font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="group flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-foreground bg-background hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 text-lg font-medium"
        >
          {showAll ? (
            <>
              Show Less
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </>
          ) : (
            <>
              Show More Projects
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
