import { LOCALE_STORAGE_KEY } from '~/composables/useLocaleStorage'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n

  nuxtApp.hook('app:mounted', async () => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    } catch {
      return
    }
    const supported = i18n.locales.value.some(item => item.code === saved)
    if (saved && supported && saved !== i18n.locale.value) {
      await i18n.setLocale(saved as typeof i18n.locale.value)
    }
  })
})
