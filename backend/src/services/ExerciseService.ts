import type { ExerciseRepository } from '../repositories/ExerciseRepository.js'
import type { PaginationParams, ExerciseFilters, PaginatedResult } from '../types/index.js'
import { createError } from '../middlewares/errorHandler.js'
import type { Exercise, Prisma } from '@prisma/client'

export class ExerciseService {
  constructor(private readonly repository: ExerciseRepository) {}

  async list(pagination: PaginationParams, filters: ExerciseFilters): Promise<PaginatedResult<Exercise>> {
    const { data, total } = await this.repository.findAll(pagination, filters)
    return this.paginate(data, total, pagination)
  }

  async getById(id: string): Promise<Exercise> {
    const exercise = await this.repository.findById(id)
    if (!exercise) throw createError('Exercício não encontrado', 404)
    return exercise
  }

  async create(data: Prisma.ExerciseCreateInput): Promise<Exercise> {
    return this.repository.create(data)
  }

  async update(id: string, data: Prisma.ExerciseUpdateInput): Promise<Exercise> {
    await this.getById(id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<Exercise> {
    await this.getById(id)
    return this.repository.delete(id)
  }

  private paginate<T>(data: T[], total: number, { page, limit }: PaginationParams): PaginatedResult<T> {
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
