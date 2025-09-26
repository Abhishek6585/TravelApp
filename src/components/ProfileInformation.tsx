import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit2, Download, UserX, Camera, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";
import { PhoneUpdateModal } from "./PhoneUpdateModal";
import { EmailUpdateModal } from "./EmailUpdateModal";

interface ProfileInformationProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    city?: string;
    phone?: string;
  };
  onBack: () => void;
  onEdit: () => void;
  onUpdateUser?: (updatedUser: any) => void;
}

export function ProfileInformation({ user, onBack, onEdit, onUpdateUser }: ProfileInformationProps) {
  const { actualTheme } = useTheme();
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const memberSince = new Date().getFullYear() - 1;
  const totalTrips = 156;
  const verifiedBadges = ['Email Verified', 'Phone Verified', 'Kerala Local'];

  const handleProfileAction = (action: string) => {
    if (action === 'Update Phone') {
      setIsPhoneModalOpen(true);
    } else if (action === 'Update Email' || action === 'Change Email Address') {
      setIsEmailModalOpen(true);
    } else {
      toast(`${action} - Feature coming soon!`);
    }
  };

  const handlePhoneUpdate = (newPhone: string) => {
    if (onUpdateUser) {
      onUpdateUser({ ...user, phone: newPhone });
    }
    setIsPhoneModalOpen(false);
  };

  const handleEmailUpdate = (newEmail: string) => {
    if (onUpdateUser) {
      onUpdateUser({ ...user, email: newEmail });
    }
    setIsEmailModalOpen(false);
  };

  const handleImageUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast("Profile image updated successfully!");
      }
    };
    input.click();
  };

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
            Profile Information
          </h1>
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your account details and verification
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit}
          className={`${
            actualTheme === 'dark' 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Profile Card */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`text-2xl ${
                  actualTheme === 'dark' 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 ${
                  actualTheme === 'dark' 
                    ? 'bg-blue-800 hover:bg-blue-700 text-blue-200' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={handleImageUpload}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center">
              <h2 className={`text-xl font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {user.name}
              </h2>
              <p className={`${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user.email}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-2xl">🌴</span>
                <span className={`font-medium ${
                  actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  Kerala Traveler
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <User className="w-5 h-5 text-green-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className={`w-full justify-start h-auto p-4 transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-gray-700/30 border-gray-600 text-gray-200 hover:bg-gray-600/50 hover:text-white hover:border-gray-500' 
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => handleProfileAction('Update Email')}
          >
            <div className="flex items-center gap-3 w-full">
              <Mail className={`w-5 h-5 ${
                actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div className="flex-1 text-left">
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Email
                </p>
                <p className={`font-medium ${
                  actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {user.email}
                </p>
              </div>
              <Badge variant="secondary" className={`${
                actualTheme === 'dark' 
                  ? 'bg-green-900/50 text-green-300' 
                  : 'bg-green-100 text-green-700'
              }`}>
                ✓ Verified
              </Badge>
            </div>
          </Button>

          <Button
            variant="outline"
            className={`w-full justify-start h-auto p-4 transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-gray-700/30 border-gray-600 text-gray-200 hover:bg-gray-600/50 hover:text-white hover:border-gray-500' 
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => handleProfileAction('Update Phone')}
          >
            <div className="flex items-center gap-3 w-full">
              <Phone className={`w-5 h-5 ${
                actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <div className="flex-1 text-left">
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Phone
                </p>
                <p className={`font-medium ${
                  actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {user.phone || 'Not added'}
                </p>
              </div>
              {user.phone ? (
                <Badge variant="secondary" className={`${
                  actualTheme === 'dark' 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  ✓ Verified
                </Badge>
              ) : (
                <Badge variant="outline" className={`${
                  actualTheme === 'dark' 
                    ? 'border-orange-600 text-orange-400' 
                    : 'border-orange-400 text-orange-600'
                }`}>
                  Add Phone
                </Badge>
              )}
            </div>
          </Button>

          <Button
            variant="outline"
            className={`w-full justify-start h-auto p-4 transition-all duration-200 hover:shadow-md ${
              actualTheme === 'dark' 
                ? 'bg-gray-700/30 border-gray-600 text-gray-200 hover:bg-gray-600/50 hover:text-white hover:border-gray-500' 
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => handleProfileAction('Update Location')}
          >
            <div className="flex items-center gap-3 w-full">
              <MapPin className={`w-5 h-5 ${
                actualTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <div className="flex-1 text-left">
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Location
                </p>
                <p className={`font-medium capitalize ${
                  actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {user.city || 'Not specified'}
                </p>
              </div>
              <Badge variant="outline" className={`${
                actualTheme === 'dark' 
                  ? 'border-green-600 text-green-400' 
                  : 'border-green-400 text-green-600'
              }`}>
                Kerala
              </Badge>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Account Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-semibold text-green-600">{memberSince}</p>
              <p className="text-sm text-green-700">Years Member</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-semibold text-blue-600">{totalTrips}</p>
              <p className="text-sm text-blue-700">Total Trips</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-semibold text-orange-600">68%</p>
              <p className="text-sm text-orange-700">Eco Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Badges */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {verifiedBadges.map((badge, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-green-100 text-green-700"
              >
                ✓ {badge}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Verified accounts help build trust in the Kerala travel community
          </p>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <User className="w-5 h-5 text-blue-600" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
                actualTheme === 'dark' 
                  ? 'bg-blue-900/20 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200 hover:border-blue-600' 
                  : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 hover:shadow-sm'
              }`}
              onClick={() => handleProfileAction('Download My Data')}
            >
              <Download className="w-4 h-4 mr-3" />
              <span className="font-medium">Download My Data</span>
            </Button>
            <Button 
              variant="outline" 
              className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
                actualTheme === 'dark' 
                  ? 'bg-green-900/20 border-green-700 text-green-300 hover:bg-green-800/30 hover:text-green-200 hover:border-green-600' 
                  : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 hover:shadow-sm'
              }`}
              onClick={() => handleProfileAction('Change Email Address')}
            >
              <Mail className="w-4 h-4 mr-3" />
              <span className="font-medium">Change Email Address</span>
            </Button>
            <Button 
              variant="outline" 
              className={`w-full justify-start transition-all duration-200 hover:shadow-md ${
                actualTheme === 'dark'
                  ? 'bg-red-900/20 border-red-700 text-red-300 hover:bg-red-800/30 hover:text-red-200 hover:border-red-600'
                  : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 hover:shadow-sm'
              }`}
              onClick={() => handleProfileAction('Deactivate Account')}
            >
              <UserX className="w-4 h-4 mr-3" />
              <span className="font-medium">Deactivate Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Phone Update Modal */}
      <PhoneUpdateModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        currentPhone={user.phone}
        onUpdate={handlePhoneUpdate}
      />

      {/* Email Update Modal */}
      <EmailUpdateModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={user.email}
        onUpdate={handleEmailUpdate}
      />
    </div>
  );
}