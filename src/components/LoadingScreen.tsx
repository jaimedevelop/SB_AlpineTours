import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Snowflake } from 'lucide-react';

const loadingMessages = [
  "Waxing your skis...",
  "Counting runs...",
  "Checking lift status...",
  "Measuring snow depth...",
  "Analyzing weather patterns...",
  "Grooming the slopes...",
  "Preparing trail maps...",
  "Checking avalanche conditions...",
  "Finding the perfect powder...",
  "Calculating vertical feet..."
];

const getRandomMessage = (previousMessage: string) => {
  let newMessage;
  do {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    newMessage = loadingMessages[randomIndex];
  } while (newMessage === previousMessage && loadingMessages.length > 1);
  return newMessage;
};

export default function LoadingScreen() {
  const [message, setMessage] = useState(loadingMessages[0]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(prevMessage => getRandomMessage(prevMessage));
    }, 1500);

    const navigationTimer = setTimeout(() => {
      navigate('/results', { state: location.state });
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(navigationTimer);
    };
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Snowflake className="w-16 h-16 text-white mb-8 mx-auto animate-spin" />
        <div className="h-8">
          <p className="text-white text-xl font-medium animate-fade-in">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}