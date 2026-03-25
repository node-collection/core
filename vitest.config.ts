import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    typecheck: {
      tsconfig: './tests/tsconfig.json',
    },
    // HMR — watch mode default aktif saat `pnpm dev`
    watch: true,

    // Vitest UI
    ui: true,
    open: true,

    // Reporter
    reporters: ['verbose'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/plugins/**', 'src/operators/**'],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@operators': path.resolve(__dirname, './src/operators'),
    },
  },
});
