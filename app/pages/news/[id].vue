<template>
  <div class="w-full bg-white py-8 px-4 md:px-10 max-w-[1600px] mx-auto min-h-screen flex flex-col">
    
    <!-- Back button -->
    <div class="mb-6 flex items-center" ref="backBtnRef">
      <button 
        @click="router.back()" 
        class="flex items-center text-gray-500 hover:text-[#0c2a5a] transition-colors font-medium text-sm md:text-base group"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {{ t('back', 'Orqaga qaytish') }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="text-gray-500 text-center py-20 flex-grow">
      Ma'lumotlar yuklanmoqda...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center py-20 flex-grow">
      Xatolik: {{ error.message }}
    </div>

    <!-- Content -->
    <article 
      v-else-if="newsItem"
      ref="articleRef"
      class="flex-grow article-container"
    >
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0c2a5a] leading-snug mb-4">
        {{ newsItem.title }}
      </h1>

      <!-- Meta -->
      <div class="flex items-center text-sm text-gray-400 font-medium mb-8 pb-4 border-b border-gray-100">
        <div class="flex items-center mr-6">
          <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
          <span>{{ formatDate(newsItem.createdAt) }}</span>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-eye" class="w-5 h-5 mr-2" />
          <span>{{ newsItem.views || 0 }}</span>
        </div>
      </div>

      <!-- Image -->
      <div v-if="newsItem.mainImagePath" class="w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-8 bg-gray-50">
        <img 
          :src="getImageUrl(newsItem.mainImagePath)" 
          :alt="newsItem.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Content -->
      <div 
        class="article-content text-gray-700 text-base md:text-lg leading-relaxed"
        v-html="newsItem.content"
      ></div>
    </article>

    <!-- Empty -->
    <div v-else class="text-gray-400 text-center py-20 flex-grow">
      Yangilik topilmadi
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue'
import gsap from 'gsap'
import type { Res } from '~~/types/globalTypes'

definePageMeta({
  layout: 'main',
})

/* TYPES */
export interface INewsItem {
  id: number
  title: string
  description: string
  content: string
  mainImagePath: string
  views: number
  createdAt: string
}

/* COMPOSABLES */
const { ENV_BASE, api } = useEnv()
const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()

/* REFS */
const backBtnRef = ref<HTMLElement | null>(null)
const articleRef = ref<HTMLElement | null>(null)

/* ID (SAFE) */
const newsId = computed(() => route.params.id as string)

/* IMAGE URL */
const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const cleanBase = ENV_BASE.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return `${cleanBase}/${cleanPath}`
}

/* FETCH (NO AWAIT ❗) */
const { data, pending, error } = useFetch<Res<INewsItem>>(
  () => newsId.value ? `news/${newsId.value}` : null,
  {
    baseURL: api,
    watch: [locale],
    headers: {
      get 'Accept-Language'() {
        return locale.value
      }
    }
  }
)

/* DATA */
const newsItem = computed(() => data.value?.data)

/* SEO */
watch(newsItem, (item) => {
  if (!item) return

  useSeoMeta({
    title: item.title,
    description: item.description,
    ogTitle: item.title,
    ogDescription: item.description,
    ogImage: getImageUrl(item.mainImagePath),
  })
}, { immediate: true })

/* DATE */
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const d = new Date(dateString)

  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} / ${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`
}

/* ANIMATION */
watch(
  () => pending.value,
  async (val) => {
    if (!val && newsItem.value) {
      await nextTick()

      if (backBtnRef.value) {
        gsap.from(backBtnRef.value, {
          x: -20,
          opacity: 0,
          duration: 0.5
        })
      }

      if (articleRef.value) {
        gsap.from(articleRef.value, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.article-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.8;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 2rem auto;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>