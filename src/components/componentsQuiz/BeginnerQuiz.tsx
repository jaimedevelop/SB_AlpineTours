import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BudgetPlanner } from './BudgetPlanner';

interface QuizStep {
  currentStep: number;
  totalSteps: number;
}

export default function BeginnerQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  // Use a ref to track the previous budget amount to prevent circular updates
  const prevBudgetAmount = useRef("");
  
  const [formData, setFormData] = useState({
    address: '',
    tripDuration: '1',
    noTimeLimit: false,
    costType: 'total',
    costAmount: '200',
    interests: [] as string[]
  });

  const isStep1Valid = () => {
    return formData.address && (formData.noTimeLimit || formData.tripDuration);
  };

  const isStep2Valid = () => {
    return formData.costType && Number(formData.costAmount) > 0;
  };

  const isStep3Valid = () => {
    return formData.interests.length > 0;
  };

  // Modified to prevent circular updates
  const handleBudgetChange = (budgetAmount: string) => {
    // Only update if the value has actually changed
    if (budgetAmount !== prevBudgetAmount.current) {
      prevBudgetAmount.current = budgetAmount;
      setFormData(prev => ({
        ...prev,
        costAmount: budgetAmount
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Final Quiz Selections:');
    console.log('Starting Location:', formData.address);
    console.log('Trip Duration:', formData.noTimeLimit ? 'Flexible' : `${formData.tripDuration} days`);
    console.log('Budget:', formData.costType === 'daily' 
      ? `${formData.costAmount} per day` 
      : `${formData.costAmount} total`);
    console.log('Interests:', formData.interests.join(', '));

    navigate('/results');
  };
  
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
            setFormData({ 
              ...formData, 
              tripDuration: value.toString(),
              // Update costAmount based on trip duration if using total budget
              costAmount: formData.costType === 'total' ? (value * 200).toString() : formData.costAmount
            });
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
    <BudgetPlanner 
      tripLength={formData.noTimeLimit ? '1' : formData.tripDuration}
      onBudgetChange={handleBudgetChange}
    />
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
            onClick={() => {
              if (step === 3 && isStep3Valid()) {
                handleSubmit();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={
              (step === 1 && !isStep1Valid()) ||
              (step === 2 && !isStep2Valid()) ||
              (step === 3 && !isStep3Valid())
            }
            className={`flex items-center px-6 py-2 rounded-lg ${
              ((step === 1 && !isStep1Valid()) ||
               (step === 2 && !isStep2Valid()) ||
               (step === 3 && !isStep3Valid()))
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {step === 3 ? 'Submit' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}