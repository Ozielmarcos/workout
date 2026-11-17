'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { profileApi, type CreateProfileDto } from '@/services/api';
import type { UserProfile } from '@/types';
import { ImcGauge } from '@/components/ui/ImcGauge';

const GOALS = [
  { value: 'hipertrofia', label: 'Hipertrofia' },
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'condicionamento', label: 'Condicionamento' },
  { value: 'flexibilidade', label: 'Flexibilidade' },
];

const GOAL_RECOMMENDATIONS: Record<
  string,
  { label: string; categories: string[] }
> = {
  hipertrofia: {
    label: 'Hipertrofia',
    categories: ['strength', 'powerlifting', 'strongman'],
  },
  emagrecimento: {
    label: 'Emagrecimento',
    categories: ['cardio', 'plyometrics', 'stretching'],
  },
  condicionamento: {
    label: 'Condicionamento',
    categories: ['strength', 'cardio', 'plyometrics'],
  },
  flexibilidade: { label: 'Flexibilidade', categories: ['stretching'] },
};

const CAT_LABELS: Record<string, string> = {
  strength: 'Força',
  cardio: 'Cardio',
  plyometrics: 'Pliometria',
  stretching: 'Alongamento',
  powerlifting: 'Powerlifting',
  strongman: 'Strongman',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<CreateProfileDto>({
    height: 170,
    weight: 70,
    age: 25,
    gender: 'masculino',
    goal: 'condicionamento',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    profileApi
      .get()
      .then((p) => {
        setProfile(p);
        setForm({
          height: p.height,
          weight: p.weight,
          age: p.age,
          gender: p.gender,
          goal: p.goal,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof CreateProfileDto>(
    key: K,
    value: CreateProfileDto[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const saved = profile
        ? await profileApi.update(form)
        : await profileApi.create(form);
      setProfile(saved);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Excluir perfil? Esta ação não pode ser desfeita.')) return;
    setDeleting(true);
    setError('');
    try {
      await profileApi.delete();
      setProfile(null);
      setForm({
        height: 170,
        weight: 70,
        age: 25,
        gender: 'masculino',
        goal: 'condicionamento',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setDeleting(false);
    }
  }

  const rec = profile ? GOAL_RECOMMENDATIONS[profile.goal] : null;

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: 'var(--color-text)' }}
        >
          Meu Perfil
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>
          Dados de saúde e objetivos
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div
          className="rounded-2xl p-6 border flex flex-col gap-5"
          style={{
            background: 'var(--color-bg-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>
            Dados físicos
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: 'var(--color-error-muted)',
                  color: 'var(--color-error)',
                  border: '1px solid rgba(255,77,106,0.3)',
                }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: 'var(--color-accent-muted)',
                  color: 'var(--color-accent)',
                  border: '1px solid rgba(0,229,160,0.3)',
                }}
              >
                Perfil salvo com sucesso!
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <NumberField
                label="Altura (cm)"
                value={form.height}
                min={100}
                max={250}
                onChange={(v) => update('height', v)}
              />
              <NumberField
                label="Peso (kg)"
                value={form.weight}
                min={30}
                max={300}
                onChange={(v) => update('weight', v)}
                step={0.1}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberField
                label="Idade"
                value={form.age}
                min={10}
                max={100}
                onChange={(v) => update('age', v)}
              />
              <SelectField
                label="Sexo"
                value={form.gender}
                onChange={(v) => update('gender', v)}
                options={[
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'feminino', label: 'Feminino' },
                  { value: 'outro', label: 'Outro' },
                ]}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-muted)' }}
              >
                Objetivo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => update('goal', g.value)}
                    className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer border"
                    style={{
                      background:
                        form.goal === g.value
                          ? 'var(--color-primary-muted)'
                          : 'var(--color-bg-elevated)',
                      color:
                        form.goal === g.value
                          ? 'var(--color-primary)'
                          : 'var(--color-muted)',
                      borderColor:
                        form.goal === g.value
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7B61FF, #5A45CC)',
                boxShadow: '0 4px 20px rgba(123,97,255,0.3)',
              }}
            >
              {saving
                ? 'Salvando...'
                : profile
                  ? 'Atualizar perfil'
                  : 'Criar perfil'}
            </button>
            {profile && (
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="w-full py-2.5 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-60 text-sm"
                style={{
                  background: 'var(--color-error-muted)',
                  color: 'var(--color-error)',
                  border: '1px solid rgba(255,77,106,0.3)',
                }}
              >
                {deleting ? 'Excluindo...' : 'Excluir perfil'}
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-4">
          {profile && (
            <div
              className="rounded-2xl p-6 border flex flex-col gap-4"
              style={{
                background: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <h2
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Índice de Massa Corporal
              </h2>
              <ImcGauge
                imc={profile.imc}
                classification={profile.imcClassification}
              />
              <ImcScale />
            </div>
          )}

          {rec && (
            <div
              className="rounded-2xl p-6 border flex flex-col gap-3"
              style={{
                background: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <h2
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Recomendações para {rec.label}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Com base no seu objetivo, priorizamos estas categorias:
              </p>
              <div className="flex flex-wrap gap-2">
                {rec.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{
                      background: 'var(--color-accent-muted)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {CAT_LABELS[cat] ?? cat}
                  </span>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Acesse a seção de{' '}
                <Link
                  href={`/exercises?category=${rec.categories[0]}`}
                  className="font-semibold transition-colors"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Exercícios
                </Link>{' '}
                e filtre por estas categorias para montar sua série.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImcScale() {
  const zones = [
    { label: 'Abaixo', color: '#60A5FA', range: '< 18.5' },
    { label: 'Normal', color: '#00E5A0', range: '18.5–24.9' },
    { label: 'Sobrepeso', color: '#FBBF24', range: '25–29.9' },
    { label: 'Ob. I', color: '#FB923C', range: '30–34.9' },
    { label: 'Ob. II+', color: '#EF4444', range: '≥ 35' },
  ];
  return (
    <div className="flex gap-1">
      {zones.map((z) => (
        <div key={z.label} className="flex-1 flex flex-col gap-1">
          <div className="h-2 rounded-full" style={{ background: z.color }} />
          <p
            className="text-center"
            style={{ fontSize: 9, color: 'var(--color-muted)' }}
          >
            {z.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#7B61FF')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all cursor-pointer"
        style={{
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6 animate-pulse">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-96 rounded-2xl"
          style={{ background: 'var(--color-bg-elevated)' }}
        />
      ))}
    </div>
  );
}
