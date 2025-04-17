import React from 'react';

interface PreferenceMatchProps {
  matchPercentage: number;
}

const PreferenceMatch: React.FC<PreferenceMatchProps> = ({ matchPercentage }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Preference Match</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${matchPercentage}%` }}
        ></div>
      </div>
      <p className="text-right mt-1 text-sm text-gray-600">{matchPercentage}% match to your preferences</p>
    </div>
  );
};

export default PreferenceMatch;