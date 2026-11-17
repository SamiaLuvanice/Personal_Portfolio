import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Fontes depois do load: o texto aparece com a fonte do sistema e troca (font-display: swap).
// Se o chunk falhar (ex.: aba antiga após um deploy), fica a fonte do sistema, que é o fallback aceito.
const loadFonts = () => void import('./fonts').catch(() => {})
if (document.readyState === 'complete') loadFonts()
else window.addEventListener('load', loadFonts, { once: true })
