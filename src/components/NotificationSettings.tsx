import { useState } from "react";
import { ArrowLeft, Bell, MessageCircle, MapPin, TrendingUp, Clock, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

interface NotificationSettingsProps {
  onBack: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [notifications, setNotifications] = useState({
    // Main toggles
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Travel-specific
    tripReminders: true,
    routeUpdates: true,
    weatherAlerts: true,
    trafficAlerts: false,
    
    // App features
    analyticsReports: true,
    carbonFootprintUpdates: true,
    newRoutesSuggestions: true,
    communityUpdates: false,
    
    // Timing
    quietHours: true,
    weekendNotifications: false,
    
    // Preferences
    notificationSound: 'default',
    frequency: 'normal'
  });

  const handleNotificationChange = (key: string, value: boolean | string) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast(`Notification setting updated`);
  };

  const notificationCategories = [
    {
      title: "Core Notifications",
      icon: <Bell className="w-5 h-5 text-blue-600" />,
      items: [
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          enabled: notifications.pushNotifications
        },
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Get updates via email',
          enabled: notifications.emailNotifications
        },
        {
          key: 'smsNotifications',
          title: 'SMS Notifications',
          description: 'Receive important alerts via SMS',
          enabled: notifications.smsNotifications
        }
      ]
    },
    {
      title: "Travel Updates",
      icon: <MapPin className="w-5 h-5 text-green-600" />,
      items: [
        {
          key: 'tripReminders',
          title: 'Trip Reminders',
          description: 'Get reminded about upcoming trips',
          enabled: notifications.tripReminders
        },
        {
          key: 'routeUpdates',
          title: 'Route Updates',
          description: 'Notifications about route changes or delays',
          enabled: notifications.routeUpdates
        },
        {
          key: 'weatherAlerts',
          title: 'Weather Alerts',
          description: 'Weather updates for your travel routes',
          enabled: notifications.weatherAlerts
        },
        {
          key: 'trafficAlerts',
          title: 'Traffic Alerts',
          description: 'Real-time traffic updates',
          enabled: notifications.trafficAlerts
        }
      ]
    },
    {
      title: "Insights & Features",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      items: [
        {
          key: 'analyticsReports',
          title: 'Weekly Analytics',
          description: 'Your weekly travel summary',
          enabled: notifications.analyticsReports
        },
        {
          key: 'carbonFootprintUpdates',
          title: 'Carbon Footprint Updates',
          description: 'Monthly environmental impact reports',
          enabled: notifications.carbonFootprintUpdates
        },
        {
          key: 'newRoutesSuggestions',
          title: 'New Route Suggestions',
          description: 'Discover new travel routes in Kerala',
          enabled: notifications.newRoutesSuggestions
        },
        {
          key: 'communityUpdates',
          title: 'Community Updates',
          description: 'Updates from Kerala traveler community',
          enabled: notifications.communityUpdates
        }
      ]
    }
  ];

  const timePreferences = [
    {
      key: 'quietHours',
      title: 'Quiet Hours',
      description: 'Pause notifications from 10 PM to 7 AM',
      enabled: notifications.quietHours
    },
    {
      key: 'weekendNotifications',
      title: 'Weekend Notifications',
      description: 'Receive notifications on weekends',
      enabled: notifications.weekendNotifications
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Manage how you receive updates</p>
        </div>
      </div>

      {/* Notification Status */}
      <Card className="mx-4 border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 rounded-full">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-800">Notifications Active</p>
              <p className="text-sm text-blue-600">
                {Object.values(notifications).filter(Boolean).length} of {Object.keys(notifications).length} enabled
              </p>
            </div>
            <Badge className="bg-blue-200 text-blue-800">
              {notifications.pushNotifications ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {notificationCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category.icon}
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Time Preferences */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Timing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {timePreferences.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={item.enabled}
                onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Notification Sound</label>
            <Select 
              value={notifications.notificationSound} 
              onValueChange={(value) => handleNotificationChange('notificationSound', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="gentle">Gentle Chime</SelectItem>
                <SelectItem value="nature">Kerala Birds</SelectItem>
                <SelectItem value="waves">Backwater Waves</SelectItem>
                <SelectItem value="silent">Silent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notification Frequency</label>
            <Select 
              value={notifications.frequency} 
              onValueChange={(value) => handleNotificationChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal - Only urgent</SelectItem>
                <SelectItem value="normal">Normal - Balanced</SelectItem>
                <SelectItem value="frequent">Frequent - All updates</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      <Card className="mx-4">
        <CardContent className="pt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => toast("Test notification sent! 🌴", {
              description: "This is how your notifications will appear"
            })}
          >
            <Bell className="w-4 h-4 mr-2" />
            Send Test Notification
          </Button>
        </CardContent>
      </Card>

      {/* Kerala Travel Tips */}
      <Card className="mx-4 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">💡 Smart Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">
            Enable weather alerts during monsoon season (June-September) for safer Kerala travels. 
            Our local weather integration provides accurate updates for all 14 districts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}