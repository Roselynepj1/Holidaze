import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    // Redirect to login while saving the attempted url
    return <Navigate to='/login' state={{ from: location.pathname }} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
