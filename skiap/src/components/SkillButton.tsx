import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SkillButtonProps {
  level: string;
  icon?: LucideIcon;
  customIcon?: React.ReactNode;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const colorMap = {
  green: 'bg-green-500 hover:bg-green-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  black: 'bg-gray-900 hover:bg-black',
};

export default function SkillButton({ level, icon: Icon, customIcon, color, isSelected, onClick }: SkillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-lg text-left transition-all duration-200 flex items-center space-x-3
        ${colorMap[color as keyof typeof colorMap]}
        ${isSelected ? 'ring-4 ring-white scale-105' : 'hover:scale-102'}
      `}
    >
      {Icon && <Icon className="w-6 h-6 text-white" />}
      {customIcon}
      <span className="text-white font-semibold">{level}</span>
    </button>
  );
}