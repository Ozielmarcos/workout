export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = {
  name: string
  email: string
  cpf: string
  password: string
  confirmPassword: string
}

export type AuthResponse = {
  token: string
}

export type UserProfile = {
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

export type Exercise = {
  id: string
  externalId: string
  name: string
  namePt: string | null
  category: string
  level: string
  force: string | null
  mechanic: string | null
  equipment: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  images: string[]
}

export type WorkoutItem = {
  exerciseId: string
  sets: number
  reps: number
  restSeconds: number
  exercise: Exercise
}

export type WorkoutSeries = {
  id: string
  name: string
  dayOfWeek: string[]
  items: WorkoutItem[]
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ApiError = {
  message: string
}
