export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiInternal: '',
    public: {
      apiBase: 'http://localhost:5454/api',
      uploadsBase: 'http://localhost:5454/uploads',
      siteUrl: 'http://localhost:3000',
      siteName: 'SamDU',
      i18n: {
        baseUrl: 'http://localhost:3000'
      }
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uz' },
      titleTemplate: '%s · SamDU',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0b2d5b' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  routeRules: {
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/auth/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    compressPublicAssets: true
  },

  vite: {
    optimizeDeps: {
      include: ['zod']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800],
      subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext']
    }
  },

  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons', 'circle-flags']
    }
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'uz',
    langDir: 'locales',
    customRoutes: 'meta',
    locales: [
      { code: 'uz', language: 'uz-Latn-UZ', name: 'O‘zbekcha', file: 'uz.json' },
      { code: 'kr', language: 'uz-Cyrl-UZ', name: 'Ўзбекча', file: 'kr.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'samdu_lang',
      redirectOn: 'root'
    },
    compilation: {
      strictMessage: false
    }
  }
})
