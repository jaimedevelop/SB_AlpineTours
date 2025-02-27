import React, { useState, useEffect } from 'react';
import { TotalCostCalculator } from './TotalCostCalculator';

interface FormData {
  costType: 'daily' | 'total' | '';
  costAmount: string;
  tripLength: string;
}

interface BudgetPlannerProps {
  tripLength: string;
  onBudgetChange?: (budgetAmount: string) => void;
}

export function BudgetPlanner({ tripLength, onBudgetChange }: BudgetPlannerProps) {
  const [formData, setFormData] = useState<FormData>({
    costType: 'total',
    costAmount: (parseInt(tripLength || '1') * 200).toString(), // Calculate initial amount based on tripLength
    tripLength: tripLength || '1'
  });

  // Update local state when tripLength prop changes
  useEffect(() => {
    if (tripLength !== formData.tripLength) {
      const newTripLength = tripLength || '1';
      setFormData(prev => ({
        ...prev,
        tripLength: newTripLength,
        costAmount: (parseInt(newTripLength) * 200).toString() // Update cost based on new trip length
      }));
    }
  }, [tripLength]);

  // Notify parent component when budget amount changes
  useEffect(() => {
    if (onBudgetChange) {
      onBudgetChange(formData.costAmount);
    }
  }, [formData.costAmount, onBudgetChange]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Trip Budget Planner</h1>
      
      <div className="space-y-6">
        <style>{`
          input[type="range"]::before {
            content: '';
            width: var(--percent);
          }
        `}</style>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Total Budget
            </label>
            <span className="text-sm font-medium text-indigo-600">
              ${formData.costAmount}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={formData.costAmount}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 relative before:absolute before:h-2 before:rounded-l-lg before:bg-indigo-600"
            style={{
              '--percent': `${(Number(formData.costAmount) / 10000) * 100}%`
            } as React.CSSProperties}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.setProperty('--percent', `${(Number(target.value) / 10000) * 100}%`);
              setFormData({ ...formData, costAmount: target.value });
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$10,000</span>
          </div>
        </div>
        <TotalCostCalculator amount={formData.costAmount} tripLength={formData.tripLength} />
      </div>
    </div>
  );
}