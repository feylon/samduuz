export default defineNuxtPlugin((nuxtApp) => {
 
  globalThis.$fetch = globalThis.$fetch.create({
    
    async onResponseError({ response }) {
    
      if (response.status === 401) {
        
        const accessToken = useCookie('accessToken')
        const refreshToken = useCookie('refreshToken')
        
       
        accessToken.value = null
        refreshToken.value = null
        
        
        await nuxtApp.runWithContext(() => {
          return navigateTo('/auth/login')
        })
      }
    }
    
  })
})