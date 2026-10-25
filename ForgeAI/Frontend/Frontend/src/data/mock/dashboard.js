/**
 * ForgeAI — Mock dashboard data
 *
 * ⚠️  DEMO DATA — will be replaced by API responses from FastAPI /predict and
 * future fleet-management endpoints.
 *
 * Structured to mirror expected API response shapes so the swap is trivial.
 */

// ---------------------------------------------------------------------------
// Fleet KPI summary
// ---------------------------------------------------------------------------

export const fleetSummary = {
  totalMachines: 24,
  healthy: 18,
  elevated: 4,
  highRisk: 2,
}

// ---------------------------------------------------------------------------
// Operational KPI metrics
// ---------------------------------------------------------------------------

export const operationalMetrics = {
  predictionsRun: 1284,
  predictionsWindow: 'Last 24 hours',
  failuresDetected: 17,
  failuresWindow: 'Last 7 days',
  avgFailureRisk: 0.184,
}

// ---------------------------------------------------------------------------
// Recent prediction results (mirrors POST /predict response shape)
// ---------------------------------------------------------------------------

export const recentPredictions = [
  {
    id: 'pred-001',
    machineId: 'MCH-017',
    timestamp: '2026-10-25T11:42:00Z',
    machine_failure: 0,
    failure_probability: 0.089,
    risk_level: 'LOW',
  },
  {
    id: 'pred-002',
    machineId: 'MCH-003',
    timestamp: '2026-10-25T11:38:00Z',
    machine_failure: 0,
    failure_probability: 0.342,
    risk_level: 'MEDIUM',
  },
  {
    id: 'pred-003',
    machineId: 'MCH-009',
    timestamp: '2026-10-25T11:35:00Z',
    machine_failure: 1,
    failure_probability: 0.814,
    risk_level: 'HIGH',
  },
  {
    id: 'pred-004',
    machineId: 'MCH-022',
    timestamp: '2026-10-25T11:30:00Z',
    machine_failure: 0,
    failure_probability: 0.127,
    risk_level: 'LOW',
  },
  {
    id: 'pred-005',
    machineId: 'MCH-011',
    timestamp: '2026-10-25T11:25:00Z',
    machine_failure: 0,
    failure_probability: 0.551,
    risk_level: 'MEDIUM',
  },
  {
    id: 'pred-006',
    machineId: 'MCH-004',
    timestamp: '2026-10-25T11:18:00Z',
    machine_failure: 1,
    failure_probability: 0.782,
    risk_level: 'HIGH',
  },
  {
    id: 'pred-007',
    machineId: 'MCH-019',
    timestamp: '2026-10-25T11:12:00Z',
    machine_failure: 0,
    failure_probability: 0.064,
    risk_level: 'LOW',
  },
  {
    id: 'pred-008',
    machineId: 'MCH-002',
    timestamp: '2026-10-25T11:05:00Z',
    machine_failure: 0,
    failure_probability: 0.215,
    risk_level: 'LOW',
  },
]

// ---------------------------------------------------------------------------
// System / environment services
// ---------------------------------------------------------------------------

export const systemServices = [
  { id: 'api',       label: 'API Service',       status: 'Operational', healthy: true },
  { id: 'model',     label: 'ML Model',          status: 'Loaded',      healthy: true },
  { id: 'inference', label: 'Inference Engine',   status: 'Ready',       healthy: true },
  { id: 'pipeline',  label: 'Data Pipeline',      status: 'Connected',   healthy: true },
]

// ---------------------------------------------------------------------------
// Risk distribution across monitored fleet
// ---------------------------------------------------------------------------

export const riskDistribution = {
  low: 18,
  medium: 4,
  high: 2,
}
