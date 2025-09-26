import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Navigation, Route, Compass, Clock, Car, Map, Satellite, Mountain, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from "sonner@2.0.3";

interface Trip {
  id: number;
  origin: string;
  destination: string;
  date: string;
  mode: string;
  distance: string;
  carbonFootprint: string;
  status: "completed" | "ongoing" | "planned";
}

interface GoogleMapsProps {
  trips: Trip[];
}

export function GoogleMaps({ trips }: GoogleMapsProps) {
  const { actualTheme } = useTheme();
  const { t } = useLanguage();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'roadmap'>('roadmap');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  const handleRouteSelect = (route: any) => {
    toast(`Selected route: ${route.name} - Feature coming soon!`);
  };

  const handleViewRoute = (route: any) => {
    // Extract origin and destination from route name
    const [origin, destination] = route.name.split(' - ');
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
    
    const originCoords = keralLocations[origin];
    const destCoords = keralLocations[destination];
    
    if (originCoords && destCoords) {
      // Create Google Maps URL for directions
      const mapsUrl = `https://www.google.com/maps/dir/${originCoords.lat},${originCoords.lng}/${destCoords.lat},${destCoords.lng}/@${(originCoords.lat + destCoords.lat) / 2},${(originCoords.lng + destCoords.lng) / 2},10z/data=!3m1!4b1!4m2!4m1!3e0`;
      window.open(mapsUrl, '_blank');
      toast.success(`Opening ${route.name} route in Google Maps`);
    } else {
      // Fallback to text-based search
      const searchQuery = `${origin} to ${destination} Kerala India directions`;
      const fallbackUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      window.open(fallbackUrl, '_blank');
      toast.success(`Opening route search in Google Maps`);
    }
  };

  // Initialize the map with iframe embed
  useEffect(() => {
    if (mapRef.current && selectedTrip) {
      setMapLoaded(true);
    }
  }, [selectedTrip]);

  const getMapEmbedUrl = (origin: string, destination: string, view: string) => {
    const originCoords = keralLocations[origin];
    const destCoords = keralLocations[destination];
    
    if (originCoords && destCoords) {
      // Use OpenStreetMap with route visualization for demo purposes
      const centerLat = (originCoords.lat + destCoords.lat) / 2;
      const centerLng = (originCoords.lng + destCoords.lng) / 2;
      
      // Create a Google Maps URL that doesn't require API key
      return `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d500000!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x0%3A0x0!2m2!1d${originCoords.lng}!2d${originCoords.lat}!4m5!1s0x0%3A0x0!2m2!1d${destCoords.lng}!2d${destCoords.lat}!5e${view === 'satellite' ? '1' : view === 'terrain' ? '4' : '0'}!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`;
    }
    
    // Fallback to static map view of Kerala
    return getStaticMapUrl(view);
  };

  const getStaticMapUrl = (view: string) => {
    const centerLat = 10.8505;
    const centerLng = 76.2711;
    
    // Use Google Maps embed without API key for general view
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000000!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKerala%2C%20India!5e${view === 'satellite' ? '1' : view === 'terrain' ? '4' : '0'}!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`;
  };

  const getMapMode = (tripMode: string) => {
    switch (tripMode.toLowerCase()) {
      case 'car':
        return 'driving';
      case 'bus':
        return 'transit';
      case 'bike':
        return 'bicycling';
      case 'walk':
        return 'walking';
      default:
        return 'driving';
    }
  };

  const handleMapAction = (action: string) => {
    if (action === 'Get Directions' && selectedTrip) {
      const directionsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(selectedTrip.origin + ', Kerala, India')}/${encodeURIComponent(selectedTrip.destination + ', Kerala, India')}`;
      window.open(directionsUrl, '_blank');
      toast.success(`Opening directions for ${selectedTrip.origin} to ${selectedTrip.destination}`);
    } else if (action === 'Live Traffic') {
      const trafficUrl = `https://www.google.com/maps/@${keralLocations[selectedTrip?.origin || 'Kochi']?.lat || 10.8505},${keralLocations[selectedTrip?.origin || 'Kochi']?.lng || 76.2711},10z/data=!5m1!1e1`;
      window.open(trafficUrl, '_blank');
      toast.success('Opening live traffic information');
    } else {
      toast(`${action} - Opening in Google Maps`);
    }
  };

  const getMapIcon = (view: string) => {
    switch (view) {
      case 'satellite':
        return <Satellite className="w-4 h-4" />;
      case 'terrain':
        return <Mountain className="w-4 h-4" />;
      case 'roadmap':
      default:
        return <Map className="w-4 h-4" />;
    }
  };

  // Mock coordinates for Kerala locations
  const keralLocations: { [key: string]: { lat: number; lng: number } } = {
    'Kochi': { lat: 9.9312, lng: 76.2673 },
    'Alappuzha': { lat: 9.4981, lng: 76.3388 },
    'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'Kovalam': { lat: 8.4004, lng: 76.9784 },
    'Munnar': { lat: 10.0889, lng: 77.0595 },
    'Thekkady': { lat: 9.5916, lng: 77.1603 },
    'Kozhikode': { lat: 11.2588, lng: 75.7804 },
    'Wayanad': { lat: 11.6854, lng: 76.1320 },
    'Kumarakom': { lat: 9.6177, lng: 76.4278 },
    'Varkala': { lat: 8.7379, lng: 76.7168 }
  };

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
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

  const getMockMapUrl = (origin: string, destination: string, view: string) => {
    // This would typically be a Google Maps embed URL or static map API
    // For demo purposes, using a placeholder map image
    const originCoords = keralLocations[origin] || { lat: 10.0, lng: 76.5 };
    const destCoords = keralLocations[destination] || { lat: 10.5, lng: 76.8 };
    
    return `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600&h=400`;
  };

  const popularRoutes = [
    { name: 'Kochi - Alappuzha', description: 'Backwater route', distance: '53 km', time: '1h 20m', popularity: 95 },
    { name: 'Munnar - Thekkady', description: 'Hill station circuit', distance: '94 km', time: '2h 45m', popularity: 88 },
    { name: 'Thiruvananthapuram - Kovalam', description: 'Capital to beach', distance: '16 km', time: '35m', popularity: 92 },
    { name: 'Kozhikode - Wayanad', description: 'Spice route', distance: '76 km', time: '2h 15m', popularity: 85 }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className={`p-6 ${
        actualTheme === 'dark' 
          ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-gray-800' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            actualTheme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'
          }`}>
            <MapPin className={`w-6 h-6 ${
              actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-2xl font-semibold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Maps & Routes
            </h1>
            <p className={`text-sm ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Explore your journeys and popular Kerala routes
            </p>
          </div>
        </div>

        {/* Map View Controls */}
        <div className="flex gap-2">
          {(['roadmap', 'satellite', 'terrain'] as const).map((view) => (
            <Button
              key={view}
              variant={mapView === view ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMapView(view);
                toast.success(`Map switched to ${view} view`);
                // Trigger map reload with new view
                if (mapRef.current) {
                  setMapLoaded(false);
                  setTimeout(() => setMapLoaded(true), 100);
                }
              }}
              className={`capitalize transition-all duration-200 hover:shadow-md ${
                mapView === view
                  ? (actualTheme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30')
                  : (actualTheme === 'dark' 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400')
              }`}
            >
              <span className="flex items-center gap-2">
                {getMapIcon(view)}
                {view}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Interactive Map Area */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center justify-between ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span>Live Route Map</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={
                actualTheme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
              }>
                {selectedTrip ? 'Route Selected' : 'Select a Trip'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMapAction('Live Route Map')}
                className={`transition-all duration-200 hover:shadow-md ${
                  actualTheme === 'dark' 
                    ? 'bg-purple-900/20 border-purple-700 text-purple-300 hover:bg-purple-800/30 hover:text-purple-200 hover:border-purple-600' 
                    : 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400'
                }`}
              >
                <Route className="w-3 h-3 mr-1" />
                Live Map
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef}
            className={`relative rounded-lg overflow-hidden h-80 ${
              actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            {selectedTrip ? (
              <div className="relative w-full h-full">
                <iframe
                  src={getMapEmbedUrl(selectedTrip.origin, selectedTrip.destination, mapView)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title={`Route from ${selectedTrip.origin} to ${selectedTrip.destination}`}
                />
                
                {/* Overlay info panel */}
                <div className="absolute top-3 left-3 right-3">
                  <div className={`${
                    actualTheme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
                  } backdrop-blur-sm rounded-lg p-3 shadow-lg border ${
                    actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Route className={`w-5 h-5 ${
                          actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                        }`} />
                        <div>
                          <p className={`font-medium text-sm ${
                            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {selectedTrip.origin} → {selectedTrip.destination}
                          </p>
                          <p className={`text-xs ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {selectedTrip.distance} • {getModeIcon(selectedTrip.mode)} {selectedTrip.mode}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          actualTheme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        Live Map
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quick actions overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => {
                        const directionsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(selectedTrip.origin + ', Kerala, India')}/${encodeURIComponent(selectedTrip.destination + ', Kerala, India')}`;
                        window.open(directionsUrl, '_blank');
                        toast.success('Opening in Google Maps app');
                      }}
                      className={`flex-1 transition-all duration-200 ${
                        actualTheme === 'dark'
                          ? 'bg-blue-600/90 hover:bg-blue-500 text-white backdrop-blur-sm'
                          : 'bg-blue-600/90 hover:bg-blue-500 text-white backdrop-blur-sm'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open in Maps
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <iframe
                  src={getStaticMapUrl(mapView)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Kerala Map Overview"
                />
                
                {/* Default state overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className={`${
                    actualTheme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
                  } backdrop-blur-sm rounded-lg p-6 text-center border ${
                    actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <Compass className={`w-12 h-12 mx-auto mb-3 ${
                      actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                    }`} />
                    <p className={`font-medium mb-1 ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Kerala Map View
                    </p>
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Select a trip below to view route
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleMapAction('Get Directions')}
                disabled={!selectedTrip}
                className={`transition-all duration-200 hover:shadow-md ${
                  !selectedTrip 
                    ? 'opacity-50 cursor-not-allowed'
                    : actualTheme === 'dark' 
                      ? 'bg-green-900/20 border-green-700 text-green-300 hover:bg-green-800/30 hover:text-green-200 hover:border-green-600' 
                      : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400'
                }`}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMapAction('Live Traffic')}
                className={`transition-all duration-200 hover:shadow-md ${
                  actualTheme === 'dark' 
                    ? 'bg-orange-900/20 border-orange-700 text-orange-300 hover:bg-orange-800/30 hover:text-orange-200 hover:border-orange-600' 
                    : 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400'
                }`}
              >
                <Clock className="w-4 h-4 mr-1" />
                Traffic
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const keralaCenterUrl = `https://www.google.com/maps/@10.8505,76.2711,8z`;
                  window.open(keralaCenterUrl, '_blank');
                  toast.success('Opening Kerala overview in Google Maps');
                }}
                className={`transition-all duration-200 hover:shadow-md ${
                  actualTheme === 'dark' 
                    ? 'bg-blue-900/20 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200 hover:border-blue-600' 
                    : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                }`}
              >
                <Map className="w-4 h-4 mr-1" />
                Explore
              </Button>
            </div>
            {selectedTrip && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedTrip(null);
                  toast.success('Route selection cleared');
                }}
                className={`transition-colors duration-200 ${
                  actualTheme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Clear Selection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your Recent Routes */}
      <div className="px-4">
        <h2 className={`text-lg font-semibold mb-4 ${
          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Your Recent Routes
        </h2>
        <div className="space-y-3">
          {trips.slice(0, 4).map((trip) => (
            <Card 
              key={trip.id} 
              className={`cursor-pointer transition-all duration-200 ${
                selectedTrip?.id === trip.id 
                  ? (actualTheme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700' 
                      : 'bg-blue-50 border-blue-300'
                    )
                  : (actualTheme === 'dark' 
                      ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70' 
                      : 'bg-white hover:shadow-md'
                    )
              }`}
              onClick={() => setSelectedTrip(trip)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      actualTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <span className="text-lg">{getModeIcon(trip.mode)}</span>
                    </div>
                    <div>
                      <p className={`font-medium ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {trip.origin} → {trip.destination}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {trip.distance}
                        </span>
                        <span className={actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>•</span>
                        <span className={actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {trip.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="secondary" 
                      className={
                        trip.status === 'completed' 
                          ? (actualTheme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
                          : trip.status === 'ongoing'
                          ? (actualTheme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700')
                          : (actualTheme === 'dark' ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700')
                      }
                    >
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Kerala Routes */}
      <div className="px-4">
        <h2 className={`text-lg font-semibold mb-4 ${
          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Popular Kerala Routes
        </h2>
        <div className="grid gap-3">
          {popularRoutes.map((route, index) => (
            <Card key={index} className={`${
              actualTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {route.name}
                      </h3>
                      <div className={`flex items-center w-16 h-2 rounded-full overflow-hidden ${
                        actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${route.popularity}%` }}
                        />
                      </div>
                      <span className={`text-xs ${
                        actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {route.popularity}%
                      </span>
                    </div>
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {route.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className={`flex items-center gap-1 ${
                        actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Car className="w-3 h-3" />
                        {route.distance}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {route.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewRoute(route)}
                      className={`flex-1 transition-all duration-200 hover:shadow-md ${
                        actualTheme === 'dark' 
                          ? 'bg-blue-900/20 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200 hover:border-blue-600' 
                          : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                      }`}
                    >
                      <Route className="w-3 h-3 mr-1" />
                      View Route
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}