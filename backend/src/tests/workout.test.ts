import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { cleanDatabase, prisma } from './setup.js'
import { BASE, registerAndLogin, auth } from './helpers.js'

let token: string
let otherToken: string
let exerciseId: string

beforeAll(async () => {
  await cleanDatabase()

  const r1 = await registerAndLogin()
  token = r1.token

  const r2 = await registerAndLogin({ email: 'outro@workout.com', cpf: '987.654.321-00' })
  otherToken = r2.token

  const ex = await prisma.exercise.upsert({
    where: { externalId: 'test-workout-rosca-direta' },
    create: {
      externalId: 'test-workout-rosca-direta',
      name: 'Rosca Direta',
      category: 'strength',
      level: 'beginner',
      primaryMuscles: ['biceps'],
      secondaryMuscles: [],
      instructions: [],
      images: [],
    },
    update: {},
  })
  exerciseId = ex.id
})

function seriesPayload(overrides = {}) {
  return {
    name: 'Treino Bíceps',
    dayOfWeek: ['segunda', 'quarta', 'sexta'],
    items: [{ exerciseId, sets: 3, reps: 12, restSeconds: 60 }],
    ...overrides,
  }
}

describe('POST /workout-series — criar', () => {
  it('cria série com múltiplos dias', async () => {
    const res = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload())

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Treino Bíceps')
  })

  it('cria mesmo treino para dias diferentes', async () => {
    const seg = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Peito Seg', dayOfWeek: ['segunda'] }))

    const sex = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Peito Sex', dayOfWeek: ['sexta'] }))

    expect(seg.status).toBe(201)
    expect(sex.status).toBe(201)
    expect(seg.body.id).not.toBe(sex.body.id)
  })

  it('retorna 401 sem autenticação', async () => {
    const res = await request(app).post(`${BASE}/workout-series`).send(seriesPayload())
    expect(res.status).toBe(401)
  })
})

describe('GET /workout-series — listar', () => {
  it('lista apenas séries do usuário autenticado com paginação', async () => {
    const res = await request(app)
      .get(`${BASE}/workout-series`)
      .set(auth(token))

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('totalPages')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('retorna paginação correta', async () => {
    const res = await request(app)
      .get(`${BASE}/workout-series?page=1&limit=2`)
      .set(auth(token))

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeLessThanOrEqual(2)
  })
})

describe('GET /workout-series/:id — buscar por id', () => {
  it('retorna série do próprio usuário', async () => {
    const created = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Busca por ID' }))

    const res = await request(app)
      .get(`${BASE}/workout-series/${created.body.id}`)
      .set(auth(token))

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Busca por ID')
  })

  it('retorna 403 ao acessar série de outro usuário', async () => {
    const created = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Série Protegida' }))

    const res = await request(app)
      .get(`${BASE}/workout-series/${created.body.id}`)
      .set(auth(otherToken))

    expect(res.status).toBe(403)
  })
})

describe('PUT /workout-series/:id — editar', () => {
  it('edita série e permite mudar dias da semana', async () => {
    const created = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Treino Para Editar', dayOfWeek: ['segunda'] }))

    const res = await request(app)
      .put(`${BASE}/workout-series/${created.body.id}`)
      .set(auth(token))
      .send({ name: 'Treino Editado', dayOfWeek: ['terça', 'quinta', 'sábado'] })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Treino Editado')
  })

  it('retorna 403 ao editar série de outro usuário', async () => {
    const created = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Protegida Edição' }))

    const res = await request(app)
      .put(`${BASE}/workout-series/${created.body.id}`)
      .set(auth(otherToken))
      .send({ name: 'Hacker' })

    expect(res.status).toBe(403)
  })

  it('retorna 404 para série inexistente', async () => {
    const res = await request(app)
      .put(`${BASE}/workout-series/id-inexistente`)
      .set(auth(token))
      .send({ name: 'Nada' })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /workout-series/:id — excluir', () => {
  it('exclui série própria (204)', async () => {
    const created = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Para Deletar' }))

    const res = await request(app)
      .delete(`${BASE}/workout-series/${created.body.id}`)
      .set(auth(token))

    expect(res.status).toBe(204)
  })

  it('retorna 403 ao deletar série de outro usuário', async () => {
    const created = await request(app)
      .post(`${BASE}/workout-series`)
      .set(auth(token))
      .send(seriesPayload({ name: 'Protegida Delete' }))

    const res = await request(app)
      .delete(`${BASE}/workout-series/${created.body.id}`)
      .set(auth(otherToken))

    expect(res.status).toBe(403)
  })
})
