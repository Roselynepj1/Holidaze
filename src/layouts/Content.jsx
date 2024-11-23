import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Faq from '../pages/Faq'
import Venue from '../pages/Venue'
import NotFound from '../pages/NotFound'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { useRef } from 'react'
import VenueDetails from '../pages/VenueDetails'
import Bookings from '../pages/Bookings'
import Profile from '../pages/Profile'
import VenueForm from './../pages/VenueForm'
import UserVenues from './../pages/UserVenues'
import VenueBookings from './../pages/VenueBookings'
import ProtectedRoute from './ProtectedRoute'

const Content = () => {
  const contentAreaRef = useRef(null)
  return (
    <div
      id='contentArea'
      ref={contentAreaRef}
      className='h-full w-full  overflow-y-scroll thin-scrollbar pb-4 bg-slate-300 dark:bg-slate-900'
    >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/user/bookings' element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route
          path='/venues'
          element={<Venue contentAreaRef={contentAreaRef} />}
        />
        <Route path='/venues/:venueId' element={<VenueDetails />} />
        <Route path='/user/venues' element={<UserVenues />} />
        <Route path='/user/venues/create' element={<ProtectedRoute><VenueForm /></ProtectedRoute>} />
        <Route
          path='/user/venues/:venueId/edit'
          element={
            <ProtectedRoute>
              <VenueForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='/user/venues/:venueId/bookings'
          element={<VenueBookings />}
        />
        <Route
          path='/venues/:venueId/booking/:bookingId/edit'
          element={<VenueDetails />}
        />
        <Route path='/faq' element={<Faq />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/not-found' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default Content
