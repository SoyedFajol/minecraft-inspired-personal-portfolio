import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SITE_URL } from './data/profile'
import './styles/index.css'

// One index.html serves every route — point canonical at the actual path
const canon = document.querySelector('link[rel="canonical"]')
if (canon) canon.href = SITE_URL + window.location.pathname

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
