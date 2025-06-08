import React from 'react';
import FilterResets from './filters/filterResets'
type FilterType = 'price' | 'difficulty' | 'region' | 'distance' | 'amenities' | 'city' | 'favorites' | null;

interface FilterBarProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  isFilterActive: (filterType: FilterType) => boolean;
  favoritesActive: boolean;
  setFavoritesActive: (active: boolean) => void;
  resetPriceFilter: () => void;
  resetDifficultyFilter: () => void;
  resetRegionFilter: () => void;
  resetDistanceFilter: () => void;
  resetAmenitiesFilter: () => void;
  resetCityFilter: () => void;
  resetFavoritesFilter: () => void;
}

export default function FilterBar({ 
  activeFilter, 
  setActiveFilter, 
  isFilterActive,
  favoritesActive,
  setFavoritesActive,
  resetPriceFilter,
  resetDifficultyFilter,
  resetRegionFilter,
  resetDistanceFilter,
  resetAmenitiesFilter,
  resetCityFilter,
  resetFavoritesFilter
}: FilterBarProps) {
  
const handleFilterClick = (filterType: FilterType) => {
  if (filterType === 'favorites') {
    // Special handling for favorites - toggle the state
    setFavoritesActive(!favoritesActive);
    setActiveFilter(null); // Don't show panel for favorites
  } else {
    if (activeFilter === filterType) {
      setActiveFilter(null); // Deactivate if already selected
    } else {
      setActiveFilter(filterType);
    }
  }
};

  // Helper function to handle filter reset
  const handleFilterReset = (e: React.MouseEvent, filterType: FilterType) => {
    e.stopPropagation(); // Prevent the main button click
    
    // Call the appropriate reset function
    switch (filterType) {
      case 'price':
        resetPriceFilter();
        break;
      case 'difficulty':
        resetDifficultyFilter();
        break;
      case 'region':
        resetRegionFilter();
        break;
      case 'distance':
        resetDistanceFilter();
        break;
      case 'amenities':
        resetAmenitiesFilter();
        break;
      case 'city':
        resetCityFilter();
        break;
      case 'favorites':
        resetFavoritesFilter();
        break;
    }
  };

  // Helper function to get filter pill class names
  const getFilterPillClasses = (filterType: FilterType): string => {
    const baseClasses = "px-4 py-1 text-gray-800 rounded-full shadow transition-colors flex items-center gap-1 mt-1 ml-1 relative";
    const isActive = isFilterActive(filterType);
    const isSelected = activeFilter === filterType;
    
    if (isActive && isSelected) {
      return `${baseClasses} bg-blue-500 ring-2 ring-blue-500 text-white`;
    } else if (isActive) {
      return `${baseClasses} bg-blue-500 hover:bg-blue-100 text-white`;
    } else if (isSelected) {
      return `${baseClasses} bg-white ring-2 ring-blue-500 hover:bg-gray-100`;
    } else {
      return `${baseClasses} bg-white hover:bg-gray-100`;
    }
  };

  return (
    <>
      {/* Filter buttons */}
      <div className="absolute top-4 left-0 right-0 z-10 mx-4">
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar max-w-full">
          <button 
            onClick={() => handleFilterClick('favorites')}
            className={getFilterPillClasses('favorites')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"/>
            </svg>
            Favorites
            {isFilterActive('favorites') && (
              <button
                onClick={(e) => handleFilterReset(e, 'favorites')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Reset favorites filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
          <button 
            onClick={() => handleFilterClick('price')}
            className={getFilterPillClasses('price')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15" />
            </svg>
            Price
            {isFilterActive('price') && (
              <button
                onClick={(e) => handleFilterReset(e, 'price')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Reset price filter to all prices"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
          <button 
            onClick={() => handleFilterClick('difficulty')}
            className={getFilterPillClasses('difficulty')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M1 21L12 2l11 19zm3.45-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m-1-3h2v-5h-2zm1-2.5"/>
            </svg>
            Difficulty
            {isFilterActive('difficulty') && (
              <button
                onClick={(e) => handleFilterReset(e, 'difficulty')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Reset difficulty filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
          <button 
            onClick={() => handleFilterClick('region')}
            className={getFilterPillClasses('region')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m15 21l-6-2.1l-6 2.325V5.05L9 3l6 2.1l6-2.325V18.95zm-1-2.45V6.85l-4-1.4v11.7zm2 0l3-1V5.7l-3 1.15zM5 18.3l3-1.15V5.45l-3 1zM16 6.85v11.7zm-8-1.4v11.7z"/>
            </svg>
            Region
            {isFilterActive('region') && (
              <button
                onClick={(e) => handleFilterReset(e, 'region')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Reset region filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
          <button 
            onClick={() => handleFilterClick('distance')}
            className={getFilterPillClasses('distance')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m6.343 14.728l-2.828 2.829l3.535 3.535L20.485 7.657L16.95 4.121l-2.121 2.122l1.414 1.414l-1.414 1.414l-1.415-1.414l-2.121 2.121l2.121 2.122L12 13.314l-2.12-2.121l-2.122 2.12l1.415 1.415l-1.415 1.414z"/>
            </svg>
            Distance
            {isFilterActive('distance') && (
              <button
                onClick={(e) => handleFilterReset(e, 'distance')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Reset distance filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
          <button 
            onClick={() => handleFilterClick('amenities')}
            className={getFilterPillClasses('amenities')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M7.5 11.5v3M6 13h3m3-4.653c2.005 0 3.7-1.888 5.786-1.212c2.264.733 3.82 3.413 3.708 9.492c-.022 1.224-.336 2.578-1.546 3.106c-2.797 1.221-4.397-2.328-7-2.328h-1.897c-2.605 0-4.213 3.545-6.998 2.328c-1.21-.528-1.525-1.882-1.547-3.107c-.113-6.078 1.444-8.758 3.708-9.491C8.299 6.459 9.994 8.347 12 8.347m0-4.565v4.342M14.874 13h3"/>
            </svg>
            Amenities
            {isFilterActive('amenities') && (
              <button
                onClick={(e) => handleFilterReset(e, 'amenities')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Remove amenities filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
          <button 
            onClick={() => handleFilterClick('city')}
            className={getFilterPillClasses('city')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path fill="currentColor" d="M3.75 18a.75.75 0 0 0-1.5 0zm-1.5-4a.75.75 0 0 0 1.5 0zM7 8.75c.964 0 1.612.002 2.095.067c.461.062.659.169.789.3l1.06-1.062c-.455-.455-1.022-.64-1.65-.725c-.606-.082-1.372-.08-2.294-.08zM11.75 12c0-.922.002-1.688-.08-2.294c-.084-.628-.27-1.195-.726-1.65l-1.06 1.06c.13.13.237.328.3.79c.064.482.066 1.13.066 2.094zM7 7.25c-.922 0-1.688-.002-2.294.08c-.628.084-1.195.27-1.65.725l1.06 1.061c.13-.13.328-.237.79-.3c.482-.064 1.13-.066 2.094-.066zM3.75 12c0-.964.002-1.612.067-2.095c.062-.461.169-.659.3-.789l-1.062-1.06c-.455.455-.64 1.022-.725 1.65c-.082.606-.08 1.372-.08 2.294zm0 10v-4h-1.5v4zm0-8v-2h-1.5v2z"/>
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M7 22v-6c0-1.886 0-2.828.586-3.414S9.114 12 11 12h2c1.886 0 2.828 0 3.414.586c.472.471.564 1.174.582 2.414M17 22v-2.75m4-11.478c0-1.34 0-2.011-.356-2.525s-.984-.75-2.24-1.22c-2.455-.921-3.682-1.381-4.543-.785C13 3.84 13 5.15 13 7.772V12m8 10V12M4 8V6.5c0-.943 0-1.414.293-1.707S5.057 4.5 6 4.5h2c.943 0 1.414 0 1.707.293S10 5.557 10 6.5V8M7 4V2m15 20H2m8-7h.5m3.5 0h-1.5M10 18h4"/>
              </g>
            </svg>
            City
            {isFilterActive('city') && (
              <button
                onClick={(e) => handleFilterReset(e, 'city')}
                className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Reset city filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            )}
          </button>
        </div>
      </div>
      </>
);
}