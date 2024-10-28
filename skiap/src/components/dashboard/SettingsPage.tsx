import React from 'react';
import { Bell, Moon, Globe, Shield, ChevronRight } from 'lucide-react';

const settings = [
  {
    category: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'darkMode', label: 'Dark Mode', icon: Moon },
      { id: 'language', label: 'Language', icon: Globe },
    ],
  },
  {
    category: 'Privacy & Security',
    items: [
      { id: 'privacy', label: 'Privacy Settings', icon: Shield },
      { id: 'security', label: 'Security', icon: Shield },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      <div className="space-y-6">
        {settings.map((section) => (
          <div key={section.category}>
            <h2 className="text-white/80 text-sm font-medium mb-2">{section.category}</h2>
            <div className="bg-white/10 rounded-xl overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between p-4 text-white hover:bg-white/5 transition-colors"
                    style={{
                      borderTop: index > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}