type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <PageBtn onClick={() => onPageChange(page - 1)} disabled={page <= 1} label="‹" />
      {buildPages(page, totalPages).map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} style={{ color: 'var(--color-muted)' }} className="px-2">…</span>
        ) : (
          <PageBtn key={p} onClick={() => onPageChange(Number(p))} label={String(p)} active={p === page} />
        )
      )}
      <PageBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} label="›" />
    </div>
  )
}

function buildPages(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

function PageBtn({ onClick, disabled, label, active }: {
  onClick: () => void; disabled?: boolean; label: string; active?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled} type="button"
      className="w-9 h-9 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border"
      style={{
        background: active ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
        color: active ? 'white' : 'var(--color-muted)',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
      }}>
      {label}
    </button>
  )
}
