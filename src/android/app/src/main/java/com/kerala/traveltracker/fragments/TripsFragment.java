package com.kerala.traveltracker.fragments;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.tabs.TabLayout;
import com.kerala.traveltracker.R;
import com.kerala.traveltracker.adapters.TripsAdapter;
import com.kerala.traveltracker.dialogs.AddTripDialog;
import com.kerala.traveltracker.models.Trip;
import com.kerala.traveltracker.utils.LanguageManager;
import com.kerala.traveltracker.utils.ThemeManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Trips fragment - Manage and view all trips
 */
public class TripsFragment extends Fragment implements AddTripDialog.OnTripAddedListener {
    
    public interface OnTripsInteractionListener {
        void onTripAdded(Trip trip);
        void onTripUpdated(Trip trip);
        void onTripDeleted(int tripId);
        List<Trip> getTrips();
    }
    
    private OnTripsInteractionListener listener;
    private LanguageManager languageManager;
    private ThemeManager themeManager;
    
    // UI Components
    private TabLayout tabLayout;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RecyclerView tripsRecyclerView;
    private FloatingActionButton addTripFab;
    private TextView emptyStateTextView;
    private View emptyStateLayout;
    
    // Data
    private List<Trip> allTrips = new ArrayList<>();
    private List<Trip> filteredTrips = new ArrayList<>();
    private TripsAdapter tripsAdapter;
    private String currentFilter = "all"; // all, completed, ongoing, planned
    
    public TripsFragment() {
        // Required empty public constructor
    }
    
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnTripsInteractionListener) {
            listener = (OnTripsInteractionListener) context;
        }
        
        languageManager = new LanguageManager(context);
        themeManager = new ThemeManager(context);
    }
    
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_trips, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupTabLayout();
        setupRecyclerView();
        setupClickListeners();
        loadTrips();
        updateUI();
    }
    
    private void initializeViews(View view) {
        tabLayout = view.findViewById(R.id.tab_layout);
        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh_layout);
        tripsRecyclerView = view.findViewById(R.id.trips_recycler_view);
        addTripFab = view.findViewById(R.id.add_trip_fab);
        emptyStateLayout = view.findViewById(R.id.empty_state_layout);
        emptyStateTextView = view.findViewById(R.id.empty_state_text_view);
    }
    
    private void setupTabLayout() {
        tabLayout.addTab(tabLayout.newTab().setText("All"));
        tabLayout.addTab(tabLayout.newTab().setText("Completed"));
        tabLayout.addTab(tabLayout.newTab().setText("Ongoing"));
        tabLayout.addTab(tabLayout.newTab().setText("Planned"));
        
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        currentFilter = "all";
                        break;
                    case 1:
                        currentFilter = "completed";
                        break;
                    case 2:
                        currentFilter = "ongoing";
                        break;
                    case 3:
                        currentFilter = "planned";
                        break;
                }
                filterTrips();
            }
            
            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}
            
            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }
    
    private void setupRecyclerView() {
        tripsAdapter = new TripsAdapter(filteredTrips, new TripsAdapter.OnTripActionListener() {
            @Override
            public void onTripClick(Trip trip) {
                // Handle trip click - maybe show details
            }
            
            @Override
            public void onEditTrip(Trip trip) {
                showEditTripDialog(trip);
            }
            
            @Override
            public void onDeleteTrip(Trip trip) {
                showDeleteConfirmationDialog(trip);
            }
        });
        
        tripsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        tripsRecyclerView.setAdapter(tripsAdapter);
    }
    
    private void setupClickListeners() {
        addTripFab.setOnClickListener(v -> showAddTripDialog());
        
        swipeRefreshLayout.setOnRefreshListener(() -> {
            loadTrips();
            swipeRefreshLayout.setRefreshing(false);
        });
    }
    
    private void loadTrips() {
        if (listener != null) {
            allTrips = listener.getTrips();
            filterTrips();
        }
    }
    
    private void filterTrips() {
        filteredTrips.clear();
        
        for (Trip trip : allTrips) {
            switch (currentFilter) {
                case "all":
                    filteredTrips.add(trip);
                    break;
                case "completed":
                    if (trip.getStatus() == Trip.TripStatus.COMPLETED) {
                        filteredTrips.add(trip);
                    }
                    break;
                case "ongoing":
                    if (trip.getStatus() == Trip.TripStatus.ONGOING) {
                        filteredTrips.add(trip);
                    }
                    break;
                case "planned":
                    if (trip.getStatus() == Trip.TripStatus.PLANNED) {
                        filteredTrips.add(trip);
                    }
                    break;
            }
        }
        
        // Sort by date (newest first)
        Collections.sort(filteredTrips, (t1, t2) -> t2.getDate().compareTo(t1.getDate()));
        
        updateEmptyState();
        if (tripsAdapter != null) {
            tripsAdapter.notifyDataSetChanged();
        }
    }
    
    private void updateEmptyState() {
        if (filteredTrips.isEmpty()) {
            emptyStateLayout.setVisibility(View.VISIBLE);
            tripsRecyclerView.setVisibility(View.GONE);
            
            String emptyMessage;
            switch (currentFilter) {
                case "completed":
                    emptyMessage = "No completed trips yet";
                    break;
                case "ongoing":
                    emptyMessage = "No ongoing trips";
                    break;
                case "planned":
                    emptyMessage = "No planned trips";
                    break;
                default:
                    emptyMessage = getString(R.string.no_trips_yet);
                    break;
            }
            emptyStateTextView.setText(emptyMessage);
        } else {
            emptyStateLayout.setVisibility(View.GONE);
            tripsRecyclerView.setVisibility(View.VISIBLE);
        }
    }
    
    private void showAddTripDialog() {
        AddTripDialog dialog = new AddTripDialog();
        dialog.setOnTripAddedListener(this);
        dialog.show(getParentFragmentManager(), "AddTripDialog");
    }
    
    private void showEditTripDialog(Trip trip) {
        AddTripDialog dialog = AddTripDialog.newInstanceForEdit(trip);
        dialog.setOnTripAddedListener(new AddTripDialog.OnTripAddedListener() {
            @Override
            public void onTripAdded(Trip newTrip) {
                // This is actually an edit
                if (listener != null) {
                    listener.onTripUpdated(newTrip);
                }
                loadTrips();
            }
        });
        dialog.show(getParentFragmentManager(), "EditTripDialog");
    }
    
    private void showDeleteConfirmationDialog(Trip trip) {
        new AlertDialog.Builder(getContext())
                .setTitle("Delete Trip")
                .setMessage("Are you sure you want to delete this trip from " + 
                           trip.getOrigin() + " to " + trip.getDestination() + "?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    if (listener != null) {
                        listener.onTripDeleted(trip.getId());
                    }
                    loadTrips();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
    
    private void updateUI() {
        // Apply theme colors
        if (themeManager.isDarkMode()) {
            // Apply dark theme
        } else {
            // Apply light theme
        }
    }
    
    @Override
    public void onTripAdded(Trip trip) {
        if (listener != null) {
            listener.onTripAdded(trip);
        }
        loadTrips();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        loadTrips();
        updateUI();
    }
    
    @Override
    public void onDetach() {
        super.onDetach();
        listener = null;
    }
}