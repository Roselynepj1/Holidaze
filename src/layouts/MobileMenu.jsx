import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MobileMenu = ({ isOpen,handleOpenMobileMenu }) => {

    const { isLoggedIn } = useAuth()
    const closeMenu = ()=> handleOpenMobileMenu(false)
  return (
    <motion.div
      initial={{ y: '-50%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      exit={{ y: '50%', opacity: 0, transition: { duration: 0.2 } }}
      className='overflow-hidden bg-gray-100 dark:bg-slate-800 p-4 shadow-md absolute w-full pl-4 md:pl-[90px] z-10'  
    >
      {isOpen && (
        <ul className='flex flex-col md:flex-row  md:gap-8 h-full items-center dark:text-white'>
          <li className={'py-2 flex h-full items-center'}>
            <NavLink onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/'
            >
              Home
            </NavLink>
          </li>
          <li className={'py-2 flex h-full items-center'}>
            <NavLink onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/about'
            >
              About Us
            </NavLink>
          </li>
          <li className={'py-2 flex h-full items-center'}>
            <NavLink onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/venues'
            >
              Venues
            </NavLink>
          </li>
          <li className={'py-2 flex h-full items-center'}>
            <NavLink onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/contact'
            >
              Contact Us
            </NavLink>
          </li>
          <li className={'py-2 flex h-full items-center'}>
            <NavLink onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/faq'
            >
              FAQ
            </NavLink>
          </li>
          {!isLoggedIn && (<li className={'py-2 flex h-full items-center'}>
            <NavLink onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/login'
            >
              Login
            </NavLink>
          </li>)}
        </ul>
      )}
    </motion.div>
  )
}

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  handleOpenMobileMenu: PropTypes.func
}

export default MobileMenu
