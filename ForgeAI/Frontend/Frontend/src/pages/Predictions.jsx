import { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import PredictionHeader from '../components/predictions/PredictionHeader'
import SensorInputForm from '../components/predictions/SensorInputForm'
import PredictionPanel from '../components/predictions/PredictionPanel'
import PredictionResultView from '../components/predictions/PredictionResultView'
import { DEFAULT_SENSOR_VALUES } from '../data/predictions/prediction.mock'
import { predictionService } from '../services/predictionService'
import { validateField, validateSensorForm } from '../lib/predictionValidation'
import { useExplainability } from '../hooks/useExplainability'
import PredictionNavTabs from '../components/predictions/PredictionNavTabs'

/**
 * ForgeAI — Prediction Workspace Page (Part 6 + Part 7 + Part 8)
 *
 * Engineering workstation for submitting machine telemetry and evaluating
 * failure probabilities using predictive model inference.
 *
 * Implements seamless transition from INPUT mode to the upgraded
 * ANALYSIS RESULT view upon inference success, maintaining full operational
 * traceability and immediate ability to re-analyze.
 *
 * Part 7 adds SHAP-based model explainability.
 * Part 8 supports pre-populating telemetry from machine detail inspection.
 */
function Predictions() {
  const location = useLocation()
  const machineContext = location.state?.machineId ? location.state : null

  const [values, setValues] = useState(() => {
    if (location.state?.sensorValues) {
      return { ...location.state.sensorValues }
    }
    return { ...DEFAULT_SENSOR_VALUES }
  })
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [predictionState, setPredictionState] = useState('idle') // 'idle' | 'validating' | 'processing' | 'success' | 'error'
  const [predictionResult, setPredictionResult] = useState(null)
  const [analyzedSnapshot, setAnalyzedSnapshot] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [activePreset, setActivePreset] = useState(location.state?.sensorValues ? null : 'nominal')

  const [prevLocationKey, setPrevLocationKey] = useState(location.key)
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key)
    if (location.state?.sensorValues) {
      setValues({ ...location.state.sensorValues })
      setActivePreset(null)
    }
  }

  // Part 7: Explainability state (separate from prediction state)
  const explainability = useExplainability(analyzedSnapshot)

  /**
   * Field value change handler
   */
  const handleChange = useCallback(
    (fieldKey, newValue) => {
      setValues((prev) => ({ ...prev, [fieldKey]: newValue }))
      setActivePreset(null) // User edited custom values

      // If field was already touched or currently in error, validate live
      if (touched[fieldKey] || errors[fieldKey]) {
        const error = validateField(fieldKey, newValue)
        setErrors((prev) => {
          const next = { ...prev }
          if (error) {
            next[fieldKey] = error
          } else {
            delete next[fieldKey]
          }
          return next
        })
      }
    },
    [touched, errors],
  )

  /**
   * Field blur validation handler
   */
  const handleBlur = useCallback((fieldKey) => {
    setTouched((prev) => ({ ...prev, [fieldKey]: true }))
    setValues((currentValues) => {
      const error = validateField(fieldKey, currentValues[fieldKey])
      setErrors((prevErrors) => {
        const next = { ...prevErrors }
        if (error) {
          next[fieldKey] = error
        } else {
          delete next[fieldKey]
        }
        return next
      })
      return currentValues
    })
  }, [])

  /**
   * Load a calibrated telemetry preset
   */
  const handleSelectPreset = useCallback((preset) => {
    setValues({ ...preset.values })
    setActivePreset(preset.id)
    setTouched({})
    setErrors({})
    setPredictionState('idle')
    setPredictionResult(null)
    setAnalyzedSnapshot(null)
    setErrorMessage('')
    explainability.resetExplanation()
  }, [explainability])

  /**
   * Reset workspace to initial default demo state
   */
  const handleReset = useCallback(() => {
    setValues({ ...DEFAULT_SENSOR_VALUES })
    setTouched({})
    setErrors({})
    setPredictionState('idle')
    setPredictionResult(null)
    setAnalyzedSnapshot(null)
    setErrorMessage('')
    setActivePreset('nominal')
    explainability.resetExplanation()
  }, [explainability])

  /**
   * Return from Analysis Result view back to Input Form mode,
   * retaining current telemetry values so operator can adjust and re-run.
   */
  const handleAnalyzeAgain = useCallback(() => {
    setPredictionState('idle')
    explainability.resetExplanation()
  }, [explainability])

  /**
   * Submit sensor readings for AI inference
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault()
      if (predictionState === 'processing' || predictionState === 'validating') return

      // Mark all fields as touched
      const allTouched = Object.keys(DEFAULT_SENSOR_VALUES).reduce((acc, k) => {
        acc[k] = true
        return acc
      }, {})
      setTouched(allTouched)

      // Run full form validation
      setPredictionState('validating')
      const validation = validateSensorForm(values)

      if (!validation.isValid) {
        setErrors(validation.errors)
        setPredictionState('idle')
        setErrorMessage('')

        // Focus first field with an error
        const firstErrorKey = Object.keys(validation.errors)[0]
        const firstEl = document.getElementById(`sensor-input-${firstErrorKey}`)
        if (firstEl) {
          firstEl.focus()
        }
        return
      }

      setErrors({})
      setErrorMessage('')
      setPredictionState('processing')
      // Reset explainability when starting a new prediction
      explainability.resetExplanation()

      try {
        // Convert string inputs to parsed numbers for the prediction service
        const parsedInput = {
          air_temperature: Number(values.air_temperature),
          process_temperature: Number(values.process_temperature),
          rotational_speed: Number(values.rotational_speed),
          torque: Number(values.torque),
          tool_wear: Number(values.tool_wear),
        }

        // Lock the exact five-sensor snapshot used by both prediction and explanation.
        setAnalyzedSnapshot({ ...parsedInput })

        const result = await predictionService.predict(parsedInput)

        setPredictionResult(result)
        setPredictionState('success')
      } catch (err) {
        console.error('Prediction analysis failed:', err)
        setErrorMessage(
          err?.kind === 'timeout'
            ? 'Prediction request timed out. Please try again.'
            : err?.kind === 'validation'
              ? 'Some sensor values are invalid. Please review your inputs.'
              : err?.message || 'The prediction service is currently unavailable. Please try again.',
        )
        setPredictionState('error')
      }
    },
    [predictionState, values, explainability],
  )

  return (
    <PageContainer>
      {/* Navigation Switcher Tabs */}
      <PredictionNavTabs />

      {/* Workspace Header with Preset Selector */}
      <PredictionHeader
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
      />

      {/* Machine Context Banner if loaded from /machines/:machineId */}
      {machineContext && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-primary">{machineContext.machineId}</span>
            <span className="text-muted-foreground">•</span>
            <span>Pre-loaded telemetry snapshot from {machineContext.machineName || machineContext.machineId}</span>
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Fleet Context Active
          </span>
        </div>
      )}

      {/* Main Workspace: Transitions between INPUT and ANALYSIS RESULT */}
      {predictionState === 'success' && predictionResult ? (
        <div className="mt-6">
          <PredictionResultView
            result={predictionResult}
            sensorSnapshot={analyzedSnapshot || values}
            explainability={explainability}
            onAnalyzeAgain={handleAnalyzeAgain}
            onEditInputs={handleAnalyzeAgain}
            onReset={handleReset}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Machine Inputs (~58% desktop) */}
          <div className="lg:col-span-7">
            <SensorInputForm
              values={values}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isProcessing={predictionState === 'processing' || predictionState === 'validating'}
            />
          </div>

          {/* Right Column: Prediction Panel (~42% desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <PredictionPanel
              predictionState={predictionState}
              predictionResult={predictionResult}
              errorMessage={errorMessage}
              onAnalyze={handleSubmit}
              onReset={handleReset}
            />
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default Predictions
