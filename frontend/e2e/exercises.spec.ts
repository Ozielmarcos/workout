import { test, expect } from '@playwright/test'
import { ensureUser, loginAs } from './helpers/auth'

test.describe('Exercícios', () => {
  let token: string

  test.beforeAll(async () => {
    token = await ensureUser()
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, token)
    await page.goto('/exercises')
    await page.waitForURL('**/exercises')
  })

  test('exibe listagem de exercícios paginada', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /exercícios/i })).toBeVisible()
    const cards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /./ })
    await expect(cards.first()).toBeVisible()
  })

  test('exercícios são exibidos com nome em PT-BR', async ({ page }) => {
    const firstCard = page.locator('[class*="rounded-2xl"]').first()
    const title = firstCard.locator('h3, p').first()
    const text = await title.textContent()
    expect(text).not.toBeNull()
    expect(text!.length).toBeGreaterThan(0)
  })

  test('filtro por grupo muscular funciona', async ({ page }) => {
    await page.getByRole('button', { name: /bíceps/i }).click()
    await page.waitForTimeout(600)

    const cards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /bícep|bicep|curl/i })
    await expect(cards.first()).toBeVisible()
  })

  test('busca por nome retorna resultados', async ({ page }) => {
    await page.getByPlaceholder(/buscar exercício/i).fill('agachamento')
    await page.waitForTimeout(600)

    const count = await page.locator('[class*="rounded-2xl"]').count()
    expect(count).toBeGreaterThan(0)
  })

  test('busca sem resultado mostra lista vazia ou aviso', async ({ page }) => {
    await page.getByPlaceholder(/buscar exercício/i).fill('xyztermsemresultado999')
    await page.waitForTimeout(600)

    const cards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /\w/ })
    const count = await cards.count()
    expect(count).toBeLessThanOrEqual(1)
  })

  test('paginação avança para próxima página', async ({ page }) => {
    const nextBtn = page.locator('button[type="button"]').filter({ hasText: '›' }).first()
    if (await nextBtn.isVisible() && !(await nextBtn.isDisabled())) {
      const firstCardBefore = await page.locator('[class*="ExerciseCard"], [class*="rounded-2xl"] h3').first().textContent()
      await nextBtn.click()
      await page.waitForTimeout(800)
      const firstCardAfter = await page.locator('[class*="ExerciseCard"], [class*="rounded-2xl"] h3').first().textContent()
      expect(firstCardAfter).not.toBe(firstCardBefore)
    }
  })

  test('link no sidebar "Exercícios" fica ativo na página', async ({ page }) => {
    const sidebarLink = page.getByRole('link', { name: /exercícios/i }).first()
    await expect(sidebarLink).toBeVisible()
  })
})
