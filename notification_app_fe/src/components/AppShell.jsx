import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined'
import { AppBar, Box, Container, Tabs, Tab, Toolbar, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const tabRoutes = ['/', '/priority']

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedTab = useMemo(() => {
    const matchedIndex = tabRoutes.indexOf(location.pathname)
    return matchedIndex === -1 ? false : matchedIndex
  }, [location.pathname])

  const handleTabChange = (event, nextValue) => {
    navigate(tabRoutes[nextValue])
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, py: { xs: 1.5, md: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <NotificationsActiveOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Campus Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Priority-driven notification workspace
              </Typography>
            </Box>
          </Box>
          <Tabs
            value={selectedTab === false ? 0 : selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ minHeight: 44, width: { xs: '100%', md: 'auto' }, '& .MuiTabs-indicator': { height: 3 } }}
          >
            <Tab icon={<NotificationsActiveOutlinedIcon fontSize="small" />} iconPosition="start" label="All Notifications" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<PriorityHighOutlinedIcon fontSize="small" />} iconPosition="start" label="Priority Notifications" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  )
}
