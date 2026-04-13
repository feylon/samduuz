<script setup lang="ts">
import type { PublicUsefulLink } from '~/types/api'

const { data: links } = await usePublicFetch<PublicUsefulLink[]>('/useful-links', { default: () => [] })
const media = useMedia()

const loop = computed(() => {
  const items = links.value ?? []
  if (!items.length) return []
  const repeat = 2 * Math.ceil(5 / items.length)
  return Array.from({ length: repeat }, () => items).flat()
})
</script>

<template>
  <section v-if="links?.length" class="overflow-hidden py-16 sm:py-20">
    <div class="container-page">
      <ContentSectionHeading :eyebrow="$t('home.links_eyebrow')" :title="$t('home.links_title')" center />
    </div>

    <div class="marquee group relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--ui-bg)] to-transparent sm:w-40" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--ui-bg)] to-transparent sm:w-40" />
      <ul class="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused] sm:gap-6">
        <li v-for="(link, index) in loop" :key="`${link.id}-${index}`" :aria-hidden="index >= links.length">
          <a
            :href="link.externalLink"
            target="_blank"
            rel="noopener"
            :tabindex="index >= links.length ? -1 : 0"
            class="flex h-24 w-72 items-center gap-4 rounded-2xl border border-default bg-default p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:w-80"
          >
            <img
              :src="media(link.imagePath)"
              :alt="link.name"
              loading="lazy"
              width="56"
              height="56"
              class="size-14 shrink-0 rounded-xl object-contain"
            >
            <span class="text-sm font-semibold leading-snug text-highlighted line-clamp-3">{{ link.name }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  animation: marquee 40s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    flex-wrap: wrap;
    width: auto;
    justify-content: center;
    padding-inline: 1rem;
  }
}
</style>
