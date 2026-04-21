<script setup lang="ts">
import type { PublicationListItem } from '~/types/api'

const props = withDefaults(defineProps<{
  item: PublicationListItem
  base: '/news' | '/announcements'
  featured?: boolean
  eager?: boolean
}>(), { featured: false, eager: false })

const media = useMedia()
const { locale } = useI18n()
const localePath = useLocalePath()
const href = computed(() => localePath(`${props.base}/${props.item.slug}`))
</script>

<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-default transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
  >
    <div
      class="relative overflow-hidden bg-elevated"
      :class="featured ? 'aspect-[16/10] lg:aspect-auto lg:min-h-80 lg:flex-1' : 'aspect-[16/10]'"
    >
      <img
        v-if="item.mainImagePath"
        :src="media(item.mainImagePath)"
        :alt="item.title"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        decoding="async"
        width="800"
        height="500"
        class="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      >
      <div
        v-else
        class="flex size-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950"
      >
        <img
          src="/pics/logo.webp"
          alt=""
          class="size-16 opacity-40"
          loading="lazy"
        >
      </div>
      <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <time
        :datetime="item.publishedAt"
        class="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-900 shadow-sm backdrop-blur"
      >
        {{ formatDate(item.publishedAt, locale) }}
      </time>
    </div>

    <div
      class="flex flex-col gap-3 p-5"
      :class="featured ? 'lg:p-7' : 'flex-1'"
    >
      <h3
        class="font-display font-bold leading-snug text-highlighted transition-colors group-hover:text-primary"
        :class="featured ? 'text-xl lg:text-2xl line-clamp-3' : 'text-lg line-clamp-2'"
      >
        <NuxtLink
          :to="href"
          class="after:absolute after:inset-0"
        >
          {{ item.title }}
        </NuxtLink>
      </h3>
      <p
        v-if="item.description"
        class="text-sm leading-relaxed text-muted"
        :class="featured ? 'line-clamp-3' : 'line-clamp-2'"
      >
        {{ item.description }}
      </p>
      <div class="mt-auto flex items-center justify-between pt-2 text-xs text-dimmed">
        <span class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-eye"
            class="size-3.5"
          />
          {{ formatNumber(item.views) }}
        </span>
        <span class="flex items-center gap-1 font-semibold text-primary opacity-0 transition-all group-hover:opacity-100">
          {{ $t('content.read_more') }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-3.5"
          />
        </span>
      </div>
    </div>
  </article>
</template>
