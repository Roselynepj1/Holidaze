import { usePageTitleContext } from "../context/PageTitleContext";
import  { useEffect,useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion'
import coverImage from '/about-3.jpg'
import bannerImage from '/about-1.jpg'

const About = () => {
    const { changePageTitle } = usePageTitleContext()
      const stats = [
        { value: '10', label: 'YEARS EXPERIENCE' },
        { value: '20', label: 'OFFICE LOCATIONS' },
        { value: '114', label: 'HAPPY CUSTOMERS' },
        { value: '20', label: 'HONORS AND AWARDS' },
      ]
    useEffect(() => {
        changePageTitle('About')
    }, []);
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
                <span className='text-xs uppercase'>Country:</span>
                <span>Norway</span>
              </div>
              <div className='flex items-center justify-between text-white'>
                <span className='text-xs uppercase'>City:</span>
                <span>Steinkjer</span>
              </div>
              <div className='flex items-center justify-between text-white'>
                <span className='text-xs uppercase'>Founded:</span>
                <span>May, 2020</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 mb-10'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='w-full md:w-4/12'>
                <h4 className='font-black text-xl'>
                  We are Holidaze <br /> Your journey, our passion.
                </h4>
              </div>
              <div className='w-full md:w-8/12'>
                <p className='mb-3'>
                  At Holidaze, we believe that every adventure should be as
                  unique as the traveler. We intentionally eschew a
                  one-size-fits-all approach, which is why each of our travel
                  experiences feels distinct and personal. Every journey we
                  curate is a reflection of your desires, interests, and values,
                  crafted through thoughtful conversations and insights gathered
                  from you.
                </p>
                <p>
                  In our agency, every itinerary is an open-ended exploration,
                  inviting you to challenge the ordinary and embrace the
                  extraordinary. We provide personalized guidance and expert
                  knowledge across all aspects of your travel journey—from
                  inspiration and planning to execution and discovery. Our goal
                  is to create memorable experiences that resonate with your
                  spirit and leave lasting impressions.
                </p>
              </div>
            </div>

            <div className=' p-6'>
              <blockquote className='relative bg-white dark:bg-slate-800  p-8 rounded-lg shadow-lg backdrop-blur-lg'>
                <div className='relative z-10'>
                  <div className='text-gray-800 dark:text-white text-lg font-serif italic leading-relaxed'>
                    Embrace the spirit of Holidaze, where every getaway is a
                    journey toward joy, connection, and unforgettable memories.
                    Let the adventure begin!
                  </div>
                </div>
                {/* Large decorative quote marks */}
                <div className='absolute top-2 left-4 text-black bg-opacity-90 text-6xl font-serif'>
                  &ldquo;
                </div>
                <div className='absolute bottom-2 right-4 text-black bg-opacity-90 text-6xl font-serif rotate-180'>
                  &rdquo;
                </div>
              </blockquote>
            </div>

            <hr className='bg-black h-[2px]' />

            <div className='w-full py-12 px-4'>
              <div className='max-w-6xl mx-auto'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
                  {stats.map((stat, index) => (
                    <div key={index} className='p-4'>
                      <div className='text-4xl font-bold text-gray-800 dark:text-zinc-300 mb-2'>
                        {stat.value}
                      </div>
                      <div className='text-xs tracking-wider text-gray-600 font-medium'>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr className='bg-black h-[2px]' />

            <TestimonialSlider />
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
              <h2 className='text-4xl font-bold mb-4'>About Us</h2>
              <div className='text-gray-300 mb-6'>
                <hr className='bg-black border-black h-[5px] w-1/2 mb-3' />
                <p className='dark:text-white'>
                  Holidaze was founded with a simple mission: to make travel
                  personal, effortless, and extraordinary. From hidden gems to
                  popular destinations, our team curates every detail so you can
                  focus on making memories. Join us and discover how Holidaze
                  can transform your next adventure.
                </p>
              </div>
              <Link
                to='/contact'
                className='bg-black hover:bg-black/40 text-white font-semibold py-2 px-6'
              >
                Get in touch
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
} 

const TestimonialSlider = ()=> {
  const testimonials = [
    {
      name: 'Paul Trueman',
      role: 'Accountant',
      image: 'https://avatar.iran.liara.run/public/boy',
      text: 'As a frequent traveler, I appreciate a platform that is both intuitive and efficient. Holidaze exceeded my expectations with its extensive listings and easy filtering options. I was able to book a stunning beachfront property that suited all my needs. Highly recommended!',
    },
    {
      name: 'Emma Newman',
      role: 'Software Engineer',
      image: 'https://avatar.iran.liara.run/public/girl',
      text: 'Holidaze made planning our family vacation a breeze! The website is so user-friendly, and we found the perfect accommodation in no time. From booking to check-in, everything was seamless. We can’t wait to use Holidaze again for our next adventure!',
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  return (
    <div className=' px-4 py-12'>
      <h2 className='text-2xl font-bold mb-8'>Testimonials</h2>

      <div className='relative'>
        <div className='overflow-hidden'>
          <div
            className='flex transition-transform duration-300 ease-in-out'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className='w-full flex-shrink-0 px-4'>
                <div className='grid md:grid-cols-1 gap-8'>
                  {/* Left testimonial */}
                  <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm'>
                    <div className='flex items-center gap-4 mb-4'>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className='w-16 h-16 rounded-full'
                      />
                      <div>
                        <h3 className='font-semibold text-lg dark:text-zinc-300'>
                          {testimonial.name}
                        </h3>
                        <p className='text-gray-600 text-sm dark:text-zinc-300'>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className='text-gray-700 mb-4 leading-relaxed dark:text-zinc-300'>
                      {testimonial.text}
                    </p>
                    <div className='flex gap-1'>
                      {[...Array(5)].map((_, i) => ( 
                        <i className="fa-sharp fa-regular fa-star" key={i}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        <div className='flex justify-center gap-2 mt-6'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className='absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg p-2 rounded-full hover:bg-gray-50'
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className='absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg p-2 rounded-full hover:bg-gray-50'
        >
          →
        </button>
      </div>
    </div>
  )
}
export default About
