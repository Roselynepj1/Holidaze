import { usePageTitleContext } from './../context/PageTitleContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import bannerImage from '/profile-1.jpg'

import { useProfile } from '../context/ProfileContext'
import Message from '../components/Message'
import Spinner from '../components/Spinner'
import { updateProfile } from '../utilities/api'

const Profile = () => {
  const { changePageTitle } = usePageTitleContext()
  const { profile, refetchProfile } = useProfile()
  const [formLoading, setFormLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    bio: '',
    avatar: {
      url: '',
      alt: '',
    },
    banner: {
      url: '',
      alt: '',
    },
  })
  const [message, setMessage] = useState({
    success: null,
    error: null,
  })

  useEffect(() => {
    changePageTitle('Profile')

    if (profile) {
      //set the bio
      setProfileData((prev) => ({
        ...prev,
        bio: profile?.bio,
        avatar: {
          url: profile?.avatar?.url,
          alt: `${profile?.name} avatar`,
        },
        banner: {
          url: profile?.banner?.url,
          alt: `${profile?.name} banner`,
        },
      }))
    }
  }, [])

  const isImageUrl = (url) => {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i
    return urlPattern.test(url)
  }

  const validateForm = () => {
    // Clear previous messages
    setMessage({ success: null, error: null })

    // Validate avatar URL if provided
    if (profileData.avatar?.url && !isImageUrl(profileData.avatar?.url)) {
      setMessage({ success: null, error: 'Invalid avatar URL' })
      return false
    }

    // Validate banner URL if provided
    if (profileData.banner?.url && !isImageUrl(profileData.banner?.url)) {
      setMessage({ success: null, error: 'Invalid banner URL' })
      return false
    }

    return true
  }

  const handleUpdateProfile = (event) => {
    event.preventDefault()
    //reset errors and success messages
    setMessage(() => ({ success: null, error: null }))
    setFormLoading(true)
    // Validate form first
    if (!validateForm()) {
      setFormLoading(false)
      return
    }

    //if the avatar is empty remove it from the object
    const newProfile = {
      bio: profileData.bio,
    }

    if (profileData.avatar?.url) {
      newProfile.avatar = {
        url: profileData.avatar?.url,
        alt: `${profile?.name} avatar`,
      }
    }

    if (profileData.banner?.url) {
      newProfile.banner = {
        url: profileData.banner?.url,
        alt: `${profile?.name} banner`,
      }
    }
    ///clear any errors
    setMessage(() => ({ success: null, error: null }))
    updateProfile(profile?.name, newProfile)
      .then((res) => {
        const { error } = res
        if (error) {
          return setMessage((prev) => ({
            ...prev,
            error: error[0]?.message,
          }))
        }
        setMessage((prev) => ({
          ...prev,
          success: 'Profile updated successfully',
        }))

        //refetch profile for updates
        refetchProfile()
        //reset form
        event.target.reset()
      })
      .catch((error) => {
        setMessage((prev) => ({ ...prev, error: error[0]?.message }))
      })
      .finally(() => setFormLoading(false))
  }

  return (
    <>
      <motion.div className='flex flex-col lg:flex-row bg-white/50 dark:bg-slate-900 dark:text-white'>
        <motion.div className='w-full lg:w-7/12 p-4 lg:p-10 mb-24'>
          <div
            className='h-[300px] w-full bg-cover bg-center flex items-end justify-start'
            style={{
              backgroundImage: `url(${profile?.banner?.url})`,
              objectFit: 'cover',
            }}
          >
            <div className='p-4w-full lg:w-1/2 flex flex-col gap-4'>
              <img
                className='w-24 h-24 mb-3 rounded-full shadow-lg ml-4'
                src={profile?.avatar?.url}
                alt={profile?.avatar?.alt}
              />
            </div>
          </div>
          <div className='bg-white dark:bg-slate-800 p-4'>
            <h4 className='flex gap-4 items-center'>
              <span className='font-black text-xl'>{profile?.name}</span>
              <span>({profile?.email})</span>
            </h4>
            <hr className='my-4' />
            <p className='dark:text-zinc-400'>{profile?.bio}</p>
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
          <div className='absolute h-full w-full bg-black bg-opacity-70 p-10 flex flex-col justify-center'>
            <h1 className='uppercase font-black text-white mb-4 text-3xl'>
              Update Profile
            </h1>
            <Message message={message?.error} backgroundColor='bg-red-600' />
            <Message
              message={message?.success}
              backgroundColor='bg-green-600'
            />
            <form
              className='grid grid-cols-1 md:grid-cols-1 gap-6'
              onSubmit={(event) => handleUpdateProfile(event)}
              autoComplete='no-fill'
            >
              <div className='col-span-2'>
                <label className='text-white' htmlFor='bio'>
                  About Me
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 top-0 left-0 flex items-start pl-3 pt-3 pointer-events-none'>
                    <i className='fa-sharp fa-light fa-user text-white'></i>
                  </div>
                  <textarea
                    type='number'
                    id='bio'
                    autoComplete='new-bio'
                    value={profileData.bio}
                    required
                    maxLength={160}
                    onChange={(event) => {
                      setProfileData((prev) => ({
                        ...prev,
                        bio: event.target.value,
                      }))
                    }}
                    className='bg-transparent text-white border border-gray-300  text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Write something about yourself...'
                  />
                </div>
              </div>
              <div className='col-span-2'>
                <label className='text-white' htmlFor='avatar'>
                  Avatar
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-light fa-image-user text-white'></i>
                  </div>
                  <input
                    type='url'
                    autoComplete='new-date-from'
                    value={profileData.avatar?.url}
                    onChange={(event) =>
                      setProfileData((prev) => ({
                        ...prev,
                        avatar: {
                          url: event.target.value,
                        },
                      }))
                    }
                    id='avatar'
                    className='bg-transparent border border-gray-300  text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 text-white'
                    placeholder='Enter avatar url'
                  />
                </div>
              </div>
              <div className='col-span-2'>
                <label className='text-white' htmlFor='banner'>
                  Banner
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-light fa-image text-white'></i>
                  </div>
                  <input
                    type='url'
                    id='banner'
                    autoComplete='new-date-to'
                    value={profileData.banner?.url}
                    onChange={(event) =>
                      setProfileData((prev) => ({
                        ...prev,
                        banner: {
                          url: event.target.value,
                        },
                      }))
                    }
                    className='bg-transparent border border-gray-300  text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 text-white'
                    placeholder='Enter banner url'
                  />
                </div>
              </div>

              <div className='col-span-1 md:col-span-2  gap-4 flex'>
                <button className='flex gap-2 p-4 border-white border text-white items-center uppercase hover:bg-black/75'>
                  {formLoading ? <Spinner /> : null}
                  {formLoading ? (
                    <span className='text-xs'>Updating...</span>
                  ) : (
                    <span className='text-xs'>Update Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Profile
