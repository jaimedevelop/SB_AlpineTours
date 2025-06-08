import React from 'react';
import { Heart, X } from 'lucide-react';

interface NoFavoritesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoFavoritesPopup({ isOpen, onClose }: NoFavoritesPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Popup Container */}
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Favorites Yet</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              You haven't favorited any ski resorts yet! Add some favorites first to use this filter.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Heart className="w-4 h-4" />
              <span>Click the heart icon on any resort to add it to your favorites</span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 pt-0">
            <button
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}