type FilterChipsProps<T extends string> = {
  options: { value: T; label: string }[]
  selected: T | undefined
  onSelect: (value: T | undefined) => void
}

export function FilterChips<T extends string>({ options, selected, onSelect }: FilterChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip label="Todos" active={!selected} onClick={() => onSelect(undefined)} />
      {options.map(o => (
        <Chip key={o.value} label={o.label} active={selected === o.value} onClick={() => onSelect(selected === o.value ? undefined : o.value)} />
      ))}
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} type="button"
      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
      style={{
        background: active ? 'var(--color-primary-muted)' : 'var(--color-bg-elevated)',
        color: active ? 'var(--color-primary)' : 'var(--color-muted)',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
      }}>
      {label}
    </button>
  )
}
