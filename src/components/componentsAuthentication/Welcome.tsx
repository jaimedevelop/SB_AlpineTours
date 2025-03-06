import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, LogIn } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <Mountain className="w-20 h-20 text-white mb-4 mx-auto" />
        <h1 className="text-5xl font-bold text-white mb-4">S&B Alpine Tours</h1>
        <p className="text-blue-100 text-xl">Find your perfect skiing destination</p>
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => navigate('/quiz')}
          className="w-full py-4 px-6 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          Get Started
        </button>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="flex-1 py-4 px-6 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Log In</span>
          </button>
          
          <button 
            onClick={() => navigate('/create-account')}
            className="flex-1 py-4 px-6 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}