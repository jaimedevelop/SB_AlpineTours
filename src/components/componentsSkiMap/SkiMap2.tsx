import { useEffect, useState, useMemo, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';
import { database } from '../../firebase/database';
import { ref, onValue } from 'firebase/database';
import { Resort } from '../../types/types.ts';  
import { MapPin, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ResortPopup from '../ResortPopup'; 
import PriceFilter from './filters/PriceFilter.tsx'; 
import DifficultyFilter from './filters/DifficultyFilter.tsx'; 
import RegionFilter from './filters/RegionFilter.tsx'; 
import DistanceFilter from './filters/DistanceFilter.tsx'; 
import AmenitiesFilter from './filters/AmenitiesFilter.tsx'; 
import CityFilter from './filters/CityFilter.tsx'; 
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import FilterBar from './FilterBar';
import FilterPanel from './FilterPanel';
import MapLayers, { REGION_COORDINATES } from './MapLayers';
import MapMarkers from './MapMarkers';
import useQuizStateHandler from './useQuizStateHandler';
import { createFilterResetFunctions } from '../../utils/filterResets';
import { useFavorites } from '../hooks/useFavorites';
import { applyFavoritesFilter, isFavoritesFilterActive } from '../../utils/favoritesFilter';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hcXVpbmdmMjEiLCJhIjoiY2x1dnZ1ZGFrMDduZTJrbWp6bHExbzNsYiJ9.ZOEuIV9R0ks2I5bYq40HZQ';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | 'favorites' | null;

interface SkiMapProps {
  onMapClick?: (event: any) => void;
  onResortSelect?: (resort: Resort) => void;
  selectedResort?: Resort | null;
  onFilteredResortsChange?: (resorts: Resort[]) => void;
}

export default function SkiMap2({
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
  
  // Use modular favorites hook
  const {
    favoriteResorts,
    favoritesActive,
    setFavoritesActive,
    toggleFavorite,
    resetFavoritesFilter,
    isFavorite,
    isLoading: favoritesLoading,
    error: favoritesError
  } = useFavorites();

console.log('SkiMap2 received favorites:', {
  favoriteResorts: Array.from(favoriteResorts),
  favoritesActive,
  favoritesCount: favoriteResorts.size
});
  
  // Create reset functions including favorites
  const filterResets = createFilterResetFunctions({
    setPriceRange,
    setSelectedDifficulties,
    setSelectedRegion,
    setSelectedStates,
    setLocation,
    setMaxDistance,
    setSelectedCoordinates: setSelectedLocationCoords,
    setSelectedAmenities,
    setSelectedCitySize,
  });

  // Handle quiz state initialization
  useQuizStateHandler({
    setPriceRange,
    setSelectedDifficulties,
    setActiveFilter,
    setLocation,
    setSelectedRegion
  });

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
      case 'favorites':
        return isFavoritesFilterActive(favoritesActive);
      default:
        return false;
    }
  };

  const handleMapLoad = (event: { target: mapboxgl.Map }) => {
    mapRef.current = event.target;
  };
  
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


  // Filter resorts based on all active filters including favorites
  const filteredResorts = useMemo(() => {
    let filtered = resorts.filter(resort => {
      // Distance Filter
      if (selectedLocationCoords && location) {
        try {
          const resortLong = Number(resort.longitude);
          const resortLat = Number(resort.latitude);
          
          if (isNaN(resortLong) || isNaN(resortLat)) {
            return false;
          }

          const from = turf.point([selectedLocationCoords[0], selectedLocationCoords[1]]);
          const to = turf.point([resortLong, resortLat]);
          
          const distance = turf.distance(from, to, { units: 'miles' });
          
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
        }
        
        const hasSelectedDifficulty = selectedDifficulties.some(difficulty => {
          const difficultyValue = difficultyMap[difficulty];
          const percentage = difficultyValue ? parseFloat(String(difficultyValue).toString().replace('%', '')) : 0;
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

    // Apply favorites filter using modular utility
    filtered = applyFavoritesFilter({
      resorts: filtered,
      favoritesActive,
      favoriteResorts
    });

    return filtered;
  }, [resorts, priceRange, selectedDifficulties, selectedRegion, selectedAmenities, selectedLocationCoords, location, maxDistance, favoritesActive, favoriteResorts]);

  // Pass filtered resorts to parent
  useEffect(() => {
    if (onFilteredResortsChange) {
      onFilteredResortsChange(filteredResorts);
      console.log("Passing filtered resorts to parent:", filteredResorts.length);
    }
  }, [filteredResorts]); 

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

      <FilterBar 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isFilterActive={isFilterActive}
        favoritesActive={favoritesActive}
        setFavoritesActive={setFavoritesActive}
        resetFavoritesFilter={resetFavoritesFilter}
        {...filterResets}
      />

      <FilterPanel 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        setHoveredRegion={setHoveredRegion}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedDifficulties={selectedDifficulties}
        setSelectedDifficulties={setSelectedDifficulties}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedStates={selectedStates}
        setSelectedStates={setSelectedStates}
        location={location}
        setLocation={setLocation}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        setSelectedCoordinates={setSelectedLocationCoords}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        selectedCitySize={selectedCitySize}
        setSelectedCitySize={setSelectedCitySize}
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
        <MapMarkers
          filteredResorts={filteredResorts}
          selectedLocationCoords={selectedLocationCoords}
          onResortSelect={setSelectedResort}
          favoriteResorts={favoriteResorts}
          onToggleFavorite={toggleFavorite}
        />
        
        {/* Resort popup */}
        {selectedResort && (
          <ResortPopup 
            resort={selectedResort}
            onClose={() => setSelectedResort(null)}
            isFavorite={isFavorite(selectedResort.id)}
            onToggleFavorite={() => toggleFavorite(selectedResort.id)}
          />
        )}
        
        <MapLayers
          mapRef={mapRef}
          selectedLocationCoords={selectedLocationCoords}
          maxDistance={maxDistance}
          selectedRegion={selectedRegion}
          hoveredRegion={hoveredRegion}
          activeFilter={activeFilter}
          onMapLoad={handleMapLoad}
        />
      </Map>
    </div>
  );
}