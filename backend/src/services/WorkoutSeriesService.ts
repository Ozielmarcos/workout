import type { WorkoutSeriesRepository } from '../repositories/WorkoutSeriesRepository.js'
import type { PaginationParams, CreateWorkoutSeriesDto, UpdateWorkoutSeriesDto, PaginatedResult } from '../types/index.js'
import { createError } from '../middlewares/errorHandler.js'

export class WorkoutSeriesService {
  constructor(private readonly repository: WorkoutSeriesRepository) {}

  async list(userId: string, pagination: PaginationParams): Promise<PaginatedResult<object>> {
    const { data, total } = await this.repository.findByUser(userId, pagination)
    return { data, total, ...pagination, totalPages: Math.ceil(total / pagination.limit) }
  }

  async getById(id: string, userId: string) {
    const series = await this.repository.findById(id)
    if (!series) throw createError('Série não encontrada', 404)
    if (series.userId !== userId) throw createError('Sem permissão', 403)
    return series
  }

  async create(userId: string, dto: CreateWorkoutSeriesDto) {
    return this.repository.create(userId, dto)
  }

  async update(id: string, userId: string, dto: UpdateWorkoutSeriesDto) {
    await this.getById(id, userId)
    return this.repository.update(id, dto)
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId)
    return this.repository.delete(id)
  }
}
