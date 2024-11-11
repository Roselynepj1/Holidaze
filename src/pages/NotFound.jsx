import { usePageTitleContext } from '../context/PageTitleContext'
import { useEffect } from 'react'

const NotFound = () => {
  const { changePageTitle } = usePageTitleContext()
  useEffect(() => {
    changePageTitle('Not Found')
  }, [])
  return (
    <div className='min-h-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4'>
      <div className='text-center space-y-6'>
        {/* Icon Container */}
        <div className='mb-8'>
          <div className='inline-block p-6 bg-black/50 rounded-full'>
            <i className='fa-sharp fa-regular fa-lightbulb-slash fa-2x text-white'></i>
          </div>
        </div>

        {/* Error Code */}
        <h1 className='text-7xl font-bold text-black dark:text-white'>404</h1>

        {/* Error Message */}
        <div className='space-y-2'>
          <p className='text-xl text-gray-600'>Looks like you&apos;re lost!</p>
          <p className='text-gray-500'>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Back Button */}
        <div className='mt-8'>
          <button
            onClick={() => window.history.back()}
            className='px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors duration-200'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
