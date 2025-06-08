// filterResets.ts
// Type definitions for filter state setters
interface FilterResetFunctions {
  resetPriceFilter: () => void;
  resetDifficultyFilter: () => void;
  resetRegionFilter: () => void;
  resetDistanceFilter: () => void;
  resetAmenitiesFilter: () => void;
  resetCityFilter: () => void;
}

interface FilterStateSetters {
  // Price filter
  setPriceRange: (range: [number, number]) => void;
  
  // Difficulty filter
  setSelectedDifficulties: (difficulties: string[]) => void;
  
  // Region filter
  setSelectedRegion: (region: string) => void;
  setSelectedStates: (states: string[]) => void;
  
  // Distance filter
  setLocation: (location: string) => void;
  setMaxDistance: (distance: number) => void;
  setSelectedCoordinates: (coords: [number, number] | null) => void;
  
  // Amenities filter
  setSelectedAmenities: (amenities: string[]) => void;
  
  // City filter
  setSelectedCitySize: (size: string) => void;
}

// Create reset functions factory
export function createFilterResetFunctions(setters: FilterStateSetters): FilterResetFunctions {
  const resetPriceFilter = () => {
    setters.setPriceRange([0, 400]);
  };

  const resetDifficultyFilter = () => {
    setters.setSelectedDifficulties([]);
  };

  const resetRegionFilter = () => {
    setters.setSelectedRegion('');
    setters.setSelectedStates([]);
  };

  const resetDistanceFilter = () => {
    setters.setLocation('');
    setters.setMaxDistance(100); // Reset to default value instead of 0
    setters.setSelectedCoordinates(null);
  };

  const resetAmenitiesFilter = () => {
    setters.setSelectedAmenities([]);
  };

  const resetCityFilter = () => {
    setters.setSelectedCitySize('');
  };

  return {
    resetPriceFilter,
    resetDifficultyFilter,
    resetRegionFilter,
    resetDistanceFilter,
    resetAmenitiesFilter,
    resetCityFilter,
  };
}