/**
 * ForgeAI — useMachines Hook
 *
 * Manages machine fleet data loading, filtering, search, sorting, and summary metrics.
 * Decouples state and operational logic from presentation components.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { machineService } from '../services/machineService'

const RISK_WEIGHTS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
}

export function useMachines() {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter & sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('ALL') // 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE'
  const [sortBy, setSortBy] = useState('id') // 'id' | 'risk' | 'failureProbability' | 'lastPrediction'
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' | 'desc'

  const fetchFleet = useCallback(() => {
    machineService
      .getMachines()
      .then((data) => {
        setMachines(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load machine fleet:', err)
        setError(err?.message || 'Failed to load machine fleet data.')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchFleet()
  }, [fetchFleet])

  // Derive fleet summary metrics from the base dataset
  const fleetSummary = useMemo(() => {
    let operational = 0
    let warning = 0
    let critical = 0
    let offline = 0

    machines.forEach((m) => {
      const st = (m.status || '').toUpperCase()
      if (st === 'OPERATIONAL') operational += 1
      else if (st === 'WARNING') warning += 1
      else if (st === 'CRITICAL') critical += 1
      else if (st === 'OFFLINE') offline += 1
    })

    return {
      total: machines.length,
      operational,
      warning,
      critical,
      offline,
    }
  }, [machines])

  // Filtered and sorted machines
  const filteredMachines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return machines
      .filter((m) => {
        // Search query filter: matches ID, name, or location
        if (q) {
          const matchId = (m.id || '').toLowerCase().includes(q)
          const matchName = (m.name || '').toLowerCase().includes(q)
          const matchLoc = (m.location || '').toLowerCase().includes(q)
          if (!matchId && !matchName && !matchLoc) return false
        }

        // Risk level filter
        if (riskFilter !== 'ALL') {
          if ((m.riskLevel || '').toUpperCase() !== riskFilter.toUpperCase()) {
            return false
          }
        }

        // Operational status filter
        if (statusFilter !== 'ALL') {
          if ((m.status || '').toUpperCase() !== statusFilter.toUpperCase()) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        let diff

        switch (sortBy) {
          case 'failureProbability':
            diff = (a.failureProbability || 0) - (b.failureProbability || 0)
            break

          case 'risk': {
            const weightA = RISK_WEIGHTS[(a.riskLevel || '').toUpperCase()] || 0
            const weightB = RISK_WEIGHTS[(b.riskLevel || '').toUpperCase()] || 0
            diff = weightA - weightB
            break
          }

          case 'lastPrediction': {
            const timeA = new Date(a.lastPredictionAt || 0).getTime()
            const timeB = new Date(b.lastPredictionAt || 0).getTime()
            diff = timeA - timeB
            break
          }

          case 'id':
          default:
            diff = (a.id || '').localeCompare(b.id || '', undefined, {
              numeric: true,
              sensitivity: 'base',
            })
            break
        }

        return sortOrder === 'desc' ? -diff : diff
      })
  }, [machines, searchQuery, riskFilter, statusFilter, sortBy, sortOrder])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setRiskFilter('ALL')
    setStatusFilter('ALL')
    setSortBy('id')
    setSortOrder('asc')
  }, [])

  return {
    machines,
    filteredMachines,
    fleetSummary,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    refetch: fetchFleet,
  }
}

export default useMachines
