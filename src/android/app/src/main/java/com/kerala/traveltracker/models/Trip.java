package com.kerala.traveltracker.models;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Trip model class representing a travel trip in Kerala
 */
public class Trip implements Parcelable {
    
    public enum TripStatus {
        COMPLETED, ONGOING, PLANNED
    }
    
    public enum TransportMode {
        BOAT("boat", "🚤", "Boat"),
        AUTO("auto", "🛺", "Auto-rickshaw"),
        BUS("bus", "🚌", "Bus"),
        TRAIN("train", "🚂", "Train"),
        CAR("car", "🚗", "Car"),
        BIKE("bike", "🏍️", "Bike"),
        WALK("walk", "🚶", "Walk");
        
        private final String id;
        private final String emoji;
        private final String displayName;
        
        TransportMode(String id, String emoji, String displayName) {
            this.id = id;
            this.emoji = emoji;
            this.displayName = displayName;
        }
        
        public String getId() { return id; }
        public String getEmoji() { return emoji; }
        public String getDisplayName() { return displayName; }
        
        public static TransportMode fromId(String id) {
            for (TransportMode mode : values()) {
                if (mode.getId().equals(id)) {
                    return mode;
                }
            }
            return CAR; // default
        }
    }

    private int id;
    private String origin;
    private String destination;
    private String date;
    private TransportMode mode;
    private String distance;
    private String carbonFootprint;
    private TripStatus status;
    private long createdAt;
    private double originLat;
    private double originLng;
    private double destinationLat;
    private double destinationLng;
    private String notes;
    private int duration; // in minutes

    public Trip() {
        this.createdAt = System.currentTimeMillis();
        this.status = TripStatus.PLANNED;
        this.mode = TransportMode.CAR;
    }

    // Constructor for Parcelable
    protected Trip(Parcel in) {
        id = in.readInt();
        origin = in.readString();
        destination = in.readString();
        date = in.readString();
        mode = TransportMode.valueOf(in.readString());
        distance = in.readString();
        carbonFootprint = in.readString();
        status = TripStatus.valueOf(in.readString());
        createdAt = in.readLong();
        originLat = in.readDouble();
        originLng = in.readDouble();
        destinationLat = in.readDouble();
        destinationLng = in.readDouble();
        notes = in.readString();
        duration = in.readInt();
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public TransportMode getMode() {
        return mode;
    }

    public void setMode(TransportMode mode) {
        this.mode = mode;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getCarbonFootprint() {
        return carbonFootprint;
    }

    public void setCarbonFootprint(String carbonFootprint) {
        this.carbonFootprint = carbonFootprint;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public double getOriginLat() {
        return originLat;
    }

    public void setOriginLat(double originLat) {
        this.originLat = originLat;
    }

    public double getOriginLng() {
        return originLng;
    }

    public void setOriginLng(double originLng) {
        this.originLng = originLng;
    }

    public double getDestinationLat() {
        return destinationLat;
    }

    public void setDestinationLat(double destinationLat) {
        this.destinationLat = destinationLat;
    }

    public double getDestinationLng() {
        return destinationLng;
    }

    public void setDestinationLng(double destinationLng) {
        this.destinationLng = destinationLng;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    // Helper methods
    public String getFormattedRoute() {
        return origin + " → " + destination;
    }

    public String getStatusEmoji() {
        switch (status) {
            case COMPLETED: return "✅";
            case ONGOING: return "🚀";
            case PLANNED: return "📅";
            default: return "❓";
        }
    }

    public String getStatusDisplayName() {
        switch (status) {
            case COMPLETED: return "Completed";
            case ONGOING: return "Ongoing";
            case PLANNED: return "Planned";
            default: return "Unknown";
        }
    }

    public double getCarbonFootprintValue() {
        try {
            return Double.parseDouble(carbonFootprint.replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public double getDistanceValue() {
        try {
            return Double.parseDouble(distance.replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    // Parcelable implementation
    public static final Creator<Trip> CREATOR = new Creator<Trip>() {
        @Override
        public Trip createFromParcel(Parcel in) {
            return new Trip(in);
        }

        @Override
        public Trip[] newArray(int size) {
            return new Trip[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(id);
        dest.writeString(origin);
        dest.writeString(destination);
        dest.writeString(date);
        dest.writeString(mode.name());
        dest.writeString(distance);
        dest.writeString(carbonFootprint);
        dest.writeString(status.name());
        dest.writeLong(createdAt);
        dest.writeDouble(originLat);
        dest.writeDouble(originLng);
        dest.writeDouble(destinationLat);
        dest.writeDouble(destinationLng);
        dest.writeString(notes);
        dest.writeInt(duration);
    }

    @Override
    public String toString() {
        return "Trip{" +
                "id=" + id +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", date='" + date + '\'' +
                ", mode=" + mode +
                ", distance='" + distance + '\'' +
                ", carbonFootprint='" + carbonFootprint + '\'' +
                ", status=" + status +
                '}';
    }
}