import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { version } from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    // '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    'nuxt-svgo',
    'nuxt-lodash',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],
  ssr: false,
  runtimeConfig: {
    BASE_API_URL: process.env.BASE_API_URL,
    public: {
      appVersion: process.env.APP_VERSION || version,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      hydraNodeProxyPattern: process.env.NUXT_PUBLIC_HYDRA_NODE_PROXY_PATTERN,
      hydraNodeProxySSL: process.env.NUXT_PUBLIC_HYDRA_NODE_PROXY_SSL === 'true',
      environment: process.env.ENVIRONMENT || 'development'
    }
  },
  vite: {
    plugins: [
      wasm(),
      topLevelAwait(),
      nodePolyfills({
        // Specific modules that should not be polyfilled.
        exclude: [],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true
      })
    ],
    optimizeDeps: {
      include: ['@emurgo/cardano-serialization-lib-browser']
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  googleFonts: {
    families: {
      Poppins: [400, 500, 600, 700],
      Roboto: [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true,
    useStylesheet: true
  },
  svgo: {
    autoImportPath: '~/assets/icons',
    customComponent: 'BaseIcon',
    svgoConfig: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // customize default plugin options
              inlineStyles: {
                onlyMatchedOnce: false
              },

              // or disable plugins
              removeDoctype: false,
              removeViewBox: false
            }
          }
        }
      ]
    }
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  unocss: {
    configFile: './uno.config.ts'
  }
})
