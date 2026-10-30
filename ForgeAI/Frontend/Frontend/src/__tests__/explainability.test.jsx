/**
 * ForgeAI — Explainability Tests
 *
 * Tests for the SHAP-based model explainability system (Part 7).
 * Covers: service layer, hook behavior, and component rendering.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { postExplanation } from '../services/api/explainability'
import { getExplanation } from '../services/explainabilityService'
import { ApiClientError } from '../services/api/client'

// Mock the API module
vi.mock('../services/api/explainability', () => ({
  postExplanation: vi.fn(),
}))

// ─── Service Layer Tests ────────────────────────────────────────────────────

describe('explainabilityService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('normalizes a valid backend explanation response', async () => {
    const mockResponse = {
      base_value: 0.012,
      output_value: 0.084,
      features: [
        {
          name: 'Torque [Nm]',
          display_name: 'Torque',
          value: 38.9,
          unit: 'Nm',
          shap_value: 0.0214,
          direction: 'positive',
        },
        {
          name: 'Tool wear [min]',
          display_name: 'Tool Wear',
          value: 106,
          unit: 'min',
          shap_value: 0.0421,
          direction: 'positive',
        },
        {
          name: 'Rotational speed [rpm]',
          display_name: 'Rotational Speed',
          value: 1486,
          unit: 'rpm',
          shap_value: -0.0152,
          direction: 'negative',
        },
      ],
    }

    vi.mocked(postExplanation).mockResolvedValueOnce(mockResponse)

    const result = await getExplanation({
      air_temperature: 300.7,
      process_temperature: 310.0,
      rotational_speed: 1486,
      torque: 38.9,
      tool_wear: 106,
    })

    expect(result.status).toBe('success')
    expect(result.explanation).not.toBeNull()
    expect(result.explanation.baseValue).toBe(0.012)
    expect(result.explanation.outputValue).toBe(0.084)
    expect(result.explanation.features).toHaveLength(3)

    // Features should be sorted by absolute SHAP magnitude (descending)
    expect(result.explanation.features[0].displayName).toBe('Tool Wear')
    expect(result.explanation.features[0].shapValue).toBe(0.0421)
    expect(result.explanation.features[1].displayName).toBe('Torque')
    expect(result.explanation.features[2].displayName).toBe('Rotational Speed')
  })

  it('sends only the five backend sensor fields for an explanation request', async () => {
    vi.mocked(postExplanation).mockResolvedValueOnce({
      base_value: 0.012,
      output_value: 0.084,
      features: [
        {
          name: 'Temperature_difference',
          display_name: 'Temperature Difference',
          value: 10,
          unit: 'K',
          shap_value: 0.01,
          direction: 'positive',
        },
      ],
    })

    await getExplanation({
      air_temperature: 300,
      process_temperature: 310,
      rotational_speed: 1486,
      torque: 38.9,
      tool_wear: 106,
    })

    expect(postExplanation).toHaveBeenCalledWith({
      air_temperature: 300,
      process_temperature: 310,
      rotational_speed: 1486,
      torque: 38.9,
      tool_wear: 106,
    })
  })

  it('returns "unavailable" when API responds with 404', async () => {
    vi.mocked(postExplanation).mockRejectedValueOnce(
      new ApiClientError('Not found', { kind: 'server', status: 404 }),
    )

    const result = await getExplanation({
      air_temperature: 300.7,
      process_temperature: 310.0,
      rotational_speed: 1486,
      torque: 38.9,
      tool_wear: 106,
    })

    expect(result.status).toBe('unavailable')
    expect(result.explanation).toBeNull()
  })

  it('returns "error" when API returns malformed response', async () => {
    vi.mocked(postExplanation).mockResolvedValueOnce({
      base_value: 0.012,
      // Missing required fields
    })

    const result = await getExplanation({
      air_temperature: 300.7,
      process_temperature: 310.0,
      rotational_speed: 1486,
      torque: 38.9,
      tool_wear: 106,
    })

    expect(result.status).toBe('error')
    expect(result.explanation).toBeNull()
    expect(result.errorMessage).toBeTruthy()
  })
})

// ─── Component Tests ────────────────────────────────────────────────────────

describe('FeatureContributionBar', () => {
  it('renders feature name, value, and direction indicator', async () => {
    const { default: FeatureContributionBar } = await import(
      '../components/explainability/FeatureContributionBar'
    )

    render(
      <FeatureContributionBar
        displayName="Tool Wear"
        value={106}
        unit="min"
        shapValue={0.0421}
        direction="positive"
        maxAbsShap={0.0421}
      />,
    )

    expect(screen.getByText('Tool Wear')).toBeInTheDocument()
    expect(screen.getByText('106 min')).toBeInTheDocument()
    // Check for positive direction indicator
    expect(screen.getByText('↑ increases predicted failure risk')).toBeInTheDocument()
  })

  it('renders negative contribution correctly', async () => {
    const { default: FeatureContributionBar } = await import(
      '../components/explainability/FeatureContributionBar'
    )

    render(
      <FeatureContributionBar
        displayName="Rotational Speed"
        value={1486}
        unit="rpm"
        shapValue={-0.0152}
        direction="negative"
        maxAbsShap={0.0421}
      />,
    )

    expect(screen.getByText('Rotational Speed')).toBeInTheDocument()
    expect(screen.getByText('↓ decreases predicted failure risk')).toBeInTheDocument()
  })

  it('renders positive contribution correctly', async () => {
    const { default: FeatureContributionBar } = await import(
      '../components/explainability/FeatureContributionBar'
    )

    render(
      <FeatureContributionBar
        displayName="Torque"
        value={38.9}
        unit="Nm"
        shapValue={0.0214}
        direction="positive"
        maxAbsShap={0.0421}
      />,
    )

    expect(screen.getByText('Torque')).toBeInTheDocument()
    expect(screen.getByText('38.9 Nm')).toBeInTheDocument()
    expect(screen.getByText('↑ increases predicted failure risk')).toBeInTheDocument()
  })
})

describe('FeatureContributionList', () => {
  it('renders all features in the list', async () => {
    const { default: FeatureContributionList } = await import(
      '../components/explainability/FeatureContributionList'
    )

    const features = [
      { name: 'Tool wear [min]', displayName: 'Tool Wear', value: 106, unit: 'min', shapValue: 0.0421, direction: 'positive' },
      { name: 'Torque [Nm]', displayName: 'Torque', value: 38.9, unit: 'Nm', shapValue: 0.0214, direction: 'positive' },
      { name: 'Rotational speed [rpm]', displayName: 'Rotational Speed', value: 1486, unit: 'rpm', shapValue: -0.0152, direction: 'negative' },
    ]

    render(<FeatureContributionList features={features} />)

    expect(screen.getByText('Tool Wear')).toBeInTheDocument()
    expect(screen.getByText('Torque')).toBeInTheDocument()
    expect(screen.getByText('Rotational Speed')).toBeInTheDocument()
  })

  it('returns null for empty features array', async () => {
    const { default: FeatureContributionList } = await import(
      '../components/explainability/FeatureContributionList'
    )

    const { container } = render(<FeatureContributionList features={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('returns null when features is null', async () => {
    const { default: FeatureContributionList } = await import(
      '../components/explainability/FeatureContributionList'
    )

    const { container } = render(<FeatureContributionList features={null} />)
    expect(container.innerHTML).toBe('')
  })
})

describe('ExplainabilityDisclaimer', () => {
  it('renders the model explanation disclaimer', async () => {
    const { default: ExplainabilityDisclaimer } = await import(
      '../components/explainability/ExplainabilityDisclaimer'
    )

    render(<ExplainabilityDisclaimer />)

    expect(screen.getByText('Model explanation')).toBeInTheDocument()
    expect(screen.getByText(/should not be interpreted as direct causal relationships/)).toBeInTheDocument()
  })
})

describe('ExplainabilitySummary', () => {
  it('renders base value, output value, and feature count', async () => {
    const { default: ExplainabilitySummary } = await import(
      '../components/explainability/ExplainabilitySummary'
    )

    render(
      <ExplainabilitySummary
        baseValue={0.0123}
        outputValue={0.0842}
        featureCount={5}
      />,
    )

    expect(screen.getByText('0.0123')).toBeInTheDocument()
    expect(screen.getByText('0.0842')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})

describe('ExplainabilityPanel', () => {
  const defaultProps = {
    explanationStatus: 'idle',
    explanation: null,
    errorMessage: null,
    isExpanded: false,
    onRequestExplanation: vi.fn(),
    onRetry: vi.fn(),
    onToggle: vi.fn(),
  }

  it('renders "Explain Prediction" button in idle state', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    render(<ExplainabilityPanel {...defaultProps} />)

    const button = screen.getByRole('button', { name: /explain/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onRequestExplanation when button is clicked', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    const onRequest = vi.fn()
    render(
      <ExplainabilityPanel
        {...defaultProps}
        onRequestExplanation={onRequest}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /explain/i }))
    expect(onRequest).toHaveBeenCalledTimes(1)
  })

  it('renders loading state with analysis message', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    render(
      <ExplainabilityPanel
        {...defaultProps}
        explanationStatus="loading"
        isExpanded={true}
      />,
    )

    expect(screen.getAllByText('Analyzing model contribution…').length).toBeGreaterThan(0)
    expect(screen.getByTestId('explainability-loading')).toBeInTheDocument()
  })

  it('renders unavailable state when endpoint does not exist', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    render(
      <ExplainabilityPanel
        {...defaultProps}
        explanationStatus="unavailable"
        isExpanded={true}
      />,
    )

    expect(screen.getByText('Model explanation not yet available')).toBeInTheDocument()
    expect(screen.getByText(/prediction result remains valid/i)).toBeInTheDocument()
  })

  it('renders error state with retry button', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    const onRetry = vi.fn()
    render(
      <ExplainabilityPanel
        {...defaultProps}
        explanationStatus="error"
        errorMessage="Something went wrong"
        isExpanded={true}
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('Explainability unavailable')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()
    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders success state with SHAP features', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    const explanation = {
      baseValue: 0.012,
      outputValue: 0.084,
      features: [
        { name: 'Tool wear [min]', displayName: 'Tool Wear', value: 106, unit: 'min', shapValue: 0.0421, direction: 'positive' },
        { name: 'Torque [Nm]', displayName: 'Torque', value: 38.9, unit: 'Nm', shapValue: 0.0214, direction: 'positive' },
      ],
    }

    render(
      <ExplainabilityPanel
        {...defaultProps}
        explanationStatus="success"
        explanation={explanation}
        isExpanded={true}
      />,
    )

    expect(screen.getByText('Tool Wear')).toBeInTheDocument()
    expect(screen.getByText('Torque')).toBeInTheDocument()
    expect(screen.getByText('Model explanation')).toBeInTheDocument()
  })

  it('prediction result remains visible when SHAP fails (no crash)', async () => {
    const { default: ExplainabilityPanel } = await import(
      '../components/explainability/ExplainabilityPanel'
    )

    // The panel should render error state without crashing
    const { container } = render(
      <ExplainabilityPanel
        {...defaultProps}
        explanationStatus="error"
        errorMessage="Service unavailable"
        isExpanded={true}
      />,
    )

    // Panel should be in the DOM
    expect(container.querySelector('[data-testid="explainability-panel"]')).toBeInTheDocument()
    // Error state should be visible
    expect(screen.getByText('Explainability unavailable')).toBeInTheDocument()
  })
})

// ─── Data Contract Tests ────────────────────────────────────────────────────

describe('Explainability Data Contract', () => {
  it('exports feature display map with all expected features', async () => {
    const { FEATURE_DISPLAY_MAP } = await import(
      '../data/explainability/explainability.contract'
    )

    expect(FEATURE_DISPLAY_MAP['Air temperature [K]']).toBeDefined()
    expect(FEATURE_DISPLAY_MAP['Process temperature [K]']).toBeDefined()
    expect(FEATURE_DISPLAY_MAP['Rotational speed [rpm]']).toBeDefined()
    expect(FEATURE_DISPLAY_MAP['Torque [Nm]']).toBeDefined()
    expect(FEATURE_DISPLAY_MAP['Tool wear [min]']).toBeDefined()

    // Each entry should have displayName and unit
    Object.values(FEATURE_DISPLAY_MAP).forEach((entry) => {
      expect(entry.displayName).toBeTruthy()
      expect(entry.unit).toBeTruthy()
    })
  })

  it('exports status constants', async () => {
    const { EXPLANATION_STATUS } = await import(
      '../data/explainability/explainability.contract'
    )

    expect(EXPLANATION_STATUS.IDLE).toBe('idle')
    expect(EXPLANATION_STATUS.LOADING).toBe('loading')
    expect(EXPLANATION_STATUS.SUCCESS).toBe('success')
    expect(EXPLANATION_STATUS.UNAVAILABLE).toBe('unavailable')
    expect(EXPLANATION_STATUS.ERROR).toBe('error')
  })
})

// ─── Hook Tests ─────────────────────────────────────────────────────────────

describe('useExplainability', () => {
  it('starts in idle state', async () => {
    const { useExplainability } = await import('../hooks/useExplainability')

    const { result } = renderHook(() =>
      useExplainability({ air_temperature: 300.7, process_temperature: 310.0, rotational_speed: 1486, torque: 38.9, tool_wear: 106 }),
    )

    expect(result.current.explanationStatus).toBe('idle')
    expect(result.current.explanation).toBeNull()
    expect(result.current.isExpanded).toBe(false)
  })

  it('resets to idle on resetExplanation', async () => {
    const { useExplainability } = await import('../hooks/useExplainability')

    const { result } = renderHook(() =>
      useExplainability({ air_temperature: 300.7, process_temperature: 310.0, rotational_speed: 1486, torque: 38.9, tool_wear: 106 }),
    )

    act(() => {
      result.current.resetExplanation()
    })

    expect(result.current.explanationStatus).toBe('idle')
    expect(result.current.explanation).toBeNull()
    expect(result.current.isExpanded).toBe(false)
  })

  it('toggles expanded state', async () => {
    const { useExplainability } = await import('../hooks/useExplainability')

    const { result } = renderHook(() =>
      useExplainability({ air_temperature: 300.7, process_temperature: 310.0, rotational_speed: 1486, torque: 38.9, tool_wear: 106 }),
    )

    act(() => {
      result.current.toggleExpanded()
    })

    expect(result.current.isExpanded).toBe(true)

    act(() => {
      result.current.toggleExpanded()
    })

    expect(result.current.isExpanded).toBe(false)
  })
})
