import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { cleanDatabase } from './setup.js'
import { BASE, TEST_USER, registerAndLogin, auth } from './helpers.js'

describe('POST /users — cadastro', () => {
  beforeEach(cleanDatabase)

  it('cadastra usuário com dados válidos', async () => {
    const res = await request(app).post(`${BASE}/users`).send(TEST_USER)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.email).toBe(TEST_USER.email)
    expect(res.body).not.toHaveProperty('password')
  })

  it('rejeita CPF inválido (422)', async () => {
    const res = await request(app)
      .post(`${BASE}/users`)
      .send({ ...TEST_USER, cpf: '111.111.111-11' })

    expect(res.status).toBe(422)
  })

  it('rejeita senha fraca (422)', async () => {
    const res = await request(app)
      .post(`${BASE}/users`)
      .send({ ...TEST_USER, password: 'fraca' })

    expect(res.status).toBe(422)
  })

  it('rejeita email inválido (422)', async () => {
    const res = await request(app)
      .post(`${BASE}/users`)
      .send({ ...TEST_USER, email: 'nao-e-email' })

    expect(res.status).toBe(422)
  })

  it('rejeita email duplicado (409)', async () => {
    await request(app).post(`${BASE}/users`).send(TEST_USER)
    const res = await request(app)
      .post(`${BASE}/users`)
      .send({ ...TEST_USER, cpf: '123.456.789-09' })

    expect(res.status).toBe(409)
  })
})

describe('PUT /users/:id — edição', () => {
  beforeEach(cleanDatabase)

  it('edita o próprio usuário', async () => {
    const { userId, token } = await registerAndLogin()
    const res = await request(app)
      .put(`${BASE}/users/${userId}`)
      .set(auth(token))
      .send({ name: 'Novo Nome' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Novo Nome')
  })

  it('retorna 403 ao tentar editar outro usuário', async () => {
    const { token } = await registerAndLogin()
    const other = await registerAndLogin({
      email: 'outro@test.com',
      cpf: '123.456.789-09',
    })
    const res = await request(app)
      .put(`${BASE}/users/${other.userId}`)
      .set(auth(token))
      .send({ name: 'Hacker' })

    expect(res.status).toBe(403)
  })

  it('não permite alterar o email', async () => {
    const { userId, token } = await registerAndLogin()
    const res = await request(app)
      .put(`${BASE}/users/${userId}`)
      .set(auth(token))
      .send({ email: 'novo@test.com' })

    expect(res.status).toBe(200)
    expect(res.body.email).toBe(TEST_USER.email)
  })

  it('retorna 401 sem token', async () => {
    const { userId } = await registerAndLogin()
    const res = await request(app)
      .put(`${BASE}/users/${userId}`)
      .send({ name: 'Sem Auth' })

    expect(res.status).toBe(401)
  })
})
