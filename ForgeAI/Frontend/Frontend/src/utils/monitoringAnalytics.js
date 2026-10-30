/**
 * ForgeAI — Monitoring Analytics Utilities
 *
 * Pure data transformation and calculation functions for advanced industrial analytics.
 * Strictly calculates metrics from available machine fleet snapshots and prediction history records.
 * Never fabricates data points or fake time-series telemetry.
 */

import { config } from '../lib/config'
import { calculateTemperatureDifference } from '../lib/formatters'

/**
 * Standard industrial engineering nominal limits for warning/critical thresholds
 */
export const ENGINEERING_LIMITS = Object.freeze({
  toolWearWarning: 200, // minutes (rapid flank/crater wear threshold)
  torqueWarning: 55,    // Nm (nominal spindle load boundary)
  torqueCritical: 65,   // Nm (high mechanical resistance)
  tempDiffWarning: 9.5, // K (elevated thermal variance Process - Air)
  speedMinWarning: 1350 // rpm (spindle speed drop under load)
})

/**
 * 1. Compute 10 Failure Probability Distribution Bins (0-10%, 10-20%, ..., 90-100%)
 *
 * @param {Array<Object>} machines
 * @returns {Array<{ range: string, min: number, max: number, count: number, percentage: number, machines: Array<Object> }>}
 */
export function computeProbabilityBins(machines = []) {
  const bins = [
    { range: '0–10%', min: 0.0, max: 0.1, count: 0, percentage: 0, machines: [] },
    { range: '10–20%', min: 0.1, max: 0.2, count: 0, percentage: 0, machines: [] },
    { range: '20–30%', min: 0.2, max: 0.3, count: 0, percentage: 0, machines: [] },
    { range: '30–40%', min: 0.3, max: 0.4, count: 0, percentage: 0, machines: [] },
    { range: '40–50%', min: 0.4, max: 0.5, count: 0, percentage: 0, machines: [] },
    { range: '50–60%', min: 0.5, max: 0.6, count: 0, percentage: 0, machines: [] },
    { range: '60–70%', min: 0.6, max: 0.7, count: 0, percentage: 0, machines: [] },
    { range: '70–80%', min: 0.7, max: 0.8, count: 0, percentage: 0, machines: [] },
    { range: '80–90%', min: 0.8, max: 0.9, count: 0, percentage: 0, machines: [] },
    { range: '90–100%', min: 0.9, max: 1.0001, count: 0, percentage: 0, machines: [] },
  ]

  const total = machines.length
  if (total === 0) return bins

  machines.forEach((m) => {
    const prob = typeof m.failureProbability === 'number' && Number.isFinite(m.failureProbability)
      ? Math.max(0, Math.min(1, m.failureProbability))
      : 0

    // Find appropriate bin
    const binIndex = bins.findIndex((b) => prob >= b.min && prob < b.max)
    if (binIndex !== -1) {
      bins[binIndex].count += 1
      bins[binIndex].machines.push(m)
    } else {
      // In case prob === 1.0
      bins[bins.length - 1].count += 1
      bins[bins.length - 1].machines.push(m)
    }
  })

  // Calculate percentages
  bins.forEach((b) => {
    b.percentage = total > 0 ? Math.round((b.count / total) * 100) : 0
  })

  return bins
}

/**
 * 2. Compute Ranked Failure Probabilities for all machines
 *
 * @param {Array<Object>} machines
 * @returns {Array<{ rank: number, id: string, name: string, location: string, failureProbability: number, riskLevel: string, status: string, sensors: Object }>}
 */
export function computeRankedMachines(machines = []) {
  return [...machines]
    .sort((a, b) => (b.failureProbability || 0) - (a.failureProbability || 0))
    .map((m, index) => ({
      rank: index + 1,
      id: m.id,
      name: m.name,
      location: m.location,
      failureProbability: m.failureProbability || 0,
      riskLevel: (m.riskLevel || 'LOW').toUpperCase(),
      status: m.status || 'Operational',
      sensors: m.sensors || {},
    }))
}

/**
 * 3. Compute Sensor Distribution & Threshold Analytics
 *
 * @param {Array<Object>} machines
 */
export function computeSensorAnalytics(machines = []) {
  if (machines.length === 0) {
    return {
      airTemp: { min: 0, max: 0, avg: 0, readings: [] },
      processTemp: { min: 0, max: 0, avg: 0, readings: [] },
      tempDiff: { min: 0, max: 0, avg: 0, elevatedCount: 0, readings: [] },
      rotationalSpeed: { min: 0, max: 0, avg: 0, belowNominalCount: 0, readings: [] },
      torque: { min: 0, max: 0, avg: 0, elevatedCount: 0, criticalCount: 0, readings: [] },
      toolWear: { min: 0, max: 0, avg: 0, warningCount: 0, readings: [] },
    }
  }

  const airTemps = []
  const procTemps = []
  const tempDiffs = []
  const speeds = []
  const torques = []
  const toolWears = []

  machines.forEach((m) => {
    const s = m.sensors || {}
    const air = Number(s.air_temperature) || 0
    const proc = Number(s.process_temperature) || 0
    const diff = calculateTemperatureDifference(proc, air)
    const speed = Number(s.rotational_speed) || 0
    const torq = Number(s.torque) || 0
    const wear = Number(s.tool_wear) || 0

    airTemps.push({ id: m.id, name: m.name, value: air, riskLevel: m.riskLevel })
    procTemps.push({ id: m.id, name: m.name, value: proc, riskLevel: m.riskLevel })
    tempDiffs.push({ id: m.id, name: m.name, value: diff, riskLevel: m.riskLevel })
    speeds.push({ id: m.id, name: m.name, value: speed, riskLevel: m.riskLevel })
    torques.push({ id: m.id, name: m.name, value: torq, riskLevel: m.riskLevel })
    toolWears.push({ id: m.id, name: m.name, value: wear, riskLevel: m.riskLevel })
  })

  const calcStats = (arr) => {
    const vals = arr.map((x) => x.value).filter((v) => Number.isFinite(v))
    if (vals.length === 0) return { min: 0, max: 0, avg: 0 }
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const avg = vals.reduce((sum, v) => sum + v, 0) / vals.length
    return { min, max, avg }
  }

  const airStats = calcStats(airTemps)
  const procStats = calcStats(procTemps)
  const diffStats = calcStats(tempDiffs)
  const speedStats = calcStats(speeds)
  const torqStats = calcStats(torques)
  const wearStats = calcStats(toolWears)

  return {
    airTemp: { ...airStats, readings: airTemps },
    processTemp: { ...procStats, readings: procTemps },
    tempDiff: {
      ...diffStats,
      elevatedCount: tempDiffs.filter((x) => x.value >= ENGINEERING_LIMITS.tempDiffWarning).length,
      readings: tempDiffs,
    },
    rotationalSpeed: {
      ...speedStats,
      belowNominalCount: speeds.filter((x) => x.value > 0 && x.value < ENGINEERING_LIMITS.speedMinWarning).length,
      readings: speeds,
    },
    torque: {
      ...torqStats,
      elevatedCount: torques.filter((x) => x.value >= ENGINEERING_LIMITS.torqueWarning).length,
      criticalCount: torques.filter((x) => x.value >= ENGINEERING_LIMITS.torqueCritical).length,
      readings: torques,
    },
    toolWear: {
      ...wearStats,
      warningCount: toolWears.filter((x) => x.value >= ENGINEERING_LIMITS.toolWearWarning).length,
      readings: toolWears,
    },
  }
}

/**
 * 4. Compute Scatter Plot Correlation Points
 *
 * @param {Array<Object>} machines
 * @param {string} sensorKey - 'tool_wear' | 'torque' | 'rotational_speed' | 'temperature_difference' | 'process_temperature' | 'air_temperature'
 */
export function computeCorrelationPoints(machines = [], sensorKey = 'tool_wear') {
  return machines.map((m) => {
    const s = m.sensors || {}
    const val = sensorKey === 'temperature_difference'
      ? calculateTemperatureDifference(s.process_temperature, s.air_temperature)
      : Number(s[sensorKey]) || 0

    return {
      machineId: m.id,
      machineName: m.name,
      location: m.location,
      sensorValue: val,
      failureProbability: m.failureProbability || 0,
      riskLevel: (m.riskLevel || 'LOW').toUpperCase(),
      status: m.status || 'Operational',
    }
  })
}

/**
 * 5. Compute Prediction Activity Timeline from prediction records
 *
 * @param {Array<Object>} predictions
 * @returns {Array<{ periodLabel: string, timestamp: string, total: number, failures: number, nonFailures: number, highRisk: number }>}
 */
export function computePredictionTimeline(predictions = []) {
  if (predictions.length === 0) return []

  // Sort chronologically ascending
  const sorted = [...predictions].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
  )

  // Group by hour or calendar date depending on span
  const groups = new Map()

  sorted.forEach((p) => {
    const d = new Date(p.createdAt || 0)
    if (Number.isNaN(d.getTime())) return

    // Group key: 'Oct 26, 14:00'
    const key = d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      hour12: false,
    }) + ':00'

    if (!groups.has(key)) {
      groups.set(key, {
        periodLabel: key,
        timestamp: p.createdAt,
        total: 0,
        failures: 0,
        nonFailures: 0,
        highRisk: 0,
      })
    }

    const item = groups.get(key)
    item.total += 1
    if (p.result?.machineFailure === 1) {
      item.failures += 1
    } else {
      item.nonFailures += 1
    }
    if ((p.result?.riskLevel || '').toUpperCase() === 'HIGH') {
      item.highRisk += 1
    }
  })

  return Array.from(groups.values())
}

/**
 * 6. Compute Predicted Failure Outcome Comparison
 *
 * @param {Array<Object>} predictions
 */
export function computeFailureOutcomeSummary(predictions = []) {
  let failureCount = 0
  let nonFailureCount = 0
  let failureProbSum = 0
  let nonFailureProbSum = 0

  predictions.forEach((p) => {
    const isFailure = p.result?.machineFailure === 1
    const prob = p.result?.failureProbability || 0

    if (isFailure) {
      failureCount += 1
      failureProbSum += prob
    } else {
      nonFailureCount += 1
      nonFailureProbSum += prob
    }
  })

  const total = predictions.length
  return {
    total,
    predictedFailure: {
      count: failureCount,
      percentage: total > 0 ? Math.round((failureCount / total) * 100) : 0,
      avgProbability: failureCount > 0 ? failureProbSum / failureCount : 0,
    },
    predictedNonFailure: {
      count: nonFailureCount,
      percentage: total > 0 ? Math.round((nonFailureCount / total) * 100) : 0,
      avgProbability: nonFailureCount > 0 ? nonFailureProbSum / nonFailureCount : 0,
    },
  }
}

/**
 * 7. Compute Executive Industrial Insights
 *
 * @param {Array<Object>} machines
 * @param {Array<Object>} predictions
 */
export function computeExecutiveInsights(machines = [], predictions = []) {
  if (machines.length === 0) {
    return {
      highestRiskMachine: null,
      highRiskThresholdCount: 0,
      threshold: config.model.threshold,
      sensorAnomaliesCount: 0,
      riskBalanceText: 'No fleet data available.',
      predictionActivitySummary: 'No predictions recorded.',
    }
  }

  // Highest risk machine
  const sorted = [...machines].sort((a, b) => (b.failureProbability || 0) - (a.failureProbability || 0))
  const highest = sorted[0]

  // High risk threshold breaches (>= 0.45 threshold)
  const thresholdBreaches = machines.filter(
    (m) => (m.failureProbability || 0) >= config.model.threshold,
  )

  // Sensor anomalies based on standard engineering limits
  const sensorAnomalies = machines.filter((m) => {
    const s = m.sensors || {}
    const wear = Number(s.tool_wear) || 0
    const torque = Number(s.torque) || 0
    const diff = calculateTemperatureDifference(s.process_temperature, s.air_temperature)
    return (
      wear >= ENGINEERING_LIMITS.toolWearWarning ||
      torque >= ENGINEERING_LIMITS.torqueWarning ||
      diff >= ENGINEERING_LIMITS.tempDiffWarning
    )
  })

  // Risk distribution counts
  const highCount = machines.filter((m) => (m.riskLevel || '').toUpperCase() === 'HIGH').length
  const medCount = machines.filter((m) => (m.riskLevel || '').toUpperCase() === 'MEDIUM').length
  const lowCount = machines.filter((m) => (m.riskLevel || '').toUpperCase() === 'LOW').length

  const total = machines.length
  const highPct = Math.round((highCount / total) * 100)
  const medPct = Math.round((medCount / total) * 100)
  const lowPct = Math.round((lowCount / total) * 100)

  const riskBalanceText = `${lowPct}% Low Risk · ${medPct}% Medium · ${highPct}% High Risk`

  // Prediction stats
  const failurePreds = predictions.filter((p) => p.result?.machineFailure === 1).length
  const predText = predictions.length > 0
    ? `${predictions.length} predictions evaluated (${failurePreds} failures flagged)`
    : 'No historical predictions logged'

  return {
    highestRiskMachine: highest,
    highRiskThresholdCount: thresholdBreaches.length,
    threshold: config.model.threshold,
    sensorAnomaliesCount: sensorAnomalies.length,
    riskBalanceText,
    predictionActivitySummary: predText,
    distribution: { low: lowCount, medium: medCount, high: highCount },
  }
}
