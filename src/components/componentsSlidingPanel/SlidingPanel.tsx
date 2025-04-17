import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Resort } from '../../types/Resort';
import { ResortCard } from '../componentsSlidingPanel/ResortCard';
import { ResortDetail } from '../componentsSlidingPanel/ResortDetail';

interface SlidingPanelProps {
  resorts: Resort[];
  selectedResort?: Resort;
  onResortSelect?: (resort: Resort) => void;
  onClose?: () => void;
  maxHeight?: string;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export const SlidingPanel: React.FC<SlidingPanelProps> = ({
  resorts,
  selectedResort,
  onResortSelect,
  onClose,
  maxHeight = '50vh',
  isExpanded: controlledIsExpanded,
  onExpandedChange
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = controlledIsExpanded ?? internalIsExpanded;
  
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const collapsedHeight = 64; // Height of the handle area when collapsed (in px)
  
  // Calculate the full panel height (minus the handle) when needed
  const getPanelHeight = () => {
    if (!panelRef.current) return 0;
    
    // Get the numeric value from maxHeight (removing 'vh' or other units)
    const maxHeightValue = parseInt(maxHeight.replace(/[^0-9]/g, ''));
    const unit = maxHeight.replace(/[0-9]/g, '');
    
    if (unit === 'vh') {
      return (window.innerHeight * maxHeightValue / 100);
    } else if (unit === 'px') {
      return maxHeightValue;
    } else {
      // Default fallback - get actual element height
      return panelRef.current.scrollHeight;
    }
  };

  // Effect to close the detail view when the panel is collapsed
  useEffect(() => {
    if (!isExpanded && selectedResort && onClose) {
      onClose();
    }
  }, [isExpanded, selectedResort, onClose]);

  // Reset offset when expansion state changes
  useEffect(() => {
    setOffsetY(0);
  }, [isExpanded]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Calculate how far we've dragged from the starting point
    const currentY = e.touches[0].clientY;
    const dragDistance = currentY - startY;
    
    // Positive dragDistance means dragging downward (closing)
    // Negative dragDistance means dragging upward (opening)
    
    if (isExpanded) {
      // When expanded, only allow dragging downward (closing)
      if (dragDistance > 0) {
        setOffsetY(dragDistance);
      }
    } else {
      // When collapsed, only allow dragging upward (opening)
      if (dragDistance < 0) {
        setOffsetY(dragDistance);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const panelHeight = getPanelHeight();
    
    // Determine if we should change state based on how far the panel was dragged
    if (isExpanded) {
      // If user dragged down more than 30% of panel height, collapse it
      if (offsetY > panelHeight * 0.3) {
        setInternalIsExpanded(false);
        onExpandedChange?.(false);
      }
    } else {
      // If user dragged up more than 30% of panel height, expand it
      if (Math.abs(offsetY) > panelHeight * 0.3) {
        setInternalIsExpanded(true);
        onExpandedChange?.(true);
      }
    }
    
    // Reset dragging state
    setIsDragging(false);
    setOffsetY(0);
  };

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setInternalIsExpanded(newExpandedState);
    onExpandedChange?.(newExpandedState);
    
    // If we're collapsing the panel and there's a selected resort, close it
    if (!newExpandedState && selectedResort && onClose) {
      onClose();
    }
  };

  // Calculate the transform based on current state and drag offset
  const getTransformStyle = () => {
    if (isExpanded) {
      // When expanded, start from 0 (fully visible) and add any drag offset
      return `translateY(${offsetY}px)`;
    } else {
      // When collapsed, start from (100% - collapsedHeight) and subtract any drag offset
      const baseTransform = `calc(100% - ${collapsedHeight}px)`;
      if (offsetY !== 0) {
        return `calc(${baseTransform} + ${offsetY}px)`;
      }
      return baseTransform;
    }
  };

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transition-all duration-300 ease-in-out z-50 ${
        !isDragging ? 'transition-transform' : ''
      }`}
      style={{ 
        maxHeight,
        transform: isDragging ? getTransformStyle() : isExpanded ? 'translateY(0)' : `translateY(calc(100% - ${collapsedHeight}px))`
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div 
        className={`flex items-center justify-center cursor-pointer ${
          isExpanded ? 'h-8' : 'h-16'
        }`}
        onClick={toggleExpanded}
      >
        <div className="w-16 h-1 bg-gray-300 rounded-full mb-2" />

      </div>
      <div className="overflow-y-auto" style={{ height: `calc(${maxHeight} - ${isExpanded ? '32px' : '64px'})` }}>
        {selectedResort ? (
          <ResortDetail resort={selectedResort} onClose={onClose} />
        ) : (
          <div className="flex flex-col items-center p-4 w-full">
            <div className="w-full max-w-md px-2 sm:px-0">
              {resorts.map((resort) => (
                <ResortCard 
                  key={resort.id} 
                  resort={resort} 
                  onClick={onResortSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};