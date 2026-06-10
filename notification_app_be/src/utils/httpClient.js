export async function fetchJson(url, options = {}) {
  const controller = new AbortController()
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : 10000
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {})
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  if (options.body !== undefined && options.body !== null) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined && options.body !== null ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    })

    const contentType = response.headers.get('content-type') || ''
    const payload = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => '')

    if (!response.ok) {
      const detail = typeof payload === 'string'
        ? payload
        : payload?.message || payload?.error || response.statusText || 'Request failed'

      const error = new Error(`Upstream request failed with status ${response.status}: ${detail}`)
      error.statusCode = response.status
      throw error
    }

    return payload
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutError = new Error('Upstream request timed out')
      timeoutError.statusCode = 504
      throw timeoutError
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
