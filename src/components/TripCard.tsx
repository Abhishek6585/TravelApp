import { MapPin, Calendar, Car, Leaf } from "lucide-react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useTheme } from "../contexts/ThemeContext";

interface TripCardProps {
  origin: string;
  destination: string;
  date: string;
  mode: string;
  distance: string;
  carbonFootprint: string;
  status?: "completed" | "ongoing" | "planned";
}

export function TripCard({ 
  origin, 
  destination, 
  date, 
  mode, 
  distance, 
  carbonFootprint,
  status = "completed" 
}: TripCardProps) {
  const { actualTheme } = useTheme();
  const getModeIcon = (transportMode: string) => {
    switch (transportMode.toLowerCase()) {
      case 'auto':
      case 'auto-rickshaw':
        return '🛺';
      case 'bus':
        return '🚌';
      case 'boat':
        return '⛵';
      case 'car':
        return '🚗';
      case 'bike':
        return '🏍️';
      case 'walk':
        return '🚶';
      default:
        return '🚗';
    }
  };

  const getStatusColor = (status: string) => {
    const isDark = actualTheme === 'dark';
    switch (status) {
      case 'completed':
        return isDark ? 'bg-green-900/50 text-green-300 border-green-800' : 'bg-green-100 text-green-800';
      case 'ongoing':
        return isDark ? 'bg-blue-900/50 text-blue-300 border-blue-800' : 'bg-blue-100 text-blue-800';
      case 'planned':
        return isDark ? 'bg-orange-900/50 text-orange-300 border-orange-800' : 'bg-orange-100 text-orange-800';
      default:
        return isDark ? 'bg-gray-800/50 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`w-full mb-4 transition-all duration-200 border-l-4 border-l-green-500 ${
      actualTheme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700/50 shadow-lg shadow-gray-900/20 hover:bg-gray-800/70' 
        : 'bg-white/80 shadow-sm hover:shadow-md backdrop-blur-sm'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <span className="text-xl">{getModeIcon(mode)}</span>
            </div>
            <div>
              <h3 className={`font-medium ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {origin} → {destination}
              </h3>
              <div className={`flex items-center gap-1 mt-1 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{date}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(status)} rounded-full px-3 py-1`} variant="secondary">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center text-center">
            <MapPin className={`w-4 h-4 mb-1 ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className={`text-xs ${
              actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Distance
            </p>
            <p className={`font-medium ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {distance}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Car className={`w-4 h-4 mb-1 ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className={`text-xs ${
              actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Mode
            </p>
            <p className={`font-medium capitalize ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {mode}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Leaf className={`w-4 h-4 mb-1 ${
              actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
            <p className={`text-xs ${
              actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              CO₂
            </p>
            <p className={`font-medium ${
              actualTheme === 'dark' ? 'text-green-300' : 'text-green-700'
            }`}>
              {carbonFootprint}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}