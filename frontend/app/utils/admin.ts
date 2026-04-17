import type { FormError } from '@nuxt/ui'

export const toDateTimeLocal = (value?: string | Date | null) => {
  const date = value ? new Date(value) : new Date()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export const requireFields = (state: Record<string, unknown>, rules: Record<string, string>): FormError[] =>
  Object.entries(rules)
    .filter(([field]) => {
      const value = state[field]
      return value === null || value === undefined || String(value).trim() === ''
    })
    .map(([name, message]) => ({ name, message }))

export const pickFields = <T extends object, K extends keyof T>(source: T, keys: readonly K[]) =>
  Object.fromEntries(keys.map(key => [key, source[key]])) as Pick<T, K>
