/**
 * ForgeAI — Explainability Data Contract
 *
 * Defines the expected shape of the SHAP explanation data as it will be
 * consumed by the frontend once the backend exposes a /predict/explain endpoint.
 *
 * This file is the authoritative reference for the data contract between
 * the FastAPI backend and the React frontend for explainability features.
 *
 * IMPORTANT: The shapes defined here are contracts, not mock data.
 * They are used by the service layer for validation and by tests for typing.
 */

/**
 * Backend response shape from POST /predict/explain
 *
 * @example
 * {
 *   base_value: 0.0123,
 *   output_value: 0.0842,
 *   features: [
 *     {
 *       name: "Tool wear [min]",
 *       display_name: "Tool Wear",
 *       value: 106,
 *       unit: "min",
 *       shap_value: 0.0421,
 *       direction: "positive"
 *     },
 *     {
 *       name: "Torque [Nm]",
 *       display_name: "Torque",
 *       value: 38.9,
 *       unit: "Nm",
 *       shap_value: 0.0214,
 *       direction: "positive"
 *     },
 *     {
 *       name: "Rotational speed [rpm]",
 *       display_name: "Rotational Speed",
 *       value: 1486,
 *       unit: "rpm",
 *       shap_value: -0.0152,
 *       direction: "negative"
 *     },
 *     {
 *       name: "Process temperature [K]",
 *       display_name: "Process Temperature",
 *       value: 310.0,
 *       unit: "K",
 *       shap_value: 0.0098,
 *       direction: "positive"
 *     },
 *     {
 *       name: "Air temperature [K]",
 *       display_name: "Air Temperature",
 *       value: 300.7,
 *       unit: "K",
 *       shap_value: -0.0062,
 *       direction: "negative"
 *     }
 *   ]
 * }
 */

/**
 * Normalized frontend shape (after service transformation)
 *
 * @typedef {Object} ExplanationFeature
 * @property {string} name         – Backend feature name (e.g. "Tool wear [min]")
 * @property {string} displayName  – Human label (e.g. "Tool Wear")
 * @property {number} value        – Original sensor input value
 * @property {string} unit         – Engineering unit (K, rpm, Nm, min)
 * @property {number} shapValue    – SHAP contribution magnitude
 * @property {'positive'|'negative'} direction – Contribution direction
 */

/**
 * @typedef {Object} Explanation
 * @property {number} baseValue        – Model base prediction value
 * @property {number} outputValue      – Model output prediction value
 * @property {ExplanationFeature[]} features – Sorted by abs(shapValue) descending
 */

/**
 * @typedef {Object} ExplanationResult
 * @property {'success'|'unavailable'|'error'} status
 * @property {Explanation|null} explanation
 * @property {string|null} errorMessage
 */

/**
 * Feature name to display name mapping.
 * Used as fallback when the backend does not provide display_name.
 */
export const FEATURE_DISPLAY_MAP = Object.freeze({
  'Air temperature [K]': { displayName: 'Air Temperature', unit: 'K' },
  'Process temperature [K]': { displayName: 'Process Temperature', unit: 'K' },
  'Rotational speed [rpm]': { displayName: 'Rotational Speed', unit: 'rpm' },
  'Torque [Nm]': { displayName: 'Torque', unit: 'Nm' },
  'Tool wear [min]': { displayName: 'Tool Wear', unit: 'min' },
})

/**
 * Explainability status constants for type-safe comparisons.
 */
export const EXPLANATION_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  UNAVAILABLE: 'unavailable',
  ERROR: 'error',
})
