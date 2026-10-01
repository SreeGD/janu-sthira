/** Simplified front view of the knee (schematic, not to scale). */
export function KneeDiagram() {
  const label = { fontSize: 11, fontFamily: 'system-ui, sans-serif', fill: 'var(--text)' } as const
  return (
    <figure>
      <svg viewBox="0 0 320 300" className="w-full" role="img" aria-label="Simplified front view of the knee showing the thigh bone, shin bone, ACL, PCL, MCL, LCL and the two menisci">
        <rect x="0" y="0" width="320" height="300" rx="12" fill="var(--bg)" />
        {/* bones */}
        <rect x="118" y="8" width="84" height="72" rx="18" fill="var(--border)" />
        <ellipse cx="132" cy="108" rx="40" ry="32" fill="var(--border)" />
        <ellipse cx="188" cy="108" rx="40" ry="32" fill="var(--border)" />
        <rect x="108" y="168" width="104" height="124" rx="10" fill="var(--border)" />
        <rect x="216" y="182" width="22" height="110" rx="10" fill="var(--border)" opacity="0.7" />
        {/* menisci */}
        <ellipse cx="132" cy="163" rx="30" ry="8" fill="var(--teal)" opacity="0.85" />
        <ellipse cx="188" cy="163" rx="30" ry="8" fill="var(--teal)" opacity="0.85" />
        {/* cruciates */}
        <line x1="146" y1="160" x2="178" y2="104" stroke="var(--orange)" strokeWidth="6" strokeLinecap="round" />
        <line x1="174" y1="160" x2="142" y2="104" stroke="var(--purple)" strokeWidth="6" strokeLinecap="round" />
        {/* collaterals */}
        <line x1="96" y1="112" x2="100" y2="212" stroke="var(--warn)" strokeWidth="6" strokeLinecap="round" />
        <line x1="228" y1="112" x2="228" y2="200" stroke="var(--good)" strokeWidth="6" strokeLinecap="round" />
        {/* labels */}
        <text x="124" y="46" textAnchor="middle" {...label}>Thigh bone</text>
        <text x="160" y="240" textAnchor="middle" {...label}>Shin bone</text>
        <text x="246" y="240" {...label}>Fibula</text>
        <text x="8" y="132" {...label}>MCL</text>
        <text x="8" y="146" {...label} opacity="0.7">(inner)</text>
        <text x="246" y="132" {...label}>LCL</text>
        <text x="246" y="146" {...label} opacity="0.7">(outer)</text>
        <text x="8" y="168" {...label}>Menisci</text>
        <text x="190" y="90" textAnchor="middle" {...label} style={{ fill: 'var(--orange)', fontWeight: 700 }}>ACL</text>
        <text x="130" y="90" textAnchor="middle" {...label} style={{ fill: 'var(--purple)', fontWeight: 700 }}>PCL</text>
      </svg>
      <figcaption className="muted mt-1 text-xs">Front view, schematic. The ACL (orange) and PCL (purple) cross inside the knee; the MCL (amber) and LCL (green) run along the sides; the menisci (teal) sit between the bones.</figcaption>
    </figure>
  )
}
