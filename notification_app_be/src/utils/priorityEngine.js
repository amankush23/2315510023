import { normalizeNotificationList, normalizeNotificationType } from './notificationNormalizer.js'

const weightMap = new Map([
  ['Placement', 3],
  ['Result', 2],
  ['Event', 1]
])

function getWeight(type) {
  return weightMap.get(normalizeNotificationType(type)) ?? 0
}

function compareNotifications(left, right) {
  const weightDifference = getWeight(right.type) - getWeight(left.type)

  if (weightDifference !== 0) {
    return weightDifference
  }

  const timestampDifference = right.timestampValue - left.timestampValue

  if (timestampDifference !== 0) {
    return timestampDifference
  }

  return left.id.localeCompare(right.id)
}

function paginate(sortedNotifications, page, limit) {
  const total = sortedNotifications.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit)
  const safePage = totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages)
  const startIndex = (safePage - 1) * limit
  const items = sortedNotifications.slice(startIndex, startIndex + limit)

  return {
    items,
    total,
    page: safePage,
    limit,
    totalPages
  }
}

export function getPrioritizedNotifications(notifications = [], options = {}) {
  const page = Number.isFinite(options.page) && options.page > 0 ? options.page : 1
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? options.limit : 10
  const notificationType = options.notificationType ?? ''

  const normalizedNotifications = normalizeNotificationList(notifications)

  const filteredNotifications = notificationType
    ? normalizedNotifications.filter((notification) => notification.type === notificationType)
    : normalizedNotifications

  const sortedNotifications = [...filteredNotifications].sort(compareNotifications)

  return paginate(sortedNotifications, page, limit)
}
