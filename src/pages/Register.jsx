import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import bannerImage from '/banner4.jpg'
import { login, registerUser } from '../utilities/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Spinner from '../components/Spinner'
const schema = yup
  .object({
    name: yup.string().trim().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email')
      .trim()
      .required('Email is required'),
    password: yup.string().trim().required('Password is required'),
    confirmPassword: yup
      .string()
      .trim()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    venueManager: yup.boolean().required('Venue Manager must be specified'),
  })
  .required()

const Register = () => {
  const { changePageTitle } = usePageTitleContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(null)
  const [loginUser, setLoginUser] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    // Simulate API call
    registerUser(data)
      .then((res) => {
        setError(null)
        //reset form data

        if (res.error) {
          setError(res.error[0].message)
          return
        }

        reset()
        setLoginUser(true)
        login(data.email, data.password)
          .then(() => {
            //go to home page
            window.location.href = '/'
          })
          .catch((error) => {
            setError(error[0].message)
          })
          .finally(() => setLoginUser(false))
        setSuccess('Account created successfully, please login')

        //sign user after successful registration
      })
      .catch((error) => setError(error[0].message))
      .finally(() => setIsLoading(false))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  useEffect(() => {
    changePageTitle('Login')
  }, [])
  return (
    <>
      <motion.div className='flex flex-col lg:flex-row bg-white/50 dark:bg-slate-900 dark:text-white'>
        <motion.div className='w-full lg:w-7/12 p-4 lg:p-10 mb-24'>
          <div className='w-full   space-y-8 bg-white dark:bg-slate-950 p-8 shadow-lg border border-gray-100 dark:border-slate-700 dark:text-white'>
            {/* Header */}
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Don&apos;t Have an Account?
              </h2>
              <p className='mt-2 text-sm text-gray-600 dark:text-white'>
                Sign up with your details below
              </p>
              {error && (
                <p className='mt-2 text-sm text-white bg-red-600 p-2'>
                  {error}
                </p>
              )}
            </div>
            {success && (
              <div className='flex flex-column'>
                <p className='mt-2 text-sm text-white bg-black p-2'>
                  {success}
                </p>
                {loginUser && (
                  <div className='flex gap-4'>
                    <Spinner />
                    <span>Logging you in</span>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-6'>
              <div className='space-y-4'>
                {/* Name */}
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1 dark:text-white'
                    htmlFor='name'
                  >
                    Username
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <i className='fa-sharp fa-thin fa-user'></i>
                    </div>
                    <input
                      id='name'
                      {...register('name')}
                      className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-black focus:border-black focus:outline-none  dark:bg-transparent'
                      placeholder='username'
                    />
                  </div>
                  <small className='text-red-600'>{errors.name?.message}</small>
                </div>
                {/* Email */}
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1 dark:text-white'
                    htmlFor='email'
                  >
                    Email address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <i className='fa-sharp fa-thin fa-envelope-open-text'></i>
                    </div>
                    <input
                      id='email'
                      {...register('email')}
                      className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-black focus:border-black focus:outline-none  dark:bg-transparent'
                      placeholder='name@company.com'
                    />
                  </div>
                  <small className='text-red-600'>
                    {errors.email?.message}
                  </small>
                </div>

                {/* Password */}
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1 dark:text-white'
                    htmlFor='password'
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <i className='fa-sharp fa-thin fa-lock'></i>
                    </div>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-black focus:border-black focus:outline-none  dark:bg-transparent'
                      placeholder='••••••••'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <i className='fa-sharp fa-thin fa-eye-slash'></i>
                      ) : (
                        <i className='fa-sharp fa-thin fa-eye'></i>
                      )}
                    </button>
                  </div>
                  <small className='text-red-600'>
                    {errors.password?.message}
                  </small>
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1 dark:text-white'
                    htmlFor='password'
                  >
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <i className='fa-sharp fa-thin fa-lock'></i>
                    </div>
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-black focus:border-black focus:outline-none  dark:bg-transparent'
                      placeholder='••••••••'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <i className='fa-sharp fa-thin fa-eye-slash'></i>
                      ) : (
                        <i className='fa-sharp fa-thin fa-eye'></i>
                      )}
                    </button>
                  </div>
                  <small className='text-red-600'>
                    {errors.confirmPassword?.message}
                  </small>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='venueManager'
                    {...register('venueManager')}
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 border-gray-300 focus:ring-black'
                  />
                  <label
                    htmlFor='venueManager'
                    className='ml-2 block text-sm text-gray-700 dark:text-white'
                  >
                    Sign up as a Venue Manager
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex gap-2 justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <div role='status'>
                    <svg
                      aria-hidden='true'
                      className='inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-black'
                      viewBox='0 0 100 101'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                        fill='currentColor'
                      />
                      <path
                        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                        fill='currentFill'
                      />
                    </svg>
                    <span className='sr-only'>Loading...</span>
                  </div>
                ) : null}
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>

              {/* Sign up link */}
              <Link
                to='/login'
                className='text-center text-sm flex gap-4 justify-center'
              >
                <span className='text-gray-600 dark:text-white'>
                  Already have an account?
                </span>
                <span className='text-gray-600 hover:text-black dark:hover:text-zinc-400 font-medium'>
                  Sign in now
                </span>
              </Link>
            </form>
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

export default Register
