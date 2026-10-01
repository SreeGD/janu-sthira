import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Shopping from '../../src/pages/Shopping'
import { SettingsProvider } from '../../src/hooks/useSettings'
import { clearAll, getSettings } from '../../src/storage/repository'

const ui = () => render(<SettingsProvider><MemoryRouter><Shopping /></MemoryRouter></SettingsProvider>)
beforeEach(async () => { await clearAll() })

describe('Shopping', () => {
  it('ticks persist in settings', async () => {
    const user = userEvent.setup()
    ui()
    await user.click(await screen.findByLabelText(/Paneer/))
    await waitFor(async () => {
      const s = await getSettings()
      expect(Object.values(s.shoppingChecked ?? {})[0]).toContain('paneer')
    })
  })
  it('share uses the Web Share API when available', async () => {
    const user = userEvent.setup()
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    ui()
    await user.click(await screen.findByRole('button', { name: 'Share list' }))
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('Paneer: 700 g') }))
    // @ts-expect-error cleanup
    delete navigator.share
  })
  it('falls back to copy without Web Share', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    ui()
    await user.click(await screen.findByRole('button', { name: 'Share list' }))
    expect(writeText).toHaveBeenCalled()
    expect(await screen.findByText(/Copied to clipboard/)).toBeInTheDocument()
  })
})
