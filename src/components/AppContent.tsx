import { useState, useMemo } from "react";
import { MapPin, Calendar, TrendingUp, Leaf, Plus, Bell, Cloud, Navigation, ChevronRight } from "lucide-react";
import { TripCard } from "./TripCard";
import { AddTripForm } from "./AddTripForm";
import { NavigationBar } from "./NavigationBar";
import { TripInsights } from "./TripInsights";
import { PopularRoutes } from "./PopularRoutes";
import { GoogleMaps } from "./GoogleMaps";
import { Weather } from "./Weather";
import { Settings } from "./Settings";
import { EditProfile } from "./EditProfile";
import { ProfileInformation } from "./ProfileInformation";
import { PrivacySecurity } from "./PrivacySecurity";
import { NotificationSettings } from "./NotificationSettings";
import { LanguageSettings } from "./LanguageSettings";
import { HelpFAQ } from "./HelpFAQ";
import { AboutApp } from "./AboutApp";
import { AccountActions } from "./AccountActions";
import { DataExportButton } from "./DataExportButton";
import { SOSButton } from "./SOSButton";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { EmergencyServices } from "./EmergencyServices";
import { toast } from "sonner@2.0.3";

interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  mode: string;
  distance: string;
  carbonFootprint: string;
  status: "completed" | "ongoing" | "planned";
}

interface User {
  name: string;
  email: string;
  avatar: string;
  city: string;
  phone: string;
  isAuthenticated: boolean;
}

interface AppContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (editing: boolean) => void;
  settingsPage: string | null;
  setSettingsPage: (page: string | null) => void;
  trips: Trip[];
  user: User;
  onAddTrip: (trip: Omit<Trip, 'id' | 'user_id' | 'created_at'>) => void;
  onDeleteTrip: (tripId: string) => void;
  onSignOut: () => void;
  tripsLoading?: boolean;
}

export function AppContent({
  activeTab,
  setActiveTab,
  isEditingProfile,
  setIsEditingProfile,
  settingsPage,
  setSettingsPage,
  trips,
  user,
  onAddTrip,
  onDeleteTrip,
  onSignOut,
  tripsLoading = false
}: AppContentProps) {
  const { t } = useLanguage();
  const { actualTheme } = useTheme();

  // Memoized calculations to prevent unnecessary re-computations
  const stats = useMemo(() => {
    if (!trips || trips.length === 0) {
      return { totalDistance: 0, totalCarbon: 0, thisMonthTrips: 0, carbonSaved: '0.0' };
    }

    const totalDistance = trips.reduce((sum, trip) => sum + parseFloat(trip.distance.replace(' km', '')), 0);
    const totalCarbon = trips.reduce((sum, trip) => sum + parseFloat(trip.carbonFootprint.replace(' kg', '')), 0);
    const thisMonthTrips = trips.filter(trip => {
      const tripDate = new Date(trip.date);
      const now = new Date();
      return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();
    }).length;
    const carbonSaved = (totalCarbon * 0.3).toFixed(1);

    return { totalDistance, totalCarbon, thisMonthTrips, carbonSaved };
  }, [trips]);

  const handleAddTrip = (newTrip: Omit<Trip, 'id' | 'user_id' | 'created_at'>) => {
    onAddTrip(newTrip);
    setActiveTab('home');
  };

  const handleRouteSelect = () => {
    setActiveTab('add');
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (updatedUser: any) => {
    // Profile updates would need to be handled by parent component
    // For now, just close the edit mode
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleSettingsNavigation = (page: string) => {
    setSettingsPage(page);
  };

  const handleBackToSettings = () => {
    setSettingsPage(null);
    setIsEditingProfile(false);
  };

  const handleDeleteAccount = () => {
    toast.success("Account deletion process initiated. Check your email for confirmation.");
    onSignOut();
  };

  const renderHomeContent = () => (
    <div className="space-y-6 pb-20">
      {/* Header with User Info */}
      <div className={`flex items-center justify-between p-4 ${
        actualTheme === 'dark' 
          ? 'bg-gradient-to-r from-gray-800/50 to-slate-800/50 backdrop-blur-sm' 
          : 'bg-gradient-to-r from-green-50/80 to-blue-50/80 backdrop-blur-sm'
      } m-4 rounded-2xl border ${
        actualTheme === 'dark' ? 'border-gray-700/50' : 'border-white/50'
      }`}>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className={`${
              actualTheme === 'dark' 
                ? 'bg-green-900/50 text-green-300' 
                : 'bg-green-100 text-green-700'
            }`}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className={`font-semibold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.welcomeBack}, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className={`text-sm ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t.trackYourJourney}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          className={`${
            actualTheme === 'dark' 
              ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
              : 'border-gray-300 hover:bg-gray-50'
          } rounded-full transition-all duration-200`}
        >
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className={`p-4 rounded-2xl ${
          actualTheme === 'dark' 
            ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-800/30' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              actualTheme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'
            }`}>
              <MapPin className={`w-5 h-5 ${
                actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.thisMonthTrips}
              </p>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.tripsThisMonth}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+23%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${
          actualTheme === 'dark' 
            ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-800/30' 
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              actualTheme === 'dark' ? 'bg-green-800/50' : 'bg-green-100'
            }`}>
              <Leaf className={`w-5 h-5 ${
                actualTheme === 'dark' ? 'text-green-300' : 'text-green-600'
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.carbonSaved} kg
              </p>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.carbonSaved}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-white/50 backdrop-blur-sm'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span>{t.quickActions}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button 
              onClick={() => setActiveTab('add')}
              className={`h-16 flex flex-col gap-1 rounded-xl transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-900/30'
                  : 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">{t.addTrip}</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveTab('insights')}
              className={`h-16 flex flex-col gap-1 rounded-xl transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">{t.viewInsights}</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => setActiveTab('maps')}
              className={`h-14 flex flex-col gap-1 rounded-xl transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-xs">Maps</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveTab('weather')}
              className={`h-14 flex flex-col gap-1 rounded-xl transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span className="text-xs">Weather</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t.recentTrips}
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            className={actualTheme === 'dark' ? 'text-gray-400 hover:text-white' : ''}
          >
            {t.viewAll}
          </Button>
        </div>
        <div className="space-y-3">
          {trips.slice(0, 3).map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      </div>

      {/* Account Actions Section */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-white/50 backdrop-blur-sm'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span>⚙️</span>
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DataExportButton 
            user={user}
            trips={trips}
            variant="outline"
            className="w-full"
          />
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab('settings');
              handleSettingsNavigation('account-actions');
            }}
            className={`w-full justify-start h-auto p-3 ${
              actualTheme === 'dark'
                ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                actualTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <ChevronRight className={`w-4 h-4 ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <p className={`font-medium ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  More Account Options
                </p>
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Manage account, privacy & security
                </p>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Kerala Travel Tip */}
      <Card className={`mx-4 ${
        actualTheme === 'dark'
          ? 'border-orange-800/50 bg-gradient-to-br from-orange-900/20 to-amber-900/20 backdrop-blur-sm'
          : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-800'
          }`}>
            <span>🌴</span>
            {t.keralaTravelTip}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-700'
          }`}>
            {t.travelTipText}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();

      case 'insights':
        return <TripInsights trips={trips} />;

      case 'add':
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
            <AddTripForm onAddTrip={handleAddTrip} onClose={() => setActiveTab('home')} />
          </div>
        );

      case 'routes':
        return <PopularRoutes onSelectRoute={handleRouteSelect} />;

      case 'maps':
        return <GoogleMaps trips={trips} />;

      case 'weather':
        return <Weather />;

      case 'settings':
        if (isEditingProfile) {
          return (
            <EditProfile
              user={user}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />
          );
        }
        
        if (settingsPage) {
          switch (settingsPage) {
            case 'profile-info':
              return (
                <ProfileInformation
                  user={user}
                  onBack={handleBackToSettings}
                  onEdit={handleEditProfile}
                />
              );
            case 'privacy-security':
              return (
                <PrivacySecurity
                  onBack={handleBackToSettings}
                  onNavigate={handleSettingsNavigation}
                />
              );
            case 'notifications':
              return (
                <NotificationSettings
                  onBack={handleBackToSettings}
                />
              );
            case 'language':
              return (
                <LanguageSettings
                  onBack={handleBackToSettings}
                />
              );
            case 'help-faq':
              return (
                <HelpFAQ
                  onBack={handleBackToSettings}
                />
              );
            case 'about-app':
              return (
                <AboutApp
                  onBack={handleBackToSettings}
                />
              );
            case 'account-actions':
              return (
                <AccountActions
                  user={user}
                  trips={trips}
                  onBack={handleBackToSettings}
                  onNavigate={handleSettingsNavigation}
                  onSignOut={onSignOut}
                  onDeleteAccount={handleDeleteAccount}
                />
              );
            case 'emergency-services':
              return (
                <div className="space-y-6 pb-20">
                  <div className="flex items-center gap-4 p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToSettings}
                      className={`rounded-full ${
                        actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className={`w-5 h-5 rotate-180 ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-700'
                      }`} />
                    </Button>
                    <div className="flex-1">
                      <h1 className={`text-xl font-semibold ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Emergency Services
                      </h1>
                      <p className={`text-sm ${
                        actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Kerala emergency services and SOS
                      </p>
                    </div>
                  </div>
                  <EmergencyServices />
                </div>
              );
            default:
              return (
                <Settings
                  user={user}
                  onEditProfile={handleEditProfile}
                  onSignOut={onSignOut}
                  onNavigate={handleSettingsNavigation}
                />
              );
          }
        }
        
        return (
          <Settings
            user={user}
            onEditProfile={handleEditProfile}
            onSignOut={onSignOut}
            onNavigate={handleSettingsNavigation}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* SOS Button - Always available when authenticated */}
      <SOSButton 
        isVisible={user.isAuthenticated} 
        onEmergencyCall={() => {
          toast.success("Emergency services contacted!");
        }}
      />
    </>
  );
}