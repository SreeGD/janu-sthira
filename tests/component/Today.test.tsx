import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TodayFor } from '../../src/pages/Today'
import { SettingsProvider } from '../../src/hooks/useSettings'
import { clearAll, getDay, getSettings, saveSettings } from '../../src/storage/repository'

const renderToday = (date: string) =>
  render(
    <SettingsProvider>
      <MemoryRouter>
        <TodayFor date={date} />
      </MemoryRouter>
    </SettingsProvider>,
  )

beforeEach(async () => {
  await clearAll()
})

const openEvening = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(await screen.findByRole('button', { name: /Evening session/i }))

describe('Today', () => {
  it('ticks persist across remount', async () => {
    const user = userEvent.setup()
    const { unmount } = renderToday('2026-10-05')
    const box = await screen.findByLabelText(/Ankle pumps and circles/i)
    await user.click(box)
    await waitFor(async () => expect((await getDay('2026-10-05')).ticked).toContain('m1'))
    unmount()
    renderToday('2026-10-05')
    expect(await screen.findByLabelText(/Ankle pumps and circles/i)).toBeChecked()
  })

  it('Monday shows band circuit, Tuesday shows core', async () => {
    const user = userEvent.setup()
    const a = renderToday('2026-10-05')
    await openEvening(user)
    expect(await screen.findByText(/Band: terminal knee extension/i)).toBeInTheDocument()
    a.unmount()
    renderToday('2026-10-06')
    await openEvening(user)
    expect(await screen.findByText(/Plank/)).toBeInTheDocument()
    expect(screen.queryByText(/Band: terminal knee extension/i)).toBeNull()
  })

  it('yoga toggle swaps evening', async () => {
    const user = userEvent.setup()
    renderToday('2026-10-05')
    await user.click(await screen.findByLabelText(/Yoga day/i))
    await openEvening(user)
    expect(await screen.findByLabelText(/^40-minute yoga sequence \(see the separate Yoga PDF\)/i)).toBeInTheDocument()
  })
})

describe('KneeCheck', () => {
  it('swollen -> rest day, walk skipped, target reset', async () => {
    const user = userEvent.setup()
    renderToday('2026-10-05')
    await user.click(await screen.findByRole('button', { name: /Clearly swollen/i }))
    expect((await screen.findAllByText(/Rest day:/)).length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/Flat-surface walk/i)).toBeDisabled()
    await waitFor(async () => expect((await getSettings()).walkTarget).toBe(15))
  })

  it('better twice does not compound the walk target', async () => {
    const user = userEvent.setup()
    renderToday('2026-10-05')
    const better = await screen.findByRole('button', { name: /Same or better/i })
    await user.click(better)
    await user.click(better)
    await waitFor(async () => expect((await getSettings()).walkTarget).toBe(20))
  })

  it('gave way shows stop banner', async () => {
    const user = userEvent.setup()
    renderToday('2026-10-05')
    await user.click(await screen.findByRole('button', { name: /gave way/i }))
    const alerts = await screen.findAllByRole('alert')
    expect(alerts.some((a) => within(a).queryByText(/STOP/))).toBe(true)
  })
})

describe('Safety on Today', () => {
  it('shows Doppler reminder only when a scan was advised', async () => {
    renderToday('2026-10-05')
    await screen.findByRole('group', { name: /Morning knee check/i })
    expect(screen.queryByText(/Doppler scan not done/i)).toBeNull()
  })
  it('shows Doppler reminder when advised and not done', async () => {
    await saveSettings({ ...(await getSettings()), dopplerAdvised: true })
    renderToday('2026-10-05')
    expect(await screen.findByText(/Doppler scan not done/i)).toBeInTheDocument()
  })
  it('calf warning in log shows stop banner', async () => {
    const user = userEvent.setup()
    renderToday('2026-10-05')
    await user.click(await screen.findByRole('button', { name: /daily log/i }))
    await user.click(screen.getByLabelText(/Calf painful/i))
    expect(await screen.findByText(/get checked the same day/i)).toBeInTheDocument()
  })
})
