/**
 * ForgeAI — Mock Prediction History Data
 *
 * ⚠️ DEMO / MOCK DATA — will be replaced by future FastAPI prediction history endpoints
 * (e.g. GET /predictions/history, GET /predictions/history/{id}).
 *
 * Structured to mirror the future API contract so swapping to live endpoints
 * is clean and isolated within predictionHistoryService.js.
 *
 * Contract:
 * {
 *   id: string,
 *   machine: { id: string, name: string },
 *   createdAt: string (ISO 8601),
 *   result: { machineFailure: 0|1, failureProbability: number, riskLevel: 'LOW'|'MEDIUM'|'HIGH' },
 *   model: { name: string, threshold: number },
 *   inputs: { airTemperature, processTemperature, temperatureDifference, rotationalSpeed, torque, toolWear },
 *   hasExplanation: boolean
 * }
 */

export const MOCK_PREDICTION_HISTORY = Object.freeze([
  {
    id: 'pred-101',
    machine: {
      id: 'MCH-001',
      name: 'Production Line A — Motor 01',
    },
    createdAt: '2026-10-26T14:32:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.03428,
      riskLevel: 'LOW',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 298.2,
      processTemperature: 308.5,
      temperatureDifference: 10.3,
      rotationalSpeed: 1510,
      torque: 37.4,
      toolWear: 48,
    },
    hasExplanation: true,
  },
  {
    id: 'pred-102',
    machine: {
      id: 'MCH-004',
      name: 'Production Line B — Cutting Drive 02',
    },
    createdAt: '2026-10-26T14:28:00Z',
    result: {
      machineFailure: 1,
      failureProbability: 0.814,
      riskLevel: 'HIGH',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 304.5,
      processTemperature: 313.8,
      temperatureDifference: 9.3,
      rotationalSpeed: 1320,
      torque: 68.5,
      toolWear: 215,
    },
    hasExplanation: true,
  },
  {
    id: 'pred-103',
    machine: {
      id: 'MCH-002',
      name: 'Production Line A — Spindle Drive 02',
    },
    createdAt: '2026-10-26T14:17:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.427,
      riskLevel: 'MEDIUM',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 301.8,
      processTemperature: 311.2,
      temperatureDifference: 9.4,
      rotationalSpeed: 1410,
      torque: 52.8,
      toolWear: 198,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-104',
    machine: {
      id: 'MCH-008',
      name: 'Tooling Cell 2 — 5-Axis Milling Head',
    },
    createdAt: '2026-10-26T13:45:00Z',
    result: {
      machineFailure: 1,
      failureProbability: 0.865,
      riskLevel: 'HIGH',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 305.1,
      processTemperature: 314.5,
      temperatureDifference: 9.4,
      rotationalSpeed: 1290,
      torque: 71.2,
      toolWear: 236,
    },
    hasExplanation: true,
  },
  {
    id: 'pred-105',
    machine: {
      id: 'MCH-003',
      name: 'Production Line B — Lathe Spindle 01',
    },
    createdAt: '2026-10-26T12:30:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.082,
      riskLevel: 'LOW',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 297.6,
      processTemperature: 307.4,
      temperatureDifference: 9.8,
      rotationalSpeed: 1560,
      torque: 34.2,
      toolWear: 32,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-106',
    machine: {
      id: 'MCH-006',
      name: 'Finishing Line — Grinding Head 01',
    },
    createdAt: '2026-10-26T11:15:00Z',
    result: {
      machineFailure: 1,
      failureProbability: 0.782,
      riskLevel: 'HIGH',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 303.8,
      processTemperature: 312.9,
      temperatureDifference: 9.1,
      rotationalSpeed: 1380,
      torque: 62.4,
      toolWear: 228,
    },
    hasExplanation: true,
  },
  {
    id: 'pred-107',
    machine: {
      id: 'MCH-005',
      name: 'Stamping Cell 1 — Feed Servo',
    },
    createdAt: '2026-10-26T09:50:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.051,
      riskLevel: 'LOW',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 298.8,
      processTemperature: 308.7,
      temperatureDifference: 9.9,
      rotationalSpeed: 1495,
      torque: 39.1,
      toolWear: 64,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-108',
    machine: {
      id: 'MCH-011',
      name: 'Production Line A — Robot Arm Joint 3',
    },
    createdAt: '2026-10-25T16:20:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.512,
      riskLevel: 'MEDIUM',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 302.4,
      processTemperature: 311.9,
      temperatureDifference: 9.5,
      rotationalSpeed: 1420,
      torque: 55.3,
      toolWear: 185,
    },
    hasExplanation: true,
  },
  {
    id: 'pred-109',
    machine: {
      id: 'MCH-009',
      name: 'Hydraulic Power Unit — Main Pump 01',
    },
    createdAt: '2026-10-25T10:40:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.358,
      riskLevel: 'MEDIUM',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 301.2,
      processTemperature: 310.6,
      temperatureDifference: 9.4,
      rotationalSpeed: 1440,
      torque: 48.6,
      toolWear: 172,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-110',
    machine: {
      id: 'MCH-007',
      name: 'Assembly Line C — Conveyor Drive',
    },
    createdAt: '2026-10-24T15:10:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.019,
      riskLevel: 'LOW',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 296.9,
      processTemperature: 306.8,
      temperatureDifference: 9.9,
      rotationalSpeed: 1530,
      torque: 32.5,
      toolWear: 18,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-111',
    machine: {
      id: 'MCH-004',
      name: 'Production Line B — Cutting Drive 02',
    },
    createdAt: '2026-10-23T11:05:00Z',
    result: {
      machineFailure: 1,
      failureProbability: 0.748,
      riskLevel: 'HIGH',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 303.9,
      processTemperature: 313.2,
      temperatureDifference: 9.3,
      rotationalSpeed: 1340,
      torque: 65.1,
      toolWear: 195,
    },
    hasExplanation: true,
  },
  {
    id: 'pred-112',
    machine: {
      id: 'MCH-002',
      name: 'Production Line A — Spindle Drive 02',
    },
    createdAt: '2026-10-21T08:30:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.285,
      riskLevel: 'LOW',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 299.4,
      processTemperature: 309.1,
      temperatureDifference: 9.7,
      rotationalSpeed: 1460,
      torque: 42.1,
      toolWear: 120,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-113',
    machine: {
      id: 'MCH-012',
      name: 'Coolant Distribution — Secondary Pump',
    },
    createdAt: '2026-10-18T14:15:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.445,
      riskLevel: 'MEDIUM',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 301.6,
      processTemperature: 310.8,
      temperatureDifference: 9.2,
      rotationalSpeed: 1400,
      torque: 50.2,
      toolWear: 190,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-114',
    machine: {
      id: 'MCH-001',
      name: 'Production Line A — Motor 01',
    },
    createdAt: '2026-10-12T09:00:00Z',
    result: {
      machineFailure: 0,
      failureProbability: 0.022,
      riskLevel: 'LOW',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 297.2,
      processTemperature: 307.1,
      temperatureDifference: 9.9,
      rotationalSpeed: 1520,
      torque: 35.8,
      toolWear: 22,
    },
    hasExplanation: false,
  },
  {
    id: 'pred-115',
    machine: {
      id: 'MCH-008',
      name: 'Tooling Cell 2 — 5-Axis Milling Head',
    },
    createdAt: '2026-10-05T16:45:00Z',
    result: {
      machineFailure: 1,
      failureProbability: 0.892,
      riskLevel: 'HIGH',
    },
    model: {
      name: 'Random Forest',
      threshold: 0.45,
    },
    inputs: {
      airTemperature: 305.8,
      processTemperature: 315.2,
      temperatureDifference: 9.4,
      rotationalSpeed: 1260,
      torque: 73.5,
      toolWear: 242,
    },
    hasExplanation: true,
  },
])
