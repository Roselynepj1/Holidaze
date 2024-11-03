import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const Search = ({ isOpen }) => {
  return (
    <motion.div
      initial={{ y: '-50%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      exit={{ y: '50%', opacity: 0, transition: { duration: 0.2 } }}
      className='overflow-hidden bg-gray-100 dark:bg-slate-800 p-4 shadow-md absolute w-full pl-[90px] z-10' // Optional styling
    >
      {isOpen && (
        <form>
          <input
            type='text'
            placeholder='Search...'
            className='w-full p-2 border dark:border-black rounded-md outline-none dark:bg-transparent focus:ring focus:ring-black'
          />
        </form>
      )}
    </motion.div>
  )
}

Search.propTypes = {
  isOpen: PropTypes.bool.isRequired, // `isOpen` is required as a prop
}

export default Search
