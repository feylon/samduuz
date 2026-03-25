<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-24 text-center">
    
    <div class="mb-8 text-secondary-500">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-32 h-32 opacity-20" />
    </div>

    <h1 class="text-7xl lg:text-9xl font-black text-gray-900 tracking-tight mb-4">
      {{ error?.statusCode || '404' }}
    </h1>

    <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
      {{ error?.statusCode === 404 ? "Sahifa topilmadi" : "Kutilmagan xatolik yuz berdi" }}
    </h2>

    <p class="text-gray-500 max-w-md mx-auto mb-10 text-lg">
      {{ 
        error?.statusCode === 404 
        ? "Kechirasiz, siz qidirayotgan sahifa o'chirilgan, nomi o'zgartirilgan yoki vaqtinchalik ishlamayapti." 
        : error?.message || "Tizimda qandaydir muammo yuzaga keldi. Iltimos, birozdan so'ng qayta urinib ko'ring."
      }}
    </p>

    <div class="flex flex-col sm:flex-row items-center gap-4">
      <UButton 
        size="xl" 
        color="secondary" 
        variant="solid" 
        icon="i-heroicons-home" 
        @click="handleClearError('/')"
      >
        Bosh sahifaga qaytish
      </UButton>

      <UButton 
        size="xl" 
        color="secondary" 
        variant="ghost" 
        icon="i-heroicons-arrow-left" 
        @click="goBack"
      >
        Orqaga qaytish
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
    title: 'Xatolik yuz berdi',
    meta: [
        { name: 'description', content: 'Kutilmagan xatolik yuz berdi. Iltimos, birozdan so\'ng qayta urinib ko\'ring yoki bosh sahifaga qayting.' }
    ]
})
const props = defineProps({
  error: Object
})

const router = useRouter()

const handleClearError = (path: string) => {
  clearError({ redirect: path })
}

const goBack = () => {
  clearError() 
  router.back()
}
</script>