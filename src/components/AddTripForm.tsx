import { useState } from "react";
import { MapPin, Calendar, Car, Plus } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

interface AddTripFormProps {
  onAddTrip: (trip: any) => void;
  onClose: () => void;
}

export function AddTripForm({ onAddTrip, onClose }: AddTripFormProps) {
  const { t } = useLanguage();
  const { actualTheme } = useTheme();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    mode: "",
    distance: "",
    notes: ""
  });

  const transportModes = [
    { value: "auto", label: t.auto, emoji: "🛺" },
    { value: "bus", label: t.bus, emoji: "🚌" },
    { value: "boat", label: t.boat, emoji: "⛵" },
    { value: "car", label: t.car, emoji: "🚗" },
    { value: "bike", label: t.bike, emoji: "🏍️" },
    { value: "walk", label: t.walk, emoji: "🚶" },
  ];

  const popularRoutes = [
    "Kochi → Alappuzha",
    "Thiruvananthapuram → Kochi",
    "Kozhikode → Wayanad",
    "Munnar → Thekkady"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate estimated carbon footprint based on mode and distance
    const carbonPerKm = {
      auto: 0.12,
      bus: 0.08,
      boat: 0.15,
      car: 0.18,
      bike: 0.09,
      walk: 0
    };
    
    const distance = parseFloat(formData.distance) || 0;
    const carbonFootprint = (distance * (carbonPerKm[formData.mode as keyof typeof carbonPerKm] || 0.15)).toFixed(2);
    
    const newTrip = {
      id: Date.now(),
      ...formData,
      carbonFootprint: `${carbonFootprint} kg`,
      distance: `${formData.distance} km`,
      status: "completed" as const,
      date: new Date(formData.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
    
    onAddTrip(newTrip);
    onClose();
  };

  const handleRouteSelect = (route: string) => {
    const [origin, destination] = route.split(' → ');
    setFormData(prev => ({ ...prev, origin, destination }));
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${
      actualTheme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700/50' 
        : 'bg-white border-gray-200'
    }`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${
          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Plus className={`w-5 h-5 ${
            actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`} />
          {t.addNewTrip}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {popularRoutes.map((route) => (
            <Badge 
              key={route}
              variant="outline" 
              className={`cursor-pointer transition-colors ${
                actualTheme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-green-900/30 hover:border-green-600 hover:text-green-300'
                  : 'hover:bg-green-50 hover:border-green-300'
              }`}
              onClick={() => handleRouteSelect(route)}
            >
              {route}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="origin" className={`flex items-center gap-2 ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <MapPin className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                From
              </Label>
              <Input
                id="origin"
                placeholder="Starting location"
                value={formData.origin}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                required
                className={actualTheme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="destination" className={`flex items-center gap-2 ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <MapPin className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`} />
                To
              </Label>
              <Input
                id="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                required
                className={actualTheme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400' : ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className={`flex items-center gap-2 ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <Calendar className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className={actualTheme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="distance" className={actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                Distance (km)
              </Label>
              <Input
                id="distance"
                type="number"
                placeholder="0"
                value={formData.distance}
                onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                required
                className={actualTheme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400' : ''}
              />
            </div>
          </div>

          <div>
            <Label className={`flex items-center gap-2 ${
              actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <Car className={`w-4 h-4 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
              Transport Mode
            </Label>
            <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
              <SelectTrigger className={actualTheme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white' : ''}>
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent className={actualTheme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}>
                {transportModes.map((mode) => (
                  <SelectItem 
                    key={mode.value} 
                    value={mode.value}
                    className={actualTheme === 'dark' ? 'text-white hover:bg-gray-700' : ''}
                  >
                    <span className="flex items-center gap-2">
                      <span>{mode.emoji}</span>
                      {mode.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className={`flex-1 ${
                actualTheme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : ''
              }`}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 ${
                actualTheme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Add Trip
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}