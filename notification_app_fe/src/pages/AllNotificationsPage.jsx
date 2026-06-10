import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { useNotifications } from '../hooks/useNotifications.js'
import { useViewedNotifications } from '../state/viewedNotificationsStore.js'
import { NotificationList } from '../components/NotificationList.jsx'

export function AllNotificationsPage() {
  const { notifications, loading, error, reload } = useNotifications()
  const { viewedIds, markAsViewed } = useViewedNotifications()

  const handleOpenNotification = (notificationId) => {
    markAsViewed(notificationId)
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              All Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review the complete notification feed and mark items as viewed when opened.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={reload} disabled={loading}>
            Refresh
          </Button>
        </Stack>
      </Paper>

      {error ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 280 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList
          notifications={notifications}
          viewedIds={viewedIds}
          onOpenNotification={handleOpenNotification}
          emptyMessage="The backend returned no notifications for the current account."
        />
      )}
    </Stack>
  )
}
