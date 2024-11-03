import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import bannerImage from '/faq-1.jpg'

const Faq = () => {
  const { changePageTitle } = usePageTitleContext()

  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'What sets Holidaze apart from the rest?',
      answer:
        'Personalized guest service is and always has been the focal point of our company. When you travel with us, you’ll experience the best care in the travel business. This tradition of excellence dates back to our founding in 2020. Add in our professional relationships with quality hotels, restaurants, attractions and other suppliers, you are assured a carefree and memorable vacation.',
    },
    {
      question: 'What can I expect when I call the toll free number?',
      answer:
        'When calling our office during normal business hours, you can expect to talk to our friendly and professional hotel Consultants. They will happily assist you in a welcoming and informative environment. Whether you simply have a question, would like to request information or are ready to book a hotel, you will not be prompted by a series of recordings and will receive live one-on-one assistance.',
    },
    {
      question: 'When should I make my reservation?',
      answer:
        'We recommend that you make your reservation well in advance of the final payment date, as most departures fill quickly. A low deposit of $200 per person confirms your hotel reservation and is fully refundable prior to the final payment date. A friendly and knowledgeable hotel Consultant is happy to take your reservation by phone and answer any questions, allowing you the satisfaction of booking your vacation with confidence and ease.',
    },
    {
      question:
        'When will I receive my hotel documents? What information will they include?',
      answer:
        'Your hotel documents will be mailed approximately two weeks to ten days prior to the hotel’s departure date. Included within your nylon document holder will be flight departure & return information, TSA information to reference when packing, luggage tags, the daily hotel itinerary, hotel list which can be given to friends/family, name badges with lanyards and a confidential emergency contact form which will be collected by your hotel Director at the start of your vacation.',
    },
    {
      question: 'What happens if I cancel my reservation?',
      answer:
        'Should the need arise to cancel your confirmed reservation, a simple phone call to Holidaze will ensure that your reservation is released. Remember, your low $200 deposit is fully refundable prior to the final payment date. To avoid penalties after final payment, we encourage all guests to consider our Travel Protection Plan.',
    },
    {
      question: 'What is the travel protection plan?',
      answer:"A key piece that is often overlooked when making the decision to purchase travel insurance is if something happens to an immediate family member that prevents you from traveling. I work with guests that encounter the unexpected on a regular basis. Oftentimes these situations involve a medical issue or having to cancel or leave a hotel because something happens to a family member. I often hear: “I’m in excellent health and didn’t buy the insurance, but had to cancel because of a family member.” Frequently these circumstances would be covered by travel insurance. Although it is optional, Holidaze strongly recommends guests take advantage of our Travel Protection Plan. The plan offers accident and sickness coverage, baggage protection, trip interruption and cancellation insurance. Your vacation is an important investment. We encourage you to protect it."
    },
  ]

  useEffect(() => {
    changePageTitle('FAQ')
  }, [])
  return (
    <>
      <motion.div className='flex flex-col lg:flex-row bg-white/50 dark:bg-slate-900 dark:text-white'>
        <motion.div className='w-full lg:w-7/12 p-4 lg:p-10 mb-24'>
          <div className='max-w-3xl mx-auto p-6'>
            <h2 className='text-2xl font-bold mb-8'>
              Frequently Asked Questions
            </h2>

            <div className='space-y-4'>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className='border border-gray-200 overflow-hidden'
                >
                  <button
                    className='w-full p-4 text-left bg-white dark:bg-slate-900 dark:text-white hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center'
                    onClick={() =>
                      setOpenIndex(openIndex === index ? -1 : index)
                    }
                  >
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {faq.question}
                    </span>

                    <i
                      className={`fa-sharp fa-solid fa-chevron-down transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    ></i>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      openIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className='p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-200'>
                      <p className='text-gray-600 dark:text-white'>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <h2 className='text-4xl font-bold mb-4'>FAQ</h2>
              <div className='text-gray-300 mb-6'>
                <hr className='bg-black border-black h-[5px] w-1/2 mb-3' />
                <p>
                  Here, we have compiled a list of commonly asked questions to
                  help make planning your next vacation as smooth and
                  stress-free as possible.
                </p>
              </div>
              <Link
                to='/contact'
                className='bg-black hover:bg-black/40 text-white font-semibold py-2 px-6'
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Faq
