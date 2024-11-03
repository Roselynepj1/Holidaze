import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Faq from '../pages/FAQ' 
import Venue from '../pages/Venue'
import NotFound from '../pages/NotFound'
const Content = ( ) => {
  return (
    <div
      id='contentArea'
      className='h-full w-full  overflow-y-scroll thin-scrollbar pb-4 bg-slate-300 dark:bg-slate-900'
    >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/venues' element={<Venue />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

 
export default Content
