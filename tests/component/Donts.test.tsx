import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Donts from '../../src/pages/Donts'

describe("Don'ts page", () => {
  it('shows the top list, groups, reasons and card links', () => {
    render(<MemoryRouter><Donts /></MemoryRouter>)
    expect(screen.getByText('The most important five')).toBeInTheDocument()
    expect(screen.getAllByText(/Don't pivot or twist on the injured leg/).length).toBeGreaterThan(0)
    expect(screen.getByText('Food and supplements')).toBeInTheDocument()
    expect(screen.getAllByText(/Why:/).length).toBeGreaterThan(20)
    expect(screen.getAllByRole('link', { name: 'Open card K1' }).length).toBeGreaterThan(0)
  })
})
