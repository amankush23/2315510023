const allowedStacks = new Set(['backend', 'frontend'])
const allowedLevels = new Set(['debug', 'info', 'warn', 'error', 'fatal'])

const loggerState = {
  endpoint: '',
  token: '',
  timeoutMs: 5000
}

function normalizeConfigValue(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeTimeout(value) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000
}

export function configureLogger(configuration = {}) {
  loggerState.endpoint = normalizeConfigValue(configuration.endpoint ?? loggerState.endpoint)
  loggerState.token = normalizeConfigValue(configuration.token ?? loggerState.token)
  loggerState.timeoutMs = normalizeTimeout(configuration.timeoutMs ?? loggerState.timeoutMs)
}

function normalizeStack(stack) {
  return allowedStacks.has(stack) ? stack : 'backend'
}

function normalizeLevel(level) {
  return allowedLevels.has(level) ? level : 'info'
}

function normalizeMessage(message) {
  if (message instanceof Error) {
    return message.stack || message.message || 'Unknown error'
  }

  if (typeof message === 'string') {
    return message
  }

  try {
    return JSON.stringify(message)
  } catch {
    return 'Unable to serialize log message'
  }
}

async function postLog(payload) {
  if (!loggerState.endpoint) {
    return { ok: false, skipped: true }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), loggerState.timeoutMs)

  try {
    const response = await fetch(loggerState.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(loggerState.token ? { Authorization: `Bearer ${loggerState.token}` } : {})
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    return {
      ok: response.ok,
      status: response.status
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Logging request failed'
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function Log(stack, level, packageName, message) {
  const payload = {
    stack: normalizeStack(stack),
    level: normalizeLevel(level),
    package: typeof packageName === 'string' && packageName.trim() ? packageName.trim() : 'shared',
    message: normalizeMessage(message)
  }

  return postLog(payload)
}
