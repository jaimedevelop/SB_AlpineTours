import React, { useState } from 'react';
import { Star, Calendar, Users, DollarSign, MapPin } from 'lucide-react';

const topResorts = [
  {
    name: 'Vail',
    location: 'Colorado',
    image: 'https://images.unsplash.com/photo-1544985361-b420d7a77f51?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    priceRange: '$$$',
    description: 'World-class skiing across 5,317 acres of terrain',
  },
  {
    name: 'Park City',
    location: 'Utah',
    image: 'https://images.unsplash.com/photo-1548532369-c7e27c697f1b?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    priceRange: '$$$',
    description: 'America\'s largest ski resort with 7,300 acres',
  },
  {
    name: 'Aspen Snowmass',
    location: 'Colorado',
    image: 'https://images.unsplash.com/photo-1548533001-9dc7d1b04016?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    priceRange: '$$$$',
    description: 'Four unique mountains with world-class amenities',
  },
];

const prePlannedTrips = [
  {
    title: 'Ultimate Colorado Adventure',
    duration: '7 days',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1544988796-d0421a0350dc?auto=format&fit=crop&q=80&w=800',
    people: '2-4',
    includes: ['3 Resort Access', 'Luxury Lodging', 'Equipment Rental', 'Guided Tours'],
  },
  {
    title: 'Utah Powder Week',
    duration: '5 days',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=800',
    people: '2-6',
    includes: ['2 Resort Access', 'Premium Lodging', 'Equipment Rental', 'Ski Lessons'],
  },
  {
    title: 'Vermont Family Getaway',
    duration: '4 days',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1586800779465-e89b31f6c8df?auto=format&fit=crop&q=80&w=800',
    people: '4-6',
    includes: ['Family Resort Access', 'Cozy Cabin', 'Family Lessons', 'Kids Activities'],
  },
];

export default function Explore() {
  const [selectedTab, setSelectedTab] = useState<'resorts' | 'trips'>('resorts');

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Explore</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedTab('resorts')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTab === 'resorts'
              ? 'bg-white text-blue-900'
              : 'text-white hover:bg-white/10'
          }`}
        >
          Top Rated Resorts
        </button>
        <button
          onClick={() => setSelectedTab('trips')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTab === 'trips'
              ? 'bg-white text-blue-900'
              : 'text-white hover:bg-white/10'
          }`}
        >
          Pre-Planned Trips
        </button>
      </div>

      {selectedTab === 'resorts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topResorts.map((resort) => (
            <div
              key={resort.name}
              className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/20 transition-colors"
            >
              <div className="aspect-video relative">
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{resort.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{resort.name}</h3>
                  <span className="text-white/60">{resort.priceRange}</span>
                </div>
                <div className="flex items-center text-white/60 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{resort.location}</span>
                </div>
                <p className="text-white/80 text-sm mb-4">{resort.description}</p>
                <button className="w-full bg-white text-blue-900 rounded-lg py-2 font-medium hover:bg-blue-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prePlannedTrips.map((trip) => (
            <div
              key={trip.title}
              className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/20 transition-colors"
            >
              <div className="aspect-video relative">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{trip.title}</h3>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-white/80">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{trip.people} people</span>
                  </div>
                </div>

                <div className="flex items-center text-white">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xl font-bold">{trip.price}</span>
                  <span className="text-white/60 ml-1">/person</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white/80 font-medium">Includes:</h4>
                  <ul className="text-white/60 text-sm space-y-1">
                    {trip.includes.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-white text-blue-900 rounded-lg py-2 font-medium hover:bg-blue-50 transition-colors">
                  Book Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}