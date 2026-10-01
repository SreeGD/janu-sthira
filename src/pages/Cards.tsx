import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bandBasics } from '../content/bandBasics'
import { cardByCode, cards } from '../content/cards'
import type { CardGroup } from '../content/types'
import { CardView } from '../components/CardView'
import { Page, Section } from '../components/ui'

const groups: { id: CardGroup | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'M', label: 'Morning' }, { id: 'L', label: 'Lunch' }, { id: 'E', label: 'Evening' }, { id: 'B', label: 'Bands' }, { id: 'K', label: 'Bend' },
]

export default function Cards() {
  const [q, setQ] = useState('')
  const [g, setG] = useState<CardGroup | 'all'>('all')
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return cards.filter((c) => (g === 'all' || c.group === g) && (!t || `${c.code} ${c.name} ${c.category}`.toLowerCase().includes(t)))
  }, [q, g])

  return (
    <Page title="Exercise cards">
      <input type="text" placeholder="Search by code or name (e.g. M5, bridge)" aria-label="Search cards" value={q} onChange={(e) => setQ(e.target.value)} />
      <Link to="/knee" className="btn w-full">Knee guide: ACL, PCL, menisci and prevention</Link>
      <Link to="/donts" className="btn w-full">Don'ts: what makes it worse</Link>
      <Link to="/bend" className="btn w-full">Getting the bend back: guide and cross-legged sitting</Link>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by session">
        {groups.map((x) => (
          <button key={x.id} type="button" className={`btn ${g === x.id ? 'btn-primary' : ''}`} aria-pressed={g === x.id} onClick={() => setG(x.id)}>{x.label}</button>
        ))}
      </div>
      {(g === 'all' || g === 'B') && !q && (
        <Section title="Band basics">
          <ul className="list-disc pl-5 text-sm">{bandBasics.map((b) => <li key={b}>{b}</li>)}</ul>
        </Section>
      )}
      <ul className="flex flex-col gap-2">
        {list.map((c) => (
          <li key={c.code}>
            <Link to={`/cards/${c.code}`} className="panel flex items-center justify-between gap-2">
              <span><strong>{c.code}</strong> {c.name}</span>
              <span className="chip uppercase">{c.category}</span>
            </Link>
          </li>
        ))}
        {list.length === 0 && <li className="muted">No cards match.</li>}
      </ul>
    </Page>
  )
}

export function CardDetail() {
  const { code = '' } = useParams()
  const card = cardByCode.get(code.toUpperCase())
  const back = <Link to="/cards" className="muted mb-2 inline-flex items-center text-sm">← All cards</Link>
  if (!card) return <Page title="Card not found" back={back}><p>No card with code {code}.</p></Page>
  return (
    <Page title={card.name} back={back}>
      <CardView card={card} />
    </Page>
  )
}
