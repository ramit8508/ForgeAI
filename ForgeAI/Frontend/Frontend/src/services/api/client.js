/**
 * ForgeAI — HTTP client
 *
 * Thin wrapper around `fetch`.
 * All API calls should go through this client so that base URL,
 * auth headers, and error handling are centralised.
 */

import { config } from '../../lib/config'

const BASE_URL = config.api.baseUrl

/**
 * @param {string} path   – path relative to the API root, e.g. '/predict'
 * @param {RequestInit} options – standard fetch options
 * @returns {Promise<any>}
 */
export async function apiClient(path, options = {}) {
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`API ${response.status}: ${body || response.statusText}`)
  }

  return response.json()
}
