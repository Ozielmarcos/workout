import { test, expect } from '@playwright/test'
import { ensureUser, loginAs, cleanWorkouts } from './helpers/auth'

test.describe('Treinos (WorkoutSeries)', () => {
  let token: string

  test.beforeAll(async () => {
    token = await ensureUser()
  })

  test.beforeEach(async ({ page }) => {
    await cleanWorkouts(token)
    await loginAs(page, token)
  })

  test.describe('Criar série', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/workout/new')
      await page.waitForURL('**/workout/new')
    })

    test('exibe página de criação com seletor de dias', async ({ page }) => {
      await expect(page.getByText('Nova série')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Seg' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Dom' })).toBeVisible()
    })

    test('seleciona múltiplos dias da semana', async ({ page }) => {
      const seg = page.getByRole('button', { name: 'Seg', exact: true })
      const qua = page.getByRole('button', { name: 'Qua', exact: true })
      const sex = page.getByRole('button', { name: 'Sex', exact: true })

      // 'Seg' is already selected by default; click Qua and Sex
      await qua.click()
      await sex.click()

      await expect(seg).toHaveCSS('background-color', /rgb\(123, 97, 255\)|rgb\(90, 69, 204\)/)
      await expect(qua).toHaveCSS('background-color', /rgb\(123, 97, 255\)|rgb\(90, 69, 204\)/)
      await expect(sex).toHaveCSS('background-color', /rgb\(123, 97, 255\)|rgb\(90, 69, 204\)/)
    })

    test('cria série com exercício e múltiplos dias', async ({ page }) => {
      await page.getByPlaceholder('Ex: Treino A — Peito').fill('Treino Biceps E2E')

      await page.getByRole('button', { name: 'Seg', exact: true }).click()
      await page.getByRole('button', { name: 'Qua', exact: true }).click()
      await page.getByRole('button', { name: 'Sex', exact: true }).click()

      const addBtn = page.getByRole('button', { name: /adicionar à série/i }).first()
      await expect(addBtn).toBeVisible()
      await addBtn.click()

      await page.getByRole('button', { name: /salvar série/i }).click()

      await expect(page).toHaveURL(/\/workout$/)
      await expect(page.getByText('Treino Biceps E2E')).toBeVisible()
    })

    test('exibe erro ao tentar salvar sem nome', async ({ page }) => {
      const addBtn = page.getByRole('button', { name: /adicionar à série/i }).first()
      await expect(addBtn).toBeVisible()
      await addBtn.click()

      await page.getByRole('button', { name: /salvar série/i }).click()

      await expect(page.getByText(/dê um nome/i)).toBeVisible()
    })

    test('botão salvar fica desabilitado sem exercícios selecionados', async ({ page }) => {
      await page.getByPlaceholder('Ex: Treino A — Peito').fill('Treino Sem Exercício')
      const saveBtn = page.getByRole('button', { name: /salvar série/i })
      await expect(saveBtn).toBeDisabled()
    })
  })

  test.describe('Listar séries', () => {
    test('lista de treinos está vazia quando não há séries', async ({ page }) => {
      await page.goto('/workout')
      await expect(page.getByText('Nenhuma série criada')).toBeVisible()
    })

    test('série criada aparece na listagem com dias da semana', async ({ page }) => {
      const API = 'http://localhost:3000/api'
      const exRes = await fetch(`${API}/exercises?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const exData = (await exRes.json()) as { data: { id: string }[] }
      const exerciseId = exData.data[0].id

      await fetch(`${API}/workout-series`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Treino Listagem',
          dayOfWeek: ['segunda', 'quarta', 'sexta'],
          items: [{ exerciseId, sets: 3, reps: 12, restSeconds: 60 }],
        }),
      })

      await page.goto('/workout')
      await expect(page.getByText('Treino Listagem')).toBeVisible()
      await expect(page.getByText(/seg.*qua.*sex|segunda.*quarta.*sexta/i)).toBeVisible()
    })
  })

  test.describe('Editar série', () => {
    let seriesId: string

    test.beforeEach(async () => {
      const API = 'http://localhost:3000/api'
      const exRes = await fetch(`${API}/exercises?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const exData = (await exRes.json()) as { data: { id: string }[] }
      const exerciseId = exData.data[0].id

      const res = await fetch(`${API}/workout-series`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Treino Para Editar',
          dayOfWeek: ['segunda'],
          items: [{ exerciseId, sets: 3, reps: 12, restSeconds: 60 }],
        }),
      })
      const data = (await res.json()) as { id: string }
      seriesId = data.id
    })

    test('abre página de edição com dados preenchidos', async ({ page }) => {
      await page.goto(`/workout/${seriesId}/edit`)
      await expect(page.locator('input[type="text"]')).toHaveValue('Treino Para Editar')
      await expect(page.getByRole('button', { name: 'Seg', exact: true })).toBeVisible()
    })

    test('altera nome e dias e salva', async ({ page }) => {
      await page.goto(`/workout/${seriesId}/edit`)

      await page.locator('input[type="text"]').fill('Treino Editado E2E')

      await page.getByRole('button', { name: 'Qua', exact: true }).click()
      await page.getByRole('button', { name: 'Sex', exact: true }).click()

      await page.getByRole('button', { name: /atualizar série/i }).click()

      await expect(page).toHaveURL(/\/workout$/)
      await expect(page.getByText('Treino Editado E2E')).toBeVisible()
    })
  })

  test.describe('Excluir série', () => {
    test('remove série da listagem', async ({ page }) => {
      const API = 'http://localhost:3000/api'
      const exRes = await fetch(`${API}/exercises?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const exData = (await exRes.json()) as { data: { id: string }[] }
      const exerciseId = exData.data[0].id

      await fetch(`${API}/workout-series`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Série Para Deletar',
          dayOfWeek: ['segunda'],
          items: [{ exerciseId, sets: 3, reps: 12, restSeconds: 60 }],
        }),
      })

      await page.goto('/workout')
      await expect(page.getByText('Série Para Deletar')).toBeVisible()

      await page.evaluate(() => { window.confirm = () => true })
      await page.once('dialog', (d) => d.accept())
      await page.getByRole('button', { name: /remover|excluir|deletar/i }).first().click()
      await page.waitForTimeout(2000)

      await expect(page.getByText('Série Para Deletar')).not.toBeVisible({ timeout: 8000 })
    })
  })

  test.describe('Dashboard — integração', () => {
    test('séries recentes aparecem no dashboard', async ({ page }) => {
      const API = 'http://localhost:3000/api'
      const exRes = await fetch(`${API}/exercises?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const exData = (await exRes.json()) as { data: { id: string }[] }

      await fetch(`${API}/workout-series`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Série Dashboard',
          dayOfWeek: ['segunda', 'quarta'],
          items: [{ exerciseId: exData.data[0].id, sets: 4, reps: 10, restSeconds: 90 }],
        }),
      })

      await page.goto('/dashboard')
      await expect(page.getByText('Série Dashboard')).toBeVisible()
      await expect(page.getByText(/seg.*qua|segunda.*quarta/i).first()).toBeVisible()
    })
  })
})
