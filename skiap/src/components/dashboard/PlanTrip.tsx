import React, { useState } from 'react';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

export default function PlanTrip() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(500);
  
  // Get today's date and max date (2 years from now) in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  const [departDate, setDepartDate] = useState(today);
  const [returnDate, setReturnDate] = useState('');

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Plan Your Trip</h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((number) => (
            <div
              key={number}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= number ? 'bg-white text-blue-900' : 'bg-white/20 text-white'
              }`}
            >
              {number}
            </div>
          ))}
        </div>
        <div className="w-full bg-white/20 h-1 rounded-full">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <div className="space-y-6">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-white mb-4">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Trip Dates</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2 ml-1">Depart</label>
              <input
                type="date"
                min={today}
                max={maxDateStr}
                value={departDate}
                onChange={(e) => {
                  setDepartDate(e.target.value);
                  // If return date is before new depart date, update it
                  if (returnDate && returnDate < e.target.value) {
                    setReturnDate(e.target.value);
                  }
                }}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2 ml-1">Return</label>
              <input
                type="date"
                min={departDate}
                max={maxDateStr}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-white mb-4">
            <Users className="w-5 h-5" />
            <span className="font-medium">How many people?</span>
          </div>
          <input
            type="number"
            min="1"
            placeholder="Number of people"
            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-white mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Trip duration</span>
          </div>
          <select className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white [&>option]:text-gray-900">
            <option value="weekend">Weekend</option>
            <option value="week">1 Week</option>
            <option value="twoWeeks">2 Weeks</option>
          </select>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-white mb-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Budget per person</span>
            </div>
            <span className="font-medium">${budget}</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-white/60 text-sm mt-2">
            <span>$100</span>
            <span>$1000</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition-colors"
          >
            Previous
          </button>
        )}
        <button
          onClick={() => step < 4 ? setStep(step + 1) : null}
          className="flex-1 bg-white text-blue-900 rounded-lg py-3 font-medium hover:bg-blue-50 transition-colors"
        >
          {step === 4 ? 'Find Matches' : 'Next'}
        </button>
      </div>
    </div>
  );
}