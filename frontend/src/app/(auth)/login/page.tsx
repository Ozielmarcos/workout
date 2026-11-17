'use client';

import { useState, SubmitEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import { Logo } from '@/components/ui/Logo';
import { validateEmail } from '@/utils/validators';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!password) {
      setError('Informe a senha.');
      return;
    }
    setLoading(true);
    try {
      const { token } = await authApi.login({ email, password });
      login(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div
        className="hidden lg:flex lg:w-3/5 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'var(--color-bg-surface)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-120 h-120 rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(circle, #7B61FF 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-15 -right-15 w-100 h-100 rounded-full opacity-15"
            style={{
              background:
                'radial-gradient(circle, #00E5A0 0%, transparent 70%)',
            }}
          />
          <DotGrid />
        </div>

        <div className="relative z-10">
          <Logo size={52} withText />
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h1
              className="text-5xl font-bold leading-tight mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Transform
              <br />
              your body.
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #7B61FF, #00E5A0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Track every rep.
              </span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
              Planeje seus treinos semanais, acompanhe sua evolução
              <br />e conquiste seus objetivos.
            </p>
          </div>

          <div className="flex gap-4">
            <StatCard icon="🏋️" value="876" label="Exercícios" />
            <StatCard icon="🔥" value="3×" label="Treinos/semana" />
            <StatCard icon="📊" label="Calcule seu IMC" value="BMI" />
          </div>
        </div>

        <div className="relative z-10 flex justify-end opacity-30">
          <DumbbellIllustration />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10 lg:hidden">
            <Logo size={52} withText />
          </div>

          <div
            className="rounded-2xl p-8 border"
            style={{
              background: 'var(--color-bg-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="mb-8">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                Bem-vindo de volta
              </h2>
              <p style={{ color: 'var(--color-muted)' }}>
                Entre na sua conta para continuar
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    background: 'var(--color-error-muted)',
                    color: 'var(--color-error)',
                    border: '1px solid rgba(255,77,106,0.3)',
                  }}
                >
                  {error}
                </div>
              )}

              <Field
                label="E-mail"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />

              <Field
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 mt-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? 'var(--color-primary)'
                    : 'linear-gradient(135deg, #7B61FF 0%, #5A45CC 100%)',
                  boxShadow: '0 4px 24px rgba(123,97,255,0.35)',
                }}
                onMouseEnter={(e) =>
                  !loading && ((e.target as HTMLElement).style.opacity = '0.9')
                }
                onMouseLeave={(e) =>
                  !loading && ((e.target as HTMLElement).style.opacity = '1')
                }
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p
              className="text-center mt-6 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              Ainda não tem conta?{' '}
              <Link
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: 'var(--color-accent)' }}
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
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

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div
      className="flex-1 rounded-2xl p-4 border flex flex-col gap-1"
      style={{
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
      }}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className="text-xl font-bold"
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </span>
      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {label}
      </span>
    </div>
  );
}

function DotGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dots"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="1.5"
            cy="1.5"
            r="1.5"
            fill="#ffffff"
            fillOpacity="0.045"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function DumbbellIllustration() {
  return (
    <svg
      width="280"
      height="120"
      viewBox="0 0 280 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="60" y="50" width="160" height="20" rx="10" fill="url(#dGrad)" />
      <rect x="30" y="28" width="38" height="64" rx="12" fill="url(#dGrad)" />
      <rect
        x="10"
        y="38"
        width="24"
        height="44"
        rx="8"
        fill="url(#dGrad)"
        fillOpacity="0.6"
      />
      <rect x="212" y="28" width="38" height="64" rx="12" fill="url(#dGrad)" />
      <rect
        x="246"
        y="38"
        width="24"
        height="44"
        rx="8"
        fill="url(#dGrad)"
        fillOpacity="0.6"
      />
      <defs>
        <linearGradient
          id="dGrad"
          x1="0"
          y1="0"
          x2="280"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7B61FF" />
          <stop offset="100%" stopColor="#00E5A0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
