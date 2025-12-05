import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RouterProvider } from 'react-router'
import router from '@/app/router'
import { AppProviders } from '@/app/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppProviders>
        <RouterProvider router={router}></RouterProvider>
      </AppProviders>
    </ThemeProvider>
  </StrictMode>,
)
