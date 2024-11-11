import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import bannerImage from '/booking-1.png'
import {
  createBooking,
  getBookingById,
  getVenueById,
  updateBooking,
} from '../utilities/api'
import { useProfile } from '../context/ProfileContext'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import Spinner from '../components/Spinner'
const GOOGLE_MAP_API_KEY = import.meta.VITE_GOOGLE_MAP_API_KEY
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import VenueCalendar from '../components/VenueCalendar'

const VenueDetails = () => {
  const { changePageTitle } = usePageTitleContext()
  const [isLoading, setIsLoading] = useState(true)
  const formRef = useRef(null)
  const [venueFormData, setVenueFormData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: '',
    venueId: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ error: '', success: '' })
  const [venue, setVenue] = useState({})
  const { profile } = useProfile()
  const [booking, setBooking] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const { venueId, bookingId } = useParams()
  const defaultLocation = {
    lat: 0,
    lng: 0,
  }
  const navigate = useNavigate()

  useEffect(() => {
    getVenue()

    if (bookingId) {
      getBooking(bookingId)
    }
  }, [venueId])

  async function getVenue() {
    try {
      const { data: venue, error } = await getVenueById(venueId)
      if (error) {
        navigate('/not-found')
      }
      setVenue(venue)
      changePageTitle(venue?.name)
      //set the venue id
      setVenueFormData((prev) => ({
        ...prev,
        venueId: venue?.id,
      }))
    } catch (e) {
      console.log('Error', e)
      return navigate('/not-found')
    } finally {
      setIsLoading(false)
    }
  }

  async function getBooking(bookingId) {
    try {
      const { data: booking } = await getBookingById(bookingId)

      setIsEditing(true)
      setBooking(booking)
      setVenueFormData((prev) => ({
        ...prev,
        dateFrom: toInputDate(booking?.dateFrom),
        dateTo: toInputDate(booking?.dateTo),
        guests: booking?.guests,
      }))
    } catch (e) {
      console.log(e)
    } finally {
      setIsEditing(true)
      scrollToForm()
    }
  }

  const toInputDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }

  const scrollToForm = () => {
    if (!formRef.current) return
    // formRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const validateForm = () => {
    //check if booking dates are valid
    let { dateFrom, dateTo } = venueFormData
    dateFrom = new Date(dateFrom)
    dateTo = new Date(dateTo)
    //check if date to or a date from is less than today
    if (dateTo < new Date() || dateFrom < new Date()) {
      setMessage((prev) => ({
        ...prev,
        error: 'Date from or date to, must be in the future',
      }))
      return false
    }

    //check if date from is less than date to
    if (dateFrom > dateTo) {
      setMessage((prev) => ({
        ...prev,
        error: 'Date from must be less than date to',
      }))
      return false
    }

    return true
  }

  const handleEditBooking = (event) => {
    event.preventDefault()
    setFormLoading(true)
    //reset errors and success messages
    setMessage(() => ({ success: null, error: null }))
    const validate = validateForm()

    if (!validate) {
      setFormLoading(false)
      return
    }
    setFormLoading(true)
    ///clear any errors
    setMessage(() => ({ success: null, error: null }))
    updateBooking(booking.id, venueFormData)
      .then(() => {
        setMessage((prev) => ({
          ...prev,
          success: 'Booking updated successfully',
        }))
      })
      .catch((error) => {
        setMessage((prev) => ({ ...prev, error: error[0]?.message }))
      })
      .finally(() => setFormLoading(false))
  }
  const handleCreateBooking = (event) => {
    event.preventDefault()
    //reset errors and success messages
    setMessage(() => ({ success: null, error: null }))
    const validate = validateForm()
    if (!validate) return
    setFormLoading(true)

    ///clear any errors
    setMessage(() => ({ success: null, error: null }))

    createBooking(venueFormData)
      .then(({ error }) => {
        console.log('Starting')
        if (error && error.length) {
          console.log('Error')
          return setMessage((prev) => ({
            ...prev,
            error: error[0]?.message,
          }))
        }

        //reset the form
        setVenueFormData(() => ({ dateFrom: null, dateTo: null, guests: null }))
        event.target.reset()
        setMessage((prev) => ({
          ...prev,
          success: 'Booking created successfully',
        }))
      })
      .catch((error) => {
        setMessage((prev) => ({ ...prev, error: error[0]?.message }))
      })
      .finally(() => setFormLoading(false))
  }

  return (
    <>
      <motion.div className='flex flex-col lg:flex-row bg-white/50 dark:bg-slate-900 dark:text-white'>
        {isLoading ? (
          <div className='w-full lg:w-7/12 p-4 lg:p-10 mb-24'>
            <Skeleton />
          </div>
        ) : (
          <motion.div className='w-full lg:w-7/12 p-4 lg:p-10 mb-24'>
            <div
              className='h-[500px] w-full bg-cover bg-center flex items-end justify-start mb-10'
              style={{
                backgroundImage: `url(${venue?.media[0]?.url})`,
                objectFit: 'cover',
              }}
            >
              <div className='p-4 bg-black/90 w-full lg:w-1/2 flex flex-col gap-4'>
                <div className='flex items-center justify-between text-white'>
                  <span className='text-xs uppercase'>Name:</span>
                  <span>{venue?.name}</span>
                </div>
                <div className='flex items-center justify-between text-white'>
                  <span className='text-xs uppercase'>Price (NOK):</span>
                  <span>{venue?.price.toLocaleString()}</span>
                </div>
                <div className='flex items-center justify-between text-white'>
                  <span className='text-xs uppercase'>Rating:</span>
                  <span>{venue?.rating}</span>
                </div>
                <div className='flex items-center justify-between text-white'>
                  <span className='text-xs uppercase'>Max Guests:</span>
                  <span>{venue?.maxGuests}</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-4 mb-10'>
              <p className='mb-10'>{venue?.description}</p>
              <h1 className='uppercase font-black'>Features</h1>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {venue?.meta?.wifi ? (
                  <FeatureItem
                    name='Wifi Available'
                    icon='fa-sharp fa-regular fa-wifi'
                  />
                ) : (
                  <FeatureItem
                    name='No Wifi'
                    icon='fa-sharp fa-regular fa-wifi-slash'
                  />
                )}
                {venue?.meta?.parking ? (
                  <FeatureItem
                    name='Parking Available'
                    icon='fa-sharp fa-light fa-circle-parking'
                    leftBoarder={false}
                  />
                ) : (
                  <FeatureItem
                    name='No Parking'
                    icon='fa-sharp fa-light fa-ban-parking'
                    leftBoarder={false}
                  />
                )}
                {venue?.meta?.breakfast ? (
                  <FeatureItem
                    name='BreakFast'
                    icon='fa-sharp fa-regular fa-mug-saucer'
                    leftBoarder={false}
                    rightBoarder={false}
                  />
                ) : (
                  <FeatureItem
                    name='No BreakFast'
                    icon='fa-solid fa-utensils-slash'
                    leftBoarder={false}
                    rightBoarder={false}
                  />
                )}
                {venue?.meta?.pets ? (
                  <FeatureItem
                    name='Pets Allowed'
                    icon='fa-sharp fa-light fa-dog-leashed'
                  />
                ) : (
                  <FeatureItem
                    name='Pets Disallowed'
                    icon='fa-sharp fa-solid fa-ban'
                  />
                )}
              </div>

              <div className='grid grid-col-1 md:grid-cols-2 gap-4'>
                {venue?.media.map((image, index) => (
                  <img key={index} src={image.url} alt={image.alt} className='h-[250px] grid-cols-2 md:grid-cols-1 w-full object-cover object-center '/>
                ))}
              </div>
            </div>

            <div>{venue?.bookings && <VenueCalendar venue={venue} />}</div>

            <div className='flex flex-col gap-4'>
              <h1 className='uppercase font-black'>Welcome to visit</h1>
              <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{
                    height: '500px',
                    width: '100%',
                  }}
                  zoom={15}
                  center={{
                    lat: venue?.location?.lat || defaultLocation.lat,
                    lng: venue?.location?.lng || defaultLocation.lng,
                  }}
                >
                  <Marker
                    position={{
                      lat: venue?.location?.lat || defaultLocation.lat,
                      lng: venue?.location?.lng || defaultLocation.lng,
                    }}
                  />
                  <InfoWindow
                    position={{
                      lat: venue?.location?.lat || defaultLocation.lat,
                      lng: venue?.location?.lng || defaultLocation.lng,
                    }}
                  >
                    <div>
                      <h4>{venue?.location.address}</h4>
                      <p>{`${venue?.location.city}, ${venue?.location.zip}, ${venue?.location.country}`}</p>
                    </div>
                  </InfoWindow>
                </GoogleMap>
              </LoadScript>
            </div>
          </motion.div>
        )}

        <motion.div
          id='right'
          className='w-full lg:w-5/12 min-h-full flex flex-col justify-center items-center bg-contain bg-no-repeat  sticky self-start top-0'
          style={{
            height: 'calc(100vh - 80px)',
          }}
        >
          <img
            src={bannerImage}
            alt='map'
            className='w-full h-full object-cover'
          />
          {profile ? (
            <div className='absolute h-full w-full bg-black bg-opacity-70 p-10 flex flex-col justify-center'>
              <h1 className='uppercase font-black text-white mb-4 text-xl md:text-3xl'>
                {isEditing ? 'Update booking Details' : ' Reserve the place.'}
              </h1>
              <Message message={message?.error} backgroundColor='bg-red-600' />
              <Message
                message={message?.success}
                backgroundColor='bg-green-600'
              />
              <form
                ref={formRef}
                className='grid grid-cols-1 md:grid-cols-1 gap-6'
                onSubmit={(event) =>
                  isEditing
                    ? handleEditBooking(event)
                    : handleCreateBooking(event)
                }
                autoComplete='no-fill'
              >
                <div className='col-span-2'>
                  <label className='text-white' htmlFor='guests'>
                    Number of guests
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <i className='fa-sharp fa-light fa-users text-white'></i>
                    </div>
                    <input
                      type='number'
                      id='guests'
                      autoComplete='new-guests'
                      value={venueFormData.guests}
                      required
                      min={1}
                      max={venue?.maxGuests}
                      onChange={(event) => {
                        let value = Number(event.target.value)

                        // Enforce min and max limits
                        if (value < 1) value = 1
                        if (value > venue?.maxGuests) value = venue?.maxGuests

                        setVenueFormData((prev) => ({
                          ...prev,
                          guests: value,
                        }))
                      }}
                      className='bg-transparent text-white border border-gray-300  text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                      placeholder='How many guests will be hosted?'
                    />
                  </div>
                </div>
                <div className='col-span-2'>
                  <label className='text-white' htmlFor='dateFrom'>
                    Date From
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <i className='fa-sharp fa-light fa-calendar text-white'></i>
                    </div>
                    <input
                      type='date'
                      autoComplete='new-date-from'
                      required
                      value={venueFormData.dateFrom}
                      onChange={(event) =>
                        setVenueFormData((prev) => ({
                          ...prev,
                          dateFrom: event.target.value,
                        }))
                      }
                      id='dateFrom'
                      className='bg-transparent border border-gray-300  text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 text-white'
                      placeholder=''
                    />
                  </div>
                </div>
                <div className='col-span-2'>
                  <label className='text-white' htmlFor='dateTo'>
                    Date To
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <i className='fa-sharp fa-light fa-calendar text-white'></i>
                    </div>
                    <input
                      type='date'
                      id='dateTo'
                      autoComplete='new-date-to'
                      value={venueFormData.dateTo}
                      required
                      onChange={(event) =>
                        setVenueFormData((prev) => ({
                          ...prev,
                          dateTo: event.target.value,
                        }))
                      }
                      className='bg-transparent border border-gray-300  text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 text-white'
                      placeholder='Book To'
                    />
                  </div>
                </div>

                <div className='col-span-1 md:col-span-2  gap-4 flex'>
                  <button className='flex gap-2 p-4 border-white border text-white items-center uppercase hover:bg-black/75'>
                    {formLoading ? <Spinner /> : null}
                    {formLoading ? (
                      <span className='text-xs'>Reserving...</span>
                    ) : isEditing ? (
                      <span className='text-xs'>Update Booking</span>
                    ) : (
                      <span className='text-xs'>Reserve Now</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className='absolute h-full w-full bg-black bg-opacity-70 p-10 '>
              <div className='absolute top-10 left-5 items-center flex-col hidden lg:flex'>
                <div className='w-8 h-12 border-2 border-yellow-500 rounded-full flex items-center justify-center mb-2'>
                  <span className='block w-1.5 h-2.5 bg-yellow-500 rounded-full animate-bounce'></span>
                </div>
                <span className='text-sm font-semibold text-gray-300 lg:rotate-90 lg:mt-16'>
                  SCROLL DOWN
                </span>
              </div>

              <div className='absolute bottom-10 text-white flex flex-col items-start mb-10'>
                <h2 className='text-4xl font-bold mb-4'>Create An Account</h2>
                <div className='text-gray-300 mb-6'>
                  <hr className='bg-white border-white h-[5px] w-1/2 mb-3' />
                  <p>
                    Book Your Next Adventure! Sign up or log in to your account
                    to unlock exclusive booking features and secure your spot
                    with ease.
                  </p>
                </div>
                <Link
                  to='/register'
                  className='bg-black hover:bg-black/40 text-white font-semibold py-2 px-6'
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

const Skeleton = () => {
  return (
    <div role='status' className='w-full border border-gray-400 rounded-lg p-4'>
      <div className='animate-pulse w-full bg-gray-400 h-96 rounded-lg mb-5 flex justify-center items-center'>
        <i className='fa-thin fa-image'></i>
      </div>
      <div className=' w-full flex flex-col gap-4 justify-between items-start animate-pulse'>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-full '></span>
        <span className='h-4 bg-gray-400 rounded-full w-1/2 '></span>
      </div>
    </div>
  )
}

const FeatureItem = ({
  name,
  icon,
  leftBoarder = true,
  rightBoarder = true,
}) => {
  return (
    <div
      className={`flex flex-col gap-4 items-center justify-center border border-black dark:border-white p-4 ${
        !leftBoarder && 'lg:border-l-0'
      } ${!rightBoarder && 'lg:border-r-0'}`}
    >
      <i className={icon}></i>
      <span className='text-xs font-bolder'>{name}</span>
    </div>
  )
}

FeatureItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  leftBoarder: PropTypes.bool,
  rightBoarder: PropTypes.bool,
}
export default VenueDetails
