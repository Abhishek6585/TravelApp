import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Phone, MapPin, X, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface SOSButtonProps {
  isVisible: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onEmergencyCall?: () => void;
}

export function SOSButton({ isVisible, userLocation, onEmergencyCall }: SOSButtonProps) {
  const { actualTheme } = useTheme();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [sosAttempts, setSOSAttempts] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(30);
  
  const responseCheckTimer = useRef<NodeJS.Timeout>();
  const retryTimer = useRef<NodeJS.Timeout>();

  const sendEmergencyAlerts = useCallback(() => {
    const currentAttempt = sosAttempts + 1;
    setSOSAttempts(currentAttempt);
    
    // Simulate emergency alerts
    if (currentAttempt === 1) {
      toast.success("🚨 Emergency alert sent to authorities!");
      toast.success("📍 Location shared with emergency contacts!");
      toast.success("📱 SMS alerts sent to emergency contacts!");
    } else {
      toast.warning(`🔄 Retry SOS alert #${currentAttempt} sent!`);
      toast.info("📡 Escalating emergency - sending to additional contacts!");
    }
    
    // Simulate location sharing
    if (userLocation) {
      console.log(`Emergency location (attempt ${currentAttempt}):`, userLocation);
    }
    
    if (onEmergencyCall) {
      onEmergencyCall();
    }
    
    // Start waiting for response (5 seconds)
    setIsWaitingForResponse(true);
    
    // Clear any existing timers
    if (responseCheckTimer.current) {
      clearTimeout(responseCheckTimer.current);
    }
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
    }
    
    // Check for response after 5 seconds
    responseCheckTimer.current = setTimeout(() => {
      // No response received, start retry countdown
      setIsWaitingForResponse(false);
      setRetryCountdown(30);
      
      toast.warning("⏰ No response received. Auto-retry in 30 seconds...");
      
      // Start the retry countdown
      const retryInterval = setInterval(() => {
        setRetryCountdown(prev => {
          if (prev <= 1) {
            clearInterval(retryInterval);
            // Auto-retry SOS
            sendEmergencyAlerts();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      retryTimer.current = retryInterval as any;
    }, 5000);
  }, [userLocation, onEmergencyCall, sosAttempts]);

  const handleSOSConfirm = useCallback(() => {
    setIsSOSActive(true);
    setShowSOSModal(false);
    setIsCountingDown(false);
    setSOSAttempts(0); // Reset attempts
    
    // Send emergency alerts
    sendEmergencyAlerts();
  }, [sendEmergencyAlerts]);
  
  const handleResponseReceived = useCallback(() => {
    // Clear all timers when response is received
    if (responseCheckTimer.current) {
      clearTimeout(responseCheckTimer.current);
    }
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
    }
    
    setIsWaitingForResponse(false);
    setRetryCountdown(30);
    setIsSOSActive(false);
    setSOSAttempts(0);
    
    toast.success("✅ Emergency response confirmed! Help is on the way.");
  }, []);
  
  const handleStopSOS = useCallback(() => {
    // Clear all timers
    if (responseCheckTimer.current) {
      clearTimeout(responseCheckTimer.current);
    }
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
    }
    
    setIsSOSActive(false);
    setIsWaitingForResponse(false);
    setSOSAttempts(0);
    setRetryCountdown(30);
    
    toast.info("SOS deactivated - Stay safe!");
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCountingDown && countdown === 0) {
      // Auto-trigger SOS
      handleSOSConfirm();
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown, handleSOSConfirm]);

  const handleSOSPress = () => {
    setShowSOSModal(true);
    setIsCountingDown(true);
    setCountdown(5);
  };

  const handleSOSCancel = () => {
    setShowSOSModal(false);
    setIsCountingDown(false);
    setCountdown(5);
    toast.info("SOS activation cancelled");
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (responseCheckTimer.current) {
        clearTimeout(responseCheckTimer.current);
      }
      if (retryTimer.current) {
        clearTimeout(retryTimer.current);
      }
    };
  }, []);

  const emergencyNumbers = [
    { name: "Police", number: "100", icon: "🚔" },
    { name: "Ambulance", number: "108", icon: "🚑" },
    { name: "Fire", number: "101", icon: "🚒" }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button
          onClick={handleSOSPress}
          disabled={isSOSActive}
          className={`w-16 h-16 rounded-full shadow-lg ${
            isSOSActive 
              ? 'bg-red-700 hover:bg-red-700 animate-pulse' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white border-2 border-white`}
        >
          {isSOSActive ? (
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs">ACTIVE</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-bold text-sm">SOS</span>
            </div>
          )}
        </Button>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className={`w-full max-w-sm ${
            actualTheme === 'dark' 
              ? 'bg-gray-800 border-red-600' 
              : 'bg-white border-red-300'
          } border-2`}>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                  actualTheme === 'dark' 
                    ? 'bg-red-900/50 border-red-600' 
                    : 'bg-red-100 border-red-300'
                } border-2 animate-pulse`}>
                  <AlertTriangle className={`w-8 h-8 ${
                    actualTheme === 'dark' ? 'text-red-300' : 'text-red-600'
                  }`} />
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Emergency SOS Alert
                  </h3>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    This will alert authorities and emergency contacts
                  </p>
                </div>

                {/* Countdown */}
                <div className={`text-4xl font-bold ${
                  actualTheme === 'dark' ? 'text-red-300' : 'text-red-600'
                }`}>
                  {countdown}
                </div>
                
                <p className={`text-xs ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Auto-activating in {countdown} seconds...
                </p>

                {/* Emergency Numbers Quick Access */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  {emergencyNumbers.map((service, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${service.number}`}
                      className={`h-12 flex flex-col gap-1 text-xs ${
                        actualTheme === 'dark' 
                          ? 'border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span>{service.icon}</span>
                      <span>{service.name}</span>
                    </Button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSOSCancel}
                    className={`flex-1 ${
                      actualTheme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSOSConfirm}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Activate SOS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SOS Active Notification */}
      {isSOSActive && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <Card className={`${
            actualTheme === 'dark' 
              ? 'bg-red-900/90 border-red-600 text-red-100' 
              : 'bg-red-50 border-red-300 text-red-800'
          } border ${isWaitingForResponse ? 'animate-pulse' : ''}`}>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Emergency SOS Active {sosAttempts > 0 && `(Attempt ${sosAttempts})`}
                    </p>
                    <p className="text-xs opacity-90">
                      {isWaitingForResponse 
                        ? "Waiting for emergency response..." 
                        : sosAttempts > 0 
                          ? `Auto-retry in ${retryCountdown}s` 
                          : "Authorities and contacts have been notified"
                      }
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStopSOS}
                    className="w-6 h-6 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResponseReceived}
                    className={`flex-1 text-xs ${
                      actualTheme === 'dark' 
                        ? 'border-green-600 text-green-400 hover:bg-green-900/20' 
                        : 'border-green-500 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    ✅ Help Arrived
                  </Button>
                  {sosAttempts > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={sendEmergencyAlerts}
                      className={`flex-1 text-xs ${
                        actualTheme === 'dark' 
                          ? 'border-orange-600 text-orange-400 hover:bg-orange-900/20' 
                          : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Retry Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}