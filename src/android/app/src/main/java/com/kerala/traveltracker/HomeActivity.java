package com.kerala.traveltracker;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.kerala.traveltracker.fragments.HomeFragment;
import com.kerala.traveltracker.fragments.TripsFragment;
import com.kerala.traveltracker.fragments.InsightsFragment;
import com.kerala.traveltracker.fragments.ProfileFragment;
import com.kerala.traveltracker.models.User;
import com.kerala.traveltracker.models.Trip;
import com.kerala.traveltracker.utils.PreferenceManager.PreferenceHelper;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;

import java.util.List;

/**
 * Main home activity containing the bottom navigation and main app fragments
 */
public class HomeActivity extends AppCompatActivity implements 
    HomeFragment.OnHomeInteractionListener,
    TripsFragment.OnTripsInteractionListener,
    InsightsFragment.OnInsightsInteractionListener,
    ProfileFragment.OnProfileInteractionListener {

    private static final String TAG = "HomeActivity";
    private static final String CURRENT_FRAGMENT_KEY = "current_fragment";

    // UI Components
    private BottomNavigationView bottomNavigationView;

    // Managers
    private PreferenceHelper preferenceHelper;
    private LanguageManager languageManager;
    private ThemeManager themeManager;

    // Data
    private User currentUser;
    private List<Trip> trips;

    // Current fragment tracking
    private String currentFragmentTag = "home";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize managers
        initializeManagers();

        // Apply theme and language
        themeManager.applyTheme(this);
        languageManager.applyLanguage();

        setContentView(R.layout.activity_home);

        // Check authentication
        if (!preferenceHelper.isUserAuthenticated()) {
            navigateToLogin();
            return;
        }

        // Load user data
        loadUserData();

        // Initialize UI
        initializeViews();
        setupBottomNavigation();

        // Restore state or load default fragment
        if (savedInstanceState != null) {
            currentFragmentTag = savedInstanceState.getString(CURRENT_FRAGMENT_KEY, "home");
        }

        navigateToFragment(currentFragmentTag);
    }

    private void initializeManagers() {
        preferenceHelper = new PreferenceHelper(this);
        languageManager = new LanguageManager(this);
        themeManager = new ThemeManager(this);
    }

    private void loadUserData() {
        currentUser = preferenceHelper.getUser();
        trips = preferenceHelper.getTrips();

        if (currentUser == null) {
            navigateToLogin();
        }
    }

    private void initializeViews() {
        bottomNavigationView = findViewById(R.id.bottom_navigation);
    }

    private void setupBottomNavigation() {
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            
            if (itemId == R.id.nav_home) {
                navigateToFragment("home");
                return true;
            } else if (itemId == R.id.nav_trips) {
                navigateToFragment("trips");
                return true;
            } else if (itemId == R.id.nav_insights) {
                navigateToFragment("insights");
                return true;
            } else if (itemId == R.id.nav_profile) {
                navigateToFragment("profile");
                return true;
            }
            
            return false;
        });
    }

    private void navigateToFragment(String fragmentTag) {
        Fragment fragment = null;
        currentFragmentTag = fragmentTag;

        switch (fragmentTag) {
            case "home":
                fragment = new HomeFragment();
                bottomNavigationView.setSelectedItemId(R.id.nav_home);
                break;
            case "trips":
                fragment = new TripsFragment();
                bottomNavigationView.setSelectedItemId(R.id.nav_trips);
                break;
            case "insights":
                fragment = new InsightsFragment();
                bottomNavigationView.setSelectedItemId(R.id.nav_insights);
                break;
            case "profile":
                fragment = new ProfileFragment();
                bottomNavigationView.setSelectedItemId(R.id.nav_profile);
                break;
        }

        if (fragment != null) {
            FragmentManager fragmentManager = getSupportFragmentManager();
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.replace(R.id.fragment_container, fragment, fragmentTag);
            transaction.commit();
        }
    }

    private void navigateToLogin() {
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString(CURRENT_FRAGMENT_KEY, currentFragmentTag);
    }

    // HomeFragment Interface
    @Override
    public void onAddTripClicked() {
        // Navigate to add trip or show add trip dialog
        navigateToFragment("trips");
        // TODO: Show add trip dialog
    }

    @Override
    public void onViewAllTripsClicked() {
        navigateToFragment("trips");
    }

    @Override
    public void onRouteClicked(String origin, String destination) {
        // Handle popular route click
        navigateToFragment("trips");
        // TODO: Pre-fill trip form with selected route
    }

    // TripsFragment Interface
    @Override
    public void onTripAdded(Trip trip) {
        trips.add(trip);
        preferenceHelper.saveTrips(trips);
        Toast.makeText(this, getString(R.string.success_trip_added), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onTripUpdated(Trip trip) {
        preferenceHelper.updateTrip(trip);
        // Reload trips
        trips = preferenceHelper.getTrips();
        Toast.makeText(this, getString(R.string.success_profile_updated), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onTripDeleted(int tripId) {
        preferenceHelper.deleteTrip(tripId);
        trips = preferenceHelper.getTrips();
        Toast.makeText(this, "Trip deleted successfully", Toast.LENGTH_SHORT).show();
    }

    @Override
    public List<Trip> getTrips() {
        return trips;
    }

    // InsightsFragment Interface
    @Override
    public List<Trip> getTripsForInsights() {
        return trips;
    }

    @Override
    public User getCurrentUser() {
        return currentUser;
    }

    // ProfileFragment Interface
    @Override
    public User getUser() {
        return currentUser;
    }

    @Override
    public void onUserUpdated(User user) {
        currentUser = user;
        preferenceHelper.saveUser(user);
        Toast.makeText(this, getString(R.string.success_profile_updated), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onSignOut() {
        // Clear user data
        preferenceHelper.clearUser();
        
        // Show success message
        Toast.makeText(this, "Signed out successfully", Toast.LENGTH_SHORT).show();
        
        // Navigate to login
        navigateToLogin();
    }

    @Override
    public void onLanguageChanged(LanguageManager.Language language) {
        languageManager.setLanguage(language);
        
        // Restart activity to apply language change
        Intent intent = getIntent();
        finish();
        startActivity(intent);
    }

    @Override
    public void onThemeChanged(ThemeManager.Theme theme) {
        themeManager.setTheme(theme);
        
        // Restart activity to apply theme change
        Intent intent = getIntent();
        finish();
        startActivity(intent);
    }

    @Override
    public void onDataExportRequested() {
        try {
            String exportData = preferenceHelper.exportUserData();
            
            // Create share intent
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_TEXT, exportData);
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Kerala Travel Tracker - My Data Export");
            
            startActivity(Intent.createChooser(shareIntent, "Export Data"));
            
            Toast.makeText(this, getString(R.string.success_data_exported), Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Toast.makeText(this, "Failed to export data", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onAccountDeletionRequested() {
        // TODO: Implement account deletion with confirmation dialog
        Toast.makeText(this, "Account deletion feature coming soon", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onResume() {
        super.onResume();
        
        // Refresh data
        loadUserData();
        
        // Apply current theme
        themeManager.applyTheme(this);
    }

    @Override
    public void onBackPressed() {
        // If not on home fragment, go to home
        if (!currentFragmentTag.equals("home")) {
            navigateToFragment("home");
        } else {
            super.onBackPressed();
        }
    }
}