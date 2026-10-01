import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Settings from '../../src/pages/Settings'
import { SettingsProvider } from '../../src/hooks/useSettings'
import { clearAll, emptyDay, getDay, listDays, saveDay } from '../../src/storage/repository'

const ui = () => render(<SettingsProvider><MemoryRouter><Settings /></MemoryRouter></SettingsProvider>)
beforeEach(async () => { await clearAll() })

const backup = (date: string, ticked: string[]) => JSON.stringify({
  app: 'janu-setu', version: 1, exportedAt: '2026-10-20T00:00:00Z',
  settings: { startDate: '2026-10-01', walkTarget: 25, walkMin: 15, walkMax: 40, theme: 'system', dopplerDone: false, checkpointNotes: {} },
  days: { [date]: { ...emptyDay(date), ticked, updatedAt: '2026-10-20T00:00:00Z' } },
})

describe('Settings: move to another device', () => {
  it('pasted backup previews, then merges without deleting local days', async () => {
    const user = userEvent.setup()
    await saveDay({ ...emptyDay('2026-10-05'), ticked: ['m1'] })
    ui()
    await user.click(await screen.findByRole('button', { name: 'Paste backup text' }))
    const box = screen.getByLabelText('Backup text')
    await user.click(box)
    await user.paste(backup('2026-10-06', ['m2']))
    await user.click(screen.getByRole('button', { name: 'Check backup text' }))
    expect(await screen.findByRole('region', { name: 'Import preview' })).toHaveTextContent('1 new')
    await user.click(screen.getByRole('button', { name: 'Merge into this device' }))
    await waitFor(async () => expect(Object.keys(await listDays()).sort()).toEqual(['2026-10-05', '2026-10-06']))
    expect((await getDay('2026-10-05')).ticked).toEqual(['m1'])
  })

  it('replace requires confirmation', async () => {
    const user = userEvent.setup()
    await saveDay({ ...emptyDay('2026-10-05'), ticked: ['m1'] })
    ui()
    await user.click(await screen.findByRole('button', { name: 'Paste backup text' }))
    await user.click(screen.getByLabelText('Backup text'))
    await user.paste(backup('2026-10-06', ['m2']))
    await user.click(screen.getByRole('button', { name: 'Check backup text' }))
    await user.click(await screen.findByLabelText(/Replace everything/))
    const go = screen.getByRole('button', { name: 'Replace this device' })
    expect(go).toBeDisabled()
    await user.click(screen.getByLabelText(/I understand/))
    await user.click(go)
    await waitFor(async () => expect(Object.keys(await listDays())).toEqual(['2026-10-06']))
  })

  it('rejects text that is not a backup', async () => {
    const user = userEvent.setup()
    ui()
    await user.click(await screen.findByRole('button', { name: 'Paste backup text' }))
    await user.click(screen.getByLabelText('Backup text'))
    await user.paste('hello')
    await user.click(screen.getByRole('button', { name: 'Check backup text' }))
    expect(await screen.findByText(/Import failed/)).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Import preview' })).toBeNull()
  })
})
