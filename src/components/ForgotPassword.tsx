import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

interface ForgotPasswordProps {
  onResetPassword: (email: string) => Promise<void>;
  onBackToSignIn: () => void;
}

export function ForgotPassword({ onResetPassword, onBackToSignIn }: ForgotPasswordProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    try {
      await onResetPassword(email.trim());
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 mt-2">
          <Button variant="ghost" size="icon" onClick={onBackToSignIn}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Check Your Email</h1>
        </div>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email Sent!</CardTitle>
              <CardDescription className="text-center px-2">
                We've sent a password reset email to <strong>{email}</strong>. Please check your inbox and spam folder for the reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={onBackToSignIn} className="w-full bg-green-600 hover:bg-green-700">
                Back to Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
              >
                Send Another Reset Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Kerala Travel Branding */}
        <div className="text-center mt-8 mb-4">
          <p className="text-sm text-muted-foreground">Kerala Travel Tracker</p>
          <p className="text-xs text-green-600 font-medium">Your Journey, Our Heritage</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 mt-2">
        <Button variant="ghost" size="icon" onClick={onBackToSignIn}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Reset Password</h1>
      </div>

      {/* Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Forgot Password?</CardTitle>
            <CardDescription className="text-center px-2">
              Enter your email address and we'll send you a secure reset link with instructions to create a new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading || !email}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={onBackToSignIn}
                className="text-sm text-muted-foreground hover:text-green-600"
              >
                Remember your password? Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kerala Travel Branding */}
      <div className="text-center mt-8 mb-4">
        <p className="text-sm text-muted-foreground">Kerala Travel Tracker</p>
        <p className="text-xs text-green-600 font-medium">Your Journey, Our Heritage</p>
      </div>
    </div>
  );
}