'use client'

import { useState, useEffect, useCallback, FormEvent, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { exerciseApi, workoutApi, type WorkoutItemDto } from '@/services/api'
import type { Exercise } from '@/types'
import { ExerciseCard } from '@/components/exercises/ExerciseCard'
import { FilterChips } from '@/components/exercises/FilterChips'
import { Pagination } from '@/components/ui/Pagination'

const DAYS = ['segunda','terça','quarta','quinta','sexta','sábado','domingo']
const DAY_LABELS: Record<string, string> = {
  segunda:'Seg', terça:'Ter', quarta:'Qua', quinta:'Qui', sexta:'Sex', sábado:'Sáb', domingo:'Dom',
}
const MUSCLE_OPTIONS = [
  { value: 'chest', label: 'Peito' }, { value: 'back', label: 'Costas' },
  { value: 'quadriceps', label: 'Quadríceps' }, { value: 'hamstrings', label: 'Post.' },
  { value: 'glutes', label: 'Glúteos' }, { value: 'shoulders', label: 'Ombros' },
  { value: 'biceps', label: 'Bíceps' }, { value: 'triceps', label: 'Tríceps' },
  { value: 'abdominals', label: 'Abdômen' }, { value: 'calves', label: 'Panturrilha' },
]

type SelectedItem = WorkoutItemDto & { name: string }

export default function EditWorkoutPage() {
  return (
    <Suspense>
      <EditWorkoutContent />
    </Suspense>
  )
}

function EditWorkoutContent() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)

  const [name, setName] = useState('')
  const [days, setDays] = useState<string[]>(['segunda'])
  const [selected, setSelected] = useState<SelectedItem[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [muscle, setMuscle] = useState<string | undefined>()
  const [search, setSearch] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [loadingEx, setLoadingEx] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    workoutApi.getById(id).then(s => {
      setName(s.name); setDays(Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek])
      setSelected(s.items?.map(i => ({ exerciseId: i.exerciseId, name: i.exercise?.namePt ?? i.exercise?.name ?? '', sets: i.sets, reps: i.reps, restSeconds: i.restSeconds })) ?? [])
    }).finally(() => setLoadingData(false))
  }, [id])

  const fetchEx = useCallback(async (pg: number) => {
    setLoadingEx(true)
    try {
      const res = await exerciseApi.list({ page: pg, limit: 8, primaryMuscle: muscle, search: search || undefined })
      setExercises(res.data); setTotalPages(res.totalPages)
    } finally { setLoadingEx(false) }
  }, [muscle, search])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); fetchEx(1) }, [muscle, search, fetchEx])

  function toggleExercise(ex: Exercise) {
    setSelected(prev => prev.some(s => s.exerciseId === ex.id)
      ? prev.filter(s => s.exerciseId !== ex.id)
      : [...prev, { exerciseId: ex.id, name: ex.namePt ?? ex.name, sets: 3, reps: 12, restSeconds: 60 }])
  }

  function updateItem(exerciseId: string, field: keyof WorkoutItemDto, value: number) {
    setSelected(prev => prev.map(s => s.exerciseId === exerciseId ? { ...s, [field]: value } : s))
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Dê um nome à série.'); return }
    if (selected.length === 0) { setError('Adicione ao menos 1 exercício.'); return }
    setSaving(true); setError('')
    try {
      await workoutApi.update(id, { name, dayOfWeek: days, items: selected.map(({ name: _, ...i }) => i) })
      router.push('/workout')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
      setSaving(false)
    }
  }

  if (loadingData) return <div className="animate-pulse h-96 rounded-2xl" style={{ background: 'var(--color-bg-elevated)' }} />

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} type="button"
          className="text-sm cursor-pointer" style={{ color: 'var(--color-muted)' }}>
          ← Voltar
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Editar série</h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Modifique os exercícios e configurações</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: 'var(--color-error-muted)', color: 'var(--color-error)', border: '1px solid rgba(255,77,106,0.3)' }}>
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="rounded-2xl border p-4 flex flex-col gap-3"
            style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <input type="search" placeholder="Buscar exercício..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
              onFocus={e => (e.target.style.borderColor = '#7B61FF')} onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            <FilterChips options={MUSCLE_OPTIONS} selected={muscle} onSelect={setMuscle} />
          </div>
          {loadingEx ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(8)].map((_, i) => <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {exercises.map(ex => (
                <ExerciseCard key={ex.id} exercise={ex} onAdd={toggleExercise} added={selected.some(s => s.exerciseId === ex.id)} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={p => { setPage(p); fetchEx(p) }} />
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave}
            className="rounded-2xl border p-5 flex flex-col gap-5 sticky top-6"
            style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>
              Sua série {selected.length > 0 && <span style={{ color: 'var(--color-primary)' }}>({selected.length})</span>}
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Nome da série</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                onFocus={e => (e.target.style.borderColor = '#7B61FF')} onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Dia da semana</label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => (
                  <button key={d} type="button" onClick={() => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                    className="py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    style={{ background: days.includes(d) ? 'var(--color-primary)' : 'var(--color-bg-elevated)', color: days.includes(d) ? 'white' : 'var(--color-muted)' }}>
                    {DAY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
              {selected.map((item, i) => (
                <div key={item.exerciseId} className="rounded-xl p-3 flex flex-col gap-2 border"
                  style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'var(--color-primary)' }}>{i + 1}</span>
                      <span className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{item.name}</span>
                    </div>
                    <button onClick={() => setSelected(p => p.filter(s => s.exerciseId !== item.exerciseId))} type="button"
                      className="text-xs cursor-pointer" style={{ color: 'var(--color-muted)' }}>✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sets','reps','restSeconds'] as const).map(field => (
                      <div key={field} className="flex flex-col gap-0.5">
                        <label className="text-xs" style={{ color: 'var(--color-muted)' }}>{field === 'sets' ? 'Séries' : field === 'reps' ? 'Reps' : 'Descanso(s)'}</label>
                        <input type="number" value={item[field]} min={1} max={field === 'restSeconds' ? 600 : 100}
                          onChange={e => updateItem(item.exerciseId, field, Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg text-xs text-center outline-none"
                          style={{ background: 'var(--color-bg-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7B61FF, #5A45CC)', boxShadow: '0 4px 16px rgba(123,97,255,0.3)' }}>
              {saving ? 'Salvando...' : 'Atualizar série'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
