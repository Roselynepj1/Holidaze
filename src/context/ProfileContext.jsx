import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile } from '../utilities/api'
import { useAuth } from './AuthContext'
import PropTypes from 'prop-types'

// Create the ProfileContext
const ProfileContext = createContext()

// Custom hook to access ProfileContext
export const useProfile = () => {
  return useContext(ProfileContext)
}

// ProfileProvider component to wrap your app
export const ProfileProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth() // Get auth state
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false) // Start as false initially
  const [error, setError] = useState(null)

  // Function to fetch and store profile data
  const fetchProfile = async () => {
    if (!isLoggedIn || !user) {
      setProfile(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const profileData = await getProfile(user.name)
      setProfile(profileData?.data)
    } catch (err) {
      setError(err.message || 'Failed to load profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch profile when auth state changes
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchProfile()
    } else {
      setProfile(null)
      setError(null)
    }
  }, [isLoggedIn, user]) // Depend on both isLoggedIn and user

  const value = {
    profile,
    loading,
    error,
    refetchProfile: fetchProfile,
  }

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
