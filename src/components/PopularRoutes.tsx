import { MapPin, Clock, Leaf, Star, Navigation, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner@2.0.3";

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  carbonFootprint: string;
  popularity: number;
  description: string;
  imageUrl: string;
  tags: string[];
}

interface PopularRoutesProps {
  onSelectRoute: (route: Route) => void;
}

export function PopularRoutes({ onSelectRoute }: PopularRoutesProps) {
  const { actualTheme } = useTheme();

  // Kerala coordinates for Google Maps
  const keralLocations: { [key: string]: { lat: number; lng: number } } = {
    'Kochi': { lat: 9.9312, lng: 76.2673 },
    'Alappuzha': { lat: 9.4981, lng: 76.3388 },
    'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'Kovalam': { lat: 8.4004, lng: 76.9784 },
    'Munnar': { lat: 10.0889, lng: 77.0595 },
    'Thekkady': { lat: 9.5916, lng: 77.1603 },
    'Kozhikode': { lat: 11.2588, lng: 75.7804 },
    'Wayanad': { lat: 11.6854, lng: 76.1320 }
  };

  const openGoogleMaps = (route: Route) => {
    const origin = keralLocations[route.from];
    const destination = keralLocations[route.to];
    
    if (origin && destination) {
      // Create Google Maps URL for directions
      const mapsUrl = `https://www.google.com/maps/dir/${origin.lat},${origin.lng}/${destination.lat},${destination.lng}/@${(origin.lat + destination.lat) / 2},${(origin.lng + destination.lng) / 2},10z/data=!3m1!4b1!4m2!4m1!3e0`;
      
      // Open in new tab
      window.open(mapsUrl, '_blank');
      toast.success(`Opening ${route.name} route in Google Maps`);
    } else {
      // Fallback to text-based search
      const searchQuery = `${route.from} to ${route.to} Kerala India directions`;
      const fallbackUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      window.open(fallbackUrl, '_blank');
      toast.success(`Opening route search in Google Maps`);
    }
  };

  const getDirections = (route: Route) => {
    const origin = keralLocations[route.from];
    const destination = keralLocations[route.to];
    
    if (origin && destination) {
      // Create Google Maps directions URL
      const directionsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(route.from + ', Kerala, India')}/${encodeURIComponent(route.to + ', Kerala, India')}`;
      window.open(directionsUrl, '_blank');
      toast.success(`Getting directions for ${route.name}`);
    }
  };
  const popularRoutes: Route[] = [
    {
      id: '1',
      name: 'Backwater Classic',
      from: 'Kochi',
      to: 'Alappuzha',
      distance: '53 km',
      duration: '1h 20m',
      carbonFootprint: '4.2 kg CO₂',
      popularity: 95,
      description: 'Experience the serene backwaters and traditional houseboats',
      imageUrl: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXJzJTIwY29jb251dCUyMHBhbG1zfGVufDF8fHx8MTc1ODc3Nzg2OXww&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['Scenic', 'Backwaters', 'Popular']
    },
    {
      id: '2',
      name: 'Hill Station Circuit',
      from: 'Munnar',
      to: 'Thekkady',
      distance: '94 km',
      duration: '2h 45m',
      carbonFootprint: '7.5 kg CO₂',
      popularity: 88,
      description: 'From tea gardens to wildlife sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1586590171425-1918e1b1a149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      tags: ['Wildlife', 'Tea Gardens', 'Scenic']
    },
    {
      id: '3',
      name: 'Capital to Beach',
      from: 'Thiruvananthapuram',
      to: 'Kovalam',
      distance: '16 km',
      duration: '35m',
      carbonFootprint: '1.9 kg CO₂',
      popularity: 92,
      description: 'Quick escape from capital to pristine beaches',
      imageUrl: 'https://images.unsplash.com/photo-1610153601580-19fab2721793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmlja3NoYXclMjBJbmRpYSUyMHRyYW5zcG9ydHxlbnwxfHx8fDE3NTg3Nzg4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['Beach', 'Quick', 'Capital']
    },
    {
      id: '4',
      name: 'Spice Route',
      from: 'Kozhikode',
      to: 'Wayanad',
      distance: '76 km',
      duration: '2h 15m',
      carbonFootprint: '6.1 kg CO₂',
      popularity: 85,
      description: 'Journey through spice plantations to misty hills',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      tags: ['Hills', 'Spices', 'Adventure']
    }
  ];

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600';
    if (popularity >= 80) return 'text-blue-600';
    if (popularity >= 70) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Popular Routes</h1>
        <p className="text-sm text-gray-600 mt-1">Discover Kerala's most traveled paths</p>
      </div>

      <div className="space-y-4">
        {popularRoutes.map((route) => (
          <Card key={route.id} className="overflow-hidden">
            <div className="relative h-48">
              <ImageWithFallback
                src={route.imageUrl}
                alt={route.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className={`${getPopularityColor(route.popularity)} bg-white text-current`}>
                  <Star className="w-3 h-3 mr-1" />
                  {route.popularity}%
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{route.from} → {route.to}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {route.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">{route.description}</p>
              
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-medium">{route.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{route.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-muted-foreground">Est. CO₂</p>
                    <p className="font-medium">{route.carbonFootprint}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => onSelectRoute(route)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Plan This Trip
                </Button>
                <Button 
                  onClick={() => openGoogleMaps(route)}
                  variant="outline"
                  className={`transition-all duration-200 hover:shadow-md ${
                    actualTheme === 'dark' 
                      ? 'bg-blue-900/20 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200 hover:border-blue-600' 
                      : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                  }`}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  View Route
                </Button>
              </div>
              
              {/* Additional Route Actions */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => getDirections(route)}
                    variant="ghost"
                    size="sm"
                    className={`flex-1 text-xs transition-all duration-200 ${
                      actualTheme === 'dark' 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Get Directions
                  </Button>
                  <Button 
                    onClick={() => {
                      const shareText = `Check out this Kerala route: ${route.name} (${route.from} → ${route.to}) - ${route.distance}, ${route.duration}`;
                      if (navigator.share) {
                        navigator.share({
                          title: route.name,
                          text: shareText,
                          url: window.location.href
                        }).then(() => {
                          toast.success("Route shared successfully!");
                        }).catch(() => {
                          navigator.clipboard.writeText(shareText);
                          toast.success("Route details copied to clipboard!");
                        });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        toast.success("Route details copied to clipboard!");
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className={`flex-1 text-xs transition-all duration-200 ${
                      actualTheme === 'dark' 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    📤 Share Route
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Route Planning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Check weather conditions before traveling to hill stations</li>
            <li>• Book boat rides in advance during peak season (Dec-Feb)</li>
            <li>• Use Kerala State Road Transport Corporation (KSRTC) for eco-friendly travel</li>
            <li>• Consider shared auto-rickshaws for short urban trips</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}