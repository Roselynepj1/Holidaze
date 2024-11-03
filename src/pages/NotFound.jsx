import { usePageTitleContext } from '../context/PageTitleContext'
import { useState, useEffect } from 'react'

const NotFound = () => {
  const { changePageTitle } = usePageTitleContext()
  useEffect(() => {
    changePageTitle('Not Found')
  }, [])
  return <p>NotFound</p>
}

export default NotFound
