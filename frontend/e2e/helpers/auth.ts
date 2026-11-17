import { type Page } from '@playwright/test'

export function generateValidCpf(): string {
  const ts = Date.now().toString().slice(-9).padStart(9, '0')
  const d = ts.split('').map(Number)
  const sum1 = d.reduce((acc, v, i) => acc + v * (10 - i), 0)
  const r1 = (sum1 * 10) % 11
  const d1 = r1 >= 10 ? 0 : r1
  const sum2 = d.reduce((acc, v, i) => acc + v * (11 - i), 0) + d1 * 2
  const r2 = (sum2 * 10) % 11
  const d2 = r2 >= 10 ? 0 : r2
  return `${ts.slice(0, 3)}.${ts.slice(3, 6)}.${ts.slice(6, 9)}-${d1}${d2}`
}

const API = 'http://localhost:3000/api'

export const E2E_USER = {
  name: 'E2E Playwright',
  email: 'e2e.playwright@test.com',
  cpf: '111.444.777-35',
  password: 'E2eTest@123',
}

export async function ensureUser(): Promise<string> {
  await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(E2E_USER),
  })

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: E2E_USER.email, password: E2E_USER.password }),
  })
  const data = (await res.json()) as { token: string }
  return data.token
}

export async function loginAs(page: Page, token?: string): Promise<void> {
  const t = token ?? (await ensureUser())
  await page.goto('/login')
  await page.evaluate((tok) => localStorage.setItem('token', tok), t)
  await page.goto('/dashboard')
  await page.waitForURL('**/dashboard')
}

export async function cleanWorkouts(token: string): Promise<void> {
  const res = await fetch(`${API}/workout-series?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = (await res.json()) as { data: { id: string }[] }
  await Promise.all(
    data.data.map((s) =>
      fetch(`${API}/workout-series/${s.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),
    ),
  )
}

export async function cleanProfile(token: string): Promise<void> {
  await fetch(`${API}/profile`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
