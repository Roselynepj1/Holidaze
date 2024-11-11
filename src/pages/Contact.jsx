import { usePageTitleContext } from '../context/PageTitleContext'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import coverImage from '/cover2.jpg'
import bannerImage from '/banner4.jpg'
import Message from './../components/Message'
import Spinner from './../components/Spinner'

const Contact = () => {
  const { changePageTitle } = usePageTitleContext()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ error: null, success: null })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    ///clear any errors
    setMessage(() => ({ success: null, error: null }))
    ///send form
    setIsLoading(true)
    setTimeout(() => {
      setMessage((prev) => ({ ...prev, success: 'Message sent successfully' }))
      setIsLoading(false)
    }, 1000)
  }
  useEffect(() => {
    changePageTitle('Contact')
  }, [])
  return (
    <>
      <motion.div className='flex flex-col lg:flex-row bg-white/50 dark:bg-slate-900 dark:text-white'>
        <motion.div className='w-full lg:w-7/12 p-4 lg:p-10 mb-24'>
          <div
            className='h-[500px] w-full bg-cover bg-center flex items-end justify-start mb-10'
            style={{
              backgroundImage: `url(${coverImage})`,
              objectFit: 'cover',
            }}
          >
            <div className='p-4 bg-black w-full lg:w-1/2 flex flex-col gap-4'>
              <div className='flex items-center justify-between text-white'>
                <span className='text-xs uppercase'>Main Office:</span>
                <span>Steinkjer, Norway</span>
              </div>
              <div className='flex items-center justify-between text-white'>
                <span className='text-xs uppercase'>Address:</span>
                <span>Kalv Arnesons Gate 5, 7715</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 mb-10'>
            <h1 className='uppercase font-black'>Contact Info</h1>

            <div className='flex flex-col md:flex-row gap-10 lg:gap-0 w-full justify-between'>
              <div className='flex flex-col w-full lg:w-4/12'>
                <i className='fa-sharp fa-thin fa-phone-office fa-3x mb-6'></i>
                <span className='font-bold text-xl'>Phone Numbers</span>
                <a href='tel: 123 456 789' target='_blank' className='text-lg'>
                  +123 456 789
                </a>
                <a href='tel: 987 654 321' target='_blank' className='text-lg'>
                  +987 654 321
                </a>
              </div>
              <div className='flex flex-col w-full lg:w-4/12'>
                <i className='fa-sharp fa-thin fa-envelope-open-text fa-3x mb-6'></i>
                <span className='font-bold text-xl'>Email</span>
                <a
                  href='mailto:contact@holidaze.com'
                  target='_blank'
                  className='text-lg'
                >
                  contact@holidaze.com
                </a>
                <a
                  href='mailto:support@holidaze.com'
                  target='_blank'
                  className='text-lg'
                >
                  support@holidaze.com
                </a>
              </div>
              <div className='flex flex-col w-full lg:w-4/12'>
                <i className='fa-thin fa-map-location-dot fa-3x mb-6'></i>
                <span className='font-bold text-xl'>Location</span>
                <span className='text-lg'>
                  Kalv Arnesons Gate 5, 7715 steinkjer Norway
                </span>
              </div>
            </div>
            <hr className='bg-black h-[2px]' />
          </div>
          <div className='flex flex-col gap-4 mb-10'>
            <h1 className='uppercase font-black'>Get in touch</h1>
            <form
              className='grid grid-cols-1 md:grid-cols-2 gap-4'
              onSubmit={handleSubmit}
            >
              <div className='w-full'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-light fa-user'></i>
                  </div>
                  <input
                    type='text'
                    required
                    id='email-address-icon'
                    name='name'
                    onChange={handleChange}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Name'
                  />
                </div>
              </div>
              <div className='w-full'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <i className='fa-sharp fa-light fa-envelope'></i>
                  </div>
                  <input
                    type='email'
                    required
                    name='email'
                    onChange={handleChange}
                    id='email-address-icon'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-black focus:border-black block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Email'
                  />
                </div>
              </div>
              <div className='col-span-1 md:col-span-2'>
                <textarea
                  id='message'
                  required
                  name='message'
                  onChange={handleChange}
                  rows='4'
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Message'
                ></textarea>
              </div>
              <div className='col-span-1 md:col-span-2  gap-4 flex flex-col-reverse lg:flex-row lg:justify-between items-center'>
                <p className='w-full lg:w-1/2'>
                  We promise not to disclose your personal information to third
                  parties.
                </p>
                <button
                  disabled={isLoading ? true : ''}
                  className='flex gap-2 p-4 bg-black text-white items-center uppercase hover:bg-black/75'
                >
                  {isLoading && <Spinner />}
                  <span className='text-xs'>
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </span>
                </button>
              </div>

              <div className='col-span-2'>
                {message.success && <Message message={message.success} />}
                {message.error && (
                  <Message
                    message={message.error}
                    backgroundColor='bg-red-500'
                  />
                )}
              </div>
            </form>

            <hr className='bg-black h-[2px]' />
          </div>
          <div className='flex flex-col gap-4'>
            <h1 className='uppercase font-black'>Welcome to visit</h1>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1747.9418038026822!2d11.49415487663105!3d64.01724532737093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46729b2449c6e81b%3A0x9b85993fedc6b652!2sKalv%20Arnesons%20gate%205%2C%207715%20Steinkjer%2C%20Norway!5e0!3m2!1sen!2sug!4v1730644616126!5m2!1sen!2sug'
              width='100%'
              height='450'
              style={{ border: 0 }}
              allowFullScreen=''
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              title='Google Map'
            ></iframe>
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
                to='/about'
                className='bg-black hover:bg-black/40 text-white font-semibold py-2 px-6'
              >
                About Us
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Contact
