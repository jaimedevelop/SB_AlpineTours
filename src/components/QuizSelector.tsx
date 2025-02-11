import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Brain } from 'lucide-react';

const quizOptions = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'Perfect for first-time travelers',
    image: '/images/skiBeginner',
    icon: Compass
  },
  {
    id: 'experienced',
    title: 'Experienced',
    subtitle: 'For seasoned adventurers',
    image: '/images/skiExperienced',
    icon: Brain
  }
];

export default function QuizSelector() {
  const navigate = useNavigate();

  const handleQuizSelection = (id: string) => {
    if (id === 'beginner') {
      navigate('/quiz/beginner');
    } else {
      navigate('/quiz/experienced');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-white mb-2">Travel Quiz</h1>
      <p className="text-center text-gray-200 mb-12">Choose your experience level to get started</p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {quizOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleQuizSelection(option.id)}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] transition-transform hover:scale-[1.02]"
          >
            <img
              src={option.image}
              alt={option.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <option.icon className="w-12 h-12 mb-4 opacity-90" />
                <h2 className="text-3xl font-bold mb-2">{option.title}</h2>
                <p className="text-lg text-white/80">{option.subtitle}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}