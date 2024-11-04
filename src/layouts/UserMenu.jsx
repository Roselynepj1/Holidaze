import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'

const UserMenu = ({ openState, handleOpenUserMenu }) => {
  const { logout } = useAuth()
  const { profile, loading } = useProfile()

  return (
    <motion.aside
      id='rightBar'
      initial={{ x: '100%', opacity: 0 }} // Start off-screen to the right with 0 opacity
      animate={{ x: openState ? '0%' : '100%', opacity: openState ? 1 : 0 }} // Slide in if open, slide out if closed
      transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Customize animation behavior
      className={`absolute right-0 h-screen thin-scrollbar dark:text-white dark:bg-slate-950 ${
        !openState ? 'w-0' : 'w-full md:w-[350px]'
      } bg-white p-8 overflow-y-scroll`}
    >
      <div className='flex flex-col gap-4'>
        <Link to='/' className='flex gap-2 items-center'>
          <i className='fa-sharp fa-regular fa-user'></i>
          <span>My Profile</span>
        </Link>
        <Link to='/' className='flex gap-2 items-center'>
          <i className='fa-sharp fa-regular fa-bookmark'></i>
          <span>
            My Bookings{' '}
            {loading ? 'loading...' : `(${profile?._count?.bookings})`}
          </span>
        </Link>
        {profile?.venueManager && (
          <Link to='/' className='flex gap-2 items-center'>
            <i className='fa-sharp fa-regular fa-hotel'></i>
            <span>
              My Venues{' '}
              {loading ? 'loading...' : `(${profile?._count?.venues})`}
            </span>
          </Link>
        )}
        <Link to='/' className='flex gap-2 items-center'>
          <i className='fa-sharp fa-regular fa-key'></i>
          <span>Change Password</span>
        </Link>
        <Link
          to='/'
          className='flex gap-2 items-center'
          onClick={() => {
            logout()
            handleOpenUserMenu(false)
          }}
        >
          <i className='fa-sharp fa-regular fa-arrow-left-from-bracket'></i>
          <span>Logout</span>
        </Link>
        <hr />
      </div>
      <div className='flex flex-col gap-4 mt-8'>
        <div>Designed By: Roselyne P Johansen</div>
      </div>
    </motion.aside>
  )
}

UserMenu.propTypes = {
  openState: PropTypes.bool.isRequired,
  handleOpenUserMenu: PropTypes.func.isRequired,
}

export default UserMenu
