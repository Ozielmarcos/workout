'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { workoutApi } from '@/services/api';
import type { WorkoutSeries } from '@/types';
import { Pagination } from '@/components/ui/Pagination';

const DAY_PT: Record<string, string> = {
  segunda: 'Segunda',
  terça: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
  sábado: 'Sábado',
  domingo: 'Domingo',
};

export default function WorkoutPage() {
  const [series, setSeries] = useState<WorkoutSeries[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function load(p: number) {
    setLoading(true);
    try {
      const res = await workoutApi.list(p);
      setSeries(res.data);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(1);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Remover esta série?')) return;
    await workoutApi.delete(id);
    load(page);
  }

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Meus Treinos
          </h1>
          <p style={{ color: 'var(--color-muted)' }}>
            Suas séries de exercícios
          </p>
        </div>
        <Link
          href="/workout/new"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #7B61FF, #5A45CC)',
            boxShadow: '0 4px 16px rgba(123,97,255,0.3)',
          }}
        >
          + Nova série
        </Link>
      </div>

      {series.length === 0 ? (
        <div
          className="rounded-2xl border p-12 flex flex-col items-center gap-4"
          style={{
            background: 'var(--color-bg-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-5xl">🏋️</span>
          <p
            className="font-semibold text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            Nenhuma série criada
          </p>
          <p
            className="text-sm text-center"
            style={{ color: 'var(--color-muted)' }}
          >
            Crie sua primeira série de exercícios e comece a treinar!
          </p>
          <Link
            href="/workout/new"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7B61FF, #5A45CC)' }}
          >
            Criar primeira série
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {series.map((s) => (
            <SeriesCard
              key={s.id}
              series={s}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          load(p);
        }}
      />
    </div>
  );
}

function SeriesCard({
  series: s,
  onDelete,
}: {
  series: WorkoutSeries;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{
        background: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            className="font-semibold text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            {s.name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {(Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek])
              .map((d) => DAY_PT[d] ?? d)
              .join(', ')}{' '}
            · {s.items?.length ?? 0} exercícios
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/workout/${s.id}/edit`}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
            style={{
              background: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
          >
            Editar
          </Link>
          <button
            onClick={onDelete}
            type="button"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all"
            style={{
              background: 'var(--color-error-muted)',
              color: 'var(--color-error)',
              borderColor: 'var(--color-error)',
            }}
          >
            Remover
          </button>
        </div>
      </div>

      {s.items && s.items.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {s.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm"
              style={{ background: 'var(--color-bg-elevated)' }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                style={{ background: 'var(--color-primary)' }}
              >
                {i + 1}
              </span>
              <span
                className="flex-1 font-medium truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {item.exercise?.namePt ?? item.exercise?.name ?? 'Exercício'}
              </span>
              <span
                className="text-xs flex-shrink-0"
                style={{ color: 'var(--color-muted)' }}
              >
                {item.sets}×{item.reps} · {item.restSeconds}s
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-40 rounded-2xl"
          style={{ background: 'var(--color-bg-elevated)' }}
        />
      ))}
    </div>
  );
}
