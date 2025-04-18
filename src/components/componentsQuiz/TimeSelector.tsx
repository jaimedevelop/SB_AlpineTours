import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, Check } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface TimeSelectorProps {
  onSelect: (dates: {
    mode: 'calendar' | 'flexible';
    startDate?: Date;
    endDate?: Date;
    duration?: string;
    months?: string[];
    includeWeekend?: boolean;
  }) => void;
}

const DURATION_OPTIONS = [
  { value: '1', label: '1 day' },
  { value: '2-3', label: '2-3 days' },
  { value: '4-5', label: '4-5 days' },
  { value: '6-7', label: '6-7 days' },
];

// Full array of month names for reference
const ALL_MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export default function TimeSelector({ onSelect }: TimeSelectorProps) {
  const [mode, setMode] = useState<'calendar' | 'flexible'>('calendar');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [duration, setDuration] = useState<string>('');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [availableMonths, setAvailableMonths] = useState<Array<{name: string, year: number}>>([]);

  // Generate available months (current month + 5 months ahead)
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();
    
    const months = [];
    
    for (let i = 0; i < 6; i++) {
      // Calculate the month index and year, handling year wraparound
      const monthIndex = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      
      months.push({
        name: ALL_MONTHS[monthIndex],
        year: year
      });
    }
    
    setAvailableMonths(months);
  }, []);

  const handleModeSelect = (newMode: 'calendar' | 'flexible') => {
    setMode(newMode);
    if (newMode === 'calendar') {
      onSelect({ mode: 'calendar', startDate: dateRange[0] ?? undefined, endDate: dateRange[1] ?? undefined });
    } else {
      onSelect({ mode: 'flexible', duration, months: selectedMonths, includeWeekend });
    }
  };

  const handleDurationSelect = (selectedDuration: string) => {
    setDuration(selectedDuration);
    const shouldIncludeWeekend = selectedDuration === '6-7';
    setIncludeWeekend(shouldIncludeWeekend);
    onSelect({ 
      mode: 'flexible', 
      duration: selectedDuration, 
      months: selectedMonths, 
      includeWeekend: shouldIncludeWeekend 
    });
  };

  const handleMonthToggle = (monthData: {name: string, year: number}) => {
    // Format the month with year if it's a different year than the current year
    const currentYear = new Date().getFullYear();
    const displayMonth = monthData.year !== currentYear 
      ? `${monthData.name} ${monthData.year}` 
      : monthData.name;
    
    setSelectedMonths(prev => 
      prev.includes(displayMonth) 
        ? prev.filter(m => m !== displayMonth)
        : [...prev, displayMonth]
    );
    
    onSelect({
      mode: 'flexible',
      duration,
      months: selectedMonths.includes(displayMonth)
        ? selectedMonths.filter(m => m !== displayMonth)
        : [...selectedMonths, displayMonth],
      includeWeekend
    });
  };

  // Function to display month name with year if different from current year
  const getMonthDisplay = (monthData: {name: string, year: number}) => {
    const currentYear = new Date().getFullYear();
    if (monthData.year !== currentYear) {
      return `${monthData.name.slice(0, 3)} '${monthData.year.toString().slice(2)}`;
    }
    return monthData.name.slice(0, 3);
  };
  
  // Function to check if a month is selected
  const isMonthSelected = (monthData: {name: string, year: number}) => {
    const currentYear = new Date().getFullYear();
    const displayMonth = monthData.year !== currentYear 
      ? `${monthData.name} ${monthData.year}` 
      : monthData.name;
    
    return selectedMonths.includes(displayMonth);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleModeSelect('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${mode === 'calendar' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-200'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => handleModeSelect('flexible')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${mode === 'flexible' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-200'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Flexible Dates</span>
          </button>
        </div>
      </div>

      {mode === 'calendar' ? (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <DatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => {
              setDateRange(update);
              onSelect({ 
                mode: 'calendar', 
                startDate: update[0] ?? undefined, 
                endDate: update[1] ?? undefined 
              });
            }}
            inline
            className="w-full"
            minDate={new Date()} // Cannot select dates before today
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">How long do you want to stay?</h3>
            <div className="grid grid-cols-2 gap-3">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDurationSelect(option.value)}
                  className={`p-3 rounded-lg text-left transition-all duration-200
                    ${duration === option.value 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors
                    ${includeWeekend ? 'bg-indigo-600' : 'bg-gray-200'}
                    ${duration === '6-7' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (duration !== '6-7') {
                      setIncludeWeekend(!includeWeekend);
                      onSelect({ 
                        mode: 'flexible', 
                        duration, 
                        months: selectedMonths, 
                        includeWeekend: !includeWeekend 
                      });
                    }
                  }}
                >
                  {includeWeekend && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={duration === '6-7' ? 'opacity-50' : ''}>Must include weekend</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-center">When would you like to travel?</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableMonths.map((monthData, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthToggle(monthData)}
                  className={`py-2 px-2 text-sm rounded transition-all duration-200
                    ${isMonthSelected(monthData)
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {getMonthDisplay(monthData)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}