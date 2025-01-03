import { Resort } from '../types/resort';

interface ResortInfoWindowProps {
  resort: Resort;
}

export function ResortInfoWindow({ resort }: ResortInfoWindowProps) {
  return (
    <div className="p-2 max-w-xs">
      <h3 className="font-bold text-lg mb-2">{resort.name}</h3>
      <div className="space-y-2">
        <p className="font-semibold">Run Difficulty:</p>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span>Beginner: {resort.green}%</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span>Intermediate: {resort.blue}%</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-black mr-2"></span>
            <span>Expert: {resort.black}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}