import { usePageTitleContext } from '../context/PageTitleContext'
import {  useEffect } from 'react'
import bannerVideo from '/banner.mp4'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
const Home = () => {
  const { changePageTitle } = usePageTitleContext()
  useEffect(() => {
    changePageTitle('Home')
  }, [])
  return (
    <motion.div>
      <video
        src={bannerVideo}
        autoPlay
        loop
        muted
        playsInline
        className='absolute min-w-full object-fill min-h-full'
      />
      <div className='absolute min-w-full min-h-full bg-black/50 flex flex-col justify-center px-8 md:px-24 gap-4'>
        <h1 className=' text-3xl md:text-5xl font-bold text-white'>
          Discover Your Perfect <br />
          Getaway with Holidaze
        </h1>
        <hr className="border border-black bg-black w-[100px] h-[5px]"/>
        <p className='text-xl text-white'>
          Book unique accommodations effortlessly and experience unforgettable
          adventures. Whether it&apos;s a cozy cabin in the mountains or a chic
          apartment by the beach, your dream vacation starts here!
        </p>
        <div className='flex gap-4'>
          <Link to='/venues' className='flex gap-2 p-4 bg-black text-white items-center uppercase'>
            <span className='text-xs'>Explore now</span>
            <i className='fa-sharp fa-solid fa-arrow-right'></i>
          </Link>
          <Link to='/contact' className='flex gap-2 p-4 border-2 border-white text-white items-center uppercase'>
            <span className='text-xs'>Contact</span>
            <i className='fa-sharp fa-solid fa-arrow-right'></i>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default Home
