import { usePageTitleContext } from '../context/PageTitleContext'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import bannerImage from '/venues-1.jpg'
import Spinner from './../components/Spinner'
import Message from './../components/Message'
import { createVenue, getVenueById, updateVenue } from '../utilities/api'

const VenueForm = () => {
  const { changePageTitle } = usePageTitleContext()
  const [message, setMessage] = useState({
    error: null,
    success: null,
  })
  const [venueFormData, setVenueFormData] = useState({
    name: '', // Required
    description: '', // Required
    media: [
      {
        url: '',
        alt: '',
      },
    ], // Optional
    price: 0, // Required
    maxGuests: 0, // Required
    rating: 0,
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: true,
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0,
    },
  })
  const [formLoading, setFormLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { venueId } = useParams()

  useEffect(() => {
    changePageTitle('Contact')
    const getVenueDetails = async (id) => {
      try {
        const { data } = await getVenueById(id)
        setVenueFormData(data)
        setIsEditing(true)
      } catch (err) {
        console.log(err)
      }
    }
    if (venueId) {
      getVenueDetails(venueId)
    }
  }, [])

  const handleChange = (event, field) => {
    const { value } = event.target

    setVenueFormData((prevState) => {
      // Handle nested fields
      if (field.includes('.')) {
        const [mainField, subField] = field.split('.')

        // Handle boolean values for meta fields
        if (mainField === 'meta') {
          return {
            ...prevState,
            [mainField]: {
              ...prevState[mainField],
              [subField]: value === 'true',
            },
          }
        }

        // Handle number values for location fields
        if (
          mainField === 'location' &&
          (subField === 'lat' || subField === 'lng')
        ) {
          return {
            ...prevState,
            [mainField]: {
              ...prevState[mainField],
              [subField]: value === '' ? 0 : Number(value),
            },
          }
        }

        // Handle other nested fields
        return {
          ...prevState,
          [mainField]: {
            ...prevState[mainField],
            [subField]: value,
          },
        }
      }

      // Handle non-nested number fields
      if (field === 'price' || field === 'maxGuests' || field === 'rating') {
        return {
          ...prevState,
          [field]: value === '' ? 0 : Number(value),
        }
      }

      // Handle regular fields
      return {
        ...prevState,
        [field]: value,
      }
    })
  }

  const addMediaItem = () => {
    setVenueFormData((prevData) => ({
      ...prevData,
      media: [...prevData.media, { url: '', alt: '' }],
    }))
  }

  const handleMediaChange = (index, field, value) => {
    const newMedia = [...venueFormData.media]
    newMedia[index][field] = value
    setVenueFormData((prevData) => ({
      ...prevData,
      media: newMedia,
    }))
  }

  const removeMediaItem = (index) => {
    setVenueFormData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((_, i) => i !== index),
    }))
  }

  const isImageUrl = (url) => {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i
    return urlPattern.test(url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormLoading(true)

    //clear all errors
    setMessage(() => ({ success: null, error: null }))
    // Mock submit

    // Validate each image URL before proceeding
    const areAllValidUrls = venueFormData.media.every((item) =>
      isImageUrl(item.url)
    )

    if (!areAllValidUrls) {
      setFormLoading(false)
      setMessage((prev) => ({
        ...prev,
        error:
          'One or more media URLs are invalid. Please check and try again.',
      }))
      return // Stop the submission if validation fails
    }

    if (!isEditing) {
      createVenue(venueFormData)
        .then((res) => {
          const { error } = res
          if (error) {
            setMessage((prev) => ({ ...prev, error: error[0].message }))
            return
          }
          setMessage((prev) => ({
            ...prev,
            success: 'Venue created successfully!',
          }))
          //reset form data
          setVenueFormData(() => ({
            name: '',
            description: '',
            price: 0,
            maxGuests: 0,
            rating: 0,
            media: [{ url: '', alt: '' }],
            meta: {
              wifi: true,
              parking: true,
              breakfast: true,
              pets: true,
            },
            location: {
              address: '',
              city: '',
              zip: '',
              country: '',
              continent: '',
              lat: 0,
              lng: 0,
            },
          }))
        })
        .catch((e) => setMessage((prev) => ({ ...prev, error: e[0].message })))
        .finally(() => setFormLoading(false))
    } else {
      updateVenue(venueId, venueFormData)
        .then((res) => {
          const { error } = res
          if (error) {
            setMessage((prev) => ({ ...prev, error: error[0].message }))
            return
          }
          setMessage((prev) => ({
            ...prev,
            success: 'Venue updated successfully!',
          }))
          //reset form data
        })
        .catch((e) => setMessage((prev) => ({ ...prev, error: e[0].message })))
        .finally(() => setFormLoading(false))
    }
  }

  return (
    <>
      <motion.div className='flex flex-col lg:flex-row bg-white/50 dark:bg-slate-900 dark:text-white'>
        <motion.div className='w-full lg:w-7/12 p-2 lg:p-10 mb-24'>
          <div className='flex flex-col gap-4 mb-10 p-4 bg-white dark:bg-slate-950'>
            <h1 className='uppercase font-black'>
              {isEditing ? 'Update Venue' : 'Create New Venue'}
            </h1>
            <form
              className='grid grid-cols-1 md:grid-cols-2 gap-4'
              onSubmit={handleSubmit}
            >
              <div className='col-span-1 md:col-span-2'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-buildings'></i>
                  </div>
                  <input
                    type='text'
                    required
                    id='venueName'
                    onChange={(event) => handleChange(event, 'name')}
                    value={venueFormData.name}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Venue Name'
                  />
                </div>
              </div>

              <div className='col-span-1 md:col-span-2'>
                <textarea
                  id='message'
                  required
                  rows='4'
                  onChange={(event) => handleChange(event, 'description')}
                  value={venueFormData.description}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Venue Description...'
                ></textarea>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-sack'></i>
                  </div>
                  <input
                    type='number'
                    id='venuePrice'
                    required
                    onChange={(event) => handleChange(event, 'price')}
                    value={venueFormData.price}
                    min='1'
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter price'
                  />
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-users'></i>
                  </div>
                  <input
                    type='number'
                    id='maxGuests'
                    required
                    onChange={(event) => handleChange(event, 'maxGuests')}
                    value={venueFormData.maxGuests}
                    min='1'
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter maximum guests'
                  />
                </div>
              </div>

              <hr className='col-span-2' />
              <h4 className='col-span-2'>Features</h4>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-dog-leashed'></i>
                  </div>
                  <select
                    type='number'
                    id='petsAllowed'
                    min='1'
                    onChange={(event) => handleChange(event, 'meta.pets')}
                    value={venueFormData.meta.pets.toString()}
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Pets Allowed</option>
                    <option value='false'>Pets Not Allowed</option>
                  </select>
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-dog-leashed'></i>
                  </div>
                  <select
                    type='number'
                    id='wifiAvailable'
                    onChange={(event) => handleChange(event, 'meta.wifi')}
                    value={venueFormData.meta.wifi.toString()}
                    min='1'
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Wifi Available</option>
                    <option value='false'>No Wifi Available</option>
                  </select>
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-utensils'></i>
                  </div>
                  <select
                    type='number'
                    id='breakfastAvailable'
                    min='1'
                    maxLength={160}
                    onChange={(event) => handleChange(event, 'meta.breakfast')}
                    value={venueFormData.meta.breakfast.toString()}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Breakfast Available</option>
                    <option value='false'>No Breakfast Available</option>
                  </select>
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-circle-parking'></i>
                  </div>
                  <select
                    type='number'
                    id='parkingAvailable'
                    min='1'
                    maxLength={160}
                    onChange={(event) => handleChange(event, 'meta.parking')}
                    value={venueFormData.meta.parking.toString()}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Parking Available</option>
                    <option value='false'>No Parking Available</option>
                  </select>
                </div>
              </div>

              <hr className='col-span-2' />
              <h4 className='col-span-2'>Location</h4>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-location-dot'></i>
                  </div>
                  <input
                    type='text'
                    id='address'
                    min='1'
                    onChange={(event) =>
                      handleChange(event, 'location.address')
                    }
                    value={venueFormData.location.address}
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter address'
                  />
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-city'></i>
                  </div>
                  <input
                    type='text'
                    id='city'
                    onChange={(event) => handleChange(event, 'location.city')}
                    value={venueFormData.location.city}
                    min='1'
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter city'
                  />
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-00'></i>
                  </div>
                  <input
                    type='number'
                    id='zip'
                    onChange={(event) => handleChange(event, 'location.zip')}
                    value={venueFormData.location.zip}
                    min='1'
                    max={999999}
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter zip'
                  />
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-globe'></i>
                  </div>
                  <input
                    type='text'
                    id='country'
                    min='1'
                    maxLength={160}
                    onChange={(event) =>
                      handleChange(event, 'location.country')
                    }
                    value={venueFormData.location.country}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter country'
                  />
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-location-crosshairs'></i>
                  </div>
                  <input
                    type='number'
                    id='latitude'
                    onChange={(event) => handleChange(event, 'location.lat')}
                    value={venueFormData.location.lat}
                    min='1'
                    maxLength={160}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter latitude'
                  />
                </div>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-location-crosshairs'></i>
                  </div>
                  <input
                    type='number'
                    id='longitude'
                    min='1'
                    maxLength={160}
                    onChange={(event) => handleChange(event, 'location.lng')}
                    value={venueFormData.location.lng}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter longitude'
                  />
                </div>
              </div>

              <div className='col-span-2'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-earth-africa'></i>
                  </div>
                  <input
                    type='text'
                    id='continent'
                    min='1'
                    maxLength={160}
                    onChange={(event) =>
                      handleChange(event, 'location.continent')
                    }
                    value={venueFormData.location.continent}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter continent'
                  />
                </div>
              </div>

              <hr className='col-span-2' />
              <h4 className='col-span-2 flex justify-between'>
                <span>Venue Media </span>
              </h4>

              {venueFormData.media.map((mediaItem, index) => (
                <div
                  key={index}
                  className='col-span-1 md:col-span-2 flex gap-2'
                >
                  <input
                    type='url'
                    placeholder='Image URL'
                    value={mediaItem.url}
                    onChange={(e) =>
                      handleMediaChange(index, 'url', e.target.value)
                    }
                    className='bg-gray-50 border text-sm w-full p-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <input
                    type='text'
                    placeholder='Alt Text'
                    value={mediaItem.alt}
                    onChange={(e) =>
                      handleMediaChange(index, 'alt', e.target.value)
                    }
                    className='bg-gray-50 border text-sm w-full p-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <button type='button' onClick={() => removeMediaItem(index)}>
                    Remove
                  </button>
                </div>
              ))}

              <button
                type='button'
                onClick={addMediaItem}
                className='col-span-2'
              >
                Add Media Item
              </button>

              <div className='col-span-1 md:col-span-2  gap-4 flex'>
                <button
                  disabled={formLoading ? 'disabled' : ''}
                  className='flex gap-2 p-4 bg-black border text-white items-center uppercase hover:bg-black/75'
                >
                  {formLoading ? <Spinner /> : null}
                  {formLoading ? (
                    <span className='text-xs'>Saving...</span>
                  ) : isEditing ? (
                    <span className='text-xs'>Update Venue</span>
                  ) : (
                    <span className='text-xs'>Create</span>
                  )}
                </button>
              </div>

              <div className='col-span-2'>
                <Message
                  message={message?.error}
                  backgroundColor='bg-red-600'
                />
                <Message
                  message={message?.success}
                  backgroundColor='bg-green-600'
                />
              </div>
            </form>

            <hr className='bg-black h-[2px]' />
          </div>
        </motion.div>
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
          <div className='absolute h-full w-full bg-black bg-opacity-50 p-10  '>
            <div className='absolute top-10 left-5 items-center flex-col hidden lg:flex'>
              <div className='w-8 h-12 border-2 border-yellow-500 rounded-full flex items-center justify-center mb-2'>
                <span className='block w-1.5 h-2.5 bg-yellow-500 rounded-full animate-bounce'></span>
              </div>
              <span className='text-sm font-semibold text-gray-300 lg:rotate-90 lg:mt-16'>
                SCROLL DOWN
              </span>
            </div>

            <div className='absolute bottom-10 text-white flex flex-col items-start mb-10'>
              <h2 className='text-4xl font-bold mb-4'>Get in touch</h2>
              <div className='text-gray-300 mb-6'>
                <hr className='bg-black border-black h-[5px] w-1/2 mb-3' />
                <p>
                  Have questions or need inspiration? Contact us to start
                  crafting your unforgettable Holidaze experience.
                </p>
              </div>
              <Link
                to='/contact'
                className='bg-black hover:bg-black/40 text-white font-semibold py-2 px-6'
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default VenueForm
