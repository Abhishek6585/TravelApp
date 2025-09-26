import { useState } from "react";
import { X, Mail, Bell, Smartphone, Globe, Check, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface MarketingPreferences {
  emailMarketing: boolean;
  pushNotifications: boolean;
  smsMarketing: boolean;
  personalizedOffers: boolean;
  travelUpdates: boolean;
  keralaTourism: boolean;
  weeklyDigest: boolean;
  instantDeals: boolean;
}

interface GoogleMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: MarketingPreferences) => void;
  currentPreferences?: MarketingPreferences;
}

export function GoogleMarketingModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentPreferences 
}: GoogleMarketingModalProps) {
  const { actualTheme } = useTheme();
  const [preferences, setPreferences] = useState<MarketingPreferences>(
    currentPreferences || {
      emailMarketing: false,
      pushNotifications: true,
      smsMarketing: false,
      personalizedOffers: true,
      travelUpdates: true,
      keralaTourism: true,
      weeklyDigest: false,
      instantDeals: false,
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePreferenceChange = (key: keyof MarketingPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate Google Marketing API integration
    try {
      // Mock API call to Google Marketing Platform
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success response
      const apiResponse = {
        status: 'success',
        consentId: 'GMC_' + Date.now(),
        timestamp: new Date().toISOString(),
        preferences: preferences
      };
      
      console.log('Google Marketing API Response:', apiResponse);
      onSave(preferences);
      toast.success("Marketing preferences updated with Google!");
      onClose();
    } catch (error) {
      toast.error("Failed to sync with Google Marketing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptOutAll = () => {
    setPreferences({
      emailMarketing: false,
      pushNotifications: false,
      smsMarketing: false,
      personalizedOffers: false,
      travelUpdates: false,
      keralaTourism: false,
      weeklyDigest: false,
      instantDeals: false,
    });
    toast.success("Opted out of all marketing communications");
  };

  const getActiveCount = () => {
    return Object.values(preferences).filter(Boolean).length;
  };

  const communicationChannels = [
    {
      key: 'emailMarketing' as keyof MarketingPreferences,
      icon: <Mail className="w-4 h-4 text-blue-600" />,
      title: "Email Marketing",
      description: "Receive travel deals and Kerala tourism updates via email",
      badge: "Google Ads Integration"
    },
    {
      key: 'pushNotifications' as keyof MarketingPreferences,
      icon: <Bell className="w-4 h-4 text-green-600" />,
      title: "Push Notifications",
      description: "Get instant alerts for travel opportunities and bookings",
      badge: "Firebase Cloud Messaging"
    },
    {
      key: 'smsMarketing' as keyof MarketingPreferences,
      icon: <Smartphone className="w-4 h-4 text-purple-600" />,
      title: "SMS Marketing",
      description: "Receive text messages for urgent travel alerts and deals",
      badge: "Google Messages API"
    }
  ];

  const contentPreferences = [
    {
      key: 'personalizedOffers' as keyof MarketingPreferences,
      icon: <Target className="w-4 h-4 text-orange-600" />,
      title: "Personalized Offers",
      description: "Tailored travel deals based on your trip history and preferences",
      badge: "AI Powered"
    },
    {
      key: 'travelUpdates' as keyof MarketingPreferences,
      icon: <Globe className="w-4 h-4 text-blue-600" />,
      title: "Travel Updates",
      description: "Important travel advisories and route information for Kerala",
      badge: "Essential"
    },
    {
      key: 'keralaTourism' as keyof MarketingPreferences,
      icon: <span className="text-green-600">🌴</span>,
      title: "Kerala Tourism Highlights",
      description: "Discover new destinations and cultural events in Kerala",
      badge: "Local Insights"
    },
    {
      key: 'weeklyDigest' as keyof MarketingPreferences,
      icon: <Mail className="w-4 h-4 text-indigo-600" />,
      title: "Weekly Travel Digest",
      description: "Summary of your travel activity and carbon footprint",
      badge: "Weekly"
    },
    {
      key: 'instantDeals' as keyof MarketingPreferences,
      icon: <Bell className="w-4 h-4 text-red-600" />,
      title: "Flash Deals & Offers",
      description: "Time-sensitive discounts on transportation and accommodations",
      badge: "Limited Time"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-hidden ${
        actualTheme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Marketing Communications
              </div>
              <Badge variant="outline" className={`ml-2 ${
                actualTheme === 'dark' 
                  ? 'border-blue-600 text-blue-400' 
                  : 'border-blue-300 text-blue-600'
              }`}>
                Google Integrated
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`rounded-full ${
                actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-4 h-4 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Manage your marketing preferences with Google integration
            </p>
            <Badge className={`${
              actualTheme === 'dark' 
                ? 'bg-green-900/50 text-green-300' 
                : 'bg-green-100 text-green-700'
            }`}>
              {getActiveCount()} Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Google Integration Status */}
          <Card className={`${
            actualTheme === 'dark' 
              ? 'bg-blue-900/20 border-blue-800/30' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  actualTheme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'
                }`}>
                  <Check className={`w-4 h-4 ${
                    actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className={`font-medium text-sm ${
                    actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    Google Marketing Platform Connected
                  </p>
                  <p className={`text-xs ${
                    actualTheme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    Your preferences will sync with Google Ads, Analytics, and Firebase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Channels */}
          <div>
            <h3 className={`font-medium mb-3 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Communication Channels
            </h3>
            <div className="space-y-3">
              {communicationChannels.map((channel) => (
                <div key={channel.key} className={`flex items-center gap-3 p-3 rounded-lg border ${
                  actualTheme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    actualTheme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    {channel.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium text-sm ${
                        actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {channel.title}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {channel.badge}
                      </Badge>
                    </div>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {channel.description}
                    </p>
                  </div>
                  <Switch
                    checked={preferences[channel.key]}
                    onCheckedChange={(checked) => handlePreferenceChange(channel.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator className={actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} />

          {/* Content Preferences */}
          <div>
            <h3 className={`font-medium mb-3 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Content Preferences
            </h3>
            <div className="space-y-3">
              {contentPreferences.map((pref) => (
                <div key={pref.key} className={`flex items-center gap-3 p-3 rounded-lg border ${
                  actualTheme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    actualTheme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    {pref.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium text-sm ${
                        actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {pref.title}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {pref.badge}
                      </Badge>
                    </div>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    checked={preferences[pref.key]}
                    onCheckedChange={(checked) => handlePreferenceChange(pref.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOptOutAll}
              className={`flex-1 ${
                actualTheme === 'dark' 
                  ? 'border-red-600 text-red-400 hover:bg-red-900/30' 
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              Opt Out All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreferences({
                  emailMarketing: true,
                  pushNotifications: true,
                  smsMarketing: false,
                  personalizedOffers: true,
                  travelUpdates: true,
                  keralaTourism: true,
                  weeklyDigest: true,
                  instantDeals: true,
                });
                toast.success("Recommended settings applied");
              }}
              className="flex-1"
            >
              Use Recommended
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className={`p-3 rounded-lg text-xs ${
            actualTheme === 'dark' 
              ? 'bg-gray-700/30 text-gray-400' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <p>
              Your marketing preferences are processed in compliance with Google's privacy policies 
              and India's data protection regulations. You can change these settings anytime.
            </p>
          </div>
        </CardContent>

        <div className={`p-4 border-t ${
          actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex gap-3">
            <Button
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
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Syncing with Google..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}