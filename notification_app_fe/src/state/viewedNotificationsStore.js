import { useEffect, useState } from 'react'

const storageKey = 'campus-notification-viewed-ids'

function readViewedIds() {
  if (typeof window === 'undefined') {
    return new Set()
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey)
    const parsedValue = storedValue ? JSON.parse(storedValue) : []
    return new Set(Array.isArray(parsedValue) ? parsedValue : [])
  } catch {
    return new Set()
  }
}

function persistViewedIds(viewedIds) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify([...viewedIds]))
}

export function useViewedNotifications() {
  const [viewedIds, setViewedIds] = useState(() => readViewedIds())

  useEffect(() => {
    persistViewedIds(viewedIds)
  }, [viewedIds])

  const markAsViewed = (notificationId) => {
    setViewedIds((currentViewedIds) => {
      if (currentViewedIds.has(notificationId)) {
        return currentViewedIds
      }

      const nextViewedIds = new Set(currentViewedIds)
      nextViewedIds.add(notificationId)
      return nextViewedIds
    })
  }

  return {
    viewedIds,
    markAsViewed,
    isViewed: (notificationId) => viewedIds.has(notificationId)
  }
}
