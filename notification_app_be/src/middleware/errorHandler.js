import { Log } from 'logging_middleware'

export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' })
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500
  const message = error instanceof Error ? error.message : 'Unexpected server error'

  void Log('backend', statusCode >= 500 ? 'fatal' : 'error', 'middleware', message)

  res.status(statusCode).json({
    message: statusCode >= 500 ? 'Internal server error' : message
  })
}
