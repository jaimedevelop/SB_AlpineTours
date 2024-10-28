import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map, Star, X, Snowflake, ChevronRight } from 'lucide-react';

const resortsByRegion = {
  western: [
    { 
      name: 'Mammoth Mountain', 
      location: [37.6308, -119.0326], 
      rating: 4.8, 
      city: 'Mammoth Lakes', 
      state: 'CA', 
      image: 'https://images.unsplash.com/photo-1565896311009-382b9e813b19?auto=format&fit=crop&q=80&w=800',
      runs: {
        green: 25,
        blue: 40,
        black: 20,
        doubleBlack: 15
      },
      lifts: 28,
      description: "Mammoth Mountain is California's highest ski resort, reaching an elevation of 11,053 feet. Known for its long season and exceptional snow conditions, the resort offers diverse terrain for all skill levels and stunning views of the Sierra Nevada range."
    },
    { 
      name: 'Squaw Valley', 
      location: [39.1969, -120.2358], 
      rating: 4.7, 
      city: 'Olympic Valley', 
      state: 'CA', 
      image: 'https://images.unsplash.com/photo-1578593219307-c78da30cd9c9?auto=format&fit=crop&q=80&w=800',
      runs: {
        green: 20,
        blue: 35,
        black: 30,
        doubleBlack: 15
      },
      lifts: 30,
      description: "Home of the 1960 Winter Olympics, Squaw Valley offers world-class skiing across six peaks. The resort is known for its challenging terrain, extensive lift system, and vibrant base village."
    },
    { 
      name: 'Mt. Baker', 
      location: [48.8573, -121.6667], 
      rating: 4.6, 
      city: 'Deming', 
      state: 'WA', 
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800',
      runs: {
        green: 15,
        blue: 30,
        black: 35,
        doubleBlack: 20
      },
      lifts: 8,
      description: "Mt. Baker holds the world record for snowfall and is renowned for its deep powder, challenging terrain, and spectacular backcountry access. The resort maintains a local, uncrowded atmosphere despite its legendary status."
    }
  ],
  central: [
    {
      name: 'Granite Peak',
      location: [44.9319, -89.6832],
      rating: 4.3,
      city: 'Wausau',
      state: 'WI',
      image: 'https://images.unsplash.com/photo-1544752796-ec0b7a4f3c1e?auto=format&fit=crop&q=80&w=800',
      runs: {
        green: 20,
        blue: 30,
        black: 15,
        doubleBlack: 5
      },
      lifts: 7,
      description: "Wisconsin's largest ski area offering varied terrain for all skill levels with modern snowmaking and grooming capabilities."
    }
  ],
  rocky: [
    {
      name: 'Vail',
      location: [39.6061, -106.3550],
      rating: 4.8,
      city: 'Vail',
      state: 'CO',
      image: 'https://images.unsplash.com/photo-1544985361-b420d7a77f51?auto=format&fit=crop&q=80&w=800',
      runs: {
        green: 18,
        blue: 42,
        black: 25,
        doubleBlack: 15
      },
      lifts: 31,
      description: "One of the largest ski resorts in North America, featuring the legendary Back Bowls and Blue Sky Basin."
    }
  ],
  eastern: [
    {
      name: 'Killington',
      location: [43.6045, -72.8201],
      rating: 4.5,
      city: 'Killington',
      state: 'VT',
      image: 'https://images.unsplash.com/photo-1586800779465-e89b31f6c8df?auto=format&fit=crop&q=80&w=800',
      runs: {
        green: 28,
        blue: 33,
        black: 29,
        doubleBlack: 10
      },
      lifts: 22,
      description: "The largest ski resort in Eastern North America, known as 'The Beast of the East' for its diverse terrain and extensive snowmaking."
    }
  ]
};

interface Resort {
  name: string;
  location: [number, number];
  rating: number;
  city: string;
  state: string;
  image: string;
  runs: {
    green: number;
    blue: number;
    black: number;
    doubleBlack: number;
  };
  lifts: number;
  description: string;
}

export default function ResortList() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRegion = location.state?.region || 'western';
  const resorts = resortsByRegion[selectedRegion as keyof typeof resortsByRegion] || [];
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  const handleBookNow = (resort: Resort) => {
    // Save the selected resort to sessionStorage
    sessionStorage.setItem('selectedResort', JSON.stringify(resort));
    // Navigate to create account page
    navigate('/create-account');
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Ski Resorts</h1>
        <button
          onClick={() => navigate('/results', { state: { region: selectedRegion } })}
          className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Map className="w-5 h-5" />
          <span>Map View</span>
        </button>
      </div>

      {resorts.length === 0 ? (
        <div className="text-center text-white py-12">
          <p className="text-xl">No resorts found for this region.</p>
          <button
            onClick={() => navigate('/quiz')}
            className="mt-4 px-6 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Try Another Region
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map((resort) => (
            <div 
              key={resort.name} 
              className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-102"
              onClick={() => setSelectedResort(resort)}
            >
              <div className="relative h-48">
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{resort.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{resort.name}</h3>
                <p className="text-gray-600">
                  {resort.city}, {resort.state}
                </p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookNow(resort);
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resort Details Modal */}
      {selectedResort && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64">
              <img
                src={selectedResort.image}
                alt={selectedResort.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedResort(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedResort.name}</h2>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{selectedResort.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600">{selectedResort.city}, {selectedResort.state}</p>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Runs</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">Green Runs</span>
                      <span className="font-medium">{selectedResort.runs.green}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600">Blue Runs</span>
                      <span className="font-medium">{selectedResort.runs.blue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black">Black Runs</span>
                      <span className="font-medium">{selectedResort.runs.black}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black font-bold">Double Black</span>
                      <span className="font-medium">{selectedResort.runs.doubleBlack}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Lifts</h3>
                  <div className="flex items-center space-x-2">
                    <Snowflake className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{selectedResort.lifts} Available</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{selectedResort.description}</p>
              </div>

              <button
                onClick={() => handleBookNow(selectedResort)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Book Now</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}