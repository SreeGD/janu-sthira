import { Link } from 'react-router-dom'
import { calfWarning, callDoctor, disclaimer, dopplerText, emergency, givingWayRule, stopRules } from '../content/safety'
import { Page, Section, WarningBanner } from '../components/ui'
import { useSettings } from '../hooks/useSettings'
import { todayLocal } from '../domain/dates'

export default function Safety() {
  const { settings, update } = useSettings()
  return (
    <Page title="Safety">
      <WarningBanner level="stop"><strong>{calfWarning.title}.</strong> {calfWarning.text}</WarningBanner>
      <WarningBanner level="stop">{emergency}</WarningBanner>
      <Section title="Call your doctor">
        <ul className="list-disc pl-5 text-sm">{callDoctor.map((c) => <li key={c}>{c}</li>)}</ul>
      </Section>
      <Section title={givingWayRule.title}>
        <p className="text-sm">{givingWayRule.text}</p>
      </Section>
      <Link to="/donts" className="btn w-full">Don'ts: what makes it worse</Link>
      <Section title="Stop rules for every exercise">
        <ul className="list-disc pl-5 text-sm">{stopRules.map((c) => <li key={c}>{c}</li>)}</ul>
        <p className="mt-2 text-sm">Each card also has its own "stop if" line. <Link className="underline" to="/cards">Open cards</Link></p>
      </Section>
      <Section title="Venous Doppler scan">
        <p className="mb-2 text-sm">{dopplerText}</p>
        <label className="mb-2 flex items-center gap-3">
          <input type="checkbox" className="h-6 w-6" checked={!!settings.dopplerAdvised} onChange={(e) => update({ dopplerAdvised: e.target.checked })} />
          <span>My doctor advised a Doppler scan (show a reminder)</span>
        </label>
        {settings.dopplerAdvised && <label className="flex items-center gap-3">
          <input type="checkbox" className="h-6 w-6" checked={settings.dopplerDone} onChange={(e) => update({ dopplerDone: e.target.checked, dopplerDoneOn: e.target.checked ? todayLocal() : undefined })} />
          <span>Doppler scan done{settings.dopplerDoneOn ? ` (${settings.dopplerDoneOn})` : ''}</span>
        </label>}
      </Section>
      <p className="muted text-sm">{disclaimer}</p>
    </Page>
  )
}
