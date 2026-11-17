import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { cleanDatabase, prisma } from './setup.js'
import { BASE, registerAndLogin, auth } from './helpers.js'

function newExercise(suffix = '') {
  return {
    externalId: `test-ex${suffix}-${Date.now()}`,
    name: `Supino Reto${suffix}`,
    namePt: `Supino Reto PT${suffix}`,
    category: 'strength',
    level: 'intermediate',
    equipment: 'barbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    instructions: [],
    images: [],
  }
}

let token: string

beforeAll(async () => {
  await cleanDatabase()
  const result = await registerAndLogin()
  token = result.token
})

describe('GET /exercises — listagem paginada', () => {
  it('lista exercícios com estrutura de paginação', async () => {
    const res = await request(app)
      .get(`${BASE}/exercises`)
      .set(auth(token))

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('totalPages')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('respeita parâmetros page e limit', async () => {
    const res = await request(app)
      .get(`${BASE}/exercises?page=1&limit=5`)
      .set(auth(token))

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeLessThanOrEqual(5)
    expect(res.body.limit).toBe(5)
  })

  it('filtra por categoria', async () => {
    const res = await request(app)
      .get(`${BASE}/exercises?category=strength&limit=50`)
      .set(auth(token))

    expect(res.status).toBe(200)
    res.body.data.forEach((ex: { category: string }) => {
      expect(ex.category).toBe('strength')
    })
  })

  it('busca por nome em PT ou EN via search', async () => {
    const ex = await request(app)
      .post(`${BASE}/exercises`)
      .set(auth(token))
      .send(newExercise('-busca'))

    const resEn = await request(app)
      .get(`${BASE}/exercises?search=${encodeURIComponent(ex.body.name)}`)
      .set(auth(token))
    expect(resEn.body.data.some((e: { id: string }) => e.id === ex.body.id)).toBe(true)

    const resPt = await request(app)
      .get(`${BASE}/exercises?search=${encodeURIComponent(ex.body.namePt)}`)
      .set(auth(token))
    expect(resPt.body.data.some((e: { id: string }) => e.id === ex.body.id)).toBe(true)
  })
})

describe('POST /exercises — criar', () => {
  it('cria exercício com dados válidos', async () => {
    const data = newExercise('-create')
    const res = await request(app)
      .post(`${BASE}/exercises`)
      .set(auth(token))
      .send(data)

    expect(res.status).toBe(201)
    expect(res.body.name).toBe(data.name)
    expect(res.body).toHaveProperty('id')
  })

  it('retorna 401 sem autenticação', async () => {
    const res = await request(app).post(`${BASE}/exercises`).send(newExercise('-unauth'))
    expect(res.status).toBe(401)
  })
})

describe('PUT /exercises/:id — editar', () => {
  it('edita exercício existente', async () => {
    const created = await request(app)
      .post(`${BASE}/exercises`)
      .set(auth(token))
      .send(newExercise('-edit'))

    const res = await request(app)
      .put(`${BASE}/exercises/${created.body.id}`)
      .set(auth(token))
      .send({ level: 'beginner' })

    expect(res.status).toBe(200)
    expect(res.body.level).toBe('beginner')
  })

  it('retorna 404 para id inexistente', async () => {
    const res = await request(app)
      .put(`${BASE}/exercises/id-inexistente-xyz`)
      .set(auth(token))
      .send({ level: 'beginner' })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /exercises/:id — excluir', () => {
  it('exclui exercício existente (204)', async () => {
    const created = await request(app)
      .post(`${BASE}/exercises`)
      .set(auth(token))
      .send(newExercise('-del'))

    const res = await request(app)
      .delete(`${BASE}/exercises/${created.body.id}`)
      .set(auth(token))

    expect(res.status).toBe(204)
  })

  it('retorna 404 para id inexistente', async () => {
    const res = await request(app)
      .delete(`${BASE}/exercises/id-inexistente-xyz`)
      .set(auth(token))

    expect(res.status).toBe(404)
  })
})
