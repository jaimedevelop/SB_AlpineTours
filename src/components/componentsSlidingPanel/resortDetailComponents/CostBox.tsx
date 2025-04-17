import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

interface CostBoxProps {
  ticketCost?: number | string;
  fullDayTicket?: string;
  halfDayTicket?: string;
}

const CostBox: React.FC<CostBoxProps> = ({ 
  ticketCost, 
  fullDayTicket, 
  halfDayTicket 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the primary ticket cost (from ticketCost or fullDayTicket)
  const primaryCost = fullDayTicket 
    ? (fullDayTicket.startsWith('$') ? fullDayTicket.substring(1) : fullDayTicket)
    : (ticketCost ? (typeof ticketCost === 'string' && ticketCost.startsWith('$') 
        ? ticketCost.substring(1) 
        : String(ticketCost)) 
      : '??');
  
  // Format half day ticket cost
  const secondaryCost = halfDayTicket
    ? (halfDayTicket.startsWith('$') ? halfDayTicket.substring(1) : halfDayTicket)
    : null;
  
  // Only enable toggle functionality if we have half day ticket data
  const canToggle = Boolean(secondaryCost);
  
  const handleMouseEnter = () => {
    if (canToggle) setIsExpanded(true);
  };
  
  const handleMouseLeave = () => {
    if (canToggle) setIsExpanded(false);
  };
  
  const handleClick = () => {
    if (canToggle) setIsExpanded(prevState => !prevState);
  };

  return (
    <div 
      className={`bg-blue-50 p-4 rounded-lg h-full flex flex-col justify-center ${canToggle ? 'cursor-pointer' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role={canToggle ? "button" : undefined}
      aria-expanded={isExpanded}
      tabIndex={canToggle ? 0 : undefined}
    >
      <div className="flex items-center text-blue-900">
        <DollarSign size={20} className="mr-2" />
        <span className="font-semibold">Lift Ticket</span>
        {canToggle && (
          <span className="ml-auto text-xs text-blue-600 opacity-60">
            {isExpanded ? "" : "Tap for details"}
          </span>
        )}
      </div>
      
      <div className="mt-2">
        {isExpanded && canToggle ? (
          <div className="flex justify-between animate-fade-in">
            <div>
              <div className="text-sm text-blue-700">Full Day</div>
              <div className="text-xl font-medium">${primaryCost}</div>
            </div>
            <div>
              <div className="text-sm text-blue-700">Half Day</div>
              <div className="text-xl font-medium">${secondaryCost}</div>
            </div>
          </div>
        ) : (
          <p className="text-xl">${primaryCost}</p>
        )}
      </div>
    </div>
  );
};

export default CostBox;