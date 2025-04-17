import React from 'react';
import { Thermometer, Wind, CloudSnow } from 'lucide-react';
import type { Resort } from '../../types/Resort';

interface DailyWeatherBoxProps {
  weatherData: Resort['weather'] | undefined;
  isLoading: boolean;
  error: string | null;
}

const DailyWeatherBox: React.FC<DailyWeatherBoxProps> = ({ 
  weatherData, 
  isLoading, 
  error 
}) => {
  // Helper to get weather icon based on condition
  const getWeatherIcon = () => {
    if (!weatherData) return <Thermometer size={20} />;
    
    const condition = weatherData.condition.toLowerCase();
    
    if (condition.includes('snow')) {
      return <CloudSnow size={20} />;
    } else {
      return <Thermometer size={20} />;
    }
  };

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  };

  // Convert centimeters to inches
  const cmToInches = (cm: number): number => {
    return Math.round(cm * 0.3937 * 10) / 10; // Round to 1 decimal place
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        {getWeatherIcon()}
        <span className="ml-2">Weather</span>
      </h3>
      
      {isLoading ? (
        <p className="text-gray-600">Loading weather data...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : weatherData ? (
        <div>
          <div className="flex items-center mb-2">
            <p className="text-xl mr-4">{weatherData.temperature ? celsiusToFahrenheit(weatherData.temperature) : '??'}°F</p>
            <p className="text-gray-600">{weatherData.condition}</p>
          </div>
          
          {weatherData.windSpeed && weatherData.windDirection && (
            <div className="flex items-center mb-2">
              <Wind size={16} className="mr-2 text-blue-700" />
              <span>{weatherData.windSpeed} {weatherData.windDirection}</span>
            </div>
          )}
          
          {weatherData.snowfall > 0 && (
            <div className="flex items-center mb-2">
              <CloudSnow size={16} className="mr-2 text-blue-700" />
              <span>Recent Snowfall: {cmToInches(weatherData.snowfall)} inches</span>
            </div>
          )}
          
          {weatherData.detailedForecast && (
            <p className="text-gray-700 mt-2">{weatherData.detailedForecast}</p>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No weather data available</p>
      )}
    </div>
  );
};

export default DailyWeatherBox;