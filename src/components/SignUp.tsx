import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

interface SignUpProps {
  onSignUp: (email: string, password: string, name: string) => void;
  onGoToSignIn: () => void;
  onBackToLanding: () => void;
}

export function SignUp({ onSignUp, onGoToSignIn, onBackToLanding }: SignUpProps) {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const keralaCities = [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kottayam", "Alappuzha",
    "Palakkad", "Malappuram", "Thrissur", "Kollam", "Kannur", "Kasaragod",
    "Pathanamthitta", "Idukki", "Wayanad"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.firstName.trim()) {
      alert("Please enter your first name");
      return;
    }
    
    if (!formData.lastName.trim()) {
      alert("Please enter your last name");
      return;
    }
    
    if (!formData.email.trim()) {
      alert("Please enter your email address");
      return;
    }
    
    if (!formData.password) {
      alert("Please enter a password");
      return;
    }
    
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      console.log('🎯 Submitting signup with:', { 
        email: formData.email.trim(), 
        name: fullName,
        passwordLength: formData.password.length 
      });
      
      await onSignUp(formData.email.trim(), formData.password, fullName);
      setIsLoading(false);
    } catch (error) {
      console.error('SignUp component error:', error);
      setIsLoading(false);
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignUp = async () => {
    try {
      setSocialLoading('google');
      await signInWithGoogle();
      toast.success('Redirecting to Google...');
    } catch (error: any) {
      console.error('Google sign up failed:', error);
      toast.error(error.message || 'Google sign up failed');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setSocialLoading('facebook');
      await signInWithFacebook();
      toast.success('Redirecting to Facebook...');
    } catch (error: any) {
      console.error('Facebook sign up failed:', error);
      toast.error(error.message || 'Facebook sign up failed');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Background with Kerala imagery */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1713342941873-f80792de1a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBjb2NvbnV0JTIwcGFsbSUyMHRyZWVzJTIwdHJvcGljYWx8ZW58MXx8fHwxNzU4Nzc5MTA0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Kerala Palms"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/90 to-white/95" />
      </div>

      <div className="relative z-10 px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToLanding}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌴</span>
            <span className="font-semibold text-green-800">Kerala Travel Tracker</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Kerala Travelers
          </h1>
          <p className="text-gray-600">
            Start tracking your journey through God's Own Country
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="max-w-sm mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Arjun"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-white/80"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Nair"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-white/80"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/80"
                  required
                />
              </div>

              {/* City Selection */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Your City in Kerala
                </Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                  <SelectTrigger className="bg-white/80">
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

              {/* Password */}
              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-white/80 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="mb-2 block">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="bg-white/80 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="rounded mt-1"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                  I agree to the{" "}
                  <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-700">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full bg-white/80 border-gray-200"
                onClick={handleGoogleSignUp}
                disabled={socialLoading !== null}
              >
                {socialLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full bg-white/80 border-gray-200"
                onClick={handleFacebookSignUp}
                disabled={socialLoading !== null}
              >
                {socialLoading === 'facebook' ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={onGoToSignIn}
                  className="p-0 h-auto text-green-600 hover:text-green-700"
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kerala Welcome Message */}
        <div className="text-center mt-8 p-4 bg-green-50/80 rounded-xl max-w-sm mx-auto">
          <div className="text-2xl mb-2">🌴</div>
          <p className="text-sm text-green-700">
            <strong>Welcome to Kerala!</strong><br />
            Join thousands of travelers discovering God's Own Country
          </p>
        </div>
      </div>
    </div>
  );
}