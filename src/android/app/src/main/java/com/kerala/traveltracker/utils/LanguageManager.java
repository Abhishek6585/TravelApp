package com.kerala.traveltracker.utils;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;

import com.kerala.traveltracker.utils.PreferenceManager.PreferenceHelper;

import java.util.Locale;

/**
 * Language Manager for Kerala Travel Tracker
 * Supports English, Malayalam, Hindi, and Tamil
 */
public class LanguageManager {
    
    public enum Language {
        ENGLISH("en", "English", "English"),
        MALAYALAM("ml", "മലയാളം", "Malayalam"),
        HINDI("hi", "हिन्दी", "Hindi"),
        TAMIL("ta", "தமிழ்", "Tamil");
        
        private final String code;
        private final String nativeName;
        private final String englishName;
        
        Language(String code, String nativeName, String englishName) {
            this.code = code;
            this.nativeName = nativeName;
            this.englishName = englishName;
        }
        
        public String getCode() { return code; }
        public String getNativeName() { return nativeName; }
        public String getEnglishName() { return englishName; }
        
        public static Language fromCode(String code) {
            for (Language lang : values()) {
                if (lang.getCode().equals(code)) {
                    return lang;
                }
            }
            return ENGLISH; // default
        }
    }
    
    private final Context context;
    private final PreferenceHelper preferenceHelper;
    
    public LanguageManager(Context context) {
        this.context = context;
        this.preferenceHelper = new PreferenceHelper(context);
    }
    
    /**
     * Get current app language
     */
    public Language getCurrentLanguage() {
        String languageCode = preferenceHelper.getLanguage();
        return Language.fromCode(languageCode);
    }
    
    /**
     * Set app language
     */
    public void setLanguage(Language language) {
        preferenceHelper.setLanguage(language.getCode());
        applyLanguage();
    }
    
    /**
     * Apply the current language setting to the app
     */
    public void applyLanguage() {
        Language currentLanguage = getCurrentLanguage();
        setLocale(currentLanguage.getCode());
    }
    
    /**
     * Set locale for the application
     */
    private void setLocale(String languageCode) {
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);
        
        Resources resources = context.getResources();
        Configuration configuration = resources.getConfiguration();
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            configuration.setLocale(locale);
        } else {
            configuration.locale = locale;
        }
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            context.createConfigurationContext(configuration);
        } else {
            resources.updateConfiguration(configuration, resources.getDisplayMetrics());
        }
    }
    
    /**
     * Get all available languages
     */
    public Language[] getAvailableLanguages() {
        return Language.values();
    }
    
    /**
     * Check if current language is RTL (Right-to-Left)
     */
    public boolean isRTL() {
        Language currentLanguage = getCurrentLanguage();
        // Currently none of our supported languages are RTL
        // But this can be extended for Arabic, Urdu etc.
        return false;
    }
    
    /**
     * Get localized string for language name
     */
    public String getLanguageDisplayName(Language language) {
        switch (language) {
            case ENGLISH:
                return "English";
            case MALAYALAM:
                return "മലയാളം";
            case HINDI:
                return "हिन्दी";
            case TAMIL:
                return "தமிழ்";
            default:
                return language.getEnglishName();
        }
    }
    
    /**
     * Get language flag emoji
     */
    public String getLanguageFlag(Language language) {
        switch (language) {
            case ENGLISH:
                return "🇺🇸";
            case MALAYALAM:
                return "🇮🇳";
            case HINDI:
                return "🇮🇳";
            case TAMIL:
                return "🇮🇳";
            default:
                return "🌐";
        }
    }
    
    /**
     * Get greeting message in current language
     */
    public String getGreeting() {
        Language currentLanguage = getCurrentLanguage();
        switch (currentLanguage) {
            case MALAYALAM:
                return "നമസ്കാരം!";
            case HINDI:
                return "नमस्ते!";
            case TAMIL:
                return "வணக்கம்!";
            case ENGLISH:
            default:
                return "Hello!";
        }
    }
    
    /**
     * Get Kerala-specific greeting
     */
    public String getKeralaGreeting() {
        Language currentLanguage = getCurrentLanguage();
        switch (currentLanguage) {
            case MALAYALAM:
                return "ദൈവത്തിന്റെ സ്വന്തം നാട്ടിൽ സ്വാഗതം";
            case HINDI:
                return "भगवान के अपने देश में आपका स्वागत है";
            case TAMIL:
                return "கடவுளின் சொந்த நாட்டிற்கு வரவேற்கிறோம்";
            case ENGLISH:
            default:
                return "Welcome to God's Own Country";
        }
    }
    
    /**
     * Get transport mode name in current language
     */
    public String getTransportModeName(String mode) {
        Language currentLanguage = getCurrentLanguage();
        
        if (currentLanguage == Language.MALAYALAM) {
            switch (mode.toLowerCase()) {
                case "boat": return "ബോട്ട്";
                case "auto": return "ഓട്ടോ";
                case "bus": return "ബസ്";
                case "train": return "ട്രെയിൻ";
                case "car": return "കാർ";
                case "bike": return "ബൈക്ക്";
                case "walk": return "നടത്തം";
            }
        } else if (currentLanguage == Language.HINDI) {
            switch (mode.toLowerCase()) {
                case "boat": return "नाव";
                case "auto": return "ऑटो";
                case "bus": return "बस";
                case "train": return "ट्रेन";
                case "car": return "कार";
                case "bike": return "बाइक";
                case "walk": return "पैदल";
            }
        } else if (currentLanguage == Language.TAMIL) {
            switch (mode.toLowerCase()) {
                case "boat": return "படகு";
                case "auto": return "ஆட்டோ";
                case "bus": return "பேருந்து";
                case "train": return "ரயில்";
                case "car": return "கார்";
                case "bike": return "பைக்";
                case "walk": return "நடக்க";
            }
        }
        
        // Default English names
        switch (mode.toLowerCase()) {
            case "boat": return "Boat";
            case "auto": return "Auto-rickshaw";
            case "bus": return "Bus";
            case "train": return "Train";
            case "car": return "Car";
            case "bike": return "Bike";
            case "walk": return "Walk";
            default: return mode;
        }
    }
    
    /**
     * Get popular Kerala destinations in current language
     */
    public String[] getPopularDestinations() {
        Language currentLanguage = getCurrentLanguage();
        
        if (currentLanguage == Language.MALAYALAM) {
            return new String[]{
                "ആലപ്പുഴ ബാക്ക്വാട്ടർ",
                "മുന്നാർ കുന്നുകൾ",
                "കൊച്ചി ഹെറിറ്റേജ്",
                "വയനാട് വന്യജീവി",
                "കോവളം ബീച്ച്",
                "തെക്കടി വനം"
            };
        } else if (currentLanguage == Language.HINDI) {
            return new String[]{
                "अलाप्पुझा बैकवाटर",
                "मुन्नार पहाड़ियां",
                "कोची विरासत",
                "वायनाड वन्यजीव",
                "कोवलम बीच",
                "थेक्कडी जंगल"
            };
        } else if (currentLanguage == Language.TAMIL) {
            return new String[]{
                "அலப்புழா பின்நீர்",
                "முன்னார் மலைகள்",
                "கொச்சி பாரம்பரியம்",
                "வயநாடு வனவிலங்கு",
                "கோவளம் கடற்கரை",
                "தேக்காடி காடு"
            };
        }
        
        // Default English
        return new String[]{
            "Alappuzha Backwaters",
            "Munnar Hills", 
            "Kochi Heritage",
            "Wayanad Wildlife",
            "Kovalam Beach",
            "Thekkady Forest"
        };
    }
}