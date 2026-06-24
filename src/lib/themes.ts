// src/lib/themes.ts
export interface ThemeDef {
  key: string;
  name: string;
  fontHrefs: string[]; // Google Fonts hrefs injected by ThemeLayout
}

export const THEMES: ThemeDef[] = [
  { key: 'comic', name: 'Comic Pop', fontHrefs: ['https://fonts.googleapis.com/css2?family=Bangers&family=Nunito+Sans:wght@300;800&display=swap'] },
];

export const themeByKey = (k: string) => THEMES.find((t) => t.key === k);
