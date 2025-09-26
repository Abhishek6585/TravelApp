import { useState } from "react";
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface HelpFAQProps {
  onBack: () => void;
}

export function HelpFAQ({ onBack }: HelpFAQProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      questions: [
        {
          question: "How do I create my first trip in Kerala Travel Tracker?",
          answer: "To create your first trip, tap the '+' button on the home screen or navigate to the 'Add Trip' tab. Fill in your origin, destination, travel date, and mode of transport. The app will automatically calculate your carbon footprint and save the trip to your profile."
        },
        {
          question: "What transport modes are supported in Kerala?",
          answer: "We support all major Kerala transport modes including buses (KSRTC, private), trains, boats/ferries, auto-rickshaws, taxis, private cars, bicycles, and walking. Each mode has specific carbon footprint calculations based on Kerala's transport data."
        },
        {
          question: "How accurate is the carbon footprint calculation?",
          answer: "Our calculations are based on official emission factors from the Ministry of Environment, Government of India, combined with Kerala-specific transport data. The accuracy is within 5-10% for most transport modes."
        }
      ]
    },
    {
      title: "Features & Usage",
      icon: "⚡",
      questions: [
        {
          question: "How do I view my travel analytics?",
          answer: "Navigate to the 'Insights' tab to view detailed analytics including monthly summaries, carbon footprint trends, most-used routes, and eco-friendly travel suggestions. You can filter data by date range, transport mode, or specific routes."
        },
        {
          question: "What are Popular Routes and how do they work?",
          answer: "Popular Routes show frequently traveled paths in Kerala, based on aggregated user data. You can browse routes by category (backwaters, hill stations, beaches, cultural sites) and get detailed information about transport options, typical costs, and travel times."
        },
        {
          question: "Can I export my travel data?",
          answer: "Yes! Go to Settings > Profile Information > Download My Data to export your complete travel history in CSV format. This includes all trips, carbon footprint data, and analytics."
        }
      ]
    },
    {
      title: "Kerala-Specific",
      icon: "🌴",
      questions: [
        {
          question: "Does the app work offline in remote Kerala areas?",
          answer: "The app has offline capabilities for trip logging and viewing saved data. However, features like route suggestions, weather updates, and analytics require internet connection. We're working on expanding offline functionality."
        },
        {
          question: "How does the app handle Kerala's monsoon season?",
          answer: "During monsoon (June-September), the app provides weather alerts, suggests alternate routes when roads are flooded, and includes monsoon-specific travel tips. Transport schedules are updated in real-time during this period."
        },
        {
          question: "Are local Kerala transport schedules integrated?",
          answer: "We have integration with KSRTC bus schedules, major railway routes, and popular ferry timings. Private transport and auto-rickshaw rates are estimated based on local data and user contributions."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: "🔒",
      questions: [
        {
          question: "How is my location data protected?",
          answer: "Location data is encrypted and stored securely. We only track start/end points and routes - not continuous location. You can disable location tracking anytime in Settings > Privacy & Security."
        },
        {
          question: "Can I use the app without sharing my data?",
          answer: "Yes! You can disable data sharing in Settings while still using all core features. Some community features like Popular Routes may have limited functionality without data sharing."
        },
        {
          question: "How do I delete my account and data?",
          answer: "Go to Settings > Profile Information > Deactivate Account. This will permanently delete all your data within 30 days. You can also request immediate deletion by contacting support."
        }
      ]
    },
    {
      title: "Troubleshooting",
      icon: "🔧",
      questions: [
        {
          question: "The app is not tracking my location accurately",
          answer: "Ensure location permissions are enabled in your device settings. For better accuracy, enable high-precision GPS and avoid using the app in areas with poor cellular coverage. Restart the app if issues persist."
        },
        {
          question: "My carbon footprint calculations seem incorrect",
          answer: "Check if you've selected the correct transport mode and entered accurate distance. If the issue persists, please contact support with your trip details for manual verification."
        },
        {
          question: "I'm not receiving notifications",
          answer: "Check that notifications are enabled in both app settings and your device settings. Ensure the app is not in battery optimization mode, which can block notifications."
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: "Chat with Support",
      description: "Get instant help from our team",
      icon: <MessageCircle className="w-5 h-5 text-blue-600" />,
      action: "chat"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="w-5 h-5 text-green-600" />,
      action: "email"
    },
    {
      title: "Report a Bug",
      description: "Help us improve the app",
      icon: <HelpCircle className="w-5 h-5 text-orange-600" />,
      action: "bug"
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
          <h1 className="text-xl font-semibold">Help & FAQ</h1>
          <p className="text-sm text-muted-foreground">Find answers to common questions</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mx-4">
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-white rounded-lg">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Categories */}
      {(searchQuery ? filteredCategories : faqCategories).map((category, categoryIndex) => (
        <Card key={categoryIndex} className="mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              {category.title}
              <Badge variant="secondary" className="ml-auto">
                {category.questions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((qa, qaIndex) => (
                <AccordionItem key={qaIndex} value={`${categoryIndex}-${qaIndex}`}>
                  <AccordionTrigger className="text-left">
                    {qa.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {qa.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {/* No Results */}
      {searchQuery && filteredCategories.length === 0 && (
        <Card className="mx-4">
          <CardContent className="pt-6 text-center">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-2">No results found</p>
            <p className="text-sm text-muted-foreground">
              Try searching with different keywords or contact our support team
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card className="mx-4 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">support@keralatraveltracker.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">+91 484-KERALA (537252)</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Live chat: 9 AM - 9 PM IST</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Version */}
      <Card className="mx-4">
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Kerala Travel Tracker v2.1.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: December 2024
          </p>
        </CardContent>
      </Card>
    </div>
  );
}