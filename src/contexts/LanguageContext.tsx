import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TranslationKeys, getTranslation } from "../utils/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(() => {
    // Get language from localStorage or default to English
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerala-travel-language') || 'english';
    }
    return 'english';
  });

  const [t, setT] = useState<TranslationKeys>(getTranslation(language));

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    setT(getTranslation(newLanguage));
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('kerala-travel-language', newLanguage);
    }
  };

  useEffect(() => {
    setT(getTranslation(language));
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}