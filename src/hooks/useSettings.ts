import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Settings } from '../content/types'
import { defaultSettings, getSettings, saveSettings } from '../storage/repository'

interface Ctx {
  settings: Settings
  loaded: boolean
  update: (patch: Partial<Settings>) => Promise<void>
  reload: () => Promise<void>
}

const SettingsContext = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings())
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(settings)

  const reload = useCallback(async () => {
    const s = await getSettings()
    ref.current = s
    setSettings(s)
    setLoaded(true)
  }, [])
  useEffect(() => {
    void reload()
  }, [reload])

  const update = useCallback(async (patch: Partial<Settings>) => {
    const next = { ...ref.current, ...patch }
    ref.current = next
    setSettings(next)
    await saveSettings(next)
  }, [])

  return createElement(SettingsContext.Provider, { value: { settings, loaded, update, reload } }, children)
}

export function useSettings(): Ctx {
  const c = useContext(SettingsContext)
  if (!c) throw new Error('useSettings must be inside SettingsProvider')
  return c
}
