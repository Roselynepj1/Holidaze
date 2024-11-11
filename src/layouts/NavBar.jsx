import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDarkMode } from '../context/DarkModeContext'
import { useProfile } from '../context/ProfileContext'

const NavBar = ({
  openState,
  isMobileMenuOpen,
  handleChangeOpenState,
  handleChangeOpenSearch,
  handleOpenMobileMenu,
  handleOpenUserMenu,
}) => {
  const { isLoggedIn } = useAuth()
  const { profile } = useProfile()
  const { toggleDarkMode } = useDarkMode()

  // Handler to toggle dark mode state

  return (
    <div
      className='flex h-[80px] shadow-sm bg-white dark:bg-slate-950 relative z-50 dark:text-white'
      id='navbar'
    >
      <div
        className='w-[80px] h-full flex items-center justify-center bg-black text-white'
        id='logo'
      >
        <Link to='/' className='text-3xl font-black'>
          H
        </Link>
      </div>
      <div
        id='logoName'
        className='h-full flex items-center flex-1 lg:flex-none px-8 font-black py-10 '
      >
        <Link to='/' className='dark:text-white'>
          Holidaze
        </Link>
      </div>
      <div
        id='appLinks'
        className='h-full hidden lg:flex items-center flex-1 justify-center'
      >
        <ul className='flex gap-8 h-full items-center'>
          <li className={'py-10 flex h-full items-center'}>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/'
            >
              Home
            </NavLink>
          </li>
          <li className={'py-10 flex h-full items-center'}>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/about'
            >
              About Us
            </NavLink>
          </li>
          <li className={'py-10 flex h-full items-center'}>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/venues'
            >
              Venues
            </NavLink>
          </li>
          <li className={'py-10 flex h-full items-center'}>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/contact'
            >
              Contact Us
            </NavLink>
          </li>
          <li className={'py-10 flex h-full items-center'}>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active-link' : 'inactive-link'
              }
              to='/faq'
            >
              FAQ
            </NavLink>
          </li>
        </ul>
      </div>
      <div id='moreActions' className='h-full px-4'>
        <ul className='flex items-center gap-4 h-full'>
          {!isLoggedIn && (
            <li className='hidden lg:flex'>
              <Link
                to='/login'
                className='flex gap-4 p-4 bg-black text-white items-center uppercase'
              >
                <i className='fa-sharp fa-light fa-right-to-bracket'></i>
                <small>Login</small>
              </Link>
            </li>
          )}

          {!isMobileMenuOpen ? (
            <li className='lg:hidden'>
              <a href='#' onClick={() => handleOpenMobileMenu(true)}>
                <i className='fa fa-bars'></i>
              </a>
            </li>
          ) : (
            <li className='lg:hidden'>
              <a href='#' onClick={() => handleOpenMobileMenu(false)}>
                <i className='fa-sharp fa-solid fa-xmark'></i>
              </a>
            </li>
          )}
          <li>
            <i
              className='fa-regular fa-circle-half-stroke'
              onClick={toggleDarkMode}
            ></i>
          </li>
          <li>
            <a href='#' onClick={handleChangeOpenSearch}>
              <i className='fa fa-search'></i>
            </a>
          </li>
          {!openState ? (
            <li>
              <a href='#' onClick={() => handleChangeOpenState(true)}>
                <i className='fa fa-ellipsis-vertical'></i>
              </a>
            </li>
          ) : (
            <li>
              <a href='#' onClick={() => handleChangeOpenState(false)}>
                <i className='fa-sharp fa-solid fa-xmark'></i>
              </a>
            </li>
          )}
          {isLoggedIn && (
            <li className='flex-none'>
              <img
                onClick={handleOpenUserMenu}
                src={profile?.avatar?.url}
                alt={profile?.avatar?.alt}
                className='rounded-full w-[32px] h-[32px]'
              />
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

NavBar.propTypes = {
  openState: PropTypes.bool.isRequired,
  isMobileMenuOpen: PropTypes.bool.isRequired,
  handleChangeOpenState: PropTypes.func.isRequired,
  handleChangeOpenSearch: PropTypes.func.isRequired,
  handleOpenMobileMenu: PropTypes.func.isRequired,
  handleOpenUserMenu: PropTypes.func.isRequired,
}

export default NavBar
