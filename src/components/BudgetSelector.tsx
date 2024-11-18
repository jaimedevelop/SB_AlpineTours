import React from 'react';
import { DollarSign } from 'lucide-react';

const budgetRanges = [
  { 
    id: 'budget', 
    name: 'Budget', 
    range: '$0-$100 per day', 
    icon: 1,
    color: 'from-green-500 to-green-600'
  },
  { 
    id: 'moderate', 
    name: 'Moderate', 
    range: '$100-$200 per day', 
    icon: 2,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    range: '$200-$300 per day', 
    icon: 3,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    range: '$300+ per day', 
    icon: 4,
    color: 'from-yellow-500 to-yellow-600'
  },
];

interface BudgetSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function BudgetSelector({ value, onChange }: BudgetSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {budgetRanges.map((budget) => (
        <button
          key={budget.id}
          onClick={() => onChange(budget.id)}
          className={`
            relative p-4 rounded-lg
            ${value === budget.id ? 'ring-2 ring-white' : ''}
            group
          `}
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-white/5 rounded-lg" />
          
          {/* Gradient background with transition */}
          <div className={`
            absolute inset-0 bg-gradient-to-r ${budget.color}
            transition-opacity duration-300 ease-in-out rounded-lg
            ${value === budget.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `} />
          
          {/* Content */}
          <div className="relative flex items-center space-x-3">
            <div className="flex items-center text-white">
              {[...Array(budget.icon)].map((_, i) => (
                <DollarSign key={i} className="w-5 h-5" />
              ))}
            </div>
            <div className="text-left text-white">
              <div className="font-bold">{budget.name}</div>
              <div className="text-sm opacity-80">{budget.range}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}