import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UserRepository } from '../repositories/UserRepository.js'
import type { JwtPayload } from '../types/index.js'
import { createError } from '../middlewares/errorHandler.js'

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw createError('Credenciais inválidas', 401)

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw createError('Credenciais inválidas', 401)

    return { token: this.generateToken(user.id, user.email) }
  }

  private generateToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email }
    const sevenDays = 7 * 24 * 60 * 60
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: sevenDays })
  }
}
