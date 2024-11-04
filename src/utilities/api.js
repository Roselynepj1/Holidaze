import { getItem, setItem } from './localStorage'

const appApiBaseUrl = import.meta.env.VITE_APP_API_URL
const authBaseUrl = import.meta.env.VITE_APP_AUTH_BASE_URL
const apiKey = import.meta.env.VITE_APP_API_KEY

let accessToken = getItem('accessToken') // Assuming you store your token in localStorage

const headers = () => ({
  Authorization: `Bearer ${getItem('accessToken')}`,
  'X-Noroff-API-Key': apiKey,
  'Content-Type': 'application/json',
})

// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw errorData.errors || [{ message: 'API request failed' }]
  }
  return response.json()
}

// Function to handle API calls
const apiCall = async (url, options) => {
  try {
    const response = await fetch(url, options)
    return await handleResponse(response)
  } catch (error) {
    return { error } // Return the error message
  }
}

export const login = async (email, password) => {
  const url = `${authBaseUrl}/login`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }

  const result = await apiCall(url, options)

  if (result?.data?.accessToken) {
    accessToken = result.data.accessToken // Update the access token
    setItem('accessToken', accessToken) // Store it in localStorage if needed
    setItem('user', result.data) //store user
    return result.data
  }

  return result
}

export const register = async (user) => {
  const url = `${authBaseUrl}/register` // Update this to your actual registration endpoint
  const options = {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      ...user,
    }),
  }

  const result = await apiCall(url, options)

  if (result.error) {
    console.error('Errors:', result.error)
    return { error: result.error }
  }

  return result // Return data or error
}

// Function to fetch user profile by name
export const getProfile = async (name) => {
  const url = `${appApiBaseUrl}/profiles/${name}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)   
  if (result.error) {
    console.error('Failed to fetch profile:', result.error)
    return { error: result.error }
  }

  return result // Return the profile data
}

// Function to fetch venues with pagination options
export const getVenues = async (limit = 12, sortOrder = 'desc') => {
  const url = `${appApiBaseUrl}/venues?limit=${limit}&sortOrder=${sortOrder}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to fetch venues:', result.error)
    return { error: result.error }
  }

  return result // Return the venues data
}
