import React from 'react';
import { Star, Calendar, MapPin, ChevronRight } from 'lucide-react';

const savedResorts = [
  {
    name: 'Vail',
    location: 'Colorado',
    image: 'https://images.unsplash.com/photo-1544985361-b420d7a77f51?auto=format&fit=crop&q=80&w=800',
    lastViewed: '2024-03-15',
    rating: 4.8,
    priceRange: '$$$',
  },
  {
    name: 'Aspen Snowmass',
    location: 'Colorado',
    image: 'https://images.unsplash.com/photo-1548533001-9dc7d1b04016?auto=format&fit=crop&q=80&w=800',
    lastViewed: '2024-03-14',
    rating: 4.9,
    priceRange: '$$$$',
  },
  {
    name: 'Park City',
    location: 'Utah',
    image: 'https://images.unsplash.com/photo-1548532369-c7e27c697f1b?auto=format&fit=crop&q=80&w=800',
    lastViewed: '2024-03-13',
    rating: 4.7,
    priceRange: '$$$',
  },
];

export default function SavedResorts() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Your Resorts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedResorts.map((resort) => (
          <div
            key={resort.name}
            className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/20 transition-colors cursor-pointer group"
          >
            <div className="aspect-video relative">
              <img
                src={resort.image}
                alt={resort.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white">{resort.rating}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{resort.name}</h3>
                  <div className="flex items-center text-white/60">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{resort.location}</span>
                  </div>
                </div>
                <span className="text-white/60">{resort.priceRange}</span>
              </div>

              <div className="flex items-center text-white/60 text-sm mt-2">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Last viewed: {resort.lastViewed}</span>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-white text-blue-900 rounded-lg py-2 font-medium hover:bg-blue-50 transition-colors">
                  Book Now
                </button>
                <button className="flex items-center justify-center w-10 aspect-square bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}