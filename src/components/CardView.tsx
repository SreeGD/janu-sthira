import type { ExerciseCard } from '../content/types'

const Line = ({ label, color, children }: { label: string; color: string; children?: string }) =>
  children ? (
    <p className="mt-2 text-sm">
      <strong style={{ color }}>{label}</strong> {children}
    </p>
  ) : null

export function CardView({ card }: { card: ExerciseCard }) {
  return (
    <article className="panel" aria-labelledby={`card-${card.code}`}>
      <header className="flex items-start justify-between gap-2">
        <h2 id={`card-${card.code}`} className="flex items-center gap-2 font-bold" style={{ color: 'var(--navy)' }}>
          <span className="rounded-md px-2 py-0.5 text-sm" style={{ background: 'var(--navy)', color: 'var(--bg)' }}>{card.code}</span>
          <span className="sr-only">{card.name}</span>
        </h2>
        <span className="chip uppercase">{card.category}</span>
      </header>
      <img
        src={`./illustrations/${card.code}.svg`}
        alt={`Illustration for ${card.name}: orange is the injured leg`}
        className="my-3 w-full rounded-lg"
        style={{ background: 'var(--bg)', maxHeight: 200, objectFit: 'contain' }}
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
      />
      <Line label="HOW MUCH:" color="var(--teal)">{card.howMuch}</Line>
      <ol className="mt-2 list-decimal pl-5 text-[15px] leading-relaxed">
        {card.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <Line label="HOLD / REPEAT:" color="var(--teal)">{card.holdRepeat}</Line>
      <Line label="BREATH:" color="var(--teal)">{card.breath}</Line>
      <Line label="YOU SHOULD FEEL:" color="var(--teal)">{card.feel}</Line>
      <Line label="KNEE SAFETY:" color="var(--bad)">{card.kneeSafety}</Line>
      <Line label="EASIER:" color="var(--navy)">{card.easier}</Line>
      <Line label="HARDER:" color="var(--navy)">{card.harder}</Line>
      <Line label="STOP IF:" color="var(--bad)">{card.stopIf}</Line>
    </article>
  )
}
