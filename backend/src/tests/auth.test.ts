import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { cleanDatabase, prisma } from './setup.js'
import { BASE, TEST_USER } from './helpers.js'
import bcrypt from 'bcryptjs'

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await cleanDatabase()
    await prisma.user.create({
      data: {
        ...TEST_USER,
        password: await bcrypt.hash(TEST_USER.password, 10),
      },
    })
  })

  it('retorna token com credenciais corretas', async () => {
    const res = await request(app)
      .post(`${BASE}/auth/login`)
      .send({ email: TEST_USER.email, password: TEST_USER.password })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(typeof res.body.token).toBe('string')
  })

  it('retorna 401 com senha errada', async () => {
    const res = await request(app)
      .post(`${BASE}/auth/login`)
      .send({ email: TEST_USER.email, password: 'SenhaErrada@99' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Credenciais inválidas')
  })

  it('retorna 401 com usuário inexistente', async () => {
    const res = await request(app)
      .post(`${BASE}/auth/login`)
      .send({ email: 'naoexiste@test.com', password: TEST_USER.password })

    expect(res.status).toBe(401)
  })
})
