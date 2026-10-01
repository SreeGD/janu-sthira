import { Link } from 'react-router-dom'
import { checkpoints as cps, livingTips, phases, reconsiderSurgery } from '../content/checkpoints'
import { firstWeeksAdjustments, mriFindings, mriIntro, surgeonQuestion } from '../content/mri'
import { Page, Section, WarningBanner } from '../components/ui'
import { checkpointStatuses } from '../domain/checkpoints'
import { programmeWeek } from '../domain/dates'
import { useSettings } from '../hooks/useSettings'
import { useToday } from '../hooks/useToday'

export function Mri() {
  return (
    <Page title="MRI guide">
      <Section title="What it means"><p className="text-sm">{mriIntro}</p><p className="mt-2 text-sm"><strong>{surgeonQuestion}</strong></p></Section>
      <div className="panel" style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Finding</th><th>Plain meaning</th><th>What it changes</th></tr></thead>
          <tbody>{mriFindings.map((f) => <tr key={f.finding}><td>{f.finding}</td><td>{f.meaning}</td><td>{f.changes}</td></tr>)}</tbody>
        </table>
      </div>
      <Section title="Adjustments for the first 2-3 weeks"><ul className="list-disc pl-5 text-sm">{firstWeeksAdjustments.map((a) => <li key={a}>{a}</li>)}</ul></Section>
      <WarningBanner level="stop">If you have a Baker's cyst or varicose veins, sudden calf pain, swelling or tightness needs checking the same day. <Link to="/safety" className="underline">Safety</Link></WarningBanner>
    </Page>
  )
}

export function Checkpoints() {
  const { settings, update } = useSettings()
  const today = useToday()
  const statuses = checkpointStatuses(settings.startDate, today)
  return (
    <Page title="Checkpoints">
      <Section title="Programme start">
        <label className="block text-sm font-semibold">
          Start date
          <input type="date" value={settings.startDate} onChange={(e) => e.target.value && update({ startDate: e.target.value })} />
        </label>
        <p className="mt-2">You are in <strong>week {programmeWeek(settings.startDate, today)}</strong>.</p>
      </Section>
      {statuses.map((s) => (
        <Section key={s.id} title={`${s.label}: ${s.date}`}>
          <p className="muted text-sm">{s.passed ? 'Date has passed' : s.daysLeft === 0 ? 'Today' : `In ${s.daysLeft} days`}</p>
          <p className="my-1 text-sm">{s.description}</p>
          <textarea rows={3} aria-label={`Notes for ${s.label}`} placeholder="Notes and questions for this review" value={settings.checkpointNotes[s.id] ?? ''} onChange={(e) => update({ checkpointNotes: { ...settings.checkpointNotes, [s.id]: e.target.value } })} />
        </Section>
      ))}
      <Section title="Progressing over 6 months">
        <p className="muted mb-2 text-sm">Move to the next phase only when you meet all the goals of the current one. Your physio should guide Phase 2 and 3.</p>
        {phases.map((p) => (
          <div key={p.name} className="mb-3 text-sm"><strong>{p.name}</strong><p>{p.focus}</p><p className="muted"><em>Goals before moving on:</em> {p.goals}</p></div>
        ))}
      </Section>
      <Section title="When to reconsider reconstruction"><ul className="list-disc pl-5 text-sm">{reconsiderSurgery.map((r) => <li key={r}>{r}</li>)}</ul>
        <p className="mt-2 text-sm">Each giving-way episode can damage the meniscus and cartilage, so keep a note of any episodes and don't wait them out.</p></Section>
      <p className="hidden">{cps.length}</p>
    </Page>
  )
}

export function Living() {
  return (
    <Page title="Living with your knee">
      {livingTips.map((t) => (
        <Section key={t.title} title={t.title}><ul className="list-disc pl-5 text-sm">{t.points.map((p) => <li key={p}>{p}</li>)}</ul></Section>
      ))}
    </Page>
  )
}
