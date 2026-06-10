function parseTimeout(value, fallback) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const runtimeConfig = {
  backendBaseUrl: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000',
  backendApiToken: import.meta.env.VITE_BACKEND_API_TOKEN || '',
  loggingApiUrl: import.meta.env.VITE_LOGGING_API_URL || '',
  loggingApiToken: import.meta.env.VITE_LOGGING_API_TOKEN || '',
  loggingTimeoutMs: parseTimeout(import.meta.env.VITE_LOGGING_TIMEOUT_MS, 5000)
}
