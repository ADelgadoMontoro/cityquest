import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    clearMocks: true,
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    restoreMocks: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
