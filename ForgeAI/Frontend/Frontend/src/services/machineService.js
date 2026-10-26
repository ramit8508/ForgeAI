/**
 * ForgeAI — Machine Service
 *
 * Data layer abstraction for retrieving monitored machine fleet records
 * and single machine diagnostics.
 *
 * Architecture:
 *   UI Components (MachineTable, MachineDetail)
 *       ↓
 *   useMachines hook
 *       ↓
 *   machineService (this file)
 *       ↓
 *   FastAPI machine endpoints (future GET /machines, GET /machines/{machine_id})
 *   or mock data (current)
 */

import { MOCK_MACHINES } from '../data/mock/machines.mock'

/**
 * Fetch all monitored machines in the fleet.
 *
 * In current phase: returns simulated response based on the mock fleet contract.
 * In future phase: will issue an HTTP GET to the FastAPI machine fleet endpoint.
 *
 * @returns {Promise<Array<typeof MOCK_MACHINES[0]>>}
 */
export async function getMachines() {
  // Simulate asynchronous API behavior with an immediate resolving Promise
  return Promise.resolve(MOCK_MACHINES.map((machine) => ({ ...machine })))
}

/**
 * Fetch a single machine by its technical identifier (e.g. "MCH-001").
 *
 * @param {string} machineId
 * @returns {Promise<typeof MOCK_MACHINES[0] | null>} Resolves to machine object or null if not found
 */
export async function getMachineById(machineId) {
  if (!machineId || typeof machineId !== 'string') {
    return Promise.resolve(null)
  }

  const match = MOCK_MACHINES.find(
    (m) => m.id.toLowerCase() === machineId.trim().toLowerCase(),
  )

  return Promise.resolve(match ? { ...match } : null)
}

export const machineService = Object.freeze({
  getMachines,
  getMachineById,
})

export default machineService
