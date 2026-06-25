export interface Place {
  name: string;
  country: string;
  lat: number;
  lng: number;
  blurb?: string;
}

// Add a new place by appending one object here.
export const places: Place[] = [
  { name: 'Ann Arbor', country: 'USA', lat: 42.2808, lng: -83.7430, blurb: 'University of Michigan' },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Cork', country: 'Ireland', lat: 51.8985, lng: -8.4756, blurb: 'Douglas Community School' },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, blurb: 'Patch accelerator, CareTether' },
  { name: 'Ambala', country: 'India', lat: 30.3782, lng: 76.7767 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
];
