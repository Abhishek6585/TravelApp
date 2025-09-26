package com.kerala.traveltracker.utils;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;

import androidx.appcompat.app.AppCompatDelegate;

import com.kerala.traveltracker.R;
import com.kerala.traveltracker.utils.PreferenceManager.PreferenceHelper;

/**
 * Theme Manager for Kerala Travel Tracker
 * Handles light/dark theme switching
 */
public class ThemeManager {
    
    public enum Theme {
        LIGHT("light"),
        DARK("dark"),
        SYSTEM("system");
        
        private final String value;
        
        Theme(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static Theme fromValue(String value) {
            for (Theme theme : values()) {
                if (theme.getValue().equals(value)) {
                    return theme;
                }
            }
            return SYSTEM; // default
        }
    }
    
    private final Context context;
    private final PreferenceHelper preferenceHelper;
    
    public ThemeManager(Context context) {
        this.context = context;
        this.preferenceHelper = new PreferenceHelper(context);
    }
    
    /**
     * Get current theme setting
     */
    public Theme getCurrentTheme() {
        String themeValue = preferenceHelper.getTheme();
        return Theme.fromValue(themeValue);
    }
    
    /**
     * Set theme preference
     */
    public void setTheme(Theme theme) {
        preferenceHelper.setTheme(theme.getValue());
        applyTheme();
    }
    
    /**
     * Apply current theme setting
     */
    public void applyTheme() {
        Theme currentTheme = getCurrentTheme();
        applyTheme(currentTheme);
    }
    
    /**
     * Apply specific theme
     */
    public void applyTheme(Theme theme) {
        switch (theme) {
            case LIGHT:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                preferenceHelper.setDarkMode(false);
                break;
            case DARK:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                preferenceHelper.setDarkMode(true);
                break;
            case SYSTEM:
            default:
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                } else {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_AUTO_BATTERY);
                }
                preferenceHelper.setDarkMode(isSystemDarkMode());
                break;
        }
    }
    
    /**
     * Apply theme to specific activity
     */
    public void applyTheme(Activity activity) {
        applyTheme();
        
        if (isDarkMode()) {
            activity.setTheme(R.style.AppTheme_Dark);
        } else {
            activity.setTheme(R.style.AppTheme);
        }
    }
    
    /**
     * Check if current mode is dark
     */
    public boolean isDarkMode() {
        Theme currentTheme = getCurrentTheme();
        
        switch (currentTheme) {
            case LIGHT:
                return false;
            case DARK:
                return true;
            case SYSTEM:
            default:
                return isSystemDarkMode();
        }
    }
    
    /**
     * Check if system is in dark mode
     */
    public boolean isSystemDarkMode() {
        int nightModeFlags = context.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return nightModeFlags == Configuration.UI_MODE_NIGHT_YES;
    }
    
    /**
     * Get theme display name
     */
    public String getThemeDisplayName(Theme theme) {
        switch (theme) {
            case LIGHT:
                return "Light";
            case DARK:
                return "Dark";
            case SYSTEM:
                return "System Default";
            default:
                return theme.getValue();
        }
    }
    
    /**
     * Get theme icon resource
     */
    public int getThemeIcon(Theme theme) {
        switch (theme) {
            case LIGHT:
                return R.drawable.ic_light_mode;
            case DARK:
                return R.drawable.ic_dark_mode;
            case SYSTEM:
                return R.drawable.ic_auto_mode;
            default:
                return R.drawable.ic_auto_mode;
        }
    }
    
    /**
     * Get current theme icon
     */
    public int getCurrentThemeIcon() {
        return getThemeIcon(getCurrentTheme());
    }
    
    /**
     * Toggle between light and dark mode
     */
    public void toggleTheme() {
        Theme currentTheme = getCurrentTheme();
        
        if (currentTheme == Theme.LIGHT) {
            setTheme(Theme.DARK);
        } else if (currentTheme == Theme.DARK) {
            setTheme(Theme.LIGHT);
        } else {
            // If system, toggle to opposite of current system mode
            if (isSystemDarkMode()) {
                setTheme(Theme.LIGHT);
            } else {
                setTheme(Theme.DARK);
            }
        }
    }
    
    /**
     * Get all available themes
     */
    public Theme[] getAvailableThemes() {
        return Theme.values();
    }
    
    /**
     * Get status bar color based on current theme
     */
    public int getStatusBarColor() {
        if (isDarkMode()) {
            return context.getResources().getColor(R.color.kerala_dark);
        } else {
            return context.getResources().getColor(R.color.kerala_green);
        }
    }
    
    /**
     * Get navigation bar color based on current theme
     */
    public int getNavigationBarColor() {
        if (isDarkMode()) {
            return context.getResources().getColor(R.color.kerala_dark);
        } else {
            return context.getResources().getColor(R.color.kerala_green);
        }
    }
    
    /**
     * Get primary color based on current theme
     */
    public int getPrimaryColor() {
        if (isDarkMode()) {
            return context.getResources().getColor(R.color.kerala_green);
        } else {
            return context.getResources().getColor(R.color.kerala_green);
        }
    }
    
    /**
     * Get background color based on current theme
     */
    public int getBackgroundColor() {
        if (isDarkMode()) {
            return context.getResources().getColor(R.color.kerala_dark);
        } else {
            return context.getResources().getColor(R.color.white);
        }
    }
    
    /**
     * Get text color based on current theme
     */
    public int getTextColor() {
        if (isDarkMode()) {
            return context.getResources().getColor(R.color.white);
        } else {
            return context.getResources().getColor(R.color.kerala_dark);
        }
    }
    
    /**
     * Check if current theme supports gradient backgrounds
     */
    public boolean supportsGradientBackground() {
        return !isDarkMode(); // Only light theme uses Kerala background gradients
    }
    
    /**
     * Get theme description for Kerala context
     */
    public String getKeralaThemeDescription(Theme theme) {
        switch (theme) {
            case LIGHT:
                return "Bright as Kerala's golden beaches";
            case DARK:
                return "Peaceful as Kerala's night backwaters";
            case SYSTEM:
                return "Adapts like Kerala's changing seasons";
            default:
                return "Kerala Travel Theme";
        }
    }
}