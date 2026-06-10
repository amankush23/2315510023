import { Log } from 'logging_middleware'
import { environment } from '../config/environment.js'
import { fetchJson } from '../utils/httpClient.js'
import { normalizeNotificationList } from '../utils/notificationNormalizer.js'
import { getPrioritizedNotifications } from '../utils/priorityEngine.js'

async function loadNotificationFeed() {
  if (!environment.notificationApiUrl) {
    const error = new Error('NOTIFICATION_API_URL is not configured')
    error.statusCode = 500
    throw error
  }

  await Log('backend', 'info', 'service', 'Fetching notification feed from upstream API')

  const response = await fetchJson(environment.notificationApiUrl, {
    token: environment.notificationApiToken,
    timeoutMs: environment.requestTimeoutMs
  })

  const notifications = Array.isArray(response)
    ? response
    : Array.isArray(response?.notifications)
      ? response.notifications
      : Array.isArray(response?.data?.notifications)
        ? response.data.notifications
        : []

  if (!Array.isArray(notifications)) {
    const error = new Error('Notification API response did not contain a valid notifications array')
    error.statusCode = 502
    throw error
  }

  const normalizedNotifications = normalizeNotificationList(notifications)

  await Log('backend', 'info', 'service', `Loaded ${normalizedNotifications.length} notifications from upstream API`)

  return normalizedNotifications
}

export async function getAllNotifications() {
  return loadNotificationFeed()
}

export async function getPriorityNotifications(filters = {}) {
  const notifications = await loadNotificationFeed()
  const result = getPrioritizedNotifications(notifications, filters)

  await Log('backend', 'info', 'service', `Ranked ${result.total} notifications for priority delivery`)

  return result
}
