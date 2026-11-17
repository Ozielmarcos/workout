import { PrismaClient } from '@prisma/client'
import { beforeAll, afterAll } from 'vitest'

export const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5432/workout_test_db' } },
})

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

export async function cleanDatabase() {
  await prisma.$transaction([
    prisma.workoutItem.deleteMany(),
    prisma.workoutSeries.deleteMany(),
    prisma.userProfile.deleteMany(),
    prisma.user.deleteMany(),
    prisma.exercise.deleteMany({ where: { externalId: { startsWith: 'test-' } } }),
  ])
}
