import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.jsx'
import { AiProvider } from './context/Aicontext.jsx'
import { AuthProvider } from './context/Auth.context.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AiProvider>
      <AuthProvider>
    <App />
      </AuthProvider>
    </AiProvider>
  </BrowserRouter>,
)
