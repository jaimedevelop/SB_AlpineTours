export interface Resort {
  id: string;
  name: string;
  region: string;
  state: string;
  fullDayTicket: string;
  halfDayTicket: string;
  green: string;
  blue: string;
  doubleBlue: string;
  black: string;
  doubleBlack: string;
  terrainPark: string;
  latitude: string;
  longitude: string;
  description: string;
  backcountry: boolean | null;
  snowmobile: boolean | null;
  snowTubing: boolean | null;
  iceSkating: boolean | null;
  nightSkiing: boolean | null;
}