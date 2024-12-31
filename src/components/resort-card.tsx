import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Resort } from "@/types/resort";

interface ResortCardProps {
  resort: Resort;
}

export function ResortCard({ resort }: ResortCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
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
            {/* Hover View */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-sm text-gray-600">[Custom Feature Placeholder]</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}