// src/services/weatherService.ts
import { Resort } from '../types/Resort';

// Test location constants
export const TEST_LOCATION = {
  latitude: 28.082176,
  longitude: -82.526208,
  name: "Test Location - Tampa, FL"
};

// API response interfaces
interface GridPointResponse {
  properties: {
    forecast: string;
    forecastHourly: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      }
    }
  }
}

interface ForecastResponse {
  properties: {
    periods: Array<{
      number: number;
      name: string;
      temperature: number;
      temperatureUnit: string;
      windSpeed: string;
      windDirection: string;
      shortForecast: string;
      detailedForecast: string;
      icon: string;
    }>
  }
}

// User agent for NWS API - required
const USER_AGENT = 'SkiResortApp/1.0 (yourwebsite.com, your@email.com)';

/**
 * Convert latitude/longitude to NWS grid points
 */
export async function getGridPoint(lat: number, lng: number): Promise<GridPointResponse> {
  const response = await fetch(
    `https://api.weather.gov/points/${lat},${lng}`,
    {
      headers: {
        "User-Agent": USER_AGENT
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get grid point: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Get forecast data using the grid point data
 */
export async function getForecast(gridData: GridPointResponse): Promise<ForecastResponse> {
  const forecastUrl = gridData.properties.forecast;
  const response = await fetch(forecastUrl, {
    headers: {
      "User-Agent": USER_AGENT
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get forecast: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Converts Fahrenheit to Celsius
 */
function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

/**
 * Get weather for a specific resort by coordinates
 */
export async function getWeatherForResort(lat: number, lng: number): Promise<Resort['weather']> {
  try {
    const gridData = await getGridPoint(lat, lng);
    const forecastData = await getForecast(gridData);
    
    // Get current period (first in the list)
    const currentPeriod = forecastData.properties.periods[0];
    
    // Convert temperature to Celsius if needed
    const tempInCelsius = currentPeriod.temperatureUnit === 'F' 
      ? fahrenheitToCelsius(currentPeriod.temperature) 
      : currentPeriod.temperature;
    
    // Map forecast to a condition string
    let condition = currentPeriod.shortForecast;
    // Determine snowfall based on forecast (simplified)
    // In a real app, you would use more sophisticated snowfall data if available
    let snowfall = 0;
    if (condition.toLowerCase().includes('snow')) {
      snowfall = 1; // Default to 1cm if snow is mentioned but no specific amount
    }
    
    return {
      temperature: tempInCelsius,
      condition: condition,
      snowfall: snowfall,
      // Additional fields
      windSpeed: currentPeriod.windSpeed,
      windDirection: currentPeriod.windDirection,
      shortForecast: currentPeriod.shortForecast,
      detailedForecast: currentPeriod.detailedForecast,
      icon: currentPeriod.icon,
    };
  } catch (error) {
    console.error("Weather data fetch error:", error);
    throw error;
  }
}

// Cache implementation to reduce API calls
const weatherCache: Record<string, {data: Resort['weather'], timestamp: number}> = {};
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Test function to fetch weather for our test location
 * Call this function to verify the API is working correctly
 */
export async function testWeatherAPI(): Promise<Resort['weather']> {
  try {
    console.log(`Testing weather API with location: ${TEST_LOCATION.name}`);
    console.log(`Coordinates: ${TEST_LOCATION.latitude}, ${TEST_LOCATION.longitude}`);
    
    const weatherData = await getWeatherForResort(TEST_LOCATION.latitude, TEST_LOCATION.longitude);
    console.log('Weather API test successful:', weatherData);
    return weatherData;
  } catch (error) {
    console.error('Weather API test failed:', error);
    throw error;
  }
}

/**
 * Get weather with caching to avoid excessive API calls
 */
export async function getCachedWeatherForResort(lat: number, lng: number): Promise<Resort['weather']> {
  const cacheKey = `${lat},${lng}`;
  const now = Date.now();
  
  // Check if we have cached data that isn't expired
  if (weatherCache[cacheKey] && (now - weatherCache[cacheKey].timestamp) < CACHE_EXPIRY) {
    return weatherCache[cacheKey].data;
  }
  
  // Fetch new data
  const weatherData = await getWeatherForResort(lat, lng);
  
  // Cache the result
  weatherCache[cacheKey] = {
    data: weatherData,
    timestamp: now
  };
  
  return weatherData;
}