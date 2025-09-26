import { projectId, publicAnonKey } from './supabase/info'

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-561789f4`

// API utility function
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  }

  // If there's an access token in localStorage, use it instead
  const accessToken = localStorage.getItem('kerala_travel_access_token')
  if (accessToken && endpoint !== '/auth/signup') {
    defaultHeaders.Authorization = `Bearer ${accessToken}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      console.error(`API Error [${endpoint}]:`, data)
      throw new Error(data.error || 'API request failed')
    }

    return data
  } catch (error) {
    console.error(`API Call Failed [${endpoint}]:`, error)
    throw error
  }
}



// Auth API functions
export const authAPI = {
  // Sign up new user
  async signup(email: string, password: string, name: string) {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    })
  },

  // Reset password
  async resetPassword(email: string) {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }
}

// User API functions
export const userAPI = {
  // Get user profile
  async getProfile() {
    return apiCall('/user/profile')
  },

  // Update user profile
  async updateProfile(updates: any) {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  }
}

// Trip API functions
export const tripAPI = {
  // Get all user trips
  async getTrips() {
    return apiCall('/trips')
  },

  // Save new trip
  async saveTrip(tripData: any) {
    return apiCall('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    })
  },

  // Delete trip
  async deleteTrip(tripId: string) {
    return apiCall(`/trips/${tripId}`, {
      method: 'DELETE'
    })
  }
}