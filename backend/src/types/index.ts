export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type JwtPayload = {
  userId: string
  email: string
}

export type CreateUserDto = {
  name: string
  email: string
  cpf: string
  password: string
}

export type UpdateUserDto = {
  name?: string
  cpf?: string
  password?: string
}

export type CreateUserProfileDto = {
  height: number
  weight: number
  age: number
  gender: string
  goal: string
}

export type UpdateUserProfileDto = Partial<CreateUserProfileDto>

export type UserProfileWithImc = {
  id: string
  userId: string
  height: number
  weight: number
  age: number
  gender: string
  goal: string
  imc: number
  imcClassification: string
}

export type ExerciseFilters = {
  category?: string
  level?: string
  equipment?: string
  primaryMuscle?: string
  search?: string
}

export type CreateWorkoutSeriesDto = {
  name: string
  dayOfWeek: string[]
  items: WorkoutItemDto[]
}

export type UpdateWorkoutSeriesDto = {
  name?: string
  dayOfWeek?: string[]
  items?: WorkoutItemDto[]
}

export type WorkoutItemDto = {
  exerciseId: string
  sets: number
  reps: number
  restSeconds: number
}

export type AppError = {
  message: string
  status: number
}
