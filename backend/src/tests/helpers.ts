import request from 'supertest'
import { app } from '../app.js'

export const BASE = '/api'

export const TEST_USER = {
  name: 'Teste Integração',
  email: 'integracao@test.com',
  cpf: '529.982.247-25',
  password: 'Senha@123',
}

export const VALID_CPFS = [
  '529.982.247-25',
  '123.456.789-09',
  '987.654.321-00',
  '111.444.777-35',
]

export async function registerAndLogin(overrides: Partial<typeof TEST_USER> = {}) {
  const data = { ...TEST_USER, ...overrides }
  const reg = await request(app).post(`${BASE}/users`).send(data)
  const login = await request(app)
    .post(`${BASE}/auth/login`)
    .send({ email: data.email, password: data.password })
  return { userId: reg.body.id as string, token: login.body.token as string, data }
}

export function auth(token: string) {
  return { Authorization: `Bearer ${token}` }
}
