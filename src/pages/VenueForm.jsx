import { usePageTitleContext } from '../context/PageTitleContext'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import bannerImage from '/venues-1.jpg'
import Spinner from './../components/Spinner'
import Message from './../components/Message'
import { createVenue, getVenueById, updateVenue } from '../utilities/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Venue name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  maxGuests: yup
    .number()
    .typeError('Max guests must be a number')
    .positive('Max guests must be positive')
    .integer('Max guests must be a whole number')
    .required('Maximum guests is required'),
  media: yup.array().of(
    yup.object().shape({
      url: yup.string().url('Must be a valid URL'),
      alt: yup.string(),
    })
  ),
  meta: yup.object().shape({
    wifi: yup.boolean(),
    parking: yup.boolean(),
    breakfast: yup.boolean(),
    pets: yup.boolean(),
  }),
  location: yup.object().shape({
    address: yup.string(),
    city: yup.string(),
    zip: yup.string(),
    country: yup.string(),
    continent: yup.string(),
    lat: yup.number().typeError('Latitude must be a number'),
    lng: yup.number().typeError('Longitude must be a number'),
  }),
})

const VenueForm = () => {
  const { changePageTitle } = usePageTitleContext()
  const [message, setMessage] = useState({
    error: null,
    success: null,
  })

  const [formLoading, setFormLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { venueId } = useParams()

  // Inside your component, replace the useState with useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      media: [{ url: '', alt: '' }],
      price: 0,
      maxGuests: 0,
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
    },
  })

  const mediaFields = watch('media')
  useEffect(() => {
    
      changePageTitle('Create Venue')
    const getVenueDetails = async (id) => {
      try {
        const { data } = await getVenueById(id)
        // Reset form with venue data
        reset(data)
        setIsEditing(true) 
        changePageTitle('Update Venue')
      } catch (err) {
        console.log(err)
      }
    }

    if (venueId) {
      getVenueDetails(venueId)
    }
  }, [venueId, reset])

 

  const addMediaItem = () => {
    const media = watch('media') || []
    setValue('media', [...media, { url: '', alt: '' }])
  }

  const removeMediaItem = (index) => {
    const media = watch('media')
    setValue(
      'media',
      media.filter((_, i) => i !== index)
    )
  }
 
 
 
 

  const onSubmit = async (data) => {
    setFormLoading(true)
    setMessage({ success: null, error: null })

    try {
      if (!isEditing) {
        const response = await createVenue(data)
        if (response.error) {
          setMessage({ error: response.error[0].message })
        } else {
          setMessage({ success: 'Venue created successfully!' })
          reset() // Reset form
        }
      } else {
        const response = await updateVenue(venueId, data)
        if (response.error) {
          setMessage({ error: response.error[0].message })
        } else {
          setMessage({ success: 'Venue updated successfully!' })
        }
      }
    } catch (e) {
      setMessage({ error: e[0].message })
    } finally {
      setFormLoading(false)
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
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='col-span-1 md:col-span-2'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-buildings'></i>
                  </div>
                  <input
                    {...register('name')}
                    type='text'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Venue Name'
                  />
                </div>
                <small className='text-red-600'>{errors.name?.message}</small>
              </div>

              <div className='col-span-1 md:col-span-2'>
                <textarea
                  rows='4'
                  {...register('description')}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Venue Description...'
                ></textarea>
                <small className='text-red-600'>
                  {errors.description?.message}
                </small>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-sack'></i>
                  </div>
                  <input
                    type='number'
                    {...register('price')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter price'
                  />
                </div>
                <small className='text-red-600'>{errors.price?.message}</small>
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-users'></i>
                  </div>
                  <input
                    type='number'
                    {...register('maxGuests')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter maximum guests'
                  />
                </div>
                <small className='text-red-600'>
                  {errors.maxGuests?.message}
                </small>
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
                    {...register('meta.pets')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Pets Allowed</option>
                    <option value='false'>Pets Not Allowed</option>
                  </select>
                </div>
                {errors.meta?.pets && (
                  <span className='text-red-500 text-sm'>
                    {errors.meta.pets.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-regular fa-wifi'></i>
                  </div>
                  <select
                    {...register('meta.wifi')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Wifi Available</option>
                    <option value='false'>No Wifi Available</option>
                  </select>
                </div>
                {errors.meta?.wifi && (
                  <span className='text-red-500 text-sm'>
                    {errors.meta.wifi.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-utensils'></i>
                  </div>
                  <select
                    type='number'
                    {...register('meta.breakfast')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Breakfast Available</option>
                    <option value='false'>No Breakfast Available</option>
                  </select>
                </div>
                {errors.meta?.breakfast && (
                  <span className='text-red-500 text-sm'>
                    {errors.meta.breakfast.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-circle-parking'></i>
                  </div>
                  <select
                    {...register('meta.parking')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option value='true'>Parking Available</option>
                    <option value='false'>No Parking Available</option>
                  </select>
                </div>
                {errors.meta?.parking && (
                  <span className='text-red-500 text-sm'>
                    {errors.meta.parking.message}
                  </span>
                )}
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
                    {...register('location.address')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter address'
                  />
                </div>
                {errors.location?.address && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.address.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-city'></i>
                  </div>
                  <input
                    type='text'
                    {...register('location.city')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter city'
                  />
                </div>
                {errors.location?.city && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.city.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-00'></i>
                  </div>
                  <input
                    type='number'
                    {...register('location.zip')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter zip'
                  />
                </div>
                {errors.location?.zip && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.zip.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-globe'></i>
                  </div>
                  <input
                    type='text'
                    {...register('location.country')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter country'
                  />
                </div>
                {errors.location?.country && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.country.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-location-crosshairs'></i>
                  </div>
                  <input
                    type='number'
                    {...register('location.lat')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter latitude'
                  />
                </div>
                {errors.location?.lat && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.lat.message}
                  </span>
                )}
              </div>

              <div className='col-span-1'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-location-crosshairs'></i>
                  </div>
                  <input
                    type='number'
                    {...register('location.lng')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter longitude'
                  />
                </div>
                {errors.location?.lng && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.lng.message}
                  </span>
                )}
              </div>

              <div className='col-span-2'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-thin fa-earth-africa'></i>
                  </div>
                  <input
                    type='text'
                    {...register('location.continent')}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Enter continent'
                  />
                </div>
                {errors.location?.continent && (
                  <span className='text-red-500 text-sm'>
                    {errors.location.continent.message}
                  </span>
                )}
              </div>

              {/* Media Section */}
              <hr className='col-span-2' />
              <h4 className='col-span-2 flex justify-between'>
                <span>Venue Media</span>
              </h4>

              {mediaFields.map((_, index) => (
                <div
                  key={index}
                  className='col-span-1 md:col-span-2 flex gap-2'
                >
                  <input
                    type='url'
                    {...register(`media.${index}.url`)}
                    className='bg-gray-50 border text-sm w-full p-2'
                    placeholder='Image URL'
                  />
                  <input
                    type='text'
                    {...register(`media.${index}.alt`)}
                    className='bg-gray-50 border text-sm w-full p-2'
                    placeholder='Alt Text'
                  />
                  <button
                    type='button'
                    onClick={() => removeMediaItem(index)}
                    className='bg-red-500 text-white px-4 py-2'
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type='button'
                onClick={addMediaItem}
                className='col-span-2 bg-gray-200 hover:bg-gray-300 p-2'
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
