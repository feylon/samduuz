<script setup lang="ts">
import type { PublicationListItem } from '~/types/api'

const props = defineProps<{ item: PublicationListItem }>()

const { locale } = useI18n()
const localePath = useLocalePath()
const date = computed(() => new Date(props.item.publishedAt))
const monthShort = computed(() =>
  date.value.toLocaleDateString(locale.value === 'en' ? 'en-GB' : 'ru-RU', { month: 'short' }).replace('.', '')
)
</script>

<template>
  <article class="group relative flex gap-4 rounded-2xl border border-default bg-default p-4 transition-all duration-300 hover:border-secondary/50 hover:shadow-lg sm:gap-5 sm:p-5">
    <time
      :datetime="item.publishedAt"
      class="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 text-white shadow-inner sm:size-18"
    >
      <span class="font-display text-2xl font-extrabold leading-none">{{ date.getDate() }}</span>
      <span class="mt-1 text-[11px] font-medium uppercase tracking-wide text-gold-300">{{ monthShort }}</span>
    </time>
    <div class="min-w-0 flex-1">
      <h3 class="font-display font-bold leading-snug text-highlighted transition-colors line-clamp-2 group-hover:text-primary">
        <NuxtLink :to="localePath(`/announcements/${item.slug}`)" class="after:absolute after:inset-0">
          {{ item.title }}
        </NuxtLink>
      </h3>
      <p v-if="item.description" class="mt-1.5 text-sm text-muted line-clamp-2">
        {{ item.description }}
      </p>
    </div>
    <UIcon
      name="i-lucide-arrow-up-right"
      class="hidden size-5 shrink-0 self-center text-dimmed transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary sm:block"
    />
  </article>
</template>
