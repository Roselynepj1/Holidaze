// DarkModeContext.js
import { createContext, useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'

export const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize theme based on localStorage or system preferences
    if (localStorage.getItem('theme') === 'dark') {
      return true
    } else if (localStorage.getItem('theme') === 'light') {
      return false
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return true
    } else {
      return false
    }
  })

  useEffect(() => {
    // Apply or remove the dark mode class on the document based on darkMode state
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

DarkModeProvider.propTypes = {
  children: PropTypes.node,
}

export const useDarkMode = () => useContext(DarkModeContext)

