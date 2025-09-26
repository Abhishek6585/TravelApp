import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase/client'
import { authAPI, userAPI } from '../utils/api'

interface User {
  id: string
  email: string
  name: string
  isAuthenticated: boolean
  preferences?: {
    language: string
    theme: string
    currency: string
  }
  location?: {
    state: string
    country: string
  }
  trip_count?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already signed in on app start
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        localStorage.setItem('kerala_travel_access_token', session.access_token)
        
        // Get user profile from backend
        try {
          const profileData = await userAPI.getProfile()
          setUser({
            id: profileData.user.id,
            email: profileData.user.email,
            name: profileData.user.name,
            isAuthenticated: true,
            preferences: profileData.user.preferences,
            location: profileData.user.location,
            trip_count: profileData.user.trip_count
          })
        } catch (error) {
          console.error('Failed to load user profile:', error)
          // Fallback to basic user info from session
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Kerala Traveler',
            isAuthenticated: true
          })
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error)
      localStorage.removeItem('kerala_travel_access_token')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Better error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before signing in.')
        } else {
          throw new Error(error.message)
        }
      }

      if (data.session?.access_token) {
        localStorage.setItem('kerala_travel_access_token', data.session.access_token)
        
        // Get user profile from backend
        try {
          const profileData = await userAPI.getProfile()
          setUser({
            id: profileData.user.id,
            email: profileData.user.email,
            name: profileData.user.name,
            isAuthenticated: true,
            preferences: profileData.user.preferences,
            location: profileData.user.location,
            trip_count: profileData.user.trip_count
          })
        } catch (error) {
          console.error('Failed to load user profile after sign in:', error)
          // Fallback to basic user info
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || 'Kerala Traveler',
            isAuthenticated: true
          })
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      
      // Register user with our backend (which uses Supabase)
      const result = await authAPI.signup(email, password, name)
      
      // Now sign them in
      await signIn(email, password)
      
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      await supabase.auth.signOut()
      localStorage.removeItem('kerala_travel_access_token')
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })

      if (error) {
        throw new Error(error.message)
      }
      
      // OAuth will redirect, so no need to set user here
    } catch (error) {
      console.error('Google sign in error:', error)
      setLoading(false)
      throw error
    }
  }

  const signInWithFacebook = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })

      if (error) {
        throw new Error(error.message)
      }
      
      // OAuth will redirect, so no need to set user here
    } catch (error) {
      console.error('Facebook sign in error:', error)
      setLoading(false)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const profileData = await userAPI.getProfile()
      setUser(prev => prev ? {
        ...prev,
        ...profileData.user
      } : null)
    } catch (error) {
      console.error('Failed to refresh user profile:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    resetPassword,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}