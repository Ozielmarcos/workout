import { PrismaClient, WorkoutSeries } from '@prisma/client'
import type { PaginationParams, CreateWorkoutSeriesDto } from '../types/index.js'

const itemsInclude = { items: { include: { exercise: true } } }

export class WorkoutSeriesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.workoutSeries.findUnique({ where: { id }, include: itemsInclude })
  }

  async findByUser(userId: string, pagination: PaginationParams) {
    const { page, limit } = pagination
    const [data, total] = await Promise.all([
      this.prisma.workoutSeries.findMany({
        where: { userId },
        include: itemsInclude,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.workoutSeries.count({ where: { userId } }),
    ])
    return { data, total }
  }

  async create(userId: string, dto: CreateWorkoutSeriesDto): Promise<WorkoutSeries> {
    return this.prisma.workoutSeries.create({
      data: {
        userId,
        name: dto.name,
        dayOfWeek: dto.dayOfWeek,
        items: { create: dto.items.map((i) => ({ ...i })) },
      },
    })
  }

  async update(id: string, dto: Partial<CreateWorkoutSeriesDto>) {
    await this.prisma.workoutItem.deleteMany({ where: { workoutSeriesId: id } })
    return this.prisma.workoutSeries.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.dayOfWeek && { dayOfWeek: dto.dayOfWeek }),
        ...(dto.items && { items: { create: dto.items.map((i) => ({ ...i })) } }),
      },
      include: itemsInclude,
    })
  }

  async delete(id: string): Promise<WorkoutSeries> {
    return this.prisma.workoutSeries.delete({ where: { id } })
  }
}
