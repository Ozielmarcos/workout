import bcrypt from 'bcryptjs'
import type { UserRepository } from '../repositories/UserRepository.js'
import type { CreateUserDto, UpdateUserDto } from '../types/index.js'
import { validateEmail, validatePassword, validateCpf } from '../validators/index.js'
import { createError } from '../middlewares/errorHandler.js'

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(dto: CreateUserDto) {
    this.validateFields(dto.email, dto.password, dto.cpf)
    await this.checkUnique(dto.email, dto.cpf)
    const password = await bcrypt.hash(dto.password, 10)
    const { password: _, ...user } = await this.repository.create({ ...dto, password })
    return user
  }

  async update(id: string, requesterId: string, dto: UpdateUserDto & { email?: unknown }) {
    if (id !== requesterId) throw createError('Sem permissão', 403)
    const { email: _ignored, ...safeDto } = dto
    if (safeDto.cpf && !validateCpf(safeDto.cpf)) throw createError('CPF inválido', 422)
    if (safeDto.password && !validatePassword(safeDto.password)) throw createError('Senha fraca', 422)
    const data = safeDto.password ? { ...safeDto, password: await bcrypt.hash(safeDto.password, 10) } : safeDto
    const { password: _, ...user } = await this.repository.update(id, data)
    return user
  }

  async getById(id: string) {
    const user = await this.repository.findById(id)
    if (!user) throw createError('Usuário não encontrado', 404)
    const { password: _, ...data } = user
    return data
  }

  private validateFields(email: string, password: string, cpf: string) {
    if (!validateEmail(email)) throw createError('Email inválido', 422)
    if (!validatePassword(password)) throw createError('Senha fraca: mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial', 422)
    if (!validateCpf(cpf)) throw createError('CPF inválido', 422)
  }

  private async checkUnique(email: string, cpf: string) {
    if (await this.repository.findByEmail(email)) throw createError('Email já cadastrado', 409)
    if (await this.repository.findByCpf(cpf)) throw createError('CPF já cadastrado', 409)
  }
}
