import { useState } from "react";
import { User, Mail, MapPin, Camera, ArrowLeft, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner@2.0.3";

interface EditProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    city?: string;
    phone?: string;
  };
  onSave: (updatedUser: any) => void;
  onCancel: () => void;
}

export function EditProfile({ user, onSave, onCancel }: EditProfileProps) {
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ')[1] || '',
    email: user.email,
    phone: user.phone || '',
    city: user.city || '',
    avatar: user.avatar || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const keralaCities = [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kottayam", "Alappuzha",
    "Palakkad", "Malappuram", "Thrissur", "Kollam", "Kannur", "Kasaragod",
    "Pathanamthitta", "Idukki", "Wayanad"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Validate required fields
    if (!formData.firstName || !formData.email) {
      toast("Please fill in all required fields", {
        description: "First name and email are required."
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const updatedUser = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        avatar: formData.avatar
      };

      onSave(updatedUser);
      setIsLoading(false);

      toast("Profile updated successfully!", {
        description: "Your changes have been saved."
      });
    }, 1000);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker or camera
    toast("Camera feature coming soon!", {
      description: "Avatar upload will be available in the next update."
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Edit Profile</h1>
          <p className="text-sm text-muted-foreground">Update your personal information</p>
        </div>
      </div>

      {/* Avatar Section */}
      <Card className="mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.avatar} alt="Profile" />
                <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                  {`${formData.firstName[0] || ''}${formData.lastName[0] || ''}`}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                onClick={handleAvatarChange}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-600 hover:bg-green-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Tap the camera icon to update your profile photo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>City in Kerala</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => handleInputChange('city', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {keralaCities.map((city) => (
                  <SelectItem key={city} value={city.toLowerCase()}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kerala Traveler Badge */}
      <Card className="mx-4 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌴</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Kerala Traveler</h3>
              <p className="text-sm text-green-600">
                Member since {new Date().getFullYear() - 1}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="px-4 space-y-3">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 py-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Changes...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>

      {/* Help Text */}
      <div className="px-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-700">
              <strong>Privacy Note:</strong> Your personal information is encrypted and secure. 
              We only use this data to personalize your travel experience in Kerala.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}