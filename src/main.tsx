import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AdminProvider } from './contexts/AdminContext'
import { AppRouter } from './components/AppRouter'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AdminProvider>
        <Toaster position="top-right" />
        <AppRouter />
      </AdminProvider>
    </ThemeProvider>
  </React.StrictMode>,
)