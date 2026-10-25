/**
 * ForgeAI — Predictions API service
 *
 * Consumes: POST /predict
 *
 * Request body (5 raw sensor inputs):
 *   { air_temperature, process_temperature, rotational_speed, torque, tool_wear }
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
    body: JSON.stringify(sensorData),
  })
}
