import { useEffect, useState, useMemo, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';
import { database } from '../../firebase/database';
import { ref, onValue } from 'firebase/database';
import { Resort } from '../../types/types.ts';  
import { MapPin, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ResortPopup from '../ResortPopup'; 
import PriceFilter from '../filters/PriceFilter'; 
import DifficultyFilter from '../filters/DifficultyFilter'; 
import RegionFilter from '../filters/RegionFilter'; 
import DistanceFilter from '../filters/DistanceFilter'; 
import AmenitiesFilter from '../filters/AmenitiesFilter'; 
import CityFilter from '../filters/CityFilter'; 
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import statesData from '../../data/states.geojson?url'; 
import * as turf from '@turf/turf';
import FilterBar from './FilterBar';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | null;

const REGION_COLORS = {
  East: '#4264fb',
  West: '#D7961F',
  Rocky: '#fb4242',
  Central: '#003E1F'
};

// Region boundaries and view settings
const REGION_COORDINATES = {
  East: { 
    center: [-73.5, 43.5],
    zoom: 5.5,
    bounds: {
      north: 47.5,
      south: 35,
      east: -67,
      west: -85
    }
  },
  West: { 
    center: [-120, 43],
    zoom: 4,
    bounds: {
      north: 49,
      south: 32,
      east: -110,
      west: -125
    }
  },
  Rocky: { 
    center: [-109, 43],
    zoom: 4,
    bounds: {
      north: 49,
      south: 31,
      east: -103,
      west: -115
    }
  },
  Central: { 
    center: [-92, 42],
    zoom: 4,
    bounds: {
      north: 49,
      south: 29,
      east: -85,
      west: -103
    }
  }
};

const normalizeRegion = (region: string): 'East' | 'West' | 'Rocky' | 'Central' | '' => {
    const regionMap: { [key: string]: 'East' | 'West' | 'Rocky' | 'Central' } = {
      'eastern': 'East',
      'western': 'West',
      'rocky': 'Rocky',
      'central': 'Central',
      'east': 'East',
      'west': 'West'
    };
    return regionMap[region.toLowerCase()] || '';
  };

interface BeginnerQuizState {
  address: string;
  tripDuration: string;
  noTimeLimit: boolean;
  costType: 'daily' | 'total';
  costAmount: string;
  interests: string[];
}

interface ExperiencedQuizState {
  region: 'East' | 'West' | 'Rocky' | 'Central';
  skill: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  budget: 'budget' | 'moderate' | 'premium' | 'luxury';
  interests: string[];
}

interface SkiMapProps {
  onMapClick?: (event: any) => void;
  onResortSelect?: (resort: Resort) => void;
  selectedResort?: Resort | null;
  onFilteredResortsChange?: (resorts: Resort[]) => void;
}

export default function SkiMap({
  onMapClick: externalMapClickHandler,
  onResortSelect: externalResortSelectHandler,
  selectedResort: externalSelectedResort,
  onFilteredResortsChange
}: SkiMapProps = {}) {
  const locationHook = useLocation();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string>('');
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedLocationCoords, setSelectedLocationCoords] = useState<[number, number] | null>(null);
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCitySize, setSelectedCitySize] = useState<string>('');

  const updateDistanceCircle = () => {
    if (!mapRef.current || !selectedLocationCoords) return;
  const map = mapRef.current;

  // Remove existing layers and sources
  if (map.getLayer('distance-fill')) map.removeLayer('distance-fill');
  if (map.getLayer('distance-border')) map.removeLayer('distance-border');
  if (map.getSource('distance-source')) map.removeSource('distance-source');

  // Create a circle using turf.js
  const center = selectedLocationCoords;
  const radius = maxDistance * 1.609; // Convert miles to kilometers
  const options = {
    steps: 64,
    units: 'kilometers'
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

  const handleMapLoad = async (event: { target: mapboxgl.Map }) => {
    const map = event.target;
    mapRef.current = map;

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

      // Helper function to determine if a filter is active
const isFilterActive = (filterType: FilterType): boolean => {
  switch (filterType) {
    case 'price':
      return priceRange[0] > 0 || priceRange[1] < 400;
    case 'difficulty':
      return selectedDifficulties.length > 0;
    case 'region':
      return selectedRegion !== '';
    case 'distance':
      return location !== '' && selectedLocationCoords !== null;
    case 'amenities':
      return selectedAmenities.length > 0;
    case 'city':
      return selectedCitySize !== '';
    default:
      return false;
  }
};
    }
  };

  useEffect(() => {
  const quizState = locationHook.state as BeginnerQuizState | ExperiencedQuizState | null;
  
  if (!quizState) {
    console.log('No quiz state found');
    return;
  }

  console.log('Quiz State:', quizState); // Debug log

  const isBeginnerQuiz = 'address' in quizState;
  console.log('Is Beginner Quiz:', isBeginnerQuiz); // Debug log

  if (isBeginnerQuiz) {
    const beginnerState = quizState as BeginnerQuizState;
    console.log('Beginner Quiz State:', beginnerState); // Debug log

    // Set price filter from beginner quiz
    if (beginnerState.costType === 'daily') {
      const costAmount = Number(beginnerState.costAmount);
      console.log('Setting price range:', [0, costAmount]); // Debug log
      setPriceRange([0, costAmount]);
    }

    // Set difficulty filter for beginners
    console.log('Setting difficulty to Green'); // Debug log
    setSelectedDifficulties(['Green']);
    setActiveFilter('difficulty');

    // Set distance filter if location is provided
    if (beginnerState.address) {
      console.log('Setting location:', beginnerState.address); // Debug log
      setLocation(beginnerState.address);
      setActiveFilter('distance');
    }
  } else {
    const experiencedState = quizState as ExperiencedQuizState;
    console.log('Experienced Quiz State:', experiencedState); // Debug log

    // Set region filter
      if (experiencedState.region) {
    const normalizedRegion = normalizeRegion(experiencedState.region);
    console.log('Setting normalized region:', normalizedRegion);
    setSelectedRegion(normalizedRegion);
    
    if (normalizedRegion) {
      // Temporarily set active filter to region to trigger the map movement
      setActiveFilter('region');
      // Close the filter panel after a short delay
      setTimeout(() => {
        setActiveFilter(null);
      }, 500);
    }
  }

    // Set difficulty filter based on skill level
    const skillLevelToDifficulty: Record<string, string[]> = {
      'beginner': ['green'],
      'intermediate': ['blue'],
      'advanced': ['black'],
      'expert': ['doubleBlack']
    };
    
    if (experiencedState.skill && skillLevelToDifficulty[experiencedState.skill]) {
      const difficulties = skillLevelToDifficulty[experiencedState.skill];
      console.log('Setting difficulties:', difficulties); // Debug log
      setSelectedDifficulties(difficulties);
      setActiveFilter('difficulty');
    }

    // Set price filter
    if (experiencedState.budget) {
      const budgetRanges: Record<string, [number, number]> = {
        'budget': [0, 100],
        'moderate': [100, 200],
        'premium': [200, 300],
        'luxury': [300, 500]
      };
      
      if (budgetRanges[experiencedState.budget]) {
        const priceRange = budgetRanges[experiencedState.budget];
        console.log('Setting price range:', priceRange); // Debug log
        setPriceRange(priceRange);
      }
    }

    // Set the active filter to region last
    setTimeout(() => {
      console.log('Setting active filter to region'); // Debug log
      setActiveFilter('region');
    }, 100);
  }
}, []);
  
 // Fetch resorts from database
useEffect(() => {
  const resortsRef = ref(database, 'resorts');
  onValue(resortsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setResorts(Object.values(data));
    }
  });
}, []);

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
  
  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (map) {
        if (map.getLayer('distance-fill')) map.removeLayer('distance-fill');
        if (map.getSource('distance-source')) map.removeSource('distance-source');
      }
    };
  }, []);

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
        if (map.getLayer('region-states-outline')) map.removeLayer('region-states-outline');
        if (map.getLayer('region-states-fill')) map.removeLayer('region-states-fill');
        if (map.getSource('states')) map.removeSource('states');
      }
    };
  }, []);

  // Filter resorts based on all active filters
  // Updated filteredResorts useMemo with complete dependency array
const filteredResorts = useMemo(() => {
  return resorts.filter(resort => {
    // Distance Filter
    if (selectedLocationCoords && location) {
      try {
        // Ensure resort coordinates are valid numbers
        const resortLong = Number(resort.longitude);
        const resortLat = Number(resort.latitude);
        
        if (isNaN(resortLong) || isNaN(resortLat)) {
          return false;
        }

        const from = turf.point([selectedLocationCoords[0], selectedLocationCoords[1]]);
        const to = turf.point([resortLong, resortLat]);
        
        const distance = turf.distance(from, to, { units: 'miles' });
        
        // If resort is outside the radius, filter it out
        if (distance > maxDistance) {
          return false;
        }
      } catch (error) {
        console.error('Error calculating distance for resort:', resort.name, error);
        return false;
      }
    }

    // Region Filter
    if (selectedRegion && resort.region !== selectedRegion) {
      return false;
    }

    // Price Filter
    const fullDayPrice = parseFloat(resort.fullDayTicket.replace(/[^0-9.]/g, ''));
    if (isNaN(fullDayPrice) || fullDayPrice < priceRange[0] || fullDayPrice > priceRange[1]) {
      return false;
    }

    // Difficulty Filter
    if (selectedDifficulties.length > 0) {
      const difficultyMap: { [key: string]: string } = {
        'Green': resort.difficulty.percent.green,
        'Blue': resort.difficulty.percent.blue,
        'Double Blue': resort.difficulty.percent.doubleBlue,
        'Black': resort.difficulty.percent.black,
        'Double Black': resort.difficulty.percent.doubleBlack
      };
      
      const hasSelectedDifficulty = selectedDifficulties.some(difficulty => {
        const percentage = parseFloat(difficultyMap[difficulty].replace('%', ''));
        return !isNaN(percentage) && percentage >= 30;
      });
      
      if (!hasSelectedDifficulty) {
        return false;
      }
    }

    // Amenities Filter
    if (selectedAmenities.length > 0) {
      const amenityMap: { [key: string]: boolean | null } = {
        'Night Skiing': resort.nightSkiing,
        'Terrain Park': resort.terrainPark === 'Yes',
        'Backcountry Access': resort.backcountry,
        'Snow Tubing': resort.snowTubing,
        'Ice Skating': resort.iceSkating
      };

      const hasAllSelectedAmenities = selectedAmenities.every(
        amenity => amenityMap[amenity]
      );

      if (!hasAllSelectedAmenities) {
        return false;
      }
    }

    return true;
  });
}, [resorts, priceRange, selectedDifficulties, selectedRegion, selectedAmenities, selectedLocationCoords, location, maxDistance]);

  // Add this effect to pass filtered resorts to parent
useEffect(() => {
  // Only call if the callback exists
  if (onFilteredResortsChange) {
    onFilteredResortsChange(filteredResorts);
    console.log("Passing filtered resorts to parent:", filteredResorts.length);
  }
}, [filteredResorts]); // Intentionally not including onFilteredResortsChange in deps
  const renderFilterPanel = () => {
    switch (activeFilter) {
      case 'price':
        return <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />;
      case 'difficulty':
        return <DifficultyFilter selectedDifficulties={selectedDifficulties} setSelectedDifficulties={setSelectedDifficulties} />;
      case 'region':
        return (
          <RegionFilter 
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            onRegionHover={setHoveredRegion}
          />
        );
      case 'distance':
        return (
          <DistanceFilter
            location={location}
            setLocation={setLocation}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            setSelectedCoordinates={setSelectedLocationCoords}
          />
        );
      case 'amenities':
        return <AmenitiesFilter selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities} />;
      case 'city':
        return <CityFilter selectedCitySize={selectedCitySize} setSelectedCitySize={setSelectedCitySize} />;
      default:
        return null;
    }
  };

  const handleMapClick = (event: mapboxgl.MapLayerMouseEvent) => {
    // Prevent closing if clicking on a marker
    if (event.originalEvent.target instanceof HTMLElement && 
        event.originalEvent.target.closest('.mapboxgl-marker')) {
      return;
    }
    
    setActiveFilter(null);
    setHoveredRegion('');
  
  if (externalMapClickHandler) {
    externalMapClickHandler(event);
  }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Filter Bar Component */}
<FilterBar 
  activeFilter={activeFilter}
  setActiveFilter={setActiveFilter}
  isFilterActive={isFilterActive}
/>
      
      
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        reuseMaps
        onClick={handleMapClick}
        onLoad={handleMapLoad}
      >
        {/* Resort markers */}
        {filteredResorts.map((resort, index) => (
          resort.latitude && resort.longitude ? (
            <Marker
              key={index}
              latitude={Number(resort.latitude)}
              longitude={Number(resort.longitude)}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedResort(resort);
              }}
            >
              <MapPin className="text-blue-600 hover:text-blue-800 cursor-pointer" />
            </Marker>
          ) : null
        ))}

        {/* Selected location marker */}
        {selectedLocationCoords && (
          <Marker
            latitude={selectedLocationCoords[1]}
            longitude={selectedLocationCoords[0]}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="#f00" fillRule="evenodd" clipRule="evenodd">
                <path d="M16.272 10.272a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
                <path d="M5.794 16.518a9 9 0 1 1 12.724-.312l-6.206 6.518zm11.276-1.691l-4.827 5.07l-5.07-4.827a7 7 0 1 1 9.897-.243" />
              </g>
            </svg>
          </Marker>
        )}
        
        {/* Resort popup */}
        {selectedResort && (
          <ResortPopup 
            resort={selectedResort}
            onClose={() => setSelectedResort(null)}
          />
        )}
      </Map>
    </div>
  );
}