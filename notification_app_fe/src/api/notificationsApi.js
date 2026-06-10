import { Log } from 'logging_middleware'
import { httpClient } from './httpClient.js'

function normalizeNotificationsResponse(responseData) {
  return Array.isArray(responseData?.notifications) ? responseData.notifications : []
}

export async function fetchNotifications() {
  await Log('frontend', 'info', 'api', 'Fetching notifications from backend')

  try {
    const { data } = await httpClient.get('/api/notifications')
    const notifications = normalizeNotificationsResponse(data)
    await Log('frontend', 'info', 'api', `Loaded ${notifications.length} notifications from backend`)
    return notifications
  } catch (error) {
    await Log('frontend', 'error', 'api', error instanceof Error ? error.message : 'Failed to fetch notifications')
    throw error
  }
}

export async function fetchPriorityNotifications(filters = {}) {
  await Log('frontend', 'info', 'api', 'Fetching priority notifications from backend')

  try {
    const { data } = await httpClient.get('/api/priority-notifications', {
      params: {
        notification_type: filters.notificationType || undefined,
        limit: filters.limit || undefined,
        page: filters.page || undefined
      }
    })

    const notifications = normalizeNotificationsResponse(data)
    const pagination = data?.pagination || { page: 1, limit: notifications.length, total: notifications.length, totalPages: 1 }
    await Log('frontend', 'info', 'api', `Loaded ${notifications.length} priority notifications from backend`)
    return { notifications, pagination }
  } catch (error) {
    await Log('frontend', 'error', 'api', error instanceof Error ? error.message : 'Failed to fetch priority notifications')
    throw error
  }
}
