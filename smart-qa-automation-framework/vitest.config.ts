import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/**/*.test.ts', 'demo-app/__tests__/**/*.test.ts'],
    environment: 'node',
  },
});
