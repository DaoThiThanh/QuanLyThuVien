import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UngDung from './UngDung.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UngDung />
  </StrictMode>,
)
