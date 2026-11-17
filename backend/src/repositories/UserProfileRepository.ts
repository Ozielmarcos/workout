import { PrismaClient, UserProfile } from '@prisma/client'
import type { CreateUserProfileDto, UpdateUserProfileDto } from '../types/index.js'

export class UserProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({ where: { userId } })
  }

  async create(userId: string, data: CreateUserProfileDto): Promise<UserProfile> {
    return this.prisma.userProfile.create({ data: { userId, ...data } })
  }

  async update(userId: string, data: UpdateUserProfileDto): Promise<UserProfile> {
    return this.prisma.userProfile.update({ where: { userId }, data })
  }

  async delete(userId: string): Promise<UserProfile> {
    return this.prisma.userProfile.delete({ where: { userId } })
  }
}
