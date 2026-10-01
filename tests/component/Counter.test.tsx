import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from '../../src/components/Counter'
import { HeelPropTimer } from '../../src/components/HeelPropTimer'

describe('Counter', () => {
  it('increments and shows progress', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Counter label="Quad sets" value={3} target={6} onChange={onChange} />)
    expect(screen.getByText('3 / 6')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Add one/ }))
    expect(onChange).toHaveBeenCalledWith(4)
    await user.click(screen.getByRole('button', { name: /Remove one/ }))
    expect(onChange).toHaveBeenCalledWith(2)
  })
})

describe('HeelPropTimer', () => {
  it('completes after 10 minutes', () => {
    vi.useFakeTimers()
    const done = vi.fn()
    render(<HeelPropTimer onComplete={done} />)
    act(() => screen.getByRole('button', { name: /Start 10 min/ }).click())
    act(() => { vi.advanceTimersByTime(10 * 60 * 1000 + 1000) })
    expect(done).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
