import { test, expect } from '@playwright/test'
import { E2E_USER, ensureUser, generateValidCpf } from './helpers/auth'

test.describe('Autenticação', () => {
  test.beforeAll(async () => {
    await ensureUser()
  })

  test('cadastro de novo usuário redireciona para login', async ({ page }) => {
    const unique = Date.now()
    const cpf = generateValidCpf()
    await page.goto('/register')

    await page.getByPlaceholder('Seu nome').fill('Novo Usuário Playwright')
    await page.getByPlaceholder('seuemail@exemplo.com').fill(`novo${unique}@test.com`)
    await page.getByPlaceholder('000.000.000-00').fill(cpf)
    await page.getByLabel('Senha').first().fill('Senha@Test1')
    await page.getByLabel('Confirmar senha').fill('Senha@Test1')

    await page.getByRole('button', { name: /criar conta/i }).click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('cadastro exibe erro com senha fraca', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Seu nome').fill('Usuário Teste')
    await page.getByPlaceholder('seuemail@exemplo.com').fill('fraca@test.com')
    await page.getByPlaceholder('000.000.000-00').fill('529.982.247-25')
    await page.getByLabel('Senha').first().fill('fraca')
    await page.getByLabel('Confirmar senha').fill('fraca')

    await page.getByRole('button', { name: /criar conta/i }).click()

    await expect(page.getByText(/senha fraca/i)).toBeVisible()
  })

  test('cadastro exibe erro com senhas diferentes', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Seu nome').fill('Usuário Teste')
    await page.getByPlaceholder('seuemail@exemplo.com').fill('diff@test.com')
    await page.getByPlaceholder('000.000.000-00').fill('529.982.247-25')
    await page.getByLabel('Senha').first().fill('Senha@Test1')
    await page.getByLabel('Confirmar senha').fill('Senha@Test2')

    await page.getByRole('button', { name: /criar conta/i }).click()

    await expect(page.getByText(/senhas não coincidem/i)).toBeVisible()
  })

  test('login correto redireciona para dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('seuemail@exemplo.com').fill(E2E_USER.email)
    await page.getByPlaceholder('••••••••').fill(E2E_USER.password)
    await page.getByRole('button', { name: /^entrar/i }).click()

    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('login com senha errada exibe erro', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('seuemail@exemplo.com').fill(E2E_USER.email)
    await page.getByPlaceholder('••••••••').fill('SenhaErrada@99')
    await page.getByRole('button', { name: /^entrar/i }).click()

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible()
  })

  test('logout redireciona para login', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('seuemail@exemplo.com').fill(E2E_USER.email)
    await page.getByPlaceholder('••••••••').fill(E2E_USER.password)
    await page.getByRole('button', { name: /^entrar/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)

    await page.getByRole('button', { name: /sair/i }).click()

    await expect(page).toHaveURL(/\/login/)
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull()
  })

  test('acesso direto a rota protegida sem token redireciona para login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
