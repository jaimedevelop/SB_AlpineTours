import React from 'react';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';

export default function UserInfo() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
            <Camera className="w-8 h-8 text-white/60" />
          </div>
          <button className="absolute bottom-0 right-0 bg-white text-blue-900 rounded-full p-2">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-white">John Doe</h1>
        <p className="text-white/60">Ski Enthusiast</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-white mb-2">
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </div>
          <p className="text-white/80 pl-8">john.doe@example.com</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-white mb-2">
            <Phone className="w-5 h-5" />
            <span>Phone</span>
          </div>
          <p className="text-white/80 pl-8">+1 (555) 123-4567</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-white mb-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </div>
          <p className="text-white/80 pl-8">Denver, Colorado</p>
        </div>
      </div>

      <button className="w-full mt-8 bg-white text-blue-900 rounded-lg py-3 font-semibold hover:bg-blue-50 transition-colors">
        Edit Profile
      </button>
    </div>
  );
}