import React from 'react';
import { Circle, Square } from 'lucide-react';

const skillLevels = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'New to skiing or still learning the basics',
    baseColor: 'from-green-500 to-green-600',
    hoverColor: 'from-green-600 to-green-700',
    icon: Circle,
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Comfortable on blue runs',
    baseColor: 'from-blue-400 to-blue-500',
    hoverColor: 'from-blue-500 to-blue-600',
    icon: Square,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Confident on black diamond runs',
    baseColor: 'from-gray-800 to-black',
    hoverColor: 'from-black to-black',
    icon: Square,
    rotate: true,
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Master of double black diamonds',
    baseColor: 'from-gray-800 to-black',
    hoverColor: 'from-black to-black',
    icon: Square,
    rotate: true,
    doubleIcon: true,
    goldRing: true,
  },
];

interface SkillSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function SkillSelector({ value, onChange }: SkillSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {skillLevels.map((level) => {
        const Icon = level.icon;
        const isSelected = value === level.id;
        
        return (
          <button
            key={level.id}
            onClick={() => onChange(level.id)}
            className={`
              relative p-4 rounded-lg
              ${level.goldRing ? 'ring-2 ring-yellow-400' : ''}
              ${isSelected ? 'ring-2 ring-white' : ''}
              group
            `}
          >
            {/* Base gradient background */}
            <div className={`
              absolute inset-0 bg-gradient-to-r ${level.baseColor}
              transition-opacity duration-300 ease-in-out rounded-lg
            `} />
            
            {/* Hover/Selected gradient background */}
            <div className={`
              absolute inset-0 bg-gradient-to-r ${level.hoverColor}
              transition-opacity duration-300 ease-in-out rounded-lg
              opacity-0 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}
            `} />
            
            {/* Content */}
            <div className="relative flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {level.doubleIcon ? (
                  <>
                    <Icon className="w-6 h-6 text-white -rotate-45" />
                    <Icon className="w-6 h-6 text-white -rotate-45 ml-1" />
                  </>
                ) : (
                  <Icon className={`w-6 h-6 text-white ${level.rotate ? '-rotate-45' : ''}`} />
                )}
              </div>
              <div className="text-left text-white">
                <div className="font-bold">{level.name}</div>
                <div className="text-sm opacity-80">{level.description}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}