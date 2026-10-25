import { postPrediction } from './api/predictions'

const RISK_LEVELS = new Set(['LOW', 'MEDIUM', 'HIGH'])

function isPredictionResponse(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.machine_failure === 0 || value.machine_failure === 1) &&
    typeof value.failure_probability === 'number' &&
    Number.isFinite(value.failure_probability) &&
    value.failure_probability >= 0 &&
    value.failure_probability <= 1 &&
    typeof value.risk_level === 'string' &&
    RISK_LEVELS.has(value.risk_level)
  )
}

/**
 * Send raw sensor readings to FastAPI and normalize its response for the UI.
 *
 * @param {{
 *   air_temperature: number,
 *   process_temperature: number,
 *   rotational_speed: number,
 *   torque: number,
 *   tool_wear: number
 * }} sensorInput
 * @returns {Promise<{machineFailure: boolean, failureProbability: number, riskLevel: 'LOW'|'MEDIUM'|'HIGH'}>}
 */
export async function predictMachine(sensorInput) {
  const response = await postPrediction(sensorInput)

  if (!isPredictionResponse(response)) {
    const error = new Error('Received an invalid prediction response. Please try again.')
    error.name = 'InvalidPredictionResponseError'
    throw error
  }

  return {
    machineFailure: response.machine_failure === 1,
    failureProbability: response.failure_probability,
    riskLevel: response.risk_level,
  }
}

export const predictionService = Object.freeze({
  predict: predictMachine,
})

export default predictionService
