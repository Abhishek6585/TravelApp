import { ArrowRight, MapPin, Leaf, BarChart3, Users, Shield, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onGetStarted: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onGetStarted, onSignUp }: LandingPageProps) {
  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      title: "Track Every Journey",
      description: "Log your trips across Kerala with precise location tracking and route mapping"
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "Carbon Footprint",
      description: "Monitor your environmental impact and discover eco-friendly travel options"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-600" />,
      title: "Smart Insights",
      description: "Get personalized travel patterns and recommendations for better journeys"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Community Routes",
      description: "Discover popular Kerala destinations and routes loved by fellow travelers"
    }
  ];

  const stats = [
    { value: "50K+", label: "Kerala Travelers" },
    { value: "1M+", label: "Trips Tracked" },
    { value: "25%", label: "CO₂ Reduced" },
    { value: "4.8★", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1588068747940-76c095269f83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXJzJTIwc3Vuc2V0JTIwaG91c2Vib2F0fGVufDF8fHx8MTc1ODc3OTEwMHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Kerala Backwaters"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-green-50/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pt-16 pb-20">
          {/* App Logo & Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">🌴</span>
              <span className="font-semibold text-green-800">Kerala Travel Tracker</span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              God's Own Country • Your Own Journey
            </Badge>
          </div>

          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Track Your Kerala
              <br />
              <span className="text-green-600">Adventures</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover, log, and optimize your travels across Kerala while reducing your carbon footprint and exploring hidden gems.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="font-bold text-green-600">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-y-4">
            <Button 
              onClick={onGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full max-w-xs"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={onGetStarted}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 rounded-full font-medium"
              >
                Sign In
              </Button>
              <Button 
                onClick={onSignUp}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 rounded-full font-medium"
              >
                Sign Up
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">Free to use • No credit card required</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Everything You Need for Smart Travel
          </h2>
          <p className="text-gray-600">
            Built specifically for Kerala's unique travel landscape and culture
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Kerala-specific Section */}
      <div className="px-6 py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Made for Kerala Travelers
            </h2>
            <p className="text-gray-600 mb-6">
              Experience features designed for Kerala's diverse transportation and scenic routes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🛺</div>
              <p className="font-medium text-gray-900">Auto Rickshaw</p>
              <p className="text-xs text-gray-600">Local transport tracking</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⛵</div>
              <p className="font-medium text-gray-900">Backwater Boats</p>
              <p className="text-xs text-gray-600">Unique Kerala routes</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🌿</div>
              <p className="font-medium text-gray-900">Spice Routes</p>
              <p className="text-xs text-gray-600">Hill station journeys</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🏝️</div>
              <p className="font-medium text-gray-900">Beach Hops</p>
              <p className="text-xs text-gray-600">Coastal adventures</p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={onGetStarted}
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-full"
            >
              Explore Kerala Routes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trust & Security */}
      <div className="px-6 py-12">
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-900">Privacy First</span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Your travel data stays private and secure. We only track routes and patterns to help you travel better.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Offline Capable</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-12 text-center">
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white">
          <h2 className="text-xl font-semibold mb-2">Ready to Start Tracking?</h2>
          <p className="text-green-100 mb-6 text-sm">
            Join thousands of Kerala travelers making smarter, greener journeys
          </p>
          <div className="space-y-3">
            <Button 
              onClick={onSignUp}
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-3 rounded-full font-semibold w-full max-w-xs"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <div className="space-y-2">
              <Button 
                onClick={onGetStarted}
                variant="link"
                className="text-green-100 hover:text-white"
              >
                Already have an account? Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}