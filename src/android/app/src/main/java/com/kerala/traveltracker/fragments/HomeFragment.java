package com.kerala.traveltracker.fragments;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.kerala.traveltracker.R;
import com.kerala.traveltracker.adapters.RecentTripsAdapter;
import com.kerala.traveltracker.adapters.PopularRoutesAdapter;
import com.kerala.traveltracker.models.Trip;
import com.kerala.traveltracker.models.User;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;
import com.kerala.traveltracker.utils.PreferenceManager.PreferenceHelper;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Home fragment - Main dashboard for Kerala Travel Tracker
 */
public class HomeFragment extends Fragment {
    
    public interface OnHomeInteractionListener {
        void onAddTripClicked();
        void onViewAllTripsClicked();
        void onRouteClicked(String origin, String destination);
    }
    
    private OnHomeInteractionListener listener;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    private PreferenceHelper preferenceHelper;
    
    // UI Components
    private TextView greetingTextView;
    private TextView userNameTextView;
    private TextView currentLocationTextView;
    private TextView weatherTextView;
    private MaterialCardView weatherCard;
    private TextView recentTripsHeaderTextView;
    private RecyclerView recentTripsRecyclerView;
    private TextView viewAllTripsTextView;
    private TextView popularRoutesHeaderTextView;
    private RecyclerView popularRoutesRecyclerView;
    private FloatingActionButton addTripFab;
    private LinearLayout emptyStateLayout;
    private TextView emptyStateTextView;
    
    // Data
    private User currentUser;
    private List<Trip> recentTrips;
    private RecentTripsAdapter recentTripsAdapter;
    private PopularRoutesAdapter popularRoutesAdapter;
    
    public HomeFragment() {
        // Required empty public constructor
    }
    
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnHomeInteractionListener) {
            listener = (OnHomeInteractionListener) context;
        }
        
        languageManager = new LanguageManager(context);
        themeManager = new ThemeManager(context);
        preferenceHelper = new PreferenceHelper(context);
    }
    
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        loadData();
        setupRecyclerViews();
        setupClickListeners();
        updateUI();
    }
    
    private void initializeViews(View view) {
        greetingTextView = view.findViewById(R.id.greeting_text_view);
        userNameTextView = view.findViewById(R.id.user_name_text_view);
        currentLocationTextView = view.findViewById(R.id.current_location_text_view);
        weatherTextView = view.findViewById(R.id.weather_text_view);
        weatherCard = view.findViewById(R.id.weather_card);
        recentTripsHeaderTextView = view.findViewById(R.id.recent_trips_header_text_view);
        recentTripsRecyclerView = view.findViewById(R.id.recent_trips_recycler_view);
        viewAllTripsTextView = view.findViewById(R.id.view_all_trips_text_view);
        popularRoutesHeaderTextView = view.findViewById(R.id.popular_routes_header_text_view);
        popularRoutesRecyclerView = view.findViewById(R.id.popular_routes_recycler_view);
        addTripFab = view.findViewById(R.id.add_trip_fab);
        emptyStateLayout = view.findViewById(R.id.empty_state_layout);
        emptyStateTextView = view.findViewById(R.id.empty_state_text_view);
    }
    
    private void loadData() {
        currentUser = preferenceHelper.getUser();
        List<Trip> allTrips = preferenceHelper.getTrips();
        
        // Get recent trips (last 3)
        recentTrips = new ArrayList<>();
        int count = Math.min(3, allTrips.size());
        for (int i = allTrips.size() - count; i < allTrips.size(); i++) {
            recentTrips.add(allTrips.get(i));
        }
    }
    
    private void setupRecyclerViews() {
        // Recent trips
        recentTripsAdapter = new RecentTripsAdapter(recentTrips, trip -> {
            // Handle trip click
        });
        recentTripsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recentTripsRecyclerView.setAdapter(recentTripsAdapter);
        
        // Popular routes
        List<PopularRoute> popularRoutes = getPopularRoutes();
        popularRoutesAdapter = new PopularRoutesAdapter(popularRoutes, route -> {
            if (listener != null) {
                listener.onRouteClicked(route.getOrigin(), route.getDestination());
            }
        });
        popularRoutesRecyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        popularRoutesRecyclerView.setAdapter(popularRoutesAdapter);
    }
    
    private void setupClickListeners() {
        addTripFab.setOnClickListener(v -> {
            if (listener != null) {
                listener.onAddTripClicked();
            }
        });
        
        viewAllTripsTextView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onViewAllTripsClicked();
            }
        });
        
        weatherCard.setOnClickListener(v -> {
            // Handle weather card click - maybe show detailed weather
        });
    }
    
    private void updateUI() {
        // Set greeting based on time and language
        String greeting = getTimeBasedGreeting();
        greetingTextView.setText(greeting);
        
        // Set user name
        if (currentUser != null) {
            String name = currentUser.getFirstName();
            if (name == null || name.isEmpty()) {
                name = "Kerala Traveler";
            }
            userNameTextView.setText(getString(R.string.welcome_back) + ", " + name + "!");
        }
        
        // Set current location
        currentLocationTextView.setText("📍 " + (currentUser != null ? currentUser.getCity() : "Kochi") + ", Kerala");
        
        // Set weather
        updateWeatherUI();
        
        // Set headers
        recentTripsHeaderTextView.setText(R.string.recent_trips);
        popularRoutesHeaderTextView.setText(R.string.popular_routes);
        viewAllTripsTextView.setText(R.string.view_all_trips);
        
        // Show/hide empty state
        if (recentTrips == null || recentTrips.isEmpty()) {
            emptyStateLayout.setVisibility(View.VISIBLE);
            recentTripsRecyclerView.setVisibility(View.GONE);
            emptyStateTextView.setText(R.string.no_trips_yet);
        } else {
            emptyStateLayout.setVisibility(View.GONE);
            recentTripsRecyclerView.setVisibility(View.VISIBLE);
        }
        
        // Apply theme colors
        applyThemeColors();
    }
    
    private String getTimeBasedGreeting() {
        int hour = new Date().getHours();
        String baseGreeting;
        
        if (hour < 12) {
            baseGreeting = "Good Morning";
        } else if (hour < 17) {
            baseGreeting = "Good Afternoon";
        } else {
            baseGreeting = "Good Evening";
        }
        
        // Add language-specific greeting
        LanguageManager.Language currentLanguage = languageManager.getCurrentLanguage();
        switch (currentLanguage) {
            case MALAYALAM:
                if (hour < 12) return "സുപ്രഭാതം";
                else if (hour < 17) return "ശുഭ ഉച്ചയ്ക്ക്";
                else return "സുഭ സായാഹ്നം";
            case HINDI:
                if (hour < 12) return "सुप्रभात";
                else if (hour < 17) return "नमस्ते";
                else return "शुभ संध्या";
            case TAMIL:
                if (hour < 12) return "காலை வணக்கம்";
                else if (hour < 17) return "மதிய வணக்கம்";
                else return "மாலை வணக்கம்";
            default:
                return baseGreeting;
        }
    }
    
    private void updateWeatherUI() {
        // Simple weather display (in a real app, this would fetch from weather API)
        String temperature = "28°C";
        String condition = "Partly Cloudy";
        String emoji = "⛅";
        
        String weatherText = emoji + " " + temperature + " • " + condition;
        weatherTextView.setText(weatherText);
    }
    
    private void applyThemeColors() {
        if (themeManager.isDarkMode()) {
            greetingTextView.setTextColor(getResources().getColor(R.color.white));
            userNameTextView.setTextColor(getResources().getColor(R.color.gray_200));
            currentLocationTextView.setTextColor(getResources().getColor(R.color.gray_300));
        } else {
            greetingTextView.setTextColor(getResources().getColor(R.color.kerala_dark));
            userNameTextView.setTextColor(getResources().getColor(R.color.kerala_green));
            currentLocationTextView.setTextColor(getResources().getColor(R.color.gray_600));
        }
    }
    
    private List<PopularRoute> getPopularRoutes() {
        List<PopularRoute> routes = new ArrayList<>();
        routes.add(new PopularRoute("Kochi", "Alappuzha", "🚤", "Backwater Cruise"));
        routes.add(new PopularRoute("Munnar", "Thekkady", "🚌", "Hill Station Tour"));
        routes.add(new PopularRoute("Trivandrum", "Kovalam", "🛺", "Beach Getaway"));
        routes.add(new PopularRoute("Kozhikode", "Wayanad", "🚗", "Nature Escape"));
        return routes;
    }
    
    @Override
    public void onResume() {
        super.onResume();
        loadData();
        updateUI();
        if (recentTripsAdapter != null) {
            recentTripsAdapter.notifyDataSetChanged();
        }
    }
    
    @Override
    public void onDetach() {
        super.onDetach();
        listener = null;
    }
    
    // Helper class for popular routes
    public static class PopularRoute {
        private String origin;
        private String destination;
        private String icon;
        private String description;
        
        public PopularRoute(String origin, String destination, String icon, String description) {
            this.origin = origin;
            this.destination = destination;
            this.icon = icon;
            this.description = description;
        }
        
        // Getters
        public String getOrigin() { return origin; }
        public String getDestination() { return destination; }
        public String getIcon() { return icon; }
        public String getDescription() { return description; }
    }
}