import PropTypes from 'prop-types'
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({
  openState,
  handleChangeOpenState,
  handleChangeOpenSearch,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Toggle dark mode class on root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Handler to toggle dark mode state
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div
      className='flex h-[80px] shadow-sm bg-white dark:bg-slate-950 relative z-20 dark:text-white'
      id='navbar'
    >
      <div
        className='w-[80px] h-full flex items-center justify-center bg-black text-white'
        id='logo'
      >
        <h1 className='text-3xl font-black'>H</h1>
      </div>
      <div
        id='logoName'
        className='h-full flex items-center flex-1 lg:flex-none px-8 font-black py-10 '
      >
        <span className='dark:text-white'>Holidaze</span>
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
          <li className='lg:hidden'>
            <a href=''>
              <i className='fa fa-bars'></i>
            </a>
          </li>
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
        </ul>
      </div>
    </div>
  )
}

NavBar.propTypes = {
  openState: PropTypes.bool.isRequired,
  handleChangeOpenState: PropTypes.func.isRequired,
  handleChangeOpenSearch: PropTypes.func.isRequired,
}
 
export default NavBar;