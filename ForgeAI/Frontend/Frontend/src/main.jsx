import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Apply saved density preference before first paint
try {
  const stored = JSON.parse(localStorage.getItem('forgeai_user_preferences') || '{}')
  if (stored.density === 'compact' || stored.density === 'comfortable') {
    document.documentElement.classList.add(`density-${stored.density}`)
  }
} catch { /* ignore corrupt storage */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
