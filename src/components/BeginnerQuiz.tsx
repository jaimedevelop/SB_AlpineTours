import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizStep {
  currentStep: number;
  totalSteps: number;
}

export default function BeginnerQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    tripDuration: '',
    noTimeLimit: false,
    costType: '',
    costAmount: '0',
    interests: [] as string[]
  });

  const StepIndicator = ({ currentStep, totalSteps }: QuizStep) => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i + 1 === currentStep ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Where are you starting from?
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter your address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How long do you want your trip to be?
        </label>
        <input
          type="number"
          min="1"
          max="30"
          value={formData.tripDuration}
          onChange={(e) => {
            const value = Math.min(Math.max(1, Number(e.target.value)), 30);
            setFormData({ ...formData, tripDuration: value.toString() });
          }}
          placeholder="Enter number of days (1-30)"
          disabled={formData.noTimeLimit}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            formData.noTimeLimit ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.noTimeLimit}
            onChange={(e) => setFormData({ 
              ...formData, 
              noTimeLimit: e.target.checked,
              tripDuration: e.target.checked ? '' : formData.tripDuration 
            })}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Duration is flexible</span>
        </label>
      </div>
    </div>
  );

const renderCostStep = () => (
    <div className="space-y-6">
      <style>{`
        input[type="range"]::before {
          content: '';
          width: var(--percent);
        }
      `}</style>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How would you like to plan your budget?
        </label>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { id: 'daily', label: 'Cost per Day' },
            { id: 'total', label: 'Total Trip Cost' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFormData({ ...formData, costType: id, costAmount: '0' })}
              className={`p-4 border rounded-xl transition-all ${
                formData.costType === id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <span className={formData.costType === id ? 'text-indigo-600' : 'text-gray-700'}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {formData.costType && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {formData.costType === 'daily' ? 'Daily Budget' : 'Total Budget'}
            </label>
            <span className="text-sm font-medium text-indigo-600">
              ${formData.costAmount}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={formData.costType === 'daily' ? '500' : '10000'}
            step={formData.costType === 'daily' ? '10' : '100'}
            value={formData.costAmount}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0 relative before:absolute before:h-2 before:rounded-l-lg before:bg-indigo-600"
            style={{
              '--percent': `${(Number(formData.costAmount) / (formData.costType === 'daily' ? 500 : 10000)) * 100}%`
            }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.setProperty('--percent', `${(Number(target.value) / (formData.costType === 'daily' ? 500 : 10000)) * 100}%`);
              setFormData({ ...formData, costAmount: target.value });
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>${formData.costType === 'daily' ? '500' : '10,000'}</span>
          </div>
        </div>
      )}
    </div>
  );
  
      
      

  const renderInterestsStep = () => {
    const interests = [
      'Sightseeing',
      'Food & Dining',
      'Shopping',
      'Museums',
      'Outdoor Activities',
      'Nightlife',
      'Local Culture',
      'Relaxation'
    ];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What interests you during your trip?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => {
                const newInterests = formData.interests.includes(interest)
                  ? formData.interests.filter(i => i !== interest)
                  : [...formData.interests, interest];
                setFormData({ ...formData, interests: newInterests });
              }}
              className={`p-3 border rounded-lg transition-all ${
                formData.interests.includes(interest)
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <StepIndicator currentStep={step} totalSteps={3} />
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {step === 1 && renderLocationStep()}
        {step === 2 && renderCostStep()}
        {step === 3 && renderInterestsStep()}
        
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={step === 1 ? () => navigate('/quiz') : () => setStep(step - 1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? 'Back to Selection' : 'Previous'}
          </button>
          
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 3}
            className={`flex items-center px-6 py-2 rounded-lg ${
              step === 3
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}