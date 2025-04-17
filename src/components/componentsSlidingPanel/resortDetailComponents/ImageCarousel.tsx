import React, { useState, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  altText?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // If the swipe distance is significant enough (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left, go to next image
        nextImage();
      } else {
        // Swiped right, go to previous image
        prevImage();
      }
    }
    
    touchStartX.current = null;
  };

  return (
    <div className="relative mb-6">
      <div 
        className="w-full h-64 overflow-hidden rounded-xl relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={images[currentImageIndex]} 
          alt={altText ? `${altText} - Image ${currentImageIndex + 1}` : `Image ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
          draggable="false"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              {images.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2.5 h-2.5 rounded-full mx-1 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;