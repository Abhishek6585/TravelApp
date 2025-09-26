package com.kerala.traveltracker.models;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * User model class representing a Kerala Travel Tracker user
 */
public class User implements Parcelable {
    private String name;
    private String email;
    private String avatar;
    private String city;
    private String phone;
    private boolean isAuthenticated;
    private long createdAt;
    private long lastLoginAt;

    public User() {
        this.createdAt = System.currentTimeMillis();
        this.lastLoginAt = System.currentTimeMillis();
        this.isAuthenticated = false;
    }

    // Constructor for Parcelable
    protected User(Parcel in) {
        name = in.readString();
        email = in.readString();
        avatar = in.readString();
        city = in.readString();
        phone = in.readString();
        isAuthenticated = in.readByte() != 0;
        createdAt = in.readLong();
        lastLoginAt = in.readLong();
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isAuthenticated() {
        return isAuthenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        isAuthenticated = authenticated;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public long getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(long lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    // Helper methods
    public String getFirstName() {
        if (name != null && name.contains(" ")) {
            return name.split(" ")[0];
        }
        return name;
    }

    public String getLastName() {
        if (name != null && name.contains(" ")) {
            String[] parts = name.split(" ");
            if (parts.length > 1) {
                return parts[parts.length - 1];
            }
        }
        return "";
    }

    public String getInitials() {
        if (name == null || name.isEmpty()) {
            return "KT";
        }
        
        String[] parts = name.split(" ");
        StringBuilder initials = new StringBuilder();
        
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(part.charAt(0));
            }
        }
        
        return initials.toString().toUpperCase();
    }

    // Parcelable implementation
    public static final Creator<User> CREATOR = new Creator<User>() {
        @Override
        public User createFromParcel(Parcel in) {
            return new User(in);
        }

        @Override
        public User[] newArray(int size) {
            return new User[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeString(email);
        dest.writeString(avatar);
        dest.writeString(city);
        dest.writeString(phone);
        dest.writeByte((byte) (isAuthenticated ? 1 : 0));
        dest.writeLong(createdAt);
        dest.writeLong(lastLoginAt);
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", city='" + city + '\'' +
                ", phone='" + phone + '\'' +
                ", isAuthenticated=" + isAuthenticated +
                '}';
    }
}