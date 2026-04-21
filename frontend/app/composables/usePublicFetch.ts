import type { AsyncData, NuxtError } from '#app'
import type { ApiResponse } from '~/types/api'

interface PublicFetchOptions<T> {
  query?: MaybeRefOrGetter<Record<string, unknown>>
  default?: () => T
  lazy?: boolean
}

export const usePublicFetch = <T>(path: string | (() => string), options: PublicFetchOptions<T> = {}) => {
  const { locale } = useI18n()
  const baseURL = useApiBase()
  const resolvedPath = computed(() => (typeof path === 'function' ? path() : path))
  const query = computed(() => toValue(options.query) ?? {})

  return useFetch(resolvedPath, {
    baseURL,
    query,
    lazy: options.lazy,
    default: options.default,
    key: computed(() => `${resolvedPath.value}:${locale.value}:${JSON.stringify(query.value)}`),
    headers: computed(() => ({ 'Accept-Language': locale.value })),
    watch: [locale],
    transform: (response: ApiResponse<T>) => response.data
  }) as unknown as AsyncData<T | undefined, NuxtError | undefined>
}
