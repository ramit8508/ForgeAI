/**
 * ForgeAI — Explainability API service
 *
 * Consumes: POST /predict/explain
 *
 * Request body: same sensor payload as /predict
 *
 * Expected response shape (SHAP explanation contract):
 *   {
 *     base_value: float,
 *     output_value: float,
 *     features: [
 *       {
 *         name: "Tool wear [min]",
 *         display_name: "Tool Wear",
 *         value: 106,
 *         unit: "min",
 *         shap_value: 0.0421,
 *         direction: "positive" | "negative"
 *       },
 *       ...
 *     ]
 *   }
 *
 * The backend derives Temperature_difference from the five sensor values;
 * it must not be sent by the client.
 */

import { apiClient } from './client'

/**
 * Request a SHAP-based explanation for a prediction.
 *
 * @param {{
 *   air_temperature: number,
 *   process_temperature: number,
 *   rotational_speed: number,
 *   torque: number,
 *   tool_wear: number
 * }} sensorData
 * @returns {Promise<unknown>}
 */
export function postExplanation(sensorData) {
  return apiClient('/predict/explain', {
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
