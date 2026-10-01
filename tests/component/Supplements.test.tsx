import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Supplements from '../../src/pages/Supplements'
import { SettingsProvider } from '../../src/hooks/useSettings'
import { clearAll, getSettings } from '../../src/storage/repository'

const ui = () => render(<SettingsProvider><MemoryRouter><Supplements /></MemoryRouter></SettingsProvider>)
beforeEach(async () => { await clearAll() })

describe('Supplements page', () => {
  it('shows the doctor warning and expands a card with its vegetarian option', async () => {
    const user = userEvent.setup()
    ui()
    expect(await screen.findByText(/Check with your doctor or pharmacist/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Omega-3/ }))
    expect(screen.getAllByText(/Algal oil/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Vegetarian option:/)).toBeInTheDocument()
  })
  it('remembers my status', async () => {
    const user = userEvent.setup()
    ui()
    await user.click(await screen.findByRole('button', { name: /Vitamin D/ }))
    await user.click(screen.getByRole('button', { name: 'Asked my doctor' }))
    await waitFor(async () => expect((await getSettings()).supplementStatus?.['vitamin-d']).toBe('asked'))
  })
})
