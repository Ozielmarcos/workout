'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { exerciseApi } from '@/services/api';
import type { Exercise } from '@/types';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { FilterChips } from '@/components/exercises/FilterChips';
import { Pagination } from '@/components/ui/Pagination';

const MUSCLE_OPTIONS = [
  { value: 'chest', label: 'Peito' },
  { value: 'back', label: 'Costas' },
  { value: 'quadriceps', label: 'Quadríceps' },
  { value: 'hamstrings', label: 'Posteriores' },
  { value: 'glutes', label: 'Glúteos' },
  { value: 'shoulders', label: 'Ombros' },
  { value: 'biceps', label: 'Bíceps' },
  { value: 'triceps', label: 'Tríceps' },
  { value: 'abdominals', label: 'Abdômen' },
  { value: 'calves', label: 'Panturrilha' },
  { value: 'lats', label: 'Dorsais' },
  { value: 'lower back', label: 'Lombar' },
];

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'expert', label: 'Avançado' },
];

const CAT_OPTIONS = [
  { value: 'strength', label: 'Força' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'stretching', label: 'Alongamento' },
  { value: 'plyometrics', label: 'Pliometria' },
  { value: 'powerlifting', label: 'Powerlifting' },
  { value: 'strongman', label: 'Strongman' },
];

export default function ExercisesPage() {
  return (
    <Suspense>
      <ExercisesContent />
    </Suspense>
  );
}

function ExercisesContent() {
  const searchParams = useSearchParams();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>(
    searchParams.get('category') ?? undefined,
  );

  const fetchExercises = useCallback(
    async (pg: number) => {
      setLoading(true);
      try {
        const res = await exerciseApi.list({
          page: pg,
          limit: 12,
          search: search || undefined,
          primaryMuscle: muscle,
          level,
          category,
        });
        setExercises(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } finally {
        setLoading(false);
      }
    },
    [search, muscle, level, category],
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
    fetchExercises(1);
  }, [search, muscle, level, category, fetchExercises]);

  function handlePageChange(p: number) {
    setPage(p);
    fetchExercises(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Exercícios
          </h1>
          <p style={{ color: 'var(--color-muted)' }}>
            {total} exercícios disponíveis
          </p>
        </div>
        <input
          type="search"
          placeholder="Buscar exercício..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none w-full sm:w-64"
          style={{
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#7B61FF')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
        />
      </div>

      <div
        className="rounded-2xl p-4 border flex flex-col gap-3"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div>
          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ color: 'var(--color-muted)' }}
          >
            Músculo
          </p>
          <FilterChips
            options={MUSCLE_OPTIONS}
            selected={muscle}
            onSelect={setMuscle}
          />
        </div>
        <div>
          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ color: 'var(--color-muted)' }}
          >
            Nível
          </p>
          <FilterChips
            options={LEVEL_OPTIONS}
            selected={level}
            onSelect={setLevel}
          />
        </div>
        <div>
          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ color: 'var(--color-muted)' }}
          >
            Categoria
          </p>
          <FilterChips
            options={CAT_OPTIONS}
            selected={category}
            onSelect={setCategory}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl animate-pulse"
              style={{ background: 'var(--color-bg-elevated)' }}
            />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <span className="text-5xl">🔍</span>
          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
            Nenhum exercício encontrado
          </p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Tente ajustar os filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
