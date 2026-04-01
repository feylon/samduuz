<script setup lang="ts">
import { ref, computed } from 'vue'

const { locale, locales, setLocale } = useI18n()


const isOpen = ref(false)


const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value) || locales.value[0]
})


const changeLanguage = (code: string) => {
  setLocale(code)
  isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block text-left">
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40"></div>

    <button 
      @click="isOpen = !isOpen"
      class="relative z-50 flex items-center gap-2 px-2 py-1.5 text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer outline-none"
    >
      <UIcon :name="currentLocale?.icon" class="w-5 h-5 rounded-full" />
      
      <span>{{ currentLocale?.name }}</span>
      
      <UIcon 
        name="i-heroicons-chevron-down-20-solid" 
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        class="absolute left-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1.5"
      >
        <button
          v-for="l in locales"
          :key="l.code"
          @click="changeLanguage(l.code)"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
          :class="{ 'bg-gray-50 font-medium': l.code === locale }"
        >
          <UIcon :name="l.icon" class="w-5 h-5 rounded-full" />
          {{ l.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>