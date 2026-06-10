const typeMap = new Map([
  ['placement', 'Placement'],
  ['result', 'Result'],
  ['event', 'Event']
])

function normalizeText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function normalizeType(value) {
  const text = normalizeText(value).toLowerCase()
  return typeMap.get(text) ?? 'Event'
}

function normalizeTimestamp(value) {
  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmedValue)) {
      return Date.parse(`${trimmedValue.replace(' ', 'T')}.000Z`)
    }

    return Date.parse(trimmedValue)
  }

  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function normalizeNotification(notification = {}) {
  const rawId = notification.id ?? notification.ID ?? notification.notification_id ?? notification.notificationId ?? `${notification.title ?? notification.Title ?? notification.notification_title ?? 'notification'}-${notification.timestamp ?? notification.Timestamp ?? notification.created_at ?? notification.createdAt ?? notification.date ?? ''}`
  const timestamp = notification.timestamp ?? notification.Timestamp ?? notification.created_at ?? notification.createdAt ?? notification.date ?? null
  const timestampValue = normalizeTimestamp(timestamp)
  const resolvedTimestamp = Number.isFinite(timestampValue) ? timestampValue : 0

  return {
    id: String(rawId),
    title: normalizeText(notification.title ?? notification.Title ?? notification.notification_title ?? notification.heading ?? 'Notification'),
    message: normalizeText(notification.message ?? notification.Message ?? notification.description ?? notification.text ?? ''),
    type: normalizeType(notification.type ?? notification.Type ?? notification.notification_type ?? notification.category),
    timestamp: new Date(resolvedTimestamp).toISOString(),
    timestampValue: resolvedTimestamp,
    viewed: Boolean(notification.viewed ?? notification.is_viewed ?? notification.read ?? false)
  }
}

export function normalizeNotificationList(notifications = []) {
  return notifications.map((notification) => normalizeNotification(notification))
}

export function formatNotificationTimestamp(timestamp) {
  const value = Date.parse(timestamp)
  return Number.isFinite(value) ? new Date(value).toLocaleString() : ''
}
