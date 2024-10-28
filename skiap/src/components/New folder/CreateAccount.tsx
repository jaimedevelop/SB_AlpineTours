import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Calendar, ArrowLeft, AlertCircle } from 'lucide-react';
import { createUser } from '../lib/db';
import { useAuth } from '../context/AuthContext';

export default function CreateAccount() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedResort = sessionStorage.getItem('selectedResort')
    ? JSON.parse(sessionStorage.getItem('selectedResort')!)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, token } = await createUser(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.age ? parseInt(formData.age, 10) : undefined
      );
      
      setAuth(user, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Account creation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during account creation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-white hover:text-white/80 transition-colors self-start flex items-center space-x-2 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-4">Create Account</h1>
        
        {selectedResort && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-8 w-full">
            <p className="text-white text-center">
              Create an account to book your stay at{' '}
              <span className="font-bold">{selectedResort.name}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center space-x-2 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-white pl-11"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="relative">
              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-white pl-11"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-white pl-11"
                required
                minLength={8}
              />
            </div>

            <div className="relative">
              <Calendar className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="number"
                name="age"
                placeholder="Age"
                min="13"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:border-white pl-11"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-blue-900 rounded-lg py-3 font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-white/60">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-white hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}