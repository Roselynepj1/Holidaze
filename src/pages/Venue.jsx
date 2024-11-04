import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {getVenues} from '../utilities/api'
const Venue = () => {
  const { changePageTitle } = usePageTitleContext()
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const placeholder =
    'https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg'

  useEffect(() => {
    changePageTitle('Venues')

    const fetchVenues = async () => {
      try {
        const result = await getVenues();
        setVenues(result.data);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      }
    }

    fetchVenues();

  }, [])
  return (
    <motion.div className='p-6 bg-white/50 dark:bg-slate-950 h-full mb-16'>
      <h1 className='font-black text-3xl'>Available Venues</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        
        {venues.map((venue) => (
          <motion.div
          key = {venue.id}
            className='group relative w-full h-full'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }} // Slight scaling effect on hover
          >
            {/* Top div - Venue Price */}
            <motion.div className='absolute top-0 left-0 bg-black/90 text-white p-4 flex justify-between opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform -translate-y-4'>
              <span className='text-xs'>NOK: {venue.price}</span>
            </motion.div>

            {/* Image */}
            <img src={venue.media.length?venue?.media[0]?.url: placeholder} className='w-full h-full object-cover' />

            {/* Bottom div - Venue Name and Link */}
            <motion.div className='absolute bottom-0 w-full bg-black/90 text-white p-4 flex justify-between opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform translate-y-4'>
              <span>{venue.name}</span>
              <Link className='rounded-full w-[24px] h-[24px] flex items-center justify-center bg-white text-black hover:bg-black hover:text-white'>
                <i className='fa-sharp fa-solid fa-arrow-right'></i>
              </Link>
            </motion.div>
          </motion.div>
        ))}
        
      </div>
    </motion.div>
  )
}

export default Venue
