// src/lib/themes.ts
export interface ThemeDef {
  key: string;
  name: string;
  route: string;       // where the dock links
  fontHrefs: string[]; // Google Fonts hrefs injected by ThemeLayout
}

export const THEMES: ThemeDef[] = [
  { key: 'current',   name: 'Current',   route: '/v2',           fontHrefs: [] },
  { key: 'blueprint', name: 'Blueprint', route: '/v2/blueprint', fontHrefs: ['https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap'] },
  { key: 'terminal',  name: 'Phosphor',  route: '/v2/terminal',  fontHrefs: ['https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap'] },
  { key: 'editorial', name: 'Editorial', route: '/v2/editorial', fontHrefs: ['https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,900&family=Source+Sans+3:wght@300;600&display=swap'] },
  { key: 'brutal',    name: 'Brutalist', route: '/v2/brutal',    fontHrefs: ['https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@300;800;900&display=swap'] },
  { key: 'riso',      name: 'Risograph', route: '/v2/riso',      fontHrefs: ['https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;800&family=Space+Grotesk:wght@500;700&display=swap'] },
  { key: 'outrun',    name: 'Outrun',    route: '/v2/outrun',    fontHrefs: ['https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&family=Rajdhani:wght@300;600&display=swap'] },
  { key: 'aurora',    name: 'Aurora',    route: '/v2/aurora',    fontHrefs: ['https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Inter:wght@200;500&display=swap'] },
  { key: 'bauhaus',   name: 'Bauhaus',   route: '/v2/bauhaus',   fontHrefs: ['https://fonts.googleapis.com/css2?family=Jost:wght@300;500;700&display=swap'] },
  { key: 'comic',     name: 'Comic Pop', route: '/v2/comic',     fontHrefs: ['https://fonts.googleapis.com/css2?family=Bangers&family=Nunito+Sans:wght@300;800&display=swap'] },
  { key: 'deco',      name: 'Art Deco',  route: '/v2/deco',      fontHrefs: ['https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Jost:wght@300;500&display=swap'] },
  { key: 'memphis',   name: 'Memphis',   route: '/v2/memphis',   fontHrefs: ['https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Poppins:wght@300;800&display=swap'] },
  { key: 'swiss',     name: 'Swiss',     route: '/v2/swiss',     fontHrefs: ['https://fonts.googleapis.com/css2?family=Archivo:wght@300;500;900&display=swap'] },
];

export const themeByKey = (k: string) => THEMES.find((t) => t.key === k);
