import dotenv from 'dotenv'

dotenv.config()

function parsePort(value, fallback) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseTimeout(value, fallback) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const environment = {
  port: parsePort(process.env.PORT, 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  notificationApiUrl: process.env.NOTIFICATION_API_URL || '',
  notificationApiToken: process.env.NOTIFICATION_API_TOKEN || '',
  loggingApiUrl: process.env.LOGGING_API_URL || '',
  loggingApiToken: process.env.LOGGING_API_TOKEN || '',
  requestTimeoutMs: parseTimeout(process.env.REQUEST_TIMEOUT_MS, 10000)
}
