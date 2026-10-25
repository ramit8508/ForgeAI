/**
 * ForgeAI — Prediction Form Validation
 *
 * Implements client-side validation rules matching FastAPI backend Pydantic constraints:
 * - Air temperature > 0
 * - Process temperature > 0
 * - Rotational speed >= 0
 * - Torque >= 0
 * - Tool wear >= 0
 */

import { SENSOR_FIELD_DEFINITIONS } from '../data/predictions/prediction.mock'

/**
 * Validates a single sensor field.
 *
 * @param {string} fieldKey
 * @param {any} rawValue
 * @returns {string | null} Error message or null if valid
 */
export function validateField(fieldKey, rawValue) {
  const definition = SENSOR_FIELD_DEFINITIONS[fieldKey]
  if (!definition) return null

  // Check required / non-empty
  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return definition.validation.requiredMessage
  }

  const numValue = Number(rawValue)

  if (isNaN(numValue) || !isFinite(numValue)) {
    return 'Please enter a valid numeric value.'
  }

  // Field-specific constraints
  if (fieldKey === 'air_temperature') {
    if (numValue <= 0) {
      return 'Air temperature must be greater than 0 K.'
    }
  } else if (fieldKey === 'process_temperature') {
    if (numValue <= 0) {
      return 'Process temperature must be greater than 0 K.'
    }
  } else if (fieldKey === 'rotational_speed') {
    if (numValue < 0) {
      return 'Rotational speed cannot be negative.'
    }
  } else if (fieldKey === 'torque') {
    if (numValue < 0) {
      return 'Torque cannot be negative.'
    }
  } else if (fieldKey === 'tool_wear') {
    if (numValue < 0) {
      return 'Tool wear cannot be negative.'
    }
  }

  return null
}

/**
 * Validates all sensor fields in a form submission.
 *
 * @param {Record<string, any>} values
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateSensorForm(values) {
  const errors = {}

  Object.keys(SENSOR_FIELD_DEFINITIONS).forEach((key) => {
    const error = validateField(key, values[key])
    if (error) {
      errors[key] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
