import { PrismaClient, User } from '@prisma/client'
import type { CreateUserDto, UpdateUserDto } from '../types/index.js'

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { cpf } })
  }

  async create(data: CreateUserDto & { password: string }): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async update(id: string, data: UpdateUserDto & { password?: string }): Promise<User> {
    return this.prisma.user.update({ where: { id }, data })
  }
}
