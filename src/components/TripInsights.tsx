import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Tooltip } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Leaf, TrendingUp, MapPin, Clock, Activity, Route, BarChart3 } from "lucide-react";
import { InsightCard } from "./InsightCard";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

interface TripInsightsProps {
  trips: any[];
}

export function TripInsights({ trips }: TripInsightsProps) {
  const { t } = useLanguage();
  const { actualTheme } = useTheme();
  
  // Handle empty trips case
  if (!trips || trips.length === 0) {
    return (
      <div className="space-y-6 pb-20 px-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t.insights}</h1>
          <p className="text-gray-600">Start adding trips to see your travel insights! 🌴</p>
        </div>
      </div>
    );
  }
  
  // Calculate insights from trips data
  const totalTrips = trips.length;
  const totalDistance = trips.reduce((sum, trip) => sum + parseFloat(trip.distance.replace(' km', '')), 0);
  const totalCarbon = trips.reduce((sum, trip) => sum + parseFloat(trip.carbonFootprint.replace(' kg', '')), 0);
  
  // Transport mode distribution with translations
  const modeDistribution = trips.reduce((acc, trip) => {
    acc[trip.mode] = (acc[trip.mode] || 0) + 1;
    return acc;
  }, {});

  const getModeTranslation = (mode: string) => {
    const modeMap: { [key: string]: keyof typeof t } = {
      'bus': 'bus',
      'train': 'train',
      'boat': 'boat',
      'auto': 'auto',
      'car': 'car',
      'bike': 'bike',
      'walk': 'walk'
    };
    return t[modeMap[mode]] || mode;
  };

  const pieData = Object.entries(modeDistribution).map(([mode, count]) => ({
    name: getModeTranslation(mode),
    originalMode: mode,
    value: count,
    percentage: ((count as number) / totalTrips * 100).toFixed(1)
  }));

  // Monthly trip data with better date handling
  const monthlyData = trips.reduce((acc, trip) => {
    const tripDate = new Date(trip.date);
    const month = tripDate.toLocaleDateString('en-US', { month: 'short' });
    const distance = parseFloat(trip.distance.replace(' km', ''));
    const carbon = parseFloat(trip.carbonFootprint.replace(' kg', ''));
    
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.trips += 1;
      existing.carbon += carbon;
      existing.distance += distance;
    } else {
      acc.push({
        month,
        trips: 1,
        carbon: parseFloat(carbon.toFixed(1)),
        distance: parseFloat(distance.toFixed(1))
      });
    }
    return acc;
  }, [] as any[]);

  // Sort monthly data chronologically
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthlyData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  // Most frequent routes
  const routeFrequency = trips.reduce((acc, trip) => {
    const route = `${trip.origin} → ${trip.destination}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});

  const topRoutes = Object.entries(routeFrequency)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  const COLORS = ['#16a34a', '#22d3ee', '#f59e0b', '#ef4444', '#8b5cf6'];

  const averageDistance = totalDistance / totalTrips || 0;
  const averageCarbon = totalCarbon / totalTrips || 0;
  
  // Eco-friendly percentage calculation
  const ecoFriendlyModes = ['bus', 'train', 'boat', 'bike', 'walk'];
  const ecoTrips = trips.filter(trip => ecoFriendlyModes.includes(trip.mode)).length;
  const ecoFriendlyPercentage = totalTrips > 0 ? ((ecoTrips / totalTrips) * 100).toFixed(1) : '0';
  
  // Most used transport mode
  const mostUsedMode = Object.entries(modeDistribution).length > 0 
    ? Object.entries(modeDistribution).reduce((a, b) => 
        modeDistribution[a[0]] > modeDistribution[b[0]] ? a : b
      )[0]
    : 'N/A';
  
  // Carbon saved estimation (compared to all car trips)
  const carbonIfAllCar = totalDistance * 0.18; // Average car emission per km
  const carbonSaved = Math.max(0, carbonIfAllCar - totalCarbon);

  return (
    <div className="space-y-6 pb-20 px-4">
      <div className="text-center py-4">
        <h1 className="text-2xl font-semibold text-gray-900">{t.insights}</h1>
        <p className="text-sm text-gray-600 mt-1">Your travel patterns and environmental impact</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <InsightCard
          title={t.totalTrips}
          value={totalTrips.toString()}
          subtitle="All time"
          icon={<MapPin className="w-5 h-5" />}
          color="text-blue-600"
          trend="up"
          trendValue="+12%"
        />
        <InsightCard
          title={t.totalDistance}
          value={`${totalDistance.toFixed(0)} km`}
          subtitle="Total traveled"
          icon={<Route className="w-5 h-5" />}
          color="text-green-600"
          trend="up"
          trendValue="+8%"
        />
        <InsightCard
          title={t.totalCarbon}
          value={`${totalCarbon.toFixed(1)} kg`}
          subtitle="CO₂ emissions"
          icon={<Leaf className="w-5 h-5" />}
          color="text-red-600"
          trend="down"
          trendValue="-15%"
        />
        <InsightCard
          title="Avg Distance"
          value={`${averageDistance.toFixed(1)} km`}
          subtitle="Per trip"
          icon={<Activity className="w-5 h-5" />}
          color="text-purple-600"
          trend="neutral"
          trendValue="0%"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">{t.ecoFriendly}</p>
                <p className="text-2xl font-bold text-green-700">{ecoFriendlyPercentage}%</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">{t.mostUsedTransport}</p>
                <p className="text-lg font-bold text-blue-700 capitalize">{getModeTranslation(mostUsedMode)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transport Mode Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Trip Mode Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any) => [`${value} trips`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {pieData.map((item, index) => (
              <Badge key={item.name} variant="outline" className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.name} ({item.value})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {t.monthlyTrends}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${value} ${name === 'trips' ? 'trips' : 'km'}`, 
                    name === 'trips' ? 'Trips' : 'Distance'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="trips"
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorTrips)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  dot={{ fill: '#22d3ee', strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Footprint by Month */}
      <Card className={`${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Leaf className="w-5 h-5 text-red-500" />
            Carbon Emission Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`p-3 rounded-lg text-center ${
              actualTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
            }`}>
              <p className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {totalCarbon.toFixed(1)} kg
              </p>
              <p className={`text-xs ${
                actualTheme === 'dark' ? 'text-red-300' : 'text-red-500'
              }`}>
                Total CO₂
              </p>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              actualTheme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
            }`}>
              <p className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {averageCarbon.toFixed(1)} kg
              </p>
              <p className={`text-xs ${
                actualTheme === 'dark' ? 'text-green-300' : 'text-green-500'
              }`}>
                Avg per trip
              </p>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              actualTheme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <p className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {carbonSaved.toFixed(1)} kg
              </p>
              <p className={`text-xs ${
                actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-500'
              }`}>
                CO₂ saved
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={actualTheme === 'dark' ? '#374151' : '#f0f0f0'} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: actualTheme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  tickLine={{ stroke: actualTheme === 'dark' ? '#4B5563' : '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: actualTheme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  tickLine={{ stroke: actualTheme === 'dark' ? '#4B5563' : '#e0e0e0' }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} kg`, 'CO₂ Emissions']}
                  contentStyle={{
                    backgroundColor: actualTheme === 'dark' ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${actualTheme === 'dark' ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: actualTheme === 'dark' ? '#F9FAFB' : '#111827'
                  }}
                />
                <Bar 
                  dataKey="carbon" 
                  fill="url(#colorCarbon)" 
                  radius={[4, 4, 0, 0]} 
                  stroke="#ef4444"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Emission Breakdown */}
          <div className={`mt-4 p-4 rounded-lg ${
            actualTheme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={`${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Highest Month:
                </span>
                <p className={`font-medium ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {monthlyData.length > 0 
                    ? monthlyData.reduce((max, month) => month.carbon > max.carbon ? month : max).month
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <span className={`${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Trend:
                </span>
                <p className={`font-medium flex items-center gap-1 ${
                  actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  Improving
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-purple-600" />
            {t.favoriteRoutes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRoutes.length > 0 ? (
              topRoutes.map(([route, count], index) => (
                <div key={route} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{route}</span>
                      <p className="text-xs text-gray-500">Most traveled route</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {count} {count === 1 ? 'trip' : 'trips'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Route className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No frequent routes yet</p>
                <p className="text-sm">Take more trips to see patterns!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Leaf className="w-5 h-5" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-white/80 rounded-lg p-3 border border-green-200">
                <p className="text-xl font-semibold text-green-800">{totalCarbon.toFixed(1)} kg</p>
                <p className="text-xs text-green-600">Total CO₂</p>
              </div>
              <div className="text-center bg-white/80 rounded-lg p-3 border border-green-200">
                <p className="text-xl font-semibold text-green-800">{averageCarbon.toFixed(1)} kg</p>
                <p className="text-xs text-green-600">Per trip</p>
              </div>
              <div className="text-center bg-white/80 rounded-lg p-3 border border-green-200">
                <p className="text-xl font-semibold text-green-800">{carbonSaved.toFixed(1)} kg</p>
                <p className="text-xs text-green-600">CO₂ saved</p>
              </div>
            </div>
            
            {/* Eco Progress Bar */}
            <div className="bg-white/80 rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-700">Eco-Friendly Score</span>
                <span className="text-sm font-bold text-green-800">{ecoFriendlyPercentage}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ecoFriendlyPercentage}%` }}
                />
              </div>
              <p className="text-xs text-green-600 mt-1">
                {ecoFriendlyPercentage}% of your trips used eco-friendly transport
              </p>
            </div>

            <div className="p-4 bg-white/90 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                🌱 <strong>Kerala Eco Tip:</strong> Kerala's backwaters and hill stations are best explored 
                using traditional boats and local buses. This reduces your carbon footprint by up to 60% 
                while giving you an authentic experience of God's Own Country!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}