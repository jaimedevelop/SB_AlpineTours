import React, { useState, useRef, TouchEvent } from 'react';
import { MapPin, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import type { Resort } from '../../types/types';

interface ResortCardProps {
  resort: Resort;
  onClick?: (resort: Resort) => void;
}

export const ResortCard: React.FC<ResortCardProps> = ({ resort, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  
  // Use the images array if available, otherwise create an array with the single imageUrl
  const images = resort.images || [resort.imageUrl];
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // If the swipe distance is significant enough (more than 30px)
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // Swiped left, go to next image
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      } else {
        // Swiped right, go to previous image
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      }
    }
    
    touchStartX.current = null;
    e.stopPropagation();
  };

  return (
    <div 
      className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick?.(resort)}
    >
      <div className="relative">
        <div 
          className="w-full h-40 overflow-hidden rounded-lg mb-4 relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[currentImageIndex]} 
            alt={`${resort.name} - Image ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover"
            draggable="false"
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                {images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full mx-1 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{resort.name}</h3>
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin size={16} className="mr-2" />
        <span>{resort.state}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
          <DollarSign size={16} className="mr-1 text-blue-600" />
          <span className="font-medium text-blue-700">{resort.ticketCost || '??'}/day</span>
        </div>
        <span className={`px-2 py-1 rounded bg-blue-100 text-blue-800`}>
          {resort.matchPercentage ? `${resort.matchPercentage}% Match` : 'No Match Data'}
        </span>
      </div>
    </div>
  );
};