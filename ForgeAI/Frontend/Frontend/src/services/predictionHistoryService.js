/**
 * ForgeAI — Prediction History Service
 *
 * Data layer abstraction for retrieving historical model prediction logs
 * and individual prediction records.
 *
 * Architecture:
 *   UI Components (PredictionHistoryTable, PredictionHistoryDetail)
 *       ↓
 *   usePredictionHistory hook
 *       ↓
 *   predictionHistoryService (this file)
 *       ↓
 *   FastAPI history endpoints (future GET /predictions/history, GET /predictions/history/{id})
 *   or mock data (current)
 */

import { MOCK_PREDICTION_HISTORY } from '../data/mock/predictionHistory.mock'

/**
 * Fetch historical prediction records.
 *
 * In current phase: returns simulated response based on the mock history contract.
 * In future phase: will issue an HTTP GET to the FastAPI prediction history endpoint.
 *
 * @returns {Promise<Array<typeof MOCK_PREDICTION_HISTORY[0]>>}
 */
export async function getPredictionHistory() {
  // Simulate asynchronous API behavior with an immediate resolving Promise
  return Promise.resolve(MOCK_PREDICTION_HISTORY.map((item) => ({ ...item })))
}

/**
 * Fetch a single prediction record by its identifier (e.g. "pred-101").
 *
 * @param {string} predictionId
 * @returns {Promise<typeof MOCK_PREDICTION_HISTORY[0] | null>}
 */
export async function getPredictionById(predictionId) {
  if (!predictionId || typeof predictionId !== 'string') {
    return Promise.resolve(null)
  }

  const match = MOCK_PREDICTION_HISTORY.find(
    (p) => p.id.toLowerCase() === predictionId.trim().toLowerCase(),
  )

  return Promise.resolve(match ? { ...match } : null)
}

export const predictionHistoryService = Object.freeze({
  getPredictionHistory,
  getPredictionById,
})

export default predictionHistoryService
