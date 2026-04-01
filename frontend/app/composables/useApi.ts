export const useApi = async <T>(
  url: string,
  options: any = {}
) => {
  // 1. Nuxt instansiyasini funksiya ichida chaqiramiz
  const config = useRuntimeConfig();
  const toast = useToast(); 

  return $fetch<T>(url, {
    baseURL: config.public.api, // .env dagi NUXT_PUBLIC_API_BASE ga bog'langan
    ...options,

    async onRequest({ options }) {
      // 2. Tokenni olish
      const token = useCookie('accessToken').value;
      
      // Headers bilan xavfsiz ishlash
      const headers = new Headers(options.headers);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      options.headers = headers;
    },

    async onResponseError({ response }) {
      // 3. Xatolikni ko'rsatish (toast context ichida ishlaydi)
      if (response.status === 401) {
        toast.add({
          title: "Xatolik",
          description: "Login yoki parol xato",
          color: "error" // 'error' emas, Nuxt UI da 'red' yoki 'orange'
        });
        
        // Login sahifasiga yuborish
        await navigateTo('/login');
      } else if (response.status === 500) {
        toast.add({ 
          title: "Serverda xatolik", 
          description: "Keyinroq qayta urinib ko'ring", 
          color: "error" 
        });
      }
    }
  });
};