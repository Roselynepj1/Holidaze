import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { getVenues, searchVenues } from '../utilities/api'
import PropTypes from 'prop-types'
import Image from '../components/Image'
const Venue = ({ contentAreaRef }) => {
  const { changePageTitle } = usePageTitleContext()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadMore, setLoadMore] = useState(false)
  const isLoadingRef = useRef(false)
  const [searchParam] = useSearchParams()
  const searchQuery = searchParam.get('q')

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const placeholder =
    'https://cdn.pixabay.com/photo/2020/07/20/21/49/moist-5424448_960_720.jpg'

  const getVenuesOnLoad = async () => {
    try {
      const result = searchQuery
        ? await searchVenues(searchQuery)
        : await getVenues()
      if (searchQuery) setVenues(result.data)
      else setVenues((prevVenues) => [...prevVenues, ...result.data])
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreVenues = async (page) => {
    setLoadMore(true)
    try {
      const result = searchQuery
        ? await searchVenues(searchQuery, page)
        : await getVenues(page)
      if (searchQuery && page === 1) setVenues(result.data)
      else setVenues((prevVenues) => [...prevVenues, ...result.data])
      setHasMore(result.data.length > 0)
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    } finally {
      setLoadMore(false)
    }
  }

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    const contentArea = contentAreaRef.current
    if (!contentArea || isLoadingRef.current || !hasMore) return

    const scrollPosition = contentArea.scrollTop + contentArea.clientHeight
    const scrollThreshold = contentArea.scrollHeight - 1000

    if (scrollPosition >= scrollThreshold) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [hasMore, contentAreaRef])

  useEffect(() => {
    changePageTitle('Venues')
    if (page === 1) {
      getVenuesOnLoad()
    } else {
      loadMoreVenues(page)
    }
  }, [page, changePageTitle, searchQuery])

  // Debounced scroll listener
  useEffect(() => {
    const contentArea = contentAreaRef.current
    if (!contentArea) return

    const debouncedScroll = debounce(handleScroll, 150) // Add debounce
    contentArea.addEventListener('scroll', debouncedScroll)

    return () => {
      contentArea.removeEventListener('scroll', debouncedScroll)
    }
  }, [handleScroll, contentAreaRef])

  if (loading) {
    return (
      <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        {skeletons.map((skeleton) => (
          <VenueSkeleton key={skeleton} />
        ))}
      </div>
    )
  }
  return (
    <>
      {venues.length === 0 && !loading ? (
        <NotFound />
      ) : (
        <motion.div className='p-6 bg-white/50 dark:bg-slate-950 min-h-full pb-32'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {venues.map((venue) => (
              <Link to={`/venues/${venue.id}`} key={venue.id}>
                <motion.div
                  className='group relative w-full h-full'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05 }} // Slight scaling effect on hover
                >
                  {/* Top div - Venue Price */}
                  <motion.div className='absolute top-0 left-0 bg-black/90 text-white p-4 flex justify-between opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform -translate-y-4'>
                    <span className='text-xs'>
                      NOK: {venue.price.toLocaleString()}
                    </span>
                  </motion.div>

                  {/* Image */} 
                  <Image
                    src={
                      venue.media.length ? venue?.media[0]?.url : placeholder
                    }
                    
                  />

                  {/* Bottom div - Venue Name and Link */}
                  <motion.div className='absolute bottom-0 w-full bg-black/90 text-white p-4 flex justify-between opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform translate-y-4'>
                    <span>{venue.name}</span>
                    <Link
                      to={`/venues/${venue?.id}`}
                      className='rounded-full w-[24px] h-[24px] flex items-center justify-center bg-white text-black hover:bg-black hover:text-white'
                    >
                      <i className='fa-sharp fa-solid fa-arrow-right'></i>
                    </Link>
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>

          {loadMore && <Spinner />}
        </motion.div>
      )}
    </>
  )
}

const VenueSkeleton = () => {
  return (
    <motion.div>
      <div
        role='status'
        className='flex items-center justify-center h-56   bg-gray-500   animate-pulse dark:bg-gray-700'
      >
        <i className='fa-thin fa-image'></i>
        <span className='sr-only'>Loading...</span>
      </div>
    </motion.div>
  )
}

const Spinner = () => {
  return (
    <div className='text-center mt-12'>
      <div role='status'>
        <svg
          aria-hidden='true'
          className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black'
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
    </div>
  )
}

// Debounce utility function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const NotFound = () => {
  return (
    <div className='min-h-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4'>
      <div className='text-center space-y-6'>
        {/* Icon Container */}
        <div className='mb-8'>
          <div className='inline-block p-6 bg-black/50 rounded-full'>
            <i className='fa-sharp fa-regular fa-building-magnifying-glass fa-2x text-white'></i>
          </div>
        </div>

        {/* Error Code */}
        <h1 className='text-7xl font-bold text-black dark:text-white'>404</h1>

        {/* Error Message */}
        <div className='space-y-2'>
          <p className='text-xl text-gray-600'>Looks like the record is not found.</p>
          <p className='text-gray-500'>
            The venue you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
        </div>
      </div>
    </div>
  )
}
Venue.propTypes = {
  contentAreaRef: PropTypes.any,
}
export default Venue
