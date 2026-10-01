import { Link } from 'react-router-dom'
import { bendIntro, bendNeeded, crossLegged, dontForce, floorSitting, gettingBendBack, trackingHow, whyNoBend } from '../content/bend'
import { Page, Section, WarningBanner } from '../components/ui'

export default function Bend() {
  return (
    <Page title="Getting the bend back" back={<Link to="/cards" className="muted mb-2 inline-flex items-center text-sm">← Cards</Link>}>
      <p className="text-sm">{bendIntro}</p>
      <WarningBanner level="warn">{dontForce}</WarningBanner>

      <Section title="Why the knee will not bend fully">
        <ul className="text-sm">{whyNoBend.map((w) => <li key={w.title} className="mb-1"><strong>{w.title}.</strong> {w.text}</li>)}</ul>
      </Section>

      <Section title="Getting the bend back">
        <ul className="text-sm">
          {gettingBendBack.map((g) => (
            <li key={g.code} className="mb-2 flex items-start justify-between gap-2">
              <span>{g.text}</span>
              <Link to={`/cards/${g.code}`} className="chip flex shrink-0 items-center" aria-label={`Open card ${g.code}`}>{g.code}</Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="How much bend each activity needs">
        <table><tbody>{bendNeeded.map((b) => <tr key={b.activity}><td>{b.activity}</td><td className="font-semibold">{b.bend}</td></tr>)}</tbody></table>
      </Section>

      <Section title="Sitting cross-legged">
        <p className="text-sm">{crossLegged}</p>
      </Section>

      <Section title="Floor sitting (meals, prayer, temple)">
        <ul className="list-disc pl-5 text-sm">{floorSitting.map((f) => <li key={f}>{f}</li>)}</ul>
        <p className="mt-2 text-sm"><Link to="/cards/K3" className="underline">Open the floor-sitting card (K3)</Link></p>
      </Section>

      <Section title="Tracking your progress">
        <p className="text-sm">{trackingHow}</p>
        <p className="mt-2 text-sm"><Link to="/progress" className="underline">See the trend on Progress</Link></p>
      </Section>
    </Page>
  )
}
