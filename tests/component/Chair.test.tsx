import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Cards, { CardDetail } from '../../src/pages/Cards'
import { TodayFor } from '../../src/pages/Today'
import { SettingsProvider } from '../../src/hooks/useSettings'
import { clearAll, getSettings } from '../../src/storage/repository'
import { Route, Routes } from 'react-router-dom'

beforeEach(async () => { await clearAll() })

describe('chair options', () => {
  it('card detail shows the seated version', async () => {
    render(<SettingsProvider><MemoryRouter initialEntries={['/cards/M5']}><Routes><Route path="/cards/:code" element={<CardDetail />} /></Routes></MemoryRouter></SettingsProvider>)
    expect(await screen.findByText(/ON A CHAIR:/)).toBeInTheDocument()
    expect(screen.getByText(/second chair or stool/)).toBeInTheDocument()
  })

  it('Today chair mode shows the seated option under exercises and remembers the choice', async () => {
    const user = userEvent.setup()
    render(<SettingsProvider><MemoryRouter><TodayFor date="2026-10-05" /></MemoryRouter></SettingsProvider>)
    expect(screen.queryByText(/On a chair:/)).toBeNull()
    await user.click(await screen.findByLabelText(/Chair mode/))
    expect((await screen.findAllByText(/On a chair:/)).length).toBeGreaterThan(3)
    await waitFor(async () => expect((await getSettings()).chairMode).toBe(true))
  })

  it('Cards page has a chair-versions filter', async () => {
    const user = userEvent.setup()
    render(<SettingsProvider><MemoryRouter><Cards /></MemoryRouter></SettingsProvider>)
    await user.click(await screen.findByLabelText(/Chair versions only/))
    expect(screen.getByText(/Quad Sets/)).toBeInTheDocument()
  })
})
