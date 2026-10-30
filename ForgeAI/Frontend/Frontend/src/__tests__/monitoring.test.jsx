/**
 * ForgeAI — Monitoring Dashboard & Advanced Analytics Tests (Phase 9)
 *
 * Comprehensive tests covering:
 * - Monitoring aggregate metric calculations
 * - Advanced industrial analytics (probability bins, ranking, sensor distributions, correlations)
 * - Multi-axis filtering, search, and sorting behavior
 * - Empty states and error handling
 * - Component rendering and accessibility
 * - Data integrity rules & distinction between physical status and ML risk
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import {
  calculateMonitoringMetrics,
  useMonitoring,
  MONITORING_FILTER_TABS,
} from '../hooks/useMonitoring'
import {
  computeProbabilityBins,
  computeRankedMachines,
  computeSensorAnalytics,
  computeCorrelationPoints,
  computePredictionTimeline,
  computeFailureOutcomeSummary,
  computeExecutiveInsights,
} from '../utils/monitoringAnalytics'
import { machineService } from '../services/machineService'
import { predictionHistoryService } from '../services/predictionHistoryService'
import Monitoring from '../pages/Monitoring'


// Analytics components
import AnalyticsInsightsSummary from '../components/monitoring/analytics/AnalyticsInsightsSummary'
import ProbabilityRankingChart from '../components/monitoring/analytics/ProbabilityRankingChart'
import ProbabilityHistogramChart from '../components/monitoring/analytics/ProbabilityHistogramChart'
import SensorTelemetryGrid from '../components/monitoring/analytics/SensorTelemetryGrid'
import RiskCorrelationScatterPlot from '../components/monitoring/analytics/RiskCorrelationScatterPlot'
import PredictionTimelineChart from '../components/monitoring/analytics/PredictionTimelineChart'
import FailureOutcomeComparison from '../components/monitoring/analytics/FailureOutcomeComparison'

// Mock services
vi.mock('../services/machineService', () => ({
  machineService: {
    getMachines: vi.fn(),
    getMachineById: vi.fn(),
  },
}))

vi.mock('../services/predictionHistoryService', () => ({
  predictionHistoryService: {
    getPredictionHistory: vi.fn(),
    getPredictionById: vi.fn(),
  },
}))

const sampleMachines = [
  {
    id: 'MCH-001',
    name: 'Milling Motor 01',
    status: 'Operational',
    riskLevel: 'LOW',
    failureProbability: 0.05,
    location: 'Line A — Bay 1',
    sensors: { air_temperature: 298.1, process_temperature: 308.2, rotational_speed: 1500, torque: 38.0, tool_wear: 30 },
  },
  {
    id: 'MCH-002',
    name: 'Spindle Drive 02',
    status: 'Warning',
    riskLevel: 'MEDIUM',
    failureProbability: 0.45,
    location: 'Line A — Bay 2',
    sensors: { air_temperature: 301.2, process_temperature: 311.0, rotational_speed: 1400, torque: 58.0, tool_wear: 180 },
  },
  {
    id: 'MCH-003',
    name: 'Cutting Drive 03',
    status: 'Critical',
    riskLevel: 'HIGH',
    failureProbability: 0.85,
    location: 'Line B — Bay 1',
    sensors: { air_temperature: 305.0, process_temperature: 315.0, rotational_speed: 1300, torque: 70.0, tool_wear: 220 },
  },
  {
    id: 'MCH-004',
    name: 'Extruder Standby',
    status: 'Offline',
    riskLevel: 'LOW',
    failureProbability: 0.02,
    location: 'Line C — Bay 3',
    sensors: { air_temperature: 295.0, process_temperature: 295.0, rotational_speed: 0, torque: 0, tool_wear: 80 },
  },
]

const samplePredictions = [
  {
    id: 'pred-001',
    machine: { id: 'MCH-003', name: 'Cutting Drive 03' },
    createdAt: '2026-10-26T14:00:00Z',
    result: { machineFailure: 1, failureProbability: 0.85, riskLevel: 'HIGH' },
  },
  {
    id: 'pred-002',
    machine: { id: 'MCH-001', name: 'Milling Motor 01' },
    createdAt: '2026-10-26T13:00:00Z',
    result: { machineFailure: 0, failureProbability: 0.05, riskLevel: 'LOW' },
  },
]

describe('calculateMonitoringMetrics', () => {
  it('correctly aggregates risk and status distributions from fleet data', () => {
    const metrics = calculateMonitoringMetrics(sampleMachines, samplePredictions)

    expect(metrics.totalMachines).toBe(4)
    expect(metrics.highRiskCount).toBe(1)
    expect(metrics.riskDistribution.low).toBe(2)
    expect(metrics.riskDistribution.medium).toBe(1)
    expect(metrics.riskDistribution.high).toBe(1)

    expect(metrics.statusDistribution.operational).toBe(1)
    expect(metrics.statusDistribution.warning).toBe(1)
    expect(metrics.statusDistribution.critical).toBe(1)
    expect(metrics.statusDistribution.offline).toBe(1)

    expect(metrics.totalPredictions).toBe(2)
    expect(metrics.failurePredictionsCount).toBe(1)
    expect(metrics.avgFailureRisk).toBeCloseTo(0.3425)
    expect(metrics.attentionCount).toBe(3)
  })

  it('handles empty datasets safely without NaN or errors', () => {
    const metrics = calculateMonitoringMetrics([], [])

    expect(metrics.totalMachines).toBe(0)
    expect(metrics.avgFailureRisk).toBe(0)
    expect(metrics.highRiskCount).toBe(0)
    expect(metrics.totalPredictions).toBe(0)
    expect(metrics.riskDistribution.low).toBe(0)
    expect(metrics.statusDistribution.operational).toBe(0)
  })
})

describe('monitoringAnalytics utility algorithms', () => {
  it('computeProbabilityBins bins machines into 10 buckets accurately', () => {
    const bins = computeProbabilityBins(sampleMachines)

    expect(bins).toHaveLength(10)
    expect(bins[0].range).toBe('0–10%')
    // MCH-001 (0.05) and MCH-004 (0.02) are in 0-10%
    expect(bins[0].count).toBe(2)
    // MCH-002 (0.45) is in 40-50%
    expect(bins[4].range).toBe('40–50%')
    expect(bins[4].count).toBe(1)
    // MCH-003 (0.85) is in 80-90%
    expect(bins[8].range).toBe('80–90%')
    expect(bins[8].count).toBe(1)

    // Empty dataset handling
    const emptyBins = computeProbabilityBins([])
    expect(emptyBins).toHaveLength(10)
    expect(emptyBins.every((b) => b.count === 0)).toBe(true)
  })

  it('computeRankedMachines orders machines by probability descending with rank numbers', () => {
    const ranked = computeRankedMachines(sampleMachines)

    expect(ranked).toHaveLength(4)
    expect(ranked[0].rank).toBe(1)
    expect(ranked[0].id).toBe('MCH-003') // 0.85
    expect(ranked[1].rank).toBe(2)
    expect(ranked[1].id).toBe('MCH-002') // 0.45
    expect(ranked[3].rank).toBe(4)
    expect(ranked[3].id).toBe('MCH-004') // 0.02

    expect(computeRankedMachines([])).toEqual([])
  })

  it('computeSensorAnalytics calculates min/max/avg and identifies limits violations', () => {
    const stats = computeSensorAnalytics(sampleMachines)

    expect(stats.torque.avg).toBeCloseTo(41.5) // (38 + 58 + 70 + 0) / 4 = 166 / 4 = 41.5
    expect(stats.torque.elevatedCount).toBe(2) // 58 and 70 >= 55 Nm
    expect(stats.torque.criticalCount).toBe(1) // 70 >= 65 Nm
    expect(stats.toolWear.warningCount).toBe(1) // MCH-003 has 220 >= 200 min
    expect(stats.tempDiff.elevatedCount).toBe(3) // 10.1, 9.8, and 10.0 >= 9.5 K

    const emptyStats = computeSensorAnalytics([])
    expect(emptyStats.torque.avg).toBe(0)
    expect(emptyStats.torque.elevatedCount).toBe(0)
  })

  it('computeCorrelationPoints formats scatter plot coordinates correctly', () => {
    const points = computeCorrelationPoints(sampleMachines, 'torque')

    expect(points).toHaveLength(4)
    expect(points[0].machineId).toBe('MCH-001')
    expect(points[0].sensorValue).toBe(38)
    expect(points[0].failureProbability).toBe(0.05)

    const tempDiffPoints = computeCorrelationPoints(sampleMachines, 'temperature_difference')
    expect(tempDiffPoints[0].sensorValue).toBeCloseTo(10.1) // 308.2 - 298.1
  })

  it('computePredictionTimeline groups predictions by date/hour window', () => {
    const timeline = computePredictionTimeline(samplePredictions)

    expect(timeline.length).toBeGreaterThan(0)
    expect(timeline[0].total).toBeGreaterThan(0)
    expect(computePredictionTimeline([])).toEqual([])
  })

  it('computeFailureOutcomeSummary calculates classification rates', () => {
    const summary = computeFailureOutcomeSummary(samplePredictions)

    expect(summary.total).toBe(2)
    expect(summary.predictedFailure.count).toBe(1)
    expect(summary.predictedFailure.percentage).toBe(50)
    expect(summary.predictedFailure.avgProbability).toBe(0.85)

    expect(summary.predictedNonFailure.count).toBe(1)
    expect(summary.predictedNonFailure.percentage).toBe(50)
    expect(summary.predictedNonFailure.avgProbability).toBe(0.05)
  })

  it('computeExecutiveInsights generates dynamic operational summary', () => {
    const insights = computeExecutiveInsights(sampleMachines, samplePredictions)

    expect(insights.highestRiskMachine.id).toBe('MCH-003')
    expect(insights.highRiskThresholdCount).toBe(2) // MCH-003 (0.85) and MCH-002 (0.45) >= 0.45
    expect(insights.threshold).toBe(0.45)
    expect(insights.sensorAnomaliesCount).toBeGreaterThan(0)
  })
})

describe('useMonitoring hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(machineService.getMachines).mockResolvedValue(sampleMachines)
    vi.mocked(predictionHistoryService.getPredictionHistory).mockResolvedValue(samplePredictions)
  })

  it('loads fleet, predictions, and exposes advanced analytics observables', async () => {
    const { result } = renderHook(() => useMonitoring())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.machines).toHaveLength(4)
    expect(result.current.rankedMachines).toHaveLength(4)
    expect(result.current.probabilityBins).toHaveLength(10)
    expect(result.current.sensorAnalytics.torque).toBeDefined()
    expect(result.current.executiveInsights.highestRiskMachine.id).toBe('MCH-003')
  })

  it('filters attention queue to only high risk or critical/warning machines sorted by risk descending', async () => {
    const { result } = renderHook(() => useMonitoring())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.attentionQueue).toHaveLength(2)
    expect(result.current.attentionQueue[0].id).toBe('MCH-003')
    expect(result.current.attentionQueue[1].id).toBe('MCH-002')
  })

  it('filters machines by search query across ID, name, and location', async () => {
    const { result } = renderHook(() => useMonitoring())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setSearchQuery('MCH-002')
    })
    expect(result.current.filteredMachines).toHaveLength(1)
    expect(result.current.filteredMachines[0].id).toBe('MCH-002')

    act(() => {
      result.current.resetFilters()
    })
    expect(result.current.filteredMachines).toHaveLength(4)
  })

  it('filters machines by tab selection (HIGH_RISK, OFFLINE)', async () => {
    const { result } = renderHook(() => useMonitoring())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setFilterTab(MONITORING_FILTER_TABS.HIGH_RISK)
    })
    expect(result.current.filteredMachines).toHaveLength(1)
    expect(result.current.filteredMachines[0].id).toBe('MCH-003')

    act(() => {
      result.current.setFilterTab(MONITORING_FILTER_TABS.OFFLINE)
    })
    expect(result.current.filteredMachines).toHaveLength(1)
    expect(result.current.filteredMachines[0].id).toBe('MCH-004')
  })
})

describe('Advanced Analytics UI Components', () => {
  it('renders AnalyticsInsightsSummary with computed insights', () => {
    const insights = computeExecutiveInsights(sampleMachines, samplePredictions)

    render(
      <BrowserRouter>
        <AnalyticsInsightsSummary insights={insights} />
      </BrowserRouter>,
    )

    expect(screen.getByText('Industrial Analytics & Predictive Insights')).toBeInTheDocument()
    expect(screen.getByText('Highest Predicted Risk')).toBeInTheDocument()
    expect(screen.getByText('MCH-003')).toBeInTheDocument()
    expect(screen.getByText(/Threshold Breaches/)).toBeInTheDocument()
    expect(screen.getByText(/Telemetry Strain Outliers/)).toBeInTheDocument()
  })

  it('renders ProbabilityRankingChart and triggers navigation on row click', () => {
    const onSelect = vi.fn()
    const ranked = computeRankedMachines(sampleMachines)

    render(
      <BrowserRouter>
        <ProbabilityRankingChart rankedMachines={ranked} onSelectMachine={onSelect} />
      </BrowserRouter>,
    )

    expect(screen.getByText('Machine Failure Probability Ranking')).toBeInTheDocument()
    expect(screen.getByText('MCH-003')).toBeInTheDocument()
    expect(screen.getByText('85.00%')).toBeInTheDocument()

    const firstRow = screen.getByRole('button', { name: /MCH-003/i })
    fireEvent.click(firstRow)
    expect(onSelect).toHaveBeenCalledWith('MCH-003')
  })

  it('renders ProbabilityHistogramChart with 10 bins and 45% cutoff marker', () => {
    const bins = computeProbabilityBins(sampleMachines)

    render(<ProbabilityHistogramChart bins={bins} />)

    expect(screen.getByText('Failure Probability Distribution')).toBeInTheDocument()
    expect(screen.getByText('Cutoff 45%')).toBeInTheDocument()
    expect(screen.getByText('0–10%')).toBeInTheDocument()
    expect(screen.getByText('40–50%')).toBeInTheDocument()
  })

  it('renders SensorTelemetryGrid with unit labels and limit indicators', () => {
    const stats = computeSensorAnalytics(sampleMachines)

    render(<SensorTelemetryGrid sensorAnalytics={stats} />)

    expect(screen.getByText('Sensor Telemetry Analysis')).toBeInTheDocument()
    expect(screen.getByText('Drive Torque')).toBeInTheDocument()
    expect(screen.getByText('Tool Wear Accumulation')).toBeInTheDocument()
    expect(screen.getByText('Rotational Speed')).toBeInTheDocument()
    expect(screen.getByText('Thermal Variance (ΔT)')).toBeInTheDocument()
    expect(screen.getByText(/Ambient Air:/)).toBeInTheDocument()
  })

  it('renders RiskCorrelationScatterPlot with sensor selection options', () => {
    render(
      <BrowserRouter>
        <RiskCorrelationScatterPlot machines={sampleMachines} />
      </BrowserRouter>,
    )

    expect(screen.getByText('Failure Risk vs. Sensor Telemetry')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Tool Wear/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Drive Torque/i })).toBeInTheDocument()

    // Switch sensor
    const torqueTab = screen.getByRole('tab', { name: /Drive Torque/i })
    fireEvent.click(torqueTab)
    expect(torqueTab).toHaveAttribute('aria-selected', 'true')
  })

  it('renders PredictionTimelineChart with stacked outcome volume', () => {
    const timeline = computePredictionTimeline(samplePredictions)

    render(<PredictionTimelineChart timeline={timeline} />)

    expect(screen.getByText('Prediction Activity Over Time')).toBeInTheDocument()
    expect(screen.getByText('Demo Data')).toBeInTheDocument()
    expect(screen.getByText('Failure Predicted')).toBeInTheDocument()
  })

  it('renders FailureOutcomeComparison with data integrity disclaimer', () => {
    const summary = computeFailureOutcomeSummary(samplePredictions)

    render(<FailureOutcomeComparison outcomeSummary={summary} />)

    expect(screen.getByText('Inference Outcome Comparison')).toBeInTheDocument()
    expect(screen.getByText('Predicted Failure')).toBeInTheDocument()
    expect(screen.getByText('No Failure')).toBeInTheDocument()
    expect(screen.getByText(/Integrity Note:/)).toBeInTheDocument()
  })
})

describe('Monitoring Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(machineService.getMachines).mockResolvedValue(sampleMachines)
    vi.mocked(predictionHistoryService.getPredictionHistory).mockResolvedValue(samplePredictions)
  })

  it('renders full monitoring dashboard with view switcher and toggles between views', async () => {
    render(
      <BrowserRouter>
        <Monitoring />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Monitoring Dashboard')).toBeInTheDocument()
    })

    // Header badge
    expect(screen.getByText('Demo data · Simulated Fleet')).toBeInTheDocument()

    // View Switcher tabs exist
    expect(screen.getByRole('tab', { name: /All Panels/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Industrial Analytics/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Operations & Fleet/i })).toBeInTheDocument()

    // Switch to Industrial Analytics view
    const analyticsTab = screen.getByRole('tab', { name: /Industrial Analytics/i })
    fireEvent.click(analyticsTab)
    expect(analyticsTab).toHaveAttribute('aria-selected', 'true')

    // Industrial Analytics section components are in the document
    expect(screen.getByText('Industrial Analytics & Predictive Insights')).toBeInTheDocument()
    expect(screen.getByText('Machine Failure Probability Ranking')).toBeInTheDocument()
    expect(screen.getByText('Failure Probability Distribution')).toBeInTheDocument()
    expect(screen.getByText('Sensor Telemetry Analysis')).toBeInTheDocument()
  })
})
