import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import statesData from '../../data/states.geojson?url';
import * as turf from '@turf/turf';

const REGION_COLORS = {
  East: '#4264fb',
  West: '#D7961F',
  Rocky: '#fb4242',
  Central: '#003E1F'
};

const REGION_COORDINATES = {
  East: { 
    center: [-73.5, 43.5] as [number, number],
    zoom: 5.5,
    bounds: {
      north: 47.5,
      south: 35,
      east: -67,
      west: -85
    }
  },
  West: { 
    center: [-120, 43] as [number, number],
    zoom: 4,
    bounds: {
      north: 49,
      south: 32,
      east: -110,
      west: -125
    }
  },
  Rocky: { 
    center: [-109, 43] as [number, number],
    zoom: 4,
    bounds: {
      north: 49,
      south: 31,
      east: -103,
      west: -115
    }
  },
  Central: { 
    center: [-92, 42] as [number, number],
    zoom: 4,
    bounds: {
      north: 49,
      south: 29,
      east: -85,
      west: -103
    }
  }
};

interface MapLayersProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  selectedLocationCoords: [number, number] | null;
  maxDistance: number;
  selectedRegion: string;
  hoveredRegion: string;
  activeFilter: string | null;
  onMapLoad: (event: { target: mapboxgl.Map }) => void;
}

export default function MapLayers({
  mapRef,
  selectedLocationCoords,
  maxDistance,
  selectedRegion,
  hoveredRegion,
  activeFilter,
  onMapLoad
}: MapLayersProps) {
  
  const updateDistanceCircle = () => {
  if (!mapRef.current) return;
  const map = mapRef.current;

  // Remove existing layers and sources
  if (map.getLayer('distance-fill')) map.removeLayer('distance-fill');
  if (map.getLayer('distance-border')) map.removeLayer('distance-border');
  if (map.getSource('distance-source')) map.removeSource('distance-source');

  // If no coordinates are selected, just return after cleanup
  if (!selectedLocationCoords) return;

  // Create a circle using turf.js
  const center = selectedLocationCoords;
  const radius = maxDistance * 1.609; // Convert miles to kilometers
  const options = {
    steps: 64,
    units: 'kilometers' as const
  };
  const circle = turf.circle(center, radius, options);

  // Add the circle source
  map.addSource('distance-source', {
    type: 'geojson',
    data: circle
  });

  // Add the filled circle layer
  map.addLayer({
    id: 'distance-fill',
    type: 'fill',
    source: 'distance-source',
    paint: {
      'fill-color': '#4264fb',
      'fill-opacity': 0.2
    }
  }, 'region-states-outline');

  // Add the circle border layer
  map.addLayer({
    id: 'distance-border',
    type: 'line',
    source: 'distance-source',
    paint: {
      'line-color': '#4264fb',
      'line-width': 2,
      'line-opacity': 0.8
    }
  });
};

  // Call the parent's onMapLoad and then handle our layer setup
  useEffect(() => {
    if (mapRef.current) {
      handleMapLoad({ target: mapRef.current });
    }
  }, [mapRef.current]);

  const handleMapLoad = async (event: { target: mapboxgl.Map }) => {
    const map = event.target;
    onMapLoad(event); // Call parent's handler first

    try {
      if (!map.getSource('states')) {
        const response = await fetch(statesData);
        const geoJsonData = await response.json();

        map.addSource('states', {
          type: 'geojson',
          data: geoJsonData
        });

        // Add a layer for the US mask
        map.addLayer({
          id: 'us-mask',
          type: 'fill',
          source: 'states',
          layout: {},
          paint: {
            'fill-color': '#000',
            'fill-opacity': 0
          }
        });

        // Existing region-states-fill layer
        map.addLayer({
          id: 'region-states-fill',
          type: 'fill',
          source: 'states',
          layout: {},
          paint: {
            'fill-color': [
              'match',
              ['get', 'REGION'],
              'East', REGION_COLORS.East,
              'West', REGION_COLORS.West,
              'Rocky', REGION_COLORS.Rocky,
              'Central', REGION_COLORS.Central,
              '#000000'
            ],
            'fill-opacity': [
              'case',
              ['==', ['get', 'REGION'], ''],
              0,
              0.2
            ]
          }
        });

        // Existing region-states-outline layer
        map.addLayer({
          id: 'region-states-outline',
          type: 'line',
          source: 'states',
          layout: {},
          paint: {
            'line-color': [
              'match',
              ['get', 'REGION'],
              'East', REGION_COLORS.East,
              'West', REGION_COLORS.West,
              'Rocky', REGION_COLORS.Rocky,
              'Central', REGION_COLORS.Central,
              '#000000'
            ],
            'line-width': [
              'case',
              ['==', ['get', 'REGION'], ''],
              0,
              1
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  };

  // Update distance circle effect
  useEffect(() => {
    if (!selectedLocationCoords || !mapRef.current) return;
    
    console.log('Updating distance circle:', {
      coords: selectedLocationCoords,
      maxDistance
    });
    
    try {
      updateDistanceCircle();
    } catch (error) {
      console.error('Error updating distance circle:', error);
    }
  }, [selectedLocationCoords, maxDistance]);

  // Handle region filter map movement
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (activeFilter === 'region') {
      if (selectedRegion && REGION_COORDINATES[selectedRegion as keyof typeof REGION_COORDINATES]) {
        // If a specific region is selected, fly to that region
        const regionCoords = REGION_COORDINATES[selectedRegion as keyof typeof REGION_COORDINATES];
        mapRef.current.flyTo({
          center: regionCoords.center,
          zoom: regionCoords.zoom,
          duration: 1500,
          padding: { top: 50, bottom: 50, left: 50, right: 50 }
        });
      } else {
        // If no region is selected, show the entire US
        mapRef.current.flyTo({
          center: [-98.5795, 23.8283],
          zoom: 2,
          duration: 1500
        });
      }
    }
  }, [activeFilter, selectedRegion]);

  // Cleanup map layers on unmount
  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (map) {
        // Clean up distance layers
        if (map.getLayer('distance-fill')) map.removeLayer('distance-fill');
        if (map.getLayer('distance-border')) map.removeLayer('distance-border');
        if (map.getSource('distance-source')) map.removeSource('distance-source');
        
        // Clean up region layers
        if (map.getLayer('region-states-outline')) map.removeLayer('region-states-outline');
        if (map.getLayer('region-states-fill')) map.removeLayer('region-states-fill');
        if (map.getLayer('us-mask')) map.removeLayer('us-mask');
        if (map.getSource('states')) map.removeSource('states');
      }
    };
  }, []);

  // This component doesn't render anything - it just manages map layers
  return null;
}

// Export the handleMapLoad function so it can be used by the parent component
export { REGION_COORDINATES };