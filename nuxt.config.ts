// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },
  ui: {
    colorMode: false
  },

  runtimeConfig: {
    apiSecret: '',

    public: {
      api: 'http://localhost:5454/api/',
      URL: 'http://localhost:5454/uploads/'
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  app: {
    head: {
      titleTemplate: '%s - SamDU.uz',
      title: 'SamDU.uz',
    }
  },

  ssr: true,
  i18n: {
    locales: [
      { code: 'uz', iso: 'uz-UZ', name: "O'zbek", file: 'uz.json', icon: 'i-circle-flags-uz' },
      { code: 'kr', iso: 'uz-UZ', name: 'Ўзбек', file: 'uz-cyrl.json', icon: 'i-circle-flags-uz' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json', icon: 'i-circle-flags-ru' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json', icon: 'i-circle-flags-gb' }
    ],
    // lazy: true,
    langDir: 'locales',
    defaultLocale: 'uz',

    // 1-ASOSIY QISM: URL ni o'zgartirmaslik uchun
    strategy: 'no_prefix',
    compilation: {
      strictMessage: false // <-- HTML teglarni xato deb hisoblamaslik uchun shu qator qo'shiladi
    },

    // 2-ASOSIY QISM: Tilni brauzer xotirasida (Cookie'da) saqlash uchun
    detectBrowserLanguage: {
      useCookie: true,           // LocalStorage o'rniga Cookie ishlatish (Nuxt uchun eng yaxshisi)
      cookieKey: 'i18n_redirected', // Xotirada saqlanadigan nom
      redirectOn: 'root',
      alwaysRedirect: true       // Har safar kirganda saqlangan tilni ochib beradi
    }
  },


  components: {
    dirs: [
      '~/components',
      '~/components/main',
      '~/components/main/Pages'
    ]
  }

})
