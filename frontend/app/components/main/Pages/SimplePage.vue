<template>
  <div class="w-full bg-white py-10 px-4 md:px-10 max-w-[1300px] mx-auto min-h-screen" ref="pageContainer">
    
    <template v-if="data">
      
      <h1 class="text-3xl md:text-4xl font-bold text-[#0c2a5a] mb-4 page-anim">
        {{ data.title }}
      </h1>

      <div class="flex items-center text-sm text-gray-400 font-medium mb-8 pb-4 border-b border-gray-100 page-anim">
        <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
        <span>{{ formatDate(data.createdAt) }}</span>
      </div>

      <div 
        class="page-content text-gray-700 text-base md:text-lg leading-relaxed page-anim"
        v-html="data.content"
      ></div>

    </template>

    <div v-else class="text-center py-20 text-gray-500">
      Ma'lumot topilmadi...
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import gsap from 'gsap';

export interface IPage {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Res<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

const route = useRoute();
const { ENV_BASE, api } = useEnv();
const { locale, t } = useI18n();

// Props ni qabul qilish
const props = defineProps<{
  data: IPage | null | undefined
}>();

const pageContainer = ref<HTMLElement | null>(null);

// Sanani "soat:minut / kun.oy.yil" formatiga o'tkazish
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes} / ${day}.${month}.${year}`;
};

// GSAP Animatsiya funksiyasi
const animateContent = () => {
  if (!pageContainer.value) return;
  
  // page-anim klassiga ega bo'lgan elementlarni ketma-ket chiqarish
  gsap.fromTo(
    pageContainer.value.querySelectorAll('.page-anim'),
    { y: 40, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.6, 
      stagger: 0.15, // Har bir element orasidagi farq
      ease: 'power2.out',
      clearProps: 'all' // Animatsiya tugagach style'larni tozalaydi
    }
  );
};

// Props orqali ma'lumot kelganda (yoki o'zgarganda) animatsiyani ishga tushirish
watch(
  () => props.data,
  async (newData) => {
    if (newData) {
      await nextTick(); // DOM to'liq yangilanishini kutadi
      animateContent();
    }
  },
  { immediate: true } // Komponent yuklanganda darhol tekshiradi
);
</script>

<style scoped>
/* Backenddan keladigan HTML matn ichidagi elementlar dizayni buzilmasligi uchun */
.page-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.8;
}

.page-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.page-content :deep(h1), 
.page-content :deep(h2), 
.page-content :deep(h3) {
  color: #0c2a5a;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.page-content :deep(ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.page-content :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}
</style>