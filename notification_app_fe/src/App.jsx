import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell.jsx'
import { AllNotificationsPage } from './pages/AllNotificationsPage.jsx'
import { PriorityNotificationsPage } from './pages/PriorityNotificationsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<AllNotificationsPage />} />
        <Route path="/priority" element={<PriorityNotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
