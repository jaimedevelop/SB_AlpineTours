import React, { useState, useEffect } from 'react';
import { Thermometer, CloudSnow, CloudRain, Cloud, Sun } from 'lucide-react';

// Define weekly weather data interface
interface WeeklyWeatherData {
  day: string;
  date: string;
  temperature: {
    high: number;
    low: number;
  };
  condition: string;
  precipitation: number;
  icon?: string;
}

interface WeeklyWeatherBoxProps {
  latitude?: number;
  longitude?: number;
}

const WeeklyWeatherBox: React.FC<WeeklyWeatherBoxProps> = ({ latitude, longitude }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyWeatherData[]>([]);

  // Helper to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('snow')) {
      return <CloudSnow size={20} />;
    } else if (conditionLower.includes('rain')) {
      return <CloudRain size={20} />;
    } else if (conditionLower.includes('cloud')) {
      return <Cloud size={20} />;
    } else {
      return <Sun size={20} />;
    }
  };

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  };

  // Fetch weekly weather data
  useEffect(() => {
    const fetchWeeklyWeather = async () => {
      if (!latitude || !longitude) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Implement actual API call to get weekly forecast
        // This is placeholder data
        const mockData: WeeklyWeatherData[] = [
          { 
            day: 'Mon', 
            date: '4/10', 
            temperature: { high: 5, low: -2 }, 
            condition: 'Partly Cloudy', 
            precipitation: 10 
          },
          { 
            day: 'Tue', 
            date: '4/11', 
            temperature: { high: 3, low: -4 }, 
            condition: 'Snow', 
            precipitation: 60 
          },
          // Add more days...
        ];
        
        setWeeklyData(mockData);
      } catch (error) {
        console.error('Failed to fetch weekly weather data:', error);
        setError('Unable to load weekly forecast');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeeklyWeather();
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Thermometer size={20} />
          <span className="ml-2">7-Day Forecast</span>
        </h3>
        <p className="text-gray-600">Loading weekly forecast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Thermometer size={20} />
          <span className="ml-2">7-Day Forecast</span>
        </h3>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Thermometer size={20} />
        <span className="ml-2">7-Day Forecast</span>
      </h3>
      
      <div className="grid grid-cols-7 gap-1 mt-4">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="font-medium">{day.day}</div>
            <div className="text-xs text-gray-500">{day.date}</div>
            <div className="my-2">
              {getWeatherIcon(day.condition)}
            </div>
            <div className="text-sm font-medium">
              {celsiusToFahrenheit(day.temperature.high)}°
            </div>
            <div className="text-xs text-gray-500">
              {celsiusToFahrenheit(day.temperature.low)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWeatherBox;