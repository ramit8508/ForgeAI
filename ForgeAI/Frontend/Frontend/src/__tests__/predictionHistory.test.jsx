/**
 * ForgeAI — Prediction History Tests (Part 10)
 *
 * Verifies the prediction history experience:
 * 1. History page renders
 * 2. Summary metrics calculate correctly
 * 3. Search works
 * 4. Machine filter works
 * 5. Risk filter works
 * 6. Result filter works
 * 7. Date/time filter works
 * 8. Combined filters work
 * 9. Sorting works
 * 10. Empty filtered state works
 * 11. Reset filters works
 * 12. Prediction detail route works
 * 13. Unknown prediction ID produces a proper not-found state
 * 14. Machine navigation works
 * 15. Explainability navigation handles unavailable data
 * 16. Loading state
 * 17. Error state
 * 18. Mobile prediction card renders
 * 19. Existing prediction workspace remains functional
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PredictionHistory from '../pages/PredictionHistory'
import PredictionHistoryDetail from '../pages/PredictionHistoryDetail'
import Predictions from '../pages/Predictions'
import PredictionHistoryCard from '../components/predictions/history/PredictionHistoryCard'
import PredictionHistoryTable from '../components/predictions/history/PredictionHistoryTable'
import { MOCK_PREDICTION_HISTORY } from '../data/mock/predictionHistory.mock'

// Helper wrapper to render with MemoryRouter
function renderWithRouter(ui, { route = '/predictions/history' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/predictions/history" element={ui} />
        <Route path="/predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
        <Route path="/machines/:machineId" element={<div>Machine Fleet Destination</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Prediction History Experience (Part 10)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. History page renders
  it('renders prediction history page with headers, tabs, and records', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })

    expect(screen.getByRole('heading', { level: 1, name: 'Prediction History' })).toBeInTheDocument()
    expect(screen.getByText('Inference Workspace')).toBeInTheDocument()

    // Records rendered inside desktop table
    expect(within(table).getByText('pred-101')).toBeInTheDocument()
    expect(within(table).getAllByText('MCH-001').length).toBeGreaterThan(0)
    expect(within(table).getByText('pred-102')).toBeInTheDocument()
    expect(within(table).getAllByText('MCH-004').length).toBeGreaterThan(0)
  })

  // 2. Summary metrics calculate correctly
  it('calculates summary metrics dynamically from the dataset', async () => {
    renderWithRouter(<PredictionHistory />)

    const summarySection = await screen.findByRole('region', {
      name: /Prediction History Summary/i,
    })

    const total = MOCK_PREDICTION_HISTORY.length
    const failures = MOCK_PREDICTION_HISTORY.filter((p) => p.result?.machineFailure === 1).length
    const lowRisk = MOCK_PREDICTION_HISTORY.filter((p) => p.result?.riskLevel === 'LOW').length
    const highRisk = MOCK_PREDICTION_HISTORY.filter((p) => p.result?.riskLevel === 'HIGH').length

    expect(within(summarySection).getByText('Total Predictions')).toBeInTheDocument()
    expect(within(summarySection).getByText(String(total))).toBeInTheDocument()
    expect(within(summarySection).getByText(String(failures))).toBeInTheDocument()

    const lowRiskPct = ((lowRisk / total) * 100).toFixed(1)
    const highRiskPct = ((highRisk / total) * 100).toFixed(1)

    expect(within(summarySection).getByText(`${lowRisk} (${lowRiskPct}%)`)).toBeInTheDocument()
    expect(within(summarySection).getByText(`${highRisk} (${highRiskPct}%)`)).toBeInTheDocument()
  })

  // 3. Search works
  it('searches predictions by prediction ID, machine ID, and machine name', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const searchInput = screen.getByPlaceholderText(/Search by prediction ID/i)

    // Search by prediction ID
    fireEvent.change(searchInput, { target: { value: 'pred-104' } })
    expect(within(table).getByText('pred-104')).toBeInTheDocument()
    expect(within(table).queryByText('pred-101')).not.toBeInTheDocument()

    // Search by machine ID
    fireEvent.change(searchInput, { target: { value: 'MCH-004' } })
    expect(within(table).getByText('pred-102')).toBeInTheDocument()
    expect(within(table).getByText('pred-111')).toBeInTheDocument()
    expect(within(table).queryByText('pred-101')).not.toBeInTheDocument()

    // Search by machine name
    fireEvent.change(searchInput, { target: { value: 'Grinding Head' } })
    expect(within(table).getByText('pred-106')).toBeInTheDocument()
    expect(within(table).queryByText('pred-102')).not.toBeInTheDocument()
  })

  // 4. Machine filter works
  it('filters predictions by machine', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const machineSelect = screen.getByLabelText(/Filter predictions by machine/i)

    fireEvent.change(machineSelect, { target: { value: 'MCH-001' } })

    expect(within(table).getByText('pred-101')).toBeInTheDocument()
    expect(within(table).getByText('pred-114')).toBeInTheDocument()
    expect(within(table).queryByText('pred-102')).not.toBeInTheDocument()
    expect(within(table).queryByText('pred-104')).not.toBeInTheDocument()
  })

  // 5. Risk filter works
  it('filters predictions by risk level', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const riskSelect = screen.getByLabelText(/Filter predictions by risk level/i)

    // HIGH risk
    fireEvent.change(riskSelect, { target: { value: 'HIGH' } })
    expect(within(table).getByText('pred-102')).toBeInTheDocument()
    expect(within(table).getByText('pred-104')).toBeInTheDocument()
    expect(within(table).getByText('pred-106')).toBeInTheDocument()
    expect(within(table).queryByText('pred-101')).not.toBeInTheDocument()

    // LOW risk
    fireEvent.change(riskSelect, { target: { value: 'LOW' } })
    expect(within(table).getByText('pred-101')).toBeInTheDocument()
    expect(within(table).getByText('pred-105')).toBeInTheDocument()
    expect(within(table).queryByText('pred-102')).not.toBeInTheDocument()
  })

  // 6. Result filter works
  it('filters predictions by outcome (Failure Detected vs No Failure)', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const resultSelect = screen.getByLabelText(/Filter predictions by result outcome/i)

    // Failure Detected
    fireEvent.change(resultSelect, { target: { value: 'FAILURE' } })
    expect(within(table).getByText('pred-102')).toBeInTheDocument()
    expect(within(table).getByText('pred-104')).toBeInTheDocument()
    expect(within(table).queryByText('pred-101')).not.toBeInTheDocument()

    // No Failure
    fireEvent.change(resultSelect, { target: { value: 'NO_FAILURE' } })
    expect(within(table).getByText('pred-101')).toBeInTheDocument()
    expect(within(table).getByText('pred-103')).toBeInTheDocument()
    expect(within(table).queryByText('pred-102')).not.toBeInTheDocument()
  })

  // 7. Date/time filter works
  it('filters predictions by time window', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const dateSelect = screen.getByLabelText(/Filter predictions by time window/i)

    // Today (24h)
    fireEvent.change(dateSelect, { target: { value: 'TODAY' } })
    expect(within(table).getByText('pred-101')).toBeInTheDocument()
    expect(within(table).getByText('pred-102')).toBeInTheDocument()
    // pred-115 is from earlier in the month
    expect(within(table).queryByText('pred-115')).not.toBeInTheDocument()
  })

  // 8. Combined filters work
  it('supports combining machine, risk, and result filters simultaneously', async () => {
    renderWithRouter(<PredictionHistory />)

    const table = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const machineSelect = screen.getByLabelText(/Filter predictions by machine/i)
    const riskSelect = screen.getByLabelText(/Filter predictions by risk level/i)
    const resultSelect = screen.getByLabelText(/Filter predictions by result outcome/i)

    // Machine MCH-004 + Risk HIGH + Failure Detected -> pred-102 & pred-111
    fireEvent.change(machineSelect, { target: { value: 'MCH-004' } })
    fireEvent.change(riskSelect, { target: { value: 'HIGH' } })
    fireEvent.change(resultSelect, { target: { value: 'FAILURE' } })

    expect(within(table).getByText('pred-102')).toBeInTheDocument()
    expect(within(table).getByText('pred-111')).toBeInTheDocument()
    expect(within(table).queryByText('pred-101')).not.toBeInTheDocument()
    expect(within(table).queryByText('pred-104')).not.toBeInTheDocument()
  })

  // 9. Sorting works
  it('sorts predictions by failure probability and oldest/newest timestamps', async () => {
    renderWithRouter(<PredictionHistory />)

    await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const sortSelect = screen.getByLabelText(/Sort predictions by attribute/i)

    // Sort by failure probability (descending by default)
    fireEvent.change(sortSelect, { target: { value: 'failureProbability' } })

    // Highest probability is pred-115 (0.892)
    const rowsDesc = screen.getAllByRole('row')
    expect(rowsDesc[1]).toHaveTextContent('pred-115')

    // Toggle sort order to ascending
    const sortOrderBtn = screen.getByLabelText(/Toggle sort order/i)
    fireEvent.click(sortOrderBtn)

    // Lowest probability is pred-110 (0.019)
    const rowsAsc = screen.getAllByRole('row')
    expect(rowsAsc[1]).toHaveTextContent('pred-110')
  })

  // 10. Empty filtered state works
  it('renders empty matching state when search yields zero results', async () => {
    renderWithRouter(<PredictionHistory />)

    await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const searchInput = screen.getByPlaceholderText(/Search by prediction ID/i)

    fireEvent.change(searchInput, { target: { value: 'NONEXISTENT_PRED_999' } })

    expect(screen.getByText('No matching predictions')).toBeInTheDocument()
    expect(
      screen.getByText(/Try adjusting your filters or search query/i),
    ).toBeInTheDocument()
  })

  // 11. Reset filters works
  it('resets all filters when clicking Reset Filters button', async () => {
    renderWithRouter(<PredictionHistory />)

    await screen.findByRole('table', { name: /^Prediction History Table$/i })
    const searchInput = screen.getByPlaceholderText(/Search by prediction ID/i)

    fireEvent.change(searchInput, { target: { value: 'NONEXISTENT_PRED_999' } })
    expect(screen.getByText('No matching predictions')).toBeInTheDocument()

    const resetBtn = screen.getByRole('button', { name: /Reset Filters/i })
    fireEvent.click(resetBtn)

    const tableRestored = await screen.findByRole('table', { name: /^Prediction History Table$/i })
    expect(within(tableRestored).getByText('pred-101')).toBeInTheDocument()
  })

  // 12. Prediction detail route works
  it('renders prediction detail route with outcome, model specs, and inputs snapshot', async () => {
    render(
      <MemoryRouter initialEntries={['/predictions/history/pred-101']}>
        <Routes>
          <Route path="/predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'pred-101' })).toBeInTheDocument()
    })

    expect(screen.getByText('Prediction Audit Record')).toBeInTheDocument()
    expect(screen.getAllByText('MCH-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Production Line A — Motor 01').length).toBeGreaterThan(0)
    expect(screen.getByText('Inference Model')).toBeInTheDocument()
    expect(screen.getByText('Random Forest')).toBeInTheDocument()
    expect(screen.getByText('0.45')).toBeInTheDocument()

    // Sensor inputs
    expect(screen.getByText('Input Telemetry Snapshot')).toBeInTheDocument()
    expect(screen.getByText('Air Temperature')).toBeInTheDocument()
    expect(screen.getByText('Process Temperature')).toBeInTheDocument()
    expect(screen.getByText('Temp Difference (ΔT)')).toBeInTheDocument()
    expect(screen.getByText('Rotational Speed')).toBeInTheDocument()
    expect(screen.getByText('Drive Torque')).toBeInTheDocument()
    expect(screen.getByText('Tool Wear')).toBeInTheDocument()

    // Action buttons
    expect(screen.getByRole('button', { name: /Analyze Again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^View Machine$/i })).toBeInTheDocument()
  })

  // 13. Unknown prediction ID produces a proper not-found state
  it('renders a professional not-found state for an unknown prediction ID', async () => {
    render(
      <MemoryRouter initialEntries={['/predictions/history/pred-unknown']}>
        <Routes>
          <Route path="/predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Prediction Record Not Found')).toBeInTheDocument()
    })

    expect(screen.getByText(/No prediction record exists with identifier/i)).toBeInTheDocument()
    expect(screen.getAllByText('pred-unknown').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Back to Prediction History/i })).toBeInTheDocument()
  })

  // 14. Machine navigation works
  it('navigates to the relevant machine when View Machine is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/predictions/history/pred-101']}>
        <Routes>
          <Route path="/predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
          <Route path="/machines/:machineId" element={<div>Machine Fleet Destination</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'pred-101' })).toBeInTheDocument()
    })

    const viewMachineBtn = screen.getAllByRole('button', { name: /View Machine/i })[0]
    fireEvent.click(viewMachineBtn)

    expect(screen.getByText('Machine Fleet Destination')).toBeInTheDocument()
  })

  // 15. Explainability navigation handles unavailable data
  it('displays explainability availability or appropriate unavailable state', async () => {
    // Record with explanation: pred-101
    const { unmount } = render(
      <MemoryRouter initialEntries={['/predictions/history/pred-101']}>
        <Routes>
          <Route path="/predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Available')).toBeInTheDocument()
      expect(screen.getByText(/Inspect SHAP Feature Contributions in Workspace/i)).toBeInTheDocument()
    })
    unmount()

    // Record without explanation: pred-103
    render(
      <MemoryRouter initialEntries={['/predictions/history/pred-103']}>
        <Routes>
          <Route path="/predictions/history/:predictionId" element={<PredictionHistoryDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
      expect(screen.getByText(/Explanation Not Captured/i)).toBeInTheDocument()
    })
  })

  // 16. Loading state
  it('renders skeleton rows during loading state without a giant spinner', () => {
    render(<PredictionHistoryTable loading={true} onSelect={vi.fn()} onReset={vi.fn()} />)

    const table = screen.getByRole('table', { name: /Loading prediction history table/i })
    expect(table).toBeInTheDocument()
    const pulseRows = table.querySelectorAll('tr.animate-pulse')
    expect(pulseRows.length).toBeGreaterThan(0)
  })

  // 17. Error state
  it('renders error state with retry action', () => {
    const onRetry = vi.fn()
    render(
      <PredictionHistoryTable
        error="Service network failure"
        onRetry={onRetry}
        onSelect={vi.fn()}
        onReset={vi.fn()}
      />,
    )

    expect(screen.getByText('Prediction history unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Service network failure/i)).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /Retry/i })
    fireEvent.click(retryBtn)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  // 18. Mobile prediction card renders
  it('renders dedicated mobile prediction card with touch targets', () => {
    const pred = MOCK_PREDICTION_HISTORY[0]
    const onSelect = vi.fn()

    render(<PredictionHistoryCard prediction={pred} onSelect={onSelect} />)

    expect(screen.getByText(pred.machine.id)).toBeInTheDocument()
    expect(screen.getByText(pred.machine.name)).toBeInTheDocument()
    expect(screen.getByText(pred.id)).toBeInTheDocument()
    expect(screen.getByText('View Prediction')).toBeInTheDocument()

    const card = screen.getByRole('button', { name: new RegExp(pred.id, 'i') })
    fireEvent.click(card)
    expect(onSelect).toHaveBeenCalledWith(pred.id)
  })

  // 19. Existing prediction workspace remains functional
  it('preserves existing prediction workspace functionality alongside history', async () => {
    render(
      <MemoryRouter initialEntries={['/predictions']}>
        <Routes>
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/predictions/history" element={<PredictionHistory />} />
        </Routes>
      </MemoryRouter>,
    )

    // Workspace headers and tabs
    expect(screen.getByText('Inference Workspace')).toBeInTheDocument()
    expect(screen.getByText('Predictive Analysis')).toBeInTheDocument()
    expect(screen.getByText('Air Temperature')).toBeInTheDocument()
    expect(screen.getByText('Process Temperature')).toBeInTheDocument()
    expect(screen.getByText('Rotational Speed')).toBeInTheDocument()
    expect(screen.getByText('Torque')).toBeInTheDocument()
    expect(screen.getByText('Tool Wear')).toBeInTheDocument()
  })
})
