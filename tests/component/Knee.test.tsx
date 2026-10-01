import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Knee from '../../src/pages/Knee'

describe('Knee guide', () => {
  it('shows the diagram, opens a part and lists prevention and red flags', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Knee /></MemoryRouter>)
    expect(screen.getByRole('img', { name: /front view of the knee/i })).toBeInTheDocument()
    expect(screen.getByText(/A pop at the time of injury/)).toBeInTheDocument() // ACL open by default
    await user.click(screen.getByRole('button', { name: /PCL \(posterior cruciate ligament\)/ }))
    expect(screen.getByText(/dashboard injury/)).toBeInTheDocument()
    expect(screen.getByText(/How to avoid knee injuries/)).toBeInTheDocument()
    expect(screen.getByText(/Land softly on the whole foot/)).toBeInTheDocument()
    expect(screen.getByText(/Get medical help promptly if/)).toBeInTheDocument()
  })
})
