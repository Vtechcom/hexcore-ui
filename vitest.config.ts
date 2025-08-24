import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    globals: true,
    environment: 'nuxt',
    alias: {
      '@highlightjs/vue-plugin': '/__mocks__/highlightjs-vue-mock.ts'
    }
  },
  resolve: {}
})
