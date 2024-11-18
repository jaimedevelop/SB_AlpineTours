import React, { useState } from 'react';
import { Settings, User, Map, Home, Compass } from 'lucide-react';
import UserInfo from './dashboard/UserInfo';
import SettingsPage from './dashboard/SettingsPage';
import Explore from './dashboard/YourResorts';
import PlanTrip from './dashboard/PlanTrip';
import SavedResorts from './dashboard/SavedResorts';

const tabs = [
  { id: 'plan', label: 'Plan A Trip', icon: Map },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'user', label: 'User Info', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('saved');

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsPage />;
      case 'user':
        return <UserInfo />;
      case 'explore':
        return <Explore />;
      case 'plan':
        return <PlanTrip />;
      case 'saved':
        return <SavedResorts />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Content Area */}
      <div className="pb-24">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-lg mx-auto px-4 relative">
          {/* Home Button */}
          <button
            onClick={() => setActiveTab('saved')}
            className="absolute left-1/2 -translate-x-1/2 -top-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors"
          >
            <Home className="w-8 h-8 text-blue-900" />
          </button>

          <div className="flex justify-between py-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center py-3 px-4 relative
                    ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80'}
                    transition-colors duration-200
                    ${index === 1 ? 'mr-16' : ''}
                    ${index === 2 ? 'ml-16' : ''}
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{tab.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-2 right-2 h-0.5 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}