import { Log } from 'logging_middleware'
import { getAllNotifications, getPriorityNotifications } from '../services/notificationService.js'

const allowedTypes = new Set(['Placement', 'Result', 'Event'])

function toInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function validateType(value) {
  if (!value) {
    return ''
  }

  const normalized = String(value).trim()

  if (!allowedTypes.has(normalized)) {
    const error = new Error('notification_type must be Placement, Result, or Event')
    error.statusCode = 400
    throw error
  }

  return normalized
}

export async function fetchNotifications(req, res, next) {
  try {
    await Log('backend', 'info', 'controller', 'GET /api/notifications received')
    const notifications = await getAllNotifications()
    await Log('backend', 'info', 'controller', `Returning ${notifications.length} notifications`)
    res.status(200).json({ notifications })
  } catch (error) {
    next(error)
  }
}

export async function fetchPriorityNotifications(req, res, next) {
  try {
    await Log('backend', 'info', 'controller', 'GET /api/priority-notifications received')

    const filters = {
      notificationType: validateType(req.query.notification_type),
      limit: toInteger(req.query.limit, 10),
      page: toInteger(req.query.page, 1)
    }

    const result = await getPriorityNotifications(filters)

    await Log('backend', 'info', 'controller', `Returning ${result.items.length} priority notifications`)

    res.status(200).json({
      notifications: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    next(error)
  }
}
