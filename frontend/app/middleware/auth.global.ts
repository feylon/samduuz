export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()

  if (to.path.startsWith('/admin') && !isLoggedIn.value) {
    return navigateTo({ path: '/auth/login', query: to.fullPath !== '/admin' ? { redirect: to.fullPath } : undefined })
  }

  if (to.path === '/auth/login' && isLoggedIn.value) {
    return navigateTo('/admin')
  }
})
