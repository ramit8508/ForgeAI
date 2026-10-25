/**
 * ForgeAI — Health API service
 *
 * Consumes: GET /health
 */

import { apiClient } from './client'

export function getHealthStatus() {
  return apiClient('/health')
}
