import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const RightBar = ({ openState }) => {
  return (
    <motion.aside
      id='rightBar'
      initial={{ x: '100%', opacity: 0 }} // Start off-screen to the right with 0 opacity
      animate={{ x: openState ? '0%' : '100%', opacity: openState ? 1 : 0 }} // Slide in if open, slide out if closed
      transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Customize animation behavior
      className={`absolute right-0 h-screen thin-scrollbar dark:text-white dark:bg-slate-950 ${
        !openState ? 'w-0' : 'w-full md:w-[350px]'
      } bg-white p-8 overflow-y-scroll`}
    >
      <div className='flex flex-col gap-4'>
        <Item title='Country' description='Norway' />
        <Item title='City' description='Kalv Arnesons Gate 5' />
        <Item title='Street' description='7715 steinkjer' />
        <Item title='Email' description='contact@holidaze.com' />
        <Item title='Phone' description='+47 123 45 67' />
        <hr />
      </div>
      <div className='flex flex-col gap-4 mt-8'>
        <h4 className='uppercase font-bold text-xs'>We are on your socials</h4>
        <div className='flex gap-4'>
          <SocialLink icon='fa-x-twitter' url='https://www.twitter.com/' />
          <SocialLink icon='fa-facebook' url='https://www.facebook.com/' />
          <SocialLink icon='fa-instagram' url='https://www.instagram.com/' />
        </div>
        <hr />
        <div>Designed By: Roselyne P Johansen</div>
      </div>
    </motion.aside>
  )
}

const Item = ({ title, description }) => {
  return (
    <div className='flex justify-between gap-8 items-center'>
      <h1 className='uppercase text-xs'>{title}</h1>
      <span>{description}</span>
    </div>
  )
}

const SocialLink = ({ icon, url }) => {
  return (
    <a
      href={url}
      target='_blank'
      className='rounded-full border-2 border-black inline-flex items-center justify-center w-[24px] h-[24px] p-5 hover:bg-black'
    >
      <i
        className={`fa-brands ${icon} text-2xl text-black dark:text-white hover:text-white`}
      ></i>
    </a>
  )
}

RightBar.propTypes = {
  openState: PropTypes.bool.isRequired,
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

SocialLink.propTypes = {
  icon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default RightBar
