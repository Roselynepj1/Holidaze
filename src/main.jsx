import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { PageTitleProvider } from './context/PageTitleContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PageTitleProvider>
        <App />
      </PageTitleProvider>
    </BrowserRouter>
  </StrictMode>
)
