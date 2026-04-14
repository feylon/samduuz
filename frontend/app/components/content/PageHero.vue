<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const props = defineProps<{
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { siteUrl } = useRuntimeConfig().public

const items = computed<BreadcrumbItem[]>(() => [
  { label: t('nav.home'), icon: 'i-lucide-house', to: localePath('/') },
  ...(props.breadcrumbs ?? [])
])

useJsonLd(() => ({
  '@type': 'BreadcrumbList',
  'itemListElement': items.value.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.label,
    ...(item.to ? { item: `${siteUrl.replace(/\/+$/, '')}${item.to}` } : {})
  }))
}), 'breadcrumbs')
</script>

<template>
  <section class="relative overflow-hidden bg-brand-950 text-white">
    <div class="pointer-events-none absolute inset-0 bg-pattern opacity-[0.05] invert" />
    <div class="pointer-events-none absolute -right-24 top-0 size-80 rounded-full bg-gold-500/15 blur-3xl" />
    <div class="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-brand-500/25 blur-3xl" />
    <div class="container-page relative py-10 sm:py-14">
      <UBreadcrumb
        :items="items"
        :ui="{
          link: 'text-white/60 hover:text-white text-xs sm:text-sm',
          linkLabel: 'max-w-48 truncate sm:max-w-80',
          separatorIcon: 'text-white/30'
        }"
        class="mb-5"
      />
      <h1 class="font-display max-w-4xl text-2xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
        {{ description }}
      </p>
      <slot />
    </div>
  </section>
</template>
