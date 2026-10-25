/**
 * ForgeAI — Application configuration
 *
 * Centralises environment-specific and product-level constants so that
 * no component ever imports `import.meta.env` directly.
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
    estimators: 300,
    maxDepth: 10,
    minSamplesLeaf: 3,
  },
  risk: {
    low: { max: 0.3, label: 'LOW', tone: 'success' },
    medium: { min: 0.3, max: 0.7, label: 'MEDIUM', tone: 'warning' },
    high: { min: 0.7, label: 'HIGH', tone: 'danger' },
  },
})
