import { StrictMode } from 'react'
   import { Capacitor } from '@capacitor/core'

   if (Capacitor.isNativePlatform()) {
     const API_BASE = 'https://scamshield-backendd.onrender.com'
     const originalFetch = window.fetch.bind(window)
     window.fetch = (input, init) =>
       typeof input === 'string' && input.startsWith('/api')
         ? originalFetch(API_BASE + input, init)
         : originalFetch(input, init)
   }
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
