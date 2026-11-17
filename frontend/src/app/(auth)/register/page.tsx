'use client';

import { useState, SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { Logo } from '@/components/ui/Logo';
import {
  validateEmail,
  validatePassword,
  validateCpf,
  formatCpf,
  getPasswordStrength,
} from '@/utils/validators';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'Nome é obrigatório.';
    if (!validateEmail(form.email)) return 'E-mail inválido.';
    if (!validateCpf(form.cpf)) return 'CPF inválido.';
    if (!validatePassword(form.password))
      return 'Senha fraca: mín. 8 caracteres, 1 maiúscula, 1 número, 1 especial.';
    if (form.password !== form.confirmPassword)
      return 'As senhas não coincidem.';
    return null;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        cpf: form.cpf,
        password: form.password,
      });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(form.password);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size={48} withText />
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'var(--color-bg-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="mb-6">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Criar conta
            </h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Comece sua jornada hoje
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
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
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(v) => update('name', v)}
              autoComplete="name"
            />
            <Field
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={form.email}
              onChange={(v) => update('email', v)}
              autoComplete="email"
            />
            <Field
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(v) => update('cpf', formatCpf(v))}
              autoComplete="off"
            />
            <Field
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(v) => update('password', v)}
              autoComplete="new-password"
            />

            {form.password && (
              <div className="flex gap-1.5 -mt-2">
                {(['weak', 'medium', 'strong'] as const).map((s, i) => (
                  <div
                    key={s}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i < ['weak', 'medium', 'strong'].indexOf(strength) + 1
                          ? strength === 'weak'
                            ? '#FF4D6A'
                            : strength === 'medium'
                              ? '#F59E0B'
                              : '#00E5A0'
                          : 'var(--color-border)',
                    }}
                  />
                ))}
              </div>
            )}

            <Field
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(v) => update('confirmPassword', v)}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 mt-1 cursor-pointer disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7B61FF 0%, #5A45CC 100%)',
                boxShadow: '0 4px 24px rgba(123,97,255,0.35)',
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p
            className="text-center mt-5 text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            Já tem conta?{' '}
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: 'var(--color-accent)' }}
            >
              Entrar
            </Link>
          </p>
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
      <input
        id={id}
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
