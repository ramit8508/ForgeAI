import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Machines from './pages/Machines'
import MachineDetail from './pages/MachineDetail'
import Predictions from './pages/Predictions'
import PredictionHistory from './pages/PredictionHistory'
import PredictionHistoryDetail from './pages/PredictionHistoryDetail'
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
          <Route path="machines/:machineId" element={<MachineDetail />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="predictions/history" element={<PredictionHistory />} />
          <Route path="predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
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
