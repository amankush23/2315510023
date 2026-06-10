import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'

const notificationTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Placement', value: 'Placement' },
  { label: 'Result', value: 'Result' },
  { label: 'Event', value: 'Event' }
]

export function NotificationFilters({ filters, onChange, onSubmit }) {
  const updateFilter = (field) => (event) => {
    onChange((currentFilters) => ({
      ...currentFilters,
      [field]: event.target.value
    }))
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Priority Filters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Narrow the ranked notification feed by type, page, and page size.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField select fullWidth label="Notification type" value={filters.notificationType} onChange={updateFilter('notificationType')}>
            {notificationTypeOptions.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Limit"
            type="number"
            inputProps={{ min: 1, max: 100 }}
            value={filters.limit}
            onChange={updateFilter('limit')}
          />
          <TextField
            fullWidth
            label="Page"
            type="number"
            inputProps={{ min: 1, max: 999 }}
            value={filters.page}
            onChange={updateFilter('page')}
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" onClick={onSubmit}>
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
