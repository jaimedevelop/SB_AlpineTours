import React from 'react';

interface RunDifficultyBoxProps {
  green?: string;
  blue?: string;
  doubleBlue?: string;
  black?: string;
  doubleBlack?: string;
}

const RunDifficultyBox: React.FC<RunDifficultyBoxProps> = ({
  green,
  blue,
  doubleBlue,
  black,
  doubleBlack
}) => {
  // Convert percentage string to whole number (e.g., "45%" to 45)
  const parseRunNumber = (value: string | undefined): number | null => {
    if (!value || value === "-") return null;
    
    // Extract just the number part, removing % or any other characters
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  // Run difficulty data - now using whole numbers instead of percentages
  const difficultyLevels = [
    { 
      name: 'Green',
      value: parseRunNumber(green), 
      color: 'bg-gradient-to-r from-green-500 to-green-600', 
      textColor: 'text-white' 
    },
    { 
      name: 'Blue',
      value: parseRunNumber(blue), 
      color: 'bg-gradient-to-r from-blue-400 to-blue-500', 
      textColor: 'text-white' 
    },
    { 
      name: 'Double Blue',
      value: parseRunNumber(doubleBlue), 
      color: 'bg-gradient-to-r from-blue-700 to-blue-800', 
      textColor: 'text-white' 
    },
    { 
      name: 'Black',
      value: parseRunNumber(black), 
      color: 'bg-gradient-to-r from-gray-800 to-black', 
      textColor: 'text-white' 
    },
    { 
      name: 'Double Black',
      value: parseRunNumber(doubleBlack), 
      color: 'bg-gradient-to-r from-black to-black', 
      textColor: 'text-yellow-400' 
    }
  ].filter(level => level.value !== null);
  
  // Calculate equal width percentage based on actual number of difficulties present
  const equalWidth = difficultyLevels.length > 0 ? `${100 / difficultyLevels.length}%` : '100%';

  return (
    <div className="bg-blue-50 rounded-lg overflow-hidden flex flex-col">
      {/* Top row - just the title with padding */}
      <div className="p-4 pb-2">
        <div className="flex items-center text-blue-900">
          <span className="font-semibold">Run Difficulty</span>
        </div>
      </div>
      
      {/* Bottom row - difficulty indicators with full width */}
      {difficultyLevels.length > 0 ? (
        <div className="flex h-10 mt-auto">
          {difficultyLevels.map((level, index) => (
            <div 
              key={index}
              className={`${level.color} ${level.textColor} flex items-center justify-center text-sm font-medium`}
              style={{ width: equalWidth }}
            >
              {level.value}%
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 pt-0">
          <p className="text-gray-600">No difficulty data available</p>
        </div>
      )}
    </div>
  );
};

export default RunDifficultyBox;