/**
 * ForgeAI — Prediction Mock & Configuration Data
 *
 * Centralises default sensor values, field definitions, demo presets,
 * and mock prediction responses for the Prediction Workspace.
 *
 * All demo and baseline values live here rather than in JSX components.
 */

export const DEFAULT_SENSOR_VALUES = Object.freeze({
  air_temperature: 300.7,
  process_temperature: 310.0,
  rotational_speed: 1486,
  torque: 38.9,
  tool_wear: 106,
})

export const SENSOR_FIELD_DEFINITIONS = Object.freeze({
  air_temperature: {
    key: 'air_temperature',
    label: 'Air Temperature',
    unit: 'K',
    step: '0.1',
    min: 0.1,
    type: 'decimal',
    description: 'Ambient operating temperature around machine enclosure.',
    placeholder: '300.7',
    validation: {
      min: 0.0001,
      minMessage: 'Air temperature must be greater than 0 K.',
      requiredMessage: 'Air temperature is required.',
    },
  },
  process_temperature: {
    key: 'process_temperature',
    label: 'Process Temperature',
    unit: 'K',
    step: '0.1',
    min: 0.1,
    type: 'decimal',
    description: 'Operating temperature measured during the manufacturing cycle.',
    placeholder: '310.0',
    validation: {
      min: 0.0001,
      minMessage: 'Process temperature must be greater than 0 K.',
      requiredMessage: 'Process temperature is required.',
    },
  },
  rotational_speed: {
    key: 'rotational_speed',
    label: 'Rotational Speed',
    unit: 'rpm',
    step: '1',
    min: 0,
    type: 'integer',
    description: 'Rotational velocity of the machine spindle or shaft.',
    placeholder: '1486',
    validation: {
      min: 0,
      minMessage: 'Rotational speed cannot be negative.',
      requiredMessage: 'Rotational speed is required.',
    },
  },
  torque: {
    key: 'torque',
    label: 'Torque',
    unit: 'Nm',
    step: '0.1',
    min: 0,
    type: 'decimal',
    description: 'Mechanical resistance torque exerted on the drive assembly.',
    placeholder: '38.9',
    validation: {
      min: 0,
      minMessage: 'Torque cannot be negative.',
      requiredMessage: 'Torque is required.',
    },
  },
  tool_wear: {
    key: 'tool_wear',
    label: 'Tool Wear',
    unit: 'min',
    step: '1',
    min: 0,
    type: 'integer',
    description: 'Cumulative cutting or processing tool contact time.',
    placeholder: '106',
    validation: {
      min: 0,
      minMessage: 'Tool wear cannot be negative.',
      requiredMessage: 'Tool wear is required.',
    },
  },
})

export const DERIVED_METRIC_DEFINITION = Object.freeze({
  key: 'temperature_difference',
  label: 'Temperature Difference',
  unit: 'K',
  formula: 'Process Temp - Air Temp',
  description: 'Calculated automatically. Consistent with backend feature engineering.',
})

/**
 * Pre-configured sensor presets for testing both nominal and failure scenarios.
 */
export const PREDICTION_PRESETS = Object.freeze([
  {
    id: 'nominal',
    name: 'Nominal Baseline',
    badge: 'Healthy',
    tone: 'success',
    values: {
      air_temperature: 300.7,
      process_temperature: 310.0,
      rotational_speed: 1486,
      torque: 38.9,
      tool_wear: 106,
    },
  },
  {
    id: 'thermal_overstrain',
    name: 'Thermal Overstrain',
    badge: 'Failure Risk',
    tone: 'danger',
    values: {
      air_temperature: 304.5,
      process_temperature: 313.8,
      rotational_speed: 1320,
      torque: 68.5,
      tool_wear: 215,
    },
  },
  {
    id: 'tool_wear_critical',
    name: 'Severe Tool Wear',
    badge: 'Elevated Risk',
    tone: 'warning',
    values: {
      air_temperature: 301.2,
      process_temperature: 310.6,
      rotational_speed: 1410,
      torque: 54.2,
      tool_wear: 245,
    },
  },
])

/**
 * Standard demo prediction responses.
 * Shape matches FastAPI PredictionResponse contract:
 * { machine_failure: 0|1, failure_probability: float, risk_level: "LOW"|"MEDIUM"|"HIGH" }
 */
export const DEMO_PREDICTION_RESULTS = Object.freeze({
  nominal: {
    machine_failure: 0,
    failure_probability: 0.003428,
    risk_level: 'LOW',
    recommended_action: 'Operating within nominal tolerances. Maintain standard scheduled monitoring.',
    evaluated_at: null,
  },
  high_risk: {
    machine_failure: 1,
    failure_probability: 0.824,
    risk_level: 'HIGH',
    recommended_action: 'Critical failure risk detected under thermal and torque stress. Immediate spindle & tool inspection recommended.',
    evaluated_at: null,
  },
  medium_risk: {
    machine_failure: 0,
    failure_probability: 0.412,
    risk_level: 'MEDIUM',
    recommended_action: 'Elevated wear profile detected. Schedule toolhead checkup during next maintenance window.',
    evaluated_at: null,
  },
})

/**
 * Multi-step inference workflow descriptions for the visual processing state.
 */
export const INFERENCE_PIPELINE_STEPS = Object.freeze([
  { id: 'validate', label: 'Sensor data validated against schema constraints' },
  { id: 'inference', label: 'Running Random Forest inference model' },
  { id: 'risk', label: 'Calculating risk classification & decision boundaries' },
])
