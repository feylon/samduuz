import type { UseFetchOptions } from '#app'
import type { ApiResponse } from '~/types/api'

export const usePublicFetch = <T>(
  path: string | (() => string),
  options: Omit<UseFetchOptions<ApiResponse<T>, T>, 'transform' | 'baseURL'> = {}
) => {
  const { locale } = useI18n()
  const baseURL = useApiBase()
  const resolvedPath = computed(() => (typeof path === 'function' ? path() : path))

  return useFetch(resolvedPath, {
    ...options,
    baseURL,
    key: computed(() => `${resolvedPath.value}:${locale.value}:${JSON.stringify(toValue(options.query) ?? {})}`),
    headers: computed(() => ({ 'Accept-Language': locale.value })),
    watch: [locale, ...(options.watch || [])],
    transform: (response: ApiResponse<T>) => response.data
  } as UseFetchOptions<ApiResponse<T>, T>)
}
