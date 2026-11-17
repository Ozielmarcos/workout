'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi } from '@/services/api';
import { workoutApi } from '@/services/api';
import type { UserProfile, WorkoutSeries } from '@/types';
import { ImcGauge } from '@/components/ui/ImcGauge';
import Image from 'next/image';
const seriesImg = '/series.jpeg';
const exercicioImg = '/exercicies.jpeg';
const imcImg = '/seu-imc.jpeg';
const goalImg = '/goal.jpeg';
const treinoImg = '/marcar-treino.webp';

const DAY_LABELS: Record<string, string> = {
  segunda: 'Seg',
  terça: 'Ter',
  quarta: 'Qua',
  quinta: 'Qui',
  sexta: 'Sex',
  sábado: 'Sáb',
  domingo: 'Dom',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [series, setSeries] = useState<WorkoutSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [prof, work] = await Promise.allSettled([
        profileApi.get(),
        workoutApi.list(1, 4),
      ]);
      if (prof.status === 'fulfilled') setProfile(prof.value);
      if (work.status === 'fulfilled') setSeries(work.value.data);
      setLoading(false);
    }
    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Atleta';

  if (loading) return <PageSkeleton />;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: 'var(--color-text)' }}
        >
          Olá, {firstName}
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>Pronto para treinar hoje?</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Séries criadas"
          value={String(series.length)}
          image={seriesImg}
        />
        <StatCard label="Exercícios" value="876+" image={exercicioImg} />
        <StatCard
          label="Seu IMC"
          value={profile ? String(profile.imc) : '—'}
          image={imcImg}
        />
        <StatCard
          label="Objetivo"
          value={profile?.goal ?? '—'}
          image={goalImg}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {profile ? (
          <div
            className="rounded-2xl p-6 border flex flex-col gap-4"
            style={{
              background: 'var(--color-bg-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="font-semibold text-lg"
                style={{ color: 'var(--color-text)' }}
              >
                Índice de Massa Corporal
              </h2>
              <Link
                href="/profile"
                className="text-sm font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                Atualizar →
              </Link>
            </div>
            <ImcGauge
              imc={profile.imc}
              classification={profile.imcClassification}
            />
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <Metric label="Peso" value={`${profile.weight} kg`} />
              <Metric label="Altura" value={`${profile.height} cm`} />
              <Metric label="Idade" value={`${profile.age} anos`} />
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 border flex flex-col items-center justify-center gap-3 text-center"
            style={{
              background: 'var(--color-bg-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <span className="text-4xl">📊</span>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
              Complete seu perfil
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Preencha seus dados para calcular seu IMC e receber recomendações
              personalizadas.
            </p>
            <Link
              href="/profile"
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #7B61FF, #5A45CC)',
              }}
            >
              Criar perfil
            </Link>
          </div>
        )}

        <div
          className="rounded-2xl p-6 border flex flex-col gap-4"
          style={{
            background: 'var(--color-bg-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="font-semibold text-lg"
              style={{ color: 'var(--color-text)' }}
            >
              Séries recentes
            </h2>
            <Link
              href="/workout"
              className="text-sm font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              Ver todas →
            </Link>
          </div>

          {series.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Image
                src={treinoImg}
                alt="Imagem de treino"
                width={500}
                height={300}
              />
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Nenhuma série criada ainda.
              </p>
              <Link
                href="/workout/new"
                className="mt-1 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #7B61FF, #5A45CC)',
                }}
              >
                Criar série
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {series.map((s) => (
                <Link
                  key={s.id}
                  href={`/workout/${s.id}/edit`}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors"
                  style={{ background: 'var(--color-bg-elevated)' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      'var(--color-primary)')
                  }
                >
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {s.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {(Array.isArray(s.dayOfWeek)
                        ? s.dayOfWeek
                        : [s.dayOfWeek]
                      )
                        .map((d: string) => DAY_LABELS[d] ?? d)
                        .join(', ')}{' '}
                      · {s.items?.length ?? 0} exercícios
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-lg font-medium"
                    style={{
                      background: 'var(--color-primary-muted)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {(Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek])
                      .map((d: string) => DAY_LABELS[d] ?? d)
                      .join(', ')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  image,
}: {
  label: string;
  value: string;
  icon?: string;
  image: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 border flex flex-col gap-2"
      style={{
        background: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {image ? (
        <Image src={image} alt="Imagens" width={250} height={150} />
      ) : (
        <span className="text-2xl">{icon}</span>
      )}
      <p
        className="text-xl font-bold truncate"
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {label}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'var(--color-bg-elevated)' }}
    >
      <p
        className="font-semibold text-sm"
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
        {label}
      </p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-pulse">
      <div
        className="h-10 w-48 rounded-xl"
        style={{ background: 'var(--color-bg-elevated)' }}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl"
            style={{ background: 'var(--color-bg-elevated)' }}
          />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div
          className="h-56 rounded-2xl"
          style={{ background: 'var(--color-bg-elevated)' }}
        />
        <div
          className="h-56 rounded-2xl"
          style={{ background: 'var(--color-bg-elevated)' }}
        />
      </div>
    </div>
  );
}
