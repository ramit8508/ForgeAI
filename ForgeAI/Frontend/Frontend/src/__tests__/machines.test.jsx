/**
 * ForgeAI — Machine Fleet Tests (Part 8)
 *
 * Verifies the machines experience:
 * 1. Machine list renders
 * 2. Fleet summary derives correct counts
 * 3. Search works (by ID, by name, by location)
 * 4. Risk filter works
 * 5. Status filter works
 * 6. Combined filters work
 * 7. Sorting works (by probability, by ID)
 * 8. Empty search/filter state works with reset action
 * 9. Machine row navigation works
 * 10. Machine detail route works
 * 11. Unknown machine ID produces a proper not-found state
 * 12. Machine status and risk remain separate concepts
 * 13. Mobile machine representation renders correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Machines from '../pages/Machines'
import MachineDetail from '../pages/MachineDetail'
import MachineCard from '../components/machines/MachineCard'
import MachineStatusBadge from '../components/machines/MachineStatusBadge'
import { MOCK_MACHINES } from '../data/mock/machines.mock'

// Helper wrapper to render with MemoryRouter
function renderWithRouter(ui, { route = '/machines' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/machines" element={ui} />
        <Route path="/machines/:machineId" element={<MachineDetail />} />
        <Route path="/predictions" element={<div>Predictions Workspace Destination</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Machine Fleet Experience (Part 8)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. Machine list renders
  it('renders monitored machines list with IDs and display names', async () => {
    renderWithRouter(<Machines />)

    const table = await screen.findByRole('table')

    expect(within(table).getByText('MCH-001')).toBeInTheDocument()
    expect(within(table).getByText('Production Line A — Motor 01')).toBeInTheDocument()
    expect(within(table).getByText('MCH-002')).toBeInTheDocument()
    expect(within(table).getByText('MCH-004')).toBeInTheDocument()
  })

  // 2. Fleet summary derives correct counts
  it('derives accurate fleet summary counts dynamically from the dataset', async () => {
    renderWithRouter(<Machines />)

    const summarySection = await screen.findByRole('region', { name: /Fleet Summary/i })
    expect(within(summarySection).getByText('Machines Monitored')).toBeInTheDocument()

    // Total: 12, Operational: 5, Warning: 3, Critical: 2
    expect(within(summarySection).getByText(String(MOCK_MACHINES.length))).toBeInTheDocument()
    const operationalCount = MOCK_MACHINES.filter((m) => m.status === 'Operational').length
    const warningCount = MOCK_MACHINES.filter((m) => m.status === 'Warning').length
    const criticalCount = MOCK_MACHINES.filter((m) => m.status === 'Critical').length

    expect(within(summarySection).getByText(String(operationalCount))).toBeInTheDocument()
    expect(within(summarySection).getByText(String(warningCount))).toBeInTheDocument()
    expect(within(summarySection).getByText(String(criticalCount))).toBeInTheDocument()
  })

  // 3. Search works (by ID, by name, by location)
  it('searches machines by technical ID, display name, and location', async () => {
    renderWithRouter(<Machines />)

    const table = await screen.findByRole('table')
    const searchInput = screen.getByPlaceholderText(/Search machines by ID/i)

    // Search by ID
    fireEvent.change(searchInput, { target: { value: 'MCH-004' } })
    expect(within(table).getByText('Production Line B — Cutting Drive 02')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-001')).not.toBeInTheDocument()

    // Search by Name
    fireEvent.change(searchInput, { target: { value: 'Grinding Head' } })
    expect(within(table).getByText('MCH-006')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-004')).not.toBeInTheDocument()

    // Search by Location
    fireEvent.change(searchInput, { target: { value: 'Press Shop' } })
    expect(within(table).getByText('MCH-005')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-006')).not.toBeInTheDocument()
  })

  // 4. Risk filter works
  it('filters machines by predicted failure risk level', async () => {
    renderWithRouter(<Machines />)

    const table = await screen.findByRole('table')
    const riskSelect = screen.getByLabelText(/Filter machines by risk level/i)

    // Filter to HIGH risk
    fireEvent.change(riskSelect, { target: { value: 'HIGH' } })
    expect(within(table).getByText('MCH-004')).toBeInTheDocument()
    expect(within(table).getByText('MCH-006')).toBeInTheDocument()
    expect(within(table).getByText('MCH-008')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-001')).not.toBeInTheDocument()

    // Filter to LOW risk
    fireEvent.change(riskSelect, { target: { value: 'LOW' } })
    expect(within(table).getByText('MCH-001')).toBeInTheDocument()
    expect(within(table).getByText('MCH-003')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-004')).not.toBeInTheDocument()
  })

  // 5. Status filter works
  it('filters machines by operational status', async () => {
    renderWithRouter(<Machines />)

    const table = await screen.findByRole('table')
    const statusSelect = screen.getByLabelText(/Filter machines by operational status/i)

    // Filter to CRITICAL status
    fireEvent.change(statusSelect, { target: { value: 'CRITICAL' } })
    expect(within(table).getByText('MCH-004')).toBeInTheDocument()
    expect(within(table).getByText('MCH-008')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-001')).not.toBeInTheDocument()

    // Filter to OFFLINE status
    fireEvent.change(statusSelect, { target: { value: 'OFFLINE' } })
    expect(within(table).getByText('MCH-010')).toBeInTheDocument()
    expect(within(table).getByText('MCH-012')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-004')).not.toBeInTheDocument()
  })

  // 6. Combined filters work
  it('supports combining status and risk filters simultaneously', async () => {
    renderWithRouter(<Machines />)

    const table = await screen.findByRole('table')
    const riskSelect = screen.getByLabelText(/Filter machines by risk level/i)
    const statusSelect = screen.getByLabelText(/Filter machines by operational status/i)

    // Status: WARNING, Risk: HIGH -> MCH-006 (Grinding Head 01)
    fireEvent.change(statusSelect, { target: { value: 'WARNING' } })
    fireEvent.change(riskSelect, { target: { value: 'HIGH' } })

    expect(within(table).getByText('MCH-006')).toBeInTheDocument()
    expect(within(table).queryByText('MCH-002')).not.toBeInTheDocument() // Warning but MEDIUM risk
    expect(within(table).queryByText('MCH-004')).not.toBeInTheDocument() // Critical status, HIGH risk
  })

  // 7. Sorting works
  it('sorts machines by failure probability and natural technical ID', async () => {
    renderWithRouter(<Machines />)

    await screen.findByRole('table')
    const sortSelect = screen.getByLabelText(/Sort machines by attribute/i)
    const sortOrderBtn = screen.getByLabelText(/Toggle sort order/i)

    // Sort by failure probability (ascending by default)
    fireEvent.change(sortSelect, { target: { value: 'failureProbability' } })

    // Lowest probability is MCH-007 (0.019)
    const rowsAsc = screen.getAllByRole('row')
    expect(rowsAsc[1]).toHaveTextContent('MCH-007')

    // Toggle to descending order
    fireEvent.click(sortOrderBtn)

    // Highest probability is MCH-008 (0.865)
    const rowsDesc = screen.getAllByRole('row')
    expect(rowsDesc[1]).toHaveTextContent('MCH-008')
  })

  // 8. Empty search/filter state works
  it('renders an empty state with a reset action when search yields zero results', async () => {
    renderWithRouter(<Machines />)

    await screen.findByRole('table')
    const searchInput = screen.getByPlaceholderText(/Search machines by ID/i)
    fireEvent.change(searchInput, { target: { value: 'NONEXISTENT_MACHINE_XYZ' } })

    expect(screen.getByText('No machines found')).toBeInTheDocument()
    expect(
      screen.getByText(/No monitored machines match your current search/i),
    ).toBeInTheDocument()

    // Click Reset Filters button
    const resetButtons = screen.getAllByRole('button', { name: /Reset Filters/i })
    fireEvent.click(resetButtons[0])

    // Fleet list restored
    const table = await screen.findByRole('table')
    expect(within(table).getByText('MCH-001')).toBeInTheDocument()
  })

  // 9. Machine row navigation works
  it('navigates to the machine detail route when a machine row is clicked', async () => {
    renderWithRouter(<Machines />)

    const table = await screen.findByRole('table')
    const row = within(table).getByRole('row', { name: /Machine MCH-001/i })
    fireEvent.click(row)

    // Verifies navigation to detail page
    await waitFor(() => {
      expect(screen.getByText('Machine Diagnostics')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: 'MCH-001' })).toBeInTheDocument()
    })
  })

  // 10. Machine detail route works
  it('renders complete machine detail view with specifications and telemetry snapshot', async () => {
    render(
      <MemoryRouter initialEntries={['/machines/MCH-001']}>
        <Routes>
          <Route path="/machines/:machineId" element={<MachineDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'MCH-001' })).toBeInTheDocument()
    })

    expect(screen.getByText('Production Line A — Motor 01')).toBeInTheDocument()
    expect(screen.getByText('Line A — Bay 3')).toBeInTheDocument()
    expect(screen.getByText('Siemens 1FK7060-4CH71')).toBeInTheDocument()
    expect(screen.getByText('8,421 hrs')).toBeInTheDocument()

    // Telemetry sensor snapshot
    expect(screen.getByText('Current Sensor Condition')).toBeInTheDocument()
    expect(screen.getByText('Air Temperature')).toBeInTheDocument()
    expect(screen.getByText('Process Temperature')).toBeInTheDocument()
    expect(screen.getByText('Temp Difference (ΔT)')).toBeInTheDocument()
    expect(screen.getByText('Rotational Speed')).toBeInTheDocument()
    expect(screen.getByText('Drive Torque')).toBeInTheDocument()
    expect(screen.getByText('Tool Wear')).toBeInTheDocument()

    // Action button
    expect(screen.getByRole('button', { name: /Analyze Machine/i })).toBeInTheDocument()
  })

  // 11. Unknown machine ID produces a proper not-found state
  it('renders a professional not-found state for an unknown machine ID', async () => {
    render(
      <MemoryRouter initialEntries={['/machines/MCH-999']}>
        <Routes>
          <Route path="/machines/:machineId" element={<MachineDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Machine Not Found')).toBeInTheDocument()
    })

    expect(screen.getByText(/No monitored machine exists with identifier/i)).toBeInTheDocument()
    expect(screen.getAllByText('MCH-999').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Back to Machine Fleet/i })).toBeInTheDocument()
  })

  // 12. Machine status and risk remain separate concepts
  it('treats machine operational status and failure risk as distinct decoupled concepts', () => {
    // Test MCH-006: Status Warning, Risk HIGH
    const mch006 = MOCK_MACHINES.find((m) => m.id === 'MCH-006')
    expect(mch006.status).toBe('Warning')
    expect(mch006.riskLevel).toBe('HIGH')

    // Test MCH-009: Status Operational, Risk MEDIUM
    const mch009 = MOCK_MACHINES.find((m) => m.id === 'MCH-009')
    expect(mch009.status).toBe('Operational')
    expect(mch009.riskLevel).toBe('MEDIUM')

    // Test MCH-010: Status Offline, Risk LOW
    const mch010 = MOCK_MACHINES.find((m) => m.id === 'MCH-010')
    expect(mch010.status).toBe('Offline')
    expect(mch010.riskLevel).toBe('LOW')

    // Render MachineStatusBadge independently
    const { rerender } = render(<MachineStatusBadge status="Warning" />)
    expect(screen.getByRole('status', { name: /Machine status: Warning/i })).toBeInTheDocument()

    rerender(<MachineStatusBadge status="Operational" />)
    expect(screen.getByRole('status', { name: /Machine status: Operational/i })).toBeInTheDocument()

    rerender(<MachineStatusBadge status="Critical" />)
    expect(screen.getByRole('status', { name: /Machine status: Critical/i })).toBeInTheDocument()

    rerender(<MachineStatusBadge status="Offline" />)
    expect(screen.getByRole('status', { name: /Machine status: Offline/i })).toBeInTheDocument()
  })

  // 13. Mobile machine representation renders correctly
  it('renders the dedicated mobile machine card with actionable touch elements', () => {
    const mockMachine = MOCK_MACHINES[0]
    const onSelect = vi.fn()

    render(<MachineCard machine={mockMachine} onSelect={onSelect} />)

    expect(screen.getByText(mockMachine.id)).toBeInTheDocument()
    expect(screen.getByText(mockMachine.name)).toBeInTheDocument()
    expect(screen.getByText(mockMachine.location)).toBeInTheDocument()
    expect(screen.getByText(/Predicted Failure Risk/i)).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /Machine status: Operational/i })).toBeInTheDocument()

    // Test click on card
    const card = screen.getByRole('button', { name: new RegExp(mockMachine.id, 'i') })
    fireEvent.click(card)
    expect(onSelect).toHaveBeenCalledWith(mockMachine.id)
  })
})
