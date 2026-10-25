/**
 * ForgeAI — HTTP client
 *
 * Thin wrapper around `fetch`.
 * All API calls should go through this client so that base URL,
 * auth headers, and error handling are centralised.
 */

import { config } from '../../lib/config'

const BASE_URL = config.api.baseUrl.replace(/\/+$/, '')
const DEFAULT_TIMEOUT_MS = 10000

export class ApiClientError extends Error {
  constructor(message, { kind = 'unknown', status = null, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiClientError'
    this.kind = kind
    this.status = status
  }
}

/**
 * @param {string} path   – path relative to the API root, e.g. '/predict'
 * @param {RequestInit} options – standard fetch options
 * @returns {Promise<unknown>}
 */
export async function apiClient(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new ApiClientError(
        response.status >= 500
          ? 'The prediction service is currently unavailable.'
          : 'The prediction request was rejected.',
        {
          kind: response.status >= 500 ? 'server' : 'validation',
          status: response.status,
        },
      )
    }

    try {
      return await response.json()
    } catch (error) {
      throw new ApiClientError('The prediction service returned an invalid response.', {
        kind: 'malformed',
        cause: error,
      })
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    if (error?.name === 'AbortError') {
      throw new ApiClientError('Prediction request timed out. Please try again.', {
        kind: 'timeout',
        cause: error,
      })
    }

    throw new ApiClientError('The prediction service is currently unavailable.', {
      kind: 'network',
      cause: error,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}
