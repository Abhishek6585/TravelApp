import { useState, useCallback } from "react";
import { ChevronRight, Download, Shield, Trash2, FileText, AlertTriangle, Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner@2.0.3";

interface AccountActionsProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    city: string;
    phone: string;
    isAuthenticated: boolean;
  };
  trips: any[];
  onBack: () => void;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export function AccountActions({ 
  user, 
  trips, 
  onBack, 
  onNavigate, 
  onSignOut,
  onDeleteAccount 
}: AccountActionsProps) {
  const { t } = useLanguage();
  const { actualTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadData = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // Simulate data preparation (reduced time)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        profile: {
          name: user.name,
          email: user.email,
          city: user.city,
          phone: user.phone,
          joinDate: "2024-01-15", // Mock join date
          lastLogin: new Date().toISOString()
        },
        trips: trips.map(trip => ({
          id: trip.id,
          origin: trip.origin,
          destination: trip.destination,
          date: trip.date,
          mode: trip.mode,
          distance: trip.distance,
          carbonFootprint: trip.carbonFootprint,
          status: trip.status
        })),
        preferences: {
          language: "English",
          theme: actualTheme,
          notifications: true
        },
        analytics: {
          totalTrips: trips.length,
          totalDistance: trips.reduce((sum, trip) => sum + parseFloat(trip.distance.replace(' km', '')), 0),
          totalCarbonFootprint: trips.reduce((sum, trip) => sum + parseFloat(trip.carbonFootprint.replace(' kg', '')), 0),
          favoriteMode: "boat",
          favoriteRoute: "Kochi to Alappuzha"
        },
        exportInfo: {
          exportDate: new Date().toISOString(),
          exportVersion: "1.0",
          dataTypes: ["Profile", "Trips", "Preferences", "Analytics"]
        }
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `kerala-travel-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast.success("Your data has been exported successfully!");
    } catch (error) {
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [user, trips]);

  const handleDeleteAccount = () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
    } else if (deleteStep === 1) {
      setDeleteStep(2);
    } else {
      // Final confirmation
      toast.success("Account deletion request submitted. You'll receive a confirmation email.");
      onDeleteAccount();
      setShowDeleteConfirm(false);
      setDeleteStep(0);
    }
  };

  const accountActions = [
    {
      id: 'download-data',
      title: 'Download My Data',
      description: 'Export all your travel data, preferences, and account information',
      icon: Download,
      action: handleDownloadData,
      type: 'primary' as const
    },
    {
      id: 'data-privacy',
      title: 'Data & Privacy',
      description: 'Manage your data privacy settings and permissions',
      icon: Shield,
      action: () => onNavigate('privacy-security'),
      type: 'secondary' as const
    },
    {
      id: 'export-report',
      title: 'Generate Travel Report',
      description: 'Create a detailed PDF report of your Kerala travels',
      icon: FileText,
      action: () => generateTravelReport(),
      type: 'secondary' as const
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data',
      icon: Trash2,
      action: () => setShowDeleteConfirm(true),
      type: 'danger' as const
    }
  ];

  const generateTravelReport = useCallback(async () => {
    toast.loading("Generating your travel report...");
    
    // Simulate report generation (reduced time)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reportData = `
# Kerala Travel Report - ${user.name}

## Summary
- Total Trips: ${trips.length}
- Total Distance: ${trips.reduce((sum, trip) => sum + parseFloat(trip.distance.replace(' km', '')), 0)} km
- Carbon Footprint: ${trips.reduce((sum, trip) => sum + parseFloat(trip.carbonFootprint.replace(' kg', '')), 0)} kg
- Most Used Transport: Boat
- Favorite Destination: Alappuzha

## Trip History
${trips.map(trip => `
### ${trip.origin} → ${trip.destination}
- Date: ${trip.date}
- Mode: ${trip.mode}
- Distance: ${trip.distance}
- Carbon Impact: ${trip.carbonFootprint}
- Status: ${trip.status}
`).join('')}

## Environmental Impact
Your eco-friendly travel choices have helped reduce carbon emissions by an estimated 30% compared to conventional transport options.

Generated on: ${new Date().toLocaleDateString()}
`;

    const reportBlob = new Blob([reportData], { type: 'text/markdown' });
    const url = URL.createObjectURL(reportBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `kerala-travel-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    toast.success("Travel report generated successfully!");
  }, [user, trips]);

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
          <ChevronRight className={`w-5 h-5 rotate-180 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-700'
          }`} />
        </Button>
        <div className="flex-1">
          <h1 className={`text-xl font-semibold ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Account Actions
          </h1>
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your account and data
          </p>
        </div>
      </div>

      {/* Account Summary */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-white/50 backdrop-blur-sm'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span>📊</span>
            Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Trips
              </p>
              <p className={`text-2xl font-bold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {trips.length}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              actualTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Data Size
              </p>
              <p className={`text-2xl font-bold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round((JSON.stringify({user, trips}).length / 1024) * 10) / 10} KB
              </p>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            actualTheme === 'dark' 
              ? 'bg-blue-900/20 border-blue-800/30' 
              : 'bg-blue-50 border-blue-200/50'
          }`}>
            <p className={`text-sm font-medium ${
              actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Account Created: January 15, 2024
            </p>
            <p className={`text-xs ${
              actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Last login: {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="px-4 space-y-4">
        {accountActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                actualTheme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70' 
                  : 'bg-white/80 border-white/50 backdrop-blur-sm hover:bg-white/90'
              } ${action.type === 'danger' ? 'border-red-500/30' : ''}`}
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    action.type === 'primary' 
                      ? actualTheme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                      : action.type === 'danger'
                      ? actualTheme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                      : actualTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      action.type === 'primary'
                        ? actualTheme === 'dark' ? 'text-green-300' : 'text-green-600'
                        : action.type === 'danger'
                        ? actualTheme === 'dark' ? 'text-red-300' : 'text-red-600'
                        : actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {action.title}
                      {action.id === 'download-data' && isExporting && (
                        <span className="ml-2 text-xs text-green-500">Exporting...</span>
                      )}
                    </h3>
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className={`w-full max-w-md ${
            actualTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-red-500`}>
                <AlertTriangle className="w-5 h-5" />
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deleteStep === 0 && (
                <>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      This action cannot be undone. All your travel data, preferences, and account information will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      What will be deleted:
                    </p>
                    <ul className={`text-sm space-y-1 ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <li>• {trips.length} travel records</li>
                      <li>• Personal preferences and settings</li>
                      <li>• Account information and profile</li>
                      <li>• All associated analytics data</li>
                    </ul>
                  </div>
                </>
              )}

              {deleteStep === 1 && (
                <>
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <AlertDescription className="text-orange-700">
                      Before we proceed, would you like to download your data first?
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleDownloadData}
                    variant="outline"
                    className="w-full"
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Downloading...' : 'Download My Data First'}
                  </Button>
                </>
              )}

              {deleteStep === 2 && (
                <>
                  <Alert className="border-red-200 bg-red-50">
                    <Check className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      Final confirmation: Are you absolutely sure you want to delete your Kerala Travel Tracker account?
                    </AlertDescription>
                  </Alert>
                </>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteStep(0);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex-1"
                >
                  {deleteStep === 0 ? 'Continue' : deleteStep === 1 ? 'Skip & Continue' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Export Info */}
      <Card className={`mx-4 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-white/50 backdrop-blur-sm'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className={`w-5 h-5 mt-0.5 ${
              actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-medium ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Your Data Rights
              </h4>
              <p className={`text-sm mt-1 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                You have the right to access, correct, or delete your personal data at any time. Data exports include all information we store about you in a portable JSON format.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}