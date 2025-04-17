import React from 'react';

interface DifficultyLevel {
  name: string;
  value: number | null;
  color: string;
  textColor: string;
}

interface TrailInformationProps {
  runs?: string;
  difficultyLevels: DifficultyLevel[];
}

const TrailInformation: React.FC<TrailInformationProps> = ({ 
  runs, 
  difficultyLevels 
}) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Trail Information</h3>
      {runs && <p className="text-gray-700">Total Run Distribution: {runs}</p>}
      
      {difficultyLevels.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-1">Difficulty Breakdown:</p>
          <div className="space-y-1">
            {difficultyLevels.map((level, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 ${level.color} rounded mr-2`}></div>
                <span className="text-sm">{level.name}: {level.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailInformation;