import { useState } from 'react'
import { Link } from 'react-router-dom'
import { stanceLabel, supplementIntro, supplements, supplementWarning, testsToAsk, type Stance } from '../content/supplements'
import { Page, Section, WarningBanner } from '../components/ui'
import { useSettings } from '../hooks/useSettings'

const stanceColor: Record<Stance, string> = {
  'food-first': 'var(--good)', 'test-first': 'var(--teal)', optional: 'var(--muted)', 'ask-doctor': 'var(--warn)', skip: 'var(--bad)',
}
type Status = 'asked' | 'taking' | 'declined'
const statusLabel: Record<Status, string> = { asked: 'Asked my doctor', taking: 'Taking', declined: 'Not for me' }

export default function Supplements() {
  const { settings, update } = useSettings()
  const [open, setOpen] = useState<string | null>(null)
  const statuses = settings.supplementStatus ?? {}
  const setStatus = (id: string, s: Status | undefined) => {
    const next = { ...statuses }
    if (s) next[id] = s
    else delete next[id]
    void update({ supplementStatus: next })
  }

  return (
    <Page title="Supplements" back={<Link to="/food" className="muted mb-2 inline-flex items-center text-sm">← Food</Link>}>
      <p className="muted -mt-2 text-sm">Vegetarian options · no onion or garlic</p>
      <p className="text-sm">{supplementIntro}</p>
      <WarningBanner level="warn">{supplementWarning}</WarningBanner>
      {settings.dopplerAdvised && !settings.dopplerDone && <WarningBanner level="info">Venous Doppler scan is not marked done yet. <Link to="/safety" className="underline">Safety</Link></WarningBanner>}

      <Section title="Tests to ask for">
        <ul className="list-disc pl-5 text-sm">{testsToAsk.map((t) => <li key={t}>{t}</li>)}</ul>
      </Section>

      <ul className="flex flex-col gap-2">
        {supplements.map((s) => {
          const isOpen = open === s.id
          const st = statuses[s.id]
          return (
            <li key={s.id} className="panel">
              <button type="button" className="w-full text-left" style={{ minHeight: 44 }} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold" style={{ color: 'var(--navy)' }}>{s.name}</span>
                  <span className="chip shrink-0" style={{ color: stanceColor[s.stance], borderColor: stanceColor[s.stance] }}>{stanceLabel[s.stance]}</span>
                </div>
                <div className="muted mt-1 text-xs">Evidence: {s.evidence}{st ? ` · ${statusLabel[st]}` : ''}</div>
              </button>
              {isOpen && (
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <p><strong>Why:</strong> {s.why}</p>
                  <p><strong style={{ color: 'var(--good)' }}>Vegetarian option:</strong> {s.vegOption}</p>
                  <p><strong>From food:</strong> {s.food}</p>
                  <p><strong>How:</strong> {s.how}</p>
                  <p><strong style={{ color: 'var(--bad)' }}>Caution:</strong> {s.caution}</p>
                  <div role="group" aria-label={`My status for ${s.name}`} className="flex flex-wrap gap-2">
                    {(Object.keys(statusLabel) as Status[]).map((k) => (
                      <button key={k} type="button" className={`btn ${st === k ? 'btn-primary' : ''}`} aria-pressed={st === k} onClick={() => setStatus(s.id, st === k ? undefined : k)}>{statusLabel[k]}</button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="muted text-sm">Based on a quick review of published research (protein, vitamin D, omega-3, creatine and collagen) and your rehab booklet. Not medical advice.</p>
    </Page>
  )
}
