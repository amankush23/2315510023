import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { appTheme } from './theme.js'
import { configureLogger } from 'logging_middleware'
import { runtimeConfig } from './config/runtime.js'
import './styles/global.css'

configureLogger({
  endpoint: runtimeConfig.loggingApiUrl,
  token: runtimeConfig.loggingApiToken,
  timeoutMs: runtimeConfig.loggingTimeoutMs
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
)
