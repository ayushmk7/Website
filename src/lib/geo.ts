// Equirectangular projection -> percent position on a 2:1 world map.
// x: 0% at -180 lng, 100% at +180 lng. y: 0% at +90 lat (north), 100% at -90 lat (south).
export function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  };
}

// One UTC day back, YYYY-MM-DD. GIBS imagery for "today" is often not yet processed.
export function yesterdayUTC(): string {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// NASA GIBS Snapshot: true-color MODIS Terra image of a bbox around the point. No API key.
// BBOX order for CRS=EPSG:4326 is "minLat,minLng,maxLat,maxLng".
export function gibsSnapshotUrl(lat: number, lng: number, date: string): string {
  const pad = 6; // degrees around the point
  const minLat = Math.max(-90, lat - pad);
  const maxLat = Math.min(90, lat + pad);
  const minLng = Math.max(-180, lng - pad);
  const maxLng = Math.min(180, lng + pad);
  const bbox = `${minLat},${minLng},${maxLat},${maxLng}`;
  const params = new URLSearchParams({
    REQUEST: 'GetSnapshot',
    TIME: date,
    BBOX: bbox,
    CRS: 'EPSG:4326',
    LAYERS: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    WRAP: 'DAY',
    FORMAT: 'image/jpeg',
    WIDTH: '480',
    HEIGHT: '320',
    AUTOSCALE: 'TRUE',
  });
  return `https://wvs.earthdata.nasa.gov/api/v1/snapshot?${params.toString()}`;
}

// WMO weather interpretation codes -> short word labels (no emojis).
export function weatherLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}
