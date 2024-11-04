import { createContext, useContext, useState, useEffect } from 'react'
import { getItem, setItem } from '../utilities/localStorage' 
import { login } from '../utilities/api'  
import PropTypes from 'prop-types'
// Create the Auth context
const AuthContext = createContext()

// Provide access to the context value using a hook
export const useAuth = () => {
  return useContext(AuthContext)
}

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getItem('user') || null)
  const [accessToken, setAccessToken] = useState(
    () => getItem('accessToken') || null
  )
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken)

  // Login function
  const handleLogin = async (email, password) => {
    const result = await login(email, password) 
    if (result.error) {
        throw (result.error || 'Login failed') 
    }  
    setIsLoggedIn(true)
  }

  // Logout function
  const handleLogout = () => {
    setUser(null)
    setAccessToken(null)
    setIsLoggedIn(false)

    // Remove from localStorage
    setItem('accessToken', null)
    setItem('user', null)
  }

  // Effect to keep login state based on access token
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [accessToken])

  const value = {
    user,
    isLoggedIn,
    login: handleLogin,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
