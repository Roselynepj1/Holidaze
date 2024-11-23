import { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const Image = ({ src, alt = 'Venue image' }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className='relative w-full h-full'>
      {/* Loading animation */}
      {isLoading && (
        <motion.div
          className='absolute inset-0 bg-gray-200 dark:bg-gray-700'
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className='h-full w-full flex items-center justify-center text-gray-400'>
            <svg
              className='w-8 h-8 animate-spin'
              viewBox='0 0 24 24'
              fill='none'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
}
export default Image
