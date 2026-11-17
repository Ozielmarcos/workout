import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  UserProfile,
  Exercise,
  WorkoutSeries,
  PaginatedResult,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = res.status !== 204 ? await res.json() : null;
  if (!res.ok)
    throw new Error(
      (data as { message?: string } | null)?.message ?? 'Erro desconhecido',
    );
  return data as T;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(
    ([k, v]) => v !== undefined && q.set(k, String(v)),
  );
  return q.toString();
}

export const authApi = {
  login: (dto: LoginDto) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  register: (dto: Omit<RegisterDto, 'confirmPassword'>) =>
    request<{ id: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
};

export type UserMe = { id: string; name: string; email: string; cpf: string };

export const userApi = {
  me: () => request<UserMe>('/users/me'),
  update: (
    id: string,
    dto: Partial<{ name: string; cpf: string; password: string }>,
  ) =>
    request<UserMe>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),
};

export type CreateProfileDto = {
  height: number;
  weight: number;
  age: number;
  gender: string;
  goal: string;
};

export const profileApi = {
  get: () => request<UserProfile>('/profile'),
  create: (dto: CreateProfileDto) =>
    request<UserProfile>('/profile', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  update: (dto: Partial<CreateProfileDto>) =>
    request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),
  delete: () => request<void>('/profile', { method: 'DELETE' }),
};

export type ExerciseParams = {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  equipment?: string;
  primaryMuscle?: string;
  search?: string;
};

export const exerciseApi = {
  list: (params: ExerciseParams = {}) =>
    request<PaginatedResult<Exercise>>(
      `/exercises?${toQuery(params as Record<string, string | number | undefined>)}`,
    ),
  getById: (id: string) => request<Exercise>(`/exercises/${id}`),
};

export type WorkoutItemDto = {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
};
export type CreateWorkoutDto = {
  name: string;
  dayOfWeek: string[];
  items: WorkoutItemDto[];
};

export const workoutApi = {
  list: (page = 1, limit = 10) =>
    request<PaginatedResult<WorkoutSeries>>(
      `/workout-series?page=${page}&limit=${limit}`,
    ),
  getById: (id: string) => request<WorkoutSeries>(`/workout-series/${id}`),
  create: (dto: CreateWorkoutDto) =>
    request<WorkoutSeries>('/workout-series', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  update: (id: string, dto: Partial<CreateWorkoutDto>) =>
    request<WorkoutSeries>(`/workout-series/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),
  delete: (id: string) =>
    request<void>(`/workout-series/${id}`, { method: 'DELETE' }),
};
