import React, { useState, useEffect } from 'react';
import { LandingPage } from "./components/LandingPage";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { AppContent } from "./components/AppContent";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { tripAPI } from "./utils/api";
import { toast } from "sonner@2.0.3";

interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  mode: string;
  distance: string;
  carbonFootprint: string;
  status: "completed" | "ongoing" | "planned";
  user_id?: string;
  created_at?: string;
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🌴</span>
        </div>
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600">Loading Kerala Travel Tracker...</p>
      </div>
    </div>
  );
}

function AppMain() {
  const { actualTheme } = useTheme();
  const { user, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [settingsPage, setSettingsPage] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  // Check for password reset on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    if (type === 'recovery') {
      setCurrentView('reset-password');
    }
  }, []);

  // Load user trips when authenticated
  useEffect(() => {
    if (user?.isAuthenticated) {
      loadUserTrips();
      setCurrentView('app');
    } else {
      setCurrentView('landing');
      setTrips([]);
    }
  }, [user?.isAuthenticated]);

  // Load trips from backend
  const loadUserTrips = async () => {
    try {
      setTripsLoading(true);
      const response = await tripAPI.getTrips();
      setTrips(response.trips || []);
    } catch (error) {
      console.error('Failed to load trips:', error);
      toast.error('Failed to load your trips');
      // Fallback to sample data if backend fails
      setTrips([
        {
          id: "sample1",
          origin: "Kochi",
          destination: "Alappuzha",
          date: "15 Dec 2024",
          mode: "boat",
          distance: "53 km",
          carbonFootprint: "4.2 kg",
          status: "completed"
        },
        {
          id: "sample2",
          origin: "Thiruvananthapuram",
          destination: "Kovalam",
          date: "12 Dec 2024",
          mode: "auto",
          distance: "16 km",
          carbonFootprint: "1.9 kg",
          status: "completed"
        }
      ]);
    } finally {
      setTripsLoading(false);
    }
  };

  // Authentication handlers
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      toast.success('Welcome back to Kerala Travel Tracker! 🌴');
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast.error(error.message || 'Sign in failed. Please check your credentials.');
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp(email, password, name);
      toast.success('Welcome to Kerala Travel Tracker! Your account has been created. 🌴');
    } catch (error: any) {
      console.error('Sign up failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentView('landing');
      setActiveTab('home');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox. 📧');
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  // Trip management
  const handleAddTrip = async (newTrip: Omit<Trip, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const response = await tripAPI.saveTrip(newTrip);
      const savedTrip = response.trip;
      
      setTrips(prev => [savedTrip, ...prev]);
      toast.success('Trip added successfully! ✈️');
    } catch (error) {
      console.error('Failed to save trip:', error);
      toast.error('Failed to save trip. Please try again.');
      
      // Fallback: add to local state with temporary ID
      const fallbackTrip: Trip = {
        ...newTrip,
        id: `temp_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setTrips(prev => [fallbackTrip, ...prev]);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await tripAPI.deleteTrip(tripId);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      toast.success('Trip deleted successfully');
    } catch (error) {
      console.error('Failed to delete trip:', error);
      toast.error('Failed to delete trip');
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Show main app if authenticated
  if (user?.isAuthenticated && currentView === 'app') {
    return (
      <AppContent
        user={{
          name: user.name,
          email: user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=fff`,
          city: user.location?.state || 'Kerala',
          phone: '+91 98765 43210',
          isAuthenticated: true
        }}
        trips={trips}
        activeTab={activeTab}
        isEditingProfile={isEditingProfile}
        settingsPage={settingsPage}
        setActiveTab={setActiveTab}
        setIsEditingProfile={setIsEditingProfile}
        setSettingsPage={setSettingsPage}
        onAddTrip={handleAddTrip}
        onDeleteTrip={handleDeleteTrip}
        onSignOut={handleSignOut}
        tripsLoading={tripsLoading}
      />
    );
  }

  // Show authentication flows
  return (
    <div className={`min-h-screen transition-colors duration-300 ${actualTheme === 'dark' ? 'dark' : ''}`}>
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentView('signin')}
          onSignUp={() => setCurrentView('signup')}
        />
      )}
      
      {currentView === 'signin' && (
        <SignIn
          onSignIn={handleSignIn}
          onBackToLanding={() => setCurrentView('landing')}
          onGoToSignUp={() => setCurrentView('signup')}
          onForgotPassword={() => setCurrentView('forgot-password')}
        />
      )}
      
      {currentView === 'signup' && (
        <SignUp
          onSignUp={handleSignUp}
          onBackToLanding={() => setCurrentView('landing')}
          onGoToSignIn={() => setCurrentView('signin')}
        />
      )}
      
      {currentView === 'forgot-password' && (
        <ForgotPassword
          onResetPassword={handleForgotPassword}
          onBackToSignIn={() => setCurrentView('signin')}
        />
      )}
      
      {currentView === 'reset-password' && (
        <ResetPassword
          onPasswordReset={() => setCurrentView('signin')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppMain />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}