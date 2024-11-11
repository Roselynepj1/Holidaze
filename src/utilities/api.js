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
      'Content-Type': 'application/json',
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
export const getVenues = async (page = 1, limit = 12, sortOrder = 'desc') => {
  const url = `${appApiBaseUrl}/venues?limit=${limit}&sortOrder=${sortOrder}&page=${page}`
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

export const searchVenues = async (
  query,
  page = 1,
  limit = 12,
  sortOrder = 'desc'
) => {
  const url = `${appApiBaseUrl}/venues/search?limit=${limit}&sortOrder=${sortOrder}&page=${page}&q=${encodeURIComponent(
    query
  )}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to search venues:', result.error)
    return { error: result.error }
  }

  return result // Return the searched venue data
}

// Function to fetch a single venue by id
export const getVenueById = async (id, _bookings = true) => {
  const url = `${appApiBaseUrl}/venues/${id}?_bookings=${_bookings}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to fetch venue by id:', result.error)
    return { error: result.error }
  }

  return result // Return the venue data
}

export const createBooking = async (booking) => {
  const url = `${appApiBaseUrl}/bookings`
  const options = {
    method: 'POST',
    headers: headers(), // Use headers function to include authorization and other headers
    body: JSON.stringify(booking),
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to create a venue booking:', result.error)
    return { error: result.error }
  }

  return result // Return the venue data
}

export const getBookingById = async (id) => {
  const url = `${appApiBaseUrl}/bookings/${id}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to fetch venue by id:', result.error)
    return { error: result.error }
  }

  return result // Return the venue data
}

export const getUserBookings = async (username, _venue = true) => {
  const url = `${appApiBaseUrl}/profiles/${username}/bookings?&_venue=${_venue}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to fetch user bookings:', result.error)
    return { error: result.error }
  }

  return result // Return the bookings data
}

export const updateBooking = async (id, data) => {
  const url = `${appApiBaseUrl}/bookings/${id}`
  const options = {
    method: 'PUT',
    headers: headers(), // Use headers function to include authorization and other headers
    body: JSON.stringify(data),
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to update booking:', result.error)
    return { error: result.error }
  }

  return result // Return the updated booking data
}

export const deleteBooking = async (id) => {
  const url = `${appApiBaseUrl}/bookings/${id}`
  const options = {
    method: 'DELETE',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  await apiCall(url, options)

  return true // Return the delete response
}

export const updateProfile = async (username, data) => {
  const url = `${appApiBaseUrl}/profiles/${username}`
  const options = {
    method: 'PUT',
    headers: headers(), // Use headers function to include authorization and other headers
    body: JSON.stringify(data),
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to update profile:', result.error)
    return { error: result.error }
  }

  return result // Return the updated profile data
}

export const getUserVenues = async (username, _venue = true) => {
  const url = `${appApiBaseUrl}/profiles/${username}/venues?&_venue=${_venue}`
  const options = {
    method: 'GET',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to fetch user bookings:', result.error)
    return { error: result.error }
  }

  return result // Return the bookings data
}

export const createVenue = async (data) => {
  const url = `${appApiBaseUrl}/venues`
  const options = {
    method: 'POST',
    headers: headers(), // Use headers function to include authorization and other headers
    body: JSON.stringify(data),
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to create venue:', result.error)
    return { error: result.error }
  }

  return result // Return the updated booking data
}

export const updateVenue = async (id, data) => {
  const url = `${appApiBaseUrl}/venues/${id}`
  const options = {
    method: 'PUT',
    headers: headers(), // Use headers function to include authorization and other headers
    body: JSON.stringify(data),
  }

  const result = await apiCall(url, options)
  if (result.error) {
    console.error('Failed to update booking:', result.error)
    return { error: result.error }
  }

  return result // Return the updated booking data
}

export const deleteVenue = async (id) => {
  const url = `${appApiBaseUrl}/venues/${id}`
  const options = {
    method: 'DELETE',
    headers: headers(), // Use headers function to include authorization and other headers
  }

  await apiCall(url, options)
  return true
}
