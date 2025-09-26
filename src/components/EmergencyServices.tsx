import { useState } from "react";
import { Phone, MapPin, AlertTriangle, Shield, Heart, Navigation, Clock, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface EmergencyServicesProps {
  userLocation?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  onBack?: () => void;
}

export function EmergencyServices({ userLocation, onBack }: EmergencyServicesProps) {
  const { actualTheme } = useTheme();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyLog, setEmergencyLog] = useState<any[]>([]);

  const keralaPoliceDepartments = [
    {
      name: "Kerala Police Control Room",
      number: "100",
      type: "emergency",
      description: "24/7 Emergency Police Services",
      coverage: "Statewide"
    },
    {
      name: "Tourist Police Kochi",
      number: "+91-484-2371018",
      type: "tourist",
      description: "Tourist assistance and safety",
      coverage: "Kochi & Ernakulam"
    },
    {
      name: "Kerala Police Cyber Cell",
      number: "+91-471-2721547",
      type: "cyber",
      description: "Cyber crime and online fraud",
      coverage: "Statewide"
    },
    {
      name: "Women Helpline Kerala",
      number: "1091",
      type: "women",
      description: "Women safety and assistance",
      coverage: "Statewide"
    }
  ];

  const keralaHospitals = [
    {
      name: "Ernakulam Medical Centre",
      number: "+91-484-2374747",
      type: "multi",
      description: "Multi-specialty hospital",
      location: "Kochi",
      services: ["Emergency", "Trauma", "ICU"]
    },
    {
      name: "SCTIMST Emergency",
      number: "+91-471-2524266",
      type: "cardiac",
      description: "Cardiac emergency specialist",
      location: "Thiruvananthapuram",
      services: ["Cardiac Emergency", "ICU", "Surgery"]
    },
    {
      name: "Medical College Kozhikode",
      number: "+91-495-2353238",
      type: "government",
      description: "Government medical college",
      location: "Kozhikode",
      services: ["Emergency", "Trauma", "General Medicine"]
    },
    {
      name: "Amrita Institute Medical Sciences",
      number: "+91-484-2852024",
      type: "multi",
      description: "Advanced medical care",
      location: "Kochi",
      services: ["Emergency", "Trauma", "Speciality Care"]
    },
    {
      name: "Kerala Institute of Medical Sciences",
      number: "+91-471-3041400",
      type: "multi",
      description: "Super specialty hospital",
      location: "Thiruvananthapuram",
      services: ["Emergency", "ICU", "Surgery"]
    }
  ];

  const emergencyServices = [
    {
      name: "Fire & Rescue",
      number: "101",
      icon: "🚒",
      description: "Fire emergencies and rescue operations",
      color: "red"
    },
    {
      name: "Ambulance",
      number: "108",
      icon: "🚑",
      description: "Medical emergency ambulance",
      color: "green"
    },
    {
      name: "Disaster Management",
      number: "+91-471-2327175",
      icon: "⛑️",
      description: "Kerala State Disaster Management",
      color: "orange"
    },
    {
      name: "Coast Guard",
      number: "+91-484-2666502",
      icon: "🚢",
      description: "Maritime emergencies",
      color: "blue"
    }
  ];

  const handleEmergencyCall = (name: string, number: string) => {
    // Log the emergency call
    const callLog = {
      id: Date.now(),
      service: name,
      number: number,
      timestamp: new Date().toISOString(),
      location: userLocation
    };
    
    setEmergencyLog(prev => [callLog, ...prev]);
    
    // In a real app, this would initiate the actual call
    if (window.confirm(`Call ${name} at ${number}?\n\nThis will initiate an emergency call.`)) {
      // Simulate emergency call
      window.location.href = `tel:${number}`;
      toast.success(`Calling ${name}...`);
    }
  };

  const handleSOSActivation = () => {
    setIsSOSActive(true);
    
    // Send location to emergency contacts
    const sosAlert = {
      id: Date.now(),
      type: 'SOS_ACTIVATED',
      timestamp: new Date().toISOString(),
      location: userLocation,
      message: 'Emergency SOS activated - immediate assistance required'
    };
    
    setEmergencyLog(prev => [sosAlert, ...prev]);
    
    // Simulate sending alerts to emergency contacts
    toast.success("SOS Alert sent to emergency contacts!");
    toast.success("Location shared with authorities!");
    
    // Auto-deactivate after 30 seconds for demo
    setTimeout(() => {
      setIsSOSActive(false);
      toast.info("SOS alert status updated");
    }, 30000);
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMsg = `Emergency location: https://maps.google.com/?q=${latitude},${longitude}`;
          
          // In a real app, this would send to emergency services
          navigator.clipboard.writeText(locationMsg);
          toast.success("Location copied to clipboard!");
        },
        (error) => {
          toast.error("Unable to get location. Please enable location services.");
        }
      );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className={`rounded-full ${
                actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className={`w-5 h-5 rotate-180 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-700'
              }`} />
            </Button>
          )}
          <div className="flex-1">
            <h1 className={`text-xl font-semibold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Emergency Services
            </h1>
            <p className={`text-sm ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Quick access to Kerala emergency services
            </p>
          </div>
        </div>

        {/* SOS Button */}
        <Card className={`${
          isSOSActive 
            ? (actualTheme === 'dark' 
              ? 'bg-red-900/50 border-red-700 animate-pulse' 
              : 'bg-red-50 border-red-300 animate-pulse'
            )
            : (actualTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white border-gray-200'
            )
        }`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Button
                onClick={handleSOSActivation}
                disabled={isSOSActive}
                className={`w-32 h-32 rounded-full text-xl font-bold ${
                  isSOSActive 
                    ? 'bg-red-600 hover:bg-red-600 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 animate-pulse hover:animate-none'
                } text-white shadow-lg`}
              >
                {isSOSActive ? (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="w-8 h-8 mb-1" />
                    <span className="text-sm">ACTIVE</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">SOS</span>
                    <span className="text-xs">EMERGENCY</span>
                  </div>
                )}
              </Button>
              <div>
                <p className={`font-medium ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isSOSActive ? 'Emergency Alert Active' : 'Press for Emergency'}
                </p>
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isSOSActive 
                    ? 'Authorities and contacts have been notified'
                    : 'Long press to activate emergency alert'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Emergency Numbers */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Quick Emergency Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {emergencyServices.map((service, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleEmergencyCall(service.name, service.number)}
                className={`h-20 flex flex-col gap-2 ${
                  actualTheme === 'dark' 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{service.icon}</span>
                <div className="text-center">
                  <p className="text-xs font-medium">{service.name}</p>
                  <p className="text-xs opacity-70">{service.number}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kerala Police Services */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Shield className="w-5 h-5 text-blue-600" />
            Kerala Police Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {keralaPoliceDepartments.map((dept, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              actualTheme === 'dark' 
                ? 'border-gray-600 bg-gray-700/50' 
                : 'border-gray-300 bg-white'
            }`}>
              <Button
                variant="ghost"
                onClick={() => handleEmergencyCall(dept.name, dept.number)}
                className={`w-full justify-start h-auto p-0 hover:bg-transparent ${
                  actualTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${
                    actualTheme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
                  }`}>
                    <Shield className={`w-4 h-4 ${
                      actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium text-sm ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dept.name}
                      </p>
                      <Badge variant="outline" className={`text-xs px-2 py-1 font-medium rounded-md ${
                        dept.type === 'emergency' ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400' :
                        dept.type === 'tourist' ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400' :
                        dept.type === 'cyber' ? 'border-purple-500 text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400 dark:text-purple-400' :
                        'border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-400 dark:text-orange-400'
                      }`}>
                        {dept.type === 'tourist' ? 'Emergency Tourist' : 
                         dept.type === 'emergency' ? 'Emergency' :
                         dept.type === 'cyber' ? 'Cyber Crime' :
                         dept.type === 'women' ? 'Women Safety' : dept.type}
                      </Badge>
                    </div>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {dept.description} • {dept.coverage}
                    </p>
                    <p className={`text-xs font-mono mt-1 ${
                      actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      📞 {dept.number}
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Kerala Hospitals */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Heart className="w-5 h-5 text-red-600" />
            Kerala Hospitals & Medical Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {keralaHospitals.map((hospital, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              actualTheme === 'dark' 
                ? 'border-gray-600 bg-gray-700/50' 
                : 'border-gray-300 bg-white'
            }`}>
              <Button
                variant="ghost"
                onClick={() => handleEmergencyCall(hospital.name, hospital.number)}
                className={`w-full justify-start h-auto p-0 hover:bg-transparent ${
                  actualTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${
                    actualTheme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'
                  }`}>
                    <Heart className={`w-4 h-4 ${
                      actualTheme === 'dark' ? 'text-red-300' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium text-sm ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {hospital.name}
                      </p>
                      <Badge variant="outline" className={`text-xs px-2 py-1 font-medium rounded-md ${
                        hospital.type === 'government' ? 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400' :
                        hospital.type === 'cardiac' ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400 dark:text-red-400' :
                        'border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                      }`}>
                        {hospital.type}
                      </Badge>
                    </div>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {hospital.description} • {hospital.location}
                    </p>
                    <p className={`text-xs font-mono mt-1 ${
                      actualTheme === 'dark' ? 'text-green-300' : 'text-green-600'
                    }`}>
                      📞 {hospital.number}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hospital.services.map((service, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded-full ${
                          actualTheme === 'dark' 
                            ? 'bg-gray-600/50 text-gray-300 border border-gray-600' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Navigation className="w-5 h-5 text-purple-600" />
            Emergency Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={handleShareLocation}
              variant="outline"
              className={`w-full justify-start ${
                actualTheme === 'dark' 
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4 mr-3" />
              Share Current Location
            </Button>
            <Button
              onClick={() => window.open('https://keralatourism.gov.in/emergency-contacts', '_blank')}
              variant="outline"
              className={`w-full justify-start ${
                actualTheme === 'dark' 
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ExternalLink className="w-4 h-4 mr-3" />
              Kerala Tourism Helpdesk
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Log */}
      {emergencyLog.length > 0 && (
        <Card className={`mx-4 ${
          actualTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Clock className="w-5 h-5 text-gray-600" />
              Recent Emergency Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emergencyLog.slice(0, 3).map((log, index) => (
                <div key={log.id} className={`p-2 rounded-lg text-xs ${
                  actualTheme === 'dark' 
                    ? 'bg-gray-700/50 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <p className="font-medium">{log.service || log.type}</p>
                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}