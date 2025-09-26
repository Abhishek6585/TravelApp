import { useState } from "react";
import { X, Phone, Shield, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface PhoneUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone?: string;
  onUpdate: (phone: string) => void;
}

export function PhoneUpdateModal({ isOpen, onClose, currentPhone, onUpdate }: PhoneUpdateModalProps) {
  const { actualTheme } = useTheme();
  const [phone, setPhone] = useState(currentPhone || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = async () => {
    if (!phone.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    // Simulate API call for sending verification code
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsVerifying(true);
    toast.success("Verification code sent to " + phone);
  };

  const handleVerifyAndUpdate = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode !== "123456") { // Mock verification
      toast.error("Invalid verification code");
      return;
    }

    setIsLoading(true);
    // Simulate API call for phone update
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    onUpdate(phone);
    toast.success("Phone number updated successfully!");
    onClose();
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as +91 XXXXX XXXXX for Indian numbers
    if (cleaned.length <= 10) {
      const match = cleaned.match(/^(\d{0,5})(\d{0,5})$/);
      if (match) {
        return `+91 ${match[1]}${match[2] ? ' ' + match[2] : ''}`;
      }
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md ${
        actualTheme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Phone className="w-5 h-5 text-green-600" />
              Update Phone Number
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
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isVerifying 
              ? "Enter the verification code sent to your phone"
              : "Enter your new phone number for verification"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isVerifying ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className={
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }>
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`${
                    actualTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              <div className={`p-3 rounded-lg ${
                actualTheme === 'dark' 
                  ? 'bg-blue-900/20 border border-blue-800/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start gap-2">
                  <Shield className={`w-4 h-4 mt-0.5 ${
                    actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                    }`}>
                      Security Note
                    </p>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      We'll send a verification code to confirm your phone number
                    </p>
                  </div>
                </div>
              </div>

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
                  onClick={handleSendCode}
                  disabled={isLoading || !phone.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Sending..." : "Send Code"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code" className={
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }>
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className={`text-center text-xl tracking-widest ${
                    actualTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-lg ${
                actualTheme === 'dark' 
                  ? 'bg-green-900/20 border border-green-800/30' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Check className={`w-4 h-4 ${
                    actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-green-300' : 'text-green-700'
                  }`}>
                    Code sent to {phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsVerifying(false)}
                  className={`flex-1 ${
                    actualTheme === 'dark' 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : ''
                  }`}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyAndUpdate}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Verifying..." : "Verify & Update"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}