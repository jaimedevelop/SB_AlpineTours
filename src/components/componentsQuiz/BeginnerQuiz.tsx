import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BudgetPlanner } from './BudgetPlanner';
import TimeSelector from './TimeSelector';

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
    timeSelection: {
      mode: 'calendar' as 'calendar' | 'flexible',
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
      duration: undefined as string | undefined,
      months: [] as string[],
      includeWeekend: false
    },
    costType: 'total',
    costAmount: '200',
    interests: [] as string[]
  });

  const isStep1Valid = () => {
    if (formData.address === '') return false;
    
    if (formData.timeSelection.mode === 'calendar') {
      return formData.timeSelection.startDate !== undefined && formData.timeSelection.endDate !== undefined;
    } else {
      return formData.timeSelection.duration !== undefined && formData.timeSelection.months.length > 0;
    }
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

  const handleTimeSelection = (dates: {
    mode: 'calendar' | 'flexible';
    startDate?: Date;
    endDate?: Date;
    duration?: string;
    months?: string[];
    includeWeekend?: boolean;
  }) => {
    setFormData(prev => ({
      ...prev,
      timeSelection: {
        mode: dates.mode,
        startDate: dates.startDate,
        endDate: dates.endDate,
        duration: dates.duration,
        months: dates.months || [],
        includeWeekend: dates.includeWeekend || false
      }
    }));
    
    // Update cost amount based on trip duration if using total budget
    if (dates.mode === 'calendar' && dates.startDate && dates.endDate) {
      const dayDiff = Math.ceil((dates.endDate.getTime() - dates.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (formData.costType === 'total' && dayDiff > 0) {
        const newAmount = (dayDiff * 200).toString();
        prevBudgetAmount.current = newAmount;
        setFormData(prev => ({
          ...prev,
          costAmount: newAmount
        }));
      }
    } else if (dates.mode === 'flexible' && dates.duration) {
      // Estimate duration based on selected range
      let durationDays = 1;
      if (dates.duration === '2-3') durationDays = 3;
      if (dates.duration === '4-5') durationDays = 5;
      if (dates.duration === '6-7') durationDays = 7;
      
      if (formData.costType === 'total') {
        const newAmount = (durationDays * 200).toString();
        prevBudgetAmount.current = newAmount;
        setFormData(prev => ({
          ...prev,
          costAmount: newAmount
        }));
      }
    }
  };

  const handleSubmit = () => {
    console.log('Final Quiz Selections:');
    console.log('Starting Location:', formData.address);
    
    if (formData.timeSelection.mode === 'calendar') {
      console.log('Trip Dates:', 
        formData.timeSelection.startDate?.toLocaleDateString(), 
        'to', 
        formData.timeSelection.endDate?.toLocaleDateString()
      );
    } else {
      console.log('Trip Duration:', formData.timeSelection.duration);
      console.log('Preferred Months:', formData.timeSelection.months.join(', '));
      console.log('Must Include Weekend:', formData.timeSelection.includeWeekend);
    }
    
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
          When do you want to travel?
        </label>
        <TimeSelector onSelect={handleTimeSelection} />
      </div>
    </div>
  );

  const renderCostStep = () => (
    <BudgetPlanner 
      tripLength={
        formData.timeSelection.mode === 'calendar' && formData.timeSelection.startDate && formData.timeSelection.endDate
          ? Math.ceil((formData.timeSelection.endDate.getTime() - formData.timeSelection.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
          : formData.timeSelection.mode === 'flexible' && formData.timeSelection.duration
            ? formData.timeSelection.duration === '2-3' ? '3'
              : formData.timeSelection.duration === '4-5' ? '5'
              : formData.timeSelection.duration === '6-7' ? '7'
              : '1'
            : '1'
      }
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