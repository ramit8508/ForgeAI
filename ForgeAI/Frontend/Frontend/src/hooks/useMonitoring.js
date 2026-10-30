/**
 * ForgeAI — useMonitoring Hook
 *
 * Orchestrates fleet telemetry, machine operational states, and prediction history
 * to provide derived observables for the Monitoring Dashboard.
 *
 * Adheres to data integrity rules:
 * - Reuses machineService and predictionHistoryService
 * - Derives metrics dynamically (no hardcoded totals)
 * - Distinguishes physical machine operational status from ML failure risk
 * - Provides search, filtering, and reload capabilities
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { machineService } from '../services/machineService'
import { predictionHistoryService } from '../services/predictionHistoryService'
import {
  computeProbabilityBins,
  computeRankedMachines,
  computeSensorAnalytics,
  computePredictionTimeline,
  computeFailureOutcomeSummary,
  computeExecutiveInsights,
} from '../utils/monitoringAnalytics'

/**
 * Filter tabs supported on the monitored fleet view
 */
export const MONITORING_FILTER_TABS = Object.freeze({
  ALL: 'ALL',
  HIGH_RISK: 'HIGH_RISK',
  WARNING_CRITICAL: 'WARNING_CRITICAL',
  OPERATIONAL: 'OPERATIONAL',
  OFFLINE: 'OFFLINE',
})

/**
 * Calculate monitoring aggregate metrics from machines and prediction history
 *
 * @param {Array<Object>} machines
 * @param {Array<Object>} predictions
 */
export function calculateMonitoringMetrics(machines = [], predictions = []) {
  let lowRisk = 0
  let mediumRisk = 0
  let highRisk = 0
  let totalProbSum = 0

  let operationalCount = 0
  let warningCount = 0
  let criticalCount = 0
  let offlineCount = 0

  machines.forEach((m) => {
    // Risk distribution (ML prediction likelihood)
    const risk = (m.riskLevel || '').toUpperCase()
    if (risk === 'HIGH') highRisk += 1
    else if (risk === 'MEDIUM') mediumRisk += 1
    else lowRisk += 1

    totalProbSum += (typeof m.failureProbability === 'number' && Number.isFinite(m.failureProbability))
      ? m.failureProbability
      : 0

    // Operational status (physical machine state)
    const st = (m.status || '').toUpperCase()
    if (st === 'OPERATIONAL') operationalCount += 1
    else if (st === 'WARNING') warningCount += 1
    else if (st === 'CRITICAL') criticalCount += 1
    else if (st === 'OFFLINE') offlineCount += 1
  })

  const totalMachines = machines.length
  const avgFailureRisk = totalMachines > 0 ? totalProbSum / totalMachines : 0

  // Historical predictions summary
  let failureDetections = 0
  predictions.forEach((p) => {
    if (p.result?.machineFailure === 1) {
      failureDetections += 1
    }
  })

  return {
    totalMachines,
    avgFailureRisk,
    riskDistribution: {
      low: lowRisk,
      medium: mediumRisk,
      high: highRisk,
    },
    statusDistribution: {
      operational: operationalCount,
      warning: warningCount,
      critical: criticalCount,
      offline: offlineCount,
    },
    totalPredictions: predictions.length,
    failurePredictionsCount: failureDetections,
    highRiskCount: highRisk,
    attentionCount: highRisk + warningCount + criticalCount,
  }
}

export function useMonitoring() {
  const [machines, setMachines] = useState([])
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState(MONITORING_FILTER_TABS.ALL)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [fleetData, historyData] = await Promise.all([
        machineService.getMachines(),
        predictionHistoryService.getPredictionHistory(),
      ])

      setMachines(fleetData || [])
      setPredictions(historyData || [])
    } catch (err) {
      console.error('Failed to load monitoring dashboard data:', err)
      setError(err?.message || 'Failed to load monitoring data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    Promise.all([
      machineService.getMachines(),
      predictionHistoryService.getPredictionHistory(),
    ])
      .then(([fleetData, historyData]) => {
        if (!isMounted) return
        setMachines(fleetData || [])
        setPredictions(historyData || [])
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load monitoring dashboard data:', err)
        setError(err?.message || 'Failed to load monitoring data.')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Derive all aggregate metrics
  const metrics = useMemo(() => {
    return calculateMonitoringMetrics(machines, predictions)
  }, [machines, predictions])

  // High-risk and attention queue (machines requiring operator review)
  // Sorted by failure probability descending
  const attentionQueue = useMemo(() => {
    return machines
      .filter((m) => {
        const isHighRisk = (m.riskLevel || '').toUpperCase() === 'HIGH'
        const isWarning = (m.status || '').toUpperCase() === 'WARNING'
        const isCritical = (m.status || '').toUpperCase() === 'CRITICAL'
        return isHighRisk || isWarning || isCritical
      })
      .sort((a, b) => (b.failureProbability || 0) - (a.failureProbability || 0))
  }, [machines])

  // Filtered monitored fleet for the main monitoring table
  const filteredMachines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return machines
      .filter((m) => {
        // Search filter (ID, name, location)
        if (q) {
          const matchId = (m.id || '').toLowerCase().includes(q)
          const matchName = (m.name || '').toLowerCase().includes(q)
          const matchLoc = (m.location || '').toLowerCase().includes(q)
          if (!matchId && !matchName && !matchLoc) return false
        }

        // Tab filter
        switch (filterTab) {
          case MONITORING_FILTER_TABS.HIGH_RISK:
            return (m.riskLevel || '').toUpperCase() === 'HIGH'
          case MONITORING_FILTER_TABS.WARNING_CRITICAL: {
            const st = (m.status || '').toUpperCase()
            return st === 'WARNING' || st === 'CRITICAL'
          }
          case MONITORING_FILTER_TABS.OPERATIONAL:
            return (m.status || '').toUpperCase() === 'OPERATIONAL'
          case MONITORING_FILTER_TABS.OFFLINE:
            return (m.status || '').toUpperCase() === 'OFFLINE'
          case MONITORING_FILTER_TABS.ALL:
          default:
            return true
        }
      })
      .sort((a, b) => {
        // Default sort: highest risk first for monitoring purposes
        const probDiff = (b.failureProbability || 0) - (a.failureProbability || 0)
        if (probDiff !== 0) return probDiff
        return (a.id || '').localeCompare(b.id || '', undefined, { numeric: true })
      })
  }, [machines, searchQuery, filterTab])

  // Recent predictions (top 6 newest)
  const recentPredictions = useMemo(() => {
    return [...predictions]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6)
  }, [predictions])

  // Advanced Analytics derived states
  const rankedMachines = useMemo(() => computeRankedMachines(machines), [machines])
  const probabilityBins = useMemo(() => computeProbabilityBins(machines), [machines])
  const sensorAnalytics = useMemo(() => computeSensorAnalytics(machines), [machines])
  const predictionTimeline = useMemo(() => computePredictionTimeline(predictions), [predictions])
  const failureOutcomeSummary = useMemo(() => computeFailureOutcomeSummary(predictions), [predictions])
  const executiveInsights = useMemo(() => computeExecutiveInsights(machines, predictions), [machines, predictions])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setFilterTab(MONITORING_FILTER_TABS.ALL)
  }, [])

  return {
    machines,
    predictions,
    metrics,
    attentionQueue,
    filteredMachines,
    recentPredictions,
    rankedMachines,
    probabilityBins,
    sensorAnalytics,
    predictionTimeline,
    failureOutcomeSummary,
    executiveInsights,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    resetFilters,
    refetch: fetchData,
  }
}

export default useMonitoring
