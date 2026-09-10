import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initTracking } from './tracking.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Anonymous visit/session notifications — no-op while PREVIEW_MODE is true.
// See src/tracking.js and src/config.js.
initTracking()
