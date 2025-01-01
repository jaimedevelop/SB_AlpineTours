import React from 'react';
import { Snowflake, Mountain, Trees, Bike, Baby, Trophy, Sparkles } from 'lucide-react';

const interests = [
  { id: 'ski-board', name: 'Ski & Board', icon: Snowflake },
  { id: 'terrain-park', name: 'Terrain Park', icon: Mountain },
  { id: 'backcountry', name: 'Backcountry', icon: Trees },
  { id: 'snowmobiling', name: 'Snowmobiling', icon: Bike },
  { id: 'snow-tubing', name: 'Snow Tubing', icon: Baby },
  { id: 'half-pipe', name: 'Half-Pipe', icon: Trophy },
  { id: 'night-skiing', name: 'Night Skiing', icon: Sparkles },
];

interface InterestSelectorProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export default function InterestSelector({ value = [], onChange }: InterestSelectorProps) {
  const toggleInterest = (id: string) => {
    const newValue = value.includes(id)
      ? value.filter(v => v !== id)
      : [...value, id];
    onChange(newValue);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {interests.map((interest) => {
        const Icon = interest.icon;
        const isSelected = value.includes(interest.id);

        return (
          <button
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className={`
              relative p-4 rounded-lg transition-all duration-300
              ${isSelected
                ? 'bg-white text-blue-900 ring-2 ring-white'
                : 'bg-white/5 hover:bg-white/10 text-white'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-6 h-6" />
              <span className="font-medium">{interest.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}