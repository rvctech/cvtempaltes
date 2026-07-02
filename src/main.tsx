import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Google Fonts
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/raleway/400.css'
import '@fontsource/raleway/700.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/700.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/source-sans-pro/400.css'
import '@fontsource/source-sans-pro/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/fira-sans/400.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import '@fontsource/bebas-neue/400.css'
import '@fontsource/roboto-condensed/400.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)