import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Machines from './pages/Machines'
import Predictions from './pages/Predictions'
import Monitoring from './pages/Monitoring'
import Insights from './pages/Insights'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="machines" element={<Machines />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
