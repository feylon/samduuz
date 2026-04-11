export const useApiBase = () => {
  const config = useRuntimeConfig()
  if (import.meta.server && config.apiInternal) return config.apiInternal
  return config.public.apiBase
}
