import { PrismaClient, Exercise, Prisma } from '@prisma/client';
import type { PaginationParams, ExerciseFilters } from '../types/index.js';

export class ExerciseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Exercise | null> {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  async findAll(pagination: PaginationParams, filters: ExerciseFilters) {
    const where = this.buildWhere(filters);
    const { page, limit } = pagination;
    const [data, total] = await Promise.all([
      this.prisma.exercise.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.exercise.count({ where }),
    ]);
    return { data, total };
  }

  async create(data: Prisma.ExerciseCreateInput): Promise<Exercise> {
    return this.prisma.exercise.create({ data });
  }

  async update(
    id: string,
    data: Prisma.ExerciseUpdateInput,
  ): Promise<Exercise> {
    return this.prisma.exercise.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Exercise> {
    return this.prisma.exercise.delete({ where: { id } });
  }

  private buildWhere(filters: ExerciseFilters): Prisma.ExerciseWhereInput {
    return {
      ...(filters.category && { category: filters.category }),
      ...(filters.level && { level: filters.level }),
      ...(filters.equipment && { equipment: filters.equipment }),
      ...(filters.primaryMuscle && {
        primaryMuscles: { has: filters.primaryMuscle },
      }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { namePt: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };
  }
}
