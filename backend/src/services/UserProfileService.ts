import type { UserProfileRepository } from '../repositories/UserProfileRepository.js'
import type { CreateUserProfileDto, UpdateUserProfileDto, UserProfileWithImc } from '../types/index.js'
import { createError } from '../middlewares/errorHandler.js'

export class UserProfileService {
  constructor(private readonly repository: UserProfileRepository) {}

  async get(userId: string): Promise<UserProfileWithImc> {
    const profile = await this.repository.findByUserId(userId)
    if (!profile) throw createError('Perfil não encontrado', 404)
    return this.withImc(profile)
  }

  async create(userId: string, dto: CreateUserProfileDto): Promise<UserProfileWithImc> {
    const exists = await this.repository.findByUserId(userId)
    if (exists) throw createError('Perfil já existe', 409)
    const profile = await this.repository.create(userId, dto)
    return this.withImc(profile)
  }

  async update(userId: string, dto: UpdateUserProfileDto): Promise<UserProfileWithImc> {
    const exists = await this.repository.findByUserId(userId)
    if (!exists) throw createError('Perfil não encontrado', 404)
    const profile = await this.repository.update(userId, dto)
    return this.withImc(profile)
  }

  async delete(userId: string) {
    const exists = await this.repository.findByUserId(userId)
    if (!exists) throw createError('Perfil não encontrado', 404)
    return this.repository.delete(userId)
  }

  private withImc(profile: { weight: number; height: number } & object): UserProfileWithImc {
    const imc = Number((profile.weight / Math.pow(profile.height / 100, 2)).toFixed(2))
    return { ...profile, imc, imcClassification: this.classifyImc(imc) } as UserProfileWithImc
  }

  private classifyImc(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso'
    if (imc < 25) return 'Peso normal'
    if (imc < 30) return 'Sobrepeso'
    if (imc < 35) return 'Obesidade grau I'
    if (imc < 40) return 'Obesidade grau II'
    return 'Obesidade grau III'
  }
}
