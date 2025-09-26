package com.kerala.traveltracker.utils.PreferenceManager;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.preference.PreferenceManager;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.kerala.traveltracker.models.User;
import com.kerala.traveltracker.models.Trip;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * Helper class for managing shared preferences in Kerala Travel Tracker
 */
public class PreferenceHelper {
    
    private static final String PREF_USER_AUTHENTICATED = "user_authenticated";
    private static final String PREF_USER_DATA = "user_data";
    private static final String PREF_TRIPS_DATA = "trips_data";
    private static final String PREF_LANGUAGE = "app_language";
    private static final String PREF_THEME = "app_theme";
    private static final String PREF_FIRST_LAUNCH = "first_launch";
    private static final String PREF_LOCATION_PERMISSION = "location_permission";
    private static final String PREF_NOTIFICATION_ENABLED = "notification_enabled";
    private static final String PREF_DARK_MODE = "dark_mode";
    private static final String PREF_LAST_SYNC = "last_sync";
    
    private final SharedPreferences sharedPreferences;
    private final Gson gson;
    
    public PreferenceHelper(Context context) {
        this.sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
        this.gson = new Gson();
    }
    
    // User Authentication
    public boolean isUserAuthenticated() {
        return sharedPreferences.getBoolean(PREF_USER_AUTHENTICATED, false);
    }
    
    public void setUserAuthenticated(boolean authenticated) {
        sharedPreferences.edit()
                .putBoolean(PREF_USER_AUTHENTICATED, authenticated)
                .apply();
    }
    
    // User Data
    public void saveUser(User user) {
        String userJson = gson.toJson(user);
        sharedPreferences.edit()
                .putString(PREF_USER_DATA, userJson)
                .apply();
    }
    
    public User getUser() {
        String userJson = sharedPreferences.getString(PREF_USER_DATA, null);
        if (userJson != null) {
            return gson.fromJson(userJson, User.class);
        }
        return null;
    }
    
    public void clearUser() {
        sharedPreferences.edit()
                .remove(PREF_USER_DATA)
                .putBoolean(PREF_USER_AUTHENTICATED, false)
                .apply();
    }
    
    // Trips Data
    public void saveTrips(List<Trip> trips) {
        String tripsJson = gson.toJson(trips);
        sharedPreferences.edit()
                .putString(PREF_TRIPS_DATA, tripsJson)
                .apply();
    }
    
    public List<Trip> getTrips() {
        String tripsJson = sharedPreferences.getString(PREF_TRIPS_DATA, null);
        if (tripsJson != null) {
            Type listType = new TypeToken<ArrayList<Trip>>() {}.getType();
            return gson.fromJson(tripsJson, listType);
        }
        return getDefaultTrips();
    }
    
    public void addTrip(Trip trip) {
        List<Trip> trips = getTrips();
        trips.add(trip);
        saveTrips(trips);
    }
    
    public void updateTrip(Trip updatedTrip) {
        List<Trip> trips = getTrips();
        for (int i = 0; i < trips.size(); i++) {
            if (trips.get(i).getId() == updatedTrip.getId()) {
                trips.set(i, updatedTrip);
                break;
            }
        }
        saveTrips(trips);
    }
    
    public void deleteTrip(int tripId) {
        List<Trip> trips = getTrips();
        trips.removeIf(trip -> trip.getId() == tripId);
        saveTrips(trips);
    }
    
    private List<Trip> getDefaultTrips() {
        List<Trip> defaultTrips = new ArrayList<>();
        
        Trip trip1 = new Trip();
        trip1.setId(1);
        trip1.setOrigin("Kochi");
        trip1.setDestination("Alappuzha");
        trip1.setDate("15 Dec 2024");
        trip1.setMode(Trip.TransportMode.BOAT);
        trip1.setDistance("53 km");
        trip1.setCarbonFootprint("4.2 kg");
        trip1.setStatus(Trip.TripStatus.COMPLETED);
        defaultTrips.add(trip1);
        
        Trip trip2 = new Trip();
        trip2.setId(2);
        trip2.setOrigin("Thiruvananthapuram");
        trip2.setDestination("Kovalam");
        trip2.setDate("12 Dec 2024");
        trip2.setMode(Trip.TransportMode.AUTO);
        trip2.setDistance("16 km");
        trip2.setCarbonFootprint("1.9 kg");
        trip2.setStatus(Trip.TripStatus.COMPLETED);
        defaultTrips.add(trip2);
        
        Trip trip3 = new Trip();
        trip3.setId(3);
        trip3.setOrigin("Munnar");
        trip3.setDestination("Thekkady");
        trip3.setDate("10 Dec 2024");
        trip3.setMode(Trip.TransportMode.BUS);
        trip3.setDistance("94 km");
        trip3.setCarbonFootprint("7.5 kg");
        trip3.setStatus(Trip.TripStatus.COMPLETED);
        defaultTrips.add(trip3);
        
        Trip trip4 = new Trip();
        trip4.setId(4);
        trip4.setOrigin("Kozhikode");
        trip4.setDestination("Wayanad");
        trip4.setDate("8 Dec 2024");
        trip4.setMode(Trip.TransportMode.CAR);
        trip4.setDistance("76 km");
        trip4.setCarbonFootprint("13.7 kg");
        trip4.setStatus(Trip.TripStatus.COMPLETED);
        defaultTrips.add(trip4);
        
        return defaultTrips;
    }
    
    // Language Settings
    public String getLanguage() {
        return sharedPreferences.getString(PREF_LANGUAGE, "en");
    }
    
    public void setLanguage(String language) {
        sharedPreferences.edit()
                .putString(PREF_LANGUAGE, language)
                .apply();
    }
    
    // Theme Settings
    public String getTheme() {
        return sharedPreferences.getString(PREF_THEME, "system");
    }
    
    public void setTheme(String theme) {
        sharedPreferences.edit()
                .putString(PREF_THEME, theme)
                .apply();
    }
    
    public boolean isDarkMode() {
        return sharedPreferences.getBoolean(PREF_DARK_MODE, false);
    }
    
    public void setDarkMode(boolean darkMode) {
        sharedPreferences.edit()
                .putBoolean(PREF_DARK_MODE, darkMode)
                .apply();
    }
    
    // App Settings
    public boolean isFirstLaunch() {
        return sharedPreferences.getBoolean(PREF_FIRST_LAUNCH, true);
    }
    
    public void setFirstLaunch(boolean firstLaunch) {
        sharedPreferences.edit()
                .putBoolean(PREF_FIRST_LAUNCH, firstLaunch)
                .apply();
    }
    
    public boolean hasLocationPermission() {
        return sharedPreferences.getBoolean(PREF_LOCATION_PERMISSION, false);
    }
    
    public void setLocationPermission(boolean granted) {
        sharedPreferences.edit()
                .putBoolean(PREF_LOCATION_PERMISSION, granted)
                .apply();
    }
    
    public boolean isNotificationEnabled() {
        return sharedPreferences.getBoolean(PREF_NOTIFICATION_ENABLED, true);
    }
    
    public void setNotificationEnabled(boolean enabled) {
        sharedPreferences.edit()
                .putBoolean(PREF_NOTIFICATION_ENABLED, enabled)
                .apply();
    }
    
    public long getLastSync() {
        return sharedPreferences.getLong(PREF_LAST_SYNC, 0);
    }
    
    public void setLastSync(long timestamp) {
        sharedPreferences.edit()
                .putLong(PREF_LAST_SYNC, timestamp)
                .apply();
    }
    
    // Clear all data
    public void clearAllData() {
        sharedPreferences.edit().clear().apply();
    }
    
    // Export user data (for GDPR compliance)
    public String exportUserData() {
        User user = getUser();
        List<Trip> trips = getTrips();
        
        UserDataExport export = new UserDataExport();
        export.user = user;
        export.trips = trips;
        export.settings = new UserSettings();
        export.settings.language = getLanguage();
        export.settings.theme = getTheme();
        export.settings.darkMode = isDarkMode();
        export.settings.notificationEnabled = isNotificationEnabled();
        export.exportedAt = System.currentTimeMillis();
        
        return gson.toJson(export);
    }
    
    // Helper classes for data export
    public static class UserDataExport {
        public User user;
        public List<Trip> trips;
        public UserSettings settings;
        public long exportedAt;
    }
    
    public static class UserSettings {
        public String language;
        public String theme;
        public boolean darkMode;
        public boolean notificationEnabled;
    }
}