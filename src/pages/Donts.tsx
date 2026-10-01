import { Link } from 'react-router-dom'
import { dontGroups, dontsIntro, topDonts, type Dont } from '../content/donts'
import { Page, Section } from '../components/ui'

function Row({ d }: { d: Dont }) {
  return (
    <li className="py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold"><span aria-hidden style={{ color: 'var(--bad)' }}>✕ </span>{d.dont}</div>
        {d.card && <Link to={`/cards/${d.card}`} className="chip flex shrink-0 items-center" aria-label={`Open card ${d.card}`}>{d.card}</Link>}
      </div>
      <p className="muted mt-1 text-sm"><strong>Why:</strong> {d.why}</p>
      <p className="mt-1 text-sm"><strong style={{ color: 'var(--good)' }}>Instead:</strong> {d.instead}</p>
    </li>
  )
}

export default function Donts() {
  return (
    <Page title="Don'ts: what makes it worse" back={<Link to="/more" className="muted mb-2 inline-flex items-center text-sm">← More</Link>}>
      <p className="text-sm">{dontsIntro}</p>
      <section className="panel" style={{ borderColor: 'var(--bad)' }}>
        <h2 className="mb-1 font-bold" style={{ color: 'var(--bad)' }}>The most important five</h2>
        <ul>{topDonts.map((t) => <Row key={t.id} d={t} />)}</ul>
      </section>
      {dontGroups.map((g) => (
        <Section key={g.id} title={g.title}>
          <ul>{g.items.map((i) => <Row key={i.id} d={i} />)}</ul>
        </Section>
      ))}
    </Page>
  )
}
