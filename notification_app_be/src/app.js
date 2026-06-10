import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { environment } from './config/environment.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { notificationRoutes } from './routes/notificationRoutes.js'
import { configureLogger } from 'logging_middleware'

function isAllowedOrigin(origin) {
  if (!origin) {
    return true
  }

  if (origin === environment.frontendOrigin) {
    return true
  }

  try {
    const parsedOrigin = new URL(origin)
    return (parsedOrigin.hostname === 'localhost' || parsedOrigin.hostname === '127.0.0.1') && parsedOrigin.protocol === 'http:'
  } catch {
    return false
  }
}

configureLogger({
  endpoint: environment.loggingApiUrl,
  token: environment.loggingApiToken,
  timeoutMs: environment.requestTimeoutMs
})

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    }
  }))
  app.use(express.json({ limit: '1mb' }))

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use('/api', notificationRoutes)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
