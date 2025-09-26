import { ArrowLeft, Heart, Users, Leaf, MapPin, Star, ExternalLink, Github, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface AboutAppProps {
  onBack: () => void;
}

export function AboutApp({ onBack }: AboutAppProps) {
  const features = [
    {
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      title: "Smart Trip Tracking",
      description: "Comprehensive logging of all your Kerala journeys"
    },
    {
      icon: <Leaf className="w-5 h-5 text-green-600" />,
      title: "Carbon Footprint Analysis",
      description: "Real-time environmental impact calculations"
    },
    {
      icon: <Users className="w-5 h-5 text-purple-600" />,
      title: "Community Routes",
      description: "Discover popular paths from fellow travelers"
    },
    {
      icon: <Star className="w-5 h-5 text-orange-600" />,
      title: "Personalized Insights",
      description: "AI-powered travel pattern analysis"
    }
  ];

  const teamMembers = [
    {
      name: "Arun Kumar",
      role: "Lead Developer",
      location: "Kochi, Kerala"
    },
    {
      name: "Priya Nair",
      role: "UX Designer",
      location: "Thiruvananthapuram, Kerala"
    },
    {
      name: "Ravi Menon",
      role: "Data Scientist",
      location: "Kozhikode, Kerala"
    },
    {
      name: "Kavya Pillai",
      role: "Community Manager",
      location: "Kottayam, Kerala"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Trips Logged", value: "2M+" },
    { label: "CO₂ Saved", value: "500T+" },
    { label: "Routes Mapped", value: "10K+" }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">About App</h1>
          <p className="text-sm text-muted-foreground">Learn more about Kerala Travel Tracker</p>
        </div>
      </div>

      {/* App Identity */}
      <Card className="mx-4 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-200 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-4xl">🌴</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-green-800">Kerala Travel Tracker</h2>
              <p className="text-green-600 font-medium">God's Own Country, Your Own Journey</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className="bg-green-200 text-green-800">Version 2.1.0</Badge>
                <Badge variant="outline">Free</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            To empower travelers in Kerala to make sustainable, informed journey choices while 
            celebrating the rich cultural heritage and natural beauty of God's Own Country. 
            We believe every trip should be mindful, memorable, and meaningful.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Community Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-semibold text-green-600">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Made in Kerala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Built by locals who understand Kerala's unique travel landscape and culture.
          </p>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <p className="text-xs text-green-600">{member.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Technology & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Data Protection</p>
            <p className="text-sm text-muted-foreground">
              End-to-end encryption, GDPR compliant, and designed with privacy-first principles. 
              Your travel data stays yours.
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Offline Capabilities</p>
            <p className="text-sm text-muted-foreground">
              Core features work offline, perfect for remote Kerala locations with limited connectivity.
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Local Integration</p>
            <p className="text-sm text-muted-foreground">
              Real-time integration with KSRTC schedules, weather data, and local transport information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Links */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Connect With Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Mail className="w-4 h-4 mr-2" />
            hello@keralatraveltracker.com
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit our website
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Github className="w-4 h-4 mr-2" />
            Open source on GitHub
          </Button>
        </CardContent>
      </Card>

      {/* Acknowledgments */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Special Thanks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Kerala Tourism Department</strong> for route data and cultural insights
          </p>
          <p>
            <strong>KSRTC</strong> for transport schedule integration
          </p>
          <p>
            <strong>Local Communities</strong> across Kerala for testing and feedback
          </p>
          <p>
            <strong>Environmental Scientists</strong> for carbon footprint validation
          </p>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card className="mx-4">
        <CardContent className="pt-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-4 text-sm">
              <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
              <Button variant="link" className="p-0 h-auto">Terms of Service</Button>
              <Button variant="link" className="p-0 h-auto">Licenses</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Kerala Travel Tracker. Made with ❤️ in Kerala.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}