import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cardByCode } from '../content/cards'
import { firstAid, kneeDisclaimer, kneeIntro, prevention, preventionIntro, redFlags, structures } from '../content/knee'
import { KneeDiagram } from '../components/KneeDiagram'
import { Page, Section, WarningBanner } from '../components/ui'

function CardChips({ codes }: { codes?: string[] }) {
  if (!codes?.length) return null
  return (
    <p className="mt-2 flex flex-wrap items-center gap-1 text-sm">
      <span className="muted">Related exercises:</span>
      {codes.filter((c) => cardByCode.has(c)).map((c) => (
        <Link key={c} to={`/cards/${c}`} className="chip flex items-center" aria-label={`Open card ${c}: ${cardByCode.get(c)?.name}`}>{c}</Link>
      ))}
    </p>
  )
}

export default function Knee() {
  const [open, setOpen] = useState<string | null>('acl')
  return (
    <Page title="Knee guide" back={<Link to="/more" className="muted mb-2 inline-flex items-center text-sm">← More</Link>}>
      <p className="text-sm">{kneeIntro}</p>
      <KneeDiagram />

      <h2 className="h-title mt-2">The parts of the knee</h2>
      <ul className="flex flex-col gap-2">
        {structures.map((s) => {
          const isOpen = open === s.id
          return (
            <li key={s.id} className="panel">
              <button type="button" className="w-full text-left" style={{ minHeight: 44 }} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold" style={{ color: 'var(--navy)' }}>{s.name}</span>
                  <span className="chev muted" aria-hidden>▸</span>
                </div>
                <div className="muted mt-1 text-sm">{s.short}</div>
              </button>
              {isOpen && (
                <div className="mt-3 flex flex-col gap-3 text-sm">
                  <p><strong>What it is.</strong> {s.what}</p>
                  <p><strong>What it does.</strong> {s.job}</p>
                  <p><strong>How it gets injured.</strong> {s.injury}</p>
                  <div>
                    <strong>Common signs</strong>
                    <ul className="mt-1 list-disc pl-5">{s.signs.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                  <p><strong>Treatment.</strong> {s.treatment}</p>
                  <div>
                    <strong style={{ color: 'var(--good)' }}>How to take care of it</strong>
                    <ul className="mt-1 list-disc pl-5">{s.care.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                  <p><strong style={{ color: 'var(--bad)' }}>When to get help.</strong> {s.help}</p>
                  <CardChips codes={s.cards} />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <h2 className="h-title mt-2">How to avoid knee injuries</h2>
      <p className="text-sm">{preventionIntro}</p>
      {prevention.map((g) => (
        <Section key={g.id} title={g.title}>
          <ul className="list-disc pl-5 text-sm">{g.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <CardChips codes={g.cards} />
        </Section>
      ))}

      <h2 className="h-title mt-2">If you hurt your knee</h2>
      <Section title="First steps"><ol className="list-decimal pl-5 text-sm">{firstAid.map((f) => <li key={f}>{f}</li>)}</ol></Section>
      <WarningBanner level="stop">
        <strong>Get medical help promptly if:</strong>
        <ul className="mt-1 list-disc pl-5">{redFlags.map((r) => <li key={r}>{r}</li>)}</ul>
        <Link to="/safety" className="mt-1 inline-block underline">Safety page</Link>
      </WarningBanner>
      <p className="muted text-sm">{kneeDisclaimer} See also <Link to="/donts" className="underline">Don'ts</Link> and <Link to="/bend" className="underline">Getting the bend back</Link>.</p>
    </Page>
  )
}
