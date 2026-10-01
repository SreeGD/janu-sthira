import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Bend from '../../src/pages/Bend'
import { CardDetail } from '../../src/pages/Cards'
import { SettingsProvider } from '../../src/hooks/useSettings'

describe('Bend guide', () => {
  it('explains cross-legged sitting and links to the new cards', async () => {
    const user = userEvent.setup()
    render(
      <SettingsProvider>
        <MemoryRouter initialEntries={['/bend']}>
          <Routes>
            <Route path="/bend" element={<Bend />} />
            <Route path="/cards/:code" element={<CardDetail />} />
          </Routes>
        </MemoryRouter>
      </SettingsProvider>,
    )
    expect(screen.getByText(/avoid cross-legged sitting for now/i)).toBeInTheDocument()
    expect(screen.getByText('140°+')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Open card K1' }))
    expect(await screen.findByText(/slide the foot of the injured leg back/i)).toBeInTheDocument()
  })
})
