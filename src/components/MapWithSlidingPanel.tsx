import React, { useState, useEffect } from 'react';
import SkiMap from './SkiMap';
import { SlidingPanel } from './componentsSlidingPanel/SlidingPanel';
import { Resort } from '../types/types';

export default function MapWithSlidingPanel() {
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [filteredResorts, setFilteredResorts] = useState<Resort[]>([]);
  
  // Handler to close panel when clicking on map
  const handleMapClick = (event: any) => {
    // Check if we're clicking on a marker
    if (event.originalEvent.target instanceof HTMLElement && 
        event.originalEvent.target.closest('.mapboxgl-marker')) {
      return;
    }
    
    // If panel is expanded, collapse it
    if (isPanelExpanded) {
      setIsPanelExpanded(false);
    }
  };
  
  // Integration point: update the selected resort state from map
  const handleResortSelect = (resort: Resort) => {
    setSelectedResort(resort);
    setIsPanelExpanded(true);
  };
  
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* The map fills the entire container */}
      <div className="absolute inset-0">
        <SkiMap 
          onMapClick={handleMapClick}
          onResortSelect={handleResortSelect}
          selectedResort={selectedResort}
          onFilteredResortsChange={setFilteredResorts}
        />
      </div>
      
      {/* The sliding panel is positioned at the bottom and above the map */}
      <SlidingPanel
        resorts={filteredResorts}
        selectedResort={selectedResort}
        onResortSelect={handleResortSelect}
        onClose={() => setSelectedResort(null)}
        maxHeight="70vh"
        isExpanded={isPanelExpanded}
        onExpandedChange={setIsPanelExpanded}
      />
    </div>
  );
}