import React from 'react';
import { X } from 'lucide-react';
import PriceFilter from './filters/PriceFilter';
import DifficultyFilter from './filters/DifficultyFilter';
import RegionFilter from './filters/RegionFilter';
import DistanceFilter from './filters/DistanceFilter';
import AmenitiesFilter from './filters/AmenitiesFilter';
import CityFilter from './filters/CityFilter';

type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | 'favorites' | null;

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

export default function FilterPanel({ 
  activeFilter, 
  setActiveFilter, 
  setHoveredRegion,
  priceRange,
  setPriceRange,
  selectedDifficulties,
  setSelectedDifficulties,
  selectedRegion,
  setSelectedRegion,
  selectedStates,
  setSelectedStates,
  location,
  setLocation,
  maxDistance,
  setMaxDistance,
  setSelectedCoordinates,
  selectedAmenities,
  setSelectedAmenities,
  selectedCitySize,
  setSelectedCitySize
}: FilterPanelProps) {
  
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
            setSelectedCoordinates={setSelectedCoordinates}
          />
        );
      case 'amenities':
        return <AmenitiesFilter selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities} />;
      case 'city':
        return <CityFilter selectedCitySize={selectedCitySize} setSelectedCitySize={setSelectedCitySize} />;
      case 'favorites':
        // Favorites doesn't have a panel - it's just a toggle
        return null;
      default:
        return null;
    }
  };

  // Don't render the panel at all if favorites is active or no filter is active
  if (activeFilter === 'favorites' || !activeFilter) {
    return null;
  }

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out z-20 translate-y-0`} style={{ height: '50vh' }}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">
          {activeFilter ? activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) : ''} Filter
        </h2>
        <button onClick={() => {
          setActiveFilter(null);
          setHoveredRegion('');
        }} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(50vh - 4rem)' }}>
        {renderFilterPanel()}
      </div>
    </div>
  );
}