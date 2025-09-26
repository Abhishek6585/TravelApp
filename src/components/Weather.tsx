import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer,
  MapPin,
  RefreshCw,
  Umbrella,
  Sunset,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from "sonner@2.0.3";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }>;
}

export function Weather() {
  const { actualTheme } = useTheme();
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState('Kochi');
  const [isLoading, setIsLoading] = useState(false);

  // Mock weather data for Kerala locations
  const weatherData: { [key: string]: WeatherData } = {
    'Kochi': {
      location: 'Kochi',
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 78,
      windSpeed: 12,
      visibility: 8,
      uvIndex: 6,
      precipitation: 20,
      sunrise: '6:15 AM',
      sunset: '6:45 PM',
      forecast: [
        { day: 'Today', high: 30, low: 24, condition: 'Partly Cloudy', precipitation: 20 },
        { day: 'Tomorrow', high: 29, low: 23, condition: 'Thunderstorms', precipitation: 80 },
        { day: 'Thursday', high: 27, low: 22, condition: 'Rainy', precipitation: 90 },
        { day: 'Friday', high: 31, low: 25, condition: 'Sunny', precipitation: 10 },
        { day: 'Saturday', high: 32, low: 26, condition: 'Hot', precipitation: 5 }
      ]
    },
    'Thiruvananthapuram': {
      location: 'Thiruvananthapuram',
      temperature: 30,
      condition: 'Sunny',
      humidity: 72,
      windSpeed: 8,
      visibility: 10,
      uvIndex: 8,
      precipitation: 5,
      sunrise: '6:20 AM',
      sunset: '6:50 PM',
      forecast: [
        { day: 'Today', high: 32, low: 26, condition: 'Sunny', precipitation: 5 },
        { day: 'Tomorrow', high: 31, low: 25, condition: 'Partly Cloudy', precipitation: 15 },
        { day: 'Thursday', high: 29, low: 24, condition: 'Cloudy', precipitation: 40 },
        { day: 'Friday', high: 28, low: 23, condition: 'Light Rain', precipitation: 65 },
        { day: 'Saturday', high: 30, low: 25, condition: 'Partly Cloudy', precipitation: 25 }
      ]
    },
    'Munnar': {
      location: 'Munnar',
      temperature: 18,
      condition: 'Foggy',
      humidity: 85,
      windSpeed: 6,
      visibility: 3,
      uvIndex: 3,
      precipitation: 60,
      sunrise: '6:25 AM',
      sunset: '6:40 PM',
      forecast: [
        { day: 'Today', high: 20, low: 15, condition: 'Foggy', precipitation: 60 },
        { day: 'Tomorrow', high: 19, low: 14, condition: 'Misty', precipitation: 45 },
        { day: 'Thursday', high: 22, low: 16, condition: 'Partly Cloudy', precipitation: 30 },
        { day: 'Friday', high: 21, low: 15, condition: 'Cloudy', precipitation: 50 },
        { day: 'Saturday', high: 23, low: 17, condition: 'Sunny', precipitation: 20 }
      ]
    },
    'Alappuzha': {
      location: 'Alappuzha',
      temperature: 27,
      condition: 'Humid',
      humidity: 82,
      windSpeed: 10,
      visibility: 7,
      uvIndex: 5,
      precipitation: 35,
      sunrise: '6:18 AM',
      sunset: '6:47 PM',
      forecast: [
        { day: 'Today', high: 29, low: 24, condition: 'Humid', precipitation: 35 },
        { day: 'Tomorrow', high: 28, low: 23, condition: 'Rainy', precipitation: 75 },
        { day: 'Thursday', high: 26, low: 22, condition: 'Heavy Rain', precipitation: 95 },
        { day: 'Friday', high: 27, low: 23, condition: 'Showers', precipitation: 60 },
        { day: 'Saturday', high: 30, low: 25, condition: 'Partly Cloudy', precipitation: 25 }
      ]
    }
  };

  const currentWeather = weatherData[selectedLocation];

  const getWeatherIcon = (condition: string, size: 'sm' | 'lg' = 'sm') => {
    const iconSize = size === 'lg' ? 'w-12 h-12' : 'w-5 h-5';
    const iconColor = actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-500';
    
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'hot':
        return <Sun className={`${iconSize} ${iconColor}`} />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className={`${iconSize} ${actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />;
      case 'rainy':
      case 'light rain':
      case 'heavy rain':
      case 'showers':
      case 'thunderstorms':
        return <CloudRain className={`${iconSize} ${actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />;
      case 'foggy':
      case 'misty':
      case 'humid':
        return <Cloud className={`${iconSize} ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;
      default:
        return <Sun className={`${iconSize} ${iconColor}`} />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'hot':
        return actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'rainy':
      case 'heavy rain':
      case 'thunderstorms':
        return actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'partly cloudy':
      case 'cloudy':
        return actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600';
      default:
        return actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast("Weather data refreshed!");
  };

  const handleGoogleWeather = () => {
    const googleWeatherUrl = `https://www.google.com/search?q=weather+${encodeURIComponent(selectedLocation)}+kerala`;
    window.open(googleWeatherUrl, '_blank');
    toast(`Opening Google Weather for ${selectedLocation}`);
  };

  const locations = ['Kochi', 'Thiruvananthapuram', 'Munnar', 'Alappuzha'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className={`p-6 ${
        actualTheme === 'dark' 
          ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-gray-800' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              actualTheme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'
            }`}>
              {getWeatherIcon(currentWeather.condition, 'lg')}
            </div>
            <div>
              <h1 className={`text-2xl font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Weather Forecast
              </h1>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Live weather updates for Kerala
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoogleWeather}
              className={`transition-all duration-200 hover:shadow-md ${
                actualTheme === 'dark' 
                  ? 'bg-blue-900/20 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200 hover:border-blue-600' 
                  : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
              }`}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Google
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className={`transition-all duration-200 ${
                actualTheme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'border-gray-300 hover:bg-gray-50'
              } ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Location Selector */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLocation(location)}
              className={`whitespace-nowrap ${
                actualTheme === 'dark' && selectedLocation !== location
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : ''
              }`}
            >
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Weather */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center justify-between ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span>Current Weather</span>
            <Badge variant="secondary" className={
              actualTheme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
            }>
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-5xl font-bold ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentWeather.temperature}°
                </span>
                <div>
                  {getWeatherIcon(currentWeather.condition, 'lg')}
                  <p className={`font-medium mt-1 ${getConditionColor(currentWeather.condition)}`}>
                    {currentWeather.condition}
                  </p>
                </div>
              </div>
              <p className={`text-sm mt-2 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Feels like {currentWeather.temperature + 2}°C
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentWeather.location}
              </p>
              <p className={`text-xs ${
                actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Updated 5 min ago
              </p>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Droplets className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Humidity
                </span>
              </div>
              <p className={`font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {currentWeather.humidity}%
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Wind className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Wind
                </span>
              </div>
              <p className={`font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {currentWeather.windSpeed} km/h
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Eye className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <span className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Visibility
                </span>
              </div>
              <p className={`font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {currentWeather.visibility} km
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Umbrella className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Rain
                </span>
              </div>
              <p className={`font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {currentWeather.precipitation}%
              </p>
            </div>
          </div>

          {/* Sun Times */}
          <div className={`mt-4 p-3 rounded-lg ${
            actualTheme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`} />
                <span className={`text-sm ${
                  actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'
                }`}>
                  Sunrise: {currentWeather.sunrise}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`} />
                <span className={`text-sm ${
                  actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'
                }`}>
                  Sunset: {currentWeather.sunset}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <div className="px-4">
        <h2 className={`text-lg font-semibold mb-4 ${
          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          5-Day Forecast
        </h2>
        <div className="space-y-3">
          {currentWeather.forecast.map((day, index) => (
            <Card key={index} className={`${
              actualTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16">
                      <p className={`font-medium ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {day.day}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(day.condition)}
                      <span className={`text-sm ${getConditionColor(day.condition)}`}>
                        {day.condition}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Umbrella className={`w-3 h-3 ${
                        actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`text-xs ${
                        actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {day.precipitation}%
                      </span>
                    </div>
                    <div className={`font-medium ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.high}° / {day.low}°
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <Card className={`mx-4 ${
        actualTheme === 'dark'
          ? 'border-blue-800/50 bg-gradient-to-br from-blue-900/20 to-indigo-900/20'
          : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'
          }`}>
            <Thermometer className="w-5 h-5" />
            Travel Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentWeather.precipitation > 70 && (
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-blue-200' : 'text-blue-700'
              }`}>
                🌧️ High chance of rain - carry an umbrella and plan indoor activities
              </p>
            )}
            {currentWeather.temperature > 30 && (
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-700'
              }`}>
                ☀️ Hot weather expected - stay hydrated and wear sunscreen
              </p>
            )}
            {currentWeather.visibility < 5 && (
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-700'
              }`}>
                🌫️ Low visibility - drive carefully and allow extra time
              </p>
            )}
            {currentWeather.uvIndex > 6 && (
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-purple-200' : 'text-purple-700'
              }`}>
                🧴 High UV index - wear protective clothing and sunglasses
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}