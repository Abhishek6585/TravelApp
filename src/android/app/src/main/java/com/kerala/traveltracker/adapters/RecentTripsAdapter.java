package com.kerala.traveltracker.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;
import com.kerala.traveltracker.R;
import com.kerala.traveltracker.models.Trip;

import java.util.List;

/**
 * Adapter for displaying recent trips on the home screen
 */
public class RecentTripsAdapter extends RecyclerView.Adapter<RecentTripsAdapter.TripViewHolder> {
    
    public interface OnTripClickListener {
        void onTripClick(Trip trip);
    }
    
    private List<Trip> trips;
    private OnTripClickListener listener;
    
    public RecentTripsAdapter(List<Trip> trips, OnTripClickListener listener) {
        this.trips = trips;
        this.listener = listener;
    }
    
    @NonNull
    @Override
    public TripViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_recent_trip, parent, false);
        return new TripViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull TripViewHolder holder, int position) {
        Trip trip = trips.get(position);
        holder.bind(trip);
    }
    
    @Override
    public int getItemCount() {
        return trips != null ? trips.size() : 0;
    }
    
    class TripViewHolder extends RecyclerView.ViewHolder {
        private MaterialCardView cardView;
        private TextView modeTextView;
        private TextView routeTextView;
        private TextView dateTextView;
        private TextView distanceTextView;
        private TextView carbonTextView;
        private TextView statusTextView;
        
        public TripViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.trip_card_view);
            modeTextView = itemView.findViewById(R.id.mode_text_view);
            routeTextView = itemView.findViewById(R.id.route_text_view);
            dateTextView = itemView.findViewById(R.id.date_text_view);
            distanceTextView = itemView.findViewById(R.id.distance_text_view);
            carbonTextView = itemView.findViewById(R.id.carbon_text_view);
            statusTextView = itemView.findViewById(R.id.status_text_view);
        }
        
        public void bind(Trip trip) {
            // Set transport mode emoji
            modeTextView.setText(trip.getMode().getEmoji());
            
            // Set route
            routeTextView.setText(trip.getFormattedRoute());
            
            // Set date
            dateTextView.setText(trip.getDate());
            
            // Set distance
            distanceTextView.setText(trip.getDistance());
            
            // Set carbon footprint
            carbonTextView.setText(trip.getCarbonFootprint() + " CO₂");
            
            // Set status
            statusTextView.setText(trip.getStatusEmoji() + " " + trip.getStatusDisplayName());
            
            // Set status color
            int statusColor;
            switch (trip.getStatus()) {
                case COMPLETED:
                    statusColor = itemView.getContext().getColor(R.color.green_500);
                    break;
                case ONGOING:
                    statusColor = itemView.getContext().getColor(R.color.blue_500);
                    break;
                case PLANNED:
                    statusColor = itemView.getContext().getColor(R.color.orange_500);
                    break;
                default:
                    statusColor = itemView.getContext().getColor(R.color.gray_500);
                    break;
            }
            statusTextView.setTextColor(statusColor);
            
            // Set click listener
            cardView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onTripClick(trip);
                }
            });
        }
    }
}