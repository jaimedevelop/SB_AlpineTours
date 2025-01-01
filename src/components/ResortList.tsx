import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import { ResortGrid } from './resort-grid';

export default function ResortList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Ski Resorts</h1>
        <button
          onClick={() => navigate('/results')}
          className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Map className="w-5 h-5" />
          <span>Map View</span>
        </button>
      </div>

      <ResortGrid />
    </div>
  );
}