/**
 * ForgeAI — Predictions API service
 *
 * Consumes: POST /predict
 *
 * Request body (5 raw sensor inputs using the backend's field aliases):
 *   { "Air temperature [K]": number, ... }
 *
 * Response shape:
 *   { machine_failure: 0|1, failure_probability: float, risk_level: "LOW"|"MEDIUM"|"HIGH" }
 */

import { apiClient } from './client'

/**
 * @param {{ air_temperature: number, process_temperature: number, rotational_speed: number, torque: number, tool_wear: number }} sensorData
 */
export function postPrediction(sensorData) {
  return apiClient('/predict', {
    method: 'POST',
    body: JSON.stringify({
      'Air temperature [K]': sensorData.air_temperature,
      'Process temperature [K]': sensorData.process_temperature,
      'Rotational speed [rpm]': sensorData.rotational_speed,
      'Torque [Nm]': sensorData.torque,
      'Tool wear [min]': sensorData.tool_wear,
    }),
  })
}
