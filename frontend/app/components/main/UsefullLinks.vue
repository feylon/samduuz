<template>
  <section
    ref="sectionRef"
    class="relative isolate overflow-hidden py-20 md:py-28"
  >
    <div class="absolute inset-0 -z-20 bg-gradient-to-b from-slate-10 via-white to-blue-50/10"></div>

    <div class="absolute -top-24 -left-16 -z-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
    <div class="absolute top-1/3 -right-20 -z-10 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl"></div>
    <div class="absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl"></div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <!-- <div
          class="badge-el mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur"
        >
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-blue-500"></span>
          Tavsiya etilgan manbalar
        </div> -->

        <h2
          class="title-el text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
        >
          Foydali havolalar
        </h2>

        <!-- <p class="subtitle-el mt-4 text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
          Eng kerakli saytlar va xizmatlar bir joyda. Tezkor kirish, zamonaviy ko‘rinish
          va qulay foydalanish uchun tayyorlangan.
        </p> -->
      </div>

      <div v-if="pending" class="flex min-h-[260px] items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <div class="h-16 w-16 rounded-full border-4 border-blue-100"></div>
            <div class="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
          </div>
          <p class="text-sm font-medium text-slate-500">Yuklanmoqda...</p>
        </div>
      </div>

      <div
        v-else-if="links.length > 0"
        class="carousel-el group relative"
      >
        <div class="rounded-[28px] border border-white/60 bg-white/60 px-4 py-8 shadow-[0_20px_80px_-20px_rgba(37,99,235,0.18)] backdrop-blur-xl sm:px-6 md:px-8">
          
          <div class="flex flex-wrap items-stretch justify-center gap-6">
            <a
              v-for="site in links"
              :key="site.id"
              :href="formatLink(site.externalLink)"
              target="_blank"
              rel="noopener noreferrer"
              class="site-card group/card relative flex h-[280px] w-[230px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2.5 hover:scale-[1.025] hover:shadow-[0_25px_60px_-20px_rgba(37,99,235,0.28)] sm:h-[300px] sm:w-[250px] md:h-[320px] md:w-[280px]"
            >
              <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
                <div class="absolute -top-10 right-0 h-28 w-28 rounded-full bg-blue-100 blur-2xl"></div>
                <div class="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-cyan-100 blur-2xl"></div>
              </div>

              <div class="relative z-[1] flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/70 p-4">
                <img
                  v-if="site.imagePath"
                  :src="ENV_BASE + site.imagePath"
                  :alt="site.name"
                  class="max-h-[135px] w-auto max-w-full object-contain transition-transform duration-500 group-hover/card:scale-110"
                  loading="lazy"
                />
                <div
                  v-else
                  class="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-blue-600 shadow-inner"
                >
                  {{ getInitial(site.name) }}
                </div>
              </div>

              <div class="relative z-[1] mt-5 flex items-end justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="line-clamp-2 text-base font-bold leading-6 text-slate-900 md:text-lg">
                    {{ site.name }}
                  </p>
                  <p class="mt-2 text-sm text-slate-500">
                    Havolani ochish
                  </p>
                </div>

                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover/card:translate-x-1 group-hover/card:-translate-y-1"
                >
                  <UIcon name="i-heroicons-arrow-up-right" class="h-5 w-5" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div
        v-else
        class="mx-auto flex min-h-[260px] max-w-2xl flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 text-center shadow-sm backdrop-blur"
      >
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <UIcon name="i-heroicons-link" class="h-8 w-8 text-slate-500" />
        </div>
        <h3 class="text-xl font-bold text-slate-800">Hozircha havolalar yo‘q</h3>
        <p class="mt-2 text-slate-500">
          Keyinroq bu yerda foydali manbalar ko‘rsatiladi.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { ENV_BASE, api } = useEnv()
const { locale } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)

const { data: fetchResult, pending } = await useFetch<any>('useful-links', {
  baseURL: api,
  method: 'GET',
  watch: [locale],
  headers: {
    get 'Accept-Language'() {
      return locale.value
    }
  }
})

const links = computed(() => {
  if (fetchResult.value && Array.isArray(fetchResult.value.data)) {
    return fetchResult.value.data
  }
  return []
})

const cleanupGsap = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

const initEntranceAnimations = () => {
  if (!sectionRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      once: true
    }
  })

  tl.from('.badge-el', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .from('.title-el', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.45')
    .from('.subtitle-el', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.carousel-el', { y: 50, opacity: 0, scale: 0.98, duration: 1, ease: 'power3.out' }, '-=0.45')
}

const initGsap = async () => {
  cleanupGsap()
  await nextTick()
  initEntranceAnimations()
}

watch([pending, links], async ([isPending, currentLinks]) => {
  if (!isPending && currentLinks.length > 0) {
    await nextTick()
    await initGsap()
  }
})

onMounted(async () => {
  if (!pending.value && links.value.length > 0) {
    await nextTick()
    await initGsap()
  }
})

onUnmounted(() => {
  cleanupGsap()
})

const formatLink = (link: string) => {
  if (!link) return '#'
  return link.startsWith('http') ? link : `https://${link}`
}

const getInitial = (text: string) => {
  return text?.trim()?.charAt(0)?.toUpperCase() || 'L'
}
</script>

<style scoped>
.site-card {
  user-select: none;
  will-change: transform;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>