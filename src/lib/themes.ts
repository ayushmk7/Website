// src/lib/themes.ts
export interface ThemeDef {
  key: string;
  name: string;
  route: string;       // where the dock links
  fontHrefs: string[]; // Google Fonts hrefs injected by ThemeLayout
}

export const THEMES: ThemeDef[] = [
  { key: 'current',   name: 'Current',   route: '/v2',           fontHrefs: [] },
  { key: 'comic',     name: 'Comic Pop', route: '/v2/comic',     fontHrefs: ['https://fonts.googleapis.com/css2?family=Bangers&family=Nunito+Sans:wght@300;800&display=swap'] },
];

export const themeByKey = (k: string) => THEMES.find((t) => t.key === k);
