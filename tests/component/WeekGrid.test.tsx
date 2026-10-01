import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, useState } from 'react'
import { WeekGrid } from '../../src/components/WeekGrid'
import type { DayEntry } from '../../src/content/types'
import { clearAll, getDay, listDays } from '../../src/storage/repository'

function Harness() {
  const [days, setDays] = useState<Record<string, DayEntry>>({})
  const [rev, setRev] = useState(0)
  useEffect(() => { void listDays().then(setDays) }, [rev])
  return <WeekGrid weekStart="2026-10-05" today="2026-10-08" days={days} walkTarget={15} onChanged={() => setRev((r) => r + 1)} />
}
beforeEach(async () => { await clearAll() })

describe('WeekGrid', () => {
  it('tapping a cell completes that session and shows it done; tapping again clears', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const cell = () => screen.getByRole('cell', { name: /Morning stretch \+ walk, Mon 05/ })
    expect(cell()).toHaveAccessibleName(/not done/)
    await user.click(cell())
    await waitFor(() => expect(cell()).toHaveAccessibleName(/: done/))
    expect((await getDay('2026-10-05')).ticked).toHaveLength(6)
    await user.click(cell())
    await waitFor(() => expect(cell()).toHaveAccessibleName(/not done/))
  })
  it('future days are disabled and Sunday lunch is not planned', () => {
    render(<Harness />)
    expect(screen.getByRole('cell', { name: /Morning stretch \+ walk, Sat 10/ })).toBeDisabled()
    expect(screen.getByRole('cell', { name: /Lunch strength, Sun 11/ })).toBeDisabled()
  })
})
