package com.kerala.traveltracker.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;
import com.kerala.traveltracker.R;
import com.kerala.traveltracker.fragments.HomeFragment.PopularRoute;

import java.util.List;

/**
 * Adapter for displaying popular routes on the home screen
 */
public class PopularRoutesAdapter extends RecyclerView.Adapter<PopularRoutesAdapter.RouteViewHolder> {
    
    public interface OnRouteClickListener {
        void onRouteClick(PopularRoute route);
    }
    
    private List<PopularRoute> routes;
    private OnRouteClickListener listener;
    
    public PopularRoutesAdapter(List<PopularRoute> routes, OnRouteClickListener listener) {
        this.routes = routes;
        this.listener = listener;
    }
    
    @NonNull
    @Override
    public RouteViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_popular_route, parent, false);
        return new RouteViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull RouteViewHolder holder, int position) {
        PopularRoute route = routes.get(position);
        holder.bind(route);
    }
    
    @Override
    public int getItemCount() {
        return routes != null ? routes.size() : 0;
    }
    
    class RouteViewHolder extends RecyclerView.ViewHolder {
        private MaterialCardView cardView;
        private TextView iconTextView;
        private TextView routeTextView;
        private TextView descriptionTextView;
        
        public RouteViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.route_card_view);
            iconTextView = itemView.findViewById(R.id.icon_text_view);
            routeTextView = itemView.findViewById(R.id.route_text_view);
            descriptionTextView = itemView.findViewById(R.id.description_text_view);
        }
        
        public void bind(PopularRoute route) {
            iconTextView.setText(route.getIcon());
            routeTextView.setText(route.getOrigin() + " → " + route.getDestination());
            descriptionTextView.setText(route.getDescription());
            
            // Set click listener
            cardView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onRouteClick(route);
                }
            });
        }
    }
}