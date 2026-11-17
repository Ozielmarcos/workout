import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
    env: {
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/workout_test_db',
      JWT_SECRET: 'test_secret_integration',
      JWT_EXPIRES_IN: '7d',
      PORT: '3099',
    },
  },
})
