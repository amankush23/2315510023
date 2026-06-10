import { Box, Stack, Typography } from '@mui/material'
import { NotificationCard } from './NotificationCard.jsx'

export function NotificationList({ notifications, viewedIds, onOpenNotification, emptyMessage }) {
  if (!notifications.length) {
    return (
      <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          No notifications found
        </Typography>
        <Typography variant="body2">{emptyMessage}</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          viewed={viewedIds.has(notification.id)}
          onOpen={onOpenNotification}
        />
      ))}
    </Stack>
  )
}
