<script setup lang="ts">
import type { Paginated, Slide } from '~/types/api'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Slaydlar' })

const api = useAdminApi()
const media = useMedia()
const confirm = useConfirm()

const slides = ref<Slide[]>([])
const loading = ref(true)

const load = async () => {
  loading.value = true
  try {
    slides.value = (await api.get<Paginated<Slide>>('/slides/full', { page: 1, pageSize: 100 })).items
  } finally {
    loading.value = false
  }
}
onMounted(load)

const toggle = async (slide: Slide) => {
  const next = !slide.isActive
  slide.isActive = next
  try {
    await api.save(`/slides/${slide.id}`, { isActive: next }, 'PUT')
  } catch {
    slide.isActive = !next
  }
}

const removeSlide = async (slide: Slide) => {
  const ok = await confirm({ title: 'Slaydni o‘chirasizmi?', description: `“${slide.titleUz}”`, confirmLabel: 'O‘chirish' })
  if (!ok) return
  await api.remove(`/slides/${slide.id}`)
  await load()
}
</script>

<template>
  <AdminPage
    title="Slaydlar"
    description="Bosh sahifadagi karusel. Tartib raqami kichik bo‘lgan slayd birinchi chiqadi."
  >
    <template #actions>
      <UButton
        to="/admin/slides/create"
        icon="i-lucide-plus"
      >
        Qo‘shish
      </UButton>
    </template>

    <div
      v-if="loading"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <USkeleton
        v-for="n in 3"
        :key="n"
        class="aspect-video rounded-2xl"
      />
    </div>
    <AdminEmptyState
      v-else-if="!slides.length"
      title="Slaydlar yo‘q"
      text="Bosh sahifa uchun birinchi slaydni qo‘shing"
      icon="i-lucide-gallery-horizontal-end"
    >
      <UButton
        to="/admin/slides/create"
        icon="i-lucide-plus"
        class="mt-4"
      >
        Slayd qo‘shish
      </UButton>
    </AdminEmptyState>
    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <article
        v-for="slide in slides"
        :key="slide.id"
        class="group overflow-hidden rounded-2xl border border-default bg-default transition-shadow hover:shadow-lg"
        :class="{ 'opacity-60': !slide.isActive }"
      >
        <div class="relative aspect-video bg-elevated">
          <img
            :src="media(slide.mainImagePath)"
            :alt="slide.titleUz"
            class="size-full object-cover"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span class="absolute left-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-brand-900">{{ slide.priority }}</span>
          <p class="absolute inset-x-3 bottom-3 line-clamp-2 font-semibold text-white">
            {{ slide.titleUz }}
          </p>
        </div>
        <div class="flex items-center justify-between gap-2 p-3">
          <USwitch
            :model-value="slide.isActive"
            :label="slide.isActive ? 'Faol' : 'O‘chirilgan'"
            size="sm"
            @update:model-value="toggle(slide)"
          />
          <div class="flex gap-1">
            <UButton
              :to="`/admin/slides/${slide.id}`"
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Tahrirlash"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              aria-label="O‘chirish"
              @click="removeSlide(slide)"
            />
          </div>
        </div>
      </article>
    </div>
  </AdminPage>
</template>
