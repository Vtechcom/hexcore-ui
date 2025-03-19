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
