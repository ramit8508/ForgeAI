/**
 * ForgeAI — useExplainability Hook
 *
 * Manages the lifecycle of requesting and displaying SHAP-based
 * model explanations for a completed prediction.
 *
 * State machine:
 *   idle → loading → success | unavailable | error
 *                                ↓
 *                             (retry) → loading → ...
 *
 * The hook keeps explanation state fully separated from prediction state
 * so that a SHAP failure never destroys the prediction result.
 */

import { useState, useCallback } from 'react'
import { getExplanation } from '../services/explainabilityService'

/**
 * @typedef {'idle'|'loading'|'success'|'unavailable'|'error'} ExplainabilityStatus
 */

/**
 * @param {Object|null} sensorSnapshot - The sensor inputs used for the prediction
 * @returns {{
 *   explanationStatus: ExplainabilityStatus,
 *   explanation: import('../services/explainabilityService').Explanation|null,
 *   errorMessage: string|null,
 *   isExpanded: boolean,
 *   requestExplanation: () => Promise<void>,
 *   retryExplanation: () => Promise<void>,
 *   toggleExpanded: () => void,
 *   resetExplanation: () => void,
 * }}
 */
export function useExplainability(sensorSnapshot) {
  const [status, setStatus] = useState('idle')
  const [explanation, setExplanation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchExplanation = useCallback(async () => {
    if (!sensorSnapshot) return

    setStatus('loading')
    setErrorMessage(null)

    const result = await getExplanation(sensorSnapshot)

    setStatus(result.status)
    setExplanation(result.explanation)
    setErrorMessage(result.errorMessage)

    // Auto-expand on success
    if (result.status === 'success') {
      setIsExpanded(true)
    }
  }, [sensorSnapshot])

  const requestExplanation = useCallback(async () => {
    setIsExpanded(true)
    await fetchExplanation()
  }, [fetchExplanation])

  const retryExplanation = useCallback(async () => {
    await fetchExplanation()
  }, [fetchExplanation])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const resetExplanation = useCallback(() => {
    setStatus('idle')
    setExplanation(null)
    setErrorMessage(null)
    setIsExpanded(false)
  }, [])

  return {
    explanationStatus: status,
    explanation,
    errorMessage,
    isExpanded,
    requestExplanation,
    retryExplanation,
    toggleExpanded,
    resetExplanation,
  }
}

export default useExplainability
