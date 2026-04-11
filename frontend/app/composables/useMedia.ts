export const useMedia = () => {
  const { uploadsBase } = useRuntimeConfig().public
  const base = uploadsBase.replace(/\/+$/, '')

  return (path?: string | null) => {
    if (!path) return undefined
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
    return `${base}/${path.replace(/^\/+/, '').replace(/^uploads\//, '')}`
  }
}
