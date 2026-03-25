export default defineNuxtRouteMiddleware((to, from) => {
  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')

  if (to.path.startsWith('/admin')) {
    if (!accessToken.value || !refreshToken.value) {
      return navigateTo('/auth/login')
    }
  }

  
  if (to.path === '/auth/login') {
    if (accessToken.value && refreshToken.value) {
      return navigateTo('/admin')
    }
  }
})