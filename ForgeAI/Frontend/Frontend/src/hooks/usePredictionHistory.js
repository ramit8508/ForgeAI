/**
 * ForgeAI — usePredictionHistory Hook
 *
 * Manages prediction history state, filtering, search, sorting, and summary metrics.
 * Decouples state and operational logic from presentation components.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { predictionHistoryService } from '../services/predictionHistoryService'

const RISK_WEIGHTS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
}

export function usePredictionHistory() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter & sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [machineFilter, setMachineFilter] = useState('ALL') // 'ALL' | machineId
  const [riskFilter, setRiskFilter] = useState('ALL') // 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'
  const [resultFilter, setResultFilter] = useState('ALL') // 'ALL' | 'FAILURE' | 'NO_FAILURE'
  const [dateRange, setDateRange] = useState('ALL') // 'ALL' | 'TODAY' | '7_DAYS' | '30_DAYS'
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest' | 'failureProbability' | 'risk'
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' | 'asc'

  const fetchHistory = useCallback(() => {
    predictionHistoryService
      .getPredictionHistory()
      .then((data) => {
        setPredictions(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load prediction history:', err)
        setError(err?.message || 'Failed to load prediction history data.')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Extract unique machines available in the history dataset
  const availableMachines = useMemo(() => {
    const map = new Map()
    predictions.forEach((p) => {
      if (p.machine?.id && !map.has(p.machine.id)) {
        map.set(p.machine.id, {
          id: p.machine.id,
          name: p.machine.name || p.machine.id,
        })
      }
    })
    return Array.from(map.values()).sort((a, b) => a.id.localeCompare(b.id))
  }, [predictions])

  // Derive summary metrics from the base dataset
  const summary = useMemo(() => {
    let failuresDetected = 0
    let lowRiskCount = 0
    let mediumRiskCount = 0
    let highRiskCount = 0

    predictions.forEach((p) => {
      if (p.result?.machineFailure === 1) {
        failuresDetected += 1
      }
      const risk = (p.result?.riskLevel || '').toUpperCase()
      if (risk === 'LOW') lowRiskCount += 1
      else if (risk === 'MEDIUM') mediumRiskCount += 1
      else if (risk === 'HIGH') highRiskCount += 1
    })

    const totalPredictions = predictions.length
    const lowRiskPercentage = totalPredictions > 0 ? (lowRiskCount / totalPredictions) * 100 : 0
    const highRiskPercentage = totalPredictions > 0 ? (highRiskCount / totalPredictions) * 100 : 0

    return {
      totalPredictions,
      failuresDetected,
      lowRiskCount,
      mediumRiskCount,
      highRiskCount,
      lowRiskPercentage,
      highRiskPercentage,
    }
  }, [predictions])

  // Reference timestamp for relative date window calculations
  const referenceTimestamp = useMemo(() => {
    if (predictions.length === 0) return 0
    return Math.max(...predictions.map((p) => new Date(p.createdAt || 0).getTime()))
  }, [predictions])

  // Filtered and sorted predictions
  const filteredPredictions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const oneDayMs = 24 * 60 * 60 * 1000

    return predictions
      .filter((p) => {
        // Search query filter: matches prediction ID, machine ID, or machine name
        if (q) {
          const matchPredId = (p.id || '').toLowerCase().includes(q)
          const matchMachId = (p.machine?.id || '').toLowerCase().includes(q)
          const matchMachName = (p.machine?.name || '').toLowerCase().includes(q)
          if (!matchPredId && !matchMachId && !matchMachName) return false
        }

        // Machine filter
        if (machineFilter !== 'ALL') {
          if ((p.machine?.id || '').toUpperCase() !== machineFilter.toUpperCase()) {
            return false
          }
        }

        // Risk filter
        if (riskFilter !== 'ALL') {
          if ((p.result?.riskLevel || '').toUpperCase() !== riskFilter.toUpperCase()) {
            return false
          }
        }

        // Result filter
        if (resultFilter !== 'ALL') {
          const isFailure = p.result?.machineFailure === 1
          if (resultFilter === 'FAILURE' && !isFailure) return false
          if (resultFilter === 'NO_FAILURE' && isFailure) return false
        }

        // Date range filter
        if (dateRange !== 'ALL') {
          const itemTime = new Date(p.createdAt || 0).getTime()
          const diffMs = referenceTimestamp - itemTime

          if (dateRange === 'TODAY') {
            // Within 24 hours of latest record or matching same calendar date
            const refDate = new Date(referenceTimestamp).toISOString().slice(0, 10)
            const itemDate = new Date(itemTime).toISOString().slice(0, 10)
            if (refDate !== itemDate && diffMs > oneDayMs) {
              return false
            }
          } else if (dateRange === '7_DAYS') {
            if (diffMs > 7 * oneDayMs) return false
          } else if (dateRange === '30_DAYS') {
            if (diffMs > 30 * oneDayMs) return false
          }
        }

        return true
      })
      .sort((a, b) => {
        let diff

        switch (sortBy) {
          case 'failureProbability':
            diff = (a.result?.failureProbability || 0) - (b.result?.failureProbability || 0)
            return sortOrder === 'asc' ? diff : -diff

          case 'risk': {
            const weightA = RISK_WEIGHTS[(a.result?.riskLevel || '').toUpperCase()] || 0
            const weightB = RISK_WEIGHTS[(b.result?.riskLevel || '').toUpperCase()] || 0
            diff = weightA - weightB
            return sortOrder === 'asc' ? diff : -diff
          }

          case 'oldest': {
            const timeA = new Date(a.createdAt || 0).getTime()
            const timeB = new Date(b.createdAt || 0).getTime()
            return timeA - timeB
          }

          case 'newest':
          default: {
            const timeA = new Date(a.createdAt || 0).getTime()
            const timeB = new Date(b.createdAt || 0).getTime()
            return timeB - timeA
          }
        }
      })
  }, [
    predictions,
    searchQuery,
    machineFilter,
    riskFilter,
    resultFilter,
    dateRange,
    sortBy,
    sortOrder,
    referenceTimestamp,
  ])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setMachineFilter('ALL')
    setRiskFilter('ALL')
    setResultFilter('ALL')
    setDateRange('ALL')
    setSortBy('newest')
    setSortOrder('desc')
  }, [])

  return {
    predictions,
    filteredPredictions,
    summary,
    availableMachines,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    machineFilter,
    setMachineFilter,
    riskFilter,
    setRiskFilter,
    resultFilter,
    setResultFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    refetch: fetchHistory,
  }
}

export default usePredictionHistory
