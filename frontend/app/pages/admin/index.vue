<script setup lang="ts">
import type { DashboardStats, LatestItem } from '~/types/api'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Boshqaruv paneli' })

const api = useAdminApi()
const auth = useAuth()
const stats = ref<DashboardStats | null>(null)

onMounted(async () => {
  stats.value = await api.get<DashboardStats>('/stats').catch(() => null)
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Xayrli tong'
  if (hour < 18) return 'Xayrli kun'
  return 'Xayrli kech'
})

const cards = computed(() => [
  { label: 'Yangiliklar', value: stats.value?.news, icon: 'i-lucide-newspaper', to: '/admin/news', tone: 'bg-brand-500/10 text-brand-600 dark:text-brand-300' },
  { label: 'E’lonlar', value: stats.value?.announcements, icon: 'i-lucide-megaphone', to: '/admin/announcements', tone: 'bg-gold-500/15 text-gold-700 dark:text-gold-300' },
  { label: 'Sahifalar', value: stats.value?.pages, icon: 'i-lucide-files', to: '/admin/pages', tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
  { label: 'Jami ko‘rishlar', value: stats.value?.totalViews, icon: 'i-lucide-eye', to: '/admin/news', tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  { label: 'Faol slaydlar', value: stats.value ? `${stats.value.activeSlides}/${stats.value.slides}` : undefined, icon: 'i-lucide-gallery-horizontal-end', to: '/admin/slides', tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-300' },
  { label: 'Menyu elementlari', value: stats.value?.menus, icon: 'i-lucide-list-tree', to: '/admin/menu', tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-300' },
  { label: 'Foydali havolalar', value: stats.value?.usefulLinks, icon: 'i-lucide-link', to: '/admin/useful-links', tone: 'bg-teal-500/10 text-teal-600 dark:text-teal-300' },
  { label: 'Fayllar', value: stats.value?.files, icon: 'i-lucide-folder-open', to: '/admin/files', tone: 'bg-orange-500/10 text-orange-600 dark:text-orange-300' }
])

const lists = computed<{ title: string, items: LatestItem[], base: string, icon: string }[]>(() => [
  { title: 'So‘nggi yangiliklar', items: stats.value?.latestNews ?? [], base: '/admin/news', icon: 'i-lucide-clock' },
  { title: 'Eng ko‘p o‘qilgan', items: stats.value?.popularNews ?? [], base: '/admin/news', icon: 'i-lucide-trending-up' },
  { title: 'So‘nggi e’lonlar', items: stats.value?.latestAnnouncements ?? [], base: '/admin/announcements', icon: 'i-lucide-megaphone' }
])

const quickActions = [
  { label: 'Yangilik qo‘shish', icon: 'i-lucide-plus', to: '/admin/news/create' },
  { label: 'E’lon qo‘shish', icon: 'i-lucide-plus', to: '/admin/announcements/create' },
  { label: 'Sahifa yaratish', icon: 'i-lucide-file-plus', to: '/admin/pages/create' },
  { label: 'Fayl yuklash', icon: 'i-lucide-upload', to: '/admin/files' }
]
</script>

<template>
  <AdminPage title="Boshqaruv paneli">
    <template #actions>
      <UButton
        to="/"
        target="_blank"
        icon="i-lucide-external-link"
        color="neutral"
        variant="outline"
        class="hidden sm:inline-flex"
      >
        Saytni ochish
      </UButton>
    </template>

    <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-6 text-white sm:p-8">
      <div class="pointer-events-none absolute inset-0 bg-pattern opacity-[0.06] invert" />
      <div class="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-gold-500/20 blur-3xl" />
      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm text-white/60">
            {{ formatDate(new Date(), 'uz') }}
          </p>
          <h1 class="font-display mt-1 text-2xl font-bold sm:text-3xl">
            {{ greeting }}, {{ auth.user.value?.fullName ?? 'administrator' }}!
          </h1>
          <p class="mt-2 text-white/70">
            Bugun saytga nimalar qo‘shamiz?
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <UButton
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            :icon="action.icon"
            color="neutral"
            variant="soft"
            class="bg-white/10 text-white hover:bg-white/20"
          >
            {{ action.label }}
          </UButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <NuxtLink
        v-for="card in cards"
        :key="card.label"
        :to="card.to"
        class="group rounded-2xl border border-default bg-default p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      >
        <div class="flex items-start justify-between gap-2">
          <span
            class="flex size-10 items-center justify-center rounded-xl"
            :class="card.tone"
          >
            <UIcon
              :name="card.icon"
              class="size-5"
            />
          </span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-4 text-dimmed transition-colors group-hover:text-primary"
          />
        </div>
        <p class="font-display mt-4 text-2xl font-bold tabular-nums text-highlighted sm:text-3xl">
          <template v-if="card.value !== undefined">{{ typeof card.value === 'number' ? formatNumber(card.value) : card.value }}</template>
          <USkeleton
            v-else
            class="h-8 w-16"
          />
        </p>
        <p class="mt-1 text-sm text-muted">{{ card.label }}</p>
      </NuxtLink>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <section
        v-for="list in lists"
        :key="list.title"
        class="rounded-2xl border border-default bg-default"
      >
        <header class="flex items-center gap-2 border-b border-default px-5 py-4">
          <UIcon
            :name="list.icon"
            class="size-4 text-primary"
          />
          <h2 class="font-semibold text-highlighted">
            {{ list.title }}
          </h2>
        </header>
        <ul
          v-if="list.items.length"
          class="divide-y divide-default"
        >
          <li
            v-for="item in list.items"
            :key="item.id"
          >
            <NuxtLink
              :to="`${list.base}/${item.id}`"
              class="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-elevated/50"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-highlighted">{{ item.titleUz }}</p>
                <p class="text-xs text-dimmed">{{ formatDate(item.publishedAt, 'uz') }}</p>
              </div>
              <span class="flex items-center gap-1 text-xs text-muted"><UIcon
                name="i-lucide-eye"
                class="size-3.5"
              />{{ item.views }}</span>
            </NuxtLink>
          </li>
        </ul>
        <div
          v-else-if="stats"
          class="px-5 py-10 text-center text-sm text-muted"
        >
          Hozircha ma’lumot yo‘q
        </div>
        <div
          v-else
          class="space-y-3 p-5"
        >
          <USkeleton
            v-for="n in 4"
            :key="n"
            class="h-9"
          />
        </div>
      </section>
    </div>
  </AdminPage>
</template>
