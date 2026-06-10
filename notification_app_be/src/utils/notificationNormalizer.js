import { createHash } from 'node:crypto'

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

function normalizeTimestampInput(value) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmedValue)) {
    return `${trimmedValue.replace(' ', 'T')}.000Z`
  }

  return trimmedValue
}

function normalizeTimestampValue(value) {
  const parsed = Date.parse(normalizeTimestampInput(value))
  return Number.isFinite(parsed) ? parsed : 0
}

function buildStableId(notification) {
  const source = {
    title: notification.title ?? notification.notification_title ?? notification.heading ?? notification.Title ?? '',
    message: notification.message ?? notification.description ?? notification.text ?? notification.Message ?? '',
    type: normalizeType(notification.notification_type ?? notification.type ?? notification.category ?? notification.Type),
    timestamp: notification.timestamp ?? notification.created_at ?? notification.createdAt ?? notification.date ?? notification.Timestamp ?? ''
  }

  return createHash('sha1').update(JSON.stringify(source)).digest('hex')
}

export function normalizeNotification(notification = {}) {
  const id = notification.id ?? notification.ID ?? notification.notification_id ?? notification.notificationId ?? buildStableId(notification)
  const title = normalizeText(notification.title ?? notification.Title ?? notification.notification_title ?? notification.heading ?? 'Notification')
  const message = normalizeText(notification.message ?? notification.Message ?? notification.description ?? notification.text ?? '')
  const type = normalizeType(notification.type ?? notification.Type ?? notification.notification_type ?? notification.category)
  const timestamp = notification.timestamp ?? notification.Timestamp ?? notification.created_at ?? notification.createdAt ?? notification.date ?? null
  const timestampValue = normalizeTimestampValue(timestamp)
  const viewed = Boolean(notification.viewed ?? notification.is_viewed ?? notification.read ?? false)
  const resolvedTimestamp = Number.isFinite(timestampValue) ? timestampValue : 0

  return {
    id: String(id),
    title,
    message,
    type,
    timestamp: new Date(resolvedTimestamp).toISOString(),
    timestampValue: resolvedTimestamp,
    viewed
  }
}

export function normalizeNotificationList(notifications = []) {
  return notifications.map((notification) => normalizeNotification(notification))
}

export function normalizeNotificationType(value) {
  return normalizeType(value)
}
