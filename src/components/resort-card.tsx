import { MapPin, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Mountain, Snowflake, Bike } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import type { Resort } from "@/types/types";

interface ResortCardProps {
  resort: Resort;
}

const amenityIcons = [
  { key: 'nightSkiing', icon: Moon, label: 'Night Skiing' },
  { key: 'backcountry', icon: Mountain, label: 'Back Country' }, 
  { key: 'iceSkating', icon: Bike, label: 'Ice Skating' },
  { key: 'snowmobile', icon: Bike, label: 'Snowmobile' },
  { key: 'snowTubing', icon: Snowflake, label: 'Snow Tubing' }
] as const;

const AmenityIcon = ({ 
  icon: Icon, 
  label, 
  isAvailable 
}: { 
  icon: typeof amenityIcons[number]['icon']; 
  label: string; 
  isAvailable: boolean;
}) => (
  <div 
    className="flex items-center gap-2 p-1 rounded-full"
    title={`${label} ${isAvailable ? 'Available' : 'Not Available'}`}
  >
    <div className={`p-1 rounded-full ${
      isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
    }`}>
      <Icon className="h-4 w-4" />
    </div>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

export function ResortCard({ resort }: ResortCardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Map all amenities with their availability status
  const allAmenities = amenityIcons.map(({ key, icon, label }) => ({
    key,
    icon,
    label,
    isAvailable: Boolean(resort[key as keyof typeof resort])
  }));

  const displayedAmenities = allAmenities.slice(0, 3);
  const remainingAmenities = allAmenities.slice(3);
  const hasMoreAmenities = remainingAmenities.length > 0;

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg bg-gray-50 border-blue-200"
      onMouseLeave={() => setIsPopoverOpen(false)}
    >
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>{resort.name}</span>
          {resort.terrainPark !== "-" && (
            <Badge variant="secondary" className="bg-white/20">
              Terrain Park
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center text-sm">
          <MapPin className="mr-1 h-4 w-4" />
          {resort.region}, {resort.state}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Side */}
          <div className="relative">
            {/* Default View */}
            <div className="transition-opacity duration-300 group-hover:opacity-0">
              <div className="flex flex-col gap-1">
                {resort.green !== "-" && (
                  <Badge variant="secondary" className="bg-green-500 text-white w-fit">
                    {resort.green} Green
                  </Badge>
                )}
                {resort.blue !== "-" && (
                  <Badge variant="secondary" className="bg-blue-500 text-white w-fit">
                    {resort.blue} Blue
                  </Badge>
                )}
                {resort.doubleBlue !== "-" && (
                  <Badge variant="secondary" className="bg-blue-700 text-white w-fit">
                    {resort.doubleBlue} Double Blue
                  </Badge>
                )}
                {resort.black !== "-" && (
                  <Badge variant="secondary" className="bg-gray-800 text-white w-fit">
                    {resort.black} Black
                  </Badge>
                )}
                {resort.doubleBlack !== "-" && (
                  <Badge variant="secondary" className="bg-black text-white w-fit">
                    {resort.doubleBlack} Double Black
                  </Badge>
                )}
              </div>
            </div>
            {/* Hover View */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-sm text-gray-600">
                {resort.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            {/* Default View */}
            <div className="transition-opacity duration-300 group-hover:opacity-0">
              <div className="flex flex-col gap-1">
                <div className="text-sm">
                  <span className="font-semibold">Full Day:</span> {resort.fullDayTicket}
                </div>
                {resort.halfDayTicket !== "-" && (
                  <div className="text-sm">
                    <span className="font-semibold">Half Day:</span> {resort.halfDayTicket}
                  </div>
                )}
              </div>
            </div>
            {/* Hover View - Amenity Icons */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-2">
                {displayedAmenities.map(({ key, icon, label, isAvailable }) => (
                  <AmenityIcon
                    key={key}
                    icon={icon}
                    label={label}
                    isAvailable={isAvailable}
                  />
                ))}
                {hasMoreAmenities && (
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
                        <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-gray-600">More</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 bg-white">
                      <div className="space-y-2">
                        {remainingAmenities.map(({ key, icon, label, isAvailable }) => (
                          <AmenityIcon
                            key={key}
                            icon={icon}
                            label={label}
                            isAvailable={isAvailable}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}