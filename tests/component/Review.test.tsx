import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Review from '../../src/pages/Review'
import { SettingsProvider } from '../../src/hooks/useSettings'
import { clearAll, getDay, getSettings, listWeekReviews, saveSettings } from '../../src/storage/repository'
import { todayLocal } from '../../src/domain/dates'

const ui = () => render(<SettingsProvider><MemoryRouter><Review /></MemoryRouter></SettingsProvider>)
beforeEach(async () => { await clearAll() })

describe('Review', () => {
  it('daily reflection saves to the day entry', async () => {
    const user = userEvent.setup()
    ui()
    await user.type(await screen.findByLabelText(/What went well/i), 'Walked well')
    await user.click(screen.getByRole('button', { name: '4' }))
    await waitFor(async () => {
      const d = await getDay(todayLocal())
      expect(d.review?.wentWell).toBe('Walked well')
      expect(d.review?.mood).toBe(4)
    })
  })

  it('weekly review saves reflection and plan', async () => {
    await saveSettings({ ...(await getSettings()), dopplerAdvised: true })
    const user = userEvent.setup()
    ui()
    await user.click(screen.getByRole('button', { name: 'Weekly' }))
    await user.type(await screen.findByLabelText(/Wins this week/i), 'Good streak')
    await user.click(screen.getByRole('button', { name: /Add the suggestions/i }))
    await waitFor(async () => {
      const w = Object.values(await listWeekReviews())[0]
      expect(w.wins).toBe('Good streak')
      expect(w.nextPlan).toMatch(/Doppler/)
    })
  })
})
