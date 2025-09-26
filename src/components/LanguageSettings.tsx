import { useState } from "react";
import { ArrowLeft, Globe, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "../contexts/LanguageContext";

interface LanguageSettingsProps {
  onBack: () => void;
}

export function LanguageSettings({ onBack }: LanguageSettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languages = [
    {
      code: 'english',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      coverage: '100%',
      popular: true
    },
    {
      code: 'malayalam',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      flag: '🌴',
      coverage: '95%',
      popular: true,
      regional: true
    },
    {
      code: 'hindi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      coverage: '90%',
      popular: true
    },
    {
      code: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      coverage: '85%',
      popular: true
    },
    {
      code: 'kannada',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      flag: '🇮🇳',
      coverage: '80%'
    },
    {
      code: 'telugu',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      coverage: '75%'
    },
    {
      code: 'marathi',
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      coverage: '70%'
    },
    {
      code: 'gujarati',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳',
      coverage: '70%'
    },
    {
      code: 'bengali',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇮🇳',
      coverage: '75%'
    },
    {
      code: 'punjabi',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      flag: '🇮🇳',
      coverage: '65%'
    },
    {
      code: 'odia',
      name: 'Odia',
      nativeName: 'ଓଡ଼ିଆ',
      flag: '🇮🇳',
      coverage: '60%'
    },
    {
      code: 'assamese',
      name: 'Assamese',
      nativeName: 'অসমীয়া',
      flag: '🇮🇳',
      coverage: '60%'
    }
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setLanguage(languageCode);
    const selectedLang = languages.find(lang => lang.code === languageCode);
    toast(`Language changed to ${selectedLang?.name}`, {
      description: `Interface will update to ${selectedLang?.nativeName}`
    });
  };

  const popularLanguages = languages.filter(lang => lang.popular);
  const otherLanguages = languages.filter(lang => !lang.popular);

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
          <h1 className="text-xl font-semibold">{t.language}</h1>
          <p className="text-sm text-muted-foreground">{t.chooseLanguage}</p>
        </div>
      </div>

      {/* Current Language */}
      <Card className="mx-4 border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {languages.find(lang => lang.code === selectedLanguage)?.flag}
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">
                {languages.find(lang => lang.code === selectedLanguage)?.name}
              </p>
              <p className="text-sm text-green-600">
                {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
              </p>
            </div>
            <Badge className="bg-green-200 text-green-800">
              {t.currentLanguage}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Popular Languages */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            {t.popularLanguages}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularLanguages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedLanguage === language.code
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl">{language.flag}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{language.name}</p>
                  {language.regional && (
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                      {t.keralaLocal}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                <p className="text-xs text-green-600">{language.coverage} {t.translated}</p>
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Other Indian Languages */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            {t.otherLanguages}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {otherLanguages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedLanguage === language.code
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl">{language.flag}</div>
              <div className="flex-1">
                <p className="font-medium">{language.name}</p>
                <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                <p className="text-xs text-blue-600">{language.coverage} {t.translated}</p>
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language Support Info */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>Translation Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>100%:</strong> Complete translation including all features and help content
            </p>
            <p>
              <strong>90-95%:</strong> Most features translated, some advanced features in English
            </p>
            <p>
              <strong>70-85%:</strong> Core features translated, help content partially available
            </p>
            <p>
              <strong>60-65%:</strong> Basic features translated, limited support content
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kerala Special Note */}
      <Card className="mx-4 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">🌴 Kerala Special Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700">
            Malayalam translation includes local place names, transport terms, and cultural references 
            specific to Kerala. Experience the app in God's Own Language!
          </p>
        </CardContent>
      </Card>

      {/* Help with Translation */}
      <Card className="mx-4">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Want to help improve translations for your language?
            </p>
            <Button variant="outline" className="w-full">
              <Globe className="w-4 h-4 mr-2" />
              Become a Translator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}