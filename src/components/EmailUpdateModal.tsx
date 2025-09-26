import { useState } from "react";
import { X, Mail, Shield, Check, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface EmailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onUpdate: (email: string) => void;
}

export function EmailUpdateModal({ isOpen, onClose, currentEmail, onUpdate }: EmailUpdateModalProps) {
  const { actualTheme } = useTheme();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendVerification = async () => {
    if (!newEmail.trim() || !isValidEmail(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your current password");
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      toast.error("New email must be different from current email");
      return;
    }

    setIsLoading(true);
    // Simulate API call for sending verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsVerifying(true);
    toast.success("Verification link sent to " + newEmail);
  };

  const handleVerifyAndUpdate = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode !== "EMAIL123") { // Mock verification
      toast.error("Invalid verification code");
      return;
    }

    setIsLoading(true);
    // Simulate API call for email update
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    onUpdate(newEmail);
    toast.success("Email address updated successfully!");
    onClose();
  };

  const resetForm = () => {
    setNewEmail("");
    setPassword("");
    setVerificationCode("");
    setIsVerifying(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
              <Mail className="w-5 h-5 text-blue-600" />
              Update Email Address
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
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
              ? "Check your new email and enter the verification code"
              : "Enter your new email address and current password"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isVerifying ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="current-email" className={
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }>
                  Current Email
                </Label>
                <Input
                  id="current-email"
                  type="email"
                  value={currentEmail}
                  disabled
                  className={`${
                    actualTheme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600 text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email" className={
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }>
                  New Email Address
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`${
                    actualTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }>
                  Current Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${
                    actualTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              <div className={`p-3 rounded-lg ${
                actualTheme === 'dark' 
                  ? 'bg-orange-900/20 border border-orange-800/30' 
                  : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    actualTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-800'
                    }`}>
                      Important
                    </p>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-700'
                    }`}>
                      You'll need to verify both your old and new email addresses
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className={`flex-1 ${
                    actualTheme === 'dark' 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : ''
                  }`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendVerification}
                  disabled={isLoading || !newEmail.trim() || !password.trim() || !isValidEmail(newEmail)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Sending..." : "Send Verification"}
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
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`text-center text-lg tracking-wider ${
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
                <div className="flex items-center gap-2">
                  <Check className={`w-4 h-4 ${
                    actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Verification sent to:
                    </p>
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                    }`}>
                      {newEmail}
                    </p>
                  </div>
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
                  disabled={isLoading || !verificationCode.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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