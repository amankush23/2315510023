import { AccessTimeOutlined, DoneOutlined, RadioButtonUncheckedOutlined } from '@mui/icons-material'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import { formatNotificationTimestamp } from '../utils/notificationNormalizer.js'

function typeColor(type) {
  if (type === 'Placement') {
    return 'success'
  }

  if (type === 'Result') {
    return 'warning'
  }

  return 'default'
}

export function NotificationCard({ notification, viewed, onOpen }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: viewed ? 'rgba(23, 50, 77, 0.12)' : 'rgba(23, 50, 77, 0.2)',
        backgroundColor: viewed ? '#fbfcfe' : '#fff',
        boxShadow: viewed ? 'none' : '0 10px 24px rgba(23, 50, 77, 0.06)'
      }}
    >
      <CardActionArea onClick={() => onOpen(notification.id)} sx={{ alignItems: 'stretch' }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.25 }}>
                <Chip label={notification.type} color={typeColor(notification.type)} size="small" variant={viewed ? 'outlined' : 'filled'} />
                <Chip
                  icon={viewed ? <DoneOutlined fontSize="small" /> : <RadioButtonUncheckedOutlined fontSize="small" />}
                  label={viewed ? 'Viewed' : 'Unread'}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: viewed ? 'success.light' : 'divider', color: viewed ? 'success.dark' : 'text.secondary' }}
                />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}>
                {notification.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word', lineHeight: 1.7 }}>
                {notification.message ?? 'No message available'}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, color: 'text.secondary' }}>
            <AccessTimeOutlined fontSize="small" />
            <Typography variant="body2">{formatNotificationTimestamp(notification.timestamp)}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
