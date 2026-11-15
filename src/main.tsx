import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './designsystem.css'
import './index.css'
import { router } from './router'
import { InkCursor } from './components/InkCursor/InkCursor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <InkCursor />
  </StrictMode>,
)
