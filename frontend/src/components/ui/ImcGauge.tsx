type ImcGaugeProps = { imc: number; classification: string }

const IMC_COLORS: [number, string][] = [
  [18.5, '#60A5FA'],
  [25,   '#00E5A0'],
  [30,   '#FBBF24'],
  [35,   '#FB923C'],
  [40,   '#F87171'],
  [Infinity, '#EF4444'],
]

function getColor(imc: number): string {
  return IMC_COLORS.find(([max]) => imc < max)?.[1] ?? '#EF4444'
}

export function ImcGauge({ imc, classification }: ImcGaugeProps) {
  const color = getColor(imc)
  const clampedImc = Math.min(Math.max(imc, 10), 45)
  const pct = ((clampedImc - 10) / 35) * 100

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full h-4 rounded-full overflow-hidden"
        style={{ background: 'var(--color-bg-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #60A5FA, ${color})` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-700"
          style={{ left: `calc(${pct}% - 8px)`, background: color }} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold" style={{ color }}>{imc}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>{classification}</span>
      </div>
    </div>
  )
}
