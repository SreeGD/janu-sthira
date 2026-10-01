import { useEffect } from 'react'
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { disclaimer } from './content/safety'
import { SettingsProvider, useSettings } from './hooks/useSettings'
import Bend from './pages/Bend'
import Cards, { CardDetail } from './pages/Cards'
import Donts from './pages/Donts'
import Food from './pages/Food'
import More from './pages/More'
import { Checkpoints, Living, Mri } from './pages/Mri'
import Progress from './pages/Progress'
import Review from './pages/Review'
import Safety from './pages/Safety'
import Shopping from './pages/Shopping'
import Supplements from './pages/Supplements'
import Settings from './pages/Settings'
import Today from './pages/Today'
import { requestPersistence } from './storage/db'

const tabs = [
  ['/', 'Today'], ['/cards', 'Cards'], ['/progress', 'Progress'], ['/review', 'Review'], ['/food', 'Food'], ['/more', 'More'],
] as const

function Shell() {
  const { settings } = useSettings()
  useEffect(() => {
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [settings.theme])
  useEffect(requestPersistence, [])

  return (
    <>
      <header className="sticky top-0 z-20 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)', paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
          <NavLink to="/" className="flex items-center gap-2 font-bold" style={{ color: 'var(--navy)' }} aria-label="Jaanu Setu, home">
            <img src="./icons/icon.svg" alt="" width={28} height={28} className="rounded-md" />
            Jaanu Setu
          </NavLink>
          <NavLink to="/safety" className="flex items-center rounded-full px-4 text-sm font-bold text-white" style={{ background: 'var(--bad-solid)' }} aria-label="Safety: when to get help">
            Safety
          </NavLink>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/donts" element={<Donts />} />
        <Route path="/bend" element={<Bend />} />
        <Route path="/cards/:code" element={<CardDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/review" element={<Review />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/supplements" element={<Supplements />} />
        <Route path="/food" element={<Food />} />
        <Route path="/more" element={<More />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/mri" element={<Mri />} />
        <Route path="/checkpoints" element={<Checkpoints />} />
        <Route path="/living" element={<Living />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <footer className="muted mx-auto max-w-2xl px-4 pb-24 text-xs">{disclaimer}</footer>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 flex border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className="flex flex-1 items-center justify-center py-3 text-xs font-semibold sm:text-sm" style={({ isActive }) => ({ color: isActive ? 'var(--navy)' : 'var(--muted)', borderTop: isActive ? '3px solid var(--navy)' : '3px solid transparent' })}>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </SettingsProvider>
  )
}
