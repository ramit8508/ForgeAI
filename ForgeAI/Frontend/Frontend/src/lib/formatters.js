/**
 * ForgeAI — Formatting utilities for telemetry and model metrics
 */

/**
 * Format raw probability float to formatted percentage string.
 * Examples:
 *   0.003428 -> "0.34%"
 *   0.824    -> "82.40%"
 *   0.1489   -> "14.89%"
 *
 * @param {number} probability - Float between 0 and 1
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatProbabilityPercent(probability, decimals = 2) {
  if (typeof probability !== 'number' || !Number.isFinite(probability)) {
    return '0.00%'
  }
  return `${(probability * 100).toFixed(decimals)}%`
}

/**
 * Format raw probability float to fixed precision for technical inspection.
 * Example: 0.003428 -> "0.003428"
 *
 * @param {number} probability
 * @param {number} [decimals=6]
 * @returns {string}
 */
export function formatRawProbability(probability, decimals = 6) {
  if (typeof probability !== 'number' || !Number.isFinite(probability)) {
    return '0.000000'
  }
  return probability.toFixed(decimals)
}

/**
 * Calculate derived temperature difference.
 * Frontend-derived value: Process Temperature [K] - Air Temperature [K].
 * Note: Never send this derived value back to the FastAPI /predict endpoint.
 *
 * @param {number|string} processTemp
 * @param {number|string} airTemp
 * @returns {number}
 */
export function calculateTemperatureDifference(processTemp, airTemp) {
  const p = Number(processTemp)
  const a = Number(airTemp)
  if (!Number.isFinite(p) || !Number.isFinite(a)) {
    return 0
  }
  return Number((p - a).toFixed(2))
}

/**
 * Format a sensor key and numeric value with its standard engineering unit.
 *
 * @param {string} key
 * @param {number|string} value
 * @returns {{ formattedValue: string, unit: string, fullString: string }}
 */
export function formatSensorReading(key, value) {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return { formattedValue: '—', unit: '', fullString: '—' }
  }

  switch (key) {
    case 'air_temperature':
    case 'process_temperature':
    case 'temperature_difference': {
      const val = num.toFixed(1)
      return { formattedValue: val, unit: 'K', fullString: `${val} K` }
    }
    case 'rotational_speed': {
      const val = Math.round(num).toLocaleString('en-US')
      return { formattedValue: val, unit: 'rpm', fullString: `${val} rpm` }
    }
    case 'torque': {
      const val = num.toFixed(1)
      return { formattedValue: val, unit: 'Nm', fullString: `${val} Nm` }
    }
    case 'tool_wear': {
      const val = Math.round(num).toLocaleString('en-US')
      return { formattedValue: val, unit: 'min', fullString: `${val} min` }
    }
    default:
      return { formattedValue: String(value), unit: '', fullString: String(value) }
  }
}
