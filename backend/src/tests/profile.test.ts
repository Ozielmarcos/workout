import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { cleanDatabase } from './setup.js'
import { BASE, registerAndLogin, auth } from './helpers.js'

const PROFILE = {
  height: 175,
  weight: 80,
  age: 28,
  gender: 'masculino',
  goal: 'hipertrofia',
}

describe('UserProfile — CRUD + IMC', () => {
  let token: string
  let userId: string

  beforeEach(async () => {
    await cleanDatabase()
    const result = await registerAndLogin()
    token = result.token
    userId = result.userId
  })

  it('cria perfil e retorna IMC calculado', async () => {
    const res = await request(app)
      .post(`${BASE}/profile`)
      .set(auth(token))
      .send(PROFILE)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('imc')
    expect(res.body).toHaveProperty('imcClassification')

    const expectedImc = Number((80 / Math.pow(175 / 100, 2)).toFixed(2))
    expect(res.body.imc).toBe(expectedImc)
  })

  it('classifica IMC como "Peso normal" para 68kg/175cm', async () => {
    await request(app)
      .post(`${BASE}/profile`)
      .set(auth(token))
      .send({ ...PROFILE, weight: 68 })

    const res = await request(app).get(`${BASE}/profile`).set(auth(token))
    expect(res.body.imcClassification).toBe('Peso normal')
  })

  it('classifica IMC como "Sobrepeso" para 80kg/175cm (IMC 26.12)', async () => {
    await request(app).post(`${BASE}/profile`).set(auth(token)).send(PROFILE)
    const res = await request(app).get(`${BASE}/profile`).set(auth(token))
    expect(res.body.imcClassification).toBe('Sobrepeso')
  })

  it('retorna 404 ao buscar perfil sem ter criado', async () => {
    const res = await request(app).get(`${BASE}/profile`).set(auth(token))
    expect(res.status).toBe(404)
  })

  it('retorna 409 ao criar perfil duplicado', async () => {
    await request(app).post(`${BASE}/profile`).set(auth(token)).send(PROFILE)
    const res = await request(app).post(`${BASE}/profile`).set(auth(token)).send(PROFILE)
    expect(res.status).toBe(409)
  })

  it('edita perfil e recalcula IMC', async () => {
    await request(app).post(`${BASE}/profile`).set(auth(token)).send(PROFILE)

    const res = await request(app)
      .put(`${BASE}/profile`)
      .set(auth(token))
      .send({ weight: 70 })

    expect(res.status).toBe(200)
    const expectedImc = Number((70 / Math.pow(175 / 100, 2)).toFixed(2))
    expect(res.body.imc).toBe(expectedImc)
  })

  it('exclui perfil (204)', async () => {
    await request(app).post(`${BASE}/profile`).set(auth(token)).send(PROFILE)
    const del = await request(app).delete(`${BASE}/profile`).set(auth(token))
    expect(del.status).toBe(204)

    const get = await request(app).get(`${BASE}/profile`).set(auth(token))
    expect(get.status).toBe(404)
  })
})
