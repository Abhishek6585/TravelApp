import { useState } from "react";
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Key, Smartphone, AlertTriangle, Download, UserCheck, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";
import { EmergencyContactModal } from "./EmergencyContactModal";
import { GoogleMarketingModal } from "./GoogleMarketingModal";
import { PhoneUpdateModal } from "./PhoneUpdateModal";
import { EmailUpdateModal } from "./EmailUpdateModal";
import { EmergencyServices } from "./EmergencyServices";

interface PrivacySecurityProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export function PrivacySecurity({ onBack, onNavigate }: PrivacySecurityProps) {
  const { actualTheme } = useTheme();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    locationTracking: true,
    dataSharing: true,
    profileVisibility: 'public',
    analyticsOptIn: true,
    marketingEmails: false
  });
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [marketingPreferences, setMarketingPreferences] = useState(null);
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    if (key === 'marketingEmails' && value) {
      setIsMarketingModalOpen(true);
      return;
    }
    setSettings(prev => ({ ...prev, [key]: value }));
    toast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
  };

  const handleAccountAction = (action: string) => {
    if (action === 'Update Phone') {
      setIsPhoneModalOpen(true);
    } else if (action === 'Update Email') {
      setIsEmailModalOpen(true);
    } else if (action === 'Emergency Services') {
      setShowEmergencyServices(true);
    } else {
      toast(`${action} - Feature coming soon!`);
    }
  };

  const handleEmergencyContact = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleSaveEmergencyContacts = (contacts: any) => {
    setEmergencyContacts(contacts);
    setIsEmergencyModalOpen(false);
  };

  const handleSaveMarketingPreferences = (preferences: any) => {
    setMarketingPreferences(preferences);
    setSettings(prev => ({ ...prev, marketingEmails: true }));
    setIsMarketingModalOpen(false);
  };

  const handlePhoneUpdate = (newPhone: string) => {
    toast("Phone number updated successfully!");
    setIsPhoneModalOpen(false);
  };

  const handleEmailUpdate = (newEmail: string) => {
    toast("Email address updated successfully!");
    setIsEmailModalOpen(false);
  };

  const securityItems = [
    {
      icon: <Lock className="w-5 h-5 text-blue-600" />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      action: (
        <Switch
          checked={settings.twoFactorAuth}
          onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
        />
      ),
      status: settings.twoFactorAuth ? "Enabled" : "Disabled"
    },
    {
      icon: <Eye className="w-5 h-5 text-green-600" />,
      title: "Profile Visibility",
      description: "Control who can see your travel profile",
      action: (
        <Button variant="outline" size="sm">
          {settings.profileVisibility === 'public' ? 'Public' : 'Private'}
        </Button>
      ),
      status: "Configurable"
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-600" />,
      title: "Location Tracking",
      description: "Allow app to track your location for trip logging",
      action: (
        <Switch
          checked={settings.locationTracking}
          onCheckedChange={(checked) => handleSettingChange('locationTracking', checked)}
        />
      ),
      status: settings.locationTracking ? "Active" : "Disabled"
    }
  ];

  const privacyItems = [
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: "Data Sharing",
      description: "Share anonymized travel data for insights",
      action: (
        <Switch
          checked={settings.dataSharing}
          onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
        />
      ),
      status: settings.dataSharing ? "Enabled" : "Disabled"
    },
    {
      icon: <Eye className="w-5 h-5 text-orange-600" />,
      title: "Analytics & Performance",
      description: "Help improve app performance with usage data",
      action: (
        <Switch
          checked={settings.analyticsOptIn}
          onCheckedChange={(checked) => handleSettingChange('analyticsOptIn', checked)}
        />
      ),
      status: settings.analyticsOptIn ? "Opted In" : "Opted Out"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      title: "Marketing Communications",
      description: "Receive updates about Kerala travel tips and offers via Google Marketing",
      action: (
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.marketingEmails}
            onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
          />
          {settings.marketingEmails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMarketingModalOpen(true)}
              className="text-xs px-2 py-1"
            >
              Configure
            </Button>
          )}
        </div>
      ),
      status: settings.marketingEmails ? "Google Integrated" : "Disabled"
    }
  ];

  if (showEmergencyServices) {
    return (
      <EmergencyServices 
        onBack={() => setShowEmergencyServices(false)}
        userLocation={{
          latitude: 9.9312,
          longitude: 76.2673,
          city: "Kochi"
        }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={`rounded-full ${
            actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-700'
          }`} />
        </Button>
        <div className="flex-1">
          <h1 className={`text-xl font-semibold ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Privacy & Security
          </h1>
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your account security and privacy
          </p>
        </div>
      </div>

      {/* Security Status */}
      <Card className={`mx-4 ${
        actualTheme === 'dark'
          ? 'border-green-800/50 bg-gradient-to-br from-green-900/20 to-emerald-900/20'
          : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-green-300' : 'text-green-800'
          }`}>
            <Shield className="w-5 h-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${
                actualTheme === 'dark' ? 'text-green-300' : 'text-green-800'
              }`}>
                Good Security Level
              </p>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-green-200' : 'text-green-600'
              }`}>
                Your account is well protected
              </p>
            </div>
            <Badge className={`${
              actualTheme === 'dark' 
                ? 'bg-green-900/50 text-green-300' 
                : 'bg-green-200 text-green-800'
            }`}>
              85% Secure
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {item.action}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {privacyItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {item.action}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Password & Authentication */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Key className="w-5 h-5 text-red-600" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-gray-700/30 border-gray-600 text-gray-200 hover:bg-gray-600/50 hover:text-white hover:border-gray-500' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => handleAccountAction('Change Password')}
          >
            <Lock className="w-4 h-4 mr-3" />
            <span className="font-medium">Change Password</span>
          </Button>
          <Button 
            variant="outline" 
            className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-gray-700/30 border-gray-600 text-gray-200 hover:bg-gray-600/50 hover:text-white hover:border-gray-500' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => handleAccountAction('Manage Devices')}
          >
            <Smartphone className="w-4 h-4 mr-3" />
            <span className="font-medium">Manage Devices</span>
          </Button>
          <Button 
            variant="outline" 
            className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-gray-700/30 border-gray-600 text-gray-200 hover:bg-gray-600/50 hover:text-white hover:border-gray-500' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => handleAccountAction('Download Security Report')}
          >
            <Download className="w-4 h-4 mr-3" />
            <span className="font-medium">Download Security Report</span>
          </Button>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Your Data Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            You have full control over your personal data. You can request access, 
            correction, or deletion of your information at any time.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              Request Data
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
              Delete Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <UserCheck className="w-5 h-5 text-blue-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-blue-900/20 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200 hover:border-blue-600' 
                : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 hover:shadow-sm'
            }`}
            onClick={() => handleAccountAction('Update Email')}
          >
            <Mail className="w-4 h-4 mr-3" />
            <span className="font-medium">Update Email Address</span>
          </Button>
          <Button 
            variant="outline" 
            className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-green-900/20 border-green-700 text-green-300 hover:bg-green-800/30 hover:text-green-200 hover:border-green-600' 
                : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 hover:shadow-sm'
            }`}
            onClick={() => handleAccountAction('Update Phone')}
          >
            <Phone className="w-4 h-4 mr-3" />
            <span className="font-medium">Update Phone Number</span>
          </Button>
          <Button 
            variant="outline" 
            className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-purple-900/20 border-purple-700 text-purple-300 hover:bg-purple-800/30 hover:text-purple-200 hover:border-purple-600' 
                : 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 hover:shadow-sm'
            }`}
            onClick={() => handleAccountAction('Update Location')}
          >
            <MapPin className="w-4 h-4 mr-3" />
            <span className="font-medium">Update Location Info</span>
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Access & Services */}
      <Card className={`mx-4 ${
        actualTheme === 'dark'
          ? 'border-orange-800/50 bg-gradient-to-br from-orange-900/20 to-amber-900/20'
          : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
      }`}>
        <CardHeader>
          <CardTitle className={`${
            actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-800'
          }`}>
            Emergency Access & Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-700'
          }`}>
            Set up emergency contacts and access Kerala emergency services.
          </p>
          <Button 
            variant="outline" 
            className={`w-full transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark'
                ? 'bg-orange-900/30 border-orange-700 text-orange-300 hover:bg-orange-800/40 hover:text-orange-200 hover:border-orange-600'
                : 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400'
            }`}
            onClick={handleEmergencyContact}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Set Emergency Contacts
          </Button>
          <Button 
            variant="outline" 
            className={`w-full transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark'
                ? 'bg-red-900/30 border-red-700 text-red-300 hover:bg-red-800/40 hover:text-red-200 hover:border-red-600'
                : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400'
            }`}
            onClick={() => handleAccountAction('Emergency Services')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Kerala Emergency Services
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Contact Modal */}
      <EmergencyContactModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSave={handleSaveEmergencyContacts}
        existingContacts={emergencyContacts}
      />

      {/* Google Marketing Modal */}
      <GoogleMarketingModal
        isOpen={isMarketingModalOpen}
        onClose={() => setIsMarketingModalOpen(false)}
        onSave={handleSaveMarketingPreferences}
        currentPreferences={marketingPreferences}
      />

      {/* Phone Update Modal */}
      <PhoneUpdateModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onUpdate={handlePhoneUpdate}
      />

      {/* Email Update Modal */}
      <EmailUpdateModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail="user@example.com"
        onUpdate={handleEmailUpdate}
      />
    </div>
  );
}