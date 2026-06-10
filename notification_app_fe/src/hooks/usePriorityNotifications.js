import { useCallback, useEffect, useState } from 'react'
import { fetchPriorityNotifications } from '../api/notificationsApi.js'

export function usePriorityNotifications(filters) {
  const [notifications, setNotifications] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPriorityNotifications = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchPriorityNotifications(filters)
      setNotifications(response.notifications)
      setPagination(response.pagination)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load priority notifications')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void loadPriorityNotifications()
  }, [loadPriorityNotifications])

  return {
    notifications,
    pagination,
    loading,
    error,
    reload: loadPriorityNotifications
  }
}
