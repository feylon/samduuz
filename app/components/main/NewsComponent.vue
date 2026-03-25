<template>
  <div class="w-full py-10 px-4 md:px-10 max-w-[1600px] mx-auto">
    
    <div class="mb-8" ref="headerRef">
      <div class="flex items-center">
        <h2 class="text-2xl md:text-3xl font-bold text-[#0c2a5a] mr-4 whitespace-nowrap">
          {{ t('news', 'Yangiliklar') }}
        </h2>
        <div class="h-1 bg-[#0c2a5a] flex-grow mt-2"></div>
      </div>
      
      <div class="flex justify-end mt-3">
        <NuxtLink 
          to="/news" 
          class="text-[#4b8b3b] hover:text-green-700 hover:underline text-sm md:text-base font-medium transition-colors cursor-pointer"
        >
          {{ t('all_news', "Barcha yangiliklarni o'qish") }}
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="text-gray-500 text-center py-10">
      Ma'lumotlar yuklanmoqda...
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-10">
      Xatolik yuz berdi: {{ error.message }}
    </div>

    <div 
      v-else-if="newsData?.data?.items && newsData.data.items.length > 0" 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
    >
      <NuxtLink 
        v-for="item in newsData.data.items" 
        :key="item.id" 
        :to="`/news/${item.id}`"
        class="flex flex-col group cursor-pointer news-card"
      >
        <div class="w-full h-[200px] md:h-[180px] lg:h-[200px] rounded-2xl overflow-hidden mb-4 bg-gray-100">
          <img 
            :src="getImageUrl(item.mainImagePath)" 
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div class="flex items-center text-[13px] text-gray-500 mb-2 font-medium">
          <span>{{ formatDate(item.createdAt) }}</span>
          <span class="mx-2"></span>
          <div class="flex items-center gap-1 hidden">
            <UIcon name="i-heroicons-chat-bubble-oval-left" class="w-4 h-4" />
            <span>{{ item.views || 0 }}</span>
          </div>
        </div>
        
        <h3 class="text-[#0c2a5a] font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {{ item.title }}
        </h3>
        
        <p class="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {{ item.description }}
        </p>
      </NuxtLink>
    </div>

    <div v-else class="text-gray-400 text-center py-10">
      Hozircha yangiliklar topilmadi.
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import gsap from 'gsap';

export interface INewsItemMainPage {
  id: number;
  title: string;
  description: string;
  content: string;
  mainImagePath: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface INewsResponse {
  items: INewsItemMainPage[];
  meta: {
    totalCount: number;
    page: number;
    totalPages: number;
    pageSize: number;
  };
}

export interface Res<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

const { ENV_BASE, api } = useEnv();
const { locale, t } = useI18n();

const headerRef = ref<HTMLElement | null>(null);

const { data: newsData, pending, error } = await useFetch<Res<INewsResponse>>('news', {
  method: "GET",
  baseURL: api,
  watch: [locale],
  headers: {
    get 'Accept-Language'() {
      return locale.value;
    }
  }
});

const getImageUrl = (path: string) => {
  if (!path) return '';
  const cleanBase = ENV_BASE.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} / ${month} / ${year}  ${hours}:${minutes}`;
};

onMounted(() => {
  if (headerRef.value) {
    gsap.from(headerRef.value, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

watch(
  () => pending.value,
  async (isPending) => {
    if (!isPending && newsData.value?.data?.items?.length) {
      await nextTick();
      gsap.from('.news-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  },
  { immediate: true }
);
</script>