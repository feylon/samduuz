import type { AdminUser, ApiResponse, AuthTokens } from '~/types/api'

const cookieOptions = { sameSite: 'lax' as const, path: '/' }

export const useAuth = () => {
  const accessToken = useCookie<string | null>('samdu_access', { ...cookieOptions, maxAge: 60 * 60 })
  const refreshToken = useCookie<string | null>('samdu_refresh', { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 })
  const user = useState<AdminUser | null>('admin-user', () => null)
  const baseURL = useApiBase()

  const isLoggedIn = computed(() => Boolean(refreshToken.value))

  const storeTokens = (tokens: AuthTokens) => {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    user.value = tokens.user
  }

  const login = async (username: string, password: string) => {
    const response = await $fetch<ApiResponse<AuthTokens>>('/auth/login', {
      baseURL,
      method: 'POST',
      body: { username, password }
    })
    storeTokens(response.data)
    return response.data.user
  }

  let refreshing: Promise<boolean> | null = null
  const refresh = () => {
    if (!refreshToken.value) return Promise.resolve(false)
    refreshing ??= $fetch<ApiResponse<AuthTokens>>('/auth/refresh', {
      baseURL,
      method: 'POST',
      body: { refreshToken: refreshToken.value }
    })
      .then((response) => {
        storeTokens(response.data)
        return true
      })
      .catch(() => {
        clear()
        return false
      })
      .finally(() => {
        refreshing = null
      })
    return refreshing
  }

  const clear = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  const logout = async () => {
    if (accessToken.value) {
      await $fetch('/auth/logout', {
        baseURL,
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` }
      }).catch(() => null)
    }
    clear()
    await navigateTo('/auth/login')
  }

  return { accessToken, refreshToken, user, isLoggedIn, login, refresh, logout, clear }
}
