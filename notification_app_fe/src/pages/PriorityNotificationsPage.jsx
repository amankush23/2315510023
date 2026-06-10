import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography, Pagination } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { NotificationFilters } from '../components/NotificationFilters.jsx'
import { NotificationList } from '../components/NotificationList.jsx'
import { usePriorityNotifications } from '../hooks/usePriorityNotifications.js'
import { useViewedNotifications } from '../state/viewedNotificationsStore.js'

export function PriorityNotificationsPage() {
  const [draftFilters, setDraftFilters] = useState({
    notificationType: '',
    limit: 10,
    page: 1
  })
  const [appliedFilters, setAppliedFilters] = useState({
    notificationType: '',
    limit: 10,
    page: 1
  })
  const { notifications, pagination, loading, error, reload } = usePriorityNotifications(appliedFilters)
  const { viewedIds, markAsViewed } = useViewedNotifications()

  const paginationPage = useMemo(() => pagination.page || appliedFilters.page, [pagination.page, appliedFilters.page])

  useEffect(() => {
    setDraftFilters(appliedFilters)
  }, [appliedFilters])

  const handleApplyFilters = () => {
    setAppliedFilters((currentFilters) => ({
      notificationType: draftFilters.notificationType,
      limit: Number.parseInt(String(draftFilters.limit), 10) || currentFilters.limit || 10,
      page: 1
    }))
  }

  const handleFilterChange = (updater) => {
    setDraftFilters((currentFilters) => {
      const nextFilters = typeof updater === 'function' ? updater(currentFilters) : updater
      const parsedLimit = Number.parseInt(String(nextFilters.limit), 10)
      const parsedPage = Number.parseInt(String(nextFilters.page), 10)

      return {
        notificationType: nextFilters.notificationType,
        limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10,
        page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
      }
    })
  }

  const handlePageChange = (event, nextPage) => {
    setAppliedFilters((currentFilters) => ({
      ...currentFilters,
      page: nextPage
    }))
  }

  const handleOpenNotification = (notificationId) => {
    markAsViewed(notificationId)
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Priority Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Placement notifications appear first, followed by Result and Event items, with newer entries ranked higher within each group.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={reload} disabled={loading}>
            Refresh
          </Button>
        </Stack>
      </Paper>

      <NotificationFilters filters={draftFilters} onChange={handleFilterChange} onSubmit={handleApplyFilters} />

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
        <Stack spacing={3}>
          <NotificationList
            notifications={notifications}
            viewedIds={viewedIds}
            onOpenNotification={handleOpenNotification}
            emptyMessage="No ranked notifications matched the current filter set."
          />

          <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing page {paginationPage} of {pagination.totalPages || 1} with {pagination.limit || filters.limit} items per page.
            </Typography>
            <Pagination
              color="primary"
              count={pagination.totalPages || 1}
              page={paginationPage}
              onChange={handlePageChange}
              shape="rounded"
            />
          </Paper>
        </Stack>
      )}
    </Stack>
  )
}
