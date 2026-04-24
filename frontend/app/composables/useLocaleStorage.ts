export const LOCALE_STORAGE_KEY = 'samdu_lang'

export const useLocaleStorage = () => {
  const { locales, setLocale } = useI18n()

  const isSupported = (code: string | null): code is typeof locales.value[number]['code'] =>
    Boolean(code && locales.value.some(item => item.code === code))

  const changeLocale = async (code: string) => {
    if (!isSupported(code)) return
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
    } catch {
      return setLocale(code)
    }
    await setLocale(code)
  }

  return { changeLocale }
}
