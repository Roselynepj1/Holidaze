import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect } from 'react'

const Venue = () => {
  const { changePageTitle } = usePageTitleContext()
  useEffect(() => {
    changePageTitle('Venues')
  }, [])
  return <p>Venue</p>
}

export default Venue
