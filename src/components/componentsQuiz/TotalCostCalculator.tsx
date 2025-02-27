import React, { useState, useEffect } from 'react';
import { SkipBack as Ski, Home, UtensilsCrossed, Plus } from 'lucide-react';

interface CostCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  amount: string;
  percentage: number;
}

interface TotalCostCalculatorProps {
  amount: string;
  tripLength: string;
}

export function TotalCostCalculator({ amount, tripLength }: TotalCostCalculatorProps) {
  const [categories, setCategories] = useState<CostCategory[]>([
    {
      id: 'lift-tickets',
      title: 'Lift Tickets',
      icon: <Ski className="w-5 h-5" />,
      amount: '0',
      percentage: 30
    },
    {
      id: 'lodging',
      title: 'Lodging',
      icon: <Home className="w-5 h-5" />,
      amount: '0',
      percentage: 50
    },
    {
      id: 'food',
      title: 'Food & Dining',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      amount: '0',
      percentage: 20
    }
  ]);

  // Update category amounts when total budget changes
  useEffect(() => {
    const totalBudget = Number(amount);
    setCategories(categories.map(category => ({
      ...category,
      amount: Math.round(totalBudget * (category.percentage / 100)).toString()
    })));
  }, [amount]);

  const handleSliderChange = (categoryId: string, newAmount: string) => {
    const totalBudget = Number(amount);
    const newAmountNum = Number(newAmount);
    
    // Calculate new percentage for the changed category
    const newPercentage = Math.min((newAmountNum / totalBudget) * 100, 100);
    
    // Find the current category and other categories
    const currentCategory = categories.find(c => c.id === categoryId)!;
    const otherCategories = categories.filter(c => c.id !== categoryId);
    
    // Calculate remaining percentage for other categories
    const remainingPercentage = Math.max(100 - newPercentage, 0);
    
    // Get the total percentage of other categories
    const totalOtherPercentage = otherCategories.reduce((sum, c) => sum + c.percentage, 0);
    
    // Update all categories with new percentages and amounts
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          amount: newAmount,
          percentage: newPercentage
        };
      } else {
        // If there's no remaining percentage, set others to 0
        if (remainingPercentage === 0) {
          return {
            ...category,
            percentage: 0,
            amount: '0'
          };
        }
        
        // Distribute remaining percentage proportionally
        const adjustmentFactor = totalOtherPercentage === 0 
          ? remainingPercentage / otherCategories.length 
          : (remainingPercentage * category.percentage) / totalOtherPercentage;
        
        const newCategoryAmount = Math.round(totalBudget * (adjustmentFactor / 100));
        
        return {
          ...category,
          percentage: adjustmentFactor,
          amount: newCategoryAmount.toString()
        };
      }
    }));
  };

  const getDailyCost = (totalAmount: string): string => {
    const days = parseInt(tripLength, 10);
    if (days <= 0) return '0';
    return Math.round(parseInt(totalAmount, 10) / days).toString();
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <style>{`
        input[type="range"].category-slider::before {
          content: '';
          position: absolute;
          height: 0.5rem;
          left: 0;
          width: var(--percent);
          background-color: #4f46e5;
          border-radius: 0.5rem 0 0 0.5rem;
        }
      `}</style>

      <h3 className="text-lg font-semibold text-gray-900 mb-6">Total Trip Cost Breakdown</h3>
      
      <div className="space-y-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">{category.icon}</div>
                <span className="font-medium text-gray-800">{category.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-600 font-medium">${category.amount}</span>
                <span className="text-gray-400">({Math.round(category.percentage)}%)</span>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={amount}
                step="50"
                value={category.amount}
                onChange={(e) => handleSliderChange(category.id, e.target.value)}
                className="category-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 relative"
                style={{
                  '--percent': `${(Number(category.amount) / Number(amount)) * 100}%`
                } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>${amount}</span>
              </div>
            </div>
          </div>
        ))}

        <button
          className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-600 hover:border-gray-400 flex items-center justify-center space-x-2 transition-colors"
          disabled
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="text-gray-500">
          <p>Based on total budget: ${amount}</p>
          <p>Trip length: {tripLength} days</p>
        </div>
        <div className="pt-4 border-t border-gray-200 space-y-1">
          <p className="text-gray-700 font-medium">Daily Cost Breakdown:</p>
          {categories.map(category => (
            <p key={`daily-${category.id}`} className="text-gray-600">
              {category.title} cost per day: <span className="font-medium text-indigo-600">${getDailyCost(category.amount)}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}