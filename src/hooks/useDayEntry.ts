import { useCallback, useEffect, useRef, useState } from 'react'
import type { DayEntry } from '../content/types'
import { emptyDay, getDay, saveDay } from '../storage/repository'

export function useDayEntry(date: string) {
  const [entry, setEntry] = useState<DayEntry>(() => emptyDay(date))
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(entry)

  useEffect(() => {
    let live = true
    setLoaded(false)
    getDay(date).then((d) => {
      if (!live) return
      ref.current = d
      setEntry(d)
      setLoaded(true)
    })
    return () => {
      live = false
    }
  }, [date])

  const update = useCallback(async (fn: (d: DayEntry) => DayEntry) => {
    const next = fn(ref.current)
    ref.current = next
    setEntry(next)
    await saveDay(next)
  }, [])

  const toggleTick = useCallback(
    (id: string) =>
      update((d) => ({ ...d, ticked: d.ticked.includes(id) ? d.ticked.filter((x) => x !== id) : [...d.ticked, id] })),
    [update],
  )

  return { entry, loaded, update, toggleTick }
}
