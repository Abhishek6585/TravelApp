import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Enable logging
app.use('*', logger(console.log))

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Routes must be prefixed with /make-server-561789f4
const API_PREFIX = '/make-server-561789f4'

// Health check endpoint
app.get(`${API_PREFIX}/health`, (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Kerala Travel Tracker API'
  })
})

// User Registration
app.post(`${API_PREFIX}/auth/signup`, async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        app: 'kerala-travel-tracker',
        created_at: new Date().toISOString()
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log(`Registration error for ${email}: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Store additional user profile data in KV store
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      name,
      preferences: {
        language: 'english',
        theme: 'light',
        currency: 'INR'
      },
      location: {
        state: 'Kerala',
        country: 'India'
      },
      created_at: new Date().toISOString(),
      trip_count: 0
    }

    await kv.set(`user_profile:${data.user.id}`, userProfile)

    return c.json({
      message: 'User registered successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        created_at: data.user.created_at
      }
    })

  } catch (error) {
    console.log(`Signup error: ${error}`)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// Password Reset
app.post(`${API_PREFIX}/auth/reset-password`, async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.header('origin')}/reset-password`
    })

    if (error) {
      console.log(`Password reset error for ${email}: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    return c.json({
      message: 'Password reset email sent successfully'
    })

  } catch (error) {
    console.log(`Password reset error: ${error}`)
    return c.json({ error: 'Password reset failed' }, 500)
  }
})

// Get User Profile
app.get(`${API_PREFIX}/user/profile`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user_profile:${user.id}`)
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    return c.json({
      user: userProfile
    })

  } catch (error) {
    console.log(`Get profile error: ${error}`)
    return c.json({ error: 'Failed to get user profile' }, 500)
  }
})

// Update User Profile
app.put(`${API_PREFIX}/user/profile`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    const updates = await c.req.json()
    
    // Get existing profile
    const existingProfile = await kv.get(`user_profile:${user.id}`)
    
    if (!existingProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    // Update profile
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updated_at: new Date().toISOString()
    }

    await kv.set(`user_profile:${user.id}`, updatedProfile)

    return c.json({
      message: 'Profile updated successfully',
      user: updatedProfile
    })

  } catch (error) {
    console.log(`Update profile error: ${error}`)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

// Save Trip Data
app.post(`${API_PREFIX}/trips`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    const tripData = await c.req.json()
    
    // Create trip with unique ID
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const trip = {
      id: tripId,
      user_id: user.id,
      ...tripData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save trip data
    await kv.set(`trip:${tripId}`, trip)
    
    // Update user's trip list
    const userTrips = await kv.get(`user_trips:${user.id}`) || []
    userTrips.push(tripId)
    await kv.set(`user_trips:${user.id}`, userTrips)

    // Update user profile trip count
    const userProfile = await kv.get(`user_profile:${user.id}`)
    if (userProfile) {
      userProfile.trip_count = userTrips.length
      userProfile.updated_at = new Date().toISOString()
      await kv.set(`user_profile:${user.id}`, userProfile)
    }

    return c.json({
      message: 'Trip saved successfully',
      trip
    })

  } catch (error) {
    console.log(`Save trip error: ${error}`)
    return c.json({ error: 'Failed to save trip' }, 500)
  }
})

// Get User Trips
app.get(`${API_PREFIX}/trips`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Get user's trip IDs
    const tripIds = await kv.get(`user_trips:${user.id}`) || []
    
    // Get all trip data
    const trips = []
    for (const tripId of tripIds) {
      const trip = await kv.get(`trip:${tripId}`)
      if (trip) {
        trips.push(trip)
      }
    }

    // Sort trips by created date (newest first)
    trips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return c.json({
      trips,
      total: trips.length
    })

  } catch (error) {
    console.log(`Get trips error: ${error}`)
    return c.json({ error: 'Failed to get trips' }, 500)
  }
})

// Delete Trip
app.delete(`${API_PREFIX}/trips/:tripId`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const tripId = c.req.param('tripId')
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Check if trip exists and belongs to user
    const trip = await kv.get(`trip:${tripId}`)
    
    if (!trip || trip.user_id !== user.id) {
      return c.json({ error: 'Trip not found or access denied' }, 404)
    }

    // Delete trip
    await kv.del(`trip:${tripId}`)
    
    // Update user's trip list
    const userTrips = await kv.get(`user_trips:${user.id}`) || []
    const updatedTripIds = userTrips.filter(id => id !== tripId)
    await kv.set(`user_trips:${user.id}`, updatedTripIds)

    // Update user profile trip count
    const userProfile = await kv.get(`user_profile:${user.id}`)
    if (userProfile) {
      userProfile.trip_count = updatedTripIds.length
      userProfile.updated_at = new Date().toISOString()
      await kv.set(`user_profile:${user.id}`, userProfile)
    }

    return c.json({
      message: 'Trip deleted successfully'
    })

  } catch (error) {
    console.log(`Delete trip error: ${error}`)
    return c.json({ error: 'Failed to delete trip' }, 500)
  }
})

// Error handler
app.onError((err, c) => {
  console.log(`Server error: ${err}`)
  return c.json({ error: 'Internal server error' }, 500)
})

// Start the server
Deno.serve(app.fetch)