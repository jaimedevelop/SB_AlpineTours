// QuizTimeSelector.tsx for the quiz
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, Check } from 'lucide-react'; // Added Check icon
import "react-datepicker/dist/react-datepicker.css";

// Enhanced calendar styles for better dual month display
const calendarStyles = `
  .react-datepicker {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
    margin: 0 auto !important;
  }
  .react-datepicker__month-container {
    float: none !important;
    margin: 0 8px !important;
  }
  .react-datepicker__day--in-range {
    background-color: #3B82F6 !important;
    color: white !important;
  }
  .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
    background-color: rgba(59, 130, 246, 0.5) !important;
  }
  .react-datepicker__day--selected, 
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background-color: #1D4ED8 !important;
    border-radius: 50% !important;
  }
`;

interface TimeSelectorProps {
  value: any;
  onChange: (value: any) => void;
}

export default function QuizTimeSelector({ value, onChange }: TimeSelectorProps) {
  // Initialize with existing value or defaults
  const [mode, setMode] = useState<'calendar' | 'flexible'>(value?.mode || 'calendar');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
    value?.startDate && value?.endDate 
      ? [new Date(value.startDate), new Date(value.endDate)] 
      : [null, null]
  );
  const [duration, setDuration] = useState<string>(value?.duration || '');
  const [selectedMonths, setSelectedMonths] = useState<string[]>(value?.months || []);
  const [includeWeekend, setIncludeWeekend] = useState(value?.includeWeekend || false);
  const [availableMonths, setAvailableMonths] = useState<Array<{name: string, year: number}>>([]);

  // Generate available months (current month + 5 months ahead)
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const months = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      months.push({
        name: [
          'January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
        ][monthIndex],
        year: year
      });
    }
    
    setAvailableMonths(months);
  }, []);

  // Update parent component whenever relevant state changes
  useEffect(() => {
    if (mode === 'calendar') {
      onChange({
        mode: 'calendar',
        startDate: dateRange[0],
        endDate: dateRange[1]
      });
    } else {
      onChange({
        mode: 'flexible',
        duration,
        months: selectedMonths,
        includeWeekend
      });
    }
  }, [mode, dateRange, duration, selectedMonths, includeWeekend, onChange]);

  const getMonthDisplay = (monthData: {name: string, year: number}) => {
    // Always show the month name and year, use abbreviated format for clean UI
    return `${monthData.name.slice(0, 3)} ${monthData.year}`;
  };
  
  const isMonthSelected = (monthData: {name: string, year: number}) => {
    // Always include year in the check to match how we store it
    const displayMonth = `${monthData.name} ${monthData.year}`;
    return selectedMonths.includes(displayMonth);
  };

  const handleMonthToggle = (monthData: {name: string, year: number}) => {
    // Always include year in the stored month name for consistency
    const displayMonth = `${monthData.name} ${monthData.year}`;
    
    setSelectedMonths(prev => 
      prev.includes(displayMonth) 
        ? prev.filter(m => m !== displayMonth)
        : [...prev, displayMonth]
    );
  };

  // Handle toggling the weekend checkbox
  const handleWeekendToggle = () => {
    // Only allow toggling if duration is not 6-7 days (which always includes weekends)
    if (duration !== '6-7') {
      setIncludeWeekend(!includeWeekend);
    }
  };

  return (
    <div className="w-full">
      <style>{calendarStyles}</style>
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/10 p-1 rounded-lg">
          <button
            onClick={() => setMode('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${mode === 'calendar' 
                ? 'bg-white text-blue-900' 
                : 'text-white hover:bg-white/20'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Specific Dates</span>
          </button>
          <button
            onClick={() => setMode('flexible')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${mode === 'flexible' 
                ? 'bg-white text-blue-900' 
                : 'text-white hover:bg-white/20'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Flexible Dates</span>
          </button>
        </div>
      </div>

      {mode === 'calendar' ? (
        <div className="bg-white p-4 rounded-lg shadow-lg flex justify-center">
          <DatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => {
              setDateRange(update);
            }}
            inline
            monthsShown={2} // Show two months at once
            className="w-full"
            minDate={new Date()} // Cannot select dates before today
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-4 text-white">Trip Length</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '1', label: '1 day' },
                { value: '2-3', label: '2-3 days' },
                { value: '4-5', label: '4-5 days' },
                { value: '6-7', label: '6-7 days' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setDuration(option.value);
                    if (option.value === '6-7') {
                      setIncludeWeekend(true);
                    }
                  }}
                  className={`p-3 rounded-lg text-left transition-all duration-200
                    ${duration === option.value 
                      ? 'bg-white text-blue-900' 
                      : 'bg-white/5 text-white hover:bg-white/20'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Weekend checkbox */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors
                    ${includeWeekend ? 'bg-white' : 'bg-white/20'}
                    ${duration === '6-7' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleWeekendToggle}
                >
                  {includeWeekend && <Check className="w-4 h-4 text-blue-900" />}
                </div>
                <span className={`text-white ${duration === '6-7' ? 'opacity-50' : ''}`}>
                  Must include weekend
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-3 text-white">Travel Timeframe</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableMonths.map((monthData, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthToggle(monthData)}
                  className={`py-2 px-2 text-sm rounded transition-all duration-200
                    ${isMonthSelected(monthData)
                      ? 'bg-white text-blue-900' 
                      : 'bg-white/5 text-white hover:bg-white/20'}`}
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