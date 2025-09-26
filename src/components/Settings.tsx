import { useState } from "react";
import { User, Bell, Globe, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun, Monitor, AlertTriangle, Settings as SettingsIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

interface SettingsProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    city?: string;
    phone?: string;
  };
  onEditProfile: () => void;
  onSignOut: () => void;
  onNavigate: (page: string) => void;
}

export function Settings({ user, onEditProfile, onSignOut, onNavigate }: SettingsProps) {
  const { t } = useLanguage();
  const { theme, setTheme, actualTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    notifications: true,
    travelReminders: false,
    dataSharing: true
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const settingsCategories = [
    {
      title: t.account,
      items: [
        { 
          icon: User, 
          label: t.profileInformation, 
          hasArrow: true, 
          onClick: () => onNavigate('profile-info')
        },
        { 
          icon: Shield, 
          label: t.privacySecurity, 
          hasArrow: true,
          onClick: () => onNavigate('privacy-security')
        },
        { 
          icon: SettingsIcon, 
          label: "Account Actions", 
          subtitle: "Export data, delete account", 
          hasArrow: true,
          onClick: () => onNavigate('account-actions')
        },
        { 
          icon: AlertTriangle, 
          label: "Emergency Services", 
          subtitle: "Kerala Police & Hospitals", 
          hasArrow: true,
          onClick: () => onNavigate('emergency-services'),
          isEmergency: true
        },
        { 
          icon: Bell, 
          label: t.notifications, 
          toggle: true, 
          enabled: preferences.notifications,
          onClick: () => onNavigate('notifications')
        },
      ]
    },
    {
      title: t.preferences,
      items: [
        { 
          icon: Globe, 
          label: t.language, 
          subtitle: "English", 
          hasArrow: true,
          onClick: () => onNavigate('language')
        },
        {
          icon: actualTheme === 'dark' ? Moon : Sun,
          label: 'Theme',
          subtitle: theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System',
          hasArrow: true,
          onClick: () => {
            const themes = ['light', 'dark', 'system'] as const;
            const currentIndex = themes.indexOf(theme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            setTheme(nextTheme);
            toast(`Theme changed to ${nextTheme}`);
          }
        },
        { 
          icon: Bell, 
          label: t.travelReminders, 
          toggle: true, 
          enabled: preferences.travelReminders,
          onToggle: (checked: boolean) => handlePreferenceChange('travelReminders', checked)
        },
        { 
          icon: Shield, 
          label: t.dataSharing, 
          toggle: true, 
          enabled: preferences.dataSharing,
          onToggle: (checked: boolean) => handlePreferenceChange('dataSharing', checked)
        },
      ]
    },
    {
      title: t.support,
      items: [
        { 
          icon: HelpCircle, 
          label: t.helpFAQ, 
          hasArrow: true,
          onClick: () => onNavigate('help-faq')
        },
        { 
          icon: Globe, 
          label: t.aboutApp, 
          subtitle: t.version, 
          hasArrow: true,
          onClick: () => onNavigate('about-app')
        },
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-semibold text-gray-900">{t.settings}</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your travel preferences</p>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-green-600">{t.keralaTraveler}</p>
                {user.city && (
                  <>
                    <span className="text-sm text-gray-400">•</span>
                    <p className="text-sm text-gray-600 capitalize">{user.city}</p>
                  </>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onEditProfile}>
              {t.edit}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      {settingsCategories.map((category) => (
        <Card key={category.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {category.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    onClick={item.onClick || (() => {})}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        {item.subtitle && (
                          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.toggle && (
                        <Switch 
                          checked={item.enabled} 
                          onCheckedChange={item.onToggle || ((checked) => handlePreferenceChange('notifications', checked))}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      {item.hasArrow && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Travel Statistics */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Your Travel Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-800">156</p>
              <p className="text-sm text-green-600">Total Trips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-800">2,340 km</p>
              <p className="text-sm text-green-600">Distance Traveled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-800">189.2 kg</p>
              <p className="text-sm text-green-600">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-800">68%</p>
              <p className="text-sm text-green-600">Eco-Friendly</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">🌴</span>
            </div>
            <div>
              <h3 className="font-semibold">Kerala Travel Tracker</h3>
              <p className="text-sm text-muted-foreground">God's Own Country, Your Own Journey</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        variant="outline" 
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
        onClick={onSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}