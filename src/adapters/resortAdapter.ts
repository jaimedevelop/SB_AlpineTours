// src/adapters/resortAdapter.ts
import { Resort } from '../types/types';

// Interface for the resort data as it comes from Firebase
interface FirebaseResort {
  id?: string;
  name: string;
  state: string;
  latitude?: number | string;
  longitude?: number | string;
  region?: string;
  fullDayTicket?: string;
  halfDayTicket?: string;
  green?: string;
  blue?: string;
  doubleBlue?: string;
  black?: string;
  doubleBlack?: string;
  nightSkiing?: boolean;
  terrainPark?: string;
  backcountry?: boolean;
  snowTubing?: boolean;
  iceSkating?: boolean;
  description?: string;
  // There may be more fields but these are the ones we know about
}

// Default image URLs for resorts if none are provided
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256',
  'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
  'https://images.unsplash.com/photo-1520962880247-cfaf541c8724'
];

// State abbreviation to full name mapping
const stateAbbreviations: Record<string, string> = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'DC': 'District of Columbia',
  'PR': 'Puerto Rico',
  'VI': 'U.S. Virgin Islands',
  'BC': 'British Columbia',
  'AB': 'Alberta',
  'ON': 'Ontario',
  'QC': 'Quebec'
};

/**
 * Converts a state abbreviation to its full name
 * @param abbreviation The state abbreviation (e.g., "NY")
 * @returns The full state name (e.g., "New York") or the original input if no match is found
 */
const getFullStateName = (abbreviation: string): string => {
  if (!abbreviation) return '';
  
  // Normalize the abbreviation to uppercase for consistent lookup
  const normalizedAbbr = abbreviation.trim().toUpperCase();
  
  // Return the full name if found, otherwise return the original value
  return stateAbbreviations[normalizedAbbr] || abbreviation;
};

/**
 * Adapts a resort from Firebase to our application's Resort type
 */
export const adaptResort = (firebaseResort: FirebaseResort, key?: string): Resort => {
  // Extract ticket cost from fullDayTicket string (e.g. "$89.99" → 89.99)
  const ticketCost = firebaseResort.fullDayTicket 
    ? parseFloat(firebaseResort.fullDayTicket.replace(/[^0-9.]/g, '')) 
    : undefined;

  // Calculate total number of runs based on difficulty percentages
  // This is just an estimate since we don't have the actual number
  const totalRunsEstimate = Math.floor(Math.random() * 30) + 20; // Placeholder

  // Generate a unique ID if not provided
  const id = firebaseResort.id || key || `resort-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Calculate a placeholder match percentage
  const matchPercentage = Math.floor(Math.random() * 30) + 70; // Placeholder between 70-100%

  // Convert string coordinates to numbers if needed
  const latitude = typeof firebaseResort.latitude === 'string' 
    ? parseFloat(firebaseResort.latitude) 
    : firebaseResort.latitude;
  
  const longitude = typeof firebaseResort.longitude === 'string' 
    ? parseFloat(firebaseResort.longitude) 
    : firebaseResort.longitude;

  // Default weather data - to be replaced with actual API data
  const defaultWeather = {
    temperature: Math.floor(Math.random() * 10) - 5, // Random temp between -5 and 5°C
    condition: ['Snowing', 'Clear', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 4)],
    snowfall: Math.floor(Math.random() * 20)
  };

  // Generate random image URLs or use defaults
  const imageUrl = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  const images = [imageUrl, ...DEFAULT_IMAGES.filter(img => img !== imageUrl).slice(0, 2)];

  // Convert state abbreviation to full name
  const fullStateName = getFullStateName(firebaseResort.state);

  return {
    // Common identifiers
    id,
    name: firebaseResort.name,
    
    // Location information
    state: fullStateName,
    region: firebaseResort.region,
    latitude,
    longitude,
    
    // Images
    imageUrl,
    images,
    
    // Resort statistics
    elevation: Math.floor(Math.random() * 2000) + 1000, // Random elevation between 1000-3000m
    runs: totalRunsEstimate,
    rating: Math.floor(Math.random() * 10) / 10 + 4, // Random rating between 4.0-5.0
    isOpen: true, // Default to open
    
    // Pricing
    ticketCost,
    fullDayTicket: firebaseResort.fullDayTicket,
    halfDayTicket: firebaseResort.halfDayTicket,
    
    // Run difficulty percentages - directly map from Firebase data
    green: firebaseResort.green || undefined,
    blue: firebaseResort.blue || undefined,
    doubleBlue: firebaseResort.doubleBlue || undefined,
    black: firebaseResort.black || undefined,
    doubleBlack: firebaseResort.doubleBlack || undefined,
    
    // Additional features - directly map from Firebase data
    terrainPark: firebaseResort.terrainPark,
    backcountry: firebaseResort.backcountry || null,
    snowTubing: firebaseResort.snowTubing || null,
    iceSkating: firebaseResort.iceSkating || null,
    nightSkiing: firebaseResort.nightSkiing || null,
    
    // Personalization
    matchPercentage,
    description: firebaseResort.description,
    
    // Weather information
    weather: defaultWeather
  };
};

/**
 * Adapts an array of Firebase resorts to our application's Resort type
 */
export const adaptResorts = (firebaseResorts: Record<string, FirebaseResort>): Resort[] => {
  return Object.entries(firebaseResorts).map(([key, resort]) => adaptResort(resort, key));
};