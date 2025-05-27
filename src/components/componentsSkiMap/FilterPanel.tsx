import React from 'react';
import { X } from 'lucide-react';
import PriceFilter from '../filters/PriceFilter';
import DifficultyFilter from '../filters/DifficultyFilter';
import RegionFilter from '../filters/RegionFilter';
import DistanceFilter from '../filters/DistanceFilter';
import AmenitiesFilter from '../filters/AmenitiesFilter';
import CityFilter from '../filters/CityFilter';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | null;

interface FilterPanelProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  setHoveredRegion: (region: string) => void;
  // All the filter state props
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedDifficulties: string[];
  setSelectedDifficulties: (difficulties: string[]) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
  location: string;
  setLocation: (location: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  setSelectedCoordinates: (coords: [number, number] | null) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  selectedCitySize: string;
  setSelectedCitySize: (size: string) => void;
}

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

return (
  
);
}