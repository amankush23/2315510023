import { Router } from 'express'
import { fetchNotifications, fetchPriorityNotifications } from '../controllers/notificationController.js'

export const notificationRoutes = Router()

notificationRoutes.get('/notifications', fetchNotifications)
notificationRoutes.get('/priority-notifications', fetchPriorityNotifications)
