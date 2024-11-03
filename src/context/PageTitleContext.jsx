import { createContext, useState, useContext } from 'react'
import PropTypes from 'prop-types'
export const PageTitleContext = createContext()

export const PageTitleProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('Home')

  const changePageTitle = (title) => {
    setPageTitle(title)
  }

  return (
    <PageTitleContext.Provider value={{ pageTitle, changePageTitle }}>
      {children}
    </PageTitleContext.Provider>
  )
}
export const usePageTitleContext = () => {
  return useContext(PageTitleContext)
}

PageTitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
