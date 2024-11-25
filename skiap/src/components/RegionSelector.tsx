import React from 'react';
import { MapPin } from 'lucide-react';

const regions = [
  {
    id: 'western',
    name: 'Western',
    image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&q=80&w=800',
    description: 'Pacific Coast mountains with deep powder',
  },
  {
    id: 'central',
    name: 'Central',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800',
    description: 'Midwest slopes perfect for learning',
  },
  {
    id: 'rocky',
    name: 'Rocky',
    image: 'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?auto=format&fit=crop&q=80&w=800',
    description: 'High altitude peaks with varied terrain',
  },
  {
    id: 'eastern',
    name: 'Eastern',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80&w=800',
    description: 'Classic New England skiing experience',
  },
];

interface RegionSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function RegionSelector({
  value,
  onChange,
}: RegionSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={() => onChange(region.id)}
          className={`relative overflow-hidden rounded-xl aspect-video group transition-all duration-300 ${
            value === region.id
              ? 'ring-4 ring-white scale-102'
              : 'hover:scale-102'
          }`}
        >
          <img
            src={region.image}
            alt={region.name}
            className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4">
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="w-5 h-5" />
                <h3 className="text-xl font-bold">{region.name}</h3>
              </div>
              <p className="text-white/80 text-sm">{region.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}