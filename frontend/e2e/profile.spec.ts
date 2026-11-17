import { test, expect } from '@playwright/test'
import { ensureUser, loginAs, cleanProfile } from './helpers/auth'

test.describe('Perfil e IMC', () => {
  let token: string

  test.beforeAll(async () => {
    token = await ensureUser()
  })

  test.beforeEach(async ({ page }) => {
    await cleanProfile(token)
    await loginAs(page, token)
    await page.goto('/profile')
    await page.waitForURL('**/profile')
  })

  test('exibe formulário de criação quando não há perfil', async ({ page }) => {
    await expect(page.getByRole('button', { name: /criar perfil/i })).toBeVisible()
  })

  test('cria perfil com dados válidos e exibe IMC', async ({ page }) => {
    await page.getByLabel(/Altura/i).fill('175')
    await page.getByLabel(/Peso/i).fill('80')
    await page.getByLabel(/Idade/i).fill('28')

    await page.getByRole('combobox').first().selectOption('masculino')

    const goalButtons = page.getByRole('button').filter({ hasText: /hipertrofia/i })
    if (await goalButtons.count() > 0) {
      await goalButtons.first().click()
    } else {
      await page.getByRole('combobox').last().selectOption('hipertrofia')
    }

    await page.getByRole('button', { name: /criar perfil/i }).click()

    await expect(page.getByText(/imc|índice de massa/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/26\.|sobrepeso/i).first()).toBeVisible()
  })

  test('IMC "Peso normal" é exibido para dados corretos', async ({ page }) => {
    await page.getByLabel(/Altura/i).fill('175')
    await page.getByLabel(/Peso/i).fill('68')
    await page.getByLabel(/Idade/i).fill('25')
    await page.getByRole('combobox').first().selectOption('feminino')

    const goalButtons = page.getByRole('button').filter({ hasText: /emagrecimento/i })
    if (await goalButtons.count() > 0) {
      await goalButtons.first().click()
    } else {
      await page.getByRole('combobox').last().selectOption('emagrecimento')
    }

    await page.getByRole('button', { name: /criar perfil/i }).click()

    await expect(page.getByText(/peso normal/i)).toBeVisible({ timeout: 5000 })
  })

  test('edita peso e IMC é recalculado', async ({ page }) => {
    await page.getByLabel(/Altura/i).fill('175')
    await page.getByLabel(/Peso/i).fill('68')
    await page.getByLabel(/Idade/i).fill('25')
    await page.getByRole('combobox').first().selectOption('masculino')

    const goalButtons = page.getByRole('button').filter({ hasText: /hipertrofia/i })
    if (await goalButtons.count() > 0) {
      await goalButtons.first().click()
    } else {
      await page.getByRole('combobox').last().selectOption('hipertrofia')
    }

    await page.getByRole('button', { name: /criar perfil/i }).click()
    await expect(page.getByText(/peso normal/i)).toBeVisible({ timeout: 5000 })

    await page.getByLabel(/Peso/i).fill('95')
    await page.getByRole('button', { name: /atualizar perfil/i }).click()

    await expect(page.getByText(/sobrepeso|obesidade/i)).toBeVisible({ timeout: 5000 })
  })

  test('recomendação de exercícios com link para /exercises', async ({ page }) => {
    await page.getByLabel(/Altura/i).fill('175')
    await page.getByLabel(/Peso/i).fill('80')
    await page.getByLabel(/Idade/i).fill('28')
    await page.getByRole('combobox').first().selectOption('masculino')

    const goalButtons = page.getByRole('button').filter({ hasText: /hipertrofia/i })
    if (await goalButtons.count() > 0) {
      await goalButtons.first().click()
    } else {
      await page.getByRole('combobox').last().selectOption('hipertrofia')
    }

    await page.getByRole('button', { name: /criar perfil/i }).click()
    await expect(page.getByText(/recomend/i)).toBeVisible({ timeout: 5000 })

    const exercisesLink = page.getByRole('link', { name: /exercícios/i }).last()
    await exercisesLink.click()

    await expect(page).toHaveURL(/\/exercises/)
  })

  test('exclui perfil retorna ao formulário de criação', async ({ page }) => {
    await page.getByLabel(/Altura/i).fill('175')
    await page.getByLabel(/Peso/i).fill('80')
    await page.getByLabel(/Idade/i).fill('28')
    await page.getByRole('combobox').first().selectOption('masculino')

    const goalButtons = page.getByRole('button').filter({ hasText: /hipertrofia/i })
    if (await goalButtons.count() > 0) {
      await goalButtons.first().click()
    } else {
      await page.getByRole('combobox').last().selectOption('hipertrofia')
    }

    await page.getByRole('button', { name: /criar perfil/i }).click()
    await expect(page.getByText(/imc|índice de massa/i)).toBeVisible({ timeout: 5000 })

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: /excluir|deletar|remover/i }).click()

    await expect(page.getByRole('button', { name: /criar perfil/i })).toBeVisible({ timeout: 5000 })
  })
})
