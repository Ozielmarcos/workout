import type { Exercise } from '@/types';

const LEVEL_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  beginner: {
    label: 'Iniciante',
    color: '#00E5A0',
    bg: 'rgba(0,229,160,0.12)',
  },
  intermediate: {
    label: 'Intermediário',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.12)',
  },
  expert: { label: 'Avançado', color: '#FF4D6A', bg: 'rgba(255,77,106,0.12)' },
};

const CAT_LABELS: Record<string, string> = {
  strength: 'Força',
  cardio: 'Cardio',
  plyometrics: 'Pliometria',
  stretching: 'Alongamento',
  powerlifting: 'Powerlifting',
  strongman: 'Strongman',
};

type ExerciseCardProps = {
  exercise: Exercise;
  onAdd?: (ex: Exercise) => void;
  added?: boolean;
};

export function ExerciseCard({
  exercise: ex,
  onAdd,
  added,
}: ExerciseCardProps) {
  const level = LEVEL_STYLES[ex.level] ?? LEVEL_STYLES.beginner;

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        className="relative h-36 overflow-hidden flex shrink-0"
        style={{ background: 'var(--color-bg-elevated)' }}
      >
        {ex.images[0] ? (
          <img
            src={ex.images[0]}
            alt={ex.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🏋️
          </div>
        )}
        <span
          className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{
            background: level.bg,
            color: level.color,
            backdropFilter: 'blur(8px)',
          }}
        >
          {level.label}
        </span>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-3">
        <div>
          <h3
            className="font-semibold text-sm leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {ex.namePt ?? ex.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {CAT_LABELS[ex.category] ?? ex.category}
            {ex.equipment && ` · ${ex.equipment}`}
          </p>
        </div>

        {ex.primaryMuscles.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ex.primaryMuscles.slice(0, 3).map((m) => (
              <span
                key={m}
                className="text-xs px-2 py-0.5 rounded-lg"
                style={{
                  background: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {onAdd && (
          <button
            onClick={() => onAdd(ex)}
            type="button"
            className="mt-auto w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
            style={{
              background: added
                ? 'var(--color-accent-muted)'
                : 'var(--color-bg-elevated)',
              color: added ? 'var(--color-accent)' : 'var(--color-primary)',
              borderColor: added
                ? 'var(--color-accent)'
                : 'var(--color-primary)',
            }}
          >
            {added ? '✓ Adicionado' : '+ Adicionar à série'}
          </button>
        )}
      </div>
    </div>
  );
}
