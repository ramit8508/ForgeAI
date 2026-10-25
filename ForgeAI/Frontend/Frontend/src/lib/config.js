/**
 * ForgeAI — Application configuration
 *
 * Centralises environment-specific, model architecture, and product-level constants.
 * All model specifications (Random Forest, threshold 0.45), risk band boundaries,
 * operational interpretations, and recommendations reside here rather than
 * being scattered across JSX components.
 */

export const config = Object.freeze({
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'ForgeAI',
    version: import.meta.env.VITE_APP_VERSION || '0.1.0',
  },
  model: {
    name: 'Random Forest',
    threshold: 0.45,
    thresholdPercent: '45.0%',
    estimators: 300,
    maxDepth: 10,
    minSamplesLeaf: 3,
    description: 'Ensemble binary classifier calibrated for industrial machine failure prediction.',
  },
  risk: {
    low: {
      min: 0.0,
      max: 0.3,
      label: 'LOW',
      tone: 'success',
      qualifier: 'Very Low Risk',
      interpretation: 'Current operating conditions indicate a low likelihood of machine failure.',
      recommendation: 'Continue normal monitoring.',
    },
    medium: {
      min: 0.3,
      max: 0.7,
      label: 'MEDIUM',
      tone: 'warning',
      qualifier: 'Elevated Risk',
      interpretation: 'Current conditions show elevated failure risk. Consider reviewing machine operating conditions.',
      recommendation: 'Review operating conditions and monitor the machine closely.',
    },
    high: {
      min: 0.7,
      max: 1.0,
      label: 'HIGH',
      tone: 'danger',
      qualifier: 'Critical Risk',
      interpretation: 'Current conditions indicate a high failure risk. Prioritize machine inspection.',
      recommendation: 'Prioritize inspection and maintenance review.',
    },
  },
})

/**
 * Retrieve centralized risk assessment configuration by risk band level.
 * @param {'LOW' | 'MEDIUM' | 'HIGH' | string} level
 * @returns {{
 *   min: number,
 *   max: number,
 *   label: 'LOW' | 'MEDIUM' | 'HIGH',
 *   tone: 'success' | 'warning' | 'danger',
 *   qualifier: string,
 *   interpretation: string,
 *   recommendation: string
 * }}
 */
export function getRiskAssessment(level) {
  const normalized = String(level || 'LOW').toUpperCase()
  if (normalized === 'HIGH') return config.risk.high
  if (normalized === 'MEDIUM') return config.risk.medium
  return config.risk.low
}

export default config
