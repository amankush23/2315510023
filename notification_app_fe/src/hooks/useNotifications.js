import { useCallback, useEffect, useState } from 'react'
import { fetchNotifications } from '../api/notificationsApi.js'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchNotifications()
      setNotifications(data)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])

  return {
    notifications,
    loading,
    error,
    reload: loadNotifications
  }
}
