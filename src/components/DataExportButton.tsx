import { useState, useCallback } from "react";
import { Download, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface DataExportButtonProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    city: string;
    phone: string;
    isAuthenticated: boolean;
  };
  trips: any[];
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function DataExportButton({ 
  user, 
  trips, 
  variant = "outline", 
  size = "default",
  className = ""
}: DataExportButtonProps) {
  const { actualTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleDownloadData = useCallback(async () => {
    if (isExporting || isCompleted) return;
    
    setIsExporting(true);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading("Preparing your data export...");
      
      // Simulate data preparation (reduced time to prevent timeout)
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
        metadata: {
          exportDate: new Date().toISOString(),
          exportVersion: "1.0",
          dataTypes: ["Profile", "Trips", "Preferences", "Analytics"],
          format: "JSON",
          source: "Kerala Travel Tracker"
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
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Your data has been exported successfully!");
      
      setIsCompleted(true);
      
      // Reset completed state after 3 seconds
      setTimeout(() => {
        setIsCompleted(false);
      }, 3000);
      
    } catch (error) {
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [user, trips, actualTheme, isExporting, isCompleted]);

  const getButtonContent = () => {
    if (isCompleted) {
      return (
        <>
          <Check className="w-4 h-4 mr-2" />
          Downloaded
        </>
      );
    }
    
    if (isExporting) {
      return (
        <>
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Exporting...
        </>
      );
    }
    
    return (
      <>
        <Download className="w-4 h-4 mr-2" />
        Download Data
      </>
    );
  };

  return (
    <Button
      variant={isCompleted ? "default" : variant}
      size={size}
      onClick={handleDownloadData}
      disabled={isExporting}
      className={`transition-all duration-200 ${
        isCompleted 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : ''
      } ${className}`}
    >
      {getButtonContent()}
    </Button>
  );
}