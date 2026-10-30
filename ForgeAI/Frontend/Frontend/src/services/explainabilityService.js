/**
 * ForgeAI — Explainability Service
 *
 * Handles the data transformation between the raw backend SHAP response
 * and the normalized frontend contract consumed by UI components.
 *
 * Architecture:
 *   UI Components
 *       ↓
 *   useExplainability hook
 *       ↓
 *   explainabilityService (this file)
 *       ↓
 *       POST /predict/explain
 */

import { postExplanation } from './api/explainability'
import { ApiClientError } from './api/client'

/**
 * @typedef {Object} ExplanationFeature
 * @property {string} name        - Raw backend feature name (e.g. "Tool wear [min]")
 * @property {string} displayName - Human-readable label (e.g. "Tool Wear")
 * @property {number} value       - Original sensor input value
 * @property {string} unit        - Engineering unit
 * @property {number} shapValue   - SHAP contribution magnitude
 * @property {'positive'|'negative'} direction - Contribution direction
 */

/**
 * @typedef {Object} Explanation
 * @property {number} baseValue       - Model base prediction value
 * @property {number} outputValue     - Model output prediction value
 * @property {ExplanationFeature[]} features - Sorted by abs SHAP magnitude (desc)
 */

/**
 * @typedef {Object} ExplanationResult
 * @property {'success'|'unavailable'|'error'} status
 * @property {Explanation|null} explanation
 * @property {string|null} errorMessage
 */

/**
 * Feature display name mapping. If the backend provides `display_name`,
 * that is used. Otherwise, this map is the fallback.
 */
const FEATURE_DISPLAY_NAMES = {
  'Air temperature [K]': 'Air Temperature',
  'Process temperature [K]': 'Process Temperature',
  Temperature_difference: 'Temperature Difference',
  'Rotational speed [rpm]': 'Rotational Speed',
  'Torque [Nm]': 'Torque',
  'Tool wear [min]': 'Tool Wear',
}

/**
 * Feature unit mapping fallback.
 */
const FEATURE_UNITS = {
  'Air temperature [K]': 'K',
  'Process temperature [K]': 'K',
  Temperature_difference: 'K',
  'Rotational speed [rpm]': 'rpm',
  'Torque [Nm]': 'Nm',
  'Tool wear [min]': 'min',
}

/**
 * Validates the shape of a single feature in the backend explanation response.
 */
function isValidFeature(f) {
  return (
    typeof f === 'object' &&
    f !== null &&
    typeof f.name === 'string' &&
    typeof f.value === 'number' &&
    Number.isFinite(f.value) &&
    typeof f.shap_value === 'number' &&
    Number.isFinite(f.shap_value) &&
    (f.direction === 'positive' || f.direction === 'negative')
  )
}

/**
 * Validates the overall explanation response shape from the backend.
 */
function isExplanationResponse(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.base_value === 'number' &&
    Number.isFinite(value.base_value) &&
    typeof value.output_value === 'number' &&
    Number.isFinite(value.output_value) &&
    Array.isArray(value.features) &&
    value.features.length > 0 &&
    value.features.every(isValidFeature)
  )
}

/**
 * Normalize a backend feature object into the frontend contract.
 *
 * @param {Object} raw - Raw feature from backend
 * @returns {ExplanationFeature}
 */
function normalizeFeature(raw) {
  return {
    name: raw.name,
    displayName: raw.display_name || FEATURE_DISPLAY_NAMES[raw.name] || raw.name,
    value: raw.value,
    unit: raw.unit || FEATURE_UNITS[raw.name] || '',
    shapValue: raw.shap_value,
    direction: raw.direction,
  }
}

/**
 * Request a model explanation for the given sensor inputs.
 *
 * Returns a structured result with status to allow the UI to cleanly
 * differentiate between success, "not available" (endpoint doesn't exist),
 * and error states.
 *
 * @param {{
 *   air_temperature: number,
 *   process_temperature: number,
 *   rotational_speed: number,
 *   torque: number,
 *   tool_wear: number
 * }} sensorInput
 * @returns {Promise<ExplanationResult>}
 */
export async function getExplanation(sensorInput) {
  try {
    const response = await postExplanation(sensorInput)

    if (!isExplanationResponse(response)) {
      return {
        status: 'error',
        explanation: null,
        errorMessage: 'Received an invalid explanation response from the analysis service.',
      }
    }

    // Normalize and sort by absolute SHAP magnitude (largest first)
    const features = response.features
      .map(normalizeFeature)
      .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue))

    return {
      status: 'success',
      explanation: {
        baseValue: response.base_value,
        outputValue: response.output_value,
        features,
      },
      errorMessage: null,
    }
  } catch (error) {
    // A 404 or network error likely means the endpoint doesn't exist yet
    if (error instanceof ApiClientError) {
      if (error.status === 404 || error.kind === 'network' || error.kind === 'server') {
        return {
          status: 'unavailable',
          explanation: null,
          errorMessage: null,
        }
      }
    }

    return {
      status: 'error',
      explanation: null,
      errorMessage:
        error?.message || 'Model explanation could not be retrieved. Please try again.',
    }
  }
}

export const explainabilityService = Object.freeze({
  getExplanation,
})

export default explainabilityService
