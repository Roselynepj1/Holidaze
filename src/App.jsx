import { motion } from 'framer-motion'
import NavBar from './layouts/NavBar'
import Content from './layouts/Content'
import RightBar from './layouts/RightBar'
import SideBar from './layouts/SideBar'
import React, { useState, useEffect } from 'react'
import Search from './layouts/Search'

function App() {
  const [openState, setOpenState] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [pageTitle, setPageTitle] = useState('Home');
  const handleChangeOpenSearch = () => {
    setOpenSearch(!openSearch)
  }
  const handleChangeOpenState = (state) => {
    setOpenState(state)
  }

  const handleChangePageTitle = (title) => {  
    setPageTitle(title)
  }

  
  return (
    <div className='transition-fade'>
      <motion.div
        initial='initial'
        animate='in'
        exit='out'
        className='antialiased dark:bg-black dark:text-white/50 lg:p-4 h-screen bg-slate-300 overflow-hidden'
      >
        <div
          className='flex flex-col h-full lg:rounded-lg overflow-hidden shadow z-10 dark:shadow-blue-900'
          id='app'
        >
          <NavBar
            openState={openState}
            handleChangeOpenState={handleChangeOpenState}
            handleChangeOpenSearch={handleChangeOpenSearch}
          />
          <div className='flex h-full relative bg-white' id='content'>
            {openSearch && <Search isOpen={openSearch} />}
            <SideBar pageTitle={pageTitle}/>
            <Content  />
            <RightBar openState={openState} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default App
