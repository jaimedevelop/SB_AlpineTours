import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RegionSelector from './RegionSelector';
import SkillSelector from './SkillSelector';
import BudgetSelector from './BudgetSelector';
import InterestSelector from './InterestSelector';

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    {
      id: 'region',
      title: 'What region are you going to ski in?',
      component: RegionSelector,
    },
    {
      id: 'skill',
      title: 'What is your skill level?',
      component: SkillSelector,
    },
    {
      id: 'budget',
      title: 'What is your budget?',
      component: BudgetSelector,
    },
    {
      id: 'interests',
      title: 'What are your interests?',
      component: InterestSelector,
    },
  ];

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleComplete = () => {
    navigate('/loading', { state: answers });
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      // Reset answers and navigate back to welcome page
      setAnswers({});
      navigate('/');
    } else {
      setCurrentQuestion(c => Math.max(0, c - 1));
    }
  };

  const CurrentQuestionComponent = questions[currentQuestion].component;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {questions[currentQuestion].title}
          </h2>
          <div className="w-full bg-white/10 h-2 rounded-full">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <CurrentQuestionComponent
          value={answers[questions[currentQuestion].id]}
          onChange={(value: any) => handleAnswer(questions[currentQuestion].id, value)}
        />

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{currentQuestion === 0 ? 'Start Over' : 'Previous'}</span>
          </button>

          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(c => c + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!answers[questions[currentQuestion].id]}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-blue-900 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Find Matches' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}