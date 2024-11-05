import { configDefaults, defineConfig } from 'vitest/config'
import { entries } from './scripts/aliases.js'

export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: '"test"',
  },
  resolve: {
    alias: entries,
  },
  test: {
    globals: true,
    pool: 'threads',
    setupFiles: 'scripts/setup-vitest.ts',
    environmentMatchGlobs: [['packages/{swapper}/**', 'jsdom']],
    sequence: {
      hooks: 'list',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [...configDefaults.coverage.exclude!, 'scripts/**'],
    },
  },
})
